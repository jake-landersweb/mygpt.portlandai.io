import Field from "@/components/field";
import { getSession } from "@/utils/getSession"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Interface.module.css';
import NumberPicker from "react-widgets/NumberPicker";
import { DropdownList } from "react-widgets/cjs";
import Link from "next/link";
import ErrorPage from "@/components/error";
import { questionsValid } from "@/utils/question";
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { Session } from "@/utils/session";
import { FaUserCircle } from "react-icons/fa";
import ReactiveImage from "@/components/reactive-image";
import { RxHamburgerMenu } from 'react-icons/rx'
import { AiOutlineSend } from 'react-icons/ai'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return getSession(req, res)
}

export default function Interface({ sessionData, showError }: { sessionData: Session, showError: boolean }) {
    const router = useRouter();

    const availableModes = [
        { value: 10, label: "I Need a Cover Letter" },
        { value: 1, label: "Post To My Network on LinkedIn" },
        { value: 2, label: "I Need to Tweet!" },
        { value: 3, label: "Inspiration for a TikTok Script" },
        { value: 20, label: "Time To Write An Essay" },
        { value: 30, label: "I Need To Compose an Email" },
        { value: 40, label: "Custom Content Generation" },
    ]

    const availableTemps = [
        { value: 0.6, label: "Plain, Boring, and Predictable" },
        { value: 0.7, label: "Simple and Deterministic" },
        { value: 0.85, label: "Slightly Creative" },
        { value: 1.0, label: "Quite Creative" },
        { value: 1.2, label: "Very Creative" },
        { value: 1.4, label: "Crazy and Eccentric" },
        { value: 1.6, label: "Batshit Insane - (Can time out)" },
    ]

    const [session, setSession] = useState(sessionData)

    const [type, setType] = useState(availableModes[0])
    const [reset, setReset] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [prompt, setPrompt] = useState("")

    const [paragraphs, setParagraphs] = useState(3)
    const [temp, setTemp] = useState(availableTemps[2])

    const [showFeedback, setShowFeedback] = useState(false)

    const [extendPrompt, setExtendPrompt] = useState("")

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


        const mode = availableModes.find(item => item.value === sessionData['currentType']);
        if (mode != undefined) {
            setType(mode)
        }

        setSession(sessionData)
    }, []);

    const sendChat = async () => {
        if (session.vmessages.length == 0 && prompt.length != 0) {
            setIsLoading(true)

            let response: Response
            let data: any

            let msg: string
            let url: string

            switch (type.value) {
                case 10:
                    msg = "Create me a cover letter!"
                    data = { jobPosting: prompt, writingSample: session.writingSample, resume: session.resume, reset: reset, vmessage: msg }
                    url = "coverLetter"
                    break
                case 1:
                    msg = prompt
                    data = { postIdea: prompt, writingSample: session.writingSample, resume: session.resume, reset: reset, vmessage: msg }
                    url = "linkedinPost"
                    break
                case 2:
                    msg = prompt
                    data = { postIdea: prompt, writingSample: session.writingSample, resume: session.resume, reset: reset, vmessage: msg }
                    url = "tweet"
                    break
                case 3:
                    msg = prompt
                    data = { postIdea: prompt, writingSample: session.writingSample, resume: session.resume, reset: reset, vmessage: msg }
                    url = "tiktok"
                    break
                case 20:
                    msg = prompt
                    data = { topic: prompt, paragraphs: paragraphs, writingSample: session.writingSample, resume: session.resume, reset: reset, vmessage: msg }
                    url = "essay"
                    break
                case 30:
                    msg = prompt
                    data = { topic: prompt, writingSample: session.writingSample, resume: session.resume, reset: reset, vmessage: msg }
                    url = "essay"
                    break
                case 40:
                    msg = prompt
                    data = { task: prompt, temp: temp.value, writingSample: session.writingSample, resume: session.resume, reset: reset, vmessage: msg }
                    url = "custom"
                    break
                default:
                    console.log("Invalid option")
                    return
            }

            setSession((prevState) => ({
                ...prevState,
                vmessages: [...prevState.vmessages, { role: "user", content: msg }],
            }));
            response = await fetch(`/api/session/${sessionData['sessionId']}/${url!}`, {
                "method": "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            setIsLoading(false)

            if (response!.status == 200) {
                const data = await response!.json()
                setSession(data.session)
                setTimeout(() => {
                    scrollToBottom()
                }, 600);
            } else {
                const data = await response!.json()
                alert(data.message)
            }

            setIsLoading(false)
        } else {
            setReset(true)
            setShowFeedback(false)
            setSession((prevState) => ({
                ...prevState,
                vmessages: [],
                messages: [],
            }));
        }
    }

    const extendChat = async () => {
        if (extendPrompt.length != 0) {
            setIsLoading(true)
            const data = { message: extendPrompt }
            setSession((prevState) => ({
                ...prevState,
                vmessages: [...prevState.vmessages, { role: "user", content: extendPrompt }],
            }));
            setExtendPrompt("")
            const response = await fetch(`/api/session/${sessionData['sessionId']}/extend`, {
                "method": "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (response.status == 200) {
                const data = await response!.json()
                setSession(data.session)
                setShowFeedback(true)
                setTimeout(() => {
                    scrollToBottom()
                }, 600);
            } else {
                const data = await response!.json()
                alert(data.message)
            }
            setIsLoading(false)
        }
    }

    const sendFeedback = async (rating: number) => {
        console.log(session)
        let data = { rating: rating, messages: session['messages'], sessionId: session['sessionId'] }
        const response = await fetch(`/api/feedback`, {
            "method": "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (response.status == 200) {
            setShowFeedback(false)
        } else {
            console.log("There was an issue sending the feedback")
        }
    }

    const conversation = () => {
        let items = []

        for (let i = 0; i < session.vmessages.length; i++) {
            let content
            if (session.vmessages[i].role == 'user') {
                content = userCell(session.vmessages[i].content)
            } else {
                content = botCell(session.vmessages[i].content)
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

        if (isLoading) {
            items.push(<CSSTransition key={"loadingcell"} timeout={300} classNames={{
                enter: styles['content-enter'],
                enterActive: styles['content-enter-active'],
                exit: styles['content-exit'],
                exitActive: styles['content-exit-active']
            }}>
                {loadingCell()}
            </CSSTransition>)
        }

        return items
    }

    const userCell = (m: string) => {
        return <div className="grid grid-cols-8 gap-2">
            <div className="col-span-2 grid place-items-center">
                <div className="space-y-2 grid place-items-center my-2">
                    <FaUserCircle className="text-main" size={40} />
                    <p className="text-txt-500 text-sm">User</p>
                </div>
            </div>
            <div className="col-span-6 flex flex-col justify-center my-2 text-left">
                {m}
            </div>
        </div>
    }

    const botCell = (m: string) => {
        return <div className="grid grid-cols-8 bg-container rounded-md gap-2">
            <div className="col-span-2 grid place-items-center">
                <div className="space-y-2 grid place-items-center m-2">
                    <ReactiveImage props={{
                        src: "/favicon.ico",
                        alt: "",
                        divClass: "max-h-[50px]",
                        imgClass: "max-h-[50px]"
                    }} />
                    <p className="text-txt-500 text-sm">SyncAI</p>
                </div>
            </div>
            <div className="col-span-6 flex flex-col justify-center m-2 text-left">
                {m}
            </div>
        </div>
    }

    const loadingCell = () => {
        return <div className="grid grid-cols-8 bg-container rounded-md gap-2">
            <div className="col-span-2 grid place-items-center">
                <div className="space-y-2 grid place-items-center m-2">
                    <ReactiveImage props={{
                        src: "/favicon.ico",
                        alt: "",
                        divClass: "max-h-[50px]",
                        imgClass: "max-h-[50px]"
                    }} />
                    <p className="text-txt-500 text-sm">SyncAI</p>
                </div>
            </div>
            <div className="col-span-6 flex flex-col justify-center m-2 text-left">
                <p className={``}>
                    <svg className="animate-spin h-5 w-5 text-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </p>
            </div>
        </div>
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
            case 20:
                return essay()
            case 30:
                return email()
            case 40:
                return custom()
            default:
                return <div className=""></div>
        }
    }

    const coverLetter = () => {
        return <Field props={{
            value: prompt,
            label: "The Job Posting",
            placeholder: "We are looking for ...",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPrompt(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: prompt.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 3000
        }} />
    }

    const linkedinPost = () => {
        return <Field props={{
            value: prompt,
            label: "Post Idea",
            placeholder: "I have just accepted a job!",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPrompt(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: prompt.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    const tweet = () => {
        return <Field props={{
            value: prompt,
            label: "Tweet Idea",
            placeholder: "I have just accepted a job!",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPrompt(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: prompt.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    const tiktok = () => {
        return <Field props={{
            value: prompt,
            label: "Script Idea",
            placeholder: "I have just accepted a job!",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPrompt(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: prompt.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    const essay = () => {
        return <div className="space-y-1">
            <div className="max-w-2xl space-y-1">
                <h3 className="font-bold text-md ml-4 text-gray-500">
                    Paragraphs
                </h3>
                <NumberPicker
                    max={5}
                    min={1}
                    defaultValue={paragraphs}
                    onChange={value => setParagraphs(value!)}
                />
            </div>
            <Field props={{
                value: prompt,
                label: "Essay Topic",
                placeholder: "I love nature so much!",
                errorText: "Cannot be empty",
                inputType: "text",
                onChanged: function (val: string): void {
                    setPrompt(val.replace(/[\t\r\n ]+/g, ' '))
                },
                isValid: prompt.length != 0,
                isTextArea: true,
                rows: 8,
                columns: 50,
                limit: 500
            }} />
        </div>
    }

    const email = () => {
        return <Field props={{
            value: prompt,
            label: "Email Topic",
            placeholder: "I'm not making it to work tomorrow",
            errorText: "Cannot be empty",
            inputType: "text",
            onChanged: function (val: string): void {
                setPrompt(val.replace(/[\t\r\n ]+/g, ' '))
            },
            isValid: prompt.length != 0,
            isTextArea: true,
            rows: 8,
            columns: 50,
            limit: 500
        }} />
    }

    const custom = () => {
        return <div className="space-y-2">
            <div className="space-y-1 max-w-2xl">
                <h3 className="font-bold text-md ml-4 text-gray-500">
                    Writing Creativity
                </h3>
                <DropdownList
                    dataKey="value"
                    textField="label"
                    defaultValue={temp}
                    value={temp}
                    filter={false}
                    autoFocus={false}
                    data={availableTemps}
                    onChange={(nextValue) => setTemp(nextValue)}
                />
            </div>
            <Field props={{
                value: prompt,
                label: "The Task at Hand",
                placeholder: "I need a paragraph written about trees. My favorite trees are oak, and here is why i like them:",
                errorText: "Cannot be empty",
                inputType: "text",
                onChanged: function (val: string): void {
                    setPrompt(val.replace(/[\t\r\n ]+/g, ' '))
                },
                isValid: prompt.length != 0,
                isTextArea: true,
                rows: 8,
                columns: 50,
                limit: 500
            }} />
        </div>
    }

    if (showError) {
        return <ErrorPage message="Oh no! There was an issue loading this page." />
    }

    return <div className="">
        <div className="space-y-2 pb-16">
            <h3 className="md:pl-8 text-2xl font-bold">1. Some more personalization</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <Field props={{
                    value: session.resume,
                    label: "My Resume",
                    placeholder: "My Name is ...",
                    errorText: "Cannot be empty",
                    inputType: "text",
                    onChanged: function (val: string): void {
                        setSession((prevState) => ({
                            ...prevState,
                            resume: val.replace(/[\t\r\n ]+/g, ' '),
                        }));
                    },
                    isValid: session.resume.length != 0,
                    isTextArea: true,
                    rows: 10,
                    columns: undefined,
                    limit: 2000,
                }} />
                <Field props={{
                    value: session.writingSample,
                    label: "An Example of My Writing",
                    placeholder: "This is used to get an idea of how you write. The contents of this writing does not matter.",
                    errorText: "Cannot be empty",
                    inputType: "text",
                    onChanged: function (val: string): void {
                        setSession((prevState) => ({
                            ...prevState,
                            writingSample: val.replace(/[\t\r\n ]+/g, ' '),
                        }));
                    },
                    isValid: session.writingSample.length != 0,
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
                    onChange={(nextValue) => {
                        setType(nextValue)
                        setSession((prevState) => ({
                            ...prevState,
                            vmessages: [],
                            messages: [],
                        }));
                    }}
                />
            </div>
        </div>

        <div className="space-y-2 pb-16">
            <h3 className="md:pl-8 text-2xl font-bold">3. Provide specific guidance for the AI</h3>
            {getView()}
        </div>
        <div className="grid place-items-center">
            <button onClick={() => sendChat()} className={`${prompt.length == 0 && session.vmessages.length == 0 ? "bg-container hover:cursor-not-allowed" : "bg-main text-white"} hover:opacity-50 px-4 py-2 rounded-md transition-all`}>
                <p className="">
                    {session.vmessages.length == 0 ? "Ask SyncAI" : "Clear Response"}
                </p>
            </button>
        </div>
        <div className={`tracking-wide max-w-4xl mx-auto pb-16 text-center`}>
            <TransitionGroup>
                {conversation()}
                {showFeedback ? <CSSTransition key={"feedback"} timeout={300} classNames={{
                    enter: styles['content-enter'],
                    enterActive: styles['content-enter-active'],
                    exit: styles['content-exit'],
                    exitActive: styles['content-exit-active']
                }}>
                    <div className="items-center grid place-items-center sm:flex sm:justify-between text-txt-500">
                        <p className="">How was this response?</p>
                        <div className="flex sm:space-x-2 justify-between sm:justify-normal my-2">
                            <button onClick={() => sendFeedback(1)} className="md:hover:bg-zinc-200 rounded-md px-4 py-2 transition-all">
                                <div className="space-y-1 grid place-items-center">
                                    <FiThumbsUp className="" size={20} />
                                    <p className="text-xs">Better</p>
                                </div>
                            </button>
                            <button onClick={() => sendFeedback(-1)} className="md:hover:bg-zinc-200 rounded-md px-4 py-2 transition-all">
                                <div className="space-y-1 grid place-items-center">
                                    <FiThumbsDown className="" size={20} />
                                    <p className="text-xs">Worse</p>
                                </div>
                            </button>
                            <button onClick={() => sendFeedback(0)} className="md:hover:bg-zinc-200 rounded-md px-4 py-2 transition-all">
                                <div className="space-y-1 grid place-items-center">
                                    <RxHamburgerMenu className="" size={20} />
                                    <p className="text-xs">The Same</p>
                                </div>
                            </button>
                            <button onClick={() => setShowFeedback(false)} className="md:hover:bg-zinc-200 rounded-md px-4 py-2 transition-all">
                                <IoClose className="" size={20} />
                            </button>
                        </div>
                    </div>
                </CSSTransition> : <></>}
                {session.vmessages.length > 1 ? <CSSTransition key={"extendConvo"} timeout={300} classNames={{
                    enter: styles['content-enter'],
                    enterActive: styles['content-enter-active'],
                    exit: styles['content-exit'],
                    exitActive: styles['content-exit-active']
                }}>
                    <div className="grid grid-cols-8 gap-1">
                        <div className="mt-2 col-span-7">
                            <Field props={{
                                value: extendPrompt,
                                label: "",
                                placeholder: "I dont like ...",
                                errorText: "",
                                inputType: "text",
                                onChanged: function (val: string): void {
                                    setExtendPrompt(val)
                                },
                                isValid: true,
                                isTextArea: false,
                                rows: undefined,
                                columns: undefined,
                                limit: undefined
                            }} />
                        </div>
                        <button onClick={() => extendChat()} className={`${extendPrompt.length == 0 ? "bg-container md:hover:cursor-not-allowed" : "bg-main text-white"} col-span-1 mt-2 rounded-md grid place-items-center md:hover:opacity-50 md:transition-opacity`}>
                            <AiOutlineSend size={20} />
                        </button>
                    </div>
                </CSSTransition> : <></>}
            </TransitionGroup>
        </div>
        <div className="my-8 text-center grid place-items-center">
            <p className="text-txt-400">Not quite getting the right tone in your outputs?</p>
            <Link href="/questions"><p className="text-main underline hover:opacity-50 transition-all">Change my questionare answers</p></Link>
        </div>
    </div>
}