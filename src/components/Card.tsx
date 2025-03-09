import React, { useState } from 'react';
import './Card.css';
import { GenerateResponse } from '../ai/comfy';

interface CardProps {
    cardData: GenerateResponse;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ cardData, style }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [frontRetries, setFrontRetries] = useState(0);
    const [backRetries, setBackRetries] = useState(0);
    const maxRetries = 2;

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleImageError = (side: 'front' | 'back') => {
        const retries = side === 'front' ? frontRetries : backRetries;
        const setRetries = side === 'front' ? setFrontRetries : setBackRetries;
        const imgUrl = side === 'front' ? cardData.frontUrl : cardData.backUrl;

        if (retries < maxRetries) {
            setRetries(retries + 1);
            const img = side === 'front' ? 
                document.querySelector('.card-front img') : 
                document.querySelector('.card-back img');
            if (img) {
                img.setAttribute('src', imgUrl + '?retry=' + (retries + 1));
            }
        }
    };

    return (
        <div 
            className="card-container" 
            style={{
                userSelect: 'none',
                ...style
            }}
            onClick={handleClick}
        >
            <div className={`card ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-face card-front">
                    <img 
                        src={cardData.frontUrl} 
                        alt="card front" 
                        onError={() => handleImageError('front')}
                    />
                </div>
                <div className="card-face card-back">
                    <img 
                        src={cardData.backUrl} 
                        alt="card back" 
                        onError={() => handleImageError('back')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Card;