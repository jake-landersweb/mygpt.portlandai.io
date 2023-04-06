import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return <div className="w-screen p-8 bg-container">
        <div className="flex justify-between">
            <Link href="/credits"><p className="hover:underline text-txt-300">Credits</p></Link>
            <div className="space-x-1 flex items-center">
                <Image src={"/portlandai-sm.png"} alt={"Portland AI"} height={20} width={20} />
                <p className="text-txt-300">Powered by <a className="underline hover:no-underline" href="https://portlandai.io" target="_blank" rel="noopener noreferrer">Portland AI</a></p>
            </div>
        </div>
    </div>
}