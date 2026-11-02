// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("CodeRunner feature flag", () => {
  it("is switched off unless the build enables it", async () => {
    const { CodeRunner } = await import("@/ui/code/CodeRunner");
    render(<CodeRunner initialCode="console.log(1)" label="Your code" />);
    expect(screen.getByTestId("runner-disabled").textContent).toMatch(/switched off/);
    expect(screen.queryByRole("button", { name: "Run" })).toBeNull();
  });

  it("shows the editor and controls when NEXT_PUBLIC_ENABLE_CODE_RUNNER=1", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_CODE_RUNNER", "1");
    const { CodeRunner } = await import("@/ui/code/CodeRunner");
    render(<CodeRunner initialCode="console.log(1)" label="Your code" />);
    expect((screen.getByLabelText("Your code") as HTMLTextAreaElement).value).toBe(
      "console.log(1)",
    );
    expect(screen.getByRole("button", { name: "Run" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Stop" }).hasAttribute("disabled")).toBe(true);
  });
});
