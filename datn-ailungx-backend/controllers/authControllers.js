
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Rftoken = require("../models/Rftoken");
var nodemailer = require('nodemailer');
const VerifyUserToken = require("../models/VerifyUserToken");
const frontend_url = process.env.FRONTEND_URL;
const authControllers = {

    generateRegisterToken: (userEmail) => {
        return jwt.sign({
            id: userEmail
        },
        process.env.JWT_CR_KEY,
        {expiresIn: "10m"}
        )
    },

    //REGISTER
    registerUser: async(req, res) => {
        try {
            const username = await User.findOne({username: req.body.username});
            const email = await User.findOne({email: req.body.email});
            if (username) {
                return res.status(404).json("The username already exists!");
            }
            if (email) {
                return res.status(404).json("The email already exists!")
            }
            const oldTokenEmail = await VerifyUserToken.findOne({email: req.body.email});
            if (oldTokenEmail) {
                const deleteRegisterToken = await VerifyUserToken.findOneAndDelete({email:req.body.email});
            }
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const registerToken = authControllers.generateRegisterToken(req.body.email);
            const newVerifyToken = await new VerifyUserToken({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                token: registerToken
            });
            const userToken = await newVerifyToken.save();
            const link = frontend_url + `/registerconfirm/${userToken.email}/${registerToken}`;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'ailungx.app.bme@gmail.com',
                pass: 'djmjhkqzobadpako'
                }
            });
                
            var mailOptions = {
                from: 'ailungx.app.bme@gmail.com',
                to: req.body.email,
                subject: '[AI Lung-X App] Confirm Your Register!',
                html:
                    `<div>Hello,</div>
                    <div>We are delighted to inform you that your account registration process has been successfully completed. To finalize the registration and activate your account, 
                        please click on the link below:</div>
                    <div><a href=${link}>Click here to confirm your register!</a></div>
                    <br></br>
                    <div>Please note that the link will be valid for a limited period of time. Therefore, make sure to click the link promptly to activate your account.</div>
                    <div>If you have any questions or need assistance, please don't hesitate to contact us via the email address or phone number provided on our contact page.</div>
                    <div>Thank you for registering with us, and we wish you a great experience on our platform!</div>
                    <br></br>
                    <div>Best regards,</div>
                    <b>AI Lung-X App.</b>`
            };
                
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
            return res.status(200).json("Please confirm an mail we've sent to your email!");
        }
            
        catch (err) {
            return res.status(500).json(err);
        }
    },

    registerUserConfirm: async(req, res) => {
        const { email, token } = req.params;
        const oldTokenEmail = await VerifyUserToken.findOne({email: email});
        if (!oldTokenEmail) {
            return res.status(400).json("Check your confirm link again!");
        }
        const verifyDataToken = oldTokenEmail.token;
        if (verifyDataToken != token) {
            return res.res.status(400).json("Check your confirm link again!");
        }
        try {
            const verify = jwt.verify(token, process.env.JWT_CR_KEY);
            //Create a new user
            const newUser = await new User({
                username: oldTokenEmail.username,
                email: oldTokenEmail.email,
                password: oldTokenEmail.password,
            });
            //Save the new user
            const user = await newUser.save();
            const deleteRegisterToken = await VerifyUserToken.findOneAndDelete({token: token});
            return res.status(200).json("Created your account Successfully!");
        } catch (err) {
            const deleteRegisterToken = await VerifyUserToken.findOneAndDelete({token: token});
            return res.status(400).json("Not verify. Please register again!");
        }

    },

    //Generate Access Token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            vipmember: user.vipmember
        },
        process.env.JWT_SKEY,
        {expiresIn: "20s"}
        )
    },
    

    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            vipmember: user.vipmember
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "365d"}
        )
    },

    //LOGIN
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user) {
                return res.status(404).json("The user does not exist!")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json("Wrong password!")

            }
            if (user && validPassword) {
                const accessToken = authControllers.generateAccessToken(user);
                const refreshToken = authControllers.generateRefreshToken(user);

                //Create a new rftoken
                const newRftoken = await new Rftoken({
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                });
                //Save the new rftoken
                const rftoken = await newRftoken.save();
                const {images, password, ...others} = user._doc;
                return res.status(200).json({...others,accessToken,refreshToken});
            }
        } catch (err) {
            return res.status(500).json(err);
        }

    },


    requestRefreshToken: async(req, res) => {
        const token = req.headers.rftoken;
        // const accessToken = req.body.accessToken;
        if (!token) {
            return res.status(401).json("You're not logged in");
        }
        const refreshToken = token.split(" ")[1];
        const rftoken = await Rftoken.findOne({refreshToken: refreshToken});
        if (!rftoken) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
            if (err) {
                return res.status(403).json("Refresh token is not valid");
            }
            else {
                // Tao access token va refresh token moi
                const newAccessToken = authControllers.generateAccessToken(user);
                const newRefreshToken = authControllers.generateRefreshToken(user);
                const newRftoken = await new Rftoken({
                    refreshToken: newRefreshToken,
                    accessToken: newAccessToken,
                });
                //Save the new rftoken
                const saverftoken = await newRftoken.save();
                const deleteRftoken = await Rftoken.findOneAndDelete({refreshToken: refreshToken});
                return res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken});
            }
            
        });

    },

    logoutUser: async (req, res) => {
        const token = req.headers.token;
        const accessToken = token.split(" ")[1];
        const deleteRftoken = await Rftoken.findOneAndDelete({accessToken: accessToken});
        return res.status(200).json("Logout successfully!");
    },

    generateForgotPassToken: (user) => {
        const secretkey = process.env.JWT_FP_KEY + user.password;
        return jwt.sign({
            id: user.id,
            email: user.email
        },
        secretkey,
        {expiresIn: "5m"}
        )
    },


    forgotPassword: async (req, res) => {
        const email = req.body.email;
        try {
            const oldUser = await User.findOne({email: email});
            if (!oldUser) {
                return res.status(409).json("User is not available!");
            }
            const token = authControllers.generateForgotPassToken(oldUser);
            const link = frontend_url + `/resetpassword/${oldUser.id}/${token}`;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'ailungx.app.bme@gmail.com',
                  pass: 'djmjhkqzobadpako'
                }
              });
              
              var mailOptions = {
                from: 'ailungx.app.bme@gmail.com',
                to: email,
                subject: '[AI Lung-X App] Reset Your Password!',
                html:
                    `<div>Hello,</div>
                    <div>We have received a request to reset your account password. To proceed with resetting your password, please click on the link below:</div>
                    <div><a href=${link}>Click here to reset your password!</a></div>
                    <br></br>
                    <div>Please note that the link will expire after a certain period of time for security purposes. Therefore, make sure to click the link promptly to initiate the password reset process.</div>
                    <div>If you did not initiate this password reset request or have any concerns regarding your account, please contact our support team immediately to ensure the security of your account.</div>
                    <div>Thank you for your attention to this matter.</div>
                    <br></br>
                    <div>Best regards,</div>
                    <b>AI Lung-X App.</b>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            return res.status(200).json("A confirm link has been sent to your email!");
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    resetPassword: async (req, res) => {
        const { id, token } = req.params;
        const oldUser = await User.findOne({_id: id});
        if (!oldUser) {
            return res.status(400).json("Invalid link!")
        }
        const secretkey = process.env.JWT_FP_KEY + oldUser.password;
        try {
            const verify = jwt.verify(token, secretkey);
            res.status(200).json("Valid Url!")
        } catch (err) {
            res.status(400).json("Invalid link!");
        }

    },

    resetPasswordpost: async (req, res) => {
        
        const { id, token } = req.params;
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
            
        const oldUser = await User.findOne({_id: id});
        if (!oldUser) {
            return res.status(400).json("Invalid link!")
        }
        if (password != confirm_password) {
            return res.status(403).json("Confirm password is not correct!");
        }
        const secretkey = process.env.JWT_FP_KEY + oldUser.password;
        try {
            const verify = jwt.verify(token, secretkey);
            
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            
            await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                password: encryptedPassword,
                },
            }
            );
            console.log("ok b4");
            res.status(200).json("Password updated successfully!");
        } catch (err) {
            res.status(400).json("Something Went Wrong!");
        }

    }
}
module.exports = authControllers;
