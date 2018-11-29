const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(bodyparser.json());


var db = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL|| 'postgres://nncldsyuqxicbq:91b70146100afed46629f1ce10bbabba3289ac7086811b318115478e3cd02e3e@ec2-54-243-147-162.compute-1.amazonaws.com:5432/df524f83132njv',
        ssl: true,
    }
});



//midware
app.use(cors());

function verifyToken(req,res,next){
    if (!req.headers.authorization){
        return res.status(401).send('Unauthorized request, sent from server verifyToken method')
    }
    let token = req.headers.authorization.split(' ')[1]
    if ( token === 'null') {
        return res.status(401).send('Unauthorized request, sent from server verifyToken method')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload) {
        return res.status(401).send('Unauthorized request, sent from server verifyToken method')
    }
    req.userId = payload.subject
    next()
}

//.........root
app.get('/', (req, res) => {
    res.json("home")
})

//.........token verify
app.post('/v', (req, res) => {
    const {token} = req.body
    const payload = jwt.verify(token, 'secretKey' )
    console.log(payload);
    if (!payload) {
        return res.status(401).send(false)
    }
    res.status(200).send(true)
})
//.........signin
app.post('/signin', (req, res) => {
    const   {email,hash} = req.body
    db('login').where({email})
    .then(user => {
        user = user[0]
        console.log(user);
        if (!user){
            res.status(401).json('Invalid email')
        } else {
            if (user.hash!==hash) {
                res.status(401).json('Invalid password')
            } else {
                let payload = { subject: user.id }
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token})
            }
        }
    })
    .catch(err=> res.status(400).json('cannot login'))
})
//!......... register 
app.post('/register', (req, res) => {
    db('login')
    .insert(req.body)
    .returning('*')
    .then(user => {
        let payload = { subject: user.id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token});
    })
    .catch(err => res.status(400).send('cannot register'))
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



app.listen(process.env.PORT || 3000, ()=>{
    console.log('server is running');
});