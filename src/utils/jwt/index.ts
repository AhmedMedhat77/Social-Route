import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config/config";

/**
 * @param userId
 * @param expiresIn
 * @returns token
 */

const generateToken = (
  payload: string | object | Buffer,
  options?: SignOptions,
  tokenSecret?: string
): string => {
  const token = jwt.sign(payload, tokenSecret || config.TOKEN_SECRET, {
    ...options,
  });
  return token;
};

interface TokenPayload {
  _id: string;
  email?: string;
  phone?: string;
  iat?: number;
  exp?: number;
}

const verifyToken = async (token: string, tokenSecret?: string): Promise<TokenPayload | null> => {
  try {
    const decoded = jwt.verify(token, tokenSecret || config.TOKEN_SECRET);

    // Type guard to ensure the decoded token matches our expected shape
    if (typeof decoded === "object" && decoded !== null && "_id" in decoded) {
      return decoded as TokenPayload;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };
