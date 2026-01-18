import VideoCard from './VideoCard';
import LoadingSkeleton from './LoadingSkeleton';
import './VideoGrid.css';

const VideoGrid = ({ videos, loading, title, showViewAll, viewAllLink }) => {
    return (
        <div className="video-grid-container">
            {title && (
                <div className="section-header">
                    <h2 className="section-title">
                        {title.split(' ').map((word, i) =>
                            i === title.split(' ').length - 1 ?
                                <span key={i} className="gradient-text">{word}</span> :
                                word + ' '
                        )}
                    </h2>
                    <div className="title-underline"></div>
                </div>
            )}

            <div className="videos-grid">
                {loading ? (
                    // Show skeleton loaders
                    Array(8).fill(0).map((_, i) => (
                        <LoadingSkeleton key={i} type="video" />
                    ))
                ) : (
                    videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))
                )}
            </div>

            {showViewAll && viewAllLink && (
                <div className="view-all-container">
                    <a href={viewAllLink} className="view-all-btn">
                        <span>VIEW ALL</span>
                        <div className="btn-arrow">→</div>
                    </a>
                </div>
            )}
        </div>
    );
};

export default VideoGrid;
