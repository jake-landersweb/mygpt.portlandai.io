import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string,
    vmessages: any[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { sessionId } = req.query;

    if (sessionId == undefined || sessionId.length == 0) {
        res.status(400).json({ message: "There was no sessionId passed", vmessages: [] })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 60000)

    const response = await fetch(`${process.env.HOST!}/session/${sessionId}/custom`, {
        "method": "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        signal: controller.signal,
    })

    clearTimeout(timeout)

    const data = await response.json()

    console.log(data)

    if (response.status == 200) {
        res.status(200).json({ message: "Successfully updated.", vmessages: data['vmessages'] })
    } else {
        res.status(400).json({ message: data.message, vmessages: [] })
    }
}