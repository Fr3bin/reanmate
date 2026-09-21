"use client";

import { useCallback, useEffect, useState } from "react";
import { mergeCatalog } from "@/lib/catalog-overlay";
import type { Chapter } from "@/lib/types";

export function useMergedCatalog(seed?: Chapter[]) {
  const [chapters, setChapters] = useState<Chapter[]>(
    () => seed ?? mergeCatalog(),
  );

  const refresh = useCallback(() => {
    setChapters(mergeCatalog());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { chapters, refresh };
}
