import React from 'react';

const Company = ({ title }) => {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-6 text-center">
            {/* קו דקורטיבי */}
            <hr className="w-24 border-t-4 border-orange-500 mx-auto mb-4" />

            {/* כותרת מעוצבת */}
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
                {title}
            </h2>

            {/* קו תחתון נוסף */}
            <hr className="w-16 border-t-2 border-orange-400 mx-auto mt-3" />
        </div>
    );
};

export default Company;
