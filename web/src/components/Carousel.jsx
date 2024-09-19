import React, { useState, useEffect } from 'react';
import '../styles/Carousel.css'; // Ensure this path is correct
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // ייבוא אייקוני חצים

const Carousel = () => {
    const images = [
        '/constructor1.jpg',
        '/constructor2.jpg',
        '/constructor3.jpg'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="carousel">
            <div className="carousel-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((src, index) => (
                    <div className="carousel-image" key={index}>
                        <img src={src} alt={`Slide ${index}`} />
                    </div>
                ))}
            </div>
            <button className="carousel-button prev" onClick={handlePrev}>
                <FaChevronLeft /> {/* חץ שמאלה */}
            </button>
            <button className="carousel-button next" onClick={handleNext}>
                <FaChevronRight /> {/* חץ ימינה */}
            </button>
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
