import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import Button from '../components/Button';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        const resetTimer = () => {
            if(timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                navigate('/waiting');
            }, 60000);
        };

        // 初始化定时器
        resetTimer();

        return () => {
            if(timerRef.current) clearTimeout(timerRef.current);
        };
    }, [navigate]);

    const handleStart = () => {
        document.documentElement.requestFullscreen();
        navigate('/input');
    };


    return (
        <div 
            id="g-_3_8-_1_4" 
            className="g-artboard" 
            style={{
                maxWidth: '2266px',
                maxHeight: '1488px',
            }}
            data-aspect-ratio="1.523"
            data-min-width="0"
        >
            <div style={{ padding: '0 0 65.6664% 0' }}></div>
            <img 
                id="g-_3_8-_1_4-img" 
                className="g-_3_8-_1_4-img g-aiImg" 
                alt="" 
                src="_3_8-_1_4.jpg" 
            />
            <div 
                id="g-ai1-1" 
                className="g-_1 g-aiAbs g-aiPointText" 
                style={{
                    top: '10.8787%',
                    marginTop: '-16.9px',
                    left: '89.1354%',
                    width: '89px'
                }}
            >
                <p className="g-pstyle0">AI PLAY</p>
            </div>
            <div 
                id="g-ai1-2" 
                className="g-_1 g-aiAbs g-aiPointText" 
                style={{
                    top: '10.8787%',
                    marginTop: '-16.9px',
                    left: '93.6862%',
                    width: '89px'
                }}
            >
                <p className="g-pstyle0">Alcohol</p>
            </div>
            <div 
                id="g-ai1-3" 
                className="g-_1 g-aiAbs g-aiPointText" 
                style={{
                    top: '59.8244%',
                    marginTop: '-38.2px',
                    left: '56.2948%',
                    width: '510px'
                }}
            >
                <p className="g-pstyle1">MBTI定制化<span className="g-cstyle0">AI</span> 调酒！</p>
            </div>
            <Button 
                id="g-ai1-4" 
                style={{
                    top: '69.5661%',
                    marginTop: '-23px',
                    left: '58.6384%',
                }}
                text='GET START'
                textClassName='g-pstyle2'
                onClick={handleStart}

            />
        </div>
    );
};

export default WelcomePage;