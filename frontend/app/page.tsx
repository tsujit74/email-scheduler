"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    }

    checkAuth();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-gray-500">Loading...</p>
    </main>
  );
}