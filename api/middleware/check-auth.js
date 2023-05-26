const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try{
        // Check if the Authorization header is present
        const token  = req.headers.authorization;
        if (!token){
           return res.status(401).json({ message: 'Auth failed' }); 
        } 
       // const token = req.headers.authorization.split(" ")[1]
        
       // Extract the token from the Authorization header
       const splitToken = token.split(' ');
        if(splitToken.length !== 2){
           return res.status(401).json({ message: 'Auth failed' }); 
        }

        // Access the token value
       const decoded = jwt.verify(splitToken[1],  process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(error){
        console.log(error);
        return res.status(401).json({
            message: 'Auth failed' 
        });
    }
    next();
}