import './RegisterSuccess.css'
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const RegisterSuccess = () => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);

    useEffect(() => {
        if (user) {
          navigate("/");
        }
    }, []);

    return (
        <main className="register-main">
        <section className="register-success-container">
            <div className="register-success-div">Please confirm an email we've been sent</div>
            <div className="register-success-login-form">
                <div className="register-success-login-title">Login to use your account</div>
                <Link className="register-success-login-link" to="/login">Login</Link>
            </div>
        </section>
        </main>
    );
}
 
export default RegisterSuccess;