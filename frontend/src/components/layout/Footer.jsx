import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="avengers-footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <div className="arc-reactor-footer"></div>
                    <span>MANTHAN</span>
                </div>

                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/videos">Videos</Link>
                    <Link to="/shorts">Shorts</Link>
                    <Link to="/about">About</Link>
                    <a
                        href="https://www.youtube.com/@3Manhattan888"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        YouTube Channel
                    </a>
                </div>

                <div className="footer-copyright">
                    <p>© 2026 Manthan. AI Shapes Imagination.</p>
                </div>
            </div>
            <div className="footer-gradient"></div>
        </footer>
    );
};

export default Footer;
