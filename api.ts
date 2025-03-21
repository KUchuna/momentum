"use server"

const REDBERRY_API_TOKEN = process.env.REDBERRY_API_TOKEN;

export async function getDepartments() {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/departments`)
    return response.json()
}

export async function getPriorities() {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/priorities`)
    return response.json()
}

export async function getStatuses() {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/statuses`)
    return response.json()
}

export async function getEmployees() {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/employees`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        }
    })
    return response.json()
}

export async function getTasks() {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/tasks`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        }
    })
    return response.json()
}

export async function getSingleTask(taskId: string) {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskId}`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        }
    })
    return response.json()
}

export async function createEmployee(formData: FormData) {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/employees`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        },
        body: formData,
    });

    return response.json();
}

export async function createTask(formData: FormData) {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/tasks`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        },
        body: formData,
    });
    return response.json();
}

export async function updateStatus(taskId: number, statusId: number) {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            status_id: statusId
        }),
    });
    return response.json();
}

export async function getComments(taskId: string) {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`, {
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        }
    })
    return response.json()  
}

export async function createComment(taskId: string, formData:FormData) {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        },
        body: formData,
    });
    return response.json();
}

export async function createReply(taskId: string, formData: FormData, parentId: number) {
    formData.append("parent_id", parentId.toString());

    const response = await fetch(`https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`, 
        },
        body: formData,
    });

    return response.json();
}