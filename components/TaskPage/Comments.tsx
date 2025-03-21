"use client"

import { createReplyAction } from "@/app/actions";
import { CommentWithSubComments } from "@/types"
import Image from "next/image"
import { useState } from "react"
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


export default function Comments({comments, taskId}: {comments: CommentWithSubComments[], taskId: string}) {

    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    const [errors, setErrors] = useState<{[key: string]: string}>({})
    
    function handleReply(comment: CommentWithSubComments) {
        setReplyingTo(replyingTo === comment.id ? null : comment.id)
        setErrors({})
    }

    async function handleSubmit(e: React.FormEvent, parent_id: number) {
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
            await createReplyAction(taskId, formData, parent_id);
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            form.reset()
            setReplyingTo(null)
        }
    }


    return (
        <div className="mt-[4.125rem]">
            <h4 className="text-[1.25rem] font-medium flex items-center gap-[0.438rem] mb-10">კომენტარები <span className="bg-primary text-white px-[0.688rem] rounded-[30px] font-medium text-[14px]">{comments.length}</span></h4>
            <div className="max-h-[600px] overflow-y-scroll flex flex-col gap-[2.375rem] pr-[1.407rem]" id="comments">
                {comments.map((comment, index) => {
                    return (
                        <div key={index} className="flex gap-3">
                            <img src={comment.author_avatar} alt="" width={38} height={38} className="rounded-full min-w-[38px] max-w-[38px] min-h-[38px] max-h-[38px]"/>
                            <div className="w-full">
                                <span className="font-medium text-lg mb-2">{comment.author_nickname}</span>
                                <p className="font-light text-[#343A40] max-w-[600px] break-words">{comment.text}</p>
                                <button className="flex gap-[0.375rem] font-light text-primary text-[12px] items-center mt-[0.625rem] cursor-pointer" onClick={() => handleReply(comment)}>
                                    <Image src="/logos/left.svg" alt="" width={16} height={16} /> უპასუხე</button>
                                {replyingTo === comment.id && 
                                <>
                                    <form className={`border ${errors.text ? "border-red-main" : "border-[#d7dbdf]"} rounded-[10px] mt-4 w-full`} onSubmit={(e) => handleSubmit(e, comment.id)}>
                                        <div className="bg-white rounded-[10px] px-5 pt-[1.125rem] pb-[0.938rem] flex flex-col">
                                            <textarea className="resize-none outline-none min-h-[135px]" placeholder="დაწერე კომენტარი" name="text" id="text"></textarea>
                                            <button className="text-white bg-primary rounded-[20px] py-2 px-[1.125rem] ml-auto cursor-pointer">უპასუხე</button>
                                        </div>
                                    </form>
                                    {errors.text ? <span className="text-red-main text-[0.625rem]">
                                        {errors.text}
                                    </span> : null}
                                </>
                            } 
                            {comment.sub_comments?.map((subComment, subIndex) => (
                                <div key={subIndex} className="flex gap-3 ml-[3.313rem] mt-5">
                                    <img src={subComment.author_avatar} alt="" width={38} height={38} className="rounded-full min-w-[38px] max-w-[38px] min-h-[38px] max-h-[38px]"/>
                                    <div className="w-full">
                                        <span className="font-medium text-lg mb-2">{subComment.author_nickname}</span>
                                        <p className="font-light text-[#343A40] max-w-[600px] break-words">{subComment.text}</p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}