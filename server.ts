import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;
const SESSION_COOKIE_NAME = "ctn_admin_session";
const SESSION_IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const SESSION_DEBUG = process.env.SESSION_DEBUG === "true";
const AUDIT_LOG_PATH =
  process.env.AUDIT_LOG_PATH ||
  path.resolve(process.cwd(), "logs", "ctn-et-audit-log.txt");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Configure PostgreSQL in your environment.");
}

// Database Setup (PostgreSQL only)
const db = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
});
console.log("Using PostgreSQL database");

const generateId = () => Math.random().toString(36).slice(2, 11);

const extractGoogleDriveFileId = (url: string) => {
  if (!url) return null;
  const match = url.match(/\/d\/([^/]+)\//);
  return match?.[1] ?? null;
};

const toGoogleDriveEmbed = (url: string) => {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const iframe = `<iframe src="${previewUrl}" width="150" height="200" allow="autoplay"></iframe>`;
  return { fileId, previewUrl, iframe };
};

const getCookieOptions = (req?: any) => {
  const forwardedProto = req?.headers?.["x-forwarded-proto"];
  const isSecure = Boolean(req?.secure || forwardedProto === "https");
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecure,
    maxAge: SESSION_IDLE_TIMEOUT_MS,
    path: "/",
  };
};

const getCookieClearOptions = (req?: any) => {
  const { httpOnly, sameSite, secure, path } = getCookieOptions(req);
  return { httpOnly, sameSite, secure, path };
};

const hashSessionId = (sessionId: string) =>
  createHash("sha256").update(sessionId).digest("hex");

const parseCookies = (cookieHeader?: string) => {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (!name) continue;
    cookies[name] = decodeURIComponent(rest.join("="));
  }
  return cookies;
};

const debugSession = (...args: any[]) => {
  if (SESSION_DEBUG) {
    console.log("[session]", ...args);
  }
};

let auditLogReady: Promise<void> | null = null;
const ensureAuditLogDir = () => {
  if (!auditLogReady) {
    auditLogReady = fs.mkdir(path.dirname(AUDIT_LOG_PATH), { recursive: true });
  }
  return auditLogReady;
};

