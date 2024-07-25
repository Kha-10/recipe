const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decodedValue)=> {
            if(err) {
                return res.status(401).json({msg : 'unaunthanticated'})
            } else {
                next()
            }
        })
    }else {
        return res.status(400).json({msg : 'token need to be provided'})
    }
}

module.exports = authMiddleware;