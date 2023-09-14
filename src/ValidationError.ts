export class ValidationError extends Error {
  public errors: string[];

  constructor(errors: string[], message: string = "Something went wrong") {
    super(message);

    this.name = "ValidationError";
    this.errors = errors;
  }
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
