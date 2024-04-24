const path = require('path')

const express = require('express')
const { check } = require('express-validator')

const cors = require('cors')

const authController = require('../controllers/auth')
const User = require('../models/user')
const is_auth = require('../middleware/is_auth')

const router = express.Router()

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.post(
    '/signup',
    cors(corsOptions),
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('user already exist!')
                        }
                    })
            })
            .normalizeEmail(),
        check('password', 'please enter a password with only numbers and text and at least 5 characters. ')
            .isLength({ min: 5 })
            .isAlphanumeric(),
        check('confirm_password')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password have to match!')
                }
                return true
            })
    ],
    authController.postSignup
)
router.post(
    '/login',
    cors(corsOptions),
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (!userDoc) {
                            return Promise.reject('no user found!')
                        }
                    })
            })
            .normalizeEmail(),
        check('password', 'please enter a password with only numbers and text and at least 5 characters. ')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
    ],
    authController.postLogin
)
router.post('/logout', cors(corsOptions), is_auth, authController.postLogout)
router.post('/request_reset', cors(corsOptions), authController.postRequestReset)
router.post('/reset_password', cors(corsOptions), authController.postReset)

module.exports = router