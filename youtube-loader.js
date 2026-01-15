/**
 * YouTube Content Loader for Manthan Channel
 * 
 * This module provides:
 * 1. Hardcoded video data for instant loading
 * 2. Dynamic fetching via YouTube Data API (when API key is provided)
 * 3. Automatic thumbnail generation using YouTube's CDN
 */

const YouTubeLoader = {
    // Channel configuration
    config: {
        channelId: 'UC_YOUR_CHANNEL_ID', // Replace with actual channel ID if using API
        channelHandle: '@3Manhattan888',
        apiKey: 'AIzaSyDJwa8_gqYvqw7hRsw5Kwe9dT83FTwMnE8', // YouTube Data API key
        cacheKey: 'manthan_youtube_cache',
        cacheDuration: 3600000, // 1 hour in milliseconds
    },

    // Hardcoded video data (newest first) - Update this when you upload new videos
    videos: [
        {
            id: 'ySLNA4_Nn_k',
            title: 'AI Generated Drone Shots | Cinematic Views of Nature, Cities & Night Skies',
            duration: '1:18',
            category: 'nature',
            type: 'video'
        },
        {
            id: 'Q9AEeISwggQ',
            title: 'AI : Space Exploration | The Future of Space Exploration Is AI',
            duration: '1:40',
            category: 'scifi',
            type: 'video'
        },
        {
            id: 'U1H-8spHC-A',
            title: 'AI Film : Old Temple Curse | Attack of the Leviathan',
            duration: '3:24',
            category: 'ai',
            type: 'video'
        },
        {
            id: '0q6ZqCpRip8',
            title: 'AI generated supernova',
            duration: '0:09',
            category: 'scifi',
            type: 'video'
        }
    ],

    // Hardcoded shorts data (newest first)
    shorts: [
        {
            id: 'Ghne8n5EZwA',
            title: 'Space Exploration',
            views: '1.2M',
            type: 'short'
        },
        {
            id: '1qi7w4eUyVc',
            title: 'Prabhas X Bahubali 2',
            views: '850K',
            type: 'short'
        },
        {
            id: 'TMMn5a2g0MI',
            title: 'AI generated future tourism',
            views: '500K',
            type: 'short'
        },
        {
            id: 'IHVQQIV8MtA',
            title: 'Mumbai Nights | Royal Enfield',
            views: '2.1M',
            type: 'short'
        },
        {
            id: 'lHA-wmUNZy0',
            title: 'AI generated Dog videos',
            views: '3.5M',
            type: 'short'
        },
        {
            id: 'nKCt8TUEKNA',
            title: 'AI generated clips',
            views: '1.8M',
            type: 'short'
        },
        {
            id: '0B3fgUMd14w',
            title: "Prabhas's Saalar: Rescue scene",
            views: '2.5M',
            type: 'short'
        },
        {
            id: 'Vy_kagzOPvI',
            title: 'AI generated Cat video',
            views: '4.2M',
            type: 'short'
        },
        {
            id: 'vE7LE1CZBW8',
            title: 'AI generated drone shots',
            views: '1.5M',
            type: 'short'
        }
    ],

    /**
     * Get YouTube thumbnail URL
     * Quality options: default, mqdefault, hqdefault, sddefault, maxresdefault
     */
    getThumbnail(videoId, quality = 'hqdefault') {
        return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    },

    /**
     * Get YouTube video URL
     */
    getVideoUrl(videoId, isShort = false) {
        if (isShort) {
            return `https://www.youtube.com/shorts/${videoId}`;
        }
        return `https://www.youtube.com/watch?v=${videoId}`;
    },

    /**
     * Get embed URL for modal playback
     */
    getEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    },

    /**
     * Render videos to the grid
     */
    renderVideos(containerId = 'videosGrid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        this.videos.forEach(video => {
            const card = this.createVideoCard(video);
            container.appendChild(card);
        });
    },

    /**
     * Create a video card element
     */
    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.setAttribute('data-category', video.category);
        card.setAttribute('data-video-id', video.id);

        const categoryClass = video.category === 'ai' ? 'stocks' :
            video.category === 'scifi' ? 'music' : 'vlogs';

        card.innerHTML = `
            <div class="video-thumbnail">
                <div class="thumbnail-placeholder" style="background-image: url('${this.getThumbnail(video.id)}'); background-size: cover; background-position: center;">
                    <div class="play-button">
                        <div class="play-icon">▶</div>
                    </div>
                    <div class="video-duration">${video.duration}</div>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-category-tag ${categoryClass}-tag">${video.category.toUpperCase()}</div>
            </div>
            <div class="card-glow ${categoryClass}-glow"></div>
        `;

        // Add click handler
        card.addEventListener('click', () => {
            window.open(this.getVideoUrl(video.id), '_blank');
        });

        return card;
    },

    /**
     * Render shorts to the grid
     */
    renderShorts(containerId = 'shortsGrid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        this.shorts.forEach((short, index) => {
            const card = this.createShortCard(short, index);
            container.appendChild(card);
        });
    },

    /**
     * Create a short card element
     */
    createShortCard(short, index) {
        const card = document.createElement('div');
        card.className = 'short-card';
        card.setAttribute('data-video-id', short.id);

        // Use alternating thumb classes for variety
        const thumbClass = `thumb-${(index % 4) + 1}`;

        card.innerHTML = `
            <div class="short-thumbnail">
                <div class="short-placeholder" style="background-image: url('${this.getThumbnail(short.id)}'); background-size: cover; background-position: center;">
                    <div class="play-icon-small">▶</div>
                </div>
            </div>
            <div class="short-info">
                <h3>${short.title}</h3>
                <span>${short.views} views</span>
            </div>
        `;

        // Add click handler
        card.addEventListener('click', () => {
            window.open(this.getVideoUrl(short.id, true), '_blank');
        });

        return card;
    },

    /**
     * Fetch videos from YouTube API (requires API key)
     * Call this to get the latest videos from the channel
     */
    async fetchFromAPI() {
        if (!this.config.apiKey) {
            console.log('YouTube API key not set. Using hardcoded data.');
            return null;
        }

        // Check cache first
        const cached = this.getFromCache();
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?` +
                `key=${this.config.apiKey}` +
                `&channelId=${this.config.channelId}` +
                `&part=snippet,id` +
                `&order=date` +
                `&maxResults=20` +
                `&type=video`
            );

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            this.saveToCache(data);
            return data;
        } catch (error) {
            console.error('YouTube API error:', error);
            return null;
        }
    },

    /**
     * Cache management
     */
    getFromCache() {
        try {
            const cached = localStorage.getItem(this.config.cacheKey);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > this.config.cacheDuration) {
                localStorage.removeItem(this.config.cacheKey);
                return null;
            }

            return data;
        } catch {
            return null;
        }
    },

    saveToCache(data) {
        try {
            localStorage.setItem(this.config.cacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch {
            console.warn('Could not save to cache');
        }
    },

    /**
     * Fetch real-time view counts from YouTube API
     * Updates the view count elements in the DOM
     */
    async fetchViewCounts() {
        if (!this.config.apiKey) {
            console.log('YouTube API key not set. View counts will show "API needed"');
            // Update all view count elements to show API needed message
            document.querySelectorAll('.short-views').forEach(el => {
                el.textContent = '🔑 API Key needed';
            });
            return;
        }

        // Get all video IDs that need view counts
        const videoIds = [];
        document.querySelectorAll('.short-views[data-video-id]').forEach(el => {
            videoIds.push(el.getAttribute('data-video-id'));
        });

        if (videoIds.length === 0) return;

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?` +
                `key=${this.config.apiKey}` +
                `&id=${videoIds.join(',')}` +
                `&part=statistics`
            );

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();

            // Update each view count element
            data.items.forEach(item => {
                const viewCount = parseInt(item.statistics.viewCount);
                const formattedViews = this.formatViewCount(viewCount);

                const element = document.querySelector(`.short-views[data-video-id="${item.id}"]`);
                if (element) {
                    element.textContent = `${formattedViews} views`;
                }
            });
        } catch (error) {
            console.error('Error fetching view counts:', error);
            document.querySelectorAll('.short-views').forEach(el => {
                el.textContent = '⚠️ Error loading';
            });
        }
    },

    /**
     * Format view count to human-readable format (e.g., 1.2M, 850K)
     */
    formatViewCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    },

    /**
     * Fetch real-time channel statistics (subscribers, views, videos)
     */
    async fetchChannelStats() {
        if (!this.config.apiKey) {
            console.log('API key not set for channel stats');
            return;
        }

        try {
            // First, get the channel ID from the handle
            const searchResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?` +
                `key=${this.config.apiKey}` +
                `&q=${encodeURIComponent(this.config.channelHandle)}` +
                `&type=channel` +
                `&part=snippet` +
                `&maxResults=1`
            );

            if (!searchResponse.ok) throw new Error('Channel search failed');
            const searchData = await searchResponse.json();

            if (!searchData.items || searchData.items.length === 0) {
                console.log('Channel not found');
                return;
            }

            const channelId = searchData.items[0].id.channelId;

            // Now get the channel statistics
            const statsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?` +
                `key=${this.config.apiKey}` +
                `&id=${channelId}` +
                `&part=statistics`
            );

            if (!statsResponse.ok) throw new Error('Stats fetch failed');
            const statsData = await statsResponse.json();

            if (statsData.items && statsData.items.length > 0) {
                const stats = statsData.items[0].statistics;

                // Update the About section stats
                this.updateStatElement('subscriberCount', stats.subscriberCount);
                this.updateStatElement('viewCount', stats.viewCount);
                this.updateStatElement('videoCount', stats.videoCount);

                console.log('Channel stats loaded:', stats);
            }
        } catch (error) {
            console.error('Error fetching channel stats:', error);
        }
    },

    /**
     * Update a stat element in the DOM
     */
    updateStatElement(statType, value) {
        const formattedValue = this.formatViewCount(parseInt(value));

        // Find stat elements by data attribute or class
        const statElements = document.querySelectorAll(`[data-stat="${statType}"]`);
        statElements.forEach(el => {
            el.textContent = formattedValue + (statType !== 'videoCount' ? '+' : '');
        });
    },

    /**
     * Initialize the loader
     */
    init() {
        // Don't auto-render if HTML already has content (to preserve manually added cards)
        // Only fetch view counts for existing cards

        // Fetch view counts from API
        this.fetchViewCounts();

        // Fetch channel stats (subscribers, views, videos)
        this.fetchChannelStats();

        // If API key is set, try to fetch fresh video list
        if (this.config.apiKey) {
            this.fetchFromAPI().then(data => {
                if (data && data.items) {
                    console.log('Loaded fresh data from YouTube API');
                }
            });
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    YouTubeLoader.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YouTubeLoader;
}
