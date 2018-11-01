const express = require('express');
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user')

var app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    console.log(req.body);    
    var todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc);    
    }).catch((err) => {
        res.status(400).send(err);  
    })
})

app.listen(3000,() => {
    console.log('Started on port 3000');    
})