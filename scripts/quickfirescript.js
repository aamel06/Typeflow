const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const settingsButton = document.getElementById("settingsButton");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const scoreElement = document.getElementById("score");
const userInput = document.getElementById("word-input");
const wordText = document.getElementById("word");
const settingsElement = document.getElementById("settings");
const qcontainer = document.getElementById("qcontainer");
const lengthElement = document.getElementById("length");
const languageElement = document.getElementById("language");
const timerSelectElement = document.getElementById("timerSelect");
const requireCapitalElement = document.getElementById("requireCapital");
const requireDiacriticsElement = document.getElementById("requireDiacritics");
const themeButton = document.getElementById("theme");
const saveChangesButton = document.getElementById("saveChanges");
const root = document.querySelector(':root');
const rootStyle = getComputedStyle(root);

let wordapiURL = "https://random-word-api.herokuapp.com/word?";
let word = "";
let timer = 0;
let interval;
let mistakes = 0;
let score = 0;
let settingsOpen = false;
let colorChange;

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
    timer = parseInt(timerSelectElement.value);
    mistakes = 0;
    score = 0;
    clearInterval(interval)

    wpmElement.textContent = score;
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
        scoreElement.textContent = score.toString();
        
    }

    userInput.value = "";
    wpmElement.textContent = score / (parseInt(timerSelectElement.value) / 60);
    genWord();
}

function openSettings(){
    // settingsElement.style.display = "block";
    qcontainer.style.display = "none";
    settingsElement.style.display = "block";
    settingsElement.style.transform = "scale(1)";
}

function closeSettings(){
    qcontainer.style.display = "block";
    settingsElement.style.transform = "scale(0)";
    settingsElement.style.display = "none";
    timer = parseInt(timerSelectElement.value);
    timerElement.textContent = timer;
}

function resetGame(){
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

function toggleSettings(){
    // textChange = typeButton.textContent;
    colorChange = document.getElementById("accentpicker").value;
    if (settingsOpen){
        document.getElementById("settings").style.display = "none";
        settingsOpen = false;
    } else{
        document.getElementById("settings").style.display = "inline-block";
        settingsOpen = true;
    }
}

function changeTheme(){
    
    if (themeButton.textContent == "[Dark]"){
        themeButton.textContent = "[Light]";
    } else if (themeButton.textContent == "[Light]"){
        themeButton.textContent = "[Dark]";
    }
}

function saveChanges(){
    if (themeButton.textContent == "[Dark]"){
            document.documentElement.classList.remove("light");
    }else if (themeButton.textContent == "[Light]"){
            document.documentElement.classList.add("light")
        }
    if (colorChange != document.getElementById("accentpicker").value){
        root.style.setProperty('--accent', document.getElementById("accentpicker").value);
    }
    set();
}