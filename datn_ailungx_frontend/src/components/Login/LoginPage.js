import { useState, useEffect } from 'react';
import './LoginPage.css'
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailed } from '../../redux/authSlice';
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const loginError = useSelector((state) => state.auth.login?.errorDetail);
    
    useEffect(() => {
        if (user) {
          navigate("/");
        }
        dispatch(loginFailed(null));    
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
        }
        loginUser(newUser, dispatch, navigate);
    }
    
    return (
        <main className="login-main">
        <section className="login-container">
            <form className='login-form' onSubmit={handleLogin}>
                <div className="login-title">Login to Your Account</div>
                <div className="login-label-container">
                    <span class="material-symbols-outlined">person</span>
                    <label className='login-label'>Username</label>
                </div>
                <input className='login-input' type="text" placeholder="Enter your username" 
                        onChange={(e) => setUsername(e.target.value)}/>
                <div className="login-label-container">
                    <span class="material-symbols-outlined">lock</span>
                    <label className='login-label'>Password</label>
                </div>
                <input className='login-input' type="password" placeholder="Enter your password" 
                        onChange={(e) => setPassword(e.target.value)}/>
                <Link className="login-forgotpass-link" to="/forgotpassword">Forgot password? </Link>
                <div className="login-error">{loginError}</div>
                <button className="login-btn" type="submit">Login to Your Account</button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
        </main>
    );
}
 
export default LoginPage;