import React, { useEffect } from 'react';
import './LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import { generateImage, GenerateRequest, GenerateResponse } from '../ai/comfy';

const LoadingPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queue: number[] = JSON.parse(localStorage.getItem("queue") ?? "[]")
        const taskId = queue[queue.length - 1]
        const req: GenerateRequest = JSON.parse(localStorage.getItem(`userData-${taskId}`) ?? `{}`);
        // generateImage(req).then((res)=>{
        //   showResult(taskId, res)
        // })
        setTimeout(()=>showResult(taskId, {
            frontUrl: 'card_template_front.png',
            backUrl: 'card_template_back.png'
        }), 4000)
        console.log("send ai req", req)
    }, [])

    const showResult = (taskId: number, result: GenerateResponse) => {
        localStorage.setItem(`result-${taskId}`, JSON.stringify(result));
        navigate('/result');
    };

    return (
        <div 
            id="g-_3_8-_1_5" 
            className="g-artboard" 
            style={{
                maxWidth: "2266px",
                maxHeight: "1488px",
                aspectRatio: "1.523",
                minWidth: "0"
            }}
        >
            <div style={{ padding: "0 0 65.6664% 0" }}></div>
            <img 
                id="g-_3_8-_1_5-img" 
                className="g-_3_8-_1_5-img g-aiImg" 
                alt="" 
                src="_3_8-_1_5.jpg"
            />
            <div 
                id="g-ai2-1" 
                className="g-_1 g-aiAbs g-aiPointText" 
                style={{
                    top: "46.2618%",
                    marginTop: "-44.4px",
                    left: "43.3039%",
                    width: "291px"
                }}
            >
                <p className="g-pstyle0 loading-text pxfont">Loading...</p>
            </div>
            <div 
                id="g-ai2-2" 
                className="g-_1 g-aiAbs g-aiPointText" 
                style={{
                    top: "87.5924%",
                    marginTop: "-44.4px",
                    left: "18.369%",
                    width: "1499px"
                }}
            >
                <p className="g-pstyle0 pxfont">好的，现在让我为你调制一款专属于你当下的鸡尾酒吧！</p>
            </div>
        </div>
    );
};



export default LoadingPage;