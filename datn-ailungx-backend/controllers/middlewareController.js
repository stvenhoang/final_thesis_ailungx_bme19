const jwt = require('jsonwebtoken');

const middlewareController = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_SKEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid!");
                }
                else {
                    req.user = user;
                    console.log(req.user);
                    next();
                }
            });
        }
        else {  return res.status(401).json("Token not attached!");    }
    },
    //verifyToken and Doctor Auth
    verifyTokenandAdminAuth: (req, res, next) => {
        middlewareController.verifyToken (req, res, () => {
            if(req.user.vipmember){
                next(); 
            }
            else {  return res.status(403).json("You do not have permission to do this!");  }
        });
    },
}

module.exports = middlewareController;


