import moment from "moment";
import { createAxiosJWT } from "../../createAxiosJWT";
import "./HomePageSavePredict.css";
import { useLocation, useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePageSavePredict = () => {
    const [image_id, setImage_id] = useState("");
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState("Male");
    const [patientemail, setPatientemail] = useState("");
    const [conclusion, setConclusion] = useState("");

    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosJWT = createAxiosJWT(user, dispatch);
    const accessToken = user?.accessToken;
    const genderOptions = ['Male', 'Female'];


    const predict_id = location.state?.predict_id;
    const image = location.state?.image;
    const predict = location.state?.predict;
    const imageheatmap = location.state?.imageheatmap;

    useEffect(() => {
        if (!user || !location.state ) {
          navigate("/");
        }
    }, []);

    async function savePredict(axiosJWT, accessToken, savePredictData) {
        try {
            const res = await axiosJWT.post("/api/savepredict", savePredictData, {
                headers: {token: `Bearer ${accessToken}`},});
                toast.success('😉 Save successfully!', {
                    position: "bottom-center",
                    autoClose: 1000,
                    onClose: () => navigate("/"),
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return res;
        } catch (err) {
            toast.error('😢 Save failed!', {
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

    const handleSavePredict = (e) => {
        e.preventDefault();
        console.log(image);
        const time = moment().format("DD-MM-YYYY HH:mm:ss");
        const savePredictData = {
            predict_id: predict_id,
            image_id: image_id,
            age: age,
            gender: gender,
            patientemail: patientemail,
            image: image,
            predict: predict,
            imageheatmap: imageheatmap,
            conclusion: conclusion,
            time: time,
        };
        savePredict(axiosJWT, accessToken, savePredictData);
        
        
        
    }

    return (
        <main className="home-predict-save-main">
        <section className="home-predict-save-container">
            <form className='home-predict-save-form' onSubmit={handleSavePredict}>
                <div className="home-predict-save-title">Save Patient's Prediction</div>
                <div className="home-predict-save-label-container">
                    <span class="material-symbols-outlined">person</span>
                    <label className='home-predict-save-label'>Patient Name</label>
                </div>
                <input className='home-predict-save-input' type="text" placeholder="Enter your patient's name" 
                        onChange={(e) => setImage_id(e.target.value)}/>
                        
                <div className="home-predict-save-label-container">
                    <span class="material-symbols-outlined">metabolism</span>
                    <label className='home-predict-save-label'>Age</label>
                </div>
                <input className='home-predict-save-input' type="text" placeholder="Enter your patient's age" 
                        onChange={(e) => setAge(e.target.value)}/>

                <div className="home-predict-save-label-container">
                    <span class="material-symbols-outlined">male</span>
                    <span class="material-symbols-outlined">female</span>
                    <label className='home-predict-save-label'>Gender</label>
                </div>
                <select className="home-predict-save-select" onChange={(e) => {setGender(e.target.value)}}>
                    {genderOptions.map((option, index) => {
                        return <option class="home-predict-save-option" key={index} >
                            {option}
                        </option>
                    })}
                </select>

                <div className="home-predict-save-label-container">
                    <span class="material-symbols-outlined">email</span>
                    <label className='home-predict-save-label'>Email</label>
                </div>
                <input className='home-predict-save-input' type="text" placeholder="Enter your patient's email" 
                        onChange={(e) => setPatientemail(e.target.value)}/>

                <div className="home-predict-save-label-container">
                    <span class="material-symbols-outlined">clinical_notes</span>
                    <label className='home-predict-save-label'>Doctor's conclusion</label>
                </div>
                <textarea className='home-predict-save-input-message' type="text" placeholder="Enter your conclusion ..." 
                        onChange={(e) => setConclusion(e.target.value)}/>

                <button className="home-predict-save-btn2" type="submit">Save your prediction</button>
            </form>
        </section>
        <ToastContainer/>
        </main>
    );
}
 
export default HomePageSavePredict;