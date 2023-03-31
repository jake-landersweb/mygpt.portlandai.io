import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { getSession } from '@/utils/getSession';
import { useRouter } from 'next/router';


export default function Home() {
  const router = useRouter();

  return <>
    <Head>
      <title>MyGPT - Portland AI</title>
      <meta name="description" content="Your own personalized language model to generate text more like you." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <div className="">
        <div className="grid place-items-center gap-2">
          <h1 className='text-main text-6xl font-medium'>MyGPT</h1>
          <p className='text-txt-400 text-lg max-w-xl text-center'>Unlock your unique voice with our AI-powered personal content creator.</p>
          <div className="grid place-items-center">
            <button onClick={() => { router.push("/interface") }} className={`bg-main hover:opacity-50 text-white h-[50px] w-[150px] px-4 py-2 rounded-md transition-all`}>
              <p>
                Get Started
              </p>
            </button>
          </div>
        </div>
      </div>
    </main>
  </>

}
