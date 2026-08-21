const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Something went wrong';


  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID';
  }

  // duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already in use`;
  }

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Invalid or expired token';
  }

  const body = { success: false, message };
  if (process.env.NODE_ENV === 'development') body.stack = err.stack;

  res.status(status).json(body);
};

module.exports = errorHandler;
