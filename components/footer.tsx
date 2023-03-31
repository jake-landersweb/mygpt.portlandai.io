import Image from "next/image";

export default function Footer() {
    return <div className="w-screen p-8 bg-container">
        <div className="flex space-x-2 justify-end">
            <Image src={"/portlandai.svg"} alt={"Portland AI"} height={20} width={20} />
            <p className="text-txt-300">Powered by Portland AI</p>
        </div>
    </div>
}