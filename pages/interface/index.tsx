import Field from "@/components/field";
import { getSession } from "@/utils/getSession"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Interface.module.css';
import NumberPicker from "react-widgets/NumberPicker";
// import "react-widgets/styles.css";
import { DropdownList } from "react-widgets/cjs";
import Link from "next/link";
import ErrorPage from "@/components/error";
import { questionsValid } from "@/utils/question";
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return getSession(req, res)
}

export default function Interface({ sessionData, showError }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();

    const availableModes = [
        { value: 10, label: "I Need a Cover Letter" },
        { value: 1, label: "Post To My Network on LinkedIn" },
        { value: 2, label: "I Need to Tweet!" },
        { value: 3, label: "Inspiration for a TikTok Script" },
    ]

    const [type, setType] = useState(availableModes[0])
    const [reset, setReset] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [resume, setResume] = useState("")
    const [writing, setWriting] = useState("")
    const [vmessages, setVMessages] = useState<[{ role: string, content: string }] | []>([])

    const [jobPosting, setJobPosting] = useState("")
    const [postIdea, setPostIdea] = useState("")

    const [showFeedback, setShowFeedback] = useState(false)

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
        if (sessionData['preferences'].length == 0) {
            router.push("/questions");
        }
        if (!questionsValid(sessionData['preferences'])) {
            router.push("/questions");
        }

        // update variables
        setResume(sessionData['resume'])
        setWriting(sessionData['writingSample'])

        if (sessionData['vmessages'].length != 0) {
            setVMessages(sessionData['vmessages'])
        }
    }, []);

    const sendChat = async () => {
        if (vmessages.length == 0) {
            setIsLoading(true)

            let response: Response
            let data: any

            let msg

            switch (type.value) {
                case 10:
                    msg = "Create me a cover letter!"
                    setVMessages([{ role: "user", content: msg }])
                    data = { jobPosting: jobPosting, writingSample: writing, resume: resume, reset: reset, vmessage: msg }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/cover-letter`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break
                case 1:
                    msg = postIdea
                    setVMessages([{ role: "user", content: msg }])
                    data = { postIdea: postIdea, writingSample: writing, resume: resume, reset: reset, vmessage: msg }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/linkedin-post`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break
                case 2:
                    msg = postIdea
                    setVMessages([{ role: "user", content: msg }])
                    data = { postIdea: postIdea, writingSample: writing, resume: resume, reset: reset, vmessage: msg }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/tweet`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break
                case 3:
                    msg = postIdea
                    setVMessages([{ role: "user", content: msg }])
                    data = { postIdea: postIdea, writingSample: writing, resume: resume, reset: reset, vmessage: msg }
                    response = await fetch(`/api/session/${sessionData['sessionId']}/tiktok`, {
                        "method": "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })
                    break
            }

            setIsLoading(false)

            if (response!.status == 200) {
                const data = await response!.json()
                setVMessages(data['vmessages'])
                setShowFeedback(true)
                sessionData = data
                setTimeout(() => {
                    scrollToBottom()
                }, 600);
            } else {
                alert("There was an issue updating your answers")
            }

            setIsLoading(false)
        } else {
            setReset(true)
            setShowFeedback(false)
            setVMessages([])
        }
    }

    const sendFeedback = async (rating: number) => {
        if (rating != 0) {
            let data = { rating: rating, messages: sessionData['messages'], sessionId: sessionData['sessionId'] }
            const response = await fetch(`/api/feedback`, {
                "method": "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (response.status == 200) {
                setShowFeedback(false)
            } else {
                alert("There was an issue posting the feedback")

            }
        }
    }

    const conversation = () => {
        let items = []

        for (let i = 0; i < vmessages.length; i++) {
            let content
            if (vmessages[i]['role'] == 'user') {
                content = <div className="flex justify-between">
                    <div className="w-[100px]"></div>
                    <p className="bg-main py-2 px-4 w-fit text-white rounded-b-lg rounded-l-lg rounded-tr-sm">{vmessages[i]['content']}</p>
                </div>
            } else {
                content = <div className="flex justify-between">
                    <p className="bg-container w-fit py-2 px-4 text-left rounded-b-lg rounded-r-lg rounded-tl-sm">{vmessages[i]['content']}</p>
                    <div className="w-[100px]"></div>
                </div>
            }
            items.push(<CSSTransition key={i} timeout={300} classNames={{
                enter: styles['content-enter'],
                enterActive: styles['content-enter-active'],
                exit: styles['content-exit'],
                exitActive: styles['content-exit-active']
            }}>
                {content}
            </CSSTransition>)
        }

        return items
    }

    const getView = () => {
        switch (type.value) {
            case 10:
                return coverLetter()
            case 1:
                return linkedinPost()
            case 2:
                return tweet()
            case 3:
                return tiktok()
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
                setJobPosting(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: jobPosting.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 3000
        }} />
    }

    const linkedinPost = () => {
        return <Field props={{
            value: postIdea,
            label: "Post Idea",
            placeholder: "I have just accepted a job!",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPostIdea(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: postIdea.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    const tweet = () => {
        return <Field props={{
            value: postIdea,
            label: "Tweet Idea",
            placeholder: "I have just accepted a job!",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPostIdea(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: postIdea.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    const tiktok = () => {
        return <Field props={{
            value: postIdea,
            label: "Script Idea",
            placeholder: "I have just accepted a job!",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPostIdea(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: postIdea.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    if (showError) {
        return <ErrorPage message="Oh no! There was an issue loading this page." />
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
                        setResume(val.replace(/[\t\r\n ]+/g, ' '))
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
                        setWriting(val.replace(/[\t\r\n ]+/g, ' '))
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
            <TransitionGroup className="space-y-2">
                {conversation()}
                {showFeedback ? <CSSTransition key={"feedback"} timeout={300} classNames={{
                    enter: styles['content-enter'],
                    enterActive: styles['content-enter-active'],
                    exit: styles['content-exit'],
                    exitActive: styles['content-exit-active']
                }}>
                    <div className="px-4 py-2 items-center bg-container rounded-md grid place-items-center sm:flex sm:justify-between text-txt-500">
                        <p className="">How was this response?</p>
                        <div className="flex sm:space-x-2 justify-between sm:justify-normal">
                            <button onClick={() => sendFeedback(1)} className="md:hover:bg-zinc-200 rounded-md px-4 py-2 transition-all">
                                <div className="space-y-1 grid place-items-center">
                                    <FiThumbsUp className="" size={20} />
                                    <p className="text-xs">Good</p>
                                </div>
                            </button>
                            <button onClick={() => sendFeedback(0)} className="md:hover:bg-zinc-200 rounded-md px-4 py-2 transition-all">
                                <div className="space-y-1 grid place-items-center">
                                    <FiThumbsDown className="" size={20} />
                                    <p className="text-xs">Bad</p>
                                </div>
                            </button>
                            <button onClick={() => setShowFeedback(false)} className="md:hover:bg-zinc-200 rounded-md px-4 py-2 transition-all">
                                <IoClose className="" size={20} />
                            </button>
                        </div>
                    </div>
                </CSSTransition> : <></>}
            </TransitionGroup>
        </div>

        <div className="grid place-items-center">
            <button onClick={() => sendChat()} className={`${true ? "bg-main hover:opacity-50" : "text-txt-200 bg-container hover:cursor-default"} text-white h-[50px] w-[150px] px-4 py-2 rounded-md transition-all`}>
                <p className={`${isLoading ? "hidden" : ""}`}>
                    {vmessages.length == 0 ? "GPT ME" : "Clear Response"}
                </p>
                <p className={`${isLoading ? "" : "hidden"} grid place-items-center`}>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </p>
            </button>
        </div>
        <div className="my-8 text-center grid place-items-center">
            <p className="text-txt-400">Not quite getting the right tone in your outputs?</p>
            <Link href="/questions"><p className="text-main underline hover:opacity-50 transition-all">Change my questionare answers</p></Link>
        </div>
    </div>
}