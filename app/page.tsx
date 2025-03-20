import { getTasks } from "@/api";
import Clear from "@/components/HomePage/Clear";
import TaskGrid from "@/components/HomePage/TaskGrid";
import { Tasks } from "@/types";


export default async function Home() {
  
  const tasks: Tasks = await getTasks();
  
  return (
    <main className="px-[7.5rem] py-10">
      <Clear />
      <h1 className="text-4xl font-semibold mb-[3.25rem]">დავალებების გვერდი</h1>
      <TaskGrid 
        tasks={tasks}
      />
    </main>
  );
}
