const error404 = (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
};

const error500 = (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
};

export { error404, error500 };
