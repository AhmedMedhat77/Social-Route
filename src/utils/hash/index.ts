import bcrypt from "bcrypt";

/**
 * @param password
 * @returns hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

/**
 * @param password
 * @param hashedPassword
 * @returns boolean
 */

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * @param phoneNumber
 * @returns hashed phone number
 */
export const hashPhoneNumber = async (phoneNumber: string): Promise<string> => {
  return await bcrypt.hash(phoneNumber, 10);
};

/**
 * @param phoneNumber
 * @param hashedPhoneNumber
 * @returns boolean
 */
export const comparePhoneNumber = async (
  phoneNumber: string,
  hashedPhoneNumber: string
): Promise<boolean> => {
  return await bcrypt.compare(phoneNumber, hashedPhoneNumber);
};
