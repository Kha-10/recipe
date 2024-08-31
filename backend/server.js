const express = require('express')

require('dotenv').config()

const morgan = require('morgan')

const recipieRoutes = require('./routes/recipes')

const categoryRoutes = require('./routes/category')

const userRoutes = require('./routes/users')

const optionGroupRoutes = require('./routes/optionGroup')

const mongoose = require('mongoose')

const cors = require ('cors')

const cookieParser = require('cookie-parser')

const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')

const authMiddleware = require('./middlewares/authMiddleware')
const sendEmail = require('./helpers/sendEmail')

const app = express ()

const s3 = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
  })

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString()+'-'+file.originalname)
      }
    })
  })

app.use(express.static('public'))

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))

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

app.set('views','./views');
app.set('view engine','ejs');

app.get('/',(req,res)=> {
    return res.json({hello : 'world'})
    // return res.render('email')
})

app.use('/api/recipes',authMiddleware,recipieRoutes)

app.use('/api/categories',authMiddleware,categoryRoutes)

app.use('/api/optionGroups',authMiddleware,optionGroupRoutes)

app.use('/api/users',userRoutes)

app.get('/cookie',(req,res)=> {
    res.cookie('gg','wp',{httpOnly : true})
    return res.send('ggwp')
})

app.get('/get-cookie',(req,res)=> {
    let cookies = req.cookies
    return res.send(cookies)
})

app.get('/send-email',async(req,res)=> {
      try {
        await sendEmail({
            viewFilename : 'email',
            data : {
                name : 'KHA'
            },
            from : 'Emerald@gmail.com',
            to : 'kha@gmail.com'
          })
        return res.status(200).send('email sent')
      } catch (error) {
        return res.status(500).json({msg : error.message})
      }
})

app.post('/upload', upload.single('photo'), function(req, res, next) {
    console.log(req.file);
    return res.status(200).send(req.file);
  })