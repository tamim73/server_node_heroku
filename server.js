const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(bodyparser.json());


var db = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});



//midware
app.use(cors());



//.........root
app.get('/', (req, res) => {
    res.json("home")
})

//.........signin
app.post('/signin', (req, res) => {
    res.json("signing...")
})
//!......... register 
app.post('/register', (req, res) => {
    db('login')
    .insert(req.body)
    .returning('*')
    .then(emp => {
        res.json(emp[0]);
    })
    .catch(err => res.status(400).json('cant register'))
})

//!.........deparments
app.get('/deps/all', (req, res) => {
    db.select().from('departments').then(data => res.json(data))
})

app.get('/deps/:id', (req, res) => {
    const { id } = req.params;
    db.select().from('departments').where({ id }) // same as where ({id:id})
        .then(emp => {
            if (emp.length) {
                res.json(emp[0])
            } else {
                res.status(400).json('department not found')
            }
        })
        .catch(err => res.status(400).json('error getting department'))
})

app.post('/deps', (req, res) => {
    db('departments')
    .insert(req.body)
    .returning('*')
    .then(emp => {
        res.json(emp[0]);
    })
    .catch(err => res.status(400).json('cant add department'))
})

app.put('/deps/:id', (req, res) => {
    const { id } = req.params;
    db('departments').where({ id })
        .update(req.body)
        .returning('*')
        .then(emp => {
             if (emp.length) {
                res.json(emp[0])
            } else {
                res.status(400).json('department not found')
            }
        })
        .catch(err => res.status(400).json('cant update department'))
})

app.delete('/deps/:id', (req, res) => {
    const { id } = req.params;
    db('departments').where({ id })
        .del()
        .returning('*')
        .then(emp => {
            if (emp.length) {
                res.json(emp[0])
            } else {
                res.status(400).json('department not found')
            }
        })
        .catch(err => res.status(400).json('cant delete department'))
})
//!.........employees
app.get('/emps/all', (req, res) => {
    db.select().from('employees').then(data => res.json(data))
})

app.post('/emps', (req, res) => {
    db('employees')
    .insert(req.body)
    .returning('*')
    .then(emp => {
        res.json(emp[0]);
    })
    .catch(err => res.status(400).json('cant add employee'))
})

app.get('/emps/:id', (req, res) => {
    const { id } = req.params;
    db.select().from('employees').where({ id }) // same as where ({id:id})
        .then(emp => {
            if (emp.length) {
                res.json(emp[0])
            } else {
                res.status(400).json('employee not found')
            }
        })
        .catch(err => res.status(400).json('error getting employee'))
})



app.put('/emps/:id', (req, res) => {
    const { id } = req.params;
    db('employees').where({ id })
        .update(req.body)
        .returning('*')
        .then(emp => {
             if (emp.length) {
                res.json(emp[0])
            } else {
                res.status(400).json('employee not found')
            }
        })
        .catch(err => res.status(400).json('cant update employee'))
})

app.delete('/emps/:id', (req, res) => {
    const { id } = req.params;
    db('employees').where({ id })
        .del()
        .returning('*')
        .then(emp => {
            if (emp.length) {
                res.json(emp[0])
            } else {
                res.status(400).json('employee not found')
            }
        })
        .catch(err => res.status(400).json('cant delete employee'))
})



app.listen(process.env.PORT || 3000);