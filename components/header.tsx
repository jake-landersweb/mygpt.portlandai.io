import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return <div className="bg-container p-2 w-screen fixed top-0 left-0 border-b border-b-gray-300 z-50">
        <Link href="/">
            <div className="flex space-x-2 items-center max-w-[1300px] mx-auto">
                <Image src={"/portlandai.svg"} alt={"Portland AI"} height={40} width={40} />
                <p className="text-main text-xl font-bold">MyGPT</p>
            </div>
        </Link>
    </div>
}