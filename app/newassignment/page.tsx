import { getDepartments, getEmployees, getPriorities, getStatuses } from "@/api";
import AssignmentForm from "@/components/NewAssignment/AssignmentForm";

export default async function NewAssignment() {

    const priorities = await getPriorities();
    const statuses = await getStatuses();
    const departments = await getDepartments();
    const employees = await getEmployees();

    return (
        <main className="px-[7.5rem] py-10">
            <h1 className="text-4xl font-semibold mb-[1.875rem]">შექმენი ახალი დავალება</h1>
            <AssignmentForm 
                priorities={priorities}
                statuses={statuses}
                departments={departments}
                employees={employees}
            />
        </main>
    )
}