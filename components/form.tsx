import { useState } from "react"
import Field from "./field"
import ReactiveImage from "./reactive-image"

type FormProps = {
    nameLabel?: string
    emailLabel?: string
    bodyLabel?: string
    tag?: string
}

const Form = ({ props }: { props: FormProps }) => {
    const { nameLabel = "Jason Perry", emailLabel = "jason@email.com", bodyLabel = "What can Sapphire can do for you today?", tag = "" } = props
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [body, setBody] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const emailIsValid = () => {
        if (email == "") {
            return false
        } else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$/.test(email)) {
            return true
        } else {
            return false
        }
    }

    const formValid = () => {
        if (name == "") {
            return false
        } else if (!emailIsValid()) {
            return false
        } else if (body == "") {
            return false
        } else {
            return true
        }
    }

    const validationText = () => {
        if (name == "" && email == "" && body == "") {
            return ""
        } else if (name == "") {
            return "Name cannot be empty."
        } else if (!emailIsValid()) {
            return "Please enter a valid email."
        } else if (body == "") {
            return "Body cannot be empty."
        } else {
            return "Your information looks good!"
        }
    }

    async function sendEmail() {
        if (formValid()) {
            try {
                setIsLoading(true)
                const b = {
                    "email": email,
                    "name": name,
                    "body": body,
                }
                const resp = await fetch('/api/waitlist', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(b)
                })
                console.log(resp)
                if (resp.status == 200) {
                    setShowSuccess(true)
                    setTimeout(() => setShowSuccess(false), 5000)
                    setName("")
                    setEmail("")
                    setBody("")
                } else {
                    setShowError(true)
                    setTimeout(() => setShowError(false), 5000)
                }

                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.log(error)
            }
        }
    }

    return <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 items-center">
        <ReactiveImage props={{
            src: "/svg/waitlist.svg",
            alt: "Phone Call",
            divClass: "hidden md:block max-w-[500px]",
            imgClass: "min-w-[300px]"
        }} />
        <div className="space-y-8">
            <div className="sapce-y-2 text-center md:text-left">
                <h3 className='text-2xl font-bold text-txt-700'>Join Our Waitlist To Gain Access To The Limited Beta.</h3>
            </div>
            <div className="space-y-4">
                <Field props={{
                    value: name,
                    label: "Name",
                    placeholder: nameLabel,
                    errorText: "Cannot be empty",
                    inputType: "text",
                    onChanged: (val) => setName(val),
                    isValid: name.length != 0,
                }} />
                <Field props={{
                    value: email,
                    label: "Email",
                    placeholder: emailLabel,
                    errorText: "Cannot be empty",
                    inputType: "text",
                    onChanged: (val) => setEmail(val),
                    isValid: email.length != 0,
                }} />
                <Field props={{
                    value: body,
                    label: "Your Projected Use Case",
                    placeholder: bodyLabel,
                    errorText: "Cannot be empty",
                    inputType: "text",
                    onChanged: (val) => setBody(val),
                    isValid: body.length != 0,
                    isTextArea: true,
                    rows: 8,
                }} />
                <div className="grid place-items-center">
                    <p className={`${showError ? "dark:text-red-300 text-red-500" : showSuccess ? "dark:text-green-400 text-green-600" : "text-gray-500"} h-[30px]`}>{showError ? "There was an issue" : showSuccess ? "Successfully sent your message." : validationText()}</p>
                    <div className="flex space-x-4">
                        <button onClick={() => sendEmail()} className={`${formValid() ? "bg-main hover:opacity-50" : "text-txt-200 bg-main bg-opacity-50 hover:cursor-default"} text-white h-[50px] w-[150px] px-4 py-2 rounded-md transition-all`}>
                            <p className={`${isLoading ? "hidden" : ""}`}>
                                Contact Us
                            </p>
                            <p className={`${isLoading ? "" : "hidden"} grid place-items-center`}>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default Form