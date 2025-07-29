const subhElement = document.getElementById("subheading");
let text = "Put your typing skills to the test!";
let i = 0;
let j = 0

window.onload = () =>{typeText()};

function typeText(){
    j = 0;
    if (i < text.length) {
        subhElement.innerHTML += text.charAt(i)
        i++;
        setTimeout(typeText, 80);
    } else {
        setTimeout(eraseText, 2000);
}}

function eraseText(){
    i = 0;
    if (j < text.length) {
        subhElement.innerHTML = subhElement.innerHTML.substring(0,subhElement.innerHTML.length - 1)
        j++;
        setTimeout(eraseText, 40);
    } else {
        setTimeout(typeText, 1500);
}}
