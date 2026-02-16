const DEFAULT_MAX_AGE = 60 * 60 * 24 * 30;

export function resolvePromoCodeFromQuery(search = window.location.search) {
  const params = new URLSearchParams(search);
  const promoCode = params.get("promocode") || params.get("promo_code");

  if (!promoCode) return null;

  const normalizedPromoCode = promoCode.trim();
  return normalizedPromoCode || null;
}

export function getPlayedCookieName(cookieName) {
  return cookieName ? `${cookieName}_played` : null;
}

export function getGoalsCookieName(cookieName) {
  return cookieName ? `${cookieName}_goals` : null;
}

export function writeCookie(cookieName, cookieValue, maxAge = DEFAULT_MAX_AGE) {
  document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function readCookie(cookieName) {
  const encodedName = `${encodeURIComponent(cookieName)}=`;
  const allCookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookieEntry of allCookies) {
    if (!cookieEntry.startsWith(encodedName)) continue;

    const rawValue = cookieEntry.slice(encodedName.length);

    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
}
