import { Task } from "@/types"
import PriorityDepartment from "../HomePage/PriorityDepartment"
import Image from "next/image"
import StatusDropDown from "./StatusDropDown"
import { getStatuses } from "@/api"

interface TaskInfoSectionProps {
    task: Task
}

export default async function TaskInfoSection({task}: TaskInfoSectionProps) {

    const statuses = await getStatuses()

    return (
        <section className="w-1/2">
            <PriorityDepartment 
                priority={task.priority}
                department={task.department}
            /> 
            <h1 className="text-[2.125rem] font-semibold mt-3 mb-9">{task.name}</h1>
            <p className="text-[1.125rem]">{task.description}</p>
            <div className="mt-16">
                <h2 className="text-2xl font-medium mb-[1.75rem]">დავალების დეტალები</h2>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <div className="flex gap-[0.375rem]">
                            <Image src="/logos/status.svg" alt="" width={22} height={22}/>
                            სტატუსი
                        </div>
                        <StatusDropDown 
                            status={task.status}
                            statuses={statuses}
                            taskId={task.id}
                        />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-[0.375rem]">
                            <Image src="/logos/employee.svg" alt="" width={24} height={24}/>
                            თანამშრომელი
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-[0.375rem]">
                            <Image src="/logos/calendar2.svg" alt="" width={24} height={24}/>
                            დავალების ვადა
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}