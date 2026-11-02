import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SiteHeader } from "@/ui/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "ALGORITHMA — Learn, visualize and experiment with algorithms",
    template: "%s · ALGORITHMA",
  },
  description:
    "Interactive algorithm encyclopedia: explanations at five depths, step-by-step visualizations driven by real execution traces, tested implementations and exam notes.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#12151d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p style={{ margin: 0 }}>
              ALGORITHMA — Learn. Visualize. Implement. Experiment. Innovate. Lesson prose is an
              unreviewed draft unless marked otherwise; code samples and quantitative claims are
              checked by automated tests.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
