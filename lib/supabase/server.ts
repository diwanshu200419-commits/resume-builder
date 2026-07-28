import type { Plan } from "@/types";

class MockServerQueryBuilder {
  private table: string;
  private method: string = "select";
  private filters: { col: string; val: any; op?: string }[] = [];
  private data: any = null;
  private isSingle: boolean = false;
  private url: string;

  constructor(table: string, url: string) {
    this.table = table;
    this.url = url;
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
    try {
      const response = await fetch(this.url, {
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
    } catch (e: any) {
      return { data: null, error: e };
    }
  }
}

export function createServerClient(url: string, key: string, options: any) {
  const origin = url || "http://localhost:3000";
  const mockDbUrl = `${origin}/api/mock-db`;

  return {
    auth: {
      getUser: async () => {
        const cookiesList = typeof options?.cookies?.getAll === "function" ? options.cookies.getAll() : [];
        const tokenCookie = cookiesList.find((c: any) => c.name === "mock-session-id");
        const token = tokenCookie ? tokenCookie.value : null;

        if (!token) return { data: { user: null }, error: null };

        try {
          const res = await fetch(mockDbUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "auth",
              method: "getUser",
              payload: { token },
            }),
          });
          return await res.json();
        } catch (e: any) {
          return { data: { user: null }, error: e };
        }
      },
      exchangeCodeForSession: async (code: string) => {
        return { data: {}, error: null };
      },
    },
    from: (table: string) => {
      return new MockServerQueryBuilder(table, mockDbUrl);
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

export async function createClient() {
  const { cookies } = require("next/headers");
  const cookieStore = cookies();

  return createServerClient("", "", {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: any[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

export async function createServiceClient() {
  return createServerClient("", "", {});
}
