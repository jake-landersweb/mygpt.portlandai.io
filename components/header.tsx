import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return <div className="bg-container p-2 w-screen fixed top-0 left-0 border-b border-b-gray-300 z-50 grid place-items-center">
        <div className="flex space-x-4 items-center">
            <Link href="/">
                <Image src={"/portlandai.svg"} alt={"Portland AI"} height={40} width={40} />
            </Link>
            <Link href="/interface">
                <p className="text-txt-500 hover:underline">Live Demo</p>
            </Link>
            <Link href="/#plus">
                <p className="text-txt-500 hover:underline">MyGPT+</p>
            </Link>
        </div>
    </div>
}