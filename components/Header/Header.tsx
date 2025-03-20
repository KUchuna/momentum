import Image from "next/image"
import Link from "next/link"
import NewEmployee from "./NewEmployee"
import { getDepartments } from "@/api"

export default async function Header() {

    const departments = await getDepartments()

    return (
        <header className="px-[7.5rem] py-[2rem] flex justify-between items-center">
            <Link href="/">
                <Image src="/logos/momentum.png" alt="Momentum Logo" width={210} height={38} />
            </Link>
            <div className="flex gap-10">
               <NewEmployee 
                departments={departments}
                header
               />
                <Link href="/newtask">
                    <button className="px-4 py-2.5 bg-primary text-white border-1 border-primary rounded-[5px] cursor-pointer flex items-center gap-1">
                    <Image src="/logos/plus.svg" alt="" width={20} height={20} /> შექმენი ახალი დავალება</button>
                </Link>
            </div>
        </header>
    )
}