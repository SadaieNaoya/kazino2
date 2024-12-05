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

// プレイボタンをクリックした時の処理
playButton.addEventListener('click', function () {
    playButton.style.display = 'none';
    title.style.display = 'none'; // タイトルを非表示
    video.style.display = 'block';
    video.play();
});

video.onended = function () {
    video.style.display = 'none';
    gameInfo.style.display = 'flex'; // SUM表示を表示
    gameControls.style.display = 'flex';
    dealerSUM = drawCard();
    playerSUM = drawCard(); // プレイヤーの初期値を設定
    dealerSumDisplay.textContent = `ディーラー: ${dealerSUM}`;
    playerSumDisplay.textContent = `プレイヤー: ${playerSUM}`;
};

// プレイヤーのHIT処理
hitButton.addEventListener('click', function () {
    if (playerTurn && !playerStand) {
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
        resultMessage.textContent = playerSUM >= 22 ? "ディーラーの勝利です" : "あなたの勝利です";
        return true;
    } else if (playerStand && dealerStand) {
        resultDisplay.style.display = 'flex';
        resultMessage.textContent = (dealerSUM > playerSUM || dealerSUM === playerSUM) ? "ディーラーの勝利です" : "あなたの勝利です";
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
