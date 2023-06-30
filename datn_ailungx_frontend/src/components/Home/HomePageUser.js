import { createAxiosJWT } from "../../createAxiosJWT";
import "./HomePageUser.css";
import {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const HomePageUser = () => {
    const [base64img, setBase64img] = useState(null);
    const [previewimg, setPreviewimg] = useState(null);
    const [predictid, setPredictid] = useState(null);
    const [predictresult, setPredictresult] = useState(null);
    const [predictimgb64, setPredictimgb64] = useState(null);
    const [pressPredict, setPressPredict] = useState(null);
    const [predictHeatmapimg, setPredictHeatmapimg] = useState(null);
    const [predictErr, setPredictErr] = useState(null);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const doctor = user?.vipmember;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxiosJWT(user, dispatch);
    const accessToken = user?.accessToken;

    useEffect(() => {

        return () => {
            URL.revokeObjectURL(previewimg?.preview);
            
        }
    }, [previewimg]);
    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        file.preview = URL.createObjectURL(file);  
        setBase64img(base64);
        setPreviewimg(file);
        setPressPredict(null);
        setPredictresult(null);
        setPredictErr(null);
        
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);

            };
            fileReader.onerror = (err) => {
                reject(err);
            };
        });
    };

    async function predict(axiosJWT, accessToken, base64body) {
        try {
            const res = await axiosJWT.post("/api/predict", base64body, {
                headers: {token: `Bearer ${accessToken}`},});
                return res;
        } catch (err) {
            setPredictErr("An error occurred during the prediction process.");
        }
        
    }

    const handlePredict = async (e) => {
        
        e.preventDefault();
        setPressPredict(1);
        // Convert true Base64
        const checkpng = base64img.includes("data:image/png;base64,");
        const checkjpg = base64img.includes("data:image/jpeg;base64,");
        let base64imgdone = "";
        if (checkpng) {
            base64imgdone = await base64img.slice(22);
        } else
        if (checkjpg) {
            base64imgdone = await base64img.slice(23);
        }
        else {console.log("Khong ho tro");}
        
        const base64body = {
            imgb64 : base64imgdone
        };
        
        predict(axiosJWT, accessToken, base64body).then((res) => {
            setPredictresult(res.data.message);
            setPredictid(res.data.predict_id);
            setPredictimgb64(res.data.imgb64be);
            setPredictHeatmapimg(res.data.imgheatmap);
        });
    }

    const handleSavePredict = (e) => {
        e.preventDefault();
        navigate("/savepredict", {
            state: {
                predict: predictresult,
                image: predictimgb64,
                predict_id: predictid,
                imageheatmap: predictHeatmapimg,
            },
        });
    }

    const handleAddLabel = (e) => {
        e.preventDefault();
        navigate("/addlabel");
    };

    
    return (
        <section className="home-predict-container">
            <div className="home-predict-upload-container">
                <div className="home-predict-upload-container2">
                    <div className="home-predict-title">Predict your Xray image</div>
                    <label class="custom-file-upload">
                        <span id="upload-icon" class="material-symbols-outlined">upload_file</span>
                        <input type="file" onChange={(e) => {
                                uploadImage(e);}}></input>
                        Upload Image
                    </label>
                    {doctor && (<div className="home-addlabel" onClick={handleAddLabel} >Add label</div>)}
                </div>
                <img className="home-predict-upload-img" src="https://i.ibb.co/25dzcXr/Artboard-2.png" alt="Predictimg"></img>
                
            </div>
            { base64img && (
                <>
                    <div className="home-predict-result-container">
                        
                        <div className="home-predict-result-container1">
                            <div className="home-predict-result-container2">
                                <div className="home-predict-img-title" >Original</div>
                                <img className="home-predict-img" src={previewimg.preview} alt="Predictimg"></img>
                            </div>
                            { predictresult && (
                                <div className="home-predict-result-line"></div>
                            )}
                            { predictresult && (
                                <div className="home-predict-result-container2">
                                    <div className="home-predict-img-title">GradientCam</div>
                                    <img className="home-predict-img" src={`data:image/jpeg;base64,${predictHeatmapimg}`} alt="Predictimg_heatmap"></img>
                                </div>
                                
                            )}
                        </div>
                    </div>
                    {pressPredict && !predictresult && !predictErr &&(
                        <div className="home-predict-loading">Loading...</div>
                    )}
                    {predictErr && (
                        <div className="home-predict-error">{predictErr}</div>
                    )}
                    { predictresult && (
                        <div className="home-predict-result-container3">
                            <div className="home-predict-result-title">Result</div>
                            <div className="home-predict-result">{predictresult}</div> 
                        </div>)}
                    { predictresult ? (<button className="home-predict-btn-save" onClick={handleSavePredict}>Save</button>):(
                        <button className="home-predict-btn-predict" onClick={handlePredict}>Predict</button>
                    )}
                    
                    
                </>
            )}
        </section>
    );
}
 
export default HomePageUser;