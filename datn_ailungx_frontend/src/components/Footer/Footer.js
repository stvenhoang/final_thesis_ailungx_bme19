import './Footer.css'
const Footer = () => {
    return (
        <div className="footer-container">
            <div class="footer-content">
                <h3 className='footer-h3'>AI-LungX</h3>
                <p className='footer-p'>Experience the future of pulmonary disease diagnosis with our innovative AI-powered X-ray reading app</p>
                <ul class="socials">
                    <li className='footer-li'><a className='footer-a' href="https://www.facebook.com/oh.la.773"><i class="fa fa-facebook"></i></a></li>
                    <li className='footer-li'><a className='footer-a' href="https://github.com/stvenhoang"><i class="fa fa-github"></i></a></li>
                    <li className='footer-li'><a className='footer-a' href="https://www.youtube.com/channel/UCa_ILj6MVI251UzOHVB-xTg"><i class="fa fa-youtube"></i></a></li>
                </ul>
                <img className='footer-img-ktys' src='https://i.ibb.co/5vsMxBS/logo-nganh.png' alt='Logo BME'></img>
            </div>
            <div class="footer-bottom">
                <p className='footer-p'>copyright &copy;2023 BME Class Of 19 FinalThesis - HCMUTE. <br></br>designed by <span className='footer-span'>AI-LungX Development Team</span></p>
            </div>
        </div>
    );
}
 
export default Footer;
