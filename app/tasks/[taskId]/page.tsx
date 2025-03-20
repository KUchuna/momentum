import { getSingleTask } from "@/api"
import PriorityDepartment from "@/components/HomePage/PriorityDepartment"
import TaskCommentsSection from "@/components/TaskPage/TaskCommentsSection"
import TaskInfoSection from "@/components/TaskPage/TaskInfoSection"

export default async function Page({params,}: {params: Promise<{ taskId: string }>}) {
    
    const taskId = (await params).taskId
    
    const task = await getSingleTask(taskId)

    return (
        <main className="px-[7.5rem] py-10">
            <PriorityDepartment 
                priority={task.priority}
                department={task.department}
            />
            <div className="flex justify-between">
                <TaskInfoSection 
                    task={task}
                />
                <TaskCommentsSection 
                
                />
            </div>
        </main>
    )
}