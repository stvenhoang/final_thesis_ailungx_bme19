const User = require("../models/User");
var nodemailer = require('nodemailer');
const fs = require("fs");
const axios = require('axios');
const NewLabel = require("../models/NewLabel");
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration 
cloudinary.config({
    cloud_name: process.env.CloudDinary_CloudName,
    api_key: process.env.CloudDinary_APIKEY,
    api_secret: process.env.CloudDinary_APISecret
});

const userControllers = {
    getAllPredict: async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id});
            console.log("Get ok");
            const {_id,email,password, ...others} = user._doc;
            // console.log({...others});
            return res.status(200).json({...others});
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    predict: async (req, res) => {
        try {
            const filter = {_id: req.user.id};
            const imgb64 = {
                imgb64: req.body.imgb64
            }
            console.log("Prediction started");
            const api = await axios.post("http://modelapi:9000/predict", imgb64)
                    .then(async (response) => {
                        const message = response.data.predict_result;
                        const imgheatmap = response.data.heatmap_image;
                        console.log(message);
                        const numPredict = await User.findOne(filter, {"numpredict":1});
                        const predict_id = numPredict.numpredict;
                        const imgb64be = req.body.imgb64;
                        return res.status(200).json({message, predict_id, imgb64be, imgheatmap});
                    })
                    .catch((err) => {
                        return res.status(500).json(err);
                    });     
        } catch (err) {
            return res.status(500).json(err);
        }
        
    },

    uploadImageCloudinary: async (userid, folder, imageFile) => {
        try {
            const result = await cloudinary.uploader.upload( imageFile, {
                public_id:`${Date.now()}`+`-`+ `${userid}`,
                resource_type: 'auto',
                folder: folder,
            });
      
            return result.secure_url;
        } catch (error) {
            console.log(error);
            return "Cloudinary Error";
        }
    },

    savePredict: async (req, res) => {
        try {
            const filter = {_id: req.user.id};

            const folderNameOriginal = `FinalthesisImages/${req.user.id}/original`;
            const folderNameHeatmap = `FinalthesisImages/${req.user.id}/heatmap`;
            const base64ImageOriginal = 'data:image/jpeg;base64,' + req.body.image;
            const base64ImageHeatmap = 'data:image/jpeg;base64,' + req.body.imageheatmap;
            const originalImageUrl = await userControllers.uploadImageCloudinary(req.user.id, folderNameOriginal, base64ImageOriginal);
            const heatmapImageUrl = await userControllers.uploadImageCloudinary(req.user.id, folderNameHeatmap, base64ImageHeatmap);

            if (originalImageUrl == "Cloudinary Error"|| heatmapImageUrl == "Cloudinary Error") {
                return res.status(404).json("Cloudinary Error");
            }
            const newValue = { $push: { images : {"predict_id": req.body.predict_id, "image_id": req.body.image_id, "age": req.body.age , "gender": req.body.gender, "patientemail": req.body.patientemail, "image": originalImageUrl, "predict": req.body.predict, "imageheatmap": heatmapImageUrl, "conclusion": req.body.conclusion, "time": req.body.time }} };
            const newPredictID = { $set: {numpredict: req.body.predict_id + 1}};
            const update1 = await User.updateOne(filter, newValue);
            const update2 = await User.updateOne(filter, newPredictID);
            return res.status(200).json("Save predition successfully!")
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    deleteImageCloudinary: async (imageUrl) => {
        try {
          const urlArray = cloudinary.url(imageUrl).split("/");
          const publicId = urlArray[urlArray.length - 4] + "/" + urlArray[urlArray.length - 3] + "/" + urlArray[urlArray.length - 2] + "/" + urlArray[urlArray.length - 1].split('.')[0];
          const result = await cloudinary.uploader.destroy(publicId);
          return result.result === 'ok';
        } catch (error) {
          return false;
        }
    },

    deletePredict: async (req, res) => {
        try {
            const filter = {_id: req.user.id};
            const newValue = { $pull: { images : {"predict_id": req.body.predict_id}} };
            const multi = {multi: true};
            const updateDelete = await User.updateOne(filter, newValue, multi);
            console.log("ok1");
            await userControllers.deleteImageCloudinary(req.body.image).then((res) => {
                if (!res) {
                    return res.status(400).json("Can't delete image in cloudinary!");
                }
            })
            await userControllers.deleteImageCloudinary(req.body.imageheatmap).then((res) => {
                if (!res) {
                    return res.status(400).json("Can't delete image in cloudinary!");
                }
            })
            return res.status(200).json("Delete predition successfully!");
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    mailPredict: async (req, res) => {
        try {
            const idname = req.user.id;
            const user = await User.findOne({_id: idname});
            const senderEmail = user.email;
            const title = req.body.title;
            const email = req.body.email;
            const text = req.body.text;
            const name = req.body.name;
            const age = req.body.age;
            const gender = req.body.gender;
            const result = req.body.result;
            const image = req.body.image;
            const conclusion = req.body.conclusion;
            
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
                subject: title,
                html: ` <h3>This is the predicted result obtained through the AI - LungX application by a user who provided information and used the chest X-ray imaging service. If not applicable, please disregard this email. Below is your diagnostic result:</h3>
                        <div></div>
                        <br></br>
                        <div>Name: ${name}</div>
                        <div>Age: ${age}</div>
                        <div>Gender: ${gender}</div>
                        <div>Result: ${result}</div>
                        <div>Doctor's conclusion: ${conclusion}</div>
                        <div>Message: ${text}</div>
                        <div><a href=${image}>Click here to get your xray image.</a></div>
                        <br></br>
                        <b>This email was sent by: ${senderEmail}</b>
                        <br></br>
                        <b>Developed by AI - LungX App.</b>`,
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            
            res.status(200).json("An email has been sent to patient!");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    addLabel: async (req, res) => {
        try {
            const folderNameNewLabel = `FinalthesisImages/${req.user.id}/newlabel`;
            const base64ImageNewLabel = 'data:image/jpeg;base64,' + req.body.image;
            const newLabelImageUrl = await userControllers.uploadImageCloudinary(req.user.id, folderNameNewLabel, base64ImageNewLabel);
            if (newLabelImageUrl == "Cloudinary Error") {
                return res.status(404).json("Cloudinary Error");
            }
            //Create a new image label
            const newImageLabel = await new NewLabel({
                username: req.body.username,
                email: req.body.email,
                image: newLabelImageUrl,
                label: req.body.label
            });
            //Save the new image label
            const newLabel = await newImageLabel.save();
            return res.status(200).json("Added label successfully!")
        } catch (err) {
            res.status(500).json(err);
        }
    }

}

module.exports = userControllers;
