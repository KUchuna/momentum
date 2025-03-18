import { getTasks } from "@/api";

export default async function Home() {
  
  const tasks = await getTasks();
  
  return (
    <main className="px-[7.5rem] py-10">
      <h1 className="text-4xl font-semibold">დავალებების გვერდი</h1>
      {tasks.map((task: {name: string}, index: number) => {
        return (
          <h1 key={index}>{task.name}</h1>
        )
      })}
    </main>
  );
}
