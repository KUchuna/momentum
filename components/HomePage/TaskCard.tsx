"use client"

import { Task } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";


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

    const priorityColor = () => {
        switch (task.priority.id) {
          case 1:
            return "#08A508"; 
          case 2:
            return "#F7BC30"; 
          case 3:
            return "#FA4D4D"; 
          default:
            return "#8338EC";
        }
    };
    
    const departmentColor = () => {
        switch (task.department.id) {
            case 1:
                return "#89B6FF";
            case 2:
                return "#FFD86D";
            case 3:
                return "#FF66A8";
            case 4:
                return "#89B6FF";
            case 5:
                return "#FD9A6A";
            case 6:
                return "#FFD86D";
            case 7:
                return "#FF66A8";
            default:
                return "#8338EC";
        }
    }

    const slicedDepartment = () => {
        switch (task.department.id) {
            case 1:
                return "ადმინისტრაცია";
            case 2:
                return "HR";
            case 3:
                return "ფინანსები";
            case 4:
                return "მარკეტინგი";
            case 5:
                return "ლოჯისტიკა";
            case 6:
                return "ინფ. ტექ.";
            case 7:
                return "მედია";
            default:
                return "სხვა";
        }
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
        
        return new Intl.DateTimeFormat("ka-GE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date);
    };

    const formatedDueDate = formatDueDate(task.due_date)

    if(!mounted) {
        return null
    }

    return (
        <div className="flex flex-col p-[1.25rem] border rounded-[15px] cursor-pointer h-[230px]" style={{borderColor: statusColor()}} onClick={() => handleClick()}>
            <div className="flex min-w-max justify-between mb-[1.75rem]">
                <div className="flex gap-[0.625rem]">
                    <span className={`flex gap-1 rounded-[4px] border border-${priorityColor()} py-1 pl-[0.25rem] max-w-[86px] min-w-[86px] text-[12px] pr-[0.375rem]`} style={{color: priorityColor()}}><Image src={task.priority.icon} width={16} height={18} alt="" />{task.priority.name}</span>
                    <span className="rounded-[15px] text-white text-[12px] py-[0.313rem] px-[1.15rem] font-normal " style={{backgroundColor: departmentColor()}}>
                        {slicedDepartment()} 
                    </span>
                </div>
                <span>{formatedDueDate}</span>
            </div>
            <h3 className="mb-[0.75rem] text-[15px] font-bold">{task.name.slice(0,50)}</h3>
            <p className="text-[#343A40] text-[14px] mb-[1.75rem]">{task.description?.slice(0, 90)}{task.description?.length > 90 ? "..." : ""}</p>
            <div className="flex justify-between items-center mt-auto">
                <Image src={task.employee.avatar} width={31} height={31} alt="NO" className="min-w-[31px] max-w-[31px] min-h-[31px] max-h-[31px] object-cover rounded-full" />
                <div>
                    <Image src="/logos/comments.svg" alt="" width={22} height={22} />
                </div>
            </div>
        </div>
    )
}