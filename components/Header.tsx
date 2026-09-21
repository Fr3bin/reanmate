"use client";

import { useEffect } from "react";
import { getSession } from "@/lib/api/auth";
import { usePathname } from "next/navigation";
import SiteNavbar from "@/components/SiteNavbar";
import type { User } from "@/lib/types";

export default function Header({ user, gradeLabel }: { user: User; gradeLabel?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    let active = true;
    const refresh = () => {
      void getSession().then((session) => {
        if (active && !session) window.location.replace("/login");
      }).catch(() => { /* Server guards continue to reject unavailable sessions. */ });
    };
    const restore = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    refresh();
    const interval = window.setInterval(refresh, 5 * 60 * 1000);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", restore);
    return () => {

      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", restore);
    };
  }, []);
  const isAdmin = user.role === "admin" && pathname.startsWith("/admin");
  return (
    <SiteNavbar variant="app" homeHref={isAdmin ? "/admin" : "/home"}
      gradeLabel={gradeLabel} isAdmin={isAdmin}
      homeActive={!isAdmin && pathname === "/home"} userName={user.displayName} />
  );
}
