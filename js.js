
let container = document.querySelector('#container');
let div = document.querySelector('#elem');
let num = document.querySelector('#number');
let tableGame = document.querySelector('table');
let btn = document.querySelector('#reset');
let timeId = document.querySelector('#time');
let close = document.querySelector('#close');
let blockSetting = document.querySelector('#setting');
let sizeTable = document.querySelector('#sizeTable');
let stopTimer = document.querySelector('#stopTimer');
let clue = document.querySelector('#clue');



let timeAudio = new Audio('sound/TIME.mp3');

let arrColor = ['green', 'pink', 'blue', 'gray', 'white', 'yellow', 'purple', 'brown', 'orange'];
let step = 1;
let col = 2;
let row = 2;
let time = (col + row) * 4;
let clueItems = 5;
let flagTimer = true;
let stopGame;
let timerId = null


createTable();

btn.addEventListener('mousedown', function () {
    resGame(0);
    addSound('RESET');
    col = 2;
    row = 2;
    step = 1;
    time = (col + row) * 4;
    num.textContent = step;
    btn.previousElementSibling.children[0].remove();

    createTable();
    btn.style.visibility = 'hidden';
})



function createTable() {

    let table = createElems('table', div);
    let matrix = addArr();;

    for (const elemTd of matrix) {
        let tr = createElems('tr', table);

        for (const elems of elemTd) {
            let td = createElems('td', tr);
            td.innerHTML = elems;
            td.style.fontSize = getRandomArbitrary(13, 32) + 'px';
            td.style.color = arrColor[getRandomArbitrary(0, arrColor.length)];

            td.addEventListener('mousedown', function www() {
                console.log(time);
                btn.style.visibility = 'visible';
                blockSetting.classList.remove('closeSetting');
                blockSetting.classList.add('over');


                if (!stopTimer.checked) {
                    startTime();
                }


                if (+td.innerHTML == step) {
                    addSound('CLICK_NEW');
                    td.style.backgroundColor = 'green';
                    td.classList.add('active');
                    step++;
                    time++;
                    num.textContent = step;

                    if (step > col * row) {
                        addSound('NEXT');
                        table.remove();
                        col++;
                        row++;
                        step = 1;
                        num.textContent = step;
                        time = (col + row) * 4;
                        timeAudio.pause();
                        timeAudio.currentTime = 0;
                        createTable();

                    }
                }
                else {
                    addSound('ERROR');
                }

            })
        }
    }
}


function addArr() {
    let arr = [];
    for (let i = 1; i <= col * row; i++) {
        arr.push(i);
    }

    arr.sort(() => Math.random() - 0.5);

    let result = [];
    for (let i = 0; i < row; i++) {
        result.push(arr.slice(i * col, (i + 1) * col));
    }
    return result;
}


function createElems(el, par) {
    let elems = document.createElement(el);
    par.appendChild(elems);
    return elems;
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function startTime() {
    // Если таймер уже запущен, не запускаем новый
    if (timerId !== null) return;

    flagTimer = false;

    timerId = setInterval(() => {
        timeId.textContent = --time;

        if (time <= 5 && time > 0) {
            if (timeAudio.paused) timeAudio.play();
        }

        if (time <= 0) {
            clearInterval(timerId);
            timerId = null;
            btn.style.visibility = 'visible';
            let table = document.querySelector('table');
            if (table) table.classList.add('over');
            addSound('GAME_OVER');
            resGame();
        }
    }, 1000);
}



function resGame(num = time) {
    stopTime(); // вместо clearInterval(stopGame) и сбросов вручную
    clueItems = 5;
    clue.textContent = clueItems;
    clue.style.backgroundColor = '';
    timeId.textContent = num;
    blockSetting.classList.remove('over');
    container.style.flexDirection = '';
    timeId.nextElementSibling.style.display = '';
    timeId.style.fontSize = '';
}


close.addEventListener('click', function () {
    close.closest('ul').classList.toggle('closeSetting');
})

sizeTable.addEventListener('change', function () {
    col = +sizeTable.value;
    row = +sizeTable.value;
    time = (col + row) * 4;
    step = 1;
    num.textContent = step;
    document.querySelector('table').remove();
    btn.style.visibility = 'hidden'
    createTable();

    if (sizeTable.value >= 10) {
        container.style.flexDirection = 'row';
        timeId.nextElementSibling.childNodes[0].textContent = '';
        timeId.nextElementSibling.style.fontSize = '60px';
        timeId.style.fontSize = '60px';
        timeId.style.borderRight = '1px solid red';
    } else {
        container.style.flexDirection = '';
        timeId.nextElementSibling.childNodes[0].textContent = 'Следующие Число';
        timeId.nextElementSibling.style.fontSize = '';
        timeId.style.borderRight = '';
        timeId.style.fontSize = '';
    }
})



clue.addEventListener('click', function () {

    let tds = document.getElementsByTagName('td');
    for (const elems of tds) {

        if (clueItems != 0) {
            if (elems.textContent == step) {
                elems.classList.add('clue');
                clueItems--;
                clue.textContent = clueItems;
                console.log(clueItems);
                addSound('CLICK_NEW');
            }
        }
        else {
            clue.style.backgroundColor = 'red';
            addSound('ERROR');
        }
    }
})


function addSound(audio) {
    let play = new Audio(`sound/${audio}.mp3`);
    play.play();
    return play;
}



function stopTime() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    flagTimer = true;
    timeAudio.pause();
    timeAudio.currentTime = 0;
}



