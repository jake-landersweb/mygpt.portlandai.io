import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useEffect, useState } from "react"
import Field from "../../components/field"
import { useRouter } from "next/router";
import Question from "@/utils/question";
import QuestionType from "@/utils/questionType";
import questionsValid from "@/utils/questionValid";
import { getSession } from "@/utils/getSession";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return getSession(req, res)
}

export default function Questions({ sessionData, showError }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)

    const questions: Question[] = [
        { title: "How would you describe your writing style?", type: QuestionType.MC, choices: ["Formal", "Informal", "Humorous", "Slang-filled"], response: "" },
        { title: "Which punctuation mark do you use most often when expressing enthusiasm?", type: QuestionType.MC, choices: ["Exclamation mark", "Emoji", "Capital letters", "None of the above"], response: "" },
        { title: "How do you respond to compliments?", type: QuestionType.MC, choices: ["Graciously accept", "Downplay the compliment", "Respond with humor", "Give a compliment in return"], response: "" },
        { title: "How do you respond to critisism?", type: QuestionType.MC, choices: ["Defensively", "Apologetically", "Seek clarification", "Ignore it"], response: "" },
        { title: "How do you use punctuation in your text?", type: QuestionType.MC, choices: ["Full and proper punctuation", "Occasional punctuation", "Minimal punctuation", "No punctuation"], response: "" },
        { title: "How do you handle disagreements in a chat?", type: QuestionType.MC, choices: ["Calmly discuss", "Debate passionately", "Avoid confrontation", "End the conversation"], response: "" },
        { title: "How do you typically end a conversation in a text?", type: QuestionType.MC, choices: ["Goodbye", "Talk to you later", "Bye!", "Ghost or fade out"], response: "" },
        { title: "How often do you use abbreviations or shorthand in your texts?", type: QuestionType.MC, choices: ["Frequently", "Occasionally", "Rarely", "Never"], response: "" },
        { title: "Which best describes your tone when communicating in writing?", type: QuestionType.MC, choices: ["Serious", "Friendly", "Sarcastic", "Neutral"], response: "" },
        { title: "How do you usually structure your sentences in writing?", type: QuestionType.MC, choices: ["Long and complex", "Short and simple ", "Varied lengths and structures", "Stream of consciousness"], response: "" },
        { title: "Which best describes your use of humor in writing?", type: QuestionType.MC, choices: ["Frequently", "Ocassionally", "Rarely", "Never"], response: "" },
        { title: "How often do you use metaphors or analogies in your writing?", type: QuestionType.MC, choices: ["Frequently", "Ocassionally", "Rarely", "Never"], response: "" },
        { title: "How do you feel about discussing personal topics in a text?", type: QuestionType.MC, choices: ["Comfortable", "Somewhat comfortable", "Uncomfortable", "Avoid at all costs"], response: "" },
        { title: "hich of these best describes your use of capitalization in texts?", type: QuestionType.MC, choices: ["Proper capitalization", "Mostly lowercase", "All caps for emphasis", "Random capitalization"], response: "" },
        { title: "What is your myers-briggs personality type?", type: QuestionType.FR, choices: [], response: "", limit: 4 },
        { title: "What is your gender?", type: QuestionType.MC, choices: ["Male", "Female", "Non-binary", "No Response"], response: "" },
        { title: "Are you a sports fan?", type: QuestionType.TF, choices: [], response: "" },
        { title: "What are some of your hobbies?", type: QuestionType.FR, choices: [], response: "", limit: 150 },
        { title: "Is there anything specific we should know about you?", type: QuestionType.FR, choices: [], response: "", limit: 150 },
        { title: "How do you feel about social media?", type: QuestionType.FR, choices: [], response: "", limit: 100 },
        { title: "How would you describe your tone of voice?", type: QuestionType.FR, choices: [], response: "", limit: 100 },
        { title: "How enthusiastic is your writing with friends?", type: QuestionType.MC, choices: ["Overly enthusiastic", "Slightly", "Not very enthusiastic", "Depends on the context"], response: "" },
        { title: "Do you usually put puncutation at the end of your sentences?", type: QuestionType.TF, choices: [], response: "" },
    ]
    var [q, setq] = useState<Question[]>([])

    useEffect(() => {
        if (sessionData['promptItems'].length == 0) {
            setq(questions)
        } else {
            setq(sessionData['promptItems'])
        }
    }, []);

    const forms = []

    const answerChoice = (idx: number, jdx: number) => {
        const updatedQuestions = [...q];
        updatedQuestions[idx] = {
            ...updatedQuestions[idx],
            response: updatedQuestions[idx].choices[jdx],
        };
        setq(updatedQuestions);
    };

    const save = async () => {
        if (!questionsValid(q)) {
            return
        }
        setIsLoading(true)


        const data = { promptItems: q }
        const response = await fetch(`/api/session/${sessionData['sessionId']}/update`, {
            "method": "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        setIsLoading(false)

        if (response.status == 200) {
            router.push("/interface");
        } else {
            alert("There was an issue updating your answers")
        }

    }

    for (let i = 0; i < q.length; i++) {
        switch (q[i].type) {
            case QuestionType.FR:
                forms.push(
                    <Field props={{
                        value: q[i].response,
                        label: q[i].title,
                        placeholder: "...",
                        errorText: "Cannot be empty",
                        inputType: "text",
                        onChanged: function (val: string): void {
                            const updatedQuestions = [...q];
                            updatedQuestions[i] = {
                                ...updatedQuestions[i],
                                response: val,
                            };
                            setq(updatedQuestions);
                        },
                        isValid: q[i].response.length != 0,
                        isTextArea: false,
                        rows: undefined,
                        columns: undefined,
                        limit: q[i].limit,
                    }} />
                )
                break
            case QuestionType.MC:
                const options = []
                for (let j = 0; j < q[i].choices.length; j++) {
                    options.push(
                        <button onClick={(_) => { answerChoice(i, j) }}>
                            <div className={`px-4 py-2 text-lg bg-container rounded-md border-2 ${q[i].response == q[i].choices[j] ? "border-main" : "border-container"} hover:opacity-50 transition-opacity`}>
                                {q[i].choices[j]}
                            </div>
                        </button>
                    )
                }
                forms.push(
                    <div className="space-y-1 w-full">
                        <h3 className="font-bold text-md ml-4 text-gray-500">
                            {q[i].title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                            {options}
                        </div>
                    </div>
                )
                break
            case QuestionType.TF:
                forms.push(
                    <div className="space-y-1 w-full">
                        <h3 className="font-bold text-md ml-4 text-gray-500">
                            {q[i].title}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={(_) => {
                                const updatedQuestions = [...q];
                                updatedQuestions[i] = {
                                    ...updatedQuestions[i],
                                    response: "True",
                                };
                                setq(updatedQuestions);
                            }}>
                                <div className={`px-4 py-2 text-lg bg-container rounded-md border-2 ${q[i].response == 'True' ? "border-main" : "border-container"} hover:opacity-50 transition-opacity`}>
                                    True
                                </div>
                            </button>
                            <button onClick={(_) => {
                                const updatedQuestions = [...q];
                                updatedQuestions[i] = {
                                    ...updatedQuestions[i],
                                    response: "False",
                                };
                                setq(updatedQuestions);
                            }}>
                                <div className={`px-4 py-2 text-lg bg-container rounded-md border-2 ${q[i].response == 'False' ? "border-main" : "border-container"} hover:opacity-50 transition-opacity`}>
                                    False
                                </div>
                            </button>
                        </div>
                    </div>
                )
        }
    }


    return <div className="space-y-4">
        <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold">Before we can begin, we need to know about you</h3>
            <p className="text-txt-400 max-w-3xl">These answers are only used to better fit the AI to replicate you. The better you answer these questions, the better the replication will be. This data will never be stored long-term or sold.</p>
        </div>
        <div className="space-y-2">
            {forms}
        </div>
        <div className="grid place-items-center">
            <button onClick={() => save()} className={`${questionsValid(q) ? "bg-main hover:opacity-50" : "text-txt-200 bg-container hover:cursor-default"} text-white h-[50px] w-[150px] px-4 py-2 rounded-md transition-all`}>
                <p className={`${isLoading ? "hidden" : ""}`}>
                    Save Answers
                </p>
                <p className={`${isLoading ? "" : "hidden"} grid place-items-center`}>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </p>
            </button>
        </div>
    </div>
}