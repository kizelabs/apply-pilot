import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

if (!process.env.OPENAI_BASE_URL) {
  throw new Error('OPENAI_BASE_URL is not set')
}

if (!process.env.OPENAI_MODEL) {
  throw new Error('OPENAI_MODEL is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

export const MODEL = process.env.OPENAI_MODEL
