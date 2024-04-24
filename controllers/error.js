exports.get404 = (req, res, next) => {
    res.status(404).json({ message: 'Page not found!' })
}

exports.get500 = (req, res, next) => {
    res.status(500).json({ message: 'database operation failed, please try again!' })
}