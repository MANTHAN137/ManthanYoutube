import { useState, useEffect } from 'react';
import './ImageMontage.css';

// Hero images for the slideshow
const heroImages = [
    '/images/hero_ai_neural.png',
    '/images/hero_scifi_landscape.png',
    '/images/hero_cosmic_portal.png',
    '/images/hero_cyberpunk_city.png',
    '/images/hero_energy_waves.png',
];

const ImageMontage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-advance slideshow every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % heroImages.length);
                setIsTransitioning(false);
            }, 500); // Half of transition duration for crossfade effect
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleIndicatorClick = (index) => {
        if (index !== currentIndex) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
            }, 300);
        }
    };

    return (
        <div className="image-montage-container">
            {/* Background images for smooth crossfade */}
            {heroImages.map((img, index) => (
                <div
                    key={index}
                    className={`montage-slide ${index === currentIndex ? 'active' : ''} ${isTransitioning && index === currentIndex ? 'fading' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            <div className="montage-gradient-overlay"></div>

            {/* Image indicators */}
            <div className="image-indicators">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => handleIndicatorClick(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageMontage;
