import { createAxiosJWT } from "../../createAxiosJWT";
import "./HomePageUser.css";
import "./HomeAddLabel.css";
import {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeAddLabel = () => {
    const [choosen, setChoosen] = useState([
        { id: 1, status: false, displayTrue: "✔️ Emphysema", displayFalse: "❌ Emphysema", name: "Emphysema"},
        { id: 2, status: false, displayTrue: "✔️ Hernia", displayFalse: "❌ Hernia", name: "Hernia"},
        { id: 3, status: false, displayTrue: "✔️ Nodule", displayFalse: "❌ Nodule", name: "Nodule"},
        { id: 4, status: false, displayTrue: "✔️ Effusion", displayFalse: "❌ Effusion", name: "Effusion"},
        { id: 5, status: false, displayTrue: "✔️ Pleural Thickening", displayFalse: "❌ Pleural Thickening", name: "Pleural Thickening"},
        { id: 6, status: false, displayTrue: "✔️ Pneumonia", displayFalse: "❌ Pneumonia", name:"Pneumonia"},
        { id: 7, status: false, displayTrue: "✔️ Cardiomegaly", displayFalse: "❌ Cardiomegaly", name:"Cardiomegaly"},
        { id: 8, status: false, displayTrue: "✔️ Infiltration", displayFalse: "❌ Infiltration", name:"Infiltration"},
        { id: 9, status: false, displayTrue: "✔️ Consolidation", displayFalse: "❌ Consolidation", name: "Consolidation"},
        { id: 10, status: false, displayTrue: "✔️ Atelectasis", displayFalse: "❌ Atelectasis", name: "Atelectasis"},
        { id: 11, status: false, displayTrue: "✔️ Pneumothorax", displayFalse: "❌ Pneumothorax", name: "Pneumothorax"},
        { id: 12, status: false, displayTrue: "✔️ Mass", displayFalse: "❌ Mass", name:"Mass"},
        { id: 13, status: false, displayTrue: "✔️ Edema", displayFalse: "❌ Edema", name:"Edema"},
        { id: 14, status: false, displayTrue: "✔️ Fibrosis", displayFalse: "❌ Fibrosis", name:"Fibrosis"}
    ]);
    const [base64img, setBase64img] = useState(null);
    const [previewimg, setPreviewimg] = useState(null);
    const [labelList, setLabelList] = useState([]);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const doctor = user?.vipmember;
    const username = user?.username;
    const email = user?.email;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxiosJWT(user, dispatch);
    const accessToken = user?.accessToken;

    useEffect(() => {
        if (!user) {
          navigate("/");
        }
        if (!doctor) {
            navigate("/");
        }
    }, []);

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

    const handleUpdateStatus = (id, status) => {
        setChoosen((prevChoosen) =>
          prevChoosen.map((item) =>
            item.id === id ? { ...item, status: !status } : item
          )
        );
    };

    const handleLabelList = (e, newChoosen, oldStatus, newId) => {
        e.preventDefault();
        handleUpdateStatus(newId, oldStatus);

        if (!oldStatus) {
            setLabelList(oldChoosen => [...oldChoosen, newChoosen]);
        }
        else {
            setLabelList((prevLabelList) =>
                prevLabelList.filter((item) => item !== newChoosen)
            );
        }
    };

    async function addLabel(axiosJWT, accessToken, labelData) {
        try {
            const res = await axiosJWT.post("/api/addlabel", labelData, {
                headers: {token: `Bearer ${accessToken}`},});
                toast.success('😉 Successfully!', {
                    position: "bottom-center",
                    autoClose: 1000,
                    onClose: () => navigate("/addlabel"),
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return res;
        } catch (err) {
            toast.error('😢 Failed!', {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const checkpng = base64img.includes("data:image/png;base64,");
        const checkjpg = base64img.includes("data:image/jpeg;base64,");
        let base64imgdone = "";
        if (checkpng) {
            base64imgdone = await base64img.slice(22);
        } else
        if (checkjpg) {
            base64imgdone = await base64img.slice(23);
        }
        else {console.log("Not support!");}
        
        const labelData = {
            image: base64imgdone,
            label: labelList.join(", "),
            username: username,
            email: email,
        };
        addLabel(axiosJWT, accessToken, labelData);     
    }

    return (
        <section className="home-predict-container">
            <div className="home-predict-upload-container">
                <div className="home-predict-upload-container2">
                    <div className="home-predict-title">Add your label</div>
                    <label class="custom-file-upload">
                        <span id="upload-icon" class="material-symbols-outlined">upload_file</span>
                        <input type="file" onChange={(e) => {
                                uploadImage(e);}}></input>
                        Upload Image
                    </label>
                </div>
                <img className="home-addlabel-img" src="https://i.ibb.co/XpHVr8p/addlabel-background.png" alt="Predictimg"></img>
                
            </div>
            { base64img && (
                <>
                    <div className="home-predict-result-container">
                        
                        <div className="home-predict-result-container1">
                            <div className="home-predict-result-container2">
                                <div className="home-predict-img-title" >Image</div>
                                <img className="home-predict-img" src={previewimg.preview} alt="Predictimg"></img>
                            </div>
                            <div className="home-addlabel-container">
                                {choosen.map((choose) => {
                                    return (
                                        <div key={choose.id}>
                                            {choose.status ? (
                                                <div className="home-addlabel-label" onClick={(e) => handleLabelList(e, choose.name, choose.status, choose.id)}>{choose.displayTrue}</div>
                                                ):(
                                                <div className="home-addlabel-label" onClick={(e) => handleLabelList(e, choose.name, choose.status, choose.id)}>{choose.displayFalse}</div>
                                                )}
                                        </div>
                                    );
                                } )}
                            </div>
                        </div>
                    </div>
                    <div className="home-addlabel-container2">
                        <div className="home-predict-result-title">Label</div>
                        <div className="home-predict-result">{labelList.join(", ")}</div>
                    </div>
                    <button className="home-predict-btn-predict" onClick={handleSubmit}>Submit</button>              
                </>
            )}
        <ToastContainer/>
        </section>
    );
}
 
export default HomeAddLabel;