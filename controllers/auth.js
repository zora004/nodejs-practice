const User = require('../models/user')

exports.postLogin = (req, res, next) => {
    User.findById('661cd7693993164197d617e6')
        .then(user => {
            if (!user) {
                console.log('No user found!')
            } else {
                req.session.user = user
                req.session.isLoggedIn = true
                req.session.save(err => {
                    if (err) {
                        console.log(err)
                    }
                    res.status(200).json({ message: 'login success!' })
                })
            }
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