import React, { useEffect } from 'react';
import './LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import {generateImage} from '../ai/comfy'
import { GenerateRequest, GenerateResponse } from '../ai/comfy';
import axios from 'axios';

const server = 'http://101.34.87.87:3000'

const LoadingPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queue: number[] = JSON.parse(localStorage.getItem("queue") ?? "[]")
        const taskId = queue[queue.length - 1]
        const req: GenerateRequest = JSON.parse(localStorage.getItem(`userData-${taskId}`) ?? `{}`);
        generateImage(req).then((res)=>{
          showResult(taskId, req, res)
        }).catch(e => {
          console.log(e)
          alert('生成失败，请重试')
          navigate('/input')
        })
        console.log("send ai req", req)
    }, [])

    const showResult = async (taskId: number, req: GenerateRequest, result: GenerateResponse) => {
        localStorage.setItem(`result-${taskId}`, JSON.stringify(result));
        const frontProm = uploadFileFromUrl(result.frontUrl, `${taskId}_front.png`)
        const backProm = uploadFileFromUrl(result.backUrl, `${taskId}_back.png`)
        const front = await frontProm
        const back = await backProm
        console.log("uploaded", front, back)
        axios.post(`${server}/data`, {
            ...req,
            front,
            back
        })
        navigate('/result');
    };

    async function uploadFileFromUrl(fileUrl: string, newFileName: string): Promise<string> {
        try {
            // 使用Image对象加载图片
            const image = new Image();
            image.crossOrigin = 'anonymous';
            
            const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error('图片加载失败'));
                image.src = fileUrl;
            });

            const loadedImage = await imageLoadPromise;

            // 使用Canvas转换图片为Blob
            const canvas = document.createElement('canvas');
            canvas.width = loadedImage.width;
            canvas.height = loadedImage.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context 创建失败');
            
            ctx.drawImage(loadedImage, 0, 0);
            
            // 转换为Blob
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Blob 转换失败'));
                }, 'image/png');
            });

            // 创建File对象并上传
            const file = new File([blob], newFileName, { type: 'image/png' });
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch(`${server}/upload`, {
                method: 'POST',
                body: formData
            });

            return (await uploadResponse.json()).url;
        } catch (error: any) {
            alert('上传失败：' + error.message);
            return '';
        }
    }


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