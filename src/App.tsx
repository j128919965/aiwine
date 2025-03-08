import { useState } from 'react'
import './App.css'
import SelectInput from './components/SelectInput'
import { generateImage, GenerateResponse } from './ai/comfy'

function App() {
  const [generatedImages, setGeneratedImages] = useState<GenerateResponse>({
    frontUrl: "http://i-1.gpushare.com:14761/view?filename=ComfyUI_temp_rabex_00002_.png&type=temp",
    backUrl: "http://i-1.gpushare.com:14761/view?filename=ComfyUI_temp_votop_00002_.png&type=temp"
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState({
    mbti: '',
    star: '',
    emoji: '',
    name: '',
    alcohol: ''
  })

  const mbtiOptions = [
    { value: "ISTJ", label: "ISTJ - 检查者" },
    { value: "ISFJ", label: "ISFJ - 守护者" },
    { value: "INFJ", label: "INFJ - 提倡者" },
    { value: "INTJ", label: "INTJ - 建筑师" },
    { value: "ISTP", label: "ISTP - 鉴赏家" },
    { value: "ISFP", label: "ISFP - 探险家" },
    { value: "INFP", label: "INFP - 调停者" },
    { value: "INTP", label: "INTP - 逻辑学家" },
    { value: "ESTP", label: "ESTP - 企业家" },
    { value: "ESFP", label: "ESFP - 表演者" },
    { value: "ENFP", label: "ENFP - 竞选者" },
    { value: "ENTP", label: "ENTP - 辩论家" },
    { value: "ESTJ", label: "ESTJ - 总管" },
    { value: "ESFJ", label: "ESFJ - 执政官" },
    { value: "ENFJ", label: "ENFJ - 主人公" },
    { value: "ENTJ", label: "ENTJ - 指挥官" },
  ]

  const starOptions = [
    { value: "aries", label: "白羊座" },
    { value: "taurus", label: "金牛座" },
    { value: "gemini", label: "双子座" },
    { value: "cancer", label: "巨蟹座" },
    { value: "leo", label: "狮子座" },
    { value: "virgo", label: "处女座" },
    { value: "libra", label: "天秤座" },
    { value: "scorpio", label: "天蝎座" },
    { value: "sagittarius", label: "射手座" },
    { value: "capricorn", label: "摩羯座" },
    { value: "aquarius", label: "水瓶座" },
    { value: "pisces", label: "双鱼座" },
  ]

  const emojiOptions = [
    { value: "happy", label: "😊 开心" },
    { value: "excited", label: "🤩 兴奋" },
    { value: "relaxed", label: "😌 放松" },
    { value: "tired", label: "😪 疲惫" },
    { value: "sad", label: "😢 伤心" },
    { value: "angry", label: "😠 生气" },
    { value: "love", label: "🥰 恋爱" },
    { value: "party", label: "🎉 派对" },
  ]

  const alcoholOptions = [
    { value: "8", label: "8%" },
    { value: "10", label: "10%" },
    { value: "12", label: "12%" },
    { value: "13.5", label: "13.5%" },
    { value: "14", label: "14%" },
    { value: "15", label: "15%" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateImage = async () => {
    console.log(userData)
    if (!userData.mbti || !userData.star || !userData.emoji || !userData.name || !userData.alcohol) {
      setError('请填写所有必填字段')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const images = await generateImage({
        ...userData,
        alcohol: parseFloat(userData.alcohol)
      })
      setGeneratedImages(images)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成图片时发生错误')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app-container">
      <h1>AI Wine 选择器</h1>
      <div className="user-inputs">
        <div className="input-group">
          <label>MBTI人格：</label>
          <SelectInput
            options={mbtiOptions}
            value={userData.mbti}
            onChange={(value) => handleInputChange('mbti', value)}
            placeholder="请选择或输入MBTI人格"
            mode='select-only'
          />
        </div>

        <div className="input-group">
          <label>星座：</label>
          <SelectInput
            options={starOptions}
            value={userData.star}
            onChange={(value) => handleInputChange('star', value)}
            placeholder="请选择或输入星座"
          />
        </div>

        <div className="input-group">
          <label>今日心情：</label>
          <SelectInput
            options={emojiOptions}
            value={userData.emoji}
            onChange={(value) => handleInputChange('emoji', value)}
            placeholder="请选择或输入表情"
          />
        </div>

        <div className="input-group">
          <label>你的名字：</label>
          <SelectInput
            options={[]}
            value={userData.name}
            onChange={(value) => handleInputChange('name', value)}
            placeholder="请输入名字"
            mode='input-only'
          />
        </div>

        <div className="input-group">
          <label>酒精度数：</label>
          <SelectInput
            options={alcoholOptions}
            value={userData.alcohol}
            onChange={(value) => handleInputChange('alcohol', value)}
            placeholder="请选择或输入酒精度数"
          />
        </div>
      </div>

      <button
        onClick={handleGenerateImage}
        disabled={isGenerating}
        className="generate-button"
      >
        {isGenerating ? '生成中...' : '生成 AI 图片'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {generatedImages && (
        <div className="images-container">
          <img
            src={generatedImages.frontUrl}
            alt={`Generated wine front`}
            className="generated-image"
          />

          <img
            src={generatedImages.backUrl}
            alt={`Generated wine back`}
            className="generated-image"
          />
        </div>
      )}
    </div>
  )
}

export default App
