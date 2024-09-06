import bcrypt from 'bcryptjs';


export function checkPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

  if (/\d/.test(password)) strength++;

  if (/[@$!%*?&#]/.test(password)) strength++;

  return strength;
}

export async function hashPassword(password) {
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export async function comparePassword(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
}