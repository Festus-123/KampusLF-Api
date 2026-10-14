import ERROR_MESSAGES from "../../utils/error-messages/errorMessages.js";

const erroHandlerMiddleware = (err, req, res,next) => {
  const statusCode = err.statusCode || err.status || 500;
    const message = err.message || ERROR_MESSAGES.SERVER_INTERNAL_ERROR

  console.error(`[${req.method} ${req.originalUrl}] ${statusCode}: ${err.stack || err.message}`);
  res.status(statusCode).json({ error: message});

}

export default erroHandlerMiddleware;