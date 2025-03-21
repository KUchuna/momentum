"use client"

import { Task } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import PriorityDepartment from "./PriorityDepartment";

interface TaskCardProps {
    task: Task
}

export default function TaskCard({task}: TaskCardProps) {
    
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const router = useRouter()

    function handleClick() {
        router.push(`/tasks/${task.id}`)
    }

    const statusColor = () => {
        switch (task.status.id) {
            case 1:
                return "#F7BC30";
            case 2:
                return "#FB5607";
            case 3: 
                return "#FF006E";
            case 4:
                return "#3A86FF";
            default:
                return "#8338EC";
        }
    }

    const formatDueDate = (dueDate: string) => {
        const date = new Date(dueDate);
      
        return format(date, "dd MMM, yyyy", { locale: ka });
      };
      
      const formatedDueDate = formatDueDate(task.due_date);

    if(!mounted) {
        return null
    }

    console.log(task)

    return (
        <div className="flex flex-col p-[1.25rem] border rounded-[15px] cursor-pointer h-[260px]" style={{borderColor: statusColor()}} onClick={() => handleClick()}>
            <div className="flex min-w-max justify-between mb-[1.75rem]">
                <PriorityDepartment 
                    priority={task.priority}
                    department={task.department}
                />
                <span>{formatedDueDate}</span>
            </div>
            <h3 className="mb-[0.75rem] text-[15px] font-bold">{task.name.slice(0,50)}</h3>
            <p className="text-[#343A40] text-[14px] mb-[1.75rem]">{task.description?.slice(0, 90)}{task.description?.length > 90 ? "..." : ""}</p>
            <div className="flex justify-between items-center mt-auto">
                <Image src={task.employee.avatar} width={31} height={31} alt="NO" className="min-w-[31px] max-w-[31px] min-h-[31px] max-h-[31px] object-cover rounded-full" priority quality={100}/>
                <div className="flex gap-1">
                    <Image src="/logos/comments.svg" alt="" width={22} height={22} />
                    {task.total_comments}
                </div>
            </div>
        </div>
    )
}