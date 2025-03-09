import React, { useState } from 'react';
import './Card.css';
import { GenerateResponse } from '../ai/comfy';

interface CardProps {
    cardData: GenerateResponse;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ cardData, style }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
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
                    <img src={cardData.frontUrl} alt="card front" />
                </div>
                <div className="card-face card-back">
                    <img src={cardData.backUrl} alt="card back" />
                </div>
            </div>
        </div>
    );
};

export default Card;