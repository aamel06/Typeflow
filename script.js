const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const settingsButton = document.getElementById("settingsButton");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const userInput = document.getElementById("word-input");
const wordText = document.getElementById("word");
const settingsElement = document.getElementById("settings");

const lengthElement = document.getElementById("length");
const languageElement = document.getElementById("language");
const timerSelectElement = document.getElementById("timerSelect");
const requireCapitalElement = document.getElementById("requireCapital");
const requireDiacriticsElement = document.getElementById("requireDiacritics");

let wordapiURL = "https://random-word-api.herokuapp.com/word?";
let word = "";
let time = 0;
let timer = 0;
let interval;
let mistakes = 0;
let score = 0;

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkWord();
    }
});

window.onload = () => {
    userInput.disabled = true;
}

function genWord(){
    fetch(wordapiURL)
      .then(response => response.json())
      .then(data => {
        word = String(data[0]).charAt(0).toUpperCase() + String(data[0]).slice(1);
        document.getElementById("word").textContent = word;
      })
      .catch(error => {
        document.getElementById('word').textContent = 'Error loading word';
        console.error('Error fetching the word:', error);
      });
}

function reset(){   
    time = 0;
    timer = parseInt(timerSelectElement.value);
    mistakes = 0;
    score = 0;
    clearInterval(interval)

    scoreElement.textContent = score;
    wordText.textContent = "...";
    userInput.value = "";
    
}

function start() {

    wordapiURL = "https://random-word-api.herokuapp.com/word?length=" + lengthElement.value + languageElement.value
    console.log(timer)
    userInput.disabled = false;
    userInput.focus();

    reset();
    genWord();
    startButton.disabled = true;
    resetButton.disabled = false;
    settingsButton.disabled = true;

    interval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;

        if (timer <= 0) {
            clearInterval(interval);
            userInput.disabled = true;
            startButton.disabled = false;
            resetButton.disabled = true;
            settingsButton.disabled = false;

        }
    }, 1000);
}

function checkWord(){
    let answer = userInput.value;
    if (requireDiacriticsElement.value == "no"){
        answer = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    if (requireCapitalElement.value == "no"){
        answer = answer.toUpperCase();
        word = word.toUpperCase();
    }

    if (answer == word){
        score++;
    }

    userInput.value = "";
    scoreElement.textContent = score;
    genWord();
}

function openSettings(){
    // settingsElement.style.display = "block";
    settingsElement.style.display = "block";
    settingsElement.style.transform = "scale(1)";
}

function closeSettings(){
    settingsElement.style.transform = "scale(0)";
    settingsElement.style.display = "none";
    timer = parseInt(timerSelectElement.value);
    timerElement.textContent = timer;
}

function resetGame(){
    time = 0;
    timer = parseInt(timerSelectElement.value);
    mistakes = 0;
    score = 0;
    clearInterval(interval)

    timerElement.textContent = timer;
    wordText.textContent = "...";
    userInput.value = "";
    userInput.disabled = true;
    startButton.disabled = false;
    resetButton.disabled = true;
    settingsButton.disabled = false;
}