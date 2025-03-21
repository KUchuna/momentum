"use client"

import { useState } from "react"
import Image from "next/image"
import { updateStatusAction } from "@/app/actions";

interface Status {
    id: number;
    name: string;
}

interface StatusDropDownProps {
    status: Status;
    taskId: number;
    statuses: Status[];
}

export default function StatusDropDown({status, statuses, taskId}: StatusDropDownProps) {

    const [showDropDown, setShowDropDown] = useState(false)

    function toggleDropDown() {
        setShowDropDown(!showDropDown)
    }

    async function handleStatusChange(status: Status) {
        try {
            await updateStatusAction(taskId, status.id)
        } catch(error) {
            console.log(error)
        } 
    }

    return (
        <div className={`bg-white border-[1px] border-[#DEE2E6] relative rounded-[5px] h-[46px] flex items-center p-[0.875rem] cursor-pointer w-1/2 min-w-max select-none`} onClick={() => toggleDropDown()}>
            <span className="text-sm font-light">
                {status.name}
            </span>
            <Image src="/logos/downarrow.svg" alt="" width={14} height={14} className="ml-auto"/>
            {showDropDown && <div className="bg-white absolute left-0 origin-top-left bottom-0 translate-y-[100%] w-full border-[1px] border-[#DEE2E6] rounded-[5px] z-10 min-w-max select-none">
                {statuses.map((status, index) => {
                    return (
                        <p key={index} className="p-[0.875rem] text-sm font-light hover:bg-gray-50 flex gap-[0.375rem]" onClick={() => handleStatusChange(status)}>{status.name}</p>
                    )
                })}
            </div>}
        </div>
    )
}