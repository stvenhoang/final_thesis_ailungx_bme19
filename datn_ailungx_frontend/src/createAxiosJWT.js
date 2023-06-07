import axios from 'axios';
import jwt_decode from "jwt-decode";
import { loginSuccess, logoutSuccess } from './redux/authSlice';

const refreshToken = async (refreshToken) => {
    try {
        const res = await axios.post("/api/refresh", {}, {
            headers: {
                rftoken: `Bearer ${refreshToken}`
            },
        });
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const createAxiosJWT = (user, dispatch) =>{
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async(config) => {
            let date = new Date();
            const decodedAccessToken = jwt_decode(user?.accessToken);
            const decodedRefreshToken = jwt_decode(user?.refreshToken);
            if (decodedAccessToken.exp < date.getTime()/1000) {
                if (decodedRefreshToken.exp > date.getTime()/1000)
                {
                    const data = await refreshToken(user?.refreshToken);
                    const refreshUser = {
                        ...user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    };
                    await dispatch(loginSuccess(refreshUser));
                    config.headers["token"] = "Bearer " + data.accessToken;
                } else {
                    dispatch(logoutSuccess());
                }
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
        
    );
    return newInstance;
};