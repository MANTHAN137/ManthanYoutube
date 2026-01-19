// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

// YouTube API configuration
const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDJwa8_gqYvqw7hRsw5Kwe9dT83FTwMnE8';
const CHANNEL_HANDLE = process.env.CHANNEL_HANDLE || '@3Manthan888';

// Enable CORS for all origins in production
app.use(cors());

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Manthan YouTube Backend API',
        version: '1.0.0',
        endpoints: ['/api/videos', '/api/stats', '/api/health']
    });
});

// Cache for API responses (5 minutes)
let cache = {
    videos: null,
    shorts: null,
    stats: null,
    lastFetch: null
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to make HTTPS requests
function fetchFromYouTube(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Get channel ID from handle
async function getChannelId() {
    // Try forHandle first (with and without @)
    const handles = [CHANNEL_HANDLE, CHANNEL_HANDLE.replace('@', ''), `@${CHANNEL_HANDLE.replace('@', '')}`];

    for (const handle of handles) {
        try {
            const url = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&forHandle=${encodeURIComponent(handle)}&part=id`;
            console.log(`Trying handle: ${handle}`);
            const data = await fetchFromYouTube(url);
            if (data.items && data.items.length > 0) {
                console.log(`Found channel ID: ${data.items[0].id}`);
                return data.items[0].id;
            }
        } catch (e) {
            console.log(`Handle ${handle} failed:`, e.message);
        }
    }

    // Fallback: Try forUsername (legacy)
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&forUsername=${CHANNEL_HANDLE.replace('@', '')}&part=id`;
        console.log(`Trying username: ${CHANNEL_HANDLE.replace('@', '')}`);
        const data = await fetchFromYouTube(url);
        if (data.items && data.items.length > 0) {
            return data.items[0].id;
        }
    } catch (e) {
        console.log('Username lookup failed:', e.message);
    }

    // Fallback: Search for channel
    try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURIComponent(CHANNEL_HANDLE.replace('@', ''))}&type=channel&part=snippet&maxResults=1`;
        console.log(`Searching for channel: ${CHANNEL_HANDLE}`);
        const data = await fetchFromYouTube(searchUrl);
        if (data.items && data.items.length > 0) {
            const channelId = data.items[0].id.channelId;
            console.log(`Found via search: ${channelId}`);
            return channelId;
        }
    } catch (e) {
        console.log('Search failed:', e.message);
    }

    throw new Error('Channel not found - tried all methods');
}

// Parse ISO 8601 duration to seconds
function parseDuration(duration) {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

// Format duration for display
function formatDuration(duration) {
    if (!duration) return '';
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Get Uploads playlist ID from channel
async function getUploadsPlaylistId(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelId}&part=contentDetails`;
    const data = await fetchFromYouTube(url);
    if (data.items && data.items.length > 0) {
        return data.items[0].contentDetails.relatedPlaylists.uploads;
    }
    throw new Error('Could not find uploads playlist');
}

// Fetch all videos from playlist
async function fetchAllVideos(channelId) {
    try {
        const uploadsPlaylistId = await getUploadsPlaylistId(channelId);
        console.log(`Found uploads playlist ID: ${uploadsPlaylistId}`);

        let allVideos = [];
        let nextPageToken = '';

        // Fetch all playlist items
        do {
            const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet,contentDetails&maxResults=50${nextPageToken ? '&pageToken=' + nextPageToken : ''}`;
            const data = await fetchFromYouTube(playlistUrl);

            if (data.items) {
                allVideos = [...allVideos, ...data.items];
            }
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        if (allVideos.length === 0) {
            return { videos: [], shorts: [] };
        }

        // Get content details (duration) and statistics (view count)
        const videoIds = allVideos.map(v => v.contentDetails.videoId).join(',');

        // We need to fetch in chunks of 50 because videos endpoint has a limit
        const chunks = [];
        for (let i = 0; i < allVideos.length; i += 50) {
            chunks.push(allVideos.slice(i, i + 50));
        }

        const detailsMap = {};

        for (const chunk of chunks) {
            const chunkIds = chunk.map(v => v.contentDetails.videoId).join(',');
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${chunkIds}&part=contentDetails,statistics`;
            const detailsData = await fetchFromYouTube(detailsUrl);

            if (detailsData.items) {
                detailsData.items.forEach(item => {
                    detailsMap[item.id] = {
                        duration: item.contentDetails.duration,
                        viewCount: item.statistics.viewCount
                    };
                });
            }
        }

        // Process videos
        const processedVideos = allVideos.map(item => {
            const videoId = item.contentDetails.videoId;
            const details = detailsMap[videoId] || {};
            const durationSeconds = parseDuration(details.duration);
            const title = item.snippet.title.toLowerCase();

            // Detect shorts
            // Logic: #shorts in title OR duration < 60s
            // Note: YouTube API doesn't explicitly flag shorts in the standard response, so this is the best heuristic.
            const hasShortHashtag = title.includes('#shorts') || title.includes('#short');
            // Vertical videos < 60s are usually shorts, but we can't detect aspect ratio here easily.
            // We rely on duration and title.
            const isShort = hasShortHashtag || (durationSeconds <= 60 && durationSeconds > 0);

            let category = 'ai';
            if (title.includes('nature') || title.includes('drone')) {
                category = 'nature';
            } else if (title.includes('space') || title.includes('sci-fi') || title.includes('supernova')) {
                category = 'scifi';
            }

            return {
                id: videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                publishedAt: item.snippet.publishedAt, // or item.contentDetails.videoPublishedAt
                duration: formatDuration(details.duration),
                durationSeconds,
                viewCount: parseInt(details.viewCount) || 0,
                category,
                isShort
            };
        });

        // Sort by date (newest first)
        processedVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Separate videos and shorts
        const videos = processedVideos.filter(v => !v.isShort);
        const shorts = processedVideos.filter(v => v.isShort);

        return { videos, shorts };

    } catch (e) {
        console.error('Error in fetchAllVideos:', e);
        throw e;
    }
}

// API endpoint: Get all videos and shorts
app.get('/api/videos', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';

        // Check cache (skip if forceRefresh is true)
        if (!forceRefresh && cache.videos && cache.lastFetch && (Date.now() - cache.lastFetch < CACHE_DURATION)) {
            console.log('Returning cached videos');
            return res.json({ videos: cache.videos, shorts: cache.shorts });
        }

        if (forceRefresh) {
            console.log('🔄 Force refresh requested: Bypassing cache...');
        } else {
            console.log('Fetching fresh videos from YouTube API...');
        }

        const channelId = await getChannelId();
        const { videos, shorts } = await fetchAllVideos(channelId);

        // Update cache
        cache.videos = videos;
        cache.shorts = shorts;
        cache.lastFetch = Date.now();

        console.log(`Fetched ${videos.length} videos and ${shorts.length} shorts`);
        res.json({ videos, shorts });
    } catch (error) {
        console.error('Error fetching videos:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint: Get channel stats
app.get('/api/stats', async (req, res) => {
    try {
        const channelId = await getChannelId();
        const url = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelId}&part=statistics`;
        const data = await fetchFromYouTube(url);

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            res.json({
                subscriberCount: parseInt(stats.subscriberCount) || 0,
                viewCount: parseInt(stats.viewCount) || 0,
                videoCount: parseInt(stats.videoCount) || 0
            });
        } else {
            res.status(404).json({ error: 'Channel not found' });
        }
    } catch (error) {
        console.error('Error fetching stats:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Clear cache endpoint - call this when you upload a new video!
app.get('/api/clear-cache', (req, res) => {
    cache.videos = null;
    cache.shorts = null;
    cache.stats = null;
    cache.lastFetch = null;
    console.log('🗑️ Cache cleared!');
    res.json({
        success: true,
        message: 'Cache cleared! Next request will fetch fresh data from YouTube.',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Manthan Backend Server running on http://localhost:${PORT}`);
    console.log(`📺 YouTube API endpoints:`);
    console.log(`   GET /api/videos - Get all videos and shorts`);
    console.log(`   GET /api/stats  - Get channel statistics`);
    console.log(`   GET /api/health - Health check`);
});
