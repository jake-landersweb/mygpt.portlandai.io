import { Session } from '@/utils/session';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string,
    session: Session | undefined
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { sessionId, url } = req.query;

    if (sessionId == undefined || sessionId.length == 0 || url == undefined || url.length == 0) {
        res.status(400).json({ message: "There was no sessionId passed", session: undefined })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 60000)

    const response = await fetch(`${process.env.HOST!}/session/${sessionId}/${url}`, {
        "method": "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        signal: controller.signal,
    })

    clearTimeout(timeout)

    const data: Session = await response.json()

    if (response.status == 200) {
        res.status(200).json({ message: "Successfully updated.", session: data })
    } else {
        console.log(data)
        res.status(400).json({ message: "There was an issue with the request", session: undefined })
    }
}