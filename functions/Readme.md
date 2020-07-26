## Create a utils directory in the functions directory
- create a admin.js file in the format </br>

var admin = require("firebase-admin");

var serviceAccount = require("path to json file");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "db url",
  storageBucket: "storage bucket url",

});

const db = admin.firestore();

module.exports = {db , admin}


- create a config.js file in the same directory in format

module.exports =  {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""

}


## To start the server locally
- npm install
- firebase serve --project <project-name>

## To deploy to the cloud
- firebase deploy --project <project-name>