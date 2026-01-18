import { useState } from 'react';
import { useYouTube } from '../context/YouTubeContext';
import VideoCard from '../components/VideoCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './Videos.css';

const Videos = () => {
    const { videos, getVideosByCategory, loading } = useYouTube();
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { key: 'all', label: 'ALL' },
        { key: 'ai', label: 'AI ART' },
        { key: 'scifi', label: 'SCI-FI' },
        { key: 'nature', label: 'NATURE' }
    ];

    const filteredVideos = getVideosByCategory(activeFilter);

    return (
        <div className="videos-page">
            <div className="page-header">
                <h1 className="page-title">
                    VIDEO <span className="gradient-text">LIBRARY</span>
                </h1>
                <p className="page-subtitle">
                    All {videos.length} videos from the Manthan universe, sorted latest first
                </p>
                <div className="title-underline"></div>
            </div>

            {/* Filter Tabs */}
            <div className="video-tabs">
                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        className={`tab-btn ${activeFilter === filter.key ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Videos Grid */}
            <div className="videos-grid">
                {loading ? (
                    Array(12).fill(0).map((_, i) => (
                        <LoadingSkeleton key={i} type="video" />
                    ))
                ) : filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))
                ) : (
                    <div className="no-videos">
                        <p>No videos found in this category</p>
                    </div>
                )}
            </div>

            {/* Video Count */}
            {!loading && (
                <div className="video-count">
                    Showing {filteredVideos.length} of {videos.length} videos
                </div>
            )}
        </div>
    );
};

export default Videos;
