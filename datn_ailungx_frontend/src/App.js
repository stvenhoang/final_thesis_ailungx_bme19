import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/Home/HomePage';
import AboutPage from './components/About/AboutPage';
import LoginPage from './components/Login/LoginPage';
import PredictPage from './components/Predict/PredictPage';
import NavBar from "./components/NavBar/NavBar";
import RegisterPage from "./components/Register/RegisterPage";
import Footer from './components/Footer/Footer';
import ForgotPassPage from './components/ForgotPass/ForgotPassPage';
import RegisterSuccess from './components/Register/RegisterSuccess';
import PredictShow from './components/Predict/PredictShow';
import HomePageSavePredict from './components/Home/HomePageSavePredict';
import PredictSendMail from './components/Predict/PredictSendMail';
import ResetPassPage from './components/ForgotPass/ResetPassPage';
import RegisterConfirmPage from './components/Register/RegisterConfirmPage';
import SyndromesPage from './components/Syndromes/SyndromesPage';
import HomeAddLabel from './components/Home/HomeAddLabel';

function App() {
  return (
    <Router>
      <NavBar/>
      <div className="page-container">
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/savepredict' element={<HomePageSavePredict/>}></Route>
          <Route path='/addlabel' element={<HomeAddLabel/>}></Route>
          <Route path='/about' element={<AboutPage/>}></Route>
          <Route path='/syndromes' element={<SyndromesPage/>}></Route>
          <Route path='/predict' element={<PredictPage/>}></Route>
          <Route path='/predictshow' element={<PredictShow/>}></Route>
          <Route path='/sendemail' element={<PredictSendMail/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/register' element={<RegisterPage/>}></Route>
          <Route path='/registersuccess' element={<RegisterSuccess/>}></Route>
          <Route path='/registerconfirm/:email/:token' element={<RegisterConfirmPage/>}></Route>
          <Route path='/forgotpassword' element={<ForgotPassPage/>}></Route>
          <Route path='/resetpassword/:id/:token' element={<ResetPassPage/>}></Route>
        </Routes>
      </div>
      <Footer/>

    </Router>
  );
}

export default App;
