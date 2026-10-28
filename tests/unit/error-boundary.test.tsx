// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "@/ui/ErrorBoundary";

afterEach(cleanup);

function Bomb({ explode }: { explode: boolean }) {
  if (explode) throw new Error("renderer exploded");
  return <p>drawn fine</p>;
}

describe("ErrorBoundary", () => {
  it("contains a failing child, keeps siblings, and recovers when the reset key changes", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(
      <>
        <p>controls still here</p>
        <ErrorBoundary label="this array" resetKey={1}>
          <Bomb explode />
        </ErrorBoundary>
      </>,
    );
    expect(screen.getByTestId("render-error")).toHaveTextContent("Could not draw this array");
    expect(screen.getByTestId("render-error")).toHaveTextContent("renderer exploded");
    expect(screen.getByText("controls still here")).toBeInTheDocument();

    rerender(
      <>
        <p>controls still here</p>
        <ErrorBoundary label="this array" resetKey={2}>
          <Bomb explode={false} />
        </ErrorBoundary>
      </>,
    );
    expect(screen.getByText("drawn fine")).toBeInTheDocument();
    spy.mockRestore();
  });

  it("offers a manual retry", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    let explode = true;
    const Flaky = () => <Bomb explode={explode} />;
    render(
      <ErrorBoundary label="x">
        <Flaky />
      </ErrorBoundary>,
    );
    explode = false;
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByText("drawn fine")).toBeInTheDocument();
    spy.mockRestore();
  });
});
