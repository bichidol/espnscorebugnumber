let scores = {
    'home': 0,
    'away': 0
};

function changeScore(team, amount) {
    let newScore = scores[team] + amount;
    if (newScore < 0) newScore = 0;
    updateScore(team, newScore);
}

function updateScore(team, newScore) {
    if (newScore < 0) newScore = 0;

    const teamPrefix = team + '-';
    const oldScore = scores[team];
    scores[team] = newScore;

    const newScoreStr = String(newScore);
    const oldScoreStr = String(oldScore);
    const newDigitCount = newScoreStr.length;
    const oldDigitCount = oldScoreStr.length;

    if (newDigitCount !== oldDigitCount) {
        switchContainers(team, newDigitCount, newScoreStr); //pass the team as an argument
    } else {
        //update digits within the same container
        for (let i = 0; i < newDigitCount; i++) {
            const oldDigit = oldScoreStr[oldScoreStr.length - i - 1] || '';
            const newDigit = newScoreStr[newScoreStr.length - i - 1] || '';
            const digitElement = document.getElementById(teamPrefix + getDigitElementId(newDigitCount, i)); //prefix team to the ID
            updateDigit(digitElement, oldDigit, newDigit);
        }
    }
}


function switchContainers(team, newDigitCount, newScoreStr) {
    const teamPrefix = team + '-'; //create a prefix to identify team-specific elements
    const oneDigitContainer = document.getElementById(teamPrefix + 'one-digit-wrapper');
    const twoDigitContainer = document.getElementById(teamPrefix + 'two-digit-wrapper');
    const threeDigitContainer = document.getElementById(teamPrefix + 'three-digit-wrapper');

    const containers = [oneDigitContainer, twoDigitContainer, threeDigitContainer];

    let newContainer;
    switch (newDigitCount) { 
        case 1:
            newContainer = oneDigitContainer;
            break;
        case 2:
            newContainer = twoDigitContainer;
            break;
        case 3:
            newContainer = threeDigitContainer;
            break;
    }

    if (newContainer) {
        //prepare new container content before animating
        for (let i = 0; i < newDigitCount; i++) { 
            const newDigit = newScoreStr[newScoreStr.length - i - 1] || '';
            const digitElement = document.getElementById(teamPrefix + getDigitElementId(newDigitCount, i)); //prefix team to the ID
            digitElement.innerHTML = `<div>${newDigit}</div>`;
        }

        //remove existing animation and set display to flex
        newContainer.style.animation = '';
        newContainer.style.display = 'flex';
        //trigger reflow to ensure animation runs
        void newContainer.offsetWidth;
        //now apply the animation
        newContainer.style.animation = 'slideIn 0.5s forwards';
    }

    containers.forEach(container => {
        if (container !== newContainer && container.style.display !== 'none') {
            //apply slide out animation to old container
            container.style.animation = 'slideOut 0.5s forwards';
            container.addEventListener('animationend', () => {
                container.style.display = 'none';
                container.style.animation = '';
            }, { once: true });
        }
    });
}


function getDigitElementId(digitCount, index) {
    switch (digitCount) {
        case 1: return 'single-digit';
        case 2: return index === 0 ? 'units-digit' : 'tens-digit';
        case 3: return ['units-digit-three', 'tens-digit-three', 'hundreds-digit'][index];
        default: return '';
    }
}

function updateDigit(digitElement, oldDigit, newDigit) {
    if (oldDigit === newDigit) {
        digitElement.innerHTML = `<div>${newDigit}</div>`;
        return; //return early if the digit is not changing
    }

    digitElement.innerHTML = `
        <div style="transform: translateY(0);">${oldDigit}</div>
        <div style="transform: translateY(-100%);">${newDigit}</div>
    `;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const [oldDigitDiv, newDigitDiv] = digitElement.children;
            oldDigitDiv.style.transform = 'translateY(100%)';
            newDigitDiv.style.transform = 'translateY(0)';

            oldDigitDiv.addEventListener('transitionend', () => {
                oldDigitDiv.remove();
            });
        });
    });
}


function setInitialScoreboardState() {
    const scoreWrapperElement = document.querySelector('.score-wrapper');
    scoreWrapperElement.className = 'score-wrapper one-digit'; //set initial class
}

//initialize both scoreboards
document.addEventListener('DOMContentLoaded', (event) => {
    updateScore('away', 0);
    updateScore('home', 0);
});


