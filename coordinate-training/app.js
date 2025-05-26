const config = {
    elems : {
        root: document.querySelector(':root'),
        board: document.querySelector('#board'),
        square : document.querySelector('.square'),
        startBtn : document.querySelector('.start button'),
        scores: {
            correct : document.querySelector('.score div p.correct'),
            wrong : document.querySelector('.score div p.wrong'),
            accuracy : document.querySelector('.score div p.accuracy'),
        },
        timeBar : document.querySelector('.timeBar'),
    }
}
refreshConfig();

//Setup Config
function refreshConfig(){
    Object.assign(config, {
        ...config,
        options: {
            mode: Array.from(document.querySelectorAll('form [name=mode]')).find(node => node.checked).value,
            color: Array.from(document.querySelectorAll('form [name=color]')).find(node => node.checked).value,
        },
        time:{
            old: null,
            now: null,
            start: null,
            duration: 30e3,
        },
        scores: {
            correct: 0,
            wrong: 0,
            accuracy: 0,
        },
        input: {
            pressedSquare: ''
        },
        state:{
            currentSquare: '',
            currentColor: '',
            pause: false,
        },
        afGlobalId: null,
    });

    config.elems.root.style.setProperty('--border-color', 'transparent');
    config.elems.scores.correct.textContent = config.scores.correct;
    config.elems.scores.wrong.textContent = config.scores.wrong;
    config.elems.scores.accuracy.textContent = '100%';
    config.elems.timeBar.style.width = '100%';
    config.state.currentSquare = getRandomSquare(config.state.currentSquare);
    if(config.options.color === 'both') config.state.currentColor = getRandomColor();
    else config.state.currentColor = config.options.color;
}

//Game Loop
function start(){
    //Refresh
    if(config.afGlobalId) cancelAnimationFrame(config.afGlobalId);
    refreshConfig();

    //Display square label w/guess and correct color
    config.elems.square.textContent = config.state.currentSquare;
    config.elems.square.classList.toggle('black', config.state.currentColor === 'black');

    //Record current time
    config.time.start = Date.now();
    oldTime = config.time.start;

    //Start Loop
    config.afGlobalId = requestAnimationFrame(loop);
}

function end(){
    //Cleanup
    config.elems.square.textContent = '';
    config.elems.timeBar.style.width = '0px';
    window.setTimeout(()=>{
         window.alert("Time Over!")
    });
}


var now;
function loop(){
    now = Date.now(); 
    if(now - config.time.start >= config.time.duration) {
        end();
        cancelAnimationFrame(config.afGlobalId);
        config.afGlobalId = null;
        return;
    } else {
        var pct = ((config.time.duration - (now - config.time.start)) / config.time.duration);
        config.elems.timeBar.style.width = (100 * pct) + '%';
        config.elems.timeBar.style.backgroundColor = `rgb(${(255 * (1-pct)).toFixed(2)},${(255 * pct).toFixed(2)},0)`;
    }
    config.time.old = now;

    if(config.input.pressedSquare){
        if(config.input.pressedSquare == config.state.currentSquare){
            config.scores.correct++;
            config.elems.root.style.setProperty('--border-color', 'transparent');
            config.elems.scores.correct.textContent = config.scores.correct;
        } else {
            config.scores.wrong++;
            config.elems.root.style.setProperty('--border-color', 'red');
            config.elems.scores.wrong.textContent = config.scores.wrong;
        }
        config.elems.scores.accuracy.textContent = ((config.scores.correct / (config.scores.correct + config.scores.wrong)) * 100).toFixed(2) + '%';
        
        //Setup Next Guess
        if(config.options.color === 'both') config.state.currentColor = getRandomColor();
        else config.state.currentColor = config.options.color;
        config.state.currentSquare = getRandomSquare(config.state.currentSquare);
        config.elems.square.textContent = config.state.currentSquare;
        config.elems.square.classList.toggle('black', config.state.currentColor === 'black');
    }

    config.input.pressedSquare = '';
    if(!config.state.pause) config.afGlobalId = requestAnimationFrame(loop);
}

//Input Handling
config.elems.board.addEventListener('click', (e)=>{
    const x = e.offsetX; const y = e.offsetY;
    const {width, height} = e.target.getBoundingClientRect();

    var file, rank;

    if(config.state.currentColor === 'white'){
        file = String.fromCharCode(97 + Math.floor(x / (width/8)));
        rank = 8 - Math.floor(y / (height/8));
    } else if(config.state.currentColor === 'black'){
        file = String.fromCharCode(104 - Math.floor(x / (width/8)));
        rank = Math.floor(y / (height/8)) + 1;
    }

    if(config.options.mode == 'full'){
        config.input.pressedSquare = file + rank;
    } else if(config.options.mode == 'rank'){
        config.input.pressedSquare = rank;
    } else if(config.options.mode == 'file'){
        config.input.pressedSquare = file;
    }
})
config.elems.startBtn.addEventListener('click', start);

//Functions
function getRandomSquare(current){
    function genNumber(){
        const rank = Math.floor((Math.random() * 7 + 1));
        const file = String.fromCharCode(97 + Math.floor((Math.random() * 7 + 1)));

        if(config.options.mode == 'full'){
            return file + rank;
        } else if(config.options.mode == 'rank'){
            return rank;
        } else if(config.options.mode == 'file'){
            return file;
        }
        return file + rank;
    }
    var square;
    do {
        square = genNumber();
    } while (square == current);

    return square;
}

function getRandomColor(){
    return Math.random() > 0.5 ? 'white': 'black';
}
