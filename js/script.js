let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');

let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');

let average = document.querySelector('.average');
let index = 0;
let points = 0;
let preQuestions = "";

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(index);
        activateAnswers();
    });

for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
}

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    } else {
        markIncorrect(event.target);
    }
    disableAnswers();
}

function setQuestion(index) {
    clearClass();

    question.innerHTML = index + 1 + ". " + preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = "none";
        answers[3].style.display = "none";
    } else {
        answers[2].style.display = "block";
        answers[3].style.display = "block";
    }
}

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markIncorrect(elem) {
    elem.classList.add('incorrect');
}

function clearClass() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove('correct');
        answers[i].classList.remove('incorrect');
    }
}

function countScore() {
    let sum = localStorage.getItem("score");
    let attempts = localStorage.getItem("attempts");
    if (sum !== null) {
        sum = parseInt(sum) + parseInt(points)
        attempts = parseInt(attempts) + 1
        localStorage.setItem("score", sum.toString())
        localStorage.setItem("attempts", attempts.toString())
        average.innerHTML = ((sum / attempts) / 20 * 100).toFixed(2) + "%";
    } else {
        localStorage.setItem("score", points);
        localStorage.setItem("attempts", "1");
        average.innerHTML = ((points) / 20 * 100).toFixed(2) + "%";
    }
}

next.addEventListener('click', function () {
    index++;
    if (index >= preQuestions.length) {
        countScore();
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;

    } else {
        setQuestion(index);
        activateAnswers();
    }
})

previous.addEventListener('click', function () {
    index--;
    if (index < 0) {
        index = 0;
        return 0;
    } else {
        setQuestion(index);
    }
    disableAnswers();
})

restart.addEventListener('click', function (event) {
    event.preventDefault();
    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});
