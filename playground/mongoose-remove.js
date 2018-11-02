const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

/* Todo.remove({}).then((result) => {
    console.log(result);
});
 */

Todo.findByIdAndRemove('5bdab7e79777c56a899ef864').then((todo) => {
    console.log(todo);    
});