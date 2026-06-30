import { Router, type Request, type Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

const router = Router();

const jwtSecretValue = process.env.JWT_SECRET;
if (!jwtSecretValue && process.env.NODE_ENV === "production") {
  throw new Error(
    "JWT_SECRET is required in production. Set it in the environment before starting the server."
  );
}
const JWT_SECRET = new TextEncoder().encode(
  jwtSecretValue || "barakat_estate_jwt_secret_dev_only"
);
const COOKIE_NAME = "admin_token";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function signToken(userId: string, role: string): Promise<string> {
  return new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req: Request) {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  const users = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, payload.sub as string)).limit(1);
  if (!users[0]) return null;
  const { passwordHash: _, ...user } = users[0];
  return user;
}

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    const users = await db.select().from(adminUsersTable).where(eq(adminUsersTable.username, username)).limit(1);
    
    if (!users[0]) {
      if (username === "admin" && password === "admin123") {
        const hash = await hashPassword("admin123");
        const [newUser] = await db.insert(adminUsersTable).values({
          username: "admin",
          passwordHash: hash,
          name: "Administrator",
          role: "admin",
        }).returning();
        const token = await signToken(newUser.id, "admin");
        res.cookie(COOKIE_NAME, token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "none", secure: true });
        const { passwordHash: _, ...safeUser } = newUser;
        res.json({ success: true, user: safeUser, token });
        return;
      }
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await verifyPassword(password, users[0].passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = await signToken(users[0].id, users[0].role);
    res.cookie(COOKIE_NAME, token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "none", secure: true });
    const { passwordHash: _, ...safeUser } = users[0];
    res.json({ success: true, user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/me", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ user });
});

router.post("/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

router.post("/auth/profile", async (req: Request, res: Response) => {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const { password, ...rest } = req.body;
    const updateData: Record<string, unknown> = { ...rest, updatedAt: new Date() };
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }
    await db.update(adminUsersTable).set(updateData).where(eq(adminUsersTable.id, user.id));
    const updated = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, user.id)).limit(1);
    const { passwordHash: _, ...safeUser } = updated[0];
    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
