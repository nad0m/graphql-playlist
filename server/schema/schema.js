const graphql = require('graphql');
const { BookCollection, AuthorCollection } = require('../models/collections');
const _ = require('lodash');
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList
} = graphql;

const {
    getDoc,
    addDoc,
    getCollection
} = require('./actions');


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, {id: parent.authorId});
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter((book) => book.authorId === parent.id);
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve: async (parent, args) => {
                const author = await addDoc(AuthorCollection, args);
                return author;
            }
        },
        addBooks: {
            type: BookType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString}
            },
            resolve: async (parent, args) => {
                const book = await addDoc(BookCollection, args);
                return book;
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        books: {
            type: new GraphQLList(BookType),
            args: {
                first: {type: GraphQLInt}
            },
            resolve: async (parent, args) => {
                const books = await getCollection(BookCollection);
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: async (parent, args) => {
                const authors = await getCollection(AuthorCollection);
                return authors;
            }
        },
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // code to get data from db
                return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {

                return _.find(authors, {id: args.id});
            }
        }
    }
});

// dummy data
var books = [
    {name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '1'},
    {name: 'Final Empire', genre: 'Fantasy', id: '2', authorId: '2'},
    {name: 'The Long Earth', genre: 'Fantasy', id: '3', authorId: '3'},
    {name: 'Name of the wind 2', genre: 'Fantasy', id: '5', authorId: '1'},
    {name: 'Final Empire 2', genre: 'Fantasy', id: '4', authorId: '2'},
    {name: 'The Long Earth 2', genre: 'Fantasy', id: '9', authorId: '3'},
    {name: 'Name of the wind 3', genre: 'Fantasy', id: '6', authorId: '1'},
    {name: 'Final Empire 3', genre: 'Fantasy', id: '0', authorId: '2'},
    {name: 'The Long Earth 3', genre: 'Fantasy', id: '7', authorId: '3'}
];

// dummy data
var authors = [
    {name: 'Patrick Rothfuss', age: 44, id: '1'},
    {name: 'Brandon Sanderson', age: 42, id: '2'},
    {name: 'Terry Pratchett', age: 66, id: '3'}
];

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});