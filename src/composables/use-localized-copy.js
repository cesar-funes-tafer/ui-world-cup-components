import { computed } from "vue";

function parseCopyOverride(copy) {
  if (!copy) return {};

  if (typeof copy === "string") {
    try {
      return JSON.parse(copy);
    } catch {
      return {};
    }
  }

  if (typeof copy === "object" && !Array.isArray(copy)) {
    return copy;
  }

  return {};
}

export function useLocalizedCopy(props, localCopy) {
  const normalizedLocale = computed(() => {
    const safeLocale = (props.lang || props.locale || "en").toLowerCase();
    return localCopy[safeLocale] ? safeLocale : "en";
  });

  const parsedCopyOverride = computed(() => parseCopyOverride(props.copy));

  const text = computed(() => {
    const base = localCopy[normalizedLocale.value] || localCopy.en;
    const overrideSource = parsedCopyOverride.value;
    const localeOverride =
      overrideSource[normalizedLocale.value] || overrideSource;

    if (
      !localeOverride ||
      typeof localeOverride !== "object" ||
      Array.isArray(localeOverride)
    ) {
      return base;
    }

    return {
      ...base,
      ...localeOverride,
    };
  });

  return {
    normalizedLocale,
    text,
  };
}
