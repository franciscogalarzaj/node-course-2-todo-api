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

/*     db.collection('Todos').deleteMany({
        text: 'Walk the dog',
        completed: false
    }).then((result) => {
        console.log('Great success!' + result);        
    }); */

/*     db.collection('Todos').deleteOne({
        text: 'Eat lunch'
    }).then((result) => {
        console.log('Great success!' + result);        
    });  */

/*     db.collection('Todos').findOneAndDelete({
        text: 'Walk the dog'
    }).then((result) => {
        console.log(result);                
    }); 
 */

    db.collection('Todos').findOneAndDelete({
        text: 'Walk the dog'
    }).then((result) => {
        console.log(result);                
    }); 

    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });

    //db.close();
});