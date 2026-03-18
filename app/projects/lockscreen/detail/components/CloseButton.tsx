"use client";
import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/projects/lockscreen")}
      className="fixed top-4 right-4 z-[110] w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-gray-600 hover:text-gray-900 transition-all text-lg cursor-pointer"
      aria-label="Close presentation"
    >
      ✕
    </button>
  );
}
