import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllVideos, fetchChannelStats } from '../services/youtubeApi';

const YouTubeContext = createContext(null);

export const useYouTube = () => {
    const context = useContext(YouTubeContext);
    if (!context) {
        throw new Error('useYouTube must be used within a YouTubeProvider');
    }
    return context;
};

export const YouTubeProvider = ({ children }) => {
    const [videos, setVideos] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [channelStats, setChannelStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch videos and shorts
                const videoData = await fetchAllVideos();
                setVideos(videoData.videos);
                setShorts(videoData.shorts);

                // Fetch channel stats
                const stats = await fetchChannelStats();
                setChannelStats(stats);
            } catch (err) {
                console.error('Failed to load YouTube data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Get latest N videos
    const getLatestVideos = (count = 10) => {
        return videos.slice(0, count);
    };

    // Get latest N shorts
    const getLatestShorts = (count = 10) => {
        return shorts.slice(0, count);
    };

    // Filter videos by category
    const getVideosByCategory = (category) => {
        if (category === 'all') return videos;
        return videos.filter(v => v.category === category);
    };

    // Refresh videos (bypass cache)
    const refreshVideos = async () => {
        setLoading(true);
        setError(null);
        try {
            const videoData = await fetchAllVideos(true);
            setVideos(videoData.videos);
            setShorts(videoData.shorts);

            // Also refresh stats
            const stats = await fetchChannelStats();
            setChannelStats(stats);
        } catch (err) {
            console.error('Failed to refresh YouTube data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        videos,
        shorts,
        channelStats,
        loading,
        error,
        getLatestVideos,
        getLatestShorts,
        getVideosByCategory,
        refreshVideos
    };

    return (
        <YouTubeContext.Provider value={value}>
            {children}
        </YouTubeContext.Provider>
    );
};

export default YouTubeContext;
