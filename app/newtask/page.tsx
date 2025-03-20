import { getDepartments, getEmployees, getPriorities, getStatuses } from "@/api";
import TaskForm from "@/components/NewTaskPage/TaskForm";

export default async function NewTask() {

    const priorities = await getPriorities();
    const statuses = await getStatuses();
    const departments = await getDepartments();
    const employees = await getEmployees();

    return (
        <main className="px-[7.5rem] py-10">
            <h1 className="text-4xl font-semibold mb-[1.875rem]">შექმენი ახალი დავალება</h1>
            <TaskForm 
                priorities={priorities}
                statuses={statuses}
                departments={departments}
                employees={employees}
            />
        </main>
    )
}