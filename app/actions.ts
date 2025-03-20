"use server"

import { createEmployee, createTask, updateStatus } from "@/api";
import { revalidatePath } from "next/cache";

export async function createEmployeeAction(formData: FormData) {
  try {
    await createEmployee(formData);
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath("/")
    revalidatePath("/newtask")
  }
}

export async function createTaskAction(formData: FormData) {
  try {
    await createTask(formData);
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath("/")
    revalidatePath("/newtask")
  }
}

export async function updateStatusAction(taskId: number, statusId: number) {
  try {
    await updateStatus(taskId, statusId)
  } catch (error) {
    console.log(error)
  } finally {
    revalidatePath(`/tasks${taskId}`)
    revalidatePath('/')
  }
}