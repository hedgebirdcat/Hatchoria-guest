// Hatchoria Guest Edition - ログイン不要のゲスト起動
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const guestButton = document.getElementById("guestButton");
const message = document.getElementById("message");
let moving = false;

function goToGame() {
  if (moving) return;
  moving = true;
  message.style.color = "#00aa66";
  message.textContent = "準備できました。ゲームを開きます…";
  window.location.replace("home.html");
}

async function startGuest() {
  if (moving) return;
  guestButton.disabled = true;
  message.textContent = "ゲストデータを準備しています…";
  try {
    await setPersistence(auth, browserLocalPersistence);
    if (auth.currentUser) {
      goToGame();
      return;
    }
    await signInAnonymously(auth);
  } catch (error) {
    console.error("ゲスト起動に失敗しました", error);
    guestButton.disabled = false;
    message.style.color = "#cc3333";
    message.textContent = "起動できませんでした。もう一度お試しください。";
  }
}

guestButton.addEventListener("click", startGuest);
onAuthStateChanged(auth, (user) => {
  if (user) goToGame();
});
