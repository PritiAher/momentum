import jwt from "jsonwebtoken";

/**
 * Signs a JWT for the given user id and sets it as an httpOnly cookie.
 * httpOnly + sameSite=strict means the token is never readable by frontend
 * JS (mitigates XSS token theft) and isn't sent on cross-site requests
 * (mitigates CSRF for state-changing routes).
 */
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

  const days = Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 30;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: days * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateTokenAndSetCookie;
