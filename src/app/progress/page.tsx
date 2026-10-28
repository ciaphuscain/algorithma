import type { Metadata } from "next";
import { DOMAINS } from "@/content/domains";
import { ENTRY_FACTS } from "@/content/facts";
import { ProgressClient } from "@/ui/ProgressClient";

export const metadata: Metadata = {
  title: "Your progress",
  description:
    "Practice results by topic and suggested next algorithms, stored only in this browser.",
};

export default function ProgressPage() {
  return (
    <div className="container">
      <header className="page-head">
        <h1>Your progress</h1>
        <p>
          Practice results by topic, and what to learn next. Everything here is stored only in this
          browser: there are no accounts yet, and nothing is sent anywhere.
        </p>
      </header>
      <ProgressClient
        facts={ENTRY_FACTS}
        domains={Object.fromEntries(DOMAINS.map((d) => [d.id, d.title]))}
      />
    </div>
  );
}
