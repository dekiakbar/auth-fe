import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import Link from "next/link"

type propvidersType = {
    providers: typeof getProviders
}

export default function SignIn({ providers }:propvidersType){
    return (
        <>
            <div className="relative py-16 bg-gradient-to-br from-sky-50 to-gray-200 flex h-screen flex-col">  
                <div className="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-40">
                    <div className="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12">
                        <div className="rounded-xl bg-white shadow-xl">
                            <div className="p-6 sm:p-16">
                                <div className="space-y-4">
                                    <img src="/images/auth.svg" loading="lazy" className="w-10" alt="logo"/>
                                    <h2 className="mb-8 text-2xl text-cyan-900 font-bold">
                                        Unlock the power of your account with just a few clicks.
                                    </h2>
                                </div>

                                {Object.values(providers).map((provider) => (
                                    <div className="mt-16 grid space-y-4" key={provider.name}>
                                        <button onClick={() => signIn(provider.id)} className="group border-gray-300 transition duration-300 rounded-full h-12 px-6 border-2 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
                                            <div className="relative flex items-center space-x-4 justify-center">
                                                <img src="/images/google.svg" className="absolute left-0 w-5" alt="google logo"/>
                                                <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                                                    Continue with {provider.name}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                ))}

                                <div className="mt-16 space-y-4 text-gray-600 text-center sm:-mb-8">
                                    <p className="text-xs">
                                        By proceeding, you agree to our
                                        <Link href="#" className="underline"> Terms of Use </Link>
                                        and confirm you have read our
                                        <Link href="#" className="underline"> Privacy and Cookie Statement</Link>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext){
    const session = await getServerSession(context.req, context.res, authOptions);
    
    if (session) {
        return { redirect: { destination: "/" } };
    }
  
    const providers = await getProviders();
    
    return {
        props: { 
            providers: providers ?? []
        }
    }
}