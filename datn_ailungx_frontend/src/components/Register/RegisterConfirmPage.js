import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const RegisterConfirmPage = () => {
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();
    const navigate = useNavigate();
    const confirmUrl = `/api/register-confirm/${param.email}/${param.token}`;
    const user = useSelector((state) => state.auth.login?.currentUser);
    useEffect(() => {
        if (user) {
          navigate("/");
        }
    }, []);

    useEffect(() => {
        const verifyUrl = async () => {
            try {
                await axios.get(confirmUrl);
                setValidUrl(true);
            } catch (err) {
                setValidUrl(false);
            }
        };
        verifyUrl();
    }, [param, confirmUrl]);
    return (
        <>
            {validUrl? (
                <main className="fp-main">
                    <section className="fp-container">
                        <form className='fp-form'>
                            <div className="fp-title">Confirm register</div>
                            <div className="fp-intro">Created your account successfully!</div>
                        </form>
                         <div className="fp-register"> Now, login to your account </div>
                        <Link className="fp-register-link" to="/login">Login</Link>
                    </section>
                </main>
            ):(
                <></>
            )}
        </>
    );
}
 
export default RegisterConfirmPage;