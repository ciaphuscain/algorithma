"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/progress";

/** Records that the page was opened (for "continue learning"), not that it was learned. */
export function VisitRecorder({ slug }: { slug: string }) {
  useEffect(() => recordVisit(slug), [slug]);
  return null;
}
