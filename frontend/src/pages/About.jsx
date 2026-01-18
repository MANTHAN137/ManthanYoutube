import { useYouTube } from '../context/YouTubeContext';
import { formatViewCount } from '../services/youtubeApi';
import './About.css';

const About = () => {
    const { channelStats, loading } = useYouTube();

    return (
        <div className="about-page">
            <section className="about-section">
                <div className="about-container">
                    <div className="about-content">
                        <h2 className="section-title">
                            BEHIND <span className="gradient-text">THE MASK</span>
                        </h2>
                        <div className="about-text">
                            <p>
                                Welcome to <strong>MANTHAN</strong>. Where Artificial Intelligence meets human creativity.
                            </p>
                            <p>
                                We leverage cutting-edge generative AI tools to craft immersive sci-fi worlds,
                                futuristic concepts, and reimagined nature scenes. Inspired by the visual grandeur
                                of the MCU and the limitless possibilities of technology, our mission is to show
                                you what's possible when imagination has no boundaries.
                            </p>

                            <div className="about-stats">
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {loading ? '⏳' : formatViewCount(channelStats?.subscriberCount || 0) + '+'}
                                    </span>
                                    <span className="stat-label">Subscribers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {loading ? '⏳' : formatViewCount(channelStats?.viewCount || 0) + '+'}
                                    </span>
                                    <span className="stat-label">Views</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {loading ? '⏳' : channelStats?.videoCount || 0}
                                    </span>
                                    <span className="stat-label">Creations</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="about-visual">
                        <div className="hologram-effect">
                            <div className="hologram-circle"></div>
                            <div className="hologram-avatar"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="container">
                    <h2 className="section-title">
                        LET'S <span className="gradient-text">COLLABORATE</span>
                    </h2>
                    <div className="contact-grid">
                        {/* Email Card */}
                        <div className="contact-card email-card">
                            <div className="contact-icon-glow">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                            <h3>Email Me</h3>
                            <p className="contact-detail">3music888@gmail.com</p>
                            <a href="mailto:3music888@gmail.com" className="contact-btn-glow">
                                SEND MESSAGE
                            </a>
                        </div>

                        {/* Social Card */}
                        <div className="contact-card social-card">
                            <div className="contact-icon-glow">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                            <h3>Instagram</h3>
                            <p className="contact-detail">@3manthan888</p>
                            <a
                                href="https://instagram.com/3manthan888"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-btn-glow btn-purple"
                            >
                                FOLLOW ME
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
