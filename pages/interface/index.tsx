import Field from "@/components/field";
import { getSession } from "@/utils/getSession"
import questionsValid from "@/utils/questionValid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Interface.module.css';
import NumberPicker from "react-widgets/NumberPicker";
import "react-widgets/styles.css";
import { DropdownList } from "react-widgets/cjs";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return getSession(req, res)
}

export default function Interface({ sessionData, showError }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();

    const availableModes = [
        { value: 10, label: "I Need a Cover Letter" },
        { value: 1, label: "I Want a LinkedIn Post" },
        { value: 2, label: "Twitter!" },
        { value: 3, label: "I Need a TikTok Script" },
        { value: -1, label: "Im Posting On Another Platform" },
        { value: 20, label: "I Need to Write an Essay" },
    ]

    const [isLoading, setIsLoading] = useState(false)
    const [resume, setResume] = useState("")
    const [writing, setWriting] = useState("")
    const [jobPosting, setJobPosting] = useState("")
    const [postIdea, setPostIdea] = useState("")
    const [essayPrompt, setEssayPrompt] = useState("")
    const [paragraphs, setParagraphs] = useState(3)
    const [resp, setResp] = useState("")
    const [reset, setReset] = useState(false)
    const [type, setType] = useState(availableModes[0])
    const [prompt, setPrompt] = useState("")

    function scrollToBottom() {
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = scrollHeight - windowHeight;

        window.scrollTo({
            top: scrollPosition,
            behavior: "smooth"
        });
    }

    useEffect(() => {
        // make sure the session is valid
        if (sessionData['promptItems'].length == 0) {
            router.push("/questions");
        }
        if (!questionsValid(sessionData['promptItems'])) {
            router.push("/questions");
        }

        // update variables
        setResume(sessionData['resume'])
        setWriting(sessionData['writingSample'])

        if (sessionData['vmessages'].length != 0) {
            setResp(sessionData['vmessages'][1]['content'])
        }
    }, []);

    const sendChat = async () => {
        if (resp.length == 0) {
            setIsLoading(true)

            let response: Response
            let data: any

            switch (type.value) {
                case 10:
                    data = { message: jobPosting, reset: reset, writingSample: writing, resume: resume }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/cover-letter`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break
                case 1:
                case 2:
                case 3:
                    data = { message: postIdea, reset: reset, writingSample: writing, resume: resume, type: type.value }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/post`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break
                case 20:
                    data = { message: essayPrompt, reset: reset, writingSample: writing, paragraphs: paragraphs }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/essay`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break
                case -1:
                    data = { message: postIdea, reset: reset, writingSample: writing, resume: resume, type: type.value, prompt: "" }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/post`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break

            }

            setIsLoading(false)

            if (response!.status == 200) {
                const data = await response!.json()
                setResp(data['vmessages'][1]['content'])
                setTimeout(() => {
                    scrollToBottom()
                }, 600);
            } else {
                alert("There was an issue updating your answers")
            }

            setIsLoading(false)
        } else {
            setReset(true)
            setResp("")
        }
    }

    const getView = () => {
        switch (type.value) {
            case 10:
                return coverLetter()
            case 1:
            case 2:
            case 3:
                return postView()
            case -1:
                return customPostView()
            case 20:
                return essayView()
            default:
                return <div className=""></div>
        }
    }

    const coverLetter = () => {
        return <Field props={{
            value: jobPosting,
            label: "The Job Posting",
            placeholder: "We are looking for ...",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setJobPosting(val)
            },
            isValid: jobPosting.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 3000
        }} />
    }

    const postView = () => {
        return <Field props={{
            value: postIdea,
            label: "My Post Idea",
            placeholder: "I got a new job!",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPostIdea(val)
            },
            isValid: postIdea.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    const customPostView = () => {
        return <div className="grid md:grid-cols-2 gap-4">
            <Field props={{
                value: postIdea,
                label: "My Post Idea",
                placeholder: "I got a new job!",
                errorText: "Cannot be empty",
                inputType: "text",
                onChanged: function (val: string): void {
                    setPostIdea(val)
                },
                isValid: postIdea.length != 0,
                isTextArea: true,
                rows: 8,
                columns: 50,
                limit: 500
            }} />
            <Field props={{
                value: prompt,
                label: "Explain The Platform",
                placeholder: "Explain a bit about what platform you are posting this content onto",
                errorText: "Cannot be empty",
                inputType: "text",
                onChanged: function (val: string): void {
                    setPrompt(val)
                },
                isValid: prompt.length != 0,
                isTextArea: true,
                rows: 8,
                columns: 50,
                limit: 500
            }} />
        </div>
    }

    const essayView = () => {
        return <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <h3 className="font-bold text-md ml-4 text-gray-500">
                    How Many Paragraphs?
                </h3>
                <div className="max-w-[75px]">
                    <NumberPicker
                        defaultValue={paragraphs}
                        max={5}
                        min={1}
                        onChange={value => setParagraphs(value!)}
                    />
                </div>
            </div>
            <Field props={{
                value: essayPrompt,
                label: "What is your essay about?",
                placeholder: "Paste in a rubric or explain.",
                errorText: "Cannot be empty",
                inputType: "text",
                onChanged: function (val: string): void {
                    setEssayPrompt(val)
                },
                isValid: essayPrompt.length != 0,
                isTextArea: true,
                rows: 8,
                columns: 50,
                limit: 1000
            }} />
        </div>
    }

    return <div className="">

        <div className="space-y-2 pb-16">
            <h3 className="md:pl-8 text-2xl font-bold">1. Some more personalization</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <Field props={{
                    value: resume,
                    label: "My Resume",
                    placeholder: "My Name is ...",
                    errorText: "Cannot be empty",
                    inputType: "text",
                    onChanged: function (val: string): void {
                        setResume(val)
                    },
                    isValid: resume.length != 0,
                    isTextArea: true,
                    rows: 10,
                    columns: undefined,
                    limit: 2000,
                }} />
                <Field props={{
                    value: writing,
                    label: "An Example of My Writing",
                    placeholder: "This is used to get an idea of how you write. The contents of this writing does not matter.",
                    errorText: "Cannot be empty",
                    inputType: "text",
                    onChanged: function (val: string): void {
                        setWriting(val)
                    },
                    isValid: writing.length != 0,
                    isTextArea: true,
                    rows: 10,
                    columns: undefined,
                    limit: 1000,
                }} />
            </div>
        </div>
        <div className="space-y-2 pb-16">
            <h3 className="md:pl-8 text-2xl font-bold">2. Select what content you want to create</h3>
            <div className="max-w-2xl">
                <DropdownList
                    dataKey="value"
                    textField="label"
                    defaultValue={type}
                    value={type}
                    filter={false}
                    autoFocus={false}
                    data={availableModes}
                    onChange={(nextValue) => setType(nextValue)}
                />
            </div>
        </div>

        <div className="space-y-2 pb-16">
            <h3 className="md:pl-8 text-2xl font-bold">3. Provide specific guidance for the AI</h3>
            {getView()}
        </div>

        <div className={`tracking-wide max-w-4xl mx-auto pb-16 text-center`}>
            <TransitionGroup component={null}>
                {resp && (
                    <CSSTransition key={resp} timeout={300} classNames={{
                        enter: styles['content-enter'],
                        enterActive: styles['content-enter-active'],
                        exit: styles['content-exit'],
                        exitActive: styles['content-exit-active']
                    }}>
                        <p>{resp}</p>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>

        <div className="grid place-items-center">
            <button onClick={() => sendChat()} className={`${true ? "bg-main hover:opacity-50" : "text-txt-200 bg-container hover:cursor-default"} text-white h-[50px] w-[150px] px-4 py-2 rounded-md transition-all`}>
                <p className={`${isLoading ? "hidden" : ""}`}>
                    {resp.length == 0 ? "GPT ME" : "Clear Response"}
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