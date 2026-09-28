// Throw this anywhere: throw new ApiError(400, 'Message'). The error handler turns it into JSON.
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
module.exports = ApiError;
