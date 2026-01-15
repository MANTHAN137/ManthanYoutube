document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Background
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
        particlesContainer.appendChild(particle);
    }

    // 2. Lightning Effect (Random Flashes)
    const lightning = document.getElementById('lightning');

    function triggerLightning() {
        const randomDelay = Math.random() * 10000 + 5000; // 5-15 seconds
        setTimeout(() => {
            lightning.style.opacity = '0.8';
            setTimeout(() => {
                lightning.style.opacity = '0';
                setTimeout(() => {
                    lightning.style.opacity = '0.4';
                    setTimeout(() => {
                        lightning.style.opacity = '0';
                        triggerLightning();
                    }, 50);
                }, 50);
            }, 100);
        }, randomDelay);
    }
    triggerLightning();

    // 3. Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Animate hamburger to X (optional simple toggle)
        mobileMenuBtn.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // 4. Video Filtering
    const tabBtns = document.querySelectorAll('.tab-btn');
    const videoCards = document.querySelectorAll('.video-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            videoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // 5. Smooth Scroll & Active Nav
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 6. 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.category-card, .video-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // 7. Video Hover Autoplay Preview
    let hoverTimeout = null;
    const videoCardsPreview = document.querySelectorAll('.video-card[data-video-id]');

    videoCardsPreview.forEach(card => {
        const videoId = card.getAttribute('data-video-id');
        const thumbnailContainer = card.querySelector('.thumbnail-placeholder');
        if (!thumbnailContainer) return;

        const originalContent = thumbnailContainer.innerHTML;
        const originalStyle = thumbnailContainer.getAttribute('style') || '';

        card.addEventListener('mouseenter', () => {
            // Delay before starting preview to avoid accidental triggers
            hoverTimeout = setTimeout(() => {
                // Create muted autoplay iframe
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&modestbranding=1`;
                iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; pointer-events: none; z-index: 1;';
                iframe.allow = 'autoplay; encrypted-media';
                iframe.setAttribute('loading', 'lazy');

                // Clear thumbnail and add iframe
                thumbnailContainer.innerHTML = '';
                thumbnailContainer.style.background = '#000';
                thumbnailContainer.appendChild(iframe);

                // Keep play button visible
                const playBtn = document.createElement('div');
                playBtn.className = 'play-button';
                playBtn.innerHTML = '<div class="play-icon">▶</div>';
                playBtn.style.cssText = 'opacity: 1; transform: scale(1); z-index: 2;';
                thumbnailContainer.appendChild(playBtn);
            }, 800); // 800ms delay before preview starts
        });

        card.addEventListener('mouseleave', () => {
            // Clear timeout if user leaves before preview starts
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }

            // Restore original thumbnail
            thumbnailContainer.innerHTML = originalContent;
            thumbnailContainer.setAttribute('style', originalStyle);
        });
    });

    // 8. Dynamic Video Modal with Real Data Checks
    // Assuming video cards will be updated with 'data-video-id' or 'data-video-url'
    const modal = document.getElementById('videoModal');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.querySelector('.modal-video-container');

    // Add click event to all video cards
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function () {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                // Open Modal with Embed
                modalContent.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                modal.classList.add('active');
            } else {
                // Fallback to channel
                window.open('https://www.youtube.com/@3Manhattan888/videos', '_blank');
            }
        });
    });

    // Add click event to all shorts cards (both old and new panel style)
    document.querySelectorAll('.short-card, .short-panel-card').forEach(card => {
        card.addEventListener('click', function () {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                // Open YouTube Shorts directly
                window.open(`https://www.youtube.com/shorts/${videoId}`, '_blank');
            } else {
                // Fallback to shorts section
                window.open('https://www.youtube.com/@3Manhattan888/shorts', '_blank');
            }
        });
    });

    // Shorts Panel Scroll Buttons
    const shortsScroll = document.getElementById('shortsScroll');
    const scrollLeft = document.getElementById('shortsScrollLeft');
    const scrollRight = document.getElementById('shortsScrollRight');

    if (shortsScroll && scrollLeft && scrollRight) {
        console.log("Shorts scroll elements found");
        scrollLeft.addEventListener('click', (e) => {
            console.log("Scroll left clicked");
            e.stopPropagation(); // Prevent bubbling
            shortsScroll.scrollBy({ left: -400, behavior: 'smooth' });
        });

        scrollRight.addEventListener('click', (e) => {
            console.log("Scroll right clicked");
            e.stopPropagation(); // Prevent bubbling
            shortsScroll.scrollBy({ left: 400, behavior: 'smooth' });
        });
    } else {
        console.error("Shorts scroll elements NOT found", { shortsScroll, scrollLeft, scrollRight });
    }

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        modalContent.innerHTML = ''; // Stop video
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modalContent.innerHTML = '';
        }
    });

});
