const game = document.querySelector("#game");
const targetElement = document.querySelector("#target");
const clockElement = document.querySelector("#clock");
const actionButton = document.querySelector("#action");
const hintElement = document.querySelector("#hint");
const resultElement = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultTarget = document.querySelector("#result-target");
const resultTime = document.querySelector("#result-time");
const resultDifference = document.querySelector("#result-difference");
const resultScore = document.querySelector("#result-score");
const summaryElement = document.querySelector("#summary");
const totalScoreElement = document.querySelector("#total-score");
const bestRoundElement = document.querySelector("#best-round");
const worstRoundElement = document.querySelector("#worst-round");
const averageDifferenceElement = document.querySelector("#average-difference");

const targets = [1, 2, 3.5, 5, 7.5];
let roundIndex = 0;
let startedAt = 0;
let animationFrame = 0;
let isRunning = false;
let roundResults = [];

function formatTime(milliseconds) {
  return (milliseconds / 1000).toFixed(3);
}

function setTarget() {
  targetElement.textContent = targets[roundIndex].toFixed(3);
}

function updateClock() {
  if (!isRunning) return;
  clockElement.textContent = formatTime(performance.now() - startedAt);
  animationFrame = requestAnimationFrame(updateClock);
}

function startRound() {
  resultElement.hidden = true;
  summaryElement.hidden = true;
  clockElement.textContent = "0.000";
  clockElement.classList.add("is-running");
  clockElement.hidden = true;
  actionButton.hidden = false;
  actionButton.textContent = "Detener";
  hintElement.textContent = "Pulsa en cualquier parte para detener el tiempo.";
  targetElement.textContent = targets[roundIndex].toFixed(3);
  game.classList.add("is-running");
  startedAt = performance.now();
  isRunning = true;
  animationFrame = requestAnimationFrame(updateClock);
  game.focus();
}

function stopRound() {
  isRunning = false;
  cancelAnimationFrame(animationFrame);
  const elapsed = performance.now() - startedAt;
  const target = targets[roundIndex];
  const elapsedSeconds = elapsed / 1000;
  const difference = Math.abs(elapsedSeconds - target);
  const score = Math.max(0, Math.round(1000 - difference * 1000));
  const round = roundIndex + 1;
  let grade;
  let feedback;

  if (difference <= 0.1) {
    grade = "good";
    feedback = "¡Perfecto!";
    hintElement.textContent = "¡Le diste en el momento justo!";
  } else if (difference <= 0.5) {
    grade = "okay";
    feedback = "¡Casi la clavas!";
    hintElement.textContent = "Vas bien, pero puedes acercarte más.";
  } else {
    grade = "bad";
    feedback = "No lo lograste D:";
    hintElement.textContent = "No te rindas, prueba otra vez.";
  }

  clockElement.textContent = formatTime(elapsed);
  clockElement.hidden = false;
  clockElement.classList.remove("is-running");
  actionButton.hidden = false;
  game.classList.remove("is-running");
  resultElement.dataset.grade = grade;
  resultTitle.textContent = `Ronda ${round} de ${targets.length}: ${feedback}`;
  resultTarget.textContent = `${target.toFixed(3)} s`;
  resultTime.textContent = `${elapsedSeconds.toFixed(3)} s`;
  resultDifference.textContent = `${difference.toFixed(3)} s`;
  resultScore.textContent = `${score} puntos`;
  roundResults.push({ round, difference, score });
  resultElement.hidden = false;

  if (roundResults.length === targets.length) {
    showSummary();
    actionButton.textContent = "Jugar otra vez";
    hintElement.textContent = "¡Partida completada!";
  } else {
    actionButton.textContent = "Siguiente ronda";
  }
}

function showSummary() {
  const bestRound = roundResults.reduce((best, current) =>
    current.score > best.score ? current : best
  );
  const worstRound = roundResults.reduce((worst, current) =>
    current.score < worst.score ? current : worst
  );
  const totalScore = roundResults.reduce((total, result) => total + result.score, 0);
  const averageDifference = roundResults.reduce(
    (total, result) => total + result.difference,
    0
  ) / roundResults.length;

  totalScoreElement.textContent = `${totalScore} puntos`;
  bestRoundElement.textContent = `Ronda ${bestRound.round} · ${bestRound.score} puntos`;
  worstRoundElement.textContent = `Ronda ${worstRound.round} · ${worstRound.score} puntos`;
  averageDifferenceElement.textContent = `${averageDifference.toFixed(3)} s`;
  summaryElement.hidden = false;
}

function resetGame() {
  roundIndex = 0;
  roundResults = [];
  setTarget();
  resultElement.hidden = true;
  summaryElement.hidden = true;
  clockElement.textContent = "0.000";
  clockElement.hidden = false;
  actionButton.textContent = "Iniciar";
  hintElement.textContent = "¿La puedes clavar?";
}

game.addEventListener("click", (event) => {
  if (event.target.closest("#action")) {
    if (isRunning) {
      stopRound();
    } else if (roundResults.length === targets.length) {
      resetGame();
      startRound();
    } else if (roundResults.length > 0) {
      roundIndex = roundResults.length;
      setTarget();
      startRound();
    } else {
      startRound();
    }
  } else if (isRunning) {
    stopRound();
  }
});

document.addEventListener("keydown", (event) => {
  if (isRunning && (event.code === "Space" || event.code === "Enter")) {
    event.preventDefault();
    stopRound();
  }
});