import Image from "next/image";
import ReactiveImage from "./reactive-image";

export default function ErrorPage({ message }: { message: string }) {
    return <div className="m-8 space-y-8">
        <ReactiveImage props={{
            src: "/svg/server-down.svg",
            alt: "Server Down",
            divClass: "max-w-[500px]",
            imgClass: undefined
        }} />
        <h3 className="text-xl text-center grid place-items-center max-w-xl">{message}</h3>
    </div>
}