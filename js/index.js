const playButton = document.getElementById('playButton');
const title = document.getElementById('title');
const video = document.getElementById('loadingVideo');
const dealerSumDisplay = document.getElementById('dealerSumDisplay');
const playerSumDisplay = document.getElementById('playerSumDisplay');
const gameInfo = document.getElementById('gameInfo');
const gameControls = document.getElementById('gameControls');
const hitButton = document.getElementById('hitButton');
const standButton = document.getElementById('standButton');
const resultDisplay = document.getElementById('resultDisplay');
const resultMessage = document.getElementById('resultMessage');
const resetButton = document.getElementById('resetButton');

// サウンドをロード
const drawSound = new Audio('img/doro.mp3');
const mainSound = new Audio('img/main.mp3');

// ループ設定
mainSound.loop = true;

let playerSUM = 0;
let dealerSUM = 0;
let deck = Array.from({ length: 54 }, (_, i) => i + 1);
let playerStand = false;
let dealerStand = false;
let playerTurn = true;

// カードを引く関数
function drawCard() {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0];
    let cardValue = card % 13 || 13;
    return cardValue === 1 ? 11 : Math.min(cardValue, 10);
}

// サウンドを再生する関数
function playDrawSound() {
    drawSound.currentTime = 0;
    drawSound.play();
}

// プレイボタンをクリックした時の処理
playButton.addEventListener('click', function () {
    playButton.style.display = 'none';
    title.style.display = 'none';
    video.style.display = 'block';
    mainSound.currentTime = 0;
    mainSound.play();
    video.play();
});

video.onended = function () {
    video.style.display = 'none';
    gameInfo.style.display = 'flex';
    gameControls.style.display = 'flex';
    dealerSUM = drawCard();
    playerSUM = drawCard();
    
    if (window.innerWidth <= 480) {
        dealerSumDisplay.style.position = 'static';
        playerSumDisplay.style.position = 'static';
        gameInfo.style.flexDirection = 'column';
        gameInfo.style.alignItems = 'center';
    }
    
    dealerSumDisplay.textContent = `ディーラー: ${dealerSUM}`;
    playerSumDisplay.textContent = `プレイヤー: ${playerSUM}`;
};

// プレイヤーのHIT処理
hitButton.addEventListener('click', function () {
    if (playerTurn && !playerStand) {
        playDrawSound();
        playerSUM += drawCard();
        playerSumDisplay.textContent = `プレイヤー: ${playerSUM}`;
        if (checkGameOver()) return;
        playerTurn = false;
        dealerTurn();
    }
});

// プレイヤーのSTAND処理
standButton.addEventListener('click', function () {
    playerStand = true;
    playerTurn = false;
    dealerTurn();
});

// ディーラーの行動
function dealerTurn() {
    setTimeout(() => {
        if (!dealerStand) {
            if ((dealerSUM < playerSUM && dealerSUM < 22) || dealerSUM <= 15) {
                playDrawSound();
                dealerSUM += drawCard();
                dealerSumDisplay.textContent = `ディーラー: ${dealerSUM}`;
            } else {
                dealerStand = true;
            }
        }
        if (checkGameOver()) return;
        if (!playerStand) playerTurn = true;
    }, 1000);
}

// 勝敗判定
function checkGameOver() {
    if (playerSUM >= 22 || dealerSUM >= 22) {
        resultDisplay.style.display = 'flex';
        if (playerSUM >= 22) {
            resultMessage.textContent = "ディーラーの勝利です";
        } else {
            resultMessage.textContent = "あなたの勝利です";
        }
        return true;
    } else if (playerStand && dealerStand) {
        resultDisplay.style.display = 'flex';
        if (dealerSUM > playerSUM || dealerSUM === playerSUM) {
            resultMessage.textContent = "ディーラーの勝利です";
        } else {
            resultMessage.textContent = "あなたの勝利です";
        }
        return true;
    }
    return false;
}

// リセット処理
resetButton.addEventListener('click', function () {
    deck = Array.from({ length: 54 }, (_, i) => i + 1);
    playerSUM = 0;
    dealerSUM = drawCard();
    playerStand = false;
    dealerStand = false;
    playerTurn = true;
    resultDisplay.style.display = 'none';
    dealerSumDisplay.textContent = `ディーラー: ${dealerSUM}`;
    playerSumDisplay.textContent = `プレイヤー: ${playerSUM}`;
});

// タイトル文字のアニメーション
const target = window.document.getElementsByTagName('h1')[0];
const flickerLetter = letter => `<span style="animation: flicker-${Math.random()*4+1}s infinite">${letter}</span>`;
const colorLetter = letter => `<span style="color: hsl(${Math.random()*360}, 100%, 80%)">${letter}</span>`;
const flickerAndColorText = text =>
    text
        .split('')
        .map(flickerLetter)
        .map(colorLetter)
        .join('');
const neonGlory = target => target.innerHTML = flickerAndColorText(target.textContent);
neonGlory(target);
target.onclick = ({ target }) => neonGlory(target);
