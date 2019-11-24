var firebase = require("firebase/app");
require('dotenv').config();
require("firebase/firestore");

var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "graphql-tutorial-f8ee7.firebaseapp.com",
    databaseURL: "https://graphql-tutorial-f8ee7.firebaseio.com",
    projectId: "graphql-tutorial-f8ee7",
    storageBucket: "graphql-tutorial-f8ee7.appspot.com",
    messagingSenderId: "458750550582",
    appId: "1:458750550582:web:601240c8c8c11ea2076e97"
}

firebase.initializeApp(firebaseConfig);

module.exports = firebase.firestore();
