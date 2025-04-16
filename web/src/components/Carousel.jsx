import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Carousel = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'carouselImages'));
                const urls = snapshot.docs.map((doc) => doc.data().url);
                setImages(urls);
            } catch (error) {
                console.error('שגיאה בטעינת תמונות הקרוסלה:', error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    if (images.length === 0) return null;

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
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

            <div className="absolute bottom-4 left-1/2 flex gap-3">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`w-6 h-1 transition cursor-pointer ${currentIndex === index ? 'bg-white' : 'bg-gray-500'}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
