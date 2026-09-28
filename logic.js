const game = document.querySelector("#game");
const targetElement = document.querySelector("#target");
const clockElement = document.querySelector("#clock");
const actionButton = document.querySelector("#action");
const hintElement = document.querySelector("#hint");
const resultElement = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultDetail = document.querySelector("#result-detail");

let target = 5;
let startedAt = 0;
let animationFrame = 0;
let isRunning = false;
let needsNewTarget = false;

function formatTime(milliseconds) {
  return (milliseconds / 1000).toFixed(2);
}

function newTarget() {
  target = Number((5 + Math.random() * 5).toFixed(2));
  targetElement.textContent = target.toFixed(2);
}

function updateClock() {
  if (!isRunning) return;
  clockElement.textContent = formatTime(performance.now() - startedAt);
  animationFrame = requestAnimationFrame(updateClock);
}

function startRound() {
  if (needsNewTarget) {
    newTarget();
    needsNewTarget = false;
  }

  resultElement.hidden = true;
  clockElement.textContent = "0.00";
  clockElement.classList.add("is-running");
  clockElement.hidden = true;
  actionButton.hidden = false;
  actionButton.textContent = "Detener";
  hintElement.textContent = "Pulsa en cualquier parte para detener el tiempo.";
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
  const difference = Math.abs(elapsed / 1000 - target);
  clockElement.textContent = formatTime(elapsed);
  clockElement.hidden = false;
  clockElement.classList.remove("is-running");
  actionButton.hidden = false;
  actionButton.textContent = "Otra ronda";
  game.classList.remove("is-running");

  let grade;
  if (difference <= 0.1) {
    grade = "good";
    resultTitle.textContent = "¡Perfecto!";
    hintElement.textContent = "¡Le diste en el momento justo!";
  } else if (difference <= 0.5) {
    grade = "okay";
    resultTitle.textContent = "¡Que rico, casi la clavas!";
    hintElement.textContent = "Vas bien, pero puedes acercarte más.";
  } else {
    grade = "bad";
    resultTitle.textContent = "No lo lograste D:";
    hintElement.textContent = "No te rindas, prueba otra vez.";
  }

  resultElement.dataset.grade = grade;
  resultDetail.textContent = `Diferencia: ${difference.toFixed(2)} s`;
  resultElement.hidden = false;
  needsNewTarget = true;
}

game.addEventListener("click", (event) => {
  if (event.target.closest("#action")) {
    if (isRunning) {
      stopRound();
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