import { useState } from 'react';
import { getThumbnail, getVideoUrl, formatViewCount } from '../services/youtubeApi';
import './ShortCard.css';

const ShortCard = ({ short, onClick }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(short);
        } else {
            setIsPlaying(true);
        }
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsPlaying(false);
    };

    const handleOpenYouTube = (e) => {
        e.stopPropagation();
        window.open(getVideoUrl(short.id, true), '_blank');
    };

    return (
        <div
            className={`short-panel-card ${isPlaying ? 'playing' : ''}`}
            onClick={handleClick}
        >
            {isPlaying ? (
                <div className="short-player-container">
                    <iframe
                        src={`https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0&loop=1`}
                        title={short.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="short-iframe"
                    />
                    <div className="short-controls">
                        <button className="short-control-btn close-btn" onClick={handleClose} title="Close">
                            ✕
                        </button>
                        <button className="short-control-btn youtube-btn" onClick={handleOpenYouTube} title="Open in YouTube">
                            ▶
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className="short-panel-thumb"
                        style={{
                            backgroundImage: `url('${short.thumbnail || getThumbnail(short.id)}')`
                        }}
                    >
                        <div className="short-overlay"></div>
                        <div className="shorts-badge">
                            <svg viewBox="0 0 24 24" className="shorts-badge-icon">
                                <path fill="#FF0000" d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z" />
                            </svg>
                        </div>
                        <div className="short-play-overlay">
                            <div className="short-play-icon">▶</div>
                        </div>
                    </div>
                    <div className="short-panel-info">
                        <h4>{short.title}</h4>
                        {short.viewCount && (
                            <span className="short-views">{formatViewCount(short.viewCount)} views</span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ShortCard;

