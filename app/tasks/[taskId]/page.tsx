import { getSingleTask } from "@/api"

export default async function Page({params,}: {params: Promise<{ taskId: string }>}) {
    
    const taskId = (await params).taskId
    
    const task = await getSingleTask(taskId)

    return (
        <main className="px-[7.5rem] py-10">
            My task: {task.name}
        </main>
    )
}