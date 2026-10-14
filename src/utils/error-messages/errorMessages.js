const ERROR_MESSAGES = Object.freeze({
  REQUEST_INVALID_FORMAT:
    "REQUEST_INVALID_FORMAT: The request format is invalid.",
  VALIDATION_FAILED: "VALIDATION_FAILED: One or more fields are invalid.",
  RESOURCE_NOT_FOUND:
    "RESOURCE_NOT_FOUND: The requested resource was not found.",
  RESOURCE_ALREADY_EXISTS:
    "RESOURCE_ALREADY_EXISTS: A resource with these details already exists.",
  AUTHENTICATION_REQUIRED:
    "AUTHENTICATION_REQUIRED: Authentication is required.",
  AUTH_INVALID_CREDENTIALS:
    "AUTH_INVALID_CREDENTIALS: Email or password is incorrect.",
  AUTH_EMAIL_ALREADY_REGISTERED:
    "AUTH_EMAIL_ALREADY_REGISTERED: An account with this email already exists.",
  AUTH_ACCESS_TOKEN_REQUIRED:
    "AUTH_ACCESS_TOKEN_REQUIRED: An access token is required.",
  AUTH_ACCESS_TOKEN_INVALID:
    "AUTH_ACCESS_TOKEN_INVALID: The access token is invalid.",
  AUTH_ACCESS_TOKEN_EXPIRED:
    "AUTH_ACCESS_TOKEN_EXPIRED: The access token has expired.",
  AUTH_REFRESH_TOKEN_REQUIRED:
    "AUTH_REFRESH_TOKEN_REQUIRED: A refresh token is required.",
  AUTH_REFRESH_TOKEN_INVALID:
    "AUTH_REFRESH_TOKEN_INVALID: The refresh token is invalid.",
  AUTH_REFRESH_TOKEN_EXPIRED:
    "AUTH_REFRESH_TOKEN_EXPIRED: The refresh token has expired.",
  USER_ALREADY_EXISTS:
    "USER_ALREADY_EXISTS: this user already exists try signing in ",
  PERMISSION_FORBIDDEN:
    "PERMISSION_FORBIDDEN: You do not have permission to perform this action.",
  DATABASE_OPERATION_FAILED:
    "DATABASE_OPERATION_FAILED: The requested data could not be saved or retrieved.",
  RATE_LIMIT_EXCEEDED:
    "RATE_LIMIT_EXCEEDED: Too many requests. Please try again later.",
  SERVER_INTERNAL_ERROR:
    "SERVER_INTERNAL_ERROR: An unexpected server error occurred.",
});

export default ERROR_MESSAGES;
