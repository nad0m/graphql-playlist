const db = require('./firebase');

module.exports = {
    BookCollection: db.collection("books"),
    AuthorCollection: db.collection("authors")
}