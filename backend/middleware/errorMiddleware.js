//middleware has functions that get executed during the response
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack //if stack:process.env,NODE_ENV value  is equal to production  show null else show stack
    })
}

module.exports = {
    errorHandler,
}