"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {useEffect, useState} from "react";
import NewEmployee from "../Globals/NewEmployee";


const schema = z.object({
    title: z.string()
        .min(2, "მინიმუმ 2 სიმბოლო")
        .max(255, "მაქსიმუმ 255 სიმბოლო"),

    description: z.string()
        .max(255, "მაქსიმუმ 255 სიმბოლო")
        .optional()
        .refine((desc) => !desc || desc.trim().split(/\s+/).length >= 4, {
            message: "აღწერილობა უნდა შეიცავდეს მინიმუმ 4 სიტყვას",
        }),

    priority_id: z.string(),

    status_id: z.string({
        required_error: "სტატუსი უნდა იყოს არჩეული!",
    }),

    department_id: z.string()
    .min(1, "დეპარტამენტი უნდა იყოს არჩეული!"),

    employee_id: z.string()
    .min(1, "თანამშრომელი უნდა იყოს არჩეული!"),
    
    due_date: z.string()
        .min(1, "თარიღი აუცილებელია")
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "არასწორი თარიღის ფორმატი!",
    }),
});


export default function AssignmentForm({priorities, statuses, departments, employees}: {priorities: {id: number, name: string, icon: string}[], statuses: {id: number, name: string}[], departments: {id: number, name: string}[], employees: {id: number, name: string, surname: string, avatar: string, department: {id: number, name: string}}[]}) {
    
    const [activeDropDown, setActiveDropDown] = useState<string | null>(null)

    const [selectedPriority, setSelectedPriority] = useState<{id: number, name: string, icon: string}>(priorities[1]);

    const [selectedStatus, setSelectedStatus] = useState<{id: number, name: string}>(statuses[0]);
    
    const [selectedDepartment, setSelectedDepartment] = useState<{id: number, name: string} | null>(null);
    
    const [selectedEmployee, setSelectedEmployee] = useState<{id: number, name: string, surname: string, avatar: string, department: {id: number, name: string}} | null>(null);
    
    const [submitErrors, setSubmitErrors] = useState<{[key: string]: string}>({});

    const {
            register,
            formState: { errors },
            watch,
        } = useForm({
            resolver: zodResolver(schema),
            mode: "onChange",
    });
    
    const titleValue = watch("title") || "";
    const descriptionValue = watch("description") || "";

    const toggleDropDown = (dropDown: string) => {
        setActiveDropDown(dropDown === activeDropDown ? null : dropDown);
    };

    function handlePriorityChange(priority: {id: number, name: string, icon: string}) {
        setSelectedPriority(priority);
        setActiveDropDown(null);
    }
    
    function handleStatusChange(status: {id: number, name: string}) {
        setSelectedStatus(status);
        setActiveDropDown(null);
    }
    
    function handleDepartmentChange(department: {id: number, name: string}) {
        setSelectedDepartment(department);
        setSelectedEmployee(null);
        setActiveDropDown(null);
    }
    
    function handleEmployeeChange(employee: {id: number, name: string, surname: string, avatar: string, department: {id: number, name: string}}) {
        setSelectedEmployee(employee);
        setActiveDropDown(null);
    }



    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("assignment form submitted")
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
    
        const result = schema.safeParse({
            title: formData.get("title"),
            description: formData.get("description"),
            department_id: formData.get("department_id"),
            employee_id: formData.get("employee_id"),
            priority_id: formData.get("priority_id"),
            status_id: formData.get("status_id"),
            due_date: formData.get("due_date"),
        });
    
        if (!result.success) {
            const fieldErrors: { [key: string]: string } = {};
            result.error.errors.forEach((error) => {
                if (error.path.length > 0) {
                    fieldErrors[error.path[0]] = error.message;
                }
            });
            setSubmitErrors(fieldErrors);
            console.log(submitErrors)
            return;
        }
        
        try {
            console.log("Form submitted successfully", result.data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    }


    return (
        <form className="py-[4.063rem] px-[3.438rem] bg-[#FBF9FFA6] rounded-[4px] border-[#DDD2FF] border-[1px]" onSubmit={handleFormSubmit} id="assignment-form">

            <input 
                className="hidden"
                value={selectedPriority?.id ?? ""}
                {...register("priority_id")}
                id="priority_id"
            />
            
            <input 
                className="hidden"
                value={selectedStatus?.id ?? ""}
                {...register("status_id")}
                id="status_id"
            />
            
            <input 
                className="hidden"
                value={selectedDepartment?.id ?? ""}
                {...register("department_id")}
                id="department_id"
            />
            
            <input 
                className="hidden"
                value={selectedEmployee?.id ?? ""}
                {...register("employee_id")}
                id="employee_id"
            />

            <div className="flex gap-[10rem]">
                <div className="flex flex-col h-[487px] justify-between w-full">
                    <div className="flex flex-col">
                        <label className="font-medium" htmlFor="title">სათაური*</label>
                        <input type="text" {...register("title")} className={`bg-white border-1 border-[#CED4DA] rounded-[6px] outline-none p-[0.875rem] h-[46px] ${submitErrors.title ? "border-red-main" : ""}`} />
                        <div className="mt-[6px] flex flex-col text-[0.625rem] text-grey-text">
                            <span
                                className={`flex gap-[2px] items-center ${
                                    titleValue.length === 0 ? "text-grey-text" : errors.title?.message?.includes("მინიმუმ 2 სიმბოლო") ? "text-red-main" : "text-green-main"
                                }`}
                                > 
                                მინიმუმ 2 სიმბოლო
                            </span>
                            <span
                                className={`flex gap-[2px] items-center ${
                                    titleValue.length === 0 ? "text-grey-text" : errors.title?.message?.includes("მაქსიმუმ 255 სიმბოლო") ? "text-red-main" : "text-green-main"
                                }`}
                                >
                                მაქსიმუმ 255 სიმბოლო
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium" htmlFor="description">აღწერა*</label>
                        <textarea {...register("description")} className={`bg-white border-1 border-[#CED4DA] rounded-[6px] outline-none p-[0.875rem] h-[133px] resize-none ${submitErrors.description ? "border-red-main" : ""}`}/>
                        <div className="mt-[6px] flex flex-col text-[0.625rem] text-grey-text">
                            <span
                                className={`flex gap-[2px] items-center ${
                                    descriptionValue.length === 0 ? "text-grey-text" : errors.description?.message?.includes("აღწერილობა უნდა შეიცავდეს მინიმუმ 4 სიტყვას") ? "text-red-main" : "text-green-main"
                                }`}
                                >
                                მინიმუმ 4 სიტყვას
                            </span>
                            <span
                                className={`flex gap-[2px] items-center ${
                                    descriptionValue.length === 0 ? "text-grey-text" : errors.description?.message?.includes("მაქსიმუმ 255 სიმბოლო") ? "text-red-main" : "text-green-main"
                                }`}
                                >
                                მაქსიმუმ 255 სიმბოლო
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="w-full">
                            <span className="font-medium">პრიორიტეტი*</span>
                            <div className={`bg-white border-[1px] border-[#DEE2E6] relative rounded-[5px] h-[46px] flex items-center p-[0.875rem] cursor-pointer ${errors.priority_id ? "border-red-main" : ""}`} onClick={() => toggleDropDown("priority")}>
                                <div className="flex items-center gap-1">
                                    <Image src={selectedPriority.icon} alt="" width={16} height={18} />{selectedPriority.name}
                                </div>
                                <Image src="/logos/downarrow.svg" alt="" width={14} height={14} className="ml-auto"/>
                                {activeDropDown == "priority" && <div className="bg-white absolute left-0 origin-top-left bottom-0 translate-y-[100%] w-full border-[1px] border-[#DEE2E6] rounded-[5px] z-10">
                                    {priorities.map((priority, index) => {
                                        return (
                                            <p key={index} className="p-[0.875rem] text-sm font-light hover:bg-gray-50 flex gap-[0.375rem]" onClick={() => handlePriorityChange(priority)} >
                                                <Image src={priority.icon} alt="" width={16} height={18} />{priority.name}</p>
                                        )
                                    })}
                                </div>}
                            </div>
                        </div>
                        <div className="w-full">
                            <span className="font-medium">სტატუსი*</span>
                            <div className={`bg-white border-[1px] border-[#DEE2E6] relative rounded-[5px] h-[46px] flex items-center p-[0.875rem] cursor-pointer ${errors.status_id ? "border-red-main" : ""}`} onClick={() => toggleDropDown("status")}>
                                {selectedStatus.name}
                                <Image src="/logos/downarrow.svg" alt="" width={14} height={14} className="ml-auto"/>
                                {activeDropDown == "status" && <div className="bg-white absolute left-0 origin-top-left bottom-0 translate-y-[100%] w-full border-[1px] border-[#DEE2E6] rounded-[5px] z-10">
                                    {statuses.map((status, index) => {
                                        return (
                                            <p key={index} className="p-[0.875rem] text-sm font-light hover:bg-gray-50 flex gap-[0.375rem]" onClick={() => handleStatusChange(status)} >{status.name}</p>
                                        )
                                    })}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col h-[487px] justify-between w-full">
                    <div>
                        <span className="font-medium">დეპარტამენტი*</span>
                        <div className={`bg-white border-[1px] border-[#DEE2E6] relative rounded-[5px] h-[46px] flex items-center p-[0.875rem] cursor-pointer ${submitErrors.department_id ? "border-red-main" : ""}`} onClick={() => toggleDropDown("department")}>
                                {selectedDepartment?.name}
                            <Image src="/logos/downarrow.svg" alt="" width={14} height={14} className="ml-auto"/>
                            {activeDropDown == "department" && 
                                <div className="bg-white absolute left-0 origin-top-left bottom-[-2px] translate-y-[100%] w-full border-[1px] border-[#DEE2E6] rounded-[5px] z-10">
                                    {departments.map((department, index) => {
                                        return (
                                            <p key={index} className="p-[0.875rem] text-sm font-light hover:bg-gray-50 flex gap-[0.375rem]" onClick={() => handleDepartmentChange(department)} >{department.name}</p>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    </div>
                    {selectedDepartment && <div>
                        <span className="font-medium">პასუხისმგებელი თანამშრომელი*</span>
                        <div className={`bg-white border-[1px] border-[#DEE2E6] relative rounded-[5px] h-[46px] flex items-center p-[0.875rem] cursor-pointer ${submitErrors.employee_id ? "border-red-main" : ""}`} onClick={() => toggleDropDown("employee")}>
                                {selectedEmployee?.name}
                            <Image src="/logos/downarrow.svg" alt="" width={14} height={14} className="ml-auto"/>
                            {activeDropDown == "employee" &&
                                <div className="bg-white absolute left-0 origin-top-left bottom-[-1px] translate-y-[100%] w-full border-[1px] border-[#DEE2E6] rounded-[5px] z-10">
                                    <div onClick={(e) => (e.stopPropagation())}>
                                        <NewEmployee 
                                            departments={departments}
                                            />
                                    </div>
                                    {employees
                                    .filter(employee => employee.department.id === selectedDepartment?.id)
                                    .map((employee, index) => (
                                        <p 
                                        key={index} 
                                        className="p-[0.875rem] text-sm font-light hover:bg-gray-50 flex gap-[0.375rem]" onClick={() => handleEmployeeChange(employee)}
                                        >
                                        {employee.name}
                                        </p>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>}
                    <div className="flex flex-col">
                        <label htmlFor="due_date" className="font-medium">დედლაინი*</label>
                        <div className="bg-white border-[1px] border-[#DEE2E6] relative rounded-[5px] h-[46px] flex items-center p-[0.875rem] cursor-pointer outline-none font-light gap-1">
                            <Image src="/logos/calendar.svg" alt="" width={16} height={16} />
                            <input
                                type="date"
                                {...register("due_date")}
                                defaultValue={new Date(Date.now() + 86400000*2).toISOString().split("T")[0]}
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                className="outline-none bg-white w-full"
                            />
                        </div>
                    </div>           
                </div>
            </div>
            <button className="border-1 border-primary bg-primary px-4 py-[0.688rem] rounded-[10px] text-white cursor-pointer ml-auto block mt-[9rem]" name="assignment-submit" id="assignment-submit" form="assignment-form">დავალების შექმნა</button>
        </form>
    )
}