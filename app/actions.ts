"use server"

import { createEmployee } from "@/api";
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