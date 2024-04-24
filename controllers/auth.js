const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')

const User = require('../models/user')

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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() })
    }
    User.findOne({ email: email })
        .then(user => {
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
                            return res.status(200).json({ message: 'login success!' })
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
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() })
    }

    bcrypt
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
}

exports.postRequestReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: err })
        }
        const token = buffer.toString('hex')
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ message: 'no user found.' })
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            })
            .then(result => {
                res.status(200).json({ message: 'token sent to your email.' })
                transporter.sendMail({
                    from: '"C-ONE NOTIFICATION 👻" abaquitacitdls@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: "Password Reset", // Subject line
                    html: `
                        <p>You requested a password reset</p>
                        <p>Token: ${token}</p>
                    `
                })
            })
            .catch(err => {
                const error = new Error(err)
                error.httpStatusCode = 500
                return next(error)
            })
    })
}

exports.postReset = (req, res, next) => {
    const token = req.body.token
    const newPassword = req.body.new_password
    const confirmNewPassword = req.body.confirm_new_password
    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            if (newPassword != confirmNewPassword) {
                return res.status(400).json({ message: 'confirm password did not match.' })
            }
            if (!user) {
                return res.status(400).json({ message: 'no user found for this token.' })
            }
            bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword
                    user.resetToken = undefined
                    user.resetTokenExpiration = undefined
                    return resetUser.save()
                })
                .then(result => {
                    res.status(200).json({ message: 'password reset successful.' })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}