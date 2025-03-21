"use server"

import { createComment, createEmployee, createReply, createTask, updateStatus } from "@/api";
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

export async function createCommentAction(taskId: string, formData: FormData) {
  try {
    await createComment(taskId, formData);
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath(`/tasks${taskId}`)
    revalidatePath("/")
  }
}

export async function createReplyAction(taskId: string, formData: FormData, parentId: number) {
  try {
    await createReply(taskId, formData, parentId);
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath(`/tasks${taskId}`)
    revalidatePath("/")
  }
}