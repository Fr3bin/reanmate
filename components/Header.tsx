"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SiteNavbar from "@/components/SiteNavbar";
import { getStoredUser } from "@/lib/auth";

/** In-app header — thin wrapper so existing imports keep working */
export default function Header({ gradeLabel }: { gradeLabel?: string }) {
  const pathname = usePathname();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    setIsAdminUser(getStoredUser()?.role === "admin");
  }, [pathname]);

  const isAdmin = isAdminUser;

  return (
    <SiteNavbar
      variant="app"
      homeHref={isAdmin ? "/admin" : "/home"}
      gradeLabel={gradeLabel}
      isAdmin={isAdmin}
      homeActive={!isAdmin && pathname === "/home"}
    />
  );
}
