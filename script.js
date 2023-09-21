let score = 0;

function changeScore(amount) {
    let newScore = score + amount;

    if (newScore < 0) newScore = 0;

    updateScore(newScore);
}

function updateScore(newScore) {
    if (newScore < 0) newScore = 0;

    const newScoreStr = String(newScore);
    const oldScoreStr = String(score);
    const newDigitCount = newScoreStr.length;
    const oldDigitCount = oldScoreStr.length;

    if (newDigitCount !== oldDigitCount) {
        switchContainers(newDigitCount, newScoreStr);
    } else {
        //update digits within the same container
        for (let i = 0; i < newDigitCount; i++) {
            const oldDigit = oldScoreStr[oldScoreStr.length - i - 1] || '';
            const newDigit = newScoreStr[newScoreStr.length - i - 1] || '';
            const digitElement = document.getElementById(getDigitElementId(newDigitCount, i));
            updateDigit(digitElement, oldDigit, newDigit);
        }
    }

    score = newScore;
}

function switchContainers(digitCount, newScoreStr) {
    const oneDigitContainer = document.getElementById('one-digit-wrapper');
    const twoDigitContainer = document.getElementById('two-digit-wrapper');
    const threeDigitContainer = document.getElementById('three-digit-wrapper');

    const containers = [oneDigitContainer, twoDigitContainer, threeDigitContainer];

    let newContainer;
    switch (digitCount) {
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
        for (let i = 0; i < digitCount; i++) {
            const newDigit = newScoreStr[newScoreStr.length - i - 1] || '';
            const digitElement = document.getElementById(getDigitElementId(digitCount, i));
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

document.addEventListener('DOMContentLoaded', (event) => {
    updateScore(0); //this will set the initial display to 0
});


