import Link from "next/link"

export default function Credits() {
    const item = (title: string, desc: string, link: string) => {
        return <div className="text-center">
            <h4 className="text-xl font-medium">{title}</h4>
            <p className="text-gray-500">{desc}</p>
            <Link href={link}><p className="text-main hover:opacity-50 transition-opacity">{link}</p></Link>
        </div>
    }

    return <div className="p-8">
        <h2 className="text-center grid place-items-center text-2xl font-bold mb-8">List Of Tools That Made This Website Possible</h2>
        <div className="space-y-2">
            {item("NextJS", "Framework used for site creation", "https://nextjs.org/")}
            {item("Tailwind", "CSS utility framwork used for styling", "https://tailwindcss.com/")}
            {item("OpenAI GPT", "Large language model used to process requests", "https://openai.com/")}
            {item("AWS DynamoDB", "Database used for hosting session", "https://aws.amazon.com/dynamodb/")}
            {item("AWS Chalice", "Managed Python REST api deployment framework", "https://github.com/aws/chalice")}
            {item("Mock U Phone", "To generate macbook air mockups", "https://mockuphone.com")}
            {item("unDraw", "For svg tech assets", "https://undraw.co/")}
        </div>
    </div>
}