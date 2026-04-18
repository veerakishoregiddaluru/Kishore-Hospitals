import jwt from "jsonwebtoken";
// Doctor Authentication Middleware
const authDoctor = async (req, res, next) => {
  try {
    const dToken = req.headers.dtoken;

    console.log("Incoming token:", dToken);

    if (!dToken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const decoded = jwt.verify(dToken, process.env.JWT_SECRET);
    req.docId = decoded.id;

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default authDoctor;
