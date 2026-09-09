"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { getStoredUser } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { info } = useToast();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      info("ទំព័រនេះសម្រាប់ Admin តែប៉ុណ្ណោះ។");
      router.replace("/home");
      return;
    }
    setAllowed(true);
  }, [info, router]);

  if (!allowed) return null;
  return children;
}
