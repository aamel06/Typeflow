const quoteText = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const timerElement = document.getElementById("timer");
const mistakesElement = document.getElementById("mistakes");
const resultElement = document.getElementById("result");
const accuracyElement = document.getElementById("accuracy");
const wpmElement = document.getElementById("wpm");
let spans;
let quote;
let textInput = "";
let quoteChars = [];
let wordIndex = 0;
let started = false;

let startTime = 60;
let timer = startTime.toString();
let interval;
let mistakes = 0;
let bookWholeText;


function genParagraph(){
    let bookID = parseInt(Math.random() * (10010 - 10) + 10);
    let bookURL = `https://gutendex.com/books/${bookID}/`;
    let preQuote;
    fetch(bookURL)
        .then(response => response.json())
        .then(data => {
            preQuote = data["summaries"].toString();
            quote = checkQuote(preQuote);
            if (quote == ""){genParagraph;console.log("again");return;}
            else{
                quote.split("").forEach(char => {
                    const span = document.createElement("span")
                    span.innerText = char;
                    quoteText.appendChild(span);            
                });
            }
            spans = quoteText.querySelectorAll("span");
            quote = quoteText.textContent;
        })
        .catch(error => {
            console.error('Error fetching the word:', error);
            genParagraph()
            return;
        });
    
}

window.onload = () => {
    genParagraph();
    timerElement.textContent = timer;
}

userInput.addEventListener("input", function(event) {
    wordIndex = userInput.value.length;
    selectCurrentChar();
    userInput.setSelectionRange(wordIndex,wordIndex);
    let input = userInput.value.split("");
    let index = userInput.value.length - 1;

    if (index >= 0 && input[index] === quote[index]) {
        if (spans[index].classList.contains("incorrect")){
                spans[index].classList.remove("incorrect");
        }
        spans[index].classList.add("correct");
    }
    else if (index >= 0) {
        spans[index].classList.remove("correct");
        spans[index].classList.add("incorrect");
    }
    if (event.inputType == "deleteContentBackward"){
        wordIndex = userInput.value.length;
        let index = userInput.value.length;
        spans[index].classList.remove("correct");
        spans[index].classList.remove("incorrect");
        selectCurrentChar();
    }
    mistakes = document.querySelectorAll('.incorrect').length

});

function selectCurrentChar(){
    document.querySelectorAll(".currentChar").forEach(element => {
        element.classList.remove("currentChar");});
    spans[wordIndex].classList.add("currentChar"); 
}

window.addEventListener("keydown", function(event) {
    if (!started){
        startGame();
    }
    

});

function startGame(){

    started = true;
    userInput.focus();
    startTimer();
}

function startTimer(){
    interval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            displayResults();
        }   
    }, 1000);
}

function checkQuote(pq){
    let pqNew = pq.slice(0, -46);
    if (pqNew.length < 1000 || pqNew.length > 1500) {return ""};
    pqNew = pqNew.split("").map(char => {
        if (/^[\x00-\x7F]*$/.test(char) === false) return ""
        if (char === '"') return "";
        return char;
    })
    .join("");

    return pqNew;
}

function displayResults(){
    let numOfCorrect = quoteText.querySelectorAll(".correct").length;
    let numTotal =  quoteText.querySelectorAll(".correct").length + quoteText.querySelectorAll(".incorrect").length;
    let totalCorrectQuote = "";
    accuracyElement.textContent = ((numOfCorrect / numTotal) * 100).toFixed(1);
    quoteText.querySelectorAll(".correct").forEach(element => {
        totalCorrectQuote =  totalCorrectQuote + element.textContent});

    clearInterval(interval);
    userInput.disabled = true;
    resultElement.style.display = "block";
    wpmElement.textContent = totalCorrectQuote.split(" ").length / (startTime / 60)
    quoteText.style.filter.blur = "10px";
    console.log(document.querySelectorAll('.incorrect'))
}