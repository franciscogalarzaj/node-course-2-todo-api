const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

id = '5bda705fa9694f341ea0e4e5';

/* if (ObjectID.isValid(id)) {
    console.log('Id not valid');    
} */

/* Todo.find({
    _id: id
}).then((todos) => {
    console.log(todos[0]._doc);    
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log(todo._doc);    
}); */

/* Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id not found');        
    }
    console.log(todo._doc);    
}).catch((e) => {
    console.log(e);    
}); */

User.findById(id).then((user) => {
    if (!user) {
        return console.log('Id not found');        
    }
    console.log(user._doc);    
}).catch((e) => {
    console.log(e);    
});