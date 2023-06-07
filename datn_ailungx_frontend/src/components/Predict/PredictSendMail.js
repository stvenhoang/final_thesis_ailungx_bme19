import './PredictSendMail.css';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAxiosJWT } from "../../createAxiosJWT";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PredictSendMail = () => {
    const [receiver, setReveiver] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxiosJWT(user, dispatch);

    const image = location.state?.image;
    const name = location.state?.name;
    const age = location.state?.age;
    const gender = location.state?.gender;
    const result = location.state?.result;
    const conclusion = location.state?.conclusion;

    useEffect(() => {
        if (!user || !location.state) {
          navigate("/predict");
        }
    }, []);

    async function sendMail(accessToken, navigate, axiosJWT, emailData) {
        try {
            const res = await axiosJWT.post("/api/mailpredict", emailData, {
                headers: {token: `Bearer ${accessToken}`},});
                toast.success('😉 Send email successfully!', {
                    position: "bottom-center",
                    autoClose: 1000,
                    onClose: () => navigate(-1),
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            return res;
        } catch (err) {
            toast.error('😢 Send email failed!', {
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
    const handleSendMail = (e) => {
        e.preventDefault();
        const emailData = {
            title: title,
            email: receiver,
            text: message,
            name: name,
            age: age,
            gender: gender,
            result: result,
            image: image,
            conclusion: conclusion,
        };
        sendMail(user?.accessToken, navigate, axiosJWT, emailData);
    }
    return (
        <main className="send-mail-main">
        <span id='sendmail-back-icon' class="material-symbols-outlined" onClick={() => navigate(-1)}>arrow_back</span>
        <section className="send-mail-container">
            <form className='send-mail-form' onSubmit={handleSendMail}>
                <div className="send-mail-title">Send email to your patient</div>
                <div className="send-mail-label-container">
                    <span class="material-symbols-outlined">forward_to_inbox</span>
                    <label className='send-mail-label'>Send to</label>
                </div>
                <input className='send-mail-input' type="text" placeholder="Ex: patient1@gmail.com, patient2@gmail.com, ..." 
                        onChange={(e) => setReveiver(e.target.value)}/>

                <div className="send-mail-label-container">
                    <span class="material-symbols-outlined">subject</span>
                    <label className='send-mail-label'>Subject</label>
                </div>
                <input className='send-mail-input' type="text" placeholder="Enter your email subject" 
                        onChange={(e) => setTitle(e.target.value)}/>
                
                <div className="send-mail-label-container">
                    <span class="material-symbols-outlined">description</span>
                    <label className='send-mail-label'>Message</label>
                </div>
                <textarea className='send-mail-input-message' type="text" placeholder="Enter your Message ..." 
                        onChange={(e) => setMessage(e.target.value)}/>

                <button className="send-mail-btn" type="submit">Send this Email</button>
            </form>
        <ToastContainer/>
        </section>
        </main>
    );
}
 
export default PredictSendMail;