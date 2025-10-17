const errorHandle = (err, req, res, next) =>{
    const statusCode = err.statusCode || 500 
    const message = err.message || 'Ocurrió un error'

    console.error(`[ERROR] ${new Date().toLocaleString()} - ${statusCode} - ${message}`)

    if (err.stack) {
        console.error(err.stack)
    }

    res.status(statusCode).json({
        status: 'Error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && {status: err.stack})
    })

    next()
}


module.exports = errorHandle





