import { useState, useEffect } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/apiRequest";
import { registerFailed } from "../../redux/authSlice";
const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registerError = useSelector((state) => state.auth.register?.errorDetail);
    const user = useSelector((state) => state.auth.login?.currentUser);

    useEffect(() => {
        if (user) {
          navigate("/");
        }
        dispatch(registerFailed(null));
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            email: email,
            password: password
        };

        registerUser(newUser, dispatch, navigate);
    }

    return (
        <main className="register-main">
        <section className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <div className="register-title">Register new Account</div>
                <div className="register-label-container">
                    <span class="material-symbols-outlined">mail</span>
                    <label className="register-label">Email</label>
                </div>
                <input className="register-input" type="text" placeholder="Enter your email" 
                        onChange={(e) => setEmail(e.target.value)}/>
        
                <div className="register-label-container">
                    <span class="material-symbols-outlined">person</span>
                    <label className="register-label">Username</label>
                </div>
                <input className="register-input" type="text" placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}/>

                <div className="register-label-container">
                    <span class="material-symbols-outlined">lock</span>
                    <label className="register-label">Password</label>
                </div>
                <input className="register-input" type="password" placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}/>
                <div className="register-error">{registerError}</div>
                <button type="submit" className="register-btn"> Create account </button>
            </form>
            <div className="register-login-form">
                <div className="register-login-title"> Have an account? </div>
                <Link className="register-login-link" to="/login">Login</Link>
            </div>
            
        </section>

        
        </main>
        
     );
}
 
export default RegisterPage;