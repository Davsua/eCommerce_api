const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const { User } = require("../models/user.model");

dotenv.config({ path: "./config.env" });

exports.authenticateSesion = catchAsync(async (req, res, next) => {
  let token; // solo toma valor si entra en el sig if

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError(401, "invalid session"));
  }

  //verificar token, promisify para convertir una funcion sincrona en asincrona
  const decodedToken = await promisify(jwt.verify)(
    token, //verifica token como tal
    process.env.JWT_SECRET_KEY //verifica firma del token
  );

  const user = await User.findOne({
    where: { id: decodedToken.id, status: "active" },
    attributes: { exclude: "password" },
  });

  if (!user) {
    return next(
      new AppError(401, "invalid session, id doesnt exist / status: delete")
    );
  }

  req.currentUser = user;

  next();
});
