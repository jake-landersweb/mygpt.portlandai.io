import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const response = await fetch(`${process.env.HOST!}/feedback`, {
        "method": "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
    })

    if (response.status == 200) {
        res.status(200).json({ message: "Successfully posted feedback" })
    } else {
        res.status(400).json({ message: "There was an issue posting the feedback" })
    }
}