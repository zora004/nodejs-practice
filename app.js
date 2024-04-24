const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const multer = require('multer')
const moment = require('moment')

const errorController = require('./controllers/error')
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://zora:cEGbb0mhdxrLDzAs@atlascluster.q3vd528.mongodb.net/shop?retryWrites=true&w=majority'

const app = express()
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})
const csrfProtection = csrf()

const formattedDate = moment().format('YYYY-MM-DD-HH-mm-ss')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, formattedDate + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images'))) // PARA MAKITA ANG MGA IMAGE
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
// app.use(csrfProtection)

// app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.session.isLoggedIn
//     res.locals.csrfToken = req.csrfToken()
//     next()
// })

app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user
            next()
        })
        .catch(err => {
            next(new Error(err))
        })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)
app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).json({ message: 'Internal server error, please try again later.' })
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000, function () {
            console.log('CORS-enabled web server listening on port 3000')
        })
    })
    .catch(err => { console.log(err) })