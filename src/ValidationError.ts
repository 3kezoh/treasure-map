/**
 * Custom error class for validation errors. It extends the built-in Error class
 * and includes an array of error messages.
 */
export class ValidationError extends Error {
  public errors: string[];

  constructor(errors: string[], message: string = "Something went wrong") {
    super(message);

    this.name = "ValidationError";
    this.errors = errors;
  }
}

/**
 * Checks if an error is an instance of the custom ValidationError class.
 *
 * @param error - The error to be checked.
 * @returns `true` if the error is a ValidationError; otherwise, `false`.
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
