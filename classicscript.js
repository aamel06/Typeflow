const quoteText = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const timerElement = document.getElementById("timer");
const mistakesElement = document.getElementById("mistakes");
const resultElement = document.getElementById("result");
const accuracyElement = document.getElementById("accuracy");
const wpmElement = document.getElementById("wpm");

const bookID = randomIntFromInterval(10, 10010);
let quote = `All children, except one, grow up. They soon know that they will grow
up, and the way Wendy knew was this. One day when she was two years old
she was playing in a garden, and she plucked another flower and ran
with it to her mother. I suppose she must have looked rather
delightful, for Mrs. Darling put her hand to her heart and cried, “Oh,
why can’t you remain like this for ever!” This was all that passed
between them on the subject, but henceforth Wendy knew that she must
grow up. You always know after you are two. Two is the beginning of the
end.

Of course they lived at 14, and until Wendy came her mother was the
chief one. She was a lovely lady, with a romantic mind and such a sweet
mocking mouth. Her romantic mind was like the tiny boxes, one within
the other, that come from the puzzling East, however many you discover
there is always one more; and her sweet mocking mouth had one kiss on
it that Wendy could never get, though there it was, perfectly
conspicuous in the right-hand corner.

The way Mr. Darling won her was this: the many gentlemen who had been
boys when she was a girl discovered simultaneously that they loved her,
and they all ran to her house to propose to her except Mr. Darling, who
took a cab and nipped in first, and so he got her. He got all of her,
except the innermost box and the kiss. He never knew about the box, and
in time he gave up trying for the kiss. Wendy thought Napoleon could
have got it, but I can picture him trying, and then going off in a
passion, slamming the door.`;
quote = quote.replace(/\n/g, ' ');

let textInput = "";
let quoteChars = [];
let wordIndex = 0;
let started = false;

let startTime = 20;
let timer = startTime.toString();
let interval;
let mistakes = 0;

window.onload = () => {
    timerElement.textContent = timer;
}

quote.split("").forEach(char => {
    const span = document.createElement("span")
    span.innerText = char;
    quoteText.appendChild(span);
});

const spans = quoteText.querySelectorAll("span");

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
    mistakesElement.textContent = mistakes

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
            clearInterval(interval);
            userInput.disabled = true;
            resultElement.style.display = "block";
            let numOfCorrect = quoteText.querySelectorAll(".correct").length;
            let numTotal =  quoteText.querySelectorAll(".correct").length + quoteText.querySelectorAll(".incorrect").length;
            let totalCorrectQuote = "";
            accuracyElement.textContent = ((numOfCorrect / numTotal) * 100).toFixed(1);
            quoteText.querySelectorAll(".correct").forEach(element => {
                totalCorrectQuote =  totalCorrectQuote + element.textContent});
            wpmElement.textContent = totalCorrectQuote.split(" ").length / (startTime / 60)
            quoteText.style.filter.blur = "10px";

        }   
    }, 1000);
}

