const express = require('express')

require('dotenv').config()

const morgan = require('morgan')

const recipieRoutes = require('./routes/recipes')

const categoryRoutes = require('./routes/category')

const userRoutes = require('./routes/users')

const mongoose = require('mongoose')

const cors = require ('cors')

const cookieParser = require('cookie-parser')

const app = express ()

app.use(cors())

const mongoURL = 'mongodb+srv://kha:test1234@mern-claster.75d8eo2.mongodb.net/?retryWrites=true&w=majority&appName=mern-claster'

mongoose.connect(mongoURL).then(()=> {
    console.log('connected to db');
    app.listen(process.env.PORT,()=> {
        console.log('server is running on port ' + process.env.PORT);
    })
    
})

app.use(express.json())

app.use(morgan('dev'))

app.use(morgan('dev'))

app.use(cookieParser())

app.get('/',(req,res)=> {
    res.json({hello : 'world'})
})

app.use('/api/recipes',recipieRoutes)

app.use('/api/categories',categoryRoutes)

app.use('/api/users',userRoutes)

app.get('/cookie',(req,res)=> {
    res.cookie('gg','wp',{httpOnly : true})
    return res.send('ggwp')
})

app.get('/get-cookie',(req,res)=> {
    let cookies = req.cookies
    return res.send(cookies)
})