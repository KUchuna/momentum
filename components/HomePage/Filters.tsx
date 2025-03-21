"use client";

import { Department, Employee, Priority } from "@/types";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface FiltersProps {
    departments: Department[],
    priorities: Priority[],
    employees: Employee[]
}

export default function Filters({ departments, priorities, employees }: FiltersProps) {
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    const toggleFilter = (e: React.MouseEvent<HTMLLIElement>, filter: string) => {
        if (!(e.target as HTMLElement).classList.contains("filter-item")) {
            return;
        }
        setOpenFilter((prev) => (prev === filter ? null : filter));
    };

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleFilter(e: React.FormEvent, filterType: string) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const params = new URLSearchParams(searchParams.toString());

        const selectedValues: string[] = [];
        formData.forEach((value) => {
            selectedValues.push(value.toString());
        });

        params.set(filterType, JSON.stringify(selectedValues));
        replace(`${pathname}?${params.toString()}`);
        setOpenFilter(null)
    }

    useEffect(() => {
        const selectedDepartments = JSON.parse(searchParams.get('departments') || '[]');
        const selectedPriorities = JSON.parse(searchParams.get('priorities') || '[]');
        const selectedEmployees = JSON.parse(searchParams.get('employees') || '[]');
        console.log(selectedDepartments, selectedPriorities, selectedEmployees);
    }, []);

    return (
        <ul className="flex gap-[6rem] border border-[#DEE2E6] w-fit rounded-[10px] mb-[25px]">
            <li className={`filter-item flex items-center gap-2 cursor-pointer relative pl-[1.125rem] py-3 ${openFilter === "department" ? "text-primary" : ""} select-none`} onClick={(e) => toggleFilter(e, "department")}>
                დეპარტამენტი <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openFilter === "department" ? "rotate-180 transition-transform duration-100" : ""}`}>
                    <path d="M6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L11.2929 15.7071C11.6834 16.0976 12.3166 16.0976 12.7071 15.7071L18.7071 9.70711C19.0976 9.31658 19.0976 8.68342 18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289L12 13.5858L6.70711 8.29289Z" fill="currentColor" />
                </svg>

                {openFilter === "department" && (
                    <form className="absolute top-[120%] left-0 cursor-default bg-white border rounded-[10px] py-10 px-[1.875rem] border-primary z-10 flex flex-col w-max text-[initial] gap-[22px]" onSubmit={(e) => handleFilter(e, 'departments')}>
                        {departments.map((department) => {
                            return (
                                <div key={department.id} className="flex flex-row-reverse w-max gap-[15px]">
                                    <label htmlFor={`department-${department.id}`} className="w-max cursor-pointer">
                                        {department.name}
                                    </label>
                                    <input type="checkbox" id={`department-${department.id}`} name="department" value={department.id} className="cursor-pointer" />
                                </div>
                            );
                        })}
                        <button className="bg-primary rounded-[20px] text-white py-2 px-[3.125rem] ml-auto mt-6">არჩევა</button>
                    </form>
                )}
            </li>
            <li className={`filter-item flex items-center gap-2 cursor-pointer relative py-3 ${openFilter === "priority" ? "text-primary" : ""} select-none`} onClick={(e) => toggleFilter(e, "priority")}>
                პრიორიტეტი <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openFilter === "priority" ? "rotate-180 transition-transform duration-100" : ""}`}>
                    <path d="M6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L11.2929 15.7071C11.6834 16.0976 12.3166 16.0976 12.7071 15.7071L18.7071 9.70711C19.0976 9.31658 19.0976 8.68342 18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289L12 13.5858L6.70711 8.29289Z" fill="currentColor" />
                </svg>
                {openFilter === "priority" && (
                    <form className="absolute top-[120%] left-0 cursor-default bg-white border rounded-[10px] py-10 px-[1.875rem] border-primary z-10 flex flex-col w-max text-[initial] gap-[22px]" onSubmit={(e) => handleFilter(e, 'priorities')}>
                        {priorities.map((priority) => {
                            return (
                                <div key={priority.id} className="flex flex-row-reverse w-max gap-[15px]">
                                    <label htmlFor={`priority-${priority.id}`} className="w-max cursor-pointer">
                                        {priority.name}
                                    </label>
                                    <input type="checkbox" id={`priority-${priority.id}`} name="priority" value={priority.id} className="cursor-pointer" />
                                </div>
                            );
                        })}
                        <button className="bg-primary rounded-[20px] text-white py-2 px-[3.125rem] ml-auto mt-6">არჩევა</button>
                    </form>
                )}
            </li>
            <li className={`filter-item flex items-center gap-2 cursor-pointer relative py-3 pr-[1.125rem] ${openFilter === "employee" ? "text-primary" : ""} select-none`} onClick={(e) => toggleFilter(e, "employee")}>
                თანამშრომელი <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openFilter === "employee" ? "rotate-180 transition-transform duration-100" : ""}`}>
                    <path d="M6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L11.2929 15.7071C11.6834 16.0976 12.3166 16.0976 12.7071 15.7071L18.7071 9.70711C19.0976 9.31658 19.0976 8.68342 18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289L12 13.5858L6.70711 8.29289Z" fill="currentColor" />
                </svg>
                {openFilter === "employee" && (
                    <form className="absolute top-[120%] left-0 cursor-default bg-white border rounded-[10px] py-10 px-[1.875rem] border-primary z-10 flex flex-col w-max text-[initial] gap-[22px]" onSubmit={(e) => handleFilter(e, 'employees')}>
                        {employees.map((employee) => {
                            return (
                                <div key={employee.id} className="flex flex-row-reverse w-max gap-[15px] items-center">
                                    <label htmlFor={`employee-${employee.id}`} className="w-max cursor-pointer flex items-center gap-[10px]">
                                        <div className="w-[38px] h-[38px] rounded-full overflow-hidden">
                                            <Image
                                                src={employee.avatar}
                                                alt="Employee Avatar"
                                                width={38}
                                                height={38}
                                                quality={100}
                                                priority
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        {employee.name + " " + employee.surname}
                                    </label>
                                    <input type="checkbox" id={`employee-${employee.id}`} name="employee" value={employee.id} className="cursor-pointer" />
                                </div>
                            );
                        })}
                        <button className="bg-primary rounded-[20px] text-white py-2 px-[3.125rem] ml-auto mt-6">არჩევა</button>
                    </form>
                )}
            </li>
        </ul>
    );
}
