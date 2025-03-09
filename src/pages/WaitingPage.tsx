import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { useEffect, useRef } from "react"

const WaitingPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const navigate = useNavigate()

    const routeWelcome = () => {
        navigate('/welcome')
    }

    useEffect(() => {
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.play()
                } catch (error) {
                    console.log('视频自动播放失败:', error)
                }
            }
        }

        playVideo()
    }, [])

    return (
        <div
            onClick={routeWelcome}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
            }}>
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                onCanPlayThrough={(e) => { e.currentTarget.play().catch(() => { }) }}
                onError={() => alert('视频加载失败，请刷新页面')}
            >
                <source src="/waiting.mp4" type="video/mp4" />
            </video>
        </div>
    )
}

export default WaitingPage