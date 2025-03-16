"use server"

const REDBERRY_API_TOKEN = process.env.REDBERRY_API_TOKEN;

export async function getDepartments() {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/departments`)
    return response.json()
}

export async function createWorker(formData: FormData) {
    const response = await fetch(`https://momentum.redberryinternship.ge/api/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${REDBERRY_API_TOKEN}`,
        },
        body: JSON.stringify(formData)
    })
    return response.json()
}