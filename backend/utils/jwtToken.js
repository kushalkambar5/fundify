import dotenv from "dotenv";
dotenv.config();

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //for cookie
  const options = {
    expires: new Date(
      Date.now() + Number(process.env.EXPIRE_COOKIE) * 24 * 60 * 60 * 1000,
    ),
    path: "/",
    sameSite: "lax",
    httpOnly: false,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, user, token });
};

export default sendToken;
