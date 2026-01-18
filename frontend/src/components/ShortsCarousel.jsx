import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ShortCard from './ShortCard';
import LoadingSkeleton from './LoadingSkeleton';
import './ShortsCarousel.css';

const ShortsCarousel = ({ shorts, loading, title }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="shorts-panel-section">
            <div className="shorts-panel-header">
                <div className="shorts-logo">
                    <svg viewBox="0 0 24 24" className="shorts-icon">
                        <path fill="#FF0000" d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z" />
                    </svg>
                    <span>{title || 'Shorts'}</span>
                </div>
                <Link to="/shorts" className="view-all-link">View All →</Link>
            </div>

            <div className="shorts-panel-container">
                <button
                    className="scroll-btn scroll-left"
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    ‹
                </button>

                <div className="shorts-scroll-wrapper" ref={scrollRef}>
                    {loading ? (
                        // Show skeleton loaders
                        Array(6).fill(0).map((_, i) => (
                            <LoadingSkeleton key={i} type="short" />
                        ))
                    ) : (
                        shorts.map((short) => (
                            <ShortCard key={short.id} short={short} />
                        ))
                    )}
                </div>

                <button
                    className="scroll-btn scroll-right"
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    ›
                </button>
            </div>
        </section>
    );
};

export default ShortsCarousel;
