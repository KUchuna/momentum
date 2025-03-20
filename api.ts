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
    console.log(formData)
    return response.json();
}