// Initialize Database Schema
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    password_hash TEXT,
    role TEXT DEFAULT 'USER',
    must_change_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS volunteers (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    sex TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    national_id TEXT,
    address TEXT,
    chronic_illness BOOLEAN DEFAULT FALSE,
    health_data JSONB,
    consent_given BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS trials (
    id TEXT PRIMARY KEY,
    trial_number TEXT UNIQUE,
    title TEXT NOT NULL,
    phase TEXT,
    status TEXT DEFAULT 'RECRUITING',
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_am TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_am TEXT NOT NULL,
    description_en TEXT,
    description_am TEXT,
    photos TEXT, -- JSON array of base64 or URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_am TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_am TEXT NOT NULL,
    description_en TEXT,
    description_am TEXT,
    photos TEXT, -- JSON array of base64 or URLs
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL, -- university, bank, others
    name TEXT NOT NULL,
    description TEXT,
    official_website TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('guidelines_directives', 'online_courses', 'publications')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    drive_link TEXT,
    drive_iframe_html TEXT,
    author TEXT,
    publication_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    member_title TEXT NOT NULL,
    position_role TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    facebook_url TEXT,
    x_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS partner_applications (
    id TEXT PRIMARY KEY,
    organization TEXT NOT NULL,
    category TEXT NOT NULL,
    other_category TEXT,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_email TEXT,
    action TEXT NOT NULL,
    entity TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE
  );
`;

async function initDb() {
  await db.query(schema);

  // Backward-compatible migration for older users table schemas.
  const userColumnsResult = await db.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'users'`
  );
  const userColumns = new Set(userColumnsResult.rows.map((row: any) => row.column_name));

  if (!userColumns.has("password")) {
    await db.query(`ALTER TABLE users ADD COLUMN password TEXT`);
  }
  if (!userColumns.has("password_hash")) {
    await db.query(`ALTER TABLE users ADD COLUMN password_hash TEXT`);
  }
  if (!userColumns.has("must_change_password")) {
    await db.query(`ALTER TABLE users ADD COLUMN must_change_password BOOLEAN DEFAULT FALSE`);
  }
  if (userColumns.has("password_hash")) {
    await db.query(`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`);
    await db.query(
      `UPDATE users
       SET password = COALESCE(password, password_hash)
       WHERE password IS NULL AND password_hash IS NOT NULL`
    );
    await db.query(
      `UPDATE users
       SET password_hash = COALESCE(password_hash, password)
       WHERE password IS NOT NULL`
    );
  }

  // Backward-compatible migration for legacy news schema.
  await db.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS title_en TEXT`);
  await db.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS title_am TEXT`);
  await db.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS summary_en TEXT`);
  await db.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS summary_am TEXT`);
  await db.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS description_en TEXT`);
  await db.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS description_am TEXT`);
  await db.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS photos TEXT`);

  const newsColumnsResult = await db.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'news'`
  );
  const newsColumns = new Set(newsColumnsResult.rows.map((row: any) => row.column_name));

  if (newsColumns.has("title")) {
    await db.query(`ALTER TABLE news ALTER COLUMN title DROP NOT NULL`);
    await db.query(
      `UPDATE news
       SET title_en = COALESCE(title_en, title),
           title_am = COALESCE(title_am, title)
       WHERE title IS NOT NULL`
    );
  }
  if (newsColumns.has("content")) {
    await db.query(`ALTER TABLE news ALTER COLUMN content DROP NOT NULL`);
    await db.query(
      `UPDATE news
       SET summary_en = COALESCE(summary_en, content),
           summary_am = COALESCE(summary_am, content),
           description_en = COALESCE(description_en, content),
           description_am = COALESCE(description_am, content)
       WHERE content IS NOT NULL`
    );
  }
  if (newsColumns.has("image_url")) {
    await db.query(
      `UPDATE news
       SET photos = CASE
         WHEN photos IS NULL OR photos = '' THEN json_build_array(image_url)::text
         ELSE photos
       END
       WHERE image_url IS NOT NULL AND image_url <> ''`
    );
  }
  await db.query(`UPDATE news SET photos = '[]' WHERE photos IS NULL OR photos = ''`);

  // Partners table compatibility.
  await db.query(`ALTER TABLE partners ADD COLUMN IF NOT EXISTS official_website TEXT`);

  // Resources table compatibility.
  await db.query(`CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('guidelines_directives', 'online_courses', 'publications')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    drive_link TEXT,
    drive_iframe_html TEXT,
    author TEXT,
    publication_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await db.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS drive_link TEXT`);
  await db.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS drive_iframe_html TEXT`);
  await db.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS author TEXT`);
  await db.query(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS publication_year INTEGER`);

  // Team members table compatibility.
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS name TEXT`);
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS member_title TEXT`);
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS position_role TEXT`);
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS description TEXT`);
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_url TEXT`);
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS facebook_url TEXT`);
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS x_url TEXT`);
  await db.query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS youtube_url TEXT`);

  await db.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_id TEXT`);
  await db.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_email TEXT`);
  await db.query(`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS user_email TEXT`);
  await db.query(`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
  await db.query(`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP`);
  await db.query(`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS revoked BOOLEAN DEFAULT FALSE`);

  // Ensure default admin accounts exist with correct credentials
  const defaultAdmins = [
    { id: "admin-001", email: "admin@ctn-et.org", password: "admin123" },
    { id: "admin-002", email: "admin@gmail.com", password: "12345" },
  ];

  try {
    for (const admin of defaultAdmins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await db.query(
        `INSERT INTO users (id, email, password, password_hash, role, must_change_password) 
         VALUES ($1, $2, $3, $3, $4, $5) 
         ON CONFLICT (email) DO UPDATE
         SET password = $3, password_hash = $3, role = $4, must_change_password = $5`,
        [admin.id, admin.email, hashedPassword, "ADMIN", false]
      );
    }
    console.log("Admin credentials ensured: admin@ctn-et.org/admin123 and admin@gmail.com/12345");
  } catch (e) {
    console.error("Failed to ensure admin credentials:", e);
  }
}

const logAudit = async (params: { userId?: string; userEmail?: string; action: string; entity?: string }) => {
  const { userId, userEmail, action, entity } = params;
  try {
    await db.query(
      `INSERT INTO audit_logs (id, user_id, user_email, action, entity) VALUES ($1, $2, $3, $4, $5)`,
      [generateId(), userId ?? null, userEmail ?? null, action, entity ?? null]
    );
    await ensureAuditLogDir();
    const timestamp = new Date().toISOString();
    const actor = userEmail || userId || "unknown-admin";
    const target = entity ?? "-";
    const line = `${timestamp} | ${actor} | ${action} | ${target}\n`;
    await fs.appendFile(AUDIT_LOG_PATH, line, "utf8");
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};

const createSession = async (user: { id: string; email: string }) => {
  const sessionId = randomBytes(32).toString("base64url");
  const sessionHash = hashSessionId(sessionId);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_IDLE_TIMEOUT_MS);
  await db.query(
    `INSERT INTO admin_sessions (id, user_id, user_email, created_at, last_activity, expires_at, revoked)
     VALUES ($1, $2, $3, $4, $4, $5, FALSE)`,
    [sessionHash, user.id, user.email, now, expiresAt]
  );
  debugSession("created", { userId: user.id, email: user.email });
  return sessionId;
};

