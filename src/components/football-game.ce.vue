<template>
  <section class="w-full text-white">
    <div class="relative flex w-full flex-col items-center justify-center">
      <div
        class="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden border border-white/20 bg-slate-900/45 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-sm"
      >
        <div
          v-if="isPromoModeEnabled && hasPlayedBefore"
          class="result-overlay absolute inset-x-3 bottom-3 z-40 border border-white/35 bg-slate-950/70 p-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-sm md:inset-x-4 md:bottom-4 md:p-4"
        >
          <div
            class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
          ></div>

          <div
            class="mx-auto flex w-full max-w-sm items-center justify-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5"
          >
            <span
              class="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70"
              >{{ text.final_score_label }}</span
            >
            <span
              class="text-lg font-extrabold leading-none text-sky-300 tabular-nums md:text-xl"
              >{{ goals }}<span class="text-white/60">/3</span></span
            >
          </div>

          <p class="mt-2 text-sm text-white/90 md:text-base">
            {{ text.won_promo_label }}:
            <span
              class="ml-1 inline-flex min-h-7 items-center border border-sky-200/30 bg-sky-300/10 px-2 py-0.5 font-bold tracking-[0.08em] text-sky-100"
              >{{ promoCodeLabel }}</span
            >
          </p>

          <button
            v-if="awardedPromoCode"
            type="button"
            class="mx-auto mt-3 inline-flex min-h-11 items-center gap-2 border border-white/20 bg-white px-4 py-1.5 text-sm font-semibold text-slate-950 shadow-[0_8px_20px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 md:px-5 md:py-2"
            :aria-label="`${text.copy_promo_cta}: ${awardedPromoCode}`"
            @click="copyPromoCode"
          >
            <svg
              v-if="!promoCodeCopied"
              viewBox="0 0 24 24"
              class="h-4 w-4 md:h-5 md:w-5"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 16h-9V7h9z"
              />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              class="h-4 w-4 md:h-5 md:w-5"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M9 16.2l-3.5-3.6L4 14.1l5 4.9L20 8l-1.5-1.5z"
              />
            </svg>
            {{ promoCodeCopied ? text.copied_promo_cta : text.copy_promo_cta }}
          </button>

          <p class="sr-only" aria-live="polite">
            {{ promoCodeCopied ? text.copied_promo_cta : "" }}
          </p>
        </div>

        <div
          class="absolute inset-x-[10%] top-[10%] z-[1] h-[50%] rounded-t-lg border-[6px] border-white shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_16px_40px_rgba(0,0,0,0.55)]"
        >
          <div class="absolute inset-0 opacity-30">
            <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="goal-net"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 20 M 10 -10 L -10 10 M 30 10 L 10 30"
                    stroke="white"
                    stroke-width="1"
                    fill="none"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#goal-net)" />
            </svg>
          </div>
          <div
            class="absolute -left-1 top-0 h-full w-2 rounded-l bg-white/20"
          ></div>
          <div
            class="absolute -right-1 top-0 h-full w-2 rounded-r bg-white/20"
          ></div>
          <div
            class="absolute -top-1 left-0 h-2 w-full rounded-t bg-white/20"
          ></div>
        </div>

        <div
          class="absolute top-[35%] z-10 flex h-20 w-16 items-center justify-center transition-all duration-300 ease-out"
          :style="keeperStyle"
        >
          <div class="relative">
            <div class="relative h-14 w-10 rounded-t-full bg-sky-500">
              <div
                class="absolute -top-4 left-2 h-6 w-6 rounded-full bg-amber-200"
              ></div>
              <div
                class="absolute -left-4 top-2 h-10 w-4 origin-top-right rounded-full bg-sky-500"
                :class="{ '-rotate-45': keeperPosition }"
              ></div>
              <div
                class="absolute -right-4 top-2 h-10 w-4 origin-top-left rounded-full bg-sky-500"
                :class="{ 'rotate-45': keeperPosition }"
              ></div>
              <div
                class="absolute -left-5 top-0 h-3 w-3 rounded-full bg-white"
              ></div>
              <div
                class="absolute -right-5 top-0 h-3 w-3 rounded-full bg-white"
              ></div>
            </div>
          </div>
        </div>

        <div
          class="absolute z-20 size-18 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out md:size-20"
          :style="ballStyle"
        >
          <img
            :src="sportBall"
            alt="Soccer ball"
            class="size-full object-contain drop-shadow-lg"
            draggable="false"
          />
        </div>

        <div
          class="absolute bottom-0 left-0 right-0 h-[35%]"
          style="background: linear-gradient(to top, #15803d 0%, #16a34a 100%)"
        >
          <div
            class="absolute left-[15%] right-[15%] top-[20%] h-px bg-white/40"
          ></div>
        </div>

        <div
          v-if="gameState === 'aiming'"
          class="absolute inset-x-[10%] top-[10%] z-20 flex h-[50%]"
        >
          <button
            v-for="pos in positions"
            :key="pos"
            type="button"
            class="group flex flex-1 cursor-crosshair items-center justify-center border-r border-white/20 transition-colors hover:bg-white/10 last:border-r-0"
            @click="shoot(pos)"
          >
            <span
              class="h-8 w-8 rounded-full border-2 border-white/30 transition-all group-hover:scale-110 group-hover:border-white/60 group-hover:bg-white/10"
            ></span>
          </button>
        </div>
      </div>

      <div
        v-if="showGoal"
        class="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      >
        <p
          class="animate-pulse text-5xl font-bold tracking-wider text-sky-200 drop-shadow-2xl md:text-8xl"
        >
          {{ text.goal_text }}
        </p>
      </div>

      <div
        v-if="showMiss"
        class="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      >
        <p class="text-4xl font-bold text-white/90 drop-shadow-xl md:text-6xl">
          {{ text.miss_text }}
        </p>
      </div>

      <div class="mt-8 text-center">
        <template v-if="!hasPlayedBefore">
          <div class="mb-6 flex items-center justify-center gap-8">
            <div class="text-white/80">
              <span class="text-sm uppercase tracking-wider">{{
                text.shots_label
              }}</span>
              <div class="text-3xl font-bold text-white">
                {{ shotsRemaining }}
              </div>
            </div>
            <div class="h-12 w-px bg-white/20"></div>
            <div class="text-white/80">
              <span class="text-sm uppercase tracking-wider">{{
                text.goals_label
              }}</span>
              <div class="text-3xl font-bold text-sky-300">{{ goals }}</div>
            </div>
          </div>

          <div
            v-if="shotsRemaining > 0"
            class="relative mx-auto flex min-h-12 w-full max-w-md items-center justify-center"
          >
            <button
              type="button"
              class="absolute bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-white/90"
              :class="
                gameState === 'ready'
                  ? 'visible opacity-100'
                  : 'invisible pointer-events-none opacity-0'
              "
              @click="startGame"
            >
              {{ text.shoot_cta }}
            </button>

            <p
              class="absolute text-sm text-white/75 transition"
              :class="
                gameState === 'aiming'
                  ? 'visible opacity-100'
                  : 'invisible pointer-events-none opacity-0'
              "
            >
              {{ text.aim_hint }}
            </p>
          </div>

          <div
            v-if="gameState === 'ready' && shotsRemaining === 0"
            class="space-y-3"
          >
            <p class="text-sm text-white/80">
              {{ text.final_score_label }}:
              <span class="font-bold text-sky-300">{{ goals }}/3</span>
            </p>
            <button
              type="button"
              class="bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-white/90"
              @click="restartGame"
            >
              {{ text.play_again_cta || "Play Again" }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import sportBall from "@/assets/sportball-optimized.png";
import localCopy from "@/content/football-game.copy.json";
import { usePenaltyGame } from "@/composables/use-penalty-game";
import {
  getGoalsCookieName,
  getPlayedCookieName,
  readCookie,
  resolvePromoCodeFromQuery,
  writeCookie,
} from "@/lib/promo-storage";

const props = defineProps({
  lang: {
    type: String,
    default: "",
  },
  locale: {
    type: String,
    default: "",
  },
  copy: {
    type: [Object, String],
    default: null,
  },
  promoMode: {
    type: String,
    default: "none",
  },
  promoCookieName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "game-start",
  "game-shot",
  "game-finish",
  "promo-copy",
]);

const hasPlayedBefore = ref(false);
const awardedPromoCode = ref("");
const promoCodeCopied = ref(false);

const normalizedPromoMode = computed(() => {
  return props.promoMode === "cookie" ? "cookie" : "none";
});

const isPromoModeEnabled = computed(() => normalizedPromoMode.value === "cookie");

const cookieName = computed(() => {
  if (!isPromoModeEnabled.value) return null;

  const normalizedName = (props.promoCookieName || "").trim();
  if (normalizedName) return normalizedName;

  const defaultCookieName =
    typeof text.value.promo_cookie_name === "string"
      ? text.value.promo_cookie_name.trim()
      : "";

  return defaultCookieName || null;
});

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

const {
  gameState,
  shotsRemaining,
  goals,
  showGoal,
  showMiss,
  keeperPosition,
  keeperStyle,
  ballStyle,
  positions,
  startGame: startPenaltyGame,
  shoot,
  onKeyDown,
  resetGame,
  clearTimers,
} = usePenaltyGame({
  canInteract: () => !hasPlayedBefore.value,
  onRoundResolved: (payload) => {
    emit("game-shot", payload);
  },
  onFinished: ({ goals: finalGoals }) => {
    finishGame(finalGoals);
  },
});

const promoCodeLabel = computed(() => {
  return awardedPromoCode.value || text.value.no_promo_code_text;
});

function startGame() {
  if (hasPlayedBefore.value) return;
  if (gameState.value !== "ready") return;
  if (shotsRemaining.value <= 0) return;

  startPenaltyGame();
  emit("game-start", {
    shotsRemaining: shotsRemaining.value,
  });
}

function resolveCookieName() {
  return cookieName.value;
}

function storePromoCodeCookie(promoCode) {
  const cookieName = resolveCookieName();
  if (!cookieName) return;
  if (!promoCode) return;

  writeCookie(cookieName, promoCode);
}

function resolveResultPromoCode(goalCount) {
  if (!isPromoModeEnabled.value) return null;

  const configuredPromoCodes = text.value.result_promo_codes;

  if (
    !configuredPromoCodes ||
    typeof configuredPromoCodes !== "object" ||
    Array.isArray(configuredPromoCodes)
  ) {
    return null;
  }

  const promoCode =
    configuredPromoCodes[String(goalCount)] ?? configuredPromoCodes.default;

  if (typeof promoCode !== "string") return null;
  const normalizedPromoCode = promoCode.trim();
  return normalizedPromoCode || null;
}

function storeInitialPromoCodeCookie() {
  if (!isPromoModeEnabled.value) return;

  const promoCode = resolvePromoCodeFromQuery();
  if (!promoCode) return;
  storePromoCodeCookie(promoCode);
}

function storeResultPromoCodeCookie(goalCount) {
  if (!isPromoModeEnabled.value) return;

  const cookieName = resolveCookieName();
  if (!cookieName) return;

  const playedCookieName = getPlayedCookieName(cookieName);
  const goalsCookieName = getGoalsCookieName(cookieName);
  if (!playedCookieName || !goalsCookieName) return;

  const promoCode = resolveResultPromoCode(goalCount) || "";
  writeCookie(cookieName, promoCode);
  writeCookie(playedCookieName, "1");
  writeCookie(goalsCookieName, String(goalCount));
}

function finishGame(goalCount) {
  awardedPromoCode.value = isPromoModeEnabled.value
    ? resolveResultPromoCode(goalCount) || ""
    : "";
  hasPlayedBefore.value = isPromoModeEnabled.value;
  promoCodeCopied.value = false;
  storeResultPromoCodeCookie(goalCount);
  emit("game-finish", {
    goals: goalCount,
    promoCode: awardedPromoCode.value,
  });
}

async function copyPromoCode() {
  if (!awardedPromoCode.value) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(awardedPromoCode.value);
    } else {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = awardedPromoCode.value;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "absolute";
      temporaryInput.style.left = "-9999px";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      document.execCommand("copy");
      document.body.removeChild(temporaryInput);
    }

    promoCodeCopied.value = true;
    emit("promo-copy", {
      promoCode: awardedPromoCode.value,
      copied: true,
    });
    window.setTimeout(() => {
      promoCodeCopied.value = false;
    }, 1800);
  } catch {
    promoCodeCopied.value = false;
    emit("promo-copy", {
      promoCode: awardedPromoCode.value,
      copied: false,
    });
  }
}

function hydratePlayedState() {
  if (!isPromoModeEnabled.value) return;

  const cookieName = resolveCookieName();
  const playedCookieName = getPlayedCookieName(cookieName);
  const goalsCookieName = getGoalsCookieName(cookieName);

  if (!cookieName || !playedCookieName || !goalsCookieName) return;

  const hasPlayedCookie = readCookie(playedCookieName) === "1";
  if (!hasPlayedCookie) return;

  hasPlayedBefore.value = true;
  shotsRemaining.value = 0;
  gameState.value = "ready";

  const goalsFromCookie = Number.parseInt(
    readCookie(goalsCookieName) || "",
    10,
  );
  if (
    Number.isInteger(goalsFromCookie) &&
    goalsFromCookie >= 0 &&
    goalsFromCookie <= 3
  ) {
    goals.value = goalsFromCookie;
  }

  awardedPromoCode.value = (readCookie(cookieName) || "").trim();
}

function restartGame() {
  awardedPromoCode.value = "";
  promoCodeCopied.value = false;
  resetGame();
}

onMounted(() => {
  hydratePlayedState();

  if (!hasPlayedBefore.value) {
    storeInitialPromoCodeCookie();
  }

  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  clearTimers();
});
</script>

<style>
@import "tailwindcss" source(none);
@source "./football-game.ce.vue";

.result-overlay {
  animation: result-slide-up 280ms ease-out;
}

@keyframes result-slide-up {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .result-overlay {
    animation: none;
  }
}
</style>
