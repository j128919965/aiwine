import { useState, useEffect } from 'react';
import './ResultPage.css';
import { GenerateResponse } from '../ai/comfy';
import Button from '../components/Button';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const ResultPage = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState<GenerateResponse>()

    useEffect(() => {
        const queue: number[] = JSON.parse(localStorage.getItem("queue") ?? "[]")
        const taskId = queue[queue.length - 1]
        const result = JSON.parse(localStorage.getItem(`result-${taskId}`) ?? "{}")
        setResult(result)
    }, [])


    return (
        <div id="g-_3_8-_1_6" className="g-artboard" style={{ maxWidth: "2266px", maxHeight: "1488px" }} data-aspect-ratio="1.523"
            data-min-width="0">
            <div style={{ padding: "0 0 65.6664% 0" }}></div>
            <img id="g-_3_8-_1_6-img" className="g-_3_8-_1_6-img g-aiImg" alt="" src="_3_8-_1_6.jpg" />

            <Button size='small' 
             text='退出'
             textClassName='g-pstyle3 pxfont'
             onClick={()=>{
                navigate('/welcome')
             }}
             style={{
                top: "30.7614%", left: "84.5%",
             }}
             />

             {
                result && <Card cardData={result} style={{
                    position: 'absolute',
                    top: "12%", 
                    left: "50%",
                    width: "22.33%",
                    height: "71%",
                }}/>
             }


        </div>
    );
};

export default ResultPage;