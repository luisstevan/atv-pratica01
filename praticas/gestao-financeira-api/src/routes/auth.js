import { Router } from "express";
import { loginSchema } from "../schemas/authSchema.js";

const router = Router();

const DEMO_USER = {
  id: "user-demo-iesb",
  name: "Luis Stevan",
  email: "luis@iesb.com",
  password: "123456",
};

router.post("/login", (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" });
    }
    res.json({
      token: "demo-token-gestao-financeira",
      user: { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
