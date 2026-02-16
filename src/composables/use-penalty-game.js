import { computed, ref } from "vue";

export function usePenaltyGame(options = {}) {
  const totalShots = options.totalShots ?? 3;
  const canInteract = options.canInteract ?? (() => true);
  const onRoundResolved = options.onRoundResolved ?? (() => {});
  const onFinished = options.onFinished ?? (() => {});

  const gameState = ref("ready");
  const shotsRemaining = ref(totalShots);
  const goals = ref(0);
  const showGoal = ref(false);
  const showMiss = ref(false);
  const keeperPosition = ref(null);
  const ballPosition = ref({ x: 50, y: 85 });

  const positions = ["left", "center", "right"];
  const timers = [];

  const keeperStyle = computed(() => {
    if (keeperPosition.value === "left") {
      return { left: "50%", transform: "translateX(-170%)" };
    }

    if (keeperPosition.value === "right") {
      return { left: "50%", transform: "translateX(70%)" };
    }

    return { left: "50%", transform: "translateX(-50%)" };
  });

  const ballStyle = computed(() => ({
    left: `${ballPosition.value.x}%`,
    top: `${ballPosition.value.y}%`,
  }));

  function queueTimeout(cb, delay) {
    const id = window.setTimeout(cb, delay);
    timers.push(id);
  }

  function clearTimers() {
    while (timers.length) {
      window.clearTimeout(timers.pop());
    }
  }

  function resetBall() {
    ballPosition.value = { x: 50, y: 85 };
    keeperPosition.value = null;
  }

  function resetGame() {
    clearTimers();
    gameState.value = "ready";
    shotsRemaining.value = totalShots;
    goals.value = 0;
    showGoal.value = false;
    showMiss.value = false;
    resetBall();
  }

  function startGame() {
    if (!canInteract()) return;
    if (shotsRemaining.value <= 0) return;

    gameState.value = "aiming";
    resetBall();
  }

  function shoot(position) {
    if (!canInteract()) return;
    if (gameState.value !== "aiming") return;

    gameState.value = "shooting";
    const randomKeeper = positions[Math.floor(Math.random() * positions.length)];
    keeperPosition.value = randomKeeper;

    const targetX = position === "left" ? 25 : position === "right" ? 75 : 50;
    ballPosition.value = { x: targetX, y: 25 };

    queueTimeout(() => {
      const isGoal = position !== randomKeeper;
      const nextShots = shotsRemaining.value - 1;
      const nextGoals = isGoal ? goals.value + 1 : goals.value;

      shotsRemaining.value = nextShots;
      goals.value = nextGoals;
      gameState.value = "result";

      if (isGoal) {
        showGoal.value = true;
        queueTimeout(() => {
          showGoal.value = false;
        }, 2000);
      } else {
        showMiss.value = true;
        queueTimeout(() => {
          showMiss.value = false;
        }, 1500);
      }

      onRoundResolved({
        position,
        keeperPosition: randomKeeper,
        isGoal,
        goals: nextGoals,
        shotsRemaining: nextShots,
      });

      if (nextShots === 0) {
        onFinished({ goals: nextGoals });
      }

      queueTimeout(() => {
        gameState.value = "ready";
        resetBall();
      }, 2500);
    }, 800);
  }

  function onKeyDown(e) {
    if (!canInteract()) return;

    if (gameState.value === "aiming") {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") shoot("left");
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") shoot("right");
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.key === " ") {
        e.preventDefault();
        shoot("center");
      }
    }

    if (
      gameState.value === "ready" &&
      shotsRemaining.value > 0 &&
      e.key === " "
    ) {
      e.preventDefault();
      startGame();
    }
  }

  return {
    gameState,
    shotsRemaining,
    goals,
    showGoal,
    showMiss,
    keeperPosition,
    ballPosition,
    keeperStyle,
    ballStyle,
    positions,
    startGame,
    shoot,
    onKeyDown,
    resetGame,
    resetBall,
    clearTimers,
  };
}
