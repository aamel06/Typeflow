const quoteText = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const timerElement = document.getElementById("timer");
const mistakesElement = document.getElementById("mistakes");
const resultElement = document.getElementById("result");
const accuracyElement = document.getElementById("accuracy");
const wpmElement = document.getElementById("wpm");
const extraElement = document.getElementById("extra");
let spans;
let quote;
let textInput = "";
let quoteChars = [];
let wordIndex;
let started = false;
let tempQuote = "Mudfog and Other Sketches by Charles Dickens is a collection of satirical sketches written during the mid-19th century. The narratives take a humorous look at the peculiarities and absurdities of life in a fictional town called Mudfog, particularly focusing on its citizens and local politics. The sketches appear to critique the pretensions and follies of individuals within this quaint and damp setting.  The beginning of the book introduces readers to the town of Mudfog and the rise of its mayor, Nicholas Tulrumble, a coal-dealer turned public figure. Dickens paints a vivid picture of Mudfog's unappealing characteristics, such as its peculiar odor and tumultuous weather, while humorously depicting Tulrumble's newfound aspirations for grandeur. The narrative showcases the comical contradictions in Tulrumble's character as he navigates his role, revealing both his determination and the absurdity of his ambitions. The opening portion sets the tone for a light-hearted exploration of social commentary, emphasizing the folly of aspiration in a town rife with eccentricity. "
let startTime = 60;
let timer = startTime.toString();
let interval;
let mistakes = 0;
let bookWholeText;
let fullQuote;
let quoteSelection = 0;
let visibleWordCount = 50;
let totalIncorrect = 0;
let totalCorrectWords = "";


function genParagraph(){
    let bookID = parseInt(Math.random() * (10010 - 10) + 10);
    let bookURL = `https://gutendex.com/books/${bookID}/`;
    fetch(bookURL)
        .then(response => response.json())
        .then(data => {
            let preQuote = data["summaries"].toString();
            fullQuote = checkQuote(preQuote);
            if (fullQuote == ""){genParagraph(); console.log("again");return;}
            else{
                loadQuote(0, visibleWordCount);
            }

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
    if (userInput.value.length === spans.length && spans.length > 0){
        totalIncorrect = 
        console.log("next")
        quoteSelection += visibleWordCount
        loadQuote(quoteSelection, quoteSelection + visibleWordCount);

    }
    else{
        wordIndex = userInput.value.length;
        
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
            let i = userInput.value.length;
            spans[i].classList.remove("correct");
            spans[i].classList.remove("incorrect");
            //selectCurrentChar();
        }
        mistakes = document.querySelectorAll('.incorrect').length
        selectCurrentChar();
    }
});

function selectCurrentChar(){
    document.querySelectorAll(".currentChar").forEach(element => {
        element.classList.remove("currentChar");});
    spans[wordIndex].classList.add("currentChar"); 
}

window.addEventListener("keydown", function(event) {
    userInput.focus();
    if ((((event.keyCode) >= 48 && event.keyCode <= 90) || event.keyCode === 32) && started === false){
        startGame();
    }
});

function startGame(){
    extraElement.style.display = "none";
    started = true;
    startTimer();
    console.log("started")
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
    if (pqNew.length < 1000 && pqNew.length > 1500) {return ""};
    pqNew = pqNew.split("").map(char => {
        if (/^[\x00-\x7F]*$/.test(char) === false) return ""
        if (char === '"') return "";
        return char;
    })
    .join("");

    return pqNew;
}

function displayResults(){
    clearInterval(interval);
    userInput.disabled = true;
    resultElement.style.display = "block";
    quoteText.style.filter.blur = "10px";
    console.log(document.querySelectorAll('.incorrect'))
}

function loadQuote(start,end){
    wordIndex = 0;
    userInput.value = "";
    quoteText.textContent = "";
    spans = [];
    let stindex = (fullQuote.split(" ").slice(0,start)).toString().length
    let enindex = (fullQuote.split(" ").slice(0,end)).toString().length
    quote = fullQuote.substring(stindex + (stindex/stindex),enindex)
    quote.split("").forEach(char => {
        const span = document.createElement("span")
        span.innerText = char;
        quoteText.appendChild(span);            
    });
    spans = quoteText.querySelectorAll("span");
}