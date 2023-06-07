import "./PredictCard.css";
import { useNavigate } from "react-router-dom";
const PredictCard = (props) => {
    const {id, name, age, gender, patientemail, image, predict, imageheatmap , conclusion, time} = props;
    const navigate = useNavigate();

    const handlePredictCardClick = (e) => {
        e.preventDefault();
        console.log(name);
        navigate("/predictshow", {
            state: {
                predict_id: id,
                image_id: name,
                age: age,
                gender: gender,
                patientemail: patientemail,
                image: image,
                predict: predict,
                imageheatmap: imageheatmap,
                conclusion: conclusion,
                time: time
            },
        });
    }

    return (
        <section className="predict-card" onClick={handlePredictCardClick}>
            <div className="predict-card-name">{name}</div>
            <div className="predict-card-img-container">
                <img className="predict-card-img" src={image} alt="Predicted" />
            </div>
            <div className="predict-card-age-label">Age:</div>
            <div className="predict-card-age">{age}</div>
            <div className="predict-card-gender-label">Gender:</div>
            <div className="predict-card-gender">{gender}</div>
            <div className="predict-card-predict-label">Result:</div>
            <div className="predict-card-predict-null"> </div>
            <div className="predict-card-predict">{predict}</div>
            <div className="predict-card-time">{time}</div>
        </section>
    );
}
 
export default PredictCard;

