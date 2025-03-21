import { getComments, getSingleTask } from "@/api"
import PriorityDepartment from "@/components/HomePage/PriorityDepartment"
import TaskCommentsSection from "@/components/TaskPage/TaskCommentsSection"
import TaskInfoSection from "@/components/TaskPage/TaskInfoSection"

export default async function Page({params,}: {params: Promise<{ taskId: string }>}) {
    
    const taskId = (await params).taskId
    
    const task = await getSingleTask(taskId)
    const comments = await getComments(taskId)

    return (
        <main className="px-[7.5rem] py-10">
            <PriorityDepartment 
                priority={task.priority}
                department={task.department}
            />
            <div className="flex justify-between gap-[14rem]">
                <TaskInfoSection 
                    task={task}
                />
                <TaskCommentsSection 
                    comments={comments}
                    taskId={taskId}
                />
            </div>
        </main>
    )
}