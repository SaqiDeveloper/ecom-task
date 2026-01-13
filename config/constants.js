module.exports = {
    STATUS_CODES: {
      SUCCESS: 200,
      CREATED: 201,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      FORBIDDEN: 403,
      CONFLICT: 409,
      REQUIRED: 400,
      INTERNAL_SERVER_ERROR: 500,
      BAD_REQUEST: 400,
    },
    TEXTS: {
      // Auth messages
      LOGIN: "Login Successfully!",
      INVALID_CREDENTIALS: "Invalid credentials!",
      INVALID_AUTH_TOKEN: "Invalid auth token!",
      NO_AUTH_GIVEN: "No auth given",
      REGISTERED_SUCCESS: "User registered successfully",
      EMAIL_ALREADY_EXISTS: "User with this email already exists",
      PHONE_ALREADY_EXISTS: "User with this phone number already exists",
      USER_NOT_FOUND: "User not found!",
      // OTP messages
      OTP_SENT: "Otp sent Successfully!",
      OTP_VERIFIED: "Otp verified Successfully!",
      INVALID_OTP: "Invalid Otp",
    },
  };