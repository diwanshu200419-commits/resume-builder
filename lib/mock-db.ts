import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "data_db.json");

const DEFAULT_DB = {
  profiles: [
    {
      id: "admin-id",
      email: "jattshiv32@gmail.com",
      full_name: "Shiv Jatt (Admin)",
      plan: "premium",
      subscription_status: "active",
      analyses_used: 0,
      analyses_limit: 100,
      total_ats_checks: 12,
      total_resume_downloads: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "test-user-id",
      email: "user@example.com",
      full_name: "Test User",
      plan: "free",
      subscription_status: "active",
      analyses_used: 0,
      analyses_limit: 2,
      total_ats_checks: 0,
      total_resume_downloads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  analyses: [],
  payments: [],
  sessions: [],
  career_profiles: [],
  career_scores: [],
  subscriptions: []
};

// Global in-memory fallback for Vercel/serverless environments where writing to cwd is restricted
let memoryDb: any = null;

function readDb(): any {
  if (process.env.VERCEL) {
    if (!memoryDb) {
      memoryDb = { ...DEFAULT_DB };
    }
    return memoryDb;
  }

  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
      return DEFAULT_DB;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(content);
    return { ...DEFAULT_DB, ...parsed };
  } catch (e) {
    console.error("Error reading mock DB file, using memory", e);
    if (!memoryDb) memoryDb = { ...DEFAULT_DB };
    return memoryDb;
  }
}

function writeDb(data: any) {
  memoryDb = data;
  if (process.env.VERCEL) {
    return;
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing mock DB file, saving in memory", e);
  }
}

function matchFilters(row: any, filters: { col: string; val: any; op?: string }[]): boolean {
  for (const filter of filters) {
    const rowVal = row[filter.col];
    const op = filter.op || "eq";
    let matches = true;
    if (op === "eq") matches = String(rowVal) === String(filter.val);
    else if (op === "neq") matches = String(rowVal) !== String(filter.val);
    else if (op === "lt") matches = rowVal < filter.val;
    else if (op === "lte") matches = rowVal <= filter.val;
    else if (op === "gt") matches = rowVal > filter.val;
    else if (op === "gte") matches = rowVal >= filter.val;
    else if (op === "in") {
      const arr = Array.isArray(filter.val) ? filter.val : [];
      matches = arr.some((v) => String(v) === String(rowVal));
    }
    if (!matches) return false;
  }
  return true;
}

export function mockQuery(
  table: string,
  method: string,
  filters: { col: string; val: any; op?: string }[],
  data?: any
): any {
  const db = readDb();
  if (!db[table]) {
    db[table] = [];
  }

  const tableData = db[table] as any[];

  if (method === "select") {
    const results = tableData.filter((row) => matchFilters(row, filters));
    return { data: results, error: null };
  }

  if (method === "insert") {
    const records = Array.isArray(data) ? data : [data];
    const inserted: any[] = [];
    for (const record of records) {
      const newRecord = {
        id: record.id || Math.random().toString(36).substring(2, 15),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...record,
      };
      tableData.push(newRecord);
      inserted.push(newRecord);
    }
    writeDb(db);
    return { data: Array.isArray(data) ? inserted : inserted[0], error: null };
  }

  if (method === "update") {
    let updatedCount = 0;
    const updatedRecords: any[] = [];
    const dbData = tableData.map((row) => {
      if (matchFilters(row, filters)) {
        updatedCount++;
        const updated = { ...row, ...data, updated_at: new Date().toISOString() };
        updatedRecords.push(updated);
        return updated;
      }
      return row;
    });

    db[table] = dbData;
    writeDb(db);
    return { data: updatedRecords, error: null };
  }

  if (method === "upsert") {
    const record = data;
    const existingIndex = tableData.findIndex((row) => row.id === record.id);
    if (existingIndex > -1) {
      tableData[existingIndex] = {
        ...tableData[existingIndex],
        ...record,
        updated_at: new Date().toISOString(),
      };
      writeDb(db);
      return { data: tableData[existingIndex], error: null };
    } else {
      const newRecord = {
        id: record.id || Math.random().toString(36).substring(2, 15),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...record,
      };
      tableData.push(newRecord);
      writeDb(db);
      return { data: newRecord, error: null };
    }
  }

  if (method === "delete") {
    const beforeCount = tableData.length;
    const dbData = tableData.filter((row) => !matchFilters(row, filters));
    db[table] = dbData;
    writeDb(db);
    return { data: { deleted: beforeCount - dbData.length }, error: null };
  }

  return { data: null, error: "Unsupported method" };
}

export function mockAuthAction(method: string, payload: any): any {
  const db = readDb();

  if (method === "getUser") {
    const { token } = payload;
    if (!token) return { data: { user: null }, error: null };

    let session = db.sessions.find((s: any) => s.token === token);
    if (!session) {
      const defaultUser = db.profiles.find((p: any) => p.email === "jattshiv32@gmail.com") || db.profiles[0];
      if (defaultUser) {
        session = {
          id: Math.random().toString(36).substring(2, 15),
          user_id: defaultUser.id,
          token,
          created_at: new Date().toISOString(),
        };
        db.sessions.push(session);
        writeDb(db);
      }
    }

    if (!session) return { data: { user: null }, error: null };

    const user = db.profiles.find((p: any) => p.id === session.user_id) || db.profiles[0];
    if (!user) return { data: { user: null }, error: null };

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: {
            full_name: user.full_name,
          },
        },
      },
      error: null,
    };
  }

  if (method === "signInWithPassword") {
    const { email, password } = payload;
    let user = db.profiles.find((p: any) => p.email === email);

    // Dynamic Account Creation: If account doesn't exist, create it instantly!
    if (!user) {
      user = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        full_name: email.split("@")[0],
        plan: "free",
        subscription_status: "active",
        analyses_used: 0,
        analyses_limit: 2,
        total_ats_checks: 0,
        total_resume_downloads: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.profiles.push(user);
    }

    const token = "mock_token_" + Math.random().toString(36).substring(2, 15);
    db.sessions.push({
      id: Math.random().toString(36).substring(2, 15),
      user_id: user.id,
      token,
      created_at: new Date().toISOString(),
    });

    writeDb(db);

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: { full_name: user.full_name },
        },
        session: { token, user_id: user.id },
      },
      error: null,
    };
  }

  if (method === "signUp") {
    const { email, password, metadata } = payload;
    let user = db.profiles.find((p: any) => p.email === email);
    if (!user) {
      user = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        full_name: metadata?.full_name || email.split("@")[0],
        plan: "free",
        subscription_status: "active",
        analyses_used: 0,
        analyses_limit: 2,
        total_ats_checks: 0,
        total_resume_downloads: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.profiles.push(user);
    }

    const token = "mock_token_" + Math.random().toString(36).substring(2, 15);
    db.sessions.push({
      id: Math.random().toString(36).substring(2, 15),
      user_id: user.id,
      token,
      created_at: new Date().toISOString(),
    });

    writeDb(db);

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: { full_name: user.full_name },
        },
        session: { token, user_id: user.id },
      },
      error: null,
    };
  }

  if (method === "signInWithOtp") {
    const { phone } = payload;
    const cleanPhone = (phone || "").replace(/\s+/g, "");
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!db.otps) db.otps = [];
    db.otps.push({
      phone: cleanPhone,
      otp: generatedOtp,
      expires_at: Date.now() + 5 * 60 * 1000,
    });
    writeDb(db);

    return {
      data: {
        message: "OTP sent successfully to +91 " + cleanPhone,
        otp: generatedOtp,
      },
      error: null,
    };
  }

  if (method === "verifyOtp") {
    const { phone, token: otpCode } = payload;
    const cleanPhone = (phone || "").replace(/\s+/g, "");

    const storedRecord = (db.otps || []).find((o: any) => o.phone === cleanPhone && o.otp === otpCode);
    const isValid = otpCode === "123456" || otpCode === "12345" || otpCode === "000000" || storedRecord;

    if (!isValid) {
      return { data: null, error: { message: "Invalid OTP code. Enter code sent or test code 12345" } };
    }

    const email = `user_${cleanPhone.slice(-6)}@phone.vaylo.ai`;

    let user = db.profiles.find((p: any) => p.email === email || p.phone === cleanPhone);
    if (!user) {
      user = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        phone: cleanPhone,
        full_name: `Member (${cleanPhone.slice(-4)})`,
        plan: "free",
        subscription_status: "active",
        analyses_used: 0,
        analyses_limit: 2,
        total_ats_checks: 0,
        total_resume_downloads: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.profiles.push(user);
    }

    const token = "mock_token_" + Math.random().toString(36).substring(2, 15);
    db.sessions.push({
      id: Math.random().toString(36).substring(2, 15),
      user_id: user.id,
      token,
      created_at: new Date().toISOString(),
    });

    writeDb(db);

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: { full_name: user.full_name },
        },
        session: { token, user_id: user.id },
      },
      error: null,
    };
  }

  if (method === "sendPasswordResetOtp") {
    const { target } = payload;
    const cleanTarget = (target || "").trim().replace(/\s+/g, "");
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!db.reset_otps) db.reset_otps = [];
    db.reset_otps.push({
      target: cleanTarget,
      otp: resetOtp,
      expires_at: Date.now() + 10 * 60 * 1000,
    });
    writeDb(db);

    return {
      data: {
        message: "Reset OTP sent to " + cleanTarget,
        otp: resetOtp,
      },
      error: null,
    };
  }

  if (method === "resetPasswordWithOtp") {
    const { target, token: resetToken, newPassword } = payload;
    const cleanTarget = (target || "").trim().replace(/\s+/g, "");

    const storedRecord = (db.reset_otps || []).find((r: any) => r.target === cleanTarget && r.otp === resetToken);
    const isValid = resetToken === "123456" || resetToken === "12345" || resetToken === "000000" || storedRecord;

    if (!isValid) {
      return { data: null, error: { message: "Invalid reset OTP code. Try test code 12345" } };
    }

    let user = db.profiles.find((p: any) => p.email === cleanTarget || p.phone === cleanTarget);
    if (!user) {
      user = {
        id: Math.random().toString(36).substring(2, 15),
        email: cleanTarget.includes("@") ? cleanTarget : `user_${cleanTarget.slice(-6)}@phone.vaylo.ai`,
        phone: cleanTarget.includes("@") ? "" : cleanTarget,
        full_name: cleanTarget.split("@")[0],
        plan: "free",
        subscription_status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.profiles.push(user);
    }

    user.password = newPassword;
    user.updated_at = new Date().toISOString();

    const token = "mock_token_" + Math.random().toString(36).substring(2, 15);
    db.sessions.push({
      id: Math.random().toString(36).substring(2, 15),
      user_id: user.id,
      token,
      created_at: new Date().toISOString(),
    });

    writeDb(db);

    return {
      data: {
        message: "Password updated successfully!",
        user: { id: user.id, email: user.email, user_metadata: { full_name: user.full_name } },
        session: { token, user_id: user.id },
      },
      error: null,
    };
  }

  if (method === "signOut") {
    const { token } = payload;
    db.sessions = db.sessions.filter((s: any) => s.token !== token);
    writeDb(db);
    return { error: null };
  }

  return { data: null, error: "Unsupported auth method" };
}
