const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()

const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findById('661cd7693993164197d617e6')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => {
            console.log(err)
        })
})

app.use(authRoutes)
app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb+srv://zora:cEGbb0mhdxrLDzAs@atlascluster.q3vd528.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Zora',
                    email: 'zora@gmail',
                    cart: {
                        items: []
                    }
                })
                user.save()
            }
        })
        app.listen(3000)
    })
    .catch(err => { console.log(err) })