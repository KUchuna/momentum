export interface Task {
    id: number, 
    name: string, 
    description: string, 
    due_date: string, 
    status: {id: number, name: string}, 
    priority: {id: number, name: string, icon: string}, 
    department: {id: number, name: string}, 
    employee: {id: number, name: string, surname: string, avatar: string, department_id: number}
    total_comments: number
}

export type Tasks = Task[]

export interface TaskComment {
    id: number;
    text: string;
    task_id: number;
    parent_id?: number;
    author_avatar: string;
    author_nickname: string;
}

export interface CommentWithSubComments extends TaskComment {
    sub_comments?: TaskComment[]; 
}