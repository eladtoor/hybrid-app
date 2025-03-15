import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [
    '/constructor1.jpg',
    '/constructor2.jpg',
    '/constructor3.jpg'
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            {/* קונטיינר עם תמונות מסודרות ימינה */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(${currentIndex * 100}%)`, direction: 'rtl' }}
            >
                {images.map((src, index) => (
                    <div key={index} className="w-full flex-shrink-0 h-[400px]">
                        <img src={src} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* חצים לנווט */}
            <button
                className="absolute top-1/2 right-4 bg-transparent text-white p-3 rounded-full hover:bg-black/30 transition"
                onClick={handlePrev}
            >
                <FaChevronRight size={28} />
            </button>

            <button
                className="absolute top-1/2 left-4 bg-transparent text-white p-3 rounded-full hover:bg-black/30 transition"
                onClick={handleNext}
            >
                <FaChevronLeft size={28} />
            </button>

            {/* נקודות ניווט - מלבנים דקים */}
            <div className="absolute bottom-4 left-1/2 flex gap-3">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`w-6 h-1 transition cursor-pointer ${currentIndex === index ? 'bg-white' : 'bg-gray-500'
                            }`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
