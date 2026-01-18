import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'video' }) => {
    if (type === 'short') {
        return (
            <div className="skeleton short-skeleton">
                <div className="skeleton-thumb-short"></div>
                <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-views"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="skeleton video-skeleton">
            <div className="skeleton-thumb"></div>
            <div className="skeleton-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-tag"></div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
