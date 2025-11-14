import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDebounce, useDebounceWithCancel } from "~/utils/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("debe ejecutar la función después del delay", async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    result.current();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("debe cancelar llamadas previas si se llama múltiples veces", async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    result.current();
    result.current();
    result.current();

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("debe usar delay por defecto de 300ms", async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback));

    result.current();
    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("useDebounceWithCancel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("debe ejecutar la función después del delay", async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounceWithCancel(callback, 300));

    result.current.debounced();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("debe cancelar la ejecución pendiente", async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounceWithCancel(callback, 300));

    result.current.debounced();
    result.current.cancel();

    vi.advanceTimersByTime(300);
    expect(callback).not.toHaveBeenCalled();
  });
});

