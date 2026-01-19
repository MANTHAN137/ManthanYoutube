import { Link } from 'react-router-dom';
import { useYouTube } from '../context/YouTubeContext';
import VideoCard from '../components/VideoCard';
import ShortsCarousel from '../components/ShortsCarousel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ImageMontage from '../components/ImageMontage';
import './Home.css';

const Home = () => {
    const { getLatestVideos, getLatestShorts, loading, refreshVideos } = useYouTube();

    const latestVideos = getLatestVideos(10);
    const latestShorts = getLatestShorts(10);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section id="home" className="hero-section">
                <div className="hero-background">
                    <ImageMontage />
                    <div className="montage-overlay"></div>
                    <div className="infinity-stones">
                        <div className="stone stone-power"></div>
                        <div className="stone stone-space"></div>
                        <div className="stone stone-reality"></div>
                        <div className="stone stone-soul"></div>
                        <div className="stone stone-time"></div>
                        <div className="stone stone-mind"></div>
                    </div>
                </div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="title-line">AI SHAPES</span>
                        <span className="title-main">IMAGINATION</span>
                        <span className="title-sub">INTO REALITY</span>
                    </h1>

                    <p className="hero-description">
                        Explore the Future with <span className="highlight-stocks">AI Concepts</span>,
                        <span className="highlight-music"> Sci-Fi Worlds</span>, and
                        <span className="highlight-vlogs"> Nature Reimagined</span>.
                    </p>

                    <div className="hero-cta">
                        <Link to="/videos" className="cta-primary">
                            <span>ENTER THE UNIVERSE</span>
                            <div className="cta-icon">▶</div>
                        </Link>
                    </div>
                </div>

                <div className="floating-elements">
                    <div className="floating-shield"></div>
                    <div className="floating-hammer"></div>
                    <div className="floating-arc-reactor"></div>
                </div>

                <div className="scroll-indicator">
                    <div className="scroll-arrow"></div>
                </div>
            </section>

            {/* Latest Videos Section */}
            <section id="videos" className="videos-section">
                <div className="section-header">
                    <h2 className="section-title">LATEST <span className="gradient-text">VISUALS</span></h2>
                    <div className="title-underline"></div>

                    <button
                        onClick={refreshVideos}
                        className="refresh-btn"
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid #00f0ff',
                            color: '#00f0ff',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? '↻ REFRESHING...' : '↻ REFRESH CONTENT'}
                    </button>
                </div>

                <div className="videos-grid">
                    {loading ? (
                        Array(10).fill(0).map((_, i) => (
                            <LoadingSkeleton key={i} type="video" />
                        ))
                    ) : (
                        latestVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))
                    )}
                </div>

                <div className="view-all-container">
                    <Link to="/videos" className="view-all-btn">
                        <span>VIEW ALL VIDEOS</span>
                        <div className="btn-arrow">→</div>
                    </Link>
                </div>
            </section>

            {/* Shorts Section */}
            <ShortsCarousel
                shorts={latestShorts}
                loading={loading}
                title="Latest Shorts"
            />

            {/* Particle Background */}
            <div className="particle-container" id="particles"></div>
            <div className="lightning-overlay" id="lightning"></div>
        </div>
    );
};

export default Home;
