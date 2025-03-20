export interface Task {
    id: number, 
    name: string, 
    description: string, 
    due_date: string, 
    status: {id: number, name: string}, 
    priority: {id: number, name: string, icon: string}, 
    department: {id: number, name: string}, 
    employee: {id: number, name: string, surname: string, avatar: string, department_id: number}
}

export type Tasks = Task[]