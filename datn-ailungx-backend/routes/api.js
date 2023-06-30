const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const middlewareController = require('../controllers/middlewareController');
const userControllers = require('../controllers/userControllers');

router.post("/register",authControllers.registerUser);

router.get("/register-confirm/:email/:token", authControllers.registerUserConfirm);

router.post("/login",authControllers.loginUser);

router.post("/refresh", authControllers.requestRefreshToken);

router.post("/logout", middlewareController.verifyToken, authControllers.logoutUser);

router.post("/forgot-password", authControllers.forgotPassword);

router.get("/reset-password/:id/:token", authControllers.resetPassword);

router.post("/reset-password/:id/:token", authControllers.resetPasswordpost);

router.post("/predict", middlewareController.verifyToken, userControllers.predict);

router.post("/savepredict", middlewareController.verifyToken, userControllers.savePredict);

router.post("/deletepredict", middlewareController.verifyToken, userControllers.deletePredict);

router.get("/getallpredict", middlewareController.verifyToken, userControllers.getAllPredict);

router.post("/mailpredict", middlewareController.verifyToken, userControllers.mailPredict);

router.post("/addlabel", middlewareController.verifyTokenandAdminAuth, userControllers.addLabel);

module.exports = router;





