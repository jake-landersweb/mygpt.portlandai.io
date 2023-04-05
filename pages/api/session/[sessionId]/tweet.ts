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

    const response = await fetch(`${process.env.HOST!}/session/${sessionId}/tweet`, {
        "method": "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
    })

    const data = await response.json()

    console.log(data)

    if (response.status == 200) {
        res.status(200).json({ message: "Successfully updated.", vmessages: data['vmessages'] })
    } else {
        res.status(400).json({ message: "There was an issue", vmessages: [] })
    }
}