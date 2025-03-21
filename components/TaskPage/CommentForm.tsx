"use client"
import { createCommentAction } from "@/app/actions";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
    text: z.string()
        .trim()
        .min(1, "ტექსტი სავალდებულოა") 
        .max(255, "მაქსიმუმ 255 სიმბოლო")
        .refine(value => value.replace(/\s/g, "").length > 0, {
            message: "ტექსტი სავალდებულოა"
        })
});

export default function CommentForm({taskId}: {taskId: string}) {

    const [errors, setErrors] = useState<{[key: string]: string}>({})

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        
        const result = schema.safeParse({
            text: formData.get("text"),
        });

        if (!result.success) {
            const fieldErrors: { [key: string]: string } = {};
            result.error.errors.forEach((error) => {
                if (error.path.length > 0) {
                    fieldErrors[error.path[0]] = error.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }
        
        try {
            await createCommentAction(taskId, formData);
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            form.reset()
            setErrors({})
        }
    }

    return (
        <>
            <form className={`border ${errors.text ? "border-red-main" : "border-[#d7dbdf]"} rounded-[10px] mr-[1.407rem]`} onSubmit={handleSubmit}>
                <div className="bg-white rounded-[10px] px-5 pt-[1.125rem] pb-[0.938rem] flex flex-col">
                    <textarea className="resize-none outline-none min-h-[135px]" placeholder="დაწერე კომენტარი" name="text" id="text"></textarea>
                    <button className="text-white bg-primary rounded-[20px] py-2 px-[1.125rem] ml-auto cursor-pointer">დააკომენტარე</button>
                </div>
            </form>
            {errors.text ? <span className="text-red-main text-[0.625rem]">
                {errors.text}
            </span> : null}
        </>
    )
}