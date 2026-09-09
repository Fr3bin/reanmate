"use client";

import { useCallback, useEffect, useState } from "react";
import { getAllChapters } from "@/lib/api";
import { mergeCatalog } from "@/lib/catalog-overlay";
import type { Chapter } from "@/lib/types";

export function useMergedCatalog(seed?: Chapter[]) {
  const [chapters, setChapters] = useState<Chapter[]>(
    () => seed ?? getAllChapters(),
  );

  const refresh = useCallback(() => {
    setChapters(mergeCatalog(getAllChapters()));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { chapters, refresh };
}
