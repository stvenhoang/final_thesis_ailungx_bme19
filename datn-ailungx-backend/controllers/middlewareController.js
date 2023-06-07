const jwt = require('jsonwebtoken');

const middlewareController = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_SKEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token không đúng");
                }
                else {
                    req.user = user;
                    console.log(req.user);
                    next();
                }
                
            });
        }
        else {
            return res.status(401).json("Chưa có Token");
        }
    },

    verifyTokenandAdminAuth: (req, res, next) => {
        middlewareController.verifyToken (req, res, () => {
            if(req.user.id == req.params.id || req.user.vipmember){
                next(); 
            }
            else {
                return res.status(403).json("Không thể xóa người này");
            }
        })
    },
}

module.exports = middlewareController;