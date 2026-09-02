import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Footer from "./Footer";

// Mock the lucide-react icons if necessary, but since they are SVG, testing-library can render them
describe("Footer component", () => {
  it("should render footer on non-dashboard pages", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Footer />
      </MemoryRouter>,
    );
    const elements = screen.getAllByText(/HealthNexus/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should NOT render footer on dashboard pages", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Footer />
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });
});
