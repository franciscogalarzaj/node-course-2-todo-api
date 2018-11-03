const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create new todo', (done) => {
        var text = 'things to do';

        request(app)
            .post('/todos')
            .send({text})
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => done(e));
            })
    })

    it('should not create todo wit invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e));
            }) 
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    })
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    
    it('should not return todo doc created from other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-onjects id', (done) => {
        request(app)
            .get(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);                    
                });
            });
    });

    it('should not delete todo doc from other user', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => {
                    done(e);                    
                });
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-onjects id', (done) => {
        request(app)
            .delete(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'new text for test';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
            text,
            completed: true
            })
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toBeA('number');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should not update a todo from other user', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'new text for test';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
            text,
            completed: true
            })
            .expect(404)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toNotBe(text);
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBeUndefined;
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'new text for test2';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
            text,
            completed: false
            })
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {     
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
                expect(res.body._id).toBe(users[0]._id.toHexString());
            })
            .end(done);
    })

    it('should return 401 if not authenticated', (done) => {     
        request(app)
            .get('/users/me')
            .set('x-auth', '')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })
});

describe('POST /users',() => {
    it('should create new user if valid',(done) => {
        var user = {
            email: 'test1@test.com',
            password: 'testpassword'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(user.email);
                expect(res.body._id).toExist();
                expect(res.header['x-auth']).toExist();
            })
            .end(done);
    });

    it('should return validation errors if request is invalid',(done) => {
        var user = {
            email: 'test2@test.com',
            password: ''
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end(done);
    });

    it('should not create user if user in use',(done) => {
        var user = {
            email: 'example1@example.com',
            password: 'testpassword'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send(users[1])
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token:res.header['x-auth']});
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should return invalid login', (done) => {
        var user = {
            email: users[1].email,
            password: 'wrongpassword'
        }
        
        request(app)
            .post('/users/login')
            .send(user)
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should logged out when token exist', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens[0]).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });
});