const fs = require('fs');

const errorHandler = (err, req, res, next) => {
    try {
        fs.appendFileSync('error.log', new Date().toISOString() + ': ' + err.stack + '\n\n');
    } catch(e) {}
    
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
