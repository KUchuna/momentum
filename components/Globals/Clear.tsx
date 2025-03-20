"use client";
import { useEffect } from "react";

export default function Clear() {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return null;
}