// YouTube Data API Service
// Fetches videos and shorts from the Manthan YouTube channel

import { VIDEOS, SHORTS, CHANNEL_INFO } from '../config/videos';

// Environment variables (set in .env file or Vercel dashboard)
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const CHANNEL_HANDLE = import.meta.env.VITE_YOUTUBE_CHANNEL_HANDLE || '@3Manthan888';
const CACHE_KEY = 'manthan_youtube_cache';
const CACHE_DURATION = 300000; // 5 minutes

// Backend API URL - update this in Vercel environment variables for production
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

// Data source options:
// - 'backend': Use Node.js backend server (fetches live data from YouTube)
// - 'config': Use config file (reliable, manually updated view counts)
// - 'direct': Direct YouTube API calls from browser (may have CORS issues)
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'backend'; // AUTO-FETCH: Shows new videos as soon as you upload!

/**
 * Get cached data from localStorage
 */
export const getCachedData = (key) => {
    try {
        const cached = localStorage.getItem(`${CACHE_KEY}_${key}`);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION) {
            localStorage.removeItem(`${CACHE_KEY}_${key}`);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

/**
 * Save data to localStorage cache
 */
export const setCachedData = (key, data) => {
    try {
        localStorage.setItem(`${CACHE_KEY}_${key}`, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch {
        console.warn('Could not save to cache');
    }
};

/**
 * Clear all cache
 */
export const clearCache = () => {
    const keys = ['channelId', 'allVideos', 'channelStats'];
    keys.forEach(key => {
        localStorage.removeItem(`${CACHE_KEY}_${key}`);
    });
    console.log('YouTube cache cleared');
};

/**
 * Format view count to human-readable format
 */
export const formatViewCount = (count) => {
    const num = parseInt(count);
    if (isNaN(num)) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

/**
 * Format duration from ISO 8601 to readable format
 */
export const formatDuration = (duration) => {
    if (!duration) return '';

    // If already formatted (e.g., "1:18"), return as is
    if (duration.includes(':')) return duration;

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Get YouTube thumbnail URL
 */
export const getThumbnail = (videoId, quality = 'hqdefault') => {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Get YouTube video URL
 */
export const getVideoUrl = (videoId, isShort = false) => {
    if (isShort) {
        return `https://www.youtube.com/shorts/${videoId}`;
    }
    return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Get videos from config file (instant, always works)
 */
const getVideosFromConfig = () => {
    const now = new Date().toISOString();

    const videos = VIDEOS.map((video, index) => ({
        id: video.id,
        title: video.title,
        duration: video.duration || '',
        durationSeconds: 120,
        category: video.category || 'ai',
        isShort: false,
        thumbnail: getThumbnail(video.id),
        viewCount: video.viewCount || 0,
        publishedAt: new Date(Date.now() - index * 86400000).toISOString(), // Ordered by index
    }));

    const shorts = SHORTS.map((short, index) => ({
        id: short.id,
        title: short.title,
        durationSeconds: 30,
        isShort: true,
        thumbnail: getThumbnail(short.id),
        viewCount: short.viewCount || 0,
        publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
    }));

    console.log(`Loaded from config: ${videos.length} videos, ${shorts.length} shorts`);

    return {
        videos,
        shorts,
        all: [...videos, ...shorts]
    };
};

/**
 * Fetch channel ID from API
 */
export const fetchChannelId = async () => {
    const cached = getCachedData('channelId');
    if (cached) return cached;

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?` +
            `key=${API_KEY}` +
            `&forHandle=${CHANNEL_HANDLE}` +
            `&part=id`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Channel API error:', errorData);
            throw new Error(`Channel fetch failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error('Channel not found');
        }

        const channelId = data.items[0].id;
        setCachedData('channelId', channelId);
        console.log('Channel ID found:', channelId);
        return channelId;
    } catch (error) {
        console.error('Error fetching channel ID:', error);
        throw error;
    }
};

/**
 * Fetch all videos - uses backend, config, or direct API based on DATA_SOURCE
 */
export const fetchAllVideos = async (forceRefresh = false) => {
    // Use backend API (recommended)
    if (DATA_SOURCE === 'backend') {
        try {
            console.log('Fetching from backend API...', forceRefresh ? '(Force Refresh)' : '');

            // Clear cache if forcing refresh
            if (forceRefresh) {
                clearCache();
            }

            const url = `${BACKEND_URL}/videos${forceRefresh ? '?refresh=true' : ''}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Backend API error');
            const data = await response.json();
            console.log(`Backend returned: ${data.videos.length} videos, ${data.shorts.length} shorts`);
            return data;
        } catch (error) {
            console.error('Backend API failed, falling back to config:', error);
            return getVideosFromConfig();
        }
    }

    // Use config file for instant loading
    if (DATA_SOURCE === 'config') {
        return getVideosFromConfig();
    }

    // Direct API calls (may have CORS issues)
    if (!forceRefresh) {
        const cached = getCachedData('allVideos');
        if (cached) return cached;
    }

    try {
        const channelId = await fetchChannelId();
        let allVideos = [];
        let nextPageToken = '';

        do {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?` +
                `key=${API_KEY}` +
                `&channelId=${channelId}` +
                `&part=snippet` +
                `&order=date` +
                `&maxResults=50` +
                `&type=video` +
                (nextPageToken ? `&pageToken=${nextPageToken}` : '')
            );

            if (!response.ok) {
                throw new Error(`Video fetch failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.items) {
                allVideos = [...allVideos, ...data.items];
            }
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        if (allVideos.length === 0) {
            throw new Error('No videos found');
        }

        // Get video details
        const videoIds = allVideos.map(v => v.id.videoId).join(',');
        const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` +
            `key=${API_KEY}` +
            `&id=${videoIds}` +
            `&part=contentDetails,statistics`
        );

        if (!detailsResponse.ok) {
            throw new Error('Video details fetch failed');
        }

        const detailsData = await detailsResponse.json();

        const detailsMap = {};
        detailsData.items.forEach(item => {
            detailsMap[item.id] = {
                duration: item.contentDetails.duration,
                viewCount: item.statistics.viewCount
            };
        });

        const processedVideos = allVideos.map(video => {
            const details = detailsMap[video.id.videoId] || {};
            const durationSeconds = parseDurationToSeconds(details.duration);

            // Better shorts detection:
            // PRIMARY: Check if title contains #shorts hashtag
            // SECONDARY: Duration 60 seconds or less
            const title = video.snippet.title.toLowerCase();
            const hasShortHashtag = title.includes('#shorts') || title.includes('#short');

            // A video is a SHORT if:
            // 1. Title contains #shorts or #short hashtag (primary indicator)
            // 2. OR duration is 60 seconds or less AND doesn't look like a regular video
            const isShort = hasShortHashtag || (durationSeconds <= 60 && durationSeconds > 0);

            let category = 'ai';
            if (title.includes('nature') || title.includes('drone')) {
                category = 'nature';
            } else if (title.includes('space') || title.includes('sci-fi') || title.includes('supernova')) {
                category = 'scifi';
            }

            return {
                id: video.id.videoId,
                title: video.snippet.title,
                thumbnail: video.snippet.thumbnails.high?.url || getThumbnail(video.id.videoId),
                publishedAt: video.snippet.publishedAt,
                duration: formatDuration(details.duration),
                durationSeconds,
                viewCount: parseInt(details.viewCount) || 0,
                category,
                isShort
            };
        });

        processedVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Properly segregate: videos are non-shorts, shorts are shorts
        const videos = processedVideos.filter(v => !v.isShort);
        const shorts = processedVideos.filter(v => v.isShort);

        console.log(`Fetched from API: ${videos.length} videos, ${shorts.length} shorts`);

        const result = { videos, shorts, all: processedVideos };
        setCachedData('allVideos', result);
        return result;
    } catch (error) {
        console.error('Error fetching videos:', error);
        console.log('Using config file data as fallback...');
        return getVideosFromConfig();
    }
};

/**
 * Parse ISO 8601 duration to seconds
 */
const parseDurationToSeconds = (duration) => {
    if (!duration) return 0;

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Fetch channel statistics
 */
export const fetchChannelStats = async () => {
    // Use config for instant loading
    if (DATA_SOURCE === 'config') {
        return {
            subscriberCount: CHANNEL_INFO.subscriberCount,
            viewCount: CHANNEL_INFO.totalViews,
            videoCount: VIDEOS.length + SHORTS.length
        };
    }

    const cached = getCachedData('channelStats');
    if (cached) return cached;

    try {
        const channelId = await fetchChannelId();

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?` +
            `key=${API_KEY}` +
            `&id=${channelId}` +
            `&part=statistics`
        );

        if (!response.ok) {
            throw new Error('Stats fetch failed');
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const result = {
                subscriberCount: parseInt(stats.subscriberCount) || 0,
                viewCount: parseInt(stats.viewCount) || 0,
                videoCount: parseInt(stats.videoCount) || 0
            };
            setCachedData('channelStats', result);
            return result;
        }

        throw new Error('No stats found');
    } catch (error) {
        console.error('Error fetching channel stats:', error);
        return {
            subscriberCount: CHANNEL_INFO.subscriberCount,
            viewCount: CHANNEL_INFO.totalViews,
            videoCount: VIDEOS.length + SHORTS.length
        };
    }
};

export default {
    fetchAllVideos,
    fetchChannelStats,
    fetchChannelId,
    formatViewCount,
    getThumbnail,
    getVideoUrl,
    clearCache
};
