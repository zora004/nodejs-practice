const path = require('path')

const express = require('express')

const cors = require('cors')

const authController = require('../controllers/auth')
const is_auth = require('../middleware/is_auth')

const router = express.Router()

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.post('/signup', cors(corsOptions), authController.postSignup)
router.post('/login', cors(corsOptions), authController.postLogin)
router.post('/logout', cors(corsOptions), is_auth, authController.postLogout)
router.post('/reset_password', cors(corsOptions), is_auth, authController.postReset)

module.exports = router