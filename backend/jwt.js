import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function adminLogin(req, res) {
  const { username, password } = req.body;
  console.log(username, password);

  // Check username
  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ message: "Invalid username " });
  }
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  // Check password (hashed in env)
  const isMatch = await bcrypt.compare(password, hash);
  console.log(isMatch);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Generate token
  const token = jwt.sign(
    { role: "admin", username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
}
