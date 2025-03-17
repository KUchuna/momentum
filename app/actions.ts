"use server"

import { createWorker } from "@/api";
import { revalidatePath } from "next/cache";

export async function createWorkerAction(formData: FormData) {
    try {
      await createWorker(formData);
    } catch (error) {
      console.log(error);
    } finally {
      revalidatePath("/")
    }
  }