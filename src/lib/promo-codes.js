function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parsePromoCodesInput(input) {
  if (!input) return null;

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return isPlainObject(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  if (isPlainObject(input)) {
    return input;
  }

  return null;
}

function normalizePromoCodeValue(value) {
  if (typeof value !== "string") return null;
  const normalizedValue = value.trim();
  return normalizedValue || null;
}

function resolveFromConfig(goalCount, config) {
  if (!isPlainObject(config)) return null;

  const promoCode = config[String(goalCount)] ?? config.default;
  return normalizePromoCodeValue(promoCode);
}

export function resolvePromoCodeForGoals(goalCount, ...configs) {
  for (const config of configs) {
    const promoCode = resolveFromConfig(goalCount, config);
    if (promoCode) return promoCode;
  }

  return null;
}
