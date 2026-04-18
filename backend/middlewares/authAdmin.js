import jwt from "jsonwebtoken";

// Admin Authentication Middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      res.status(400).send({
        success: false,
        message: "Not Autherized Login Again",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (token_decode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      res.status(400).send({
        success: false,
        message: "Not Autherized Login Again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export default authAdmin;
