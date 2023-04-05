export type Question = {
    id: number,
    title: string
    modelTitle: string
    type: QuestionType
    choices: string[]
    response: string
    limit?: number
}

export enum QuestionType { MC, FR, TF }

export const defaultQuestions: Question[] = [
    { id: 0, title: "How would you describe your writing style?", modelTitle: "Writing Style", type: QuestionType.MC, choices: ["Formal and professional", "Conversational and casual", "Creative and descriptive", "Persuasive and argumentative"], response: "" },
    { id: 1, title: "How do you use punctuation in your text?", modelTitle: "Puncutation", type: QuestionType.MC, choices: ["Full and proper punctuation", "Occasional punctuation", "Minimal punctuation", "No punctuation"], response: "" },
    { id: 2, title: "How often do you use abbreviations or shorthand in your texts?", modelTitle: "Abbreviations", type: QuestionType.MC, choices: ["Frequently", "Occasionally", "Rarely", "Never"], response: "" },
    { id: 3, title: "Which best describes your tone when communicating in writing?", modelTitle: "Tone", type: QuestionType.MC, choices: ["Formal", "Informal", "Friendly", "Authoritative", "Persuasive", "Objective", "Subjective", "Humorous", "Inspirational", "Sincere", "Sarcastic"], response: "" },
    { id: 4, title: "How do you usually structure your sentences in writing?", modelTitle: "Sentence structure", type: QuestionType.MC, choices: ["Long and complex", "Short and simple ", "Varied lengths and structures", "Stream of consciousness"], response: "" },
    { id: 5, title: "How often do you use metaphors or analogies in your writing?", modelTitle: "Metaphor use", type: QuestionType.MC, choices: ["Frequently", "Ocassionally", "Rarely", "Never"], response: "" },
    { id: 6, title: "What is your education?", modelTitle: "Education", type: QuestionType.MC, choices: ["No formal education", "Elementary school", "Middle school", "High school / secondary school", "Vocational / technical training", "Associate degree", "Bachelor's degree", "Postgraduate diploma / graduate certificate", "Master's degree", "Doctoral degree (Ph.D., Ed.D., etc.)", "Postdoctoral fellowship", "Professional certification (e.g., PMP, CPA, etc.)", "Continuing education / professional development courses"], response: "" },
    { id: 7, title: "What is your myers-briggs personality type?", modelTitle: "Myers-Briggs", type: QuestionType.MC, choices: ["ESTJ", "ENTJ", "ESFJ", "ENFJ", "ISTJ", "ISFJ", "INTJ", "INFJ", "ESTP", "ESFP", "ENTP", "ENFP", "ISTP", "ISFP", "INTP", "INFP"], response: "", },
    { id: 8, title: "Where are you from?", modelTitle: "Demographic", type: QuestionType.FR, choices: [], response: "", limit: 50 },
    { id: 9, title: "What is your occupation?", modelTitle: "Occupation", type: QuestionType.FR, choices: [], response: "", limit: 50 },
    { id: 10, title: "What are some common phrases you use?", modelTitle: "Common phrases", type: QuestionType.FR, choices: [], response: "", limit: 100 },
    { id: 11, title: "What is some common jargon in your industry?", modelTitle: "Industry jargon (be tentative with use)", type: QuestionType.FR, choices: [], response: "", limit: 100 },
]

export function questionsValid(q: Question[]) {
    if (q.length === 0) {
        console.log("No preferences found")
        return false
    }

    for (let i = 0; i < q.length; i++) {
        if (q[i].response == "") {
            console.log("Preference response empty")
            return false
        }
    }

    if (q.length !== defaultQuestions.length) {
        console.log("Preferences length does not match")
        return false
    }

    // for (let i = 0; i < q.length; i++) {
    //     if (q[i].id !== defaultQuestions[i].id || q[i].title !== defaultQuestions[i].title || q[i].choices !== defaultQuestions[i].choices) {
    //         console.log("The question metadata does not match")
    //         return false
    //     }
    // }

    return true
}