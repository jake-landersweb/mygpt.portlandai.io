import QuestionType from "./questionType"



type Question = {
    title: string
    type: QuestionType
    choices: string[]
    response: string
    limit?: number
}

export default Question