const revokeSession = async (sessionHash: string) => {
  await db.query(`UPDATE admin_sessions SET revoked = TRUE WHERE id = $1`, [sessionHash]);
};

const loadSession = async (req: any, res: any) => {
  const cookies = parseCookies(req.headers.cookie);
  const rawSessionId = cookies[SESSION_COOKIE_NAME];
  if (!rawSessionId) {
    debugSession("missing cookie");
    return null;
  }

  const sessionHash = hashSessionId(rawSessionId);
  const result = await db.query(
    `SELECT s.id, s.user_id, s.user_email, s.last_activity, s.revoked,
            u.email AS account_email, u.role, u.must_change_password
     FROM admin_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = $1`,
    [sessionHash]
  );
  const session = result.rows[0];
  if (!session) {
    debugSession("not found");
    return null;
  }
  if (session.revoked) {
    debugSession("revoked", { userId: session.user_id, email: session.user_email || session.account_email });
    return null;
  }

  const now = new Date();
  const lastActivity = session.last_activity ? new Date(session.last_activity) : now;
  if (now.getTime() - lastActivity.getTime() > SESSION_IDLE_TIMEOUT_MS) {
    await revokeSession(sessionHash);
    res.clearCookie(SESSION_COOKIE_NAME, getCookieClearOptions(req));
    debugSession("expired", { userId: session.user_id, email: session.user_email || session.account_email });
    return null;
  }

  const newExpiresAt = new Date(now.getTime() + SESSION_IDLE_TIMEOUT_MS);
  await db.query(`UPDATE admin_sessions SET last_activity = $2, expires_at = $3 WHERE id = $1`, [
    sessionHash,
    now,
    newExpiresAt,
  ]);
  res.cookie(SESSION_COOKIE_NAME, rawSessionId, getCookieOptions(req));
  debugSession("ok", { userId: session.user_id, email: session.user_email || session.account_email });

  return {
    sessionHash,
    user: {
      id: session.user_id,
      email: session.account_email,
      role: session.role,
      must_change_password: session.must_change_password,
    },
  };
};

