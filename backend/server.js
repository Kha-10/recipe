const express = require('express')

require('dotenv').config()

const morgan = require('morgan')

const recipieRoutes = require('./routes/recipes')

const mongoose = require('mongoose')

const app = express ()

const mongoURL = 'mongodb+srv://kha:test1234@mern-claster.75d8eo2.mongodb.net/?retryWrites=true&w=majority&appName=mern-claster'

mongoose.connect(mongoURL).then(()=> {
    console.log('connected to db');
    app.listen(process.env.PORT,()=> {
        console.log('server is running on port ' + process.env.PORT);
    })
    
})

app.use(express.json())

app.use(morgan('dev'))

app.get('/',(req,res)=> {
    res.json({hello : 'world'})
})

app.use('/api/recipes',recipieRoutes)