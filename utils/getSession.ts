import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next"
import { Session } from "./session"

export async function getSession(req: any, res: any) {
    var response: Response

    // get the session data
    if (hasCookie('sessionId', { req, res })) {
        var sessionId = getCookie('sessionId', { req, res })
        if (sessionId == "") {
            sessionId = "000"
        }
        response = await fetch(`${process.env.HOST!}/session/${sessionId}`)
    } else {
        response = await fetch(`${process.env.HOST!}/session`, {
            "method": "POST",
            headers: { "Content-Type": "application/json" },
        })
    }

    if (response.status != 200) {
        deleteCookie("sessionId", { req, res })
        return {
            props: {
                sessionData: null,
                showError: true,
            }
        }
    }

    const data: Session = await response.json()

    // set the cookie data
    setCookie("sessionId", data.sessionId, { req, res, maxAge: 60 * 60 * 24 * 14 })

    return {
        props: {
            sessionData: data,
            showError: false,
        }
    }
}