import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectInput from '../components/SelectInput';
import './InputPage.css';
import Button from '../components/Button';
import NumberInput from '../components/NumberInput';
import { GenerateRequest } from '../ai/comfy';

const InputPage: React.FC = () => {
    const navigate = useNavigate();

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};

        if (!userData.name.trim()) {
            newErrors.name = true;
        }
        if (!userData.mbti) {
            newErrors.mbti = true;
        }
        if (!userData.mood) {
            newErrors.mood = true;
        }
        if (!userData.zodiac) {
            newErrors.zodiac = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStart = () => {
        if (validateForm()) {
            const time = new Date().getTime();
            console.log(userData);
            const queue = JSON.parse(localStorage.getItem("queue") ?? "[]");
            queue.push(time);
            localStorage.setItem("queue", JSON.stringify(queue));
            localStorage.setItem(`userData-${time}`, JSON.stringify(userData));
            navigate('/loading');
        }
    };

    const handleCancel = ()=>{
        navigate('/welcome')
    }

    const [userData, setUserData] = useState<GenerateRequest>({
        name: '',
        mbti: '',
        mood: '',
        zodiac: '',
        alcohol: 10
    });

    const mbtiOptions = [
        "ISTJ - 检查者",
        "ISFJ - 守护者",
        "INFJ - 提倡者",
        "INTJ - 建筑师",
        "ISTP - 鉴赏家",
        "ISFP - 探险家",
        "INFP - 调停者",
        "INTP - 逻辑学家",
        "ESTP - 企业家",
        "ESFP - 表演者",
        "ENFP - 竞选者",
        "ENTP - 辩论家",
        "ESTJ - 总管",
        "ESFJ - 执政官",
        "ENFJ - 主人公",
        "ENTJ - 指挥官"
    ];


    const zodiacOptions = [
        "摩羯座", // 12月22日-1月19日
        "水瓶座", // 1月20日-2月18日
        "双鱼座", // 2月19日-3月20日
        "白羊座", // 3月21日-4月19日
        "金牛座", // 4月20日-5月20日
        "双子座", // 5月21日-6月21日
        "巨蟹座", // 6月22日-7月22日
        "狮子座", // 7月23日-8月22日
        "处女座", // 8月23日-9月22日
        "天秤座", // 9月23日-10月23日
        "天蝎座", // 10月24日-11月22日
        "射手座"  // 11月23日-12月21日
    ];

    const moodOptions = ["开心", "伤心", "焦虑", "兴奋", "平静", "愤怒", "悲伤", "幸福"];

    const handleInputChange = (field: keyof GenerateRequest, value: string | number) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    return (
        <div
            id="g-_3_8-_1_3"
            className="g-artboard"
            style={{
                maxWidth: '2266px',
                maxHeight: '1488px',
                aspectRatio: '1.523',
                minWidth: '0'
            }}
        >
            <img
                id="g-_3_8-_1_3-img"
                className="g-aiImg"
                alt=""
                src="_3_8-_1_3.jpg"
            />
            <div
                id="g-ai0-1"
                className="g-_1 g-aiAbs g-aiPointText"
                style={{
                    top: '19.1112%',
                    marginTop: '-44.4px',
                    left: '56.9082%',
                    width: '241px'
                }}
            >
                <p className="g-pstyle0">
                    <label className='pxfont'>称 呼：</label>
                    <SelectInput
                        options={[]}
                        value={userData.name}
                        mode='input-only'
                        onChange={(value) => handleInputChange('name', value)}
                        placeholder="输入称呼"
                        error={!!errors.name}
                    />
                </p>
            </div>
            <div
                id="g-ai0-2"
                className="g-_1 g-aiAbs g-aiPointText"
                style={{
                    top: '31.0064%',
                    marginTop: '-44.4px',
                    left: '56.9082%',
                    width: '231px'
                }}
            >
                <p className="g-pstyle1">
                    <label className='pxfont'>MBTI ：</label>
                    <SelectInput
                        options={mbtiOptions}
                        value={userData.mbti}
                        mode='select-only'
                        onChange={(value) => handleInputChange('mbti', value)}
                        placeholder="选择MBTI"
                        error={!!errors.mbti}
                    /></p>
            </div>
            <div
                id="g-ai0-3"
                className="g-_1 g-aiAbs g-aiPointText"
                style={{
                    top: '42.9015%',
                    marginTop: '-44.4px',
                    left: '56.9082%',
                    width: '241px'
                }}
            >
                <p className="g-pstyle0">
                    <label className='pxfont'>心 情：</label>
                    <SelectInput
                        options={moodOptions}
                        value={userData.mood}
                        onChange={(value) => handleInputChange('mood', value)}
                        placeholder="选择或输入心情"
                        error={!!errors.mood}
                    />
                </p>
            </div>
            <div
                id="g-ai0-4"
                className="g-_1 g-aiAbs g-aiPointText"
                style={{
                    top: '54.8639%',
                    marginTop: '-44.4px',
                    left: '56.9082%',
                    width: '241px'
                }}
            >
                <p className="g-pstyle0">
                    <label className="pxfont">
                        星 座：
                    </label>
                    <SelectInput
                        options={zodiacOptions}
                        value={userData.zodiac}
                        mode='select-only'
                        onChange={(value) => handleInputChange('zodiac', value)}
                        placeholder="选择星座"
                        error={!!errors.zodiac}
                    /></p>
            </div>
            <div
                id="g-ai0-5"
                className="g-_1 g-aiAbs g-aiPointText"
                style={{
                    top: '66.7591%',
                    marginTop: '-44.4px',
                    left: '56.9082%',
                    width: '258px'
                }}
            >
                <p className="g-pstyle1">
                    <label className='pxfont'>酒精度：</label>
                    <NumberInput
                        min={5}
                        max={20}
                        value={userData.alcohol}
                        onChange={(value) => handleInputChange('alcohol', value)}
                        renderTitle={(value) => `${value}°`}
                    />
                </p>
            </div>
            <div
                id="g-ai0-6"
                className="g-_1 g-aiAbs g-aiPointText"
                style={{
                    top: '80.8306%',
                    marginTop: '-61.8px',
                    left: '11.3345%',
                    width: '434px'
                }}
            >
                <p className="g-pstyle2 pxfont">输入你的信息</p>
                <p className="g-pstyle2 pxfont">让我们开始调酒吧～</p>
            </div>
            <Button
                id="g-ai0-7"
                style={{
                    top: '79%',
                    marginTop: '-32.4px',
                    left: '49%',
                }} text='返回'
                textClassName='g-pstyle3'
                onClick={handleCancel}
                size='small'
            />
            <Button
                id="g-ai0-7"
                style={{
                    top: '79%',
                    marginTop: '-32.4px',
                    left: '62%',
                }} text='开始调酒'
                textClassName='g-pstyle3'
                onClick={handleStart}
            />
        </div>
    );
};

export default InputPage;