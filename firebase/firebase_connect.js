const firebase = require('firebase')


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDRtR2dTP3DQnMEDIPNTiyj_wrnmtbr168",
    authDomain: "chapchapgas-2d104.firebaseapp.com",
    databaseURL: "https://chapchapgas-2d104.firebaseio.com",
    projectId: "chapchapgas-2d104",
    storageBucket: "chapchapgas-2d104.appspot.com",
    messagingSenderId: "706742017410",
    appId: "1:706742017410:web:281eaf8dda6621a43e039b",
    measurementId: "G-9FLZ4NS6F9"
});



const db = firebaseApp.firestore();
module.exports = db;

 