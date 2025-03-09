import axios from 'axios'
import promptTemplate from './prompt.json'

// ComfyUI API的基础配置
const COMFY_API = {
  BASE_URL: 'http://i-1.gpushare.com:14761',
  CLIENT_ID: Date.now().toString(),
}

type Workflow = any

export interface GenerateRequest {
  // 16 种MBTI人格
  mbti: string,
  // 星座
  zodiac: string,
  // 今日心情
  mood: string,
  // 用户名字
  name: string,
  // 酒精度数
  alcohol: number
}

export interface GenerateResponse {
  frontUrl: string,
  backUrl: string,
}

// 创建基础的文生图工作流
export const createTextToImageWorkflow = (req: GenerateRequest): Workflow => {
  return JSON.parse(JSON.stringify(promptTemplate)
    // .replace("897892992933", Math.floor(Math.random() * 1000000).toString())
    .replace("$MBTI", req.mbti)
    .replace("$ZODIAC", req.zodiac)
    .replace("$MOOD", req.mood)
    .replace("$NAME", req.name)
    .replace("$ALCOHOL", `${req.alcohol}%`)
  )
}

// 轮询图片生成状态的接口
interface PollingResponse {
  outputs?: {
    [key: string]: {
      images: Array<{
        filename: string
        subfolder: string
        type: string
      }>
    }
  }
  status: {
    status_str: string
    completed: boolean
    messages: Array<[string, any]>
  }
}

// 主要的文生图函数
export const generateImage = async (
  req: GenerateRequest,
  options: {
    pollInterval?: number
    maxAttempts?: number
  } = {}
): Promise<GenerateResponse> => {
  const { pollInterval = 1000, maxAttempts = 60 } = options
  const workflow = createTextToImageWorkflow(req)

  try {
    // 发送工作流请求
    const queueResponse = await axios.post(
      `${COMFY_API.BASE_URL}/prompt`,
      { prompt: workflow, client_id: COMFY_API.CLIENT_ID }
    )

    const promptId: string = queueResponse.data.prompt_id

    // 轮询检查生成状态
    let attempts = 0
    while (attempts < maxAttempts) {
      const historyResponse = await axios.get<Record<string, PollingResponse>>(
        `${COMFY_API.BASE_URL}/history/${promptId}`
      )

      const response = historyResponse.data[promptId]
      if (!response) {
        attempts++
        await new Promise(resolve => setTimeout(resolve, pollInterval))
        continue
      }
      const { status, outputs } = response

      if (status.completed && status.status_str === 'success') {
        if (outputs) {
          // return images
          return extractCard(outputs)
        }
        throw new Error('生成图片失败，没有输出内容')
      }

      if (!status.completed) {
        attempts++
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      }
    }

    throw new Error('生成图片超时')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API请求失败: ${error.message}`)
    }
    throw error
  }
}

// TODO real output
const extractCard: (output: any) => GenerateResponse = (output: any) => {
  const frontObj = output['89']['images'][0]
  const backObj = output['109']['images'][0]
  return {
    frontUrl: generateImageUrl(frontObj.filename, frontObj.type),
    backUrl: generateImageUrl(backObj.filename, backObj.type)
  }
}
export const generateImageUrl = (fileName: string, type: string) => {
  return `${COMFY_API.BASE_URL}/view?filename=${fileName}&type=${type}`
}