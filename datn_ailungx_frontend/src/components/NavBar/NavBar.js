import { Link, useNavigate } from "react-router-dom";
import "./navbar.css"
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/apiRequest";
import { createAxiosJWT } from "../../createAxiosJWT";

const NavBar = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const accessToken = user?.accessToken;
    const id = user?._id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxiosJWT(user, dispatch);
    const handleLogout = () => {
        logOut(dispatch, id, navigate, accessToken, axiosJWT);
    }
    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <img className="navbar-logo-img" src="https://i.ibb.co/5W7WxBc/weblogo2.png" alt="Logo"></img>
                </div>
                
                <div className="overlay"></div>
                <Link className="link-nav" to="/">Home</Link>

                <Link className="link-nav" to="/about">About</Link>
                <Link className="link-nav" to="/predict">Storage</Link>
                {user? (            
                    <div className="logout-div-nav">
                        <button className="logout-btn-nav" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="login-div-nav">
                        <button className="login-btn-nav" onClick={() => navigate("/login")}>Login</button>
                    </div>
                )
                }
                
            </nav>
            
            <div className="ham-div-nav">
                    <div className="bar-nav"></div>
            </div>
        </>
    );
}
 
export default NavBar;