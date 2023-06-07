import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ResetPassPage = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errStatus, setErrStatus] = useState(null);
    const param = useParams();
    const navigate = useNavigate();
    const resetUrl = `/api/reset-password/${param.id}/${param.token}`;
    const user = useSelector((state) => state.auth.login?.currentUser);
    useEffect(() => {
        if (user) {
          navigate("/");
        }
    }, []);
    useEffect(() => {
        const verifyUrl = async () => {
            try {
                await axios.get(resetUrl);
                setValidUrl(true);
            } catch (err) {
                setValidUrl(false);
            }
        };
        verifyUrl();
    }, [param, resetUrl]);

    const handleResetPassword = async(e) => {
        e.preventDefault();
        const passwordReset = {
            password: password,
            confirm_password: confirmPassword,
        };
        try {
            await axios.post(resetUrl, passwordReset);
            setErrStatus(null);
            toast.success('😉 Reset password successfully. Now login again!', {
                position: "bottom-center",
                autoClose: 2000,
                onClose: () => navigate("/login"),
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (err) {
            setErrStatus(err.response.data);
        }
    };
    return (
        <>
            {validUrl ? (
                <main className="fp-main">
                <section className="fp-container">
                    <form className='fp-form' onSubmit={handleResetPassword}>
                        <div className="fp-title">Reset Password</div>
                
                        <div className="fp-intro">Please enter your new password!</div>
                        <div className="fp-label-container">
                            <span class="material-symbols-outlined">lock</span>
                            <label className='fp-label'>New password</label>
                        </div>
                        <input className='fp-input' type="password" placeholder="Enter your new password" 
                                onChange={(e) => setPassword(e.target.value)}/>

                        <div className="fp-label-container">
                            <span class="material-symbols-outlined">water_lock</span>
                            <label className='fp-label'>Confirm password</label>
                        </div>
                        <input className='fp-input' type="password" placeholder="Confirm your new password" 
                                onChange={(e) => setConfirmPassword(e.target.value)}/>
                        {errStatus && <div className="login-error">{errStatus}</div>}
                        <button className="fp-btn" type="submit">Submit</button>
                        
                    </form>
                    <ToastContainer/>
                </section>
                </main>
            ):(
                <></>
            )}
        </>
    );
}
 
export default ResetPassPage;