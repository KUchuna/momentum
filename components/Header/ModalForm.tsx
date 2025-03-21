"use client"

import Image from "next/image"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createEmployeeAction } from "@/app/actions";

const schema = z.object({
    name: z.string()
        .min(2, "მინიმუმ 2 სიმბოლო")
        .max(255, "მაქსიმუმ 255 სიმბოლო")
        .regex(/^[a-zA-Zა-ჰ]+$/, "მხოლოდ ქართული ან ინგლისური ასოებია ნებადართული"),  
    surname: z.string()
        .min(2, "მინიმუმ 2 სიმბოლო")
        .max(255, "მაქსიმუმ 255 სიმბოლო")
        .regex(/^[a-zA-Zა-ჰ]+$/, "მხოლოდ ქართული ან ინგლისური ასოებია ნებადართული"),
    department_id: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, {
        message: "დეპარტამენტი უნდა იყოს არჩეული!",
        }),
});

const avatarSchema = z.object({
    avatar: z.custom<File>((file) => file instanceof File, {
        message: "სურათი აუცილებელია.",
    }).refine((file) => file.size > 0, {
        message: "სურათი აუცილებელია.",
    }).refine((file) => file.size <= 600 * 1024, {
        message: "სურათის ზომა უნდა იყოს 600KB-ზე ნაკლები.",
    }).refine((file) => ["image/png", "image/jpeg"].includes(file.type), {
        message: "სურათი აუცილებელია და ფორმატი უნდა იყოს PNG ან JPG.",
    })
});


