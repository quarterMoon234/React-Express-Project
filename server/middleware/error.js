export function notFound(req, res, _next) {
  res.status(404).json({ ok: false, message: "Not Found" });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const body = {
    ok: false,
    message: err.message || "Internal Server Error"
  }
  if (process.env.NODE_ENV !== "production") {
    body.stack = err.stack;
  }
  console.error(`[${new Date().toISOString()}]`, err);
  res.status(status).json(body);  
}

