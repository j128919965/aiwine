import { useNavigate } from "react-router-dom"
import Button from "../components/Button"

const InitPage = ()=>{

    const navigate = useNavigate()

    return (
        
        <Button 
            text="Start"
            onClick={()=>{
                document.documentElement.requestFullscreen()
                navigate('/waiting')
            }}
            textClassName='g-pstyle3'
        />
    )
}

export default InitPage