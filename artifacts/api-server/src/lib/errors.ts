export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const cause = err.cause;
    if (cause instanceof Error && cause.message) {
      return `${err.message} — причина: ${cause.message}`;
    }
    return err.message;
  }
  if (typeof err === "string") return err;
  return "Unknown error";
}
