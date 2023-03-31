import Question from "./question"

export default function questionsValid(q: Question[]) {
    if (q.length == 0) {
        return false
    }

    for (let i = 0; i < q.length; i++) {
        if (q[i].response == "") {
            return false
        }
    }
    return true
}