const graphql = require('graphql');
const { BookCollection, AuthorCollection } = require('../models/collections');
const _ = require('lodash');
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
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
            resolve: async (parent, args) => {
                return await getDoc(AuthorCollection, parent.authorId);
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
            resolve: async (parent, args) => {
                const books = await getCollection(BookCollection);
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
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (parent, args) => {
                const author = await addDoc(AuthorCollection, args);
                return author;
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
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
            resolve: async (parent, args) => {
                // code to get data from db
                return getDoc(BookCollection, args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return getDoc(AuthorCollection, args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});