import axios from 'axios';
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from './authSlice';
import { getpredictFailed, getpredictStart, getpredictSuccess } from './predictSlice';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/api/login", user, {withCredentials: true});
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err) {
        if (err.response.data === "The user does not exist!" || err.response.data === "Wrong password!")
        {
            dispatch(loginFailed(err.response.data));
        }
        else {
            dispatch(loginFailed("Connection to the server failed. Please try again later!"));
        }
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/api/register", user);
        dispatch(registerSuccess());
        navigate("/registersuccess")
    } catch (err) {
        if (err.response.data === "The username already exists!" || err.response.data === "The email already exists!")
        {
            dispatch(registerFailed(err.response.data));
        }
        else {
            dispatch(registerFailed("Connection to the server failed. Please try again later!"));
        }
        
    }
}

export const getPredict = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getpredictStart());
    try {
        const res = await axiosJWT.get("/api/getallpredict", {
            headers: {token: `Bearer ${accessToken}`},});
        dispatch(getpredictSuccess(res.data));
    } catch (err) {
        dispatch(getpredictFailed());
    }
}


export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post("/api/logout", id, {
            headers: {token: `Bearer ${accessToken}`},});
        dispatch(logoutSuccess());
        navigate("/login");
    } catch (err) {
        dispatch(logoutFailed());
    }
}