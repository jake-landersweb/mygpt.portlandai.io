import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { sessionId } = req.query;

    if (sessionId == undefined || sessionId.length == 0) {
        res.status(400).json({ message: "There was no sessionId passed" })
    }

    const response = await fetch(`${process.env.HOST!}/session/${sessionId}`, {
        "method": "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
    })

    const data = await response.json()

    console.log(data)

    if (response.status == 200) {
        res.status(200).json({ message: "Successfully updated." })
    } else {
        res.status(400).json({ message: "There was an issue" })
    }
}