import { getDepartments, getEmployees, getPriorities, getTasks } from "@/api";
import Clear from "@/components/HomePage/Clear";
import FilterShared from "@/components/HomePage/FilterShared";
import { Tasks } from "@/types";


export default async function Home() {
  
  const tasks: Tasks = await getTasks();
  const departments = await getDepartments();
  const priorities = await getPriorities();
  const employees = await getEmployees();

  return (
    <main className="px-[7.5rem] py-10">
      <Clear />
      <h1 className="text-4xl font-semibold mb-[3.25rem]">დავალებების გვერდი</h1>
      <FilterShared 
        departments={departments}
        priorities={priorities}
        employees={employees}
        tasks={tasks}
      />
    </main>
  );
}
