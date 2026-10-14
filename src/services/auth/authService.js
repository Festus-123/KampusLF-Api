import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from 'bcryptjs';
import CustomError from '../../utils/custom-error/customError.js'
import db from "../../config/db.js";
import { AuthModels } from "../../models/auth/authModel.js";
import ERROR_MESSAGES from "../../utils/error-messages/errorMessages.js";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_PERIOD = 7;

const generateAccessToken = (user) => {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateAndStoreRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_PERIOD * 24 * 60 * 60 * 1000,
  );

  await db.query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [userId, token, expiresAt],
  );

  return token;
};

const isEmptyFields = (...fields) => {
  if (fields.some((field) => !field)) {
    throw new CustomError(ERROR_MESSAGES.VALIDATION_FAILED, 400);
  }
};

const tokenHandler = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateAndStoreRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  async signup(name, email, password) {
    isEmptyFields(name, email, password);

    const isEsist = await AuthModels.findByEmail(email);
    if (isEsist) {
      throw new CustomError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await AuthModels.create(name, email, passwordHash);

    const { accessToken, refreshToken } = await tokenHandler(user);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.full_name, email: user.email },
    };
  },

  async signin(email, password) {
    isEmptyFields(email, password);

    const user = await AuthModels.findByEmail(email);

    if(!user){
      throw new CustomError(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS, 401)
    }

    const isPasswordHash = await bcrypt.compare(password, user.password_hash);

    if(!isPasswordHash){
      throw new CustomError(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS, 401)
    }

    const { accessToken, refreshToken } = await tokenHandler(user);

    return {
      accessToken,
      refreshToken,
      user: {id: user.id, name: user.full_name, email: user.email}
    };
  },

  async refreshToken() {},
};
