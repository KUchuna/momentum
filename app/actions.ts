"use server"

import { createEmployee, createTask } from "@/api";
import { revalidatePath } from "next/cache";

export async function createEmployeeAction(formData: FormData) {
  try {
    await createEmployee(formData);
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath("/")
    revalidatePath("/newassignment")
  }
}

export async function createTaskAction(formData: FormData) {
  try {
    await createTask(formData);
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath("/")
    revalidatePath("/newassignment")
  }
}