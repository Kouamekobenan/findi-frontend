export function formatDayHours(time: unknown): string {
  if (typeof time === "string") {
    return time;
  }
  if (time && typeof time === "object") {
    const { open, close, isClosed } = time as {
      open?: string;
      close?: string;
      isClosed?: boolean;
    };
    if (isClosed) return "Fermé";
    if (open && close) return `${open} - ${close}`;
  }
  return "Non renseigné";
}
