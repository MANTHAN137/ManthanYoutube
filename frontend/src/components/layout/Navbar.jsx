import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'HOME' },
        { path: '/videos', label: 'VIDEOS' },
        { path: '/shorts', label: 'SHORTS' },
        { path: '/games', label: 'GAMES' },
        { path: '/about', label: 'ABOUT' }
    ];

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`avengers-nav ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <a
                        href="https://www.youtube.com/@3Manhattan888"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="logo"
                    >
                        <img src="/images/custom-logo.png" alt="Manthan Logo" className="channel-logo-img" />
                        <span className="logo-text">MANTHAN</span>
                    </a>

                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="https://www.youtube.com/@3Manhattan888?sub_confirmation=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="subscribe-btn"
                    >
                        <span className="btn-text">SUBSCRIBE</span>
                        <div className="btn-glow"></div>
                    </a>

                    <div
                        className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
                        onClick={handleMobileMenuToggle}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="mobile-nav-links">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className="mobile-nav-link"
                                onClick={closeMobileMenu}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Navbar;
