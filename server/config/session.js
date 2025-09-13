export const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,           // HTTPS면 true + trust proxy 필요
    maxAge: 1000 * 60 * 60,  // 1h
  },
};

