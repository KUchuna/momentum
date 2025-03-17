"use client"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import ModalForm from "./ModalForm"

export default function NewWorker({departments}: {departments: {name: string, id: number}[]}) {
    const [mounted, setMounted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)
    

    useEffect(() => {
        setMounted(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            setMounted(false);
        };
    }, []);

    if (!mounted) return null;

    return (
        <>
            <button className="px-4 py-2.5 border-primary border-1 rounded-[5px] cursor-pointer" onClick={() => setShowModal(true)}>თანამშრომლის შექმნა
            </button>
            {showModal && createPortal(
                 <div 
                 className="fixed inset-0 flex justify-center items-center bg-black/15 backdrop-blur-[10px] z-50">
                    <div 
                        ref={modalRef} 
                        className="bg-white px-28 py-10 rounded-lg shadow-lg flex flex-col justify-center gap-4 w-[80%] max-w-[1920px]"
                    >
                        <Image src="/logos/cancel.svg" alt="" width={40} height={40} className="cursor-pointer ml-auto mb-[2.313rem]" onClick={() => setShowModal(false)}/>
                        <h1 className="text-3xl font-medium text-center mb-[2.813rem]">თანამშრომლის დამატება</h1>
                        <ModalForm 
                            departments={departments}
                            setShowModal={setShowModal}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}