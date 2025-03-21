import { Task } from "@/types"
import Image from "next/image"
import StatusDropDown from "./StatusDropDown"
import { getStatuses } from "@/api"

interface TaskInfoSectionProps {
    task: Task
}

export default async function TaskInfoSection({task}: TaskInfoSectionProps) {

    const statuses = await getStatuses()

    const formatDateToGeorgian = (dateString: string) => {
        const date = new Date(dateString);
    
        const weekdayMap: { [key: string]: string } = {
            "Monday": "ორშ",
            "Tuesday": "სამ",
            "Wednesday": "ოთხ",
            "Thursday": "ხუთ",
            "Friday": "პარ",
            "Saturday": "შაბ",
            "Sunday": "კვი"
        };
    

        const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
        const georgianWeekday = weekdayMap[weekday];
    
        const formattedDate = new Intl.DateTimeFormat("ka-GE", {
            day: "2-digit",
            month: "numeric",
            year: "numeric"
        }).format(date);
    
        return `${georgianWeekday} - ${formattedDate}`;
    };


    return (
        <section className="w-1/2"> 
            <h1 className="text-[2.125rem] font-semibold mt-3 mb-9">{task.name}</h1>
            <p className="text-[1.125rem]">{task.description}</p>
            <div className="mt-16">
                <h2 className="text-2xl font-medium mb-[1.75rem]">დავალების დეტალები</h2>
                <div className="flex flex-col">
                    <div className="flex justify-between py-[1.438rem]">
                        <div className="flex gap-[0.375rem] items-center w-1/2">
                            <Image src="/logos/status.svg" alt="" width={22} height={22}/>
                            სტატუსი
                        </div>
                        <StatusDropDown 
                            status={task.status}
                            statuses={statuses}
                            taskId={task.id}
                        />
                    </div>
                    <div className="flex justify-between py-[1.438rem]">
                        <div className="flex gap-[0.375rem] items-center w-1/2">
                            <Image src="/logos/employee.svg" alt="" width={24} height={24}/>
                            თანამშრომელი
                        </div>
                        <div className="flex items-center gap-3 w-1/2">
                            <div className="min-w-[38px] min-h-[38px] max-w-[38px] max-h-[38px] w-full h-full rounded-full overflow-hidden">
                                <Image 
                                    src={task.employee.avatar} 
                                    alt="Employee Avatar" 
                                    width={38} 
                                    height={38}
                                    quality={100}
                                    priority
                                    className="object-cover w-full h-full" 
                                />
                            </div>
                            <div className="flex flex-col w-1/2 min-w-max">
                                <span className="font-light text-[11px] text-[#474747]">{task.department.name}</span>
                                <span className="text-[14px]">{task.employee.name} {task.employee.surname}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between py-[1.438rem]">
                        <div className="flex gap-[0.375rem] items-center w-1/2">
                            <Image src="/logos/calendar2.svg" alt="" width={24} height={24}/>
                            დავალების ვადა
                        </div>
                        <span className="w-1/2">{formatDateToGeorgian(task.due_date)}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}