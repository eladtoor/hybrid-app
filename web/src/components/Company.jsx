import React from 'react'

export const Company = ({ title, imagePath }) => {
    return (
        <div className='company-container'>

            {title}
            <img src={imagePath} alt={`${name} תמונה`} className="company-image" />

        </div>
    )
}
