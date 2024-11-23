"use client";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export default function RedirectComponent({ url }) {
  const router = useRouter();
  useEffect(() => {
    redirect(url);
  }, [router]);

  return null;
}
