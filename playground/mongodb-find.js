//const MongoClient = require('mongodb').MongoClient;
const{MongoClient, ObjectID}  = require('mongodb');
const yargs = require('yargs');

const argv = yargs.options({
    n: {
        alias: 'name',
        string: 'true'
    }
}).argv;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        return console.log('Unable to connect to MongoDB server');        
    }
    console.log('Connected to MongoDB server');
    
/*     db.collection('Todos').find({
        _id: new ObjectID('5bda3f9ee858c89559b48e57')
    }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));               
    }).catch((err) => {
        console.log('Unable to fetch Todos', err);        
    }); */

/*     db.collection('Todos').find().count().then((count) => {
        console.log('Todos found: ' + count);               
    }).catch((err) => {
        console.log('Unable to fetch Todos', err);        
    }); */

    db.collection('Users').find({
        name: argv.name
    }).toArray().then((docs) => {
        if (docs.length === 0) {
            return console.log('No user found');            
        }
        console.log(JSON.stringify(docs, undefined, 2));               
    }).catch((err) => {
        console.log('Unable to fetch Users', err);        
    }); 

    //db.close();
});