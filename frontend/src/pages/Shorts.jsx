import { useYouTube } from '../context/YouTubeContext';
import ShortCard from '../components/ShortCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './Shorts.css';

const Shorts = () => {
    const { shorts, loading } = useYouTube();

    return (
        <div className="shorts-page">
            <div className="page-header">
                <div className="shorts-logo-large">
                    <svg viewBox="0 0 24 24" className="shorts-icon-large">
                        <path fill="#FF0000" d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z" />
                    </svg>
                    <h1 className="page-title">SHORTS</h1>
                </div>
                <p className="page-subtitle">
                    All {shorts.length} shorts from Manthan, sorted latest first
                </p>
                <div className="title-underline red"></div>
            </div>

            {/* Shorts Grid */}
            <div className="shorts-grid">
                {loading ? (
                    Array(12).fill(0).map((_, i) => (
                        <LoadingSkeleton key={i} type="short" />
                    ))
                ) : shorts.length > 0 ? (
                    shorts.map((short) => (
                        <ShortCard key={short.id} short={short} />
                    ))
                ) : (
                    <div className="no-shorts">
                        <p>No shorts found</p>
                    </div>
                )}
            </div>

            {/* Shorts Count */}
            {!loading && (
                <div className="shorts-count">
                    Showing all {shorts.length} shorts
                </div>
            )}
        </div>
    );
};

export default Shorts;
