import React from 'react';
import './Button.css';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    style?: React.CSSProperties;
    id?: string;
    textClassName: string;
    size?: 'small' | 'large'
}
/**
 * 在原有的left基础上减3.5%，top基础上减1%
 */
const Button: React.FC<ButtonProps> = ({ text, onClick, style = {} , id, textClassName, size = 'large'}) => {
    return (
        <div
            id={id}
            className={`g-_1 g-aiAbs g-aiPointText button-container`}
            style={{
                width: size == 'large' ? '16%' : '9%',
                display: 'flex',
                height: '8%',
                justifyContent: 'center',
                alignItems: 'center',
                ...style
            }}
            onClick={onClick}
        >
            <img
                id="g-_3_8-_1_3-btn"
                className="button-image"
                alt=""
                src={size == 'large' ? "btn.png" : "btn_small.png"}
                style={{
                    width: '100%',
                    position: 'absolute',
                    left: 0
                }}
            />
            <p className={`${textClassName} button-text`} style={{
                position: 'relative',
                left: 0,
                width: 223,
                textAlign: 'center',
            }}>{text}</p>
        </div>
    );
};

export default Button;