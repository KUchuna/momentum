import { Tasks } from "@/types";
import TaskCard from "./TaskCard";

interface TasksGridProps {
    tasks: Tasks
}

export default function TaskGrid({tasks}: TasksGridProps) {
    return (
        <section className="flex justify-between w-full gap-[3.25rem]">
            <div className="grow basis-full w-1/4">
                <div className="bg-yellow-main text-center text-white py-[0.938rem] rounded-[10px] mb-[1.875rem] select-none">დასაწყები</div>
                <div className="flex flex-col gap-[1.875rem]">
                    {tasks.filter((task) => task.status.id === 1).map((task, index) => {
                        return (
                            <TaskCard 
                                task={task}
                                key={index}
                            /> 
                        )
                    })}
                </div>
            </div>
            <div className="grow basis-full w-1/4">
                <div className="bg-orange-main text-center text-white py-[0.938rem] rounded-[10px] mb-[1.875rem] select-none">პროგრესში</div>
                <div className="flex flex-col gap-[1.875rem]">
                    {tasks.filter((task) => task.status.id === 2).map((task, index) => {
                        return (
                            <TaskCard 
                                task={task}
                                key={index}
                            /> 
                        )
                    })}
                </div>
            </div>
            <div className="grow basis-full w-1/4">
                <div className="bg-pink-main text-center text-white py-[0.938rem] rounded-[10px] mb-[1.875rem] select-none">მზად ტესტირებისთვის</div>
                <div className="flex flex-col gap-[1.875rem]">
                    {tasks.filter((task) => task.status.id === 3).map((task, index) => {
                        return (
                            <TaskCard 
                                task={task}
                                key={index}
                            /> 
                        )
                    })}
                </div>
            </div>
            <div className="grow basis-full w-1/4">
                <div className="bg-blue-main text-center text-white py-[0.938rem] rounded-[10px] mb-[1.875rem] select-none">დასრულებული</div>
                <div className="flex flex-col gap-[1.875rem]">
                    {tasks.filter((task) => task.status.id === 4).map((task, index) => {
                        return (
                            <TaskCard 
                                task={task}
                                key={index}
                            /> 
                        )
                    })}
                </div>
            </div>
        </section>
    )
}