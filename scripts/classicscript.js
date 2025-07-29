const quoteText = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const timerElement = document.getElementById("timer");
const mistakesElement = document.getElementById("mistakes");
const resultElement = document.getElementById("result");
const accuracyElement = document.getElementById("accuracy");
const wpmElement = document.getElementById("wpm");
const extraElement = document.getElementById("extra");
const themeButton = document.getElementById("theme");
const saveChangesButton = document.getElementById("saveChanges");
const root = document.querySelector(':root');
const rootStyle = getComputedStyle(root);
const commonWords = ["about","after","again","always","animal","answer","around","beauty","before","behind","belong","better","between","beyond","bottle","bottom","branch","bright","broken","budget","camera","cannot","career","castle","center","chance","change","charge","choice","choose","church","circle","clause","client","climb","closed","closer","coffee","column","common","corner","cotton","couple","course","create","credit","danger","decide","defend","demand","design","detail","differ","dinner","doctor","dollar","double","driven","driver","during","easily","effort","either","emerge","energy","enough","entire","escape","estate","ethics","except","expert","family","famous","father","female","figure","finger","finish","flight","flower","follow","forest","forget","formal","former","friend","future","garden","gather","gender","global","golden","ground","growth","handle","happen","health","height","hidden","honest","impact","income","indeed","injury","inside","insist","intent","invest","island","itself","jacket","joined","jungle","keeper","killed","kitchen","ladder","latter","launch","lawyer","leader","league","length","lesson","letter","little","living","lonely","lovely","lunch","manage","manner","manual","market","master","matter","medium","member","memory","mental","method","middle","minute","mirror","mobile","modern","moment","mother","motion","museum","muscle","myself","nation","nature","nearby","nearly","needed","nobody","normal","object","office","online","option","orange","others","ought","output","parent","people","period","permit","person","phrase","planet","please","plenty","police","policy","prefer","pretty","prince","prison","public","puzzle","quickly","rather","really","reason","record","refuse","region","relate","repair","repeat","rescue","result","return","review","reward","riding","rocket","ruling","safety","school","screen","search","season","second","secure","select","senior","sense","series","serve","settle"];
const typeButton = document.getElementById("typeOfText");


let spans;
let quote;
let wordIndex;
let started;
let startTime = 30;
let timer;
let interval;
let fullQuote;
let quoteSelection;
let visibleWordCount = 50;
let totalIncorrect;
let correctWords;
let quoteWords;
let wpm;
let accuracy;
let colorChange;
let textChange;
let settingsOpen = true;
let textType = "[Quote]";

function genQuote(){
    let bookID = parseInt(Math.random() * (10010 - 10) + 10);
    let bookURL = `https://gutendex.com/books/${bookID}/`;
    fetch(bookURL)
        .then(response => response.json())
        .then(data => {
            let preQuote = data["summaries"].toString();
            fullQuote = checkQuote(preQuote);
            if (fullQuote == ""){genQuote(); console.log("again");return;}
            else{
                loadQuote(0, visibleWordCount);
            }

        })
        .catch(error => {
            console.error('Error fetching the word:', error);
            genQuote()
            return;
        });
}

function genRandom(){
    let preQuote = "";
    for (let i = 0; i <= 200; i++){
        preQuote = preQuote + commonWords[parseInt(Math.random() * (200))] + " ";
    }
    fullQuote = preQuote;
    loadQuote(0, visibleWordCount);

}

window.onload = () => {
    toggleSettings();
    set();
    document.getElementById("accentpicker").value = rootStyle.getPropertyValue("--defaultaccent");
    document.getElementById("wordsper").value = 50;
}

userInput.addEventListener("input", function(event) {
    if (userInput.value.length === spans.length && spans.length > 0){
        checkWords();

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
                spans[index].classList.remove("incorrectSpace");
            }
            spans[index].classList.add("correct");
            
        }
        else if (index >= 0) {
            spans[index].classList.remove("correct");
            spans[index].classList.add("incorrect");
            totalIncorrect += 1;
            if (spans[index].textContent === " "){
                spans[index].classList.add("incorrectSpace");
            }
        }

        if (event.inputType == "deleteContentBackward"){
            wordIndex = userInput.value.length;
            let i = userInput.value.length;
            spans[i].classList.remove("correct");
            spans[i].classList.remove("incorrect")
            spans[index].classList.remove("incorrectSpace");

        }
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
    if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
});

function startGame(){
    extraElement.classList.remove("blinker")
    saveChangesButton.disabled = true;
    extraElement.style.opacity = "0";
    started = true;
    startTimer();
    console.log("started")
}

function startTimer(){
    interval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        wpm = parseInt((userInput.value.length / 5)/ (startTime/60));
        accuracy = (((userInput.value.length - totalIncorrect) / userInput.value.length) * 100).toFixed(1);
        wpmElement.textContent = wpm;
        accuracyElement.textContent = accuracy;

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
    checkWords();
    clearInterval(interval);
    userInput.disabled = true;
    resultElement.style.display = "block";
    quoteText.classList.add("finished");
    saveChangesButton.disabled = false;

    totalIncorrect += document.querySelectorAll('.incorrect').length;
    let cwpm = correctWords.length / (startTime / 60);
    document.getElementById("cwpm").textContent = cwpm;
    document.getElementById("tcc").textContent = quoteText.querySelectorAll(".correct").length;
    document.getElementById("tic").textContent = quoteText.querySelectorAll(".incorrect").length;
    document.getElementById("tcw").textContent = correctWords.length;
    document.getElementById("tw").textContent = userInput.value.split(" ").length;
    document.getElementById("tt").textContent = startTime - timer;
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
    quoteWords = quote.split(" ");
    console.log(quote)
}

function checkWords(){
    let correctElements = quoteText.querySelectorAll(".correct");
    let total = Array.from(correctElements).map(el => el.textContent).join("").split(" ");

    for (i in total){
        if (quoteWords.includes(total[i])){
            correctWords.push(total[i]);
        }
    }
}

function focus(){
    userInput.focus;
}

function playAgain(){
    set();
}

function set(){
    if (textType == "[Quote]"){
        genQuote();
    }
    else{
        genRandom();
    }

    saveChangesButton.disabled = false;
    clearInterval(interval);
    timer = startTime.toString();
    quoteSelection = 0;
    totalIncorrect = 0;
    correctWords = [];
    started = false;
    userInput.value = "";
    userInput.disabled = false;
    extraElement.classList.add("blinker")
    extraElement.style.opacity = "100";
    resultElement.style.display = "none";
    timerElement.textContent = timer;
    accuracyElement.textContent = "100.0";
    wpmElement.textContent = 0;

    quoteText.classList.remove("finished");


}


const lightBG = "#e3e3e3";
const lighttitleBarColour = "#bfbfbf";
const lightaccent = "black";
const lightBGaccent = "#a7a7a7";
const lightcontainerBG = "#d6d6d6";

const darkBG = "#141414";
const darktitleBarColour = "#1d1d1d";
const darkaccent = "white";
const darkBGaccent = "#383838";
const darkcontainerBG = "#121212";

function changeTheme(){
    
    if (themeButton.textContent == "[Dark]"){
        themeButton.textContent = "[Light]";
    } else if (themeButton.textContent == "[Light]"){
        themeButton.textContent = "[Dark]";
    }
}

function toggleSettings(){
    textChange = typeButton.textContent;
    colorChange = document.getElementById("accentpicker").value;
    if (settingsOpen){
        document.getElementById("settings").style.display = "none";
        settingsOpen = false;
    } else{
        document.getElementById("settings").style.display = "inline-block";
        settingsOpen = true;
    }
}

function saveChanges(){
    visibleWordCount = document.getElementById("wordsper").value;
    startTime = document.getElementById("timepicker").value;
    timerElement.textContent = startTime;
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

function resetAccent(){
    document.getElementById("accentpicker").value = rootStyle.getPropertyValue("--defaultaccent");
    console.log(document.getElementById("accentpicker").value)
    console.log(rootStyle.getPropertyValue("--defaultaccent"))
}

function changeType(){
    if (typeButton.textContent == "[Quote]"){
            textType = "[Random]";
            typeButton.textContent = "[Random]"
    }else if (typeButton.textContent == "[Random]"){
            textType = "[Quote]";
            typeButton.textContent = "[Quote]"

    }
}