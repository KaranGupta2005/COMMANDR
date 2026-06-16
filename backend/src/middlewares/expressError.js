class ExpressError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ExpressError";
  }
}

export default ExpressError;
