import { useEffect, useState } from "react";
import PredictCard from "./PredictCard";
import "./PredictPage.css"
import { useDispatch, useSelector } from "react-redux";
import { getPredict } from "../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { createAxiosJWT } from "../../createAxiosJWT";
const PredictPage = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    let predictList = useSelector((state) => state.predict.getPredict?.currentPredict);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [myOption, setMyOption] = useState("Name");
    let axiosJWT = createAxiosJWT(user, dispatch);
    const searchOptions = ['Name', 'Predict', "Date & Time"];
    

    useEffect(() => {
        if (!user) {
          navigate("/login");
        }
        
        if (user?.accessToken) {
            getPredict(user?.accessToken, dispatch, axiosJWT);
        }
    }, []);

    

    return (
        <div className="predict-container">
            <div className="predict-page-title">Predict Collection</div>
            <div className="predict-search-label-container">
                    <span className="predict-search-icon" class="material-symbols-outlined">search</span>
                    <label className='predict-search-label'>Search your prediction's data</label>
                    <select className="predict-search-select" onChange={(e) => {setMyOption(e.target.value)}}>
                        {searchOptions.map((option, index) => {
                            return <option class="predict-search-option" key={index} >
                                {option}
                            </option>
                        })}
                    </select>
            </div>
            <input type="text" className="predict-search-input" placeholder="Search..."
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}></input>    
            <section className="predict-card-container">
                    
                {predictList?.images.filter((value) => {
                    if (searchTerm === "") {
                        return value;
                    } else
                    if (myOption === "Name") {
                        if (value?.image_id.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return value;
                        }
                    } else
                    if (myOption === "Predict") {
                        if (value?.predict.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return value;
                        }
                    } else
                    if (myOption === "Date & Time") {
                        if (value?.time.includes(searchTerm)) {
                            return value;
                        }
                    }
                    
                }).map((predict) => {
                    return (
                        <div className="predict-one-card" key={predict.predict_id}>
                            <PredictCard 
                                id={predict.predict_id} 
                                name={predict.image_id}
                                age={predict.age}
                                gender={predict.gender}
                                patientemail={predict.patientemail}
                                image={predict.image} 
                                predict={predict.predict}
                                imageheatmap={predict.imageheatmap}
                                conclusion={predict.conclusion}
                                time={predict.time}
                            />
                        </div>
                    );
                })}
            </section>
        </div>
                     
    );
}
 
export default PredictPage;