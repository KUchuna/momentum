"use client"

import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {useEffect, useState} from "react";
import NewEmployee from "../Globals/NewEmployee";
import { createTaskAction } from "@/app/actions";
import { setPriority } from "os";
import { useRouter } from "next/navigation";


const schema = z.object({
    name: z.string()
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

    const [formData, setFormData] = useState({
        title: "",
        priority_id: "",
        status_id: "",
        department_id: "",
        employee_id: "",
        due_date: "",
        description: "",
      });

    const {
            register,
            formState: { errors },
            watch,
            setValue,
        } = useForm({
            resolver: zodResolver(schema),
            mode: "onChange",
    });
    
    const nameValue = watch("name") || "";
    const descriptionValue = watch("description") || "";

    const router = useRouter();

    const toggleDropDown = (dropDown: string) => {
        setActiveDropDown(dropDown === activeDropDown ? null : dropDown);
    };

    function handlePriorityChange(priority: {id: number, name: string, icon: string}) {
        setSelectedPriority(priority);
        localStorage.setItem("formData", JSON.stringify({...formData, priority_id: priority.id}));
        setActiveDropDown(null);
    }
    
    function handleStatusChange(status: {id: number, name: string}) {
        setSelectedStatus(status);
        localStorage.setItem("formData", JSON.stringify({...formData, status_id: status.id}));
        setActiveDropDown(null);
    }
    
    function handleDepartmentChange(department: {id: number, name: string}) {
        setSelectedDepartment(department);
        const updatedFormData = { ...formData, department_id: department.id };

        localStorage.setItem("formData", JSON.stringify(updatedFormData));

        const formDataWithoutEmployee = { ...updatedFormData, employee_id: "" };

        localStorage.setItem("formData", JSON.stringify(formDataWithoutEmployee));

        setSelectedEmployee(null);
        setActiveDropDown(null);
    }
    
    function handleEmployeeChange(employee: {id: number, name: string, surname: string, avatar: string, department: {id: number, name: string}}) {
        setSelectedEmployee(employee)
        localStorage.setItem("formData", JSON.stringify({...formData, employee_id: employee.id}));
        setActiveDropDown(null);
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue("name", e.target.value);
        localStorage.setItem("formData", JSON.stringify({...formData, name: e.target.value}));
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setValue("description", e.target.value);
        localStorage.setItem("formData", JSON.stringify({...formData, description: e.target.value}));
    }

    useEffect(() => {
        const savedData = localStorage.getItem("formData");
        console.log(savedData)
        if (savedData) {
            setFormData(JSON.parse(savedData));
            setValue("name", JSON.parse(savedData).name);
            setValue("description", JSON.parse(savedData).description);
            setSelectedPriority(priorities.find((priority) => priority.id == JSON.parse(savedData).priority_id) || priorities[1]);
            setSelectedStatus(statuses.find((status) => status.id == JSON.parse(savedData).status_id) || statuses[0]);
            setSelectedDepartment(departments.find((department) => department.id == JSON.parse(savedData).department_id) || null);
            setSelectedEmployee(employees.find((employee) => employee.id == JSON.parse(savedData).employee_id) || null);
        }
      }, []);


    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const result = schema.safeParse({
            name: formData.get("name"),
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
            await createTaskAction(formData);
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            localStorage.removeItem("formData");
            form.reset();
            router.push("/");
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
                        <label className="font-medium" htmlFor="name">სათაური*</label>
                        <input type="text" {...register("name")} className={`bg-white border-1 border-[#CED4DA] rounded-[6px] outline-none p-[0.875rem] h-[46px] ${submitErrors.name ? "border-red-main" : ""}`} value={nameValue} onChange={(e) => handleNameChange(e)}/>
                        <div className="mt-[6px] flex flex-col text-[0.625rem] text-grey-text">
                            <span
                                className={`flex gap-[2px] items-center ${
                                    nameValue.length === 0 ? "text-grey-text" : nameValue.length < 2 ? "text-red-main" : "text-green-main"
                                }`}
                                > 
                                მინიმუმ 2 სიმბოლო
                            </span>
                            <span
                                className={`flex gap-[2px] items-center ${
                                    nameValue.length === 0 ? "text-grey-text" : nameValue.length > 255 ? "text-red-main" : "text-green-main"
                                }`}
                                >
                                მაქსიმუმ 255 სიმბოლო
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium" htmlFor="description">აღწერა*</label>
                        <textarea {...register("description")} className={`bg-white border-1 border-[#CED4DA] rounded-[6px] outline-none p-[0.875rem] h-[133px] resize-none ${submitErrors.description ? "border-red-main" : ""}`} onChange={(e) => handleDescriptionChange(e)}/>
                        <div className="mt-[6px] flex flex-col text-[0.625rem] text-grey-text">
                            <span
                                className={`flex gap-[2px] items-center ${
                                    descriptionValue.length === 0 ? "text-grey-text" : descriptionValue.trim().split(/\s+/).length <= 4 ? "text-red-main" : "text-green-main"
                                }`}
                                >
                                მინიმუმ 4 სიტყვას
                            </span>
                            <span
                                className={`flex gap-[2px] items-center ${
                                    descriptionValue.length === 0 ? "text-grey-text" : descriptionValue.length > 255 ? "text-red-main" : "text-green-main"
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
                                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                            />
                        </div>
                    </div>           
                </div>
            </div>
            <button className="border-1 border-primary bg-primary px-4 py-[0.688rem] rounded-[10px] text-white cursor-pointer ml-auto block mt-[9rem]" name="assignment-submit" id="assignment-submit" form="assignment-form">დავალების შექმნა</button>
        </form>
    )
}