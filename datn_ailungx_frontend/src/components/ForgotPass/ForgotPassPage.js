import { Link, useNavigate } from "react-router-dom";
import './ForgotPassPage.css'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const ForgotPassPage = () => {

    const [emailReset, setEmailReset] = useState("");
    const [resetStatus, setResetStatus] = useState(null);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    useEffect(() => {
        if (user) {
          navigate("/");
        }
    }, []);

    async function callResetPassword(email) {
        try {
            const res = await axios.post("/api/forgot-password", email);
            return res;
        } catch (err) {
            return err.response;
        }
        
    }

    const handleForgotPassword = (e) => {
        e.preventDefault();
        const email = {
            email: emailReset
        };
        callResetPassword(email).then((res) => setResetStatus(res.data));

    }
    return (
        <main className="fp-main">
        <section className="fp-container">
            <form className='fp-form' onSubmit={handleForgotPassword}>
                <div className="fp-title">Forgot Password</div>
                {resetStatus? (
                    <div className="fp-intro">{resetStatus}</div>
                ):(
                    <>
                    <div className="fp-intro">Enter your email address and we'll email you instructions on how to reset your password.</div>
                    <div className="fp-label-container">
                        <span class="material-symbols-outlined">mail</span>
                        <label className='fp-label'>Your email</label>
                    </div>
                    <input className='fp-input' type="text" placeholder="Enter your email" 
                            onChange={(e) => setEmailReset(e.target.value)}/>
                    <button className="fp-btn" type="submit">Submit</button>
                </>
                )}
            </form>
            <div className="fp-register"> Don't have an account yet? </div>
            <Link className="fp-register-link" to="/register">Register</Link>
        </section>
        </main>
    );
}
 
export default ForgotPassPage;