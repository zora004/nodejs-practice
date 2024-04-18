const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "notification@c-one.ph",
        pass: "vrewmttpdqxlkbhu",
    },
})

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'no user found!' })
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        if (!req.session.isLoggedIn) {
                            req.session.user = user
                            req.session.isLoggedIn = true
                            req.session.save(err => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                            res.status(200).json({ message: 'login success!' })
                            return transporter.sendMail({
                                from: '"C-ONE NOTIFICATION 👻" abaquitacitdls@gmail.com', // sender address
                                to: "abaquita04@gmail.com", // list of receivers
                                subject: "Hello ✔", // Subject line
                                text: "Hello world?", // plain text body
                                html: "<b>Hello world?</b>", // html body
                            })
                        }
                        return res.status(400).json({ message: 'already logged in!' })
                    }
                    res.status(400).json({ message: 'password incorrect!' })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
        }
        res.status(200).json({ message: 'logout success!' })
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirm_password = req.body.confirm_password
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.status(409).json({ message: 'user already exist!' })
            }
            if (password != confirm_password) {
                return res.status(400).json({ message: 'password did not match!' })
            }
            return bcrypt
                .hash(password, 12)
                .then(hashPassword => {
                    const user = new User({
                        email: email,
                        password: hashPassword,
                        cart: { items: [] }
                    })
                    return user.save()
                })
                .then(result => {
                    res.status(201).json({ message: 'registration success!' })
                    return transporter.sendMail({
                        from: '"C-ONE NOTIFICATION 👻" abaquitacitdls@gmail.com', // sender address
                        to: "abaquita04@gmail.com", // list of receivers
                        subject: "Hello ✔", // Subject line
                        html: "<b>Your registration is successfull!</b>", // html body
                    })
                })
                .catch(err => {
                    console.log(err)
                })

        })
        .catch(err => {
            console.log(err)
        })
}

exports.postReset = (req, res, next) => {
    
}