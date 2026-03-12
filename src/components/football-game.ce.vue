<template>
  <section class="game-ui-font w-full text-white">
    <div class="relative flex w-full flex-col items-center justify-center">
      <div
        class="relative aspect-[16/8.2] md:aspect-[16/7.4] w-full border border-white/20 bg-slate-900/45 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-sm"
        :class="isPromoResultVisible
            ? 'z-50 overflow-visible md:z-auto md:overflow-hidden'
            : 'overflow-hidden'
          "
      >
        <div
          v-if="isPromoResultVisible"
          class="result-overlay absolute inset-x-0 top-0 bottom-[-5.75rem] z-40 bg-slate-950/28 p-2 backdrop-blur-sm md:inset-0 md:p-3"
        >
          <div
            class="grid h-full w-full place-items-start overflow-y-auto border border-white/35 bg-[linear-gradient(155deg,rgba(255,255,255,0.96)_0%,rgba(241,245,249,0.93)_100%)] px-4 py-4 text-center text-slate-900 shadow-[0_20px_50px_rgba(2,6,23,0.35)] md:place-items-center md:px-8 md:py-6"
          >
            <div class="w-full max-w-3xl">
              <div class="mx-auto max-w-xl border border-slate-300/80 bg-white/70 px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:px-6">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {{
                    text.promocode_label ||
                    text.promo_code_label ||
                    "Promocode"
                  }}
                </p>
                <p
                  class="mt-2 break-all text-xl font-medium tracking-[0.18em] text-slate-900 md:text-3xl md:tracking-[0.22em]">
                  {{ awardedPromoCode || promoCodeLabel }}
                </p>
              </div>

              <button
                v-if="awardedPromoCode"
                type="button"
                class="mx-auto mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-5 py-2 text-sm font-semibold shadow-[0_10px_26px_rgba(10,26,44,0.22)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:mt-8"
                :class="promoCodeCopied
                    ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500'
                    : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900'
                  "
                :aria-label="`${text.copy_promo_cta}: ${awardedPromoCode}`"
                @click="copyPromoCode"
              >
                <svg v-if="!promoCodeCopied" viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor"
                    d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 16h-9V7h9z" />
                </svg>
                <svg v-else viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M9 16.2l-3.5-3.6L4 14.1l5 4.9L20 8l-1.5-1.5z" />
                </svg>
                {{
                  promoCodeCopied ? text.copied_promo_cta : text.copy_promo_cta
                }}
              </button>

              <p class="sr-only" aria-live="polite">
                {{ promoCodeCopied ? text.copied_promo_cta : "" }}
              </p>
            </div>
          </div>
        </div>

        <div class="absolute inset-x-[8%] top-[11%] z-[1] h-[44%] md:inset-x-[9%] md:top-[12%] md:h-[46%]">
          <img :src="goalAsset" alt="" aria-hidden="true"
            class="h-full w-full object-fill opacity-95 drop-shadow-[0_10px_35px_rgba(0,0,0,0.45)]" draggable="false" />
        </div>

        <div
          class="absolute top-[33%] z-10 flex h-24 w-20 items-center justify-center transition-all duration-300 ease-out md:top-[34%] md:h-28 md:w-24"
          :style="keeperStyle">
          <img :src="keeperSpriteAsset" alt="Goalkeeper" :class="keeperSpriteClass" draggable="false" />
        </div>

        <div
          class="absolute z-20 size-12 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out md:size-14"
          :style="ballStyle">
          <img :src="ballAsset" alt="Soccer ball" class="size-full object-contain drop-shadow-lg" draggable="false" />
        </div>

        <div class="absolute bottom-0 left-0 right-0 h-[35%]"
          style="background: linear-gradient(to top, #15803d 0%, #16a34a 100%)">
          <div class="absolute left-[15%] right-[15%] top-[20%] h-px bg-white/40"></div>
        </div>

        <div v-if="gameState === 'aiming'" class="absolute inset-x-[10%] top-[11%] z-20 flex h-[44%] md:top-[12%] md:h-[46%]">
          <button v-for="pos in positions" :key="pos" type="button"
            class="group flex flex-1 cursor-crosshair items-center justify-center border-r border-white/20 transition-colors hover:bg-white/10 last:border-r-0"
            @click="shoot(pos)">
            <span
              class="h-8 w-8 rounded-full border-2 border-white/30 transition-all group-hover:scale-110 group-hover:border-white/60 group-hover:bg-white/10"></span>
          </button>
        </div>
      </div>

      <div v-if="showGoal" class="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <p class="animate-pulse text-5xl font-bold tracking-wider text-sky-200 drop-shadow-2xl md:text-8xl">
          {{ text.goal_text }}
        </p>
      </div>

      <div v-if="showMiss" class="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <p class="text-4xl font-bold text-white/90 drop-shadow-xl md:text-6xl">
          {{ text.miss_text }}
        </p>
      </div>

      <div class="mt-4 w-full max-w-5xl md:mt-5">
        <div
          class="grid grid-cols-[1fr_44px_44px_1fr] items-center gap-[3px] md:grid-cols-[1fr_62px_62px_1fr] md:gap-1">
          <div
            class="relative flex h-[60px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#59606a_0%,#444b55_38%,#323842_72%,#262c35_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.32)] md:h-[70px]">
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_34%,rgba(255,255,255,0)_100%)]">
            </div>
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.12)_100%)]">
            </div>
            <div class="relative -translate-y-[3px] text-center md:-translate-y-1">
              <p
                class="m-0 text-xs leading-none font-bold uppercase tracking-[0.16em] text-[#dadce0] md:text-base md:tracking-[0.2em]">
                {{ text.shots_label }}
              </p>
            </div>
          </div>

            <div
              class="relative flex h-[60px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#59606a_0%,#444b55_38%,#323842_72%,#262c35_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.32)] md:h-[72px]">
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_34%,rgba(255,255,255,0)_100%)]">
            </div>
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.12)_100%)]">
            </div>
            <p class="relative z-10 m-0 text-[38px] leading-[0.92] font-black text-[#f6f7f9] md:text-[50px]">
              {{ shotsRemaining }}
            </p>
          </div>
          <div
            class="relative flex h-[60px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#59606a_0%,#444b55_38%,#323842_72%,#262c35_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.32)] md:h-[72px]">
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_34%,rgba(255,255,255,0)_100%)]">
            </div>
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.12)_100%)]">
            </div>
            <p class="relative z-10 m-0 text-[38px] leading-[0.92] font-black text-[#74cbff] md:text-[50px]">
              {{ goals }}
            </p>
          </div>

          <div
            class="relative flex h-[60px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#59606a_0%,#444b55_38%,#323842_72%,#262c35_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.32)] md:h-[70px]">
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_34%,rgba(255,255,255,0)_100%)]">
            </div>
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.12)_100%)]">
            </div>
            <div class="relative -translate-y-[3px] text-center md:-translate-y-1">
              <p
                class="m-0 text-xs leading-none font-bold uppercase tracking-[0.16em] text-[#dadce0] md:text-base md:tracking-[0.2em]">
                {{ text.goals_label }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 text-center md:mt-6">
        <template v-if="!hasPlayedBefore">
          <div v-if="shotsRemaining > 0"
            class="relative mx-auto flex min-h-12 w-full max-w-md items-center justify-center">
            <button type="button"
              class="absolute inline-flex min-w-52 items-center justify-center whitespace-nowrap rounded-sm border border-sky-200/40 bg-sky-100 px-7 py-2 text-lg font-black uppercase tracking-[0.08em] text-slate-900 shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white md:min-w-60 md:text-[1.15rem]"
              :class="gameState === 'ready'
                  ? 'visible opacity-100'
                  : 'invisible pointer-events-none opacity-0'
                " @click="startGame">
              {{ text.shoot_cta }}
            </button>

            <p class="absolute text-sm uppercase tracking-[0.08em] text-white/75 transition" :class="gameState === 'aiming'
                ? 'visible opacity-100'
                : 'invisible pointer-events-none opacity-0'
              ">
              {{ text.aim_hint }}
            </p>
          </div>

          <div v-if="gameState === 'ready' && shotsRemaining === 0" class="space-y-3">
            <p class="text-sm text-white/80">
              {{ text.final_score_label }}:
              <span class="font-bold text-sky-300">{{ goals }}/3</span>
            </p>
            <button type="button"
              class="bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-white/90"
              @click="restartGame">
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
import ballAsset from "@/assets/football-game/ball.svg";
import goalAsset from "@/assets/football-game/goal.svg";
import keeperDiveLeftAsset from "@/assets/football-game/keeper-dive-left.svg";
import keeperAsset from "@/assets/football-game/keeper.svg";
import keeperDiveRightAsset from "@/assets/football-game/keeper-dive-right.svg";
import localCopy from "@/content/football-game.copy.json";
import { usePenaltyGame } from "@/composables/use-penalty-game";
import {
  parsePromoCodesInput,
  resolvePromoCodeForGoals,
} from "@/lib/promo-codes";
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
  promoCodes: {
    type: [Object, String],
    default: null,
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

const isPromoModeEnabled = computed(
  () => normalizedPromoMode.value === "cookie",
);

const isPromoResultVisible = computed(() => {
  return (
    isPromoModeEnabled.value &&
    hasPlayedBefore.value &&
    !showGoal.value &&
    !showMiss.value
  );
});

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
const parsedPromoCodes = computed(() => parsePromoCodesInput(props.promoCodes));

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

const keeperSpriteAsset = computed(() => {
  if (keeperPosition.value === "left") {
    return keeperDiveLeftAsset;
  }

  if (keeperPosition.value === "right") {
    return keeperDiveRightAsset;
  }

  return keeperAsset;
});

const keeperSpriteClass = computed(() => {
  const baseClass = "object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]";

  if (keeperPosition.value === "left") {
    return `h-full w-auto ${baseClass}`;
  }

  if (keeperPosition.value === "right") {
    return `h-full w-auto ${baseClass}`;
  }

  return `h-full w-full ${baseClass}`;
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

  return resolvePromoCodeForGoals(
    goalCount,
    parsedPromoCodes.value,
    text.value.result_promo_codes,
  );
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

:host,
.game-ui-font {
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;
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
