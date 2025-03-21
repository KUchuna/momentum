"use client"

import { Department, Employee, Priority, Task } from "@/types"
import Filters from "./Filters"
import TaskGrid from "./TaskGrid"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

interface FilterSharedProps {
    departments: Department[],
    priorities: Priority[],
    employees: Employee[],
    tasks: Task[]
}

export default function FilterShared({ departments, priorities, employees, tasks }: FilterSharedProps) {
    const searchParams = useSearchParams()

    const filteredTasks = useMemo(() => {
        const selectedDepartments = JSON.parse(searchParams.get('departments') || '[]');
        const selectedPriorities = JSON.parse(searchParams.get('priorities') || '[]');
        const selectedEmployees = JSON.parse(searchParams.get('employees') || '[]');

        return tasks.filter(task => {
            const departmentMatch = selectedDepartments.length === 0 || selectedDepartments.includes(task.department.id.toString());
            const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority.id.toString());
            const employeeMatch = selectedEmployees.length === 0 || selectedEmployees.includes(task.employee.id.toString());

            return departmentMatch && priorityMatch && employeeMatch;
        })
    }, [searchParams, tasks])

    return (
        <>
            <Filters 
                departments={departments}
                priorities={priorities}
                employees={employees}
            />
            <TaskGrid 
                tasks={filteredTasks}
            />
        </>
    )
}