export default function ModalForm({departments, setShowModal}: {departments: {name: string, id: number}[], setShowModal: (value: boolean) => void}) {

    const {
        register,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const nameValue = watch("name") || ""; 
    const surnameValue = watch("surname") || ""; 
    
    const [avatarErrors, setAvatarErrors] = useState<{[key: string]: string }>({})
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<{name: string, id: number} | null>(null);
    const [dropDown, setDropDown] = useState(false);
    const [submitErrors, setSubmitErrors] = useState<{[key: string]: string}>({});



    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; 
        console.log(file)
        if (file) {
            setPreview(URL.createObjectURL(file)); 
        }
        setAvatarErrors({});
    };

    function handleDelete(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.preventDefault();
        const file = document.getElementById("avatar") as HTMLInputElement;
        file.value = ""
        setPreview(null);
    } 



    function formatZodErrors(errors: z.ZodIssue[]) {
        return errors.reduce((acc, error) => {
            if (error.path[0]) {
                acc[error.path[0]] = error.message;
            }
            return acc;
        }, {} as { [key: string]: string });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();
        
        
        setAvatarErrors({});
        setSubmitErrors({});
    
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
    
        const avatar = formData.get("avatar");
        const avatarResult = avatarSchema.safeParse({ avatar });
    
        const result = schema.safeParse({
            name: formData.get("name"),
            surname: formData.get("surname"),
            department_id: formData.get("department_id"),
        });
        
        if (!avatarResult.success || !result.success) {
            if (!avatarResult.success) {
                setAvatarErrors(formatZodErrors(avatarResult.error.errors));
            }
            if (!result.success) {
                setSubmitErrors(formatZodErrors(result.error.errors));
            }
            return;
        }
    
        try {
            await createEmployeeAction(formData);
            setShowModal(false);
        } catch (error) {
            console.error("Submission failed:", error);
        }
    }

    
    function handleDropwdown() {
        setDropDown(!dropDown);
    }



    function handleDepartment(id: number, name: string) {
        setSelectedDepartment({"id": id, "name": name});
        setDropDown(false);
    }

    return (
        <form onSubmit={handleSubmit} id="modal-form">
            <input 
                className="hidden"
                value={selectedDepartment?.id ?? ""}
                {...register("department_id")}
                id="department"
            />

            <div className="flex flex-col justify-between items-start gap-[2.813rem]">
                <div className="flex gap-[2.813rem] w-full">
                    <div className="flex flex-col w-full">
                        <label htmlFor="name" className="font-medium">სახელი*</label>
                        <input type="text" id="name" {...register("name")} className={`border-1 border-[#CED4DA] rounded-[6px] outline-none px-[0.625rem] py-[0.875rem] h-[55px] ${submitErrors.name ? "border-red-main" : ""}`} />
                        <div className="mt-[6px] flex flex-col text-[0.625rem] text-grey-text">
                        <span
                            className={`flex gap-[2px] items-center ${
                                nameValue.length === 0 ? "text-grey-text" : errors.name?.message?.includes("მინიმუმ 2 სიმბოლო") ? "text-red-main" : "text-green-main"
                            }`}
                            >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> 
                            მინიმუმ 2 სიმბოლო
                        </span>
                        <span
                            className={`flex gap-[2px] items-center ${
                                nameValue.length === 0 ? "text-grey-text" : errors.name?.message?.includes("მაქსიმუმ 255 სიმბოლო") ? "text-red-main" : "text-green-main"
                            }`}
                            >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> 
                            მაქსიმუმ 255 სიმბოლო
                        </span>
                        <span className="text-red-main">
                            {submitErrors.name == "მხოლოდ ქართული ან ინგლისური ასოებია ნებადართული" ? submitErrors.name : ""}
                        </span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="surname" className="font-medium">გვარი*</label>
                        <input type="text" {...register("surname")} id="surname" className={`border-1 border-[#CED4DA] rounded-[6px] outline-none px-[0.625rem] py-[0.875rem] h-[55px] ${submitErrors.surname ? "border-red-main" : ""}`} />
                        <div className="mt-[6px] flex flex-col text-[0.625rem] text-grey-text">
                        <span
                            className={`flex gap-[2px] items-center ${
                                surnameValue.length === 0 ? "text-grey-text" : errors.surname?.message?.includes("მინიმუმ 2 სიმბოლო") ? "text-red-main" : "text-green-main"
                            }`}
                            >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> 
                            მინიმუმ 2 სიმბოლო
                        </span>
                        <span
                            className={`flex gap-[2px] items-center ${
                                surnameValue.length === 0 ? "text-grey-text" : errors.surname?.message?.includes("მაქსიმუმ 255 სიმბოლო") ? "text-red-main" : "text-green-main"
                            }`}
                            >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> 
                            მაქსიმუმ 255 სიმბოლო
                        </span>
                        <span className="text-red-main">
                            {submitErrors.surname == "მხოლოდ ქართული ან ინგლისური ასოებია ნებადართული" ? submitErrors.surname : ""}
                        </span>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <span className="font-medium">ავატარი*</span>
                    <label htmlFor="avatar" className={`custom-file-upload border-[1px] border-dashed ${avatarErrors.avatar ? "border-red-main" : "border-[#CED4DA]"} mt-2`}>   
                        <div className="relative">
                            <Image src={preview ? preview : "/logos/fileupload.svg"} width={preview ? 88 : 24} height={preview ? 88 : 24} alt="" priority quality={100} className={`object-cover  ${preview ? "rounded-full min-h-[88px] min-w-[88px] max-h-[88px] max-w-[88px]" : "min-h-[50] min-w-[136px] max-h-[50px] max-w-[136px]"}`}/>
                            {preview ? <Image src="/logos/delete.svg" alt="" width={30} height={30} onClick={(e) => (handleDelete(e))} className="absolute -right-3 bottom-0.5"/> : <></>}
                        </div>
                    </label>
                        <input 
                            type="file" 
                            id="avatar"
                            name="avatar"
                            accept=".png, .jpg, .jpeg"
                            className="border-[1px] border-gray-300 p-2 rounded-[8px] hidden"
                            onChange={handleUpload}
                        />
                    {avatarErrors.avatar && <span className="text-red-main text-[0.625rem]">{avatarErrors.avatar}</span>}
                </div>
                <div className="flex flex-col w-[50%] pr-[2.813rem]">
                    <label className={`font-medium `} htmlFor="department">
                        დეპარტამენტი*
                    </label>
                    <div className={`flex items-center border-1 border-[#CED4DA] rounded-[6px] outline-none px-[0.625rem] py-[0.875rem] cursor-pointer h-[55px] min-w-max relative ${submitErrors.department_id ? "border-red-main" : ""}`} onClick={() => handleDropwdown()}>
                        <span className="font-normal leading-0">
                            {selectedDepartment?.name && selectedDepartment.name}
                        </span>
                        <Image src="/logos/downarrow.svg" alt="" width={14} height={14} className="ml-auto"/>
                        {dropDown && 
                            <div className={`absolute left-0 bg-white w-full origin-top-left bottom-[-2px] translate-y-[100%] border-1 border-[#CED4DA] rounded-[6px] z-10 max-h-[200px] select-none overflow-y-auto`}>
                                {departments.map((item: {name: string, id:number}, index: number) => {
                                    return (
                                        <p key={index} className="p-[0.875rem] text-sm font-light hover:bg-gray-50" onClick={() => handleDepartment(item.id, item.name)}>{item.name}</p>
                                    )
                                })}
                            </div>
                        }
                    </div>
                    <span className="text-[0.625rem] text-red-main">
                        {submitErrors.department_id ? "დეპარტამენტი უნდა იყოს არჩეული!" : ""}
                    </span>
                </div>
            </div>
            <div className="flex justify-end gap-[2.813rem] mt-[65px]">
                <button className="border-1 border-primary px-4 py-[0.688rem] rounded-[10px] cursor-pointer" onClick={() => setShowModal(false)}>გაუქმება</button>
                <button className="border-1 border-primary bg-primary px-4 py-[0.688rem] rounded-[10px] text-white cursor-pointer" type="submit" form="modal-form">დაამატე თანამშრომელი</button>
            </div>
        </form>
    )
}