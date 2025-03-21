import { TaskComment } from "@/types";
import CommentForm from "./CommentForm";
import Comments from "./Comments";

export default function TaskCommentsSection({comments, taskId}: {comments: TaskComment[], taskId: string}) {
    return (
        <section className="mt-3 py-[2.5rem] pr-[1.407rem] pl-[2.814rem] rounded-[10px] bg-[#F8F3FEA6] border border-[#DDD2FF] w-1/2 flex flex-col">
            <CommentForm 
                taskId={taskId}
            />

            <Comments 
                comments={comments}
                taskId={taskId}
            />
        </section>
    )
}