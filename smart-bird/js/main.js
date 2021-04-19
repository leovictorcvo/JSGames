const player = document.getElementById('player');
const prize = document.getElementById('prize');
const screenGame = document.getElementById('screen-game');
const footerGame = document.getElementById('footer-game');
const wallsOvercome = document.getElementById('walls-overcome');
const goUpButton = document.getElementById('goUpButton');
const goDownButton = document.getElementById('goDownButton');

const wall = document.getElementById('wall');
const quantityOfWalls = 3;
const wall_width = 30;
const wall_Velocity = 10;

const bird_width = 34;
const bird_height = 24;
const bird_left = 53;

const board_width = 767;
const board_height = 464;

const frame_rate = 1000.0 / 10.0; //10 fps
const steps_from_middle = 10;
const height_increase = 20;

const colors = [
    {
        background: "#3a3ac9",
        color: "#f5f5f5"
    },
    {
        background: "#fcfc50",
        color: "#3c3c3c"
    },
    {
        background: "#215721",
        color: "#f5f5f5"
    },
    {
        background: "#001F3F",
        color: "#e1e8ef"
    },
    {
        background: "#3e8c8c",
        color: "#f5f5f5"
    },
    {
        background: "#3D9970",
        color: "#163728"
    },
    {
        background: "#85144b",
        color: "#f1eaee"
    },
    {
        background: "#B10DC9",
        color: "#efa9f9"
    }
];

const options = [
    {
        question: '1 X 1 = ?',
        answer: '1'
    },
    {
        question: '1 + 1 = ?',
        answer: '2'
    },
    {
        question: '7 - 4 = ?',
        answer: '3'
    },
    {
        question: '2 X 2 = ?',
        answer: '4'
    },
    {
        question: '8 - 3 = ?',
        answer: '5'
    },
    {
        question: '2 X 3 = ?',
        answer: '6'
    },
    {
        question: '9 - 2 = ?',
        answer: '7'
    },
    {
        question: '3 + 5 = ?',
        answer: '8'
    },
    {
        question: '3 X 3 = ?',
        answer: '9'
    },
    {
        question: '2 + 8 = ?',
        answer: '10'
    },
];

let optionDrawn;

let height = (board_height - bird_height) / 2;
let rotation = 0;

let game_interval;
let wallsScore;

let wall_left = board_width - wall_width;
let wall_height;
wall.style.width = `${wall_width}px`;
wall.style.left = `${wall_left}px`;
let wallOptions = [];

const goDown = () => {
    height += height_increase;
    rotation = 45;
};

const goUp = () => {
    height -= height_increase;
    rotation -= 45;
};

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && (height + height_increase + bird_height < board_height)) {
        goDown();
    } else if (e.key === 'ArrowUp'&& (height - height_increase - (bird_height / 2) > 0)) {
        goUp();
    }
   
    return false;
});

goUpButton.addEventListener('click', goUp);
goDownButton.addEventListener('click', goDown);

const drawPlayer = () => {
    player.style.transform = `rotate(${rotation}deg)`;
    player.style.top = `${height - (bird_height / 2)}px`;
    rotation = 0;    
};

const drawWall = () => {
    wall_left = wall_left - wall_Velocity;
    if (wall_left < 0) {
        wall_left = board_width - wall_width;
        drawAnOption();
        createWall();
    }
    wall.style.left = `${wall_left}px`; 
};

const drawnOptions = () => {
    const tempOptions = [];
    tempOptions.push(options[optionDrawn].answer);
    for(let i = 0; i < 2; i++) {
        let option = options[Math.floor(Math.random() * options.length)].answer;
        while (tempOptions.indexOf(option) > -1) {
            option = options[Math.floor(Math.random() * options.length)].answer;
        }
        tempOptions.push(option);
    }
    return tempOptions.sort(() => Math.random() - 0.5);
};

const drawnColors = () => {
    colors.sort(() => Math.random() - 0.5);
    const result = [];
    for(let i = 0; i < quantityOfWalls; i++)
        result.push(colors[i]);
    return result;
};

const createWall = () => {
    wallOptions = drawnOptions();
    const colors = drawnColors();

    wall.innerHTML = '';
    for(let i = 0; i < quantityOfWalls; i++) {
        const wallDiv = document.createElement('div');
        wallDiv.style.backgroundColor = colors[i].background;
        wallDiv.style.color = colors[i].color;
        wallDiv.innerHTML = wallOptions[i];
        wallDiv.id =  `wall-${i+1}`;
        wall.appendChild(wallDiv);
    }
    wall_height = wall.firstChild.offsetHeight;
}

const drawAnOption = () => {
    optionDrawn = Math.floor(Math.random() * options.length);
    prize.innerHTML = options[optionDrawn].question;
};

const createPlayer = () => {
    player.style.width = `${bird_width}px`;
    player.style.height = `${bird_height}px`;
    player.style.left = `${bird_left}px`;
    player.style.top = `${height - (bird_height / 2)}px`;
};

const getWallHitedByPlayer = () => {
    const playerTop = parseInt(player.style.top.substr(0, player.style.top.length - 2));
    return Math.floor(playerTop / wall_height);
}

const checkIfBirdIsAlive = () => {
    if (bird_left + bird_width === wall_left) {
        const wallHited = getWallHitedByPlayer();

        if (options[optionDrawn].answer != wallOptions[wallHited]) {
            stopGame();
        } else {
            const wallToHide = document.getElementById(`wall-${wallHited + 1}`);
            wallToHide.style.visibility = 'hidden';
            wallsScore++;
            updateScore();
        }
    }
};

const updateScore = () => {
    wallsOvercome.textContent = wallsScore;
};

const stopAnimation = () => {
    player.style.animation = "";
    screenGame.style.animation = "";
    footerGame.style.animation = "";
};

const startAnimation = () => {
    player.style.animation = "animBird 300ms steps(4) infinite";
    screenGame.style.animation = "animSky 7s linear infinite";
    footerGame.style.animation = "animLand 2516ms linear infinite";
};

const stopGame = () => {
    clearInterval(game_interval);
    stopAnimation();
};

const startGame = () => {
    wallsScore = 0;

    drawAnOption();
    createWall();
    updateScore();
    createPlayer();
    startAnimation();
    
    game_interval = setInterval(() => {
        drawPlayer();
        drawWall();
        checkIfBirdIsAlive();
    }, frame_rate);    
};

startGame();