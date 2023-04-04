import ReactiveImage from '@/components/reactive-image';
import Head from 'next/head'
import Link from 'next/link';
import { HiDocumentText } from 'react-icons/hi'
import { IoLogoLinkedin, IoNewspaper } from 'react-icons/io5'
import { IoIosMail, IoIosMailUnread } from 'react-icons/io'
import { AiOutlineTwitter } from 'react-icons/ai'
import { FaTiktok } from 'react-icons/fa'
import { BsFillGearFill } from 'react-icons/bs'
import Form from '@/components/form';

export default function Home() {

  const workCell = ({ title, desc, src, alt, rev }: { title: string, desc: string, src: string, alt: string, rev: boolean }) => {
    return <div className="grid md:grid-cols-2 gap-4 place-items-center text-center md:text-left grid-flow-row-dense">
      <div className={`space-y-2 ${rev ? "order-1 md:order-2" : "order-1"}`}>
        <h3 className='text-2xl font-bold'>{title}</h3>
        <p className='text-gray-500'>{desc}</p>
      </div>
      <div className={rev ? "order-2 md:order-1" : "order-2"}>
        <ReactiveImage props={{
          src: src,
          alt: alt,
          divClass: undefined,
          imgClass: undefined
        }} />
      </div>
    </div>
  }

  const typeCell = ({ title, desc, icon }: { title: string, desc: string, icon: JSX.Element }) => {
    return <div className="bg-container rounded-md p-4">
      <div className="mb-2 bg-main rounded-md p-2 w-min">
        {icon}
      </div>
      <h3 className='text-xl font-bold'>{title}</h3>
      <p className='text-gray-400'>{desc}</p>
    </div>
  }

  return <>
    <Head>
      <title>MyGPT - Portland AI</title>
      <meta name="description" content="Your own personalized language model to generate text more like you." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <div className="space-y-32">
        <div className="grid place-items-center text-center">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">Introducing <span className='text-main'>My</span>GPT</h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">An AI-powered personal content creator to empower creators to unlock their unique voices.</p>
          <div className="mt-4 video-player-controls">
            <video width="100%" height="auto" className='max-w-[700px] object-scale-down rounded-md border border-container' controls>
              <source src="/videos/mygpt-demo.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="flex space-x-2 mt-4">
            <Link href={'/interface'}><p className='btn-sub'>Live Demo</p></Link>
            <Link href={'#plus'}><p className='btn-main'>MyGPT+</p></Link>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className='text-4xl font-bold tracking-tight leading-none text-center'>How It Works</h2>
          {workCell({
            title: "Answer A Questionare",
            desc: "In order for the AI to accurately generate text like you would, a questionare has been crafted to get a sense of your writing style.",
            src: "/images/questions.png",
            alt: "MyGPT Questions",
            rev: false,
          })}
          {workCell({
            title: "Resume and Writing Sample",
            desc: "The AI will dynamically pull relevant information from your resume and generate content with a similar writing style to the provided sample.",
            src: "/images/interface.png",
            alt: "MyGPT Questions",
            rev: true,
          })}
          {workCell({
            title: "Generate Personalized Content",
            desc: "Select from the pre-set options and let the AI generate content just like you would!",
            src: "/images/reply.png",
            alt: "MyGPT Questions",
            rev: false,
          })}
        </div>
        <div className="space-y-8">
          <h2 className='text-4xl font-bold tracking-tight leading-none text-center'>Available Content Types</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {typeCell({
              title: "Cover Letter",
              desc: "Paste in a job description and have an AI tailor a cover letter using your resume.",
              icon: <HiDocumentText size={40} className='text-white' />,
            })}
            {typeCell({
              title: "LinkedIn Post",
              desc: "Perfect that LinkedIn post to announce your achievements to your network.",
              icon: <IoLogoLinkedin size={40} className='text-white' />,
            })}
            {typeCell({
              title: "Tweet",
              desc: "Spark some creativity to create the perfect tweet! Who knows, maybe Elon will heart it.",
              icon: <AiOutlineTwitter size={40} className='text-white' />,
            })}
            {typeCell({
              title: "TikTok Script",
              desc: "It can be hard to nail the tone of new social media platforms, let the AI generate a script how you would.",
              icon: <FaTiktok size={40} className='text-white' />,
            })}
            {typeCell({
              title: "Custom Post",
              desc: "Do we not support a platform you want to post on? Explain it and let the AI try and create something that works!",
              icon: <BsFillGearFill size={40} className='text-white' />,
            })}
            {typeCell({
              title: "Essay",
              desc: "Writer's block can be hard to overcome, AI essay generation gives a good starting point to refine your writing.",
              icon: <IoNewspaper size={40} className='text-white' />,
            })}
            {typeCell({
              title: "Email",
              desc: "Draft up a new email following a strict set of guidelines by the AI.",
              icon: <IoIosMail size={40} className='text-white' />,
            })}
            {typeCell({
              title: "Email Reply",
              desc: "Need help finding the write words to say? The AI will give a great first email draft to respond to your connections.",
              icon: <IoIosMailUnread size={40} className='text-white' />,
            })}
          </div>
        </div>
        <div id="plus" className="space-y-8">
          <div className="grid place-items-center">
            <div className="grid max-w-screen-xl px-4 py-8 mx-auto gap-4 lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
              <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">MyGPT <span className='text-main'>Plus</span></h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">MyGPT plus takes the core idea the live demo employs and implements it at the next level. Using the next generation language model from OpenAI, GPT-4, vast amounts of information can be imported to create next-level personalized and tailored content.</p>
              </div>
              <div className="lg:mt-0 lg:col-span-5 grid place-items-center">
                <ReactiveImage props={{
                  src: '/svg/chat-bot.svg',
                  alt: 'Chat bot',
                  divClass: "max-w-[500px]",
                  imgClass: ""
                }} />
              </div>
            </div>
          </div>
          <div className="">
            <Form props={{
              nameLabel: "Name",
              emailLabel: "Email",
              bodyLabel: "I want to write my knowledge reports faster!",
              tag: ""
            }} />
          </div>
        </div>
      </div>
    </main>
  </>

}
