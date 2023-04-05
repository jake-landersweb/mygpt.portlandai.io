import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useEffect, useState } from "react"
import Field from "../../components/field"
import { useRouter } from "next/router";
import { getSession } from "@/utils/getSession";
import ErrorPage from "@/components/error";
import { DropdownList } from "react-widgets/cjs";
import { Question, questionsValid, QuestionType, defaultQuestions } from "@/utils/question";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return getSession(req, res)
}

export default function Questions({ sessionData, showError }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)

    var [q, setq] = useState<Question[]>([])

    useEffect(() => {
        if (questionsValid(sessionData['preferences'])) {
            setq(sessionData['preferences'])
        } else {
            setq(defaultQuestions)
        }
    }, []);

    const save = async () => {
        if (!questionsValid(q)) {
            return
        }
        setIsLoading(true)


        const data = { preferences: q }
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

    const forms = []


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
                forms.push(
                    <div className="space-y-1">
                        <h3 className="font-bold text-md ml-4 text-gray-500">
                            {q[i].title}
                        </h3>
                        <DropdownList
                            value={q[i].response}
                            filter={false}
                            autoFocus={false}
                            data={q[i].choices}
                            onChange={(nextValue) => {
                                const updatedQuestions = [...q];
                                updatedQuestions[i] = {
                                    ...updatedQuestions[i],
                                    response: nextValue,
                                };
                                setq(updatedQuestions);
                            }}
                        />
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
                                <div className={`px-4 py-2 text-lg bg-container rounded-md border-2 ${q[i].response == 'True' ? "border-main" : "border-container"} sm:hover:opacity-50 transition-opacity`}>
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
                                <div className={`px-4 py-2 text-lg bg-container rounded-md border-2 ${q[i].response == 'False' ? "border-main" : "border-container"} sm:hover:opacity-50 transition-opacity`}>
                                    False
                                </div>
                            </button>
                        </div>
                    </div>
                )
        }
    }

    if (showError) {
        return <ErrorPage message="Oh no! There was an issue loading this page." />
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
            <button onClick={() => save()} className={`${questionsValid(q) ? "bg-main sm:hover:opacity-50" : "text-txt-200 bg-container sm:hover:cursor-default"} text-white h-[50px] w-[150px] px-4 py-2 rounded-md transition-all`}>
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