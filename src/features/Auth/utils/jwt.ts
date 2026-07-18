type JwtPayload = {
  exp?: unknown;
  sub?: unknown;
};

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    if (typeof atob !== "function") {
      return null;
    }

    return atob(padded);
  } catch {
    return null;
  }
}

export function readJwtPayload(token: string): JwtPayload | null {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  const decoded = decodeBase64Url(payload);
  if (!decoded) {
    return null;
  }

  try {
    const parsed = JSON.parse(decoded) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as JwtPayload)
      : null;
  } catch {
    return null;
  }
}

export function readJwtExpiration(token: string): string | null {
  const payload = readJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp !== "number" || !Number.isFinite(exp)) {
    return null;
  }

  return new Date(exp * 1_000).toISOString();
}

export function readJwtSubject(token: string): string | null {
  const payload = readJwtPayload(token);
  return typeof payload?.sub === "string" ? payload.sub : null;
}

export function isSessionExpired(expiresAt: string | null): boolean {
  if (!expiresAt) {
    return false;
  }

  return new Date(expiresAt).getTime() <= Date.now();
}
