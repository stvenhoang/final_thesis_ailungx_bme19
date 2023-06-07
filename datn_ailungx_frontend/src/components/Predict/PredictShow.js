import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAxiosJWT } from "../../createAxiosJWT";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./PredictShow.css"
const PredictShow = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxiosJWT(user, dispatch);

    const predict_id = location.state?.predict_id;
    const image_id = location.state?.image_id;
    const age = location.state?.age;
    const gender = location.state?.gender;
    const patientemail = location.state?.patientemail;
    const image = location.state?.image;
    const predict = location.state?.predict;
    const imageheatmap = location.state?.imageheatmap;
    const conclusion = location.state?.conclusion;
    const time = location.state?.time;

    const [imageStatus, setImageStatus] = useState(false);

    useEffect(() => {
        if (!user || !location.state) {
          navigate("/predict");
        }
    }, []);

    const handleSendEmail = (e) => {
        e.preventDefault();
        navigate("/sendemail", {
            state: {
                name: image_id,
                age: age,
                gender: gender,
                result: predict,
                image: image,
                conclusion: conclusion,
            },
        });
    }

    async function deletePredict(accessToken, navigate, axiosJWT, predict_id) {
        try {
            const res = await axiosJWT.post("/api/deletepredict", predict_id, {
                headers: {token: `Bearer ${accessToken}`},});
                toast.success('😉 Delete successfully!', {
                    position: "bottom-center",
                    autoClose: 1000,
                    onClose: () => navigate("/predict"),
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            
            return res;
        } catch (err) {
            toast.error('😢 Delete failed!', {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        
        
    }
    const handlePredictDelete = (e) => {
        e.preventDefault();
        const predictid_delete = {
            predict_id: predict_id,
            image: image,
            imageheatmap: imageheatmap,
        }
        console.log(predict_id);
        deletePredict(user?.accessToken, navigate, axiosJWT, predictid_delete);
    }

    const handleChangeImageType = (e) => {
        e.preventDefault();
        setImageStatus(!imageStatus);
    };
    return (
        <section className="predict-show-container">
            <span id='back-icon' class="material-symbols-outlined" onClick={() => navigate(-1)}>arrow_back</span>
        
            <div className="predict-show-container1">

                <div className="predict-show-container2">
                    
                    <h1 className="predict-show-title">Patient's Prediction</h1>
                    <div className="predict-show-container3">
                        <div className='predict-show-label'>Name: </div>
                        <div className='predict-show-result'>{image_id}</div>
                        <div className='predict-show-line'></div>
                        <div className='predict-show-label'>Age: </div>
                        <div className='predict-show-result'>{age}</div>
                        <div className='predict-show-line'></div>
                        <div className='predict-show-label'>Gender: </div>
                        <div className='predict-show-result'>{gender}</div>
                        <div className='predict-show-line'></div>
                        <div className='predict-show-label'>Email: </div>
                        <div className='predict-show-result'>{patientemail}</div>
                        <div className='predict-show-line'></div>
                        <div className='predict-show-label'>Result: </div>
                        <div className='predict-show-result'>{predict}</div>
                        <div className='predict-show-line'></div>
                        <div className='predict-show-label'>Doctor's conclusion: </div>
                        <div className='predict-show-result'>{conclusion}</div>
                        <div className='predict-show-line'></div>
                        <div className='predict-show-label'>Date of Prediction: </div>
                        <div className='predict-show-result'>{time}</div>
                    </div>

                    <div className="predict-show-btn-container">
                        <button className="predict-show-btn" onClick={handleSendEmail}>Send to Email</button>
                        <button className="predict-show-btn" onClick={handlePredictDelete}>Delete Patient</button>
                    </div>
                    
                    
                </div>
                <div className="predict-show-img-container">
                    <div className='change-img-container'>
                        <span id='change-img-icon' class="material-symbols-outlined" onClick={handleChangeImageType}>sync_alt</span>
                        {imageStatus ? (
                            <div className='change-img-text'>GradientCam</div>
                        ):(
                            <div className='change-img-text'>Original</div>
                        )}
                    </div>
                    {imageStatus ? (
                        <img className="predict-show-img" src={imageheatmap} alt="Heatmap" />
                    ):(
                        <img className="predict-show-img" src={image} alt="Predicted" />
                    )}
                </div>
                
            </div>
            <ToastContainer/>
        </section>
        
        
    );
}
 
export default PredictShow;