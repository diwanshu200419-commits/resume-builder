import type { Plan } from "@/types";

class MockQueryBuilder {
  private table: string;
  private method: string = "select";
  private filters: { col: string; val: any; op?: string }[] = [];
  private data: any = null;
  private isSingle: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns?: string) {
    if (this.method === "select") {
      this.method = "select";
    }
    return this;
  }

  insert(data: any) {
    this.method = "insert";
    this.data = data;
    return this;
  }

  update(data: any) {
    this.method = "update";
    this.data = data;
    return this;
  }

  upsert(data: any, options?: any) {
    this.method = "upsert";
    this.data = data;
    return this;
  }

  delete() {
    this.method = "delete";
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ col, val, op: "eq" });
    return this;
  }

  neq(col: string, val: any) {
    this.filters.push({ col, val, op: "neq" });
    return this;
  }

  lt(col: string, val: any) {
    this.filters.push({ col, val, op: "lt" });
    return this;
  }

  lte(col: string, val: any) {
    this.filters.push({ col, val, op: "lte" });
    return this;
  }

  gt(col: string, val: any) {
    this.filters.push({ col, val, op: "gt" });
    return this;
  }

  gte(col: string, val: any) {
    this.filters.push({ col, val, op: "gte" });
    return this;
  }

  in(col: string, valArray: any[]) {
    this.filters.push({ col, val: valArray, op: "in" });
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  order(col: string, options?: any) {
    return this;
  }

  limit(n: number) {
    return this;
  }

  async then(onfulfilled?: (value: any) => any) {
    try {
      const result = await this.execute();
      if (onfulfilled) return onfulfilled(result);
      return result;
    } catch (e: any) {
      const errRes = { data: null, error: e };
      if (onfulfilled) return onfulfilled(errRes);
      return errRes;
    }
  }

  private async execute() {
    const response = await fetch("/api/mock-db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "query",
        table: this.table,
        method: this.method,
        filters: this.filters,
        data: this.data,
      }),
    });
    const res = await response.json();
    if (this.isSingle && res.data) {
      res.data = Array.isArray(res.data) ? res.data[0] || null : res.data;
    }
    return res;
  }
}

export function createClient() {
  return {
    auth: {
      getUser: async () => {
        const token = typeof document !== "undefined"
          ? document.cookie
              .split("; ")
              .find((row) => row.startsWith("mock-session-id="))
              ?.split("=")[1]
          : null;

        if (!token) return { data: { user: null }, error: null };

        try {
          const res = await fetch("/api/mock-db");
          return await res.json();
        } catch (e: any) {
          return { data: { user: null }, error: e };
        }
      },
      exchangeCodeForSession: async (code: string) => {
        return { data: {}, error: null };
      },
      signInWithPassword: async ({ email, password }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signInWithPassword",
              payload: { email, password },
            }),
          });
          const result = await res.json();
          if (result?.data?.session?.token) {
            document.cookie = `mock-session-id=${result.data.session.token}; path=/; max-age=31536000`;
          }
          return result;
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signUp: async ({ email, password, options }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signUp",
              payload: {
                email,
                password,
                metadata: options?.data,
              },
            }),
          });
          const result = await res.json();
          if (result?.data?.session?.token) {
            document.cookie = `mock-session-id=${result.data.session.token}; path=/; max-age=31536000`;
          }
          return result;
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signInWithOAuth: async ({ provider, options }: any) => {
        let destination = "/dashboard";
        if (options?.redirectTo) {
          try {
            const urlObj = new URL(options.redirectTo);
            const redirectParam = urlObj.searchParams.get("redirect");
            if (redirectParam) destination = redirectParam;
          } catch {}
        }
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signInWithPassword",
              payload: {
                email: "google_user@vaylo.ai",
                password: "password123",
              },
            }),
          });
          const result = await res.json();
          if (result?.data?.session?.token) {
            document.cookie = `mock-session-id=${result.data.session.token}; path=/; max-age=31536000`;
          }
          window.location.href = destination;
        } catch (e) {
          window.location.href = destination;
        }
        return { data: null, error: null };
      },
      signInWithOtp: async ({ phone }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signInWithOtp",
              payload: { phone },
            }),
          });
          return await res.json();
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      verifyOtp: async ({ phone, token }: any) => {
        try {
          const res = await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "verifyOtp",
              payload: { phone, token },
            }),
          });
          const result = await res.json();
          if (result?.data?.session?.token) {
            document.cookie = `mock-session-id=${result.data.session.token}; path=/; max-age=31536000`;
          }
          return result;
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signOut: async () => {
        const token = typeof document !== "undefined"
          ? document.cookie
              .split("; ")
              .find((row) => row.startsWith("mock-session-id="))
              ?.split("=")[1]
          : null;

        try {
          await fetch("/api/mock-db", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "signOut",
              payload: { token },
            }),
          });
        } catch {}

        if (typeof document !== "undefined") {
          document.cookie = "mock-session-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        window.location.href = "/login";
        return { error: null };
      },
    },
    from: (table: string) => {
      return new MockQueryBuilder(table);
    },
    storage: {
      from: (bucket: string) => {
        return {
          upload: async (filePath: string, buffer: any, options: any) => {
            return { data: { path: filePath }, error: null };
          }
        };
      }
    }
  };
}
