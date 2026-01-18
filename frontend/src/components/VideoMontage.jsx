import { useState, useEffect, useRef } from 'react';
import './VideoMontage.css';

// Video files from public/videos folder
const videoFiles = [
    '/videos/trimmed_1.mp4',
    '/videos/trimmed_2.mp4',
    '/videos/trimmed_3.mp4',
    '/videos/trimmed_4.mp4',
    '/videos/trimmed_5.mp4',
    '/videos/trimmed_6.mp4',
    '/videos/trimmed_7.mp4',
];

const VideoMontage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef(null);

    // Handle video end - move to next video
    const handleVideoEnd = () => {
        setCurrentIndex((prev) => (prev + 1) % videoFiles.length);
    };

    // Play video when index changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }
    }, [currentIndex]);

    return (
        <div className="video-montage-container">
            <video
                ref={videoRef}
                className="montage-video active"
                src={videoFiles[currentIndex]}
                muted
                playsInline
                autoPlay
                onEnded={handleVideoEnd}
            />
            <div className="montage-gradient-overlay"></div>

            {/* Video indicators */}
            <div className="video-indicators">
                {videoFiles.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to video ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default VideoMontage;