// Session middleware
const authenticateSession = async (req: any, res: any, next: any) => {
  try {
    const session = await loadSession(req, res);
    if (!session) return res.status(401).json({ error: "Session expired" });
    req.user = session.user;
    req.session = session;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const authenticateAdmin = async (req: any, res: any, next: any) => {
  try {
    const session = await loadSession(req, res);
    if (!session) return res.status(401).json({ error: "Session expired" });
    if (session.user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
    req.user = session.user;
    req.session = session;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set("trust proxy", 1);
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth API
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];
      const storedHash = user?.password || user?.password_hash;

      if (!user || !storedHash || !(await bcrypt.compare(password, storedHash))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const sessionId = await createSession({ id: user.id, email: user.email });
      res.cookie(SESSION_COOKIE_NAME, sessionId, getCookieOptions(req));

      if (user.role === "ADMIN") {
        await logAudit({ userId: user.id, userEmail: user.email, action: "ADMIN_SIGNIN", entity: "auth" });
      }

      res.json({ user: { id: user.id, email: user.email, role: user.role, must_change_password: user.must_change_password } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const session = await loadSession(req, res);
      if (session?.sessionHash) {
        await revokeSession(session.sessionHash);
      }
      if (session?.user?.role === "ADMIN") {
        await logAudit({ userId: session.user.id, userEmail: session.user.email, action: "ADMIN_SIGNOUT", entity: "auth" });
      }
    } finally {
      res.clearCookie(SESSION_COOKIE_NAME, getCookieClearOptions(req));
      res.json({ message: "Signed out" });
    }
  });

  app.get("/api/auth/me", authenticateSession, async (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/ping", authenticateSession, async (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = generateId();
      const query = `INSERT INTO users (id, email, password, password_hash, role) VALUES ($1, $2, $3, $3, $4)`;
      const values = [id, email, hashedPassword, "USER"];

      await db.query(query, values);
      res.status(201).json({ message: "User created" });
    } catch (error: any) {
      if (error?.code === "23505") {
        return res.status(409).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // Public Content API
  app.get("/api/news", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM news ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM events ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/partners", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM partners ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  app.get("/api/team-members", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM team_members ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.get("/api/resources", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM resources ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Contact API
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      const id = generateId();
      const query = `INSERT INTO contacts (id, name, email, subject, message) VALUES ($1, $2, $3, $4, $5)`;
      const values = [id, name, email, subject, message];

      await db.query(query, values);
      res.status(201).json({ message: "Message sent" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.post("/api/partner-applications", async (req, res) => {
    const { organization, category, otherCategory, phoneNumber, email } = req.body;
    const normalizedCategory = String(category || "").toLowerCase();
    const normalizedOtherCategory = typeof otherCategory === "string" ? otherCategory.trim() : "";

    if (!organization || !normalizedCategory || !phoneNumber || !email) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    if (!["bank", "university", "hospitals", "laboratories", "other"].includes(normalizedCategory)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (normalizedCategory === "other" && !normalizedOtherCategory) {
      return res.status(400).json({ error: "Please specify the other category" });
    }

    try {
      const id = generateId();
      await db.query(
        `INSERT INTO partner_applications (id, organization, category, other_category, phone_number, email)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, organization, normalizedCategory, normalizedOtherCategory || null, phoneNumber, email]
      );
      res.status(201).json({
        message: "you have successfully applied to be a partner our staffs will contact you shortly",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit partner application" });
    }
  });

  // Admin CRUD API
  app.post("/api/admin/news", authenticateAdmin, async (req, res) => {
    const { title_en, title_am, summary_en, summary_am, description_en, description_am, photos } = req.body;
    try {
      const id = generateId();
      const query = `INSERT INTO news (id, title_en, title_am, summary_en, summary_am, description_en, description_am, photos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
      const values = [id, title_en, title_am, summary_en, summary_am, description_en, description_am, JSON.stringify(photos)];

      await db.query(query, values);
      await logAudit({ userId: req.user.id, userEmail: req.user.email, action: "NEWS_CREATE", entity: `news:${id}` });
      res.status(201).json({ message: "News added" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to add news" });
    }
  });

  app.delete("/api/admin/news/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query("DELETE FROM news WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "News item not found" });
      }
      await logAudit({ userId: req.user.id, userEmail: req.user.email, action: "NEWS_DELETE", entity: `news:${id}` });
      res.json({ message: "News deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete news" });
    }
  });

  app.post("/api/admin/events", authenticateAdmin, async (req, res) => {
    const { title_en, title_am, summary_en, summary_am, description_en, description_am, photos, start_date, end_date } = req.body;
    try {
      const id = generateId();
      const query = `INSERT INTO events (id, title_en, title_am, summary_en, summary_am, description_en, description_am, photos, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
      const values = [id, title_en, title_am, summary_en, summary_am, description_en, description_am, JSON.stringify(photos), start_date, end_date];

      await db.query(query, values);
      await logAudit({ userId: req.user.id, userEmail: req.user.email, action: "EVENT_CREATE", entity: `event:${id}` });
      res.status(201).json({ message: "Event added" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to add event" });
    }
  });

  app.delete("/api/admin/events/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query("DELETE FROM events WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      await logAudit({ userId: req.user.id, userEmail: req.user.email, action: "EVENT_DELETE", entity: `event:${id}` });
      res.json({ message: "Event deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete event" });
    }
  });

  app.post("/api/admin/partners", authenticateAdmin, async (req, res) => {
    const { category, name, description, image_url, official_website } = req.body;
    const website =
      typeof official_website === "string" && official_website.trim()
        ? official_website.trim()
        : null;
    try {
      const id = generateId();
      const query = `INSERT INTO partners (id, category, name, description, official_website, image_url) VALUES ($1, $2, $3, $4, $5, $6)`;
      const values = [id, category, name, description, website, image_url];

      await db.query(query, values);
      await logAudit({ userId: req.user.id, userEmail: req.user.email, action: "PARTNER_CREATE", entity: `partner:${id}` });
      res.status(201).json({ message: "Partner added" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to add partner" });
    }
  });

  app.delete("/api/admin/partners/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query("DELETE FROM partners WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Partner not found" });
      }
      await logAudit({ userId: req.user.id, userEmail: req.user.email, action: "PARTNER_DELETE", entity: `partner:${id}` });
      res.json({ message: "Partner deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete partner" });
    }
  });

  app.post("/api/admin/resources", authenticateAdmin, async (req, res) => {
    const {
      resource_type,
      title,
      description,
      drive_link,
      author,
      publication_year,
    } = req.body;

    const normalizedType = String(resource_type || "").trim();
    const normalizedTitle = typeof title === "string" ? title.trim() : "";
    const normalizedDescription =
      typeof description === "string" ? description.trim() : "";
    const normalizedDriveLink =
      typeof drive_link === "string" ? drive_link.trim() : "";
    const normalizedAuthor = typeof author === "string" ? author.trim() : "";
    const normalizedPublicationYear = Number(publication_year);
    const isPublicationYearValid =
      Number.isInteger(normalizedPublicationYear) &&
      normalizedPublicationYear > 0;

    if (
      !["guidelines_directives", "online_courses", "publications"].includes(
        normalizedType
      )
    ) {
      return res.status(400).json({ error: "Invalid resource type" });
    }

    if (!normalizedTitle || !normalizedDescription) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    if (normalizedType === "guidelines_directives" && !normalizedDriveLink) {
      return res
        .status(400)
        .json({ error: "Google Drive link is required for guidelines and directives" });
    }

    if (normalizedType === "publications") {
      if (!normalizedAuthor) {
        return res.status(400).json({ error: "Author is required for publications" });
      }
      if (!isPublicationYearValid) {
        return res
          .status(400)
          .json({ error: "Publication year must be a valid year" });
      }
      if (!normalizedDriveLink) {
        return res
          .status(400)
          .json({ error: "Google Drive link is required for publications" });
      }
    }

    let driveIframeHtml: string | null = null;
    if (normalizedDriveLink) {
      const embed = toGoogleDriveEmbed(normalizedDriveLink);
      if (!embed) {
        return res.status(400).json({
          error:
            "Invalid Google Drive link. Please provide a share URL that contains /d/{FILE_ID}/view",
        });
      }
      driveIframeHtml = embed.iframe;
    }

    try {
      const id = generateId();
      await db.query(
        `INSERT INTO resources (
          id,
          resource_type,
          title,
          description,
          drive_link,
          drive_iframe_html,
          author,
          publication_year
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          normalizedType,
          normalizedTitle,
          normalizedDescription,
          normalizedDriveLink || null,
          driveIframeHtml,
          normalizedType === "publications" ? normalizedAuthor : null,
          normalizedType === "publications" ? normalizedPublicationYear : null,
        ]
      );

      await logAudit({
        userId: req.user.id,
        userEmail: req.user.email,
        action: "RESOURCE_CREATE",
        entity: `resource:${id}`,
      });

      res.status(201).json({
        message: "Resource added",
        iframeHtml: driveIframeHtml,
      });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to add resource" });
    }
  });

  app.delete("/api/admin/resources/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query("DELETE FROM resources WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Resource not found" });
      }
      await logAudit({
        userId: req.user.id,
        userEmail: req.user.email,
        action: "RESOURCE_DELETE",
        entity: `resource:${id}`,
      });
      res.json({ message: "Resource deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete resource" });
    }
  });

  app.post("/api/admin/team-members", authenticateAdmin, async (req, res) => {
    const { name, member_title, position_role, description, photo_url, facebook_url, x_url, youtube_url } = req.body;
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedMemberTitle = typeof member_title === "string" ? member_title.trim() : "";
    const trimmedPositionRole = typeof position_role === "string" ? position_role.trim() : "";
    const trimmedDescription = typeof description === "string" ? description.trim() : "";
    const trimmedPhoto = typeof photo_url === "string" ? photo_url.trim() : "";
    const trimmedFacebookUrl = typeof facebook_url === "string" ? facebook_url.trim() : "";
    const trimmedXUrl = typeof x_url === "string" ? x_url.trim() : "";
    const trimmedYoutubeUrl = typeof youtube_url === "string" ? youtube_url.trim() : "";

    if (!trimmedName || !trimmedMemberTitle || !trimmedPositionRole || !trimmedDescription || !trimmedPhoto) {
      return res.status(400).json({
        error: "name, member_title, position_role, description and photo_url are required",
      });
    }

    try {
      const id = generateId();
      await db.query(
        `INSERT INTO team_members (
          id, name, member_title, position_role, description, photo_url, facebook_url, x_url, youtube_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          trimmedName,
          trimmedMemberTitle,
          trimmedPositionRole,
          trimmedDescription,
          trimmedPhoto,
          trimmedFacebookUrl || null,
          trimmedXUrl || null,
          trimmedYoutubeUrl || null,
        ]
      );
      await logAudit({
        userId: req.user.id,
        userEmail: req.user.email,
        action: "TEAM_MEMBER_CREATE",
        entity: `team-member:${id}`,
      });
      res.status(201).json({ message: "CTNET team member added", id });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to add team member" });
    }
  });

  app.delete("/api/admin/team-members/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query("DELETE FROM team_members WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Team member not found" });
      }
      await logAudit({
        userId: req.user.id,
        userEmail: req.user.email,
        action: "TEAM_MEMBER_DELETE",
        entity: `team-member:${id}`,
      });
      res.json({ message: "Team member deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete team member" });
    }
  });

  app.get("/api/admin/contacts", authenticateAdmin, async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM contacts ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/admin/partner-applications", authenticateAdmin, async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM partner_applications ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partner applications" });
    }
  });

  app.get("/api/admin/notifications", authenticateAdmin, async (req, res) => {
    try {
      const [contactResult, partnerResult] = await Promise.all([
        db.query("SELECT * FROM contacts ORDER BY created_at DESC"),
        db.query("SELECT * FROM partner_applications ORDER BY created_at DESC"),
      ]);

      const contacts = contactResult.rows;
      const partnerApplications = partnerResult.rows;
      const unreadCount =
        contacts.filter((item: any) => !item.is_read).length +
        partnerApplications.filter((item: any) => !item.is_read).length;

      res.json({ contacts, partnerApplications, unreadCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/admin/admins", authenticateAdmin, async (req, res) => {
    try {
      const result = await db.query(
        `SELECT id, email, role, must_change_password, created_at
         FROM users
         WHERE role = 'ADMIN'
         ORDER BY created_at DESC`
      );
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to fetch admins" });
    }
  });

  app.post("/api/admin/add", authenticateAdmin, async (req, res) => {
    const { email } = req.body;
    try {
      const password = Math.random().toString(36).slice(2, 10); // Generated password
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = generateId();
      const query = `INSERT INTO users (id, email, password, password_hash, role, must_change_password) VALUES ($1, $2, $3, $3, $4, $5)`;
      const values = [id, email, hashedPassword, "ADMIN", true];

      await db.query(query, values);
      await logAudit({ userId: req.user.id, userEmail: req.user.email, action: "ADMIN_CREATE", entity: `admin:${email}` });
      
      // In a real app, send email here. For now, return it in response.
      res.status(201).json({ message: "Admin added", generatedPassword: password });
    } catch (error: any) {
      if (error?.code === "23505") {
        return res.status(409).json({ error: "Admin with this email already exists" });
      }
      res.status(500).json({ error: error?.message || "Failed to add admin" });
    }
  });

  app.post("/api/auth/update-password", authenticateSession, async (req, res) => {
    const { email, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
    if (req.user?.email !== email) {
      return res.status(403).json({ error: "Forbidden" });
    }
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query = `UPDATE users SET password = $1, password_hash = $1, must_change_password = $2 WHERE email = $3`;
      const values = [hashedPassword, false, email];

      await db.query(query, values);
      res.json({ message: "Password updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Volunteers API
  app.post("/api/volunteers", async (req, res) => {
    const { id, full_name, date_of_birth, sex, phone_number, email, national_id, address, chronic_illness, health_data, consent_given } = req.body;
    try {
      const query = `
        INSERT INTO volunteers (id, full_name, date_of_birth, sex, phone_number, email, national_id, address, chronic_illness, health_data, consent_given)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;
      const values = [
        id,
        full_name,
        date_of_birth,
        sex,
        phone_number,
        email,
        national_id,
        address,
        Boolean(chronic_illness),
        health_data ?? {},
        Boolean(consent_given),
      ];
      
      await db.query(query, values);
      res.status(201).json({ message: "Volunteer registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register volunteer" });
    }
  });

  app.get("/api/volunteers/count", async (req, res) => {
    try {
      const result = await db.query("SELECT COUNT(*)::int AS count FROM volunteers");
      res.json({ count: result.rows[0]?.count ?? 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch count" });
    }
  });

  // Trials API
  app.get("/api/trials", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM trials ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trials" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function bootstrap() {
  await initDb();
  await startServer();
}

bootstrap().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
