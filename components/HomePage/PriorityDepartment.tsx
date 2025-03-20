import Image from "next/image";


export default function PriorityDepartment({priority, department}: {priority: {id: number, name: string, icon: string}, department: {id: number, name: string}}) {

    const priorityColor = () => {
        switch (priority.id) {
          case 1:
            return "#08A508"; 
          case 2:
            return "#F7BC30"; 
          case 3:
            return "#FA4D4D"; 
          default:
            return "#8338EC";
        }
    };
    
    const departmentColor = () => {
        switch (department.id) {
            case 1:
                return "#89B6FF";
            case 2:
                return "#FFD86D";
            case 3:
                return "#FF66A8";
            case 4:
                return "#89B6FF";
            case 5:
                return "#FD9A6A";
            case 6:
                return "#FFD86D";
            case 7:
                return "#FF66A8";
            default:
                return "#8338EC";
        }
    }

    const slicedDepartment = () => {
        switch (department.id) {
            case 1:
                return "ადმინისტრაცია";
            case 2:
                return "HR";
            case 3:
                return "ფინანსები";
            case 4:
                return "მარკეტინგი";
            case 5:
                return "ლოჯისტიკა";
            case 6:
                return "ინფ. ტექ.";
            case 7:
                return "მედია";
            default:
                return "სხვა";
        }
    }

    return (
        <div className="flex gap-[0.625rem]">
            <span className={`flex gap-1 rounded-[4px] border border-${priorityColor()} py-1 pl-[0.25rem] max-w-[86px] min-w-[86px] text-[12px] pr-[0.375rem]`} style={{color: priorityColor()}}><Image src={priority.icon} width={16} height={18} alt="" />{priority.name}</span>
            <span className="rounded-[15px] text-white text-[12px] py-[0.313rem] px-[1.15rem] font-normal " style={{backgroundColor: departmentColor()}}>
                {slicedDepartment()} 
            </span>
        </div>
    )
}