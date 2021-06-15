const firebase = require('firebase')


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD8PEzdBZ-8NA_uV555Tu7l7CtDc4z4arY",
    authDomain: "swiftgas-65014.firebaseapp.com",
    projectId: "swiftgas-65014",
    storageBucket: "swiftgas-65014.appspot.com",
    messagingSenderId: "650675477770",
    appId: "1:650675477770:web:745c357f841c95af012ef3",
    measurementId: "G-YKZW9PQCF8"
});



const db = firebaseApp.firestore();
module.exports = db;

 