import { Question } from "./question"

export type Session = {
    sessionId: string
    expires: number
    created: number
    preferences: Question[]
    resume: string
    writingSample: string
    currentType: number
    messages: Message[]
    vmessages: Message[]
    updated: number | undefined
}

export type Message = {
    role: string
    content: string
}