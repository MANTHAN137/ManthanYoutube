import { useState } from 'react';
import { getThumbnail, getVideoUrl, formatViewCount } from '../services/youtubeApi';
import './VideoCard.css';

const VideoCard = ({ video, onClick }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const categoryClass = video.category === 'ai' ? 'stocks' :
        video.category === 'scifi' ? 'music' : 'vlogs';

    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(video);
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
        window.open(getVideoUrl(video.id), '_blank');
    };

    return (
        <div
            className={`video-card ${isPlaying ? 'playing' : ''}`}
            data-category={video.category}
            onClick={handleClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="video-thumbnail">
                {isPlaying ? (
                    <div className="video-player-container">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="video-iframe"
                        />
                        <div className="video-controls">
                            <button className="video-control-btn close-btn" onClick={handleClose} title="Close">
                                ✕
                            </button>
                            <button className="video-control-btn youtube-btn" onClick={handleOpenYouTube} title="Open in YouTube">
                                ▶ YouTube
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="thumbnail-placeholder"
                        style={{
                            backgroundImage: `url('${video.thumbnail || getThumbnail(video.id)}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className={`play-button ${isHovering ? 'hover' : ''}`}>
                            <div className="play-icon">▶</div>
                        </div>
                        {video.duration && (
                            <div className="video-duration">{video.duration}</div>
                        )}
                    </div>
                )}
            </div>
            <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                    {video.viewCount > 0 && (
                        <span className="video-views">{formatViewCount(video.viewCount)} views</span>
                    )}
                    <div className={`video-category-tag ${categoryClass}-tag`}>
                        {video.category?.toUpperCase() || 'AI'}
                    </div>
                </div>
            </div>
            <div className={`card-glow ${categoryClass}-glow`}></div>
        </div>
    );
};

export default VideoCard;

