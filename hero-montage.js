
// Hero Video Montage - Local Video Files (No Delay)
document.addEventListener('DOMContentLoaded', () => {
    const heroMontage = document.getElementById('heroMontage');
    if (!heroMontage) return;

    // List of local video files in VIDEOS folder
    const videoFiles = [
        'VIDEOS/PixVerse_V5.5_Image_Text_1080P_1s_Opens_on_a_t.mp4',
        'VIDEOS/PixVerse_V5_Image_Text_1080P_Sports_car_accele.mp4',
        'VIDEOS/PixVerse_V5_Extend_1080P_Portal_rotation_speed (1).mp4',
        'VIDEOS/PixVerse_V5_Transition_720P_A_car_speeds_throu.mp4',
        'VIDEOS/PixVerse_V5_Image_Text_1080P_POV视角，跳下飞机，跳伞运动.mp4',
        'VIDEOS/PixVerse_V5_Image_Text_1080P_镜头环绕，滑板快速在街道上滑行.mp4',
        'VIDEOS/PixVerse_V5_Image_Text_1080P_镜头环绕，滑板快速在街道上滑行 (1).mp4'
    ];

    let currentIndex = 0;

    // Create video element pool
    const player1 = createVideoPlayer('player1');
    const player2 = createVideoPlayer('player2'); // Buffer player

    heroMontage.appendChild(player1);
    heroMontage.appendChild(player2);

    let activePlayer = player1;
    let bufferPlayer = player2;

    // Function to load and play next video
    function playNextClip() {
        const videoFile = videoFiles[currentIndex];

        bufferPlayer.src = videoFile;
        bufferPlayer.load();

        // When ready to play
        bufferPlayer.oncanplay = () => {
            bufferPlayer.play().then(() => {
                // Fade in buffer, fade out active
                bufferPlayer.style.opacity = '1';
                activePlayer.style.opacity = '0';

                // Swap references
                [activePlayer, bufferPlayer] = [bufferPlayer, activePlayer];

                // Pause the old one after transition to save resources
                setTimeout(() => {
                    bufferPlayer.pause();
                    bufferPlayer.currentTime = 0;
                }, 1000);

                // Increment index
                currentIndex = (currentIndex + 1) % videoFiles.length;

                // Schedule next switch after 3.5 seconds
                setTimeout(playNextClip, 3500);
            }).catch(e => {
                console.error("Autoplay failed:", e);
                // Try next one if this fails
                currentIndex = (currentIndex + 1) % videoFiles.length;
                setTimeout(playNextClip, 1000);
            });

            // Remove listener so it doesn't fire multiple times for same source
            bufferPlayer.oncanplay = null;
        };
    }

    function createVideoPlayer(id) {
        const video = document.createElement('video');
        video.id = id;
        video.className = 'montage-video';
        video.muted = true; // Required for autoplay
        video.loop = true;
        video.playsInline = true;
        video.style.objectFit = 'cover';
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.opacity = '0';
        video.style.transition = 'opacity 1s ease-in-out';
        return video;
    }

    // Start the cycle
    playNextClip();
});
