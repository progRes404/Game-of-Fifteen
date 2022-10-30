'use strict';

const container = document.querySelector('.fifteen'),
      items = Array.from(container.querySelectorAll('.item')),
      countItems = 16;


if (items.length !== countItems) {
    throw new Error('Should be exactly 16 items');
}

// Position
items[countItems - 1].style.display = 'none';

let matrix = getMatrix(
    items.map(item => Number(item.dataset.matrixId))
);

setPositionItems(matrix); 


function getMatrix(arr) {
    const matrix = [[], [], [], []];
    let y = 0;
    let x = 0;

    for (let i = 0; i < arr.length; i++) {
        if (x >= 4) {
            y++;
            x = 0;
        };

        matrix[y][x] = arr[i];
        x++;
    }

    return matrix;
}


// function setPositionItems(matrix) {
//     let counter = 0;
//     for (let y = 0; y < matrix.length; y++) {
//         for (let x = 0; x < matrix[y].length; x++) {
//             const node = items[counter];
//             setNodeStyles(node, x, y);
//             counter++;
//         }
//     }
// }

function setPositionItems(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const value = matrix[y][x];
            const node = items[value - 1];
            setNodeStyles(node, x, y);
        }
    }
}

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}


// Shuffle

const btn = document.querySelector('.button');

btn.addEventListener('click', () => {
    const array = matrix.flat();
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    matrix = getMatrix(shuffledArray);
    setPositionItems(matrix);
});


// Change position by click

const blankItem = 16;  

container.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    const buttonNumber = Number(button.dataset.matrixId);
    
    if (!button) {
        return;
    }

    const buttonCoords = findCoordinatesByNumber(buttonNumber),
          blankItemCoords = findCoordinatesByNumber(blankItem);
    
    const isValid = isValidForSwap(buttonCoords, blankItemCoords);
   
    if (isValid) {
        swap(buttonCoords, blankItemCoords, matrix);
        setPositionItems(matrix);
    }

    if (isWon(matrix)) {
        addWonClass();
    }
});


function findCoordinatesByNumber(num) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (num === matrix[y][x]) {
                return {y, x};
            }
        }
    }
};


function isValidForSwap(buttonCoords, blankItemCoords) {
    const differenceY = Math.abs(buttonCoords.y - blankItemCoords.y),
          differenceX = Math.abs(buttonCoords.x - blankItemCoords.x);

    return (differenceY === 1 && differenceX === 0 || 
            differenceY === 0 && differenceX === 1);
};


function swap(coords1, coords2, matrix) {
    const coords = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coords;
    return matrix;
};


// Change position by arrows


window.addEventListener('keydown', (e) => {
    if (!(e.code.includes('Arrow'))) {
        return;
    }

    const blankItemCoords = findCoordinatesByNumber(blankItem);
    
    const blankItemMoveTo = {
        y: blankItemCoords.y,
        x: blankItemCoords.x
    }
    
    const direction = e.code.split('Arrow')[1].toLowerCase();
    
    switch(direction) {
        case 'up': 
            blankItemMoveTo.y +=1;
            break;
        case 'right': 
            blankItemMoveTo.x -=1;
            break;  
        case 'down': 
            blankItemMoveTo.y -=1;
            break; 
        case 'left': 
            blankItemMoveTo.x +=1;
            break;
    }

    if (blankItemMoveTo.y > 3 || blankItemMoveTo.x > 3 || 
        blankItemMoveTo.y < 0 || blankItemMoveTo.x < 0) {
        return;
    }

    swap(blankItemCoords, blankItemMoveTo, matrix);
    setPositionItems(matrix);
});



// Show won

function isWon(matrix) {
    const winArray = new Array(16).fill(0).map((_, i) => i + 1);
    const flatMatrix = matrix.flat();
    for (let i = 0; i < winArray.length; i++) {
        if (flatMatrix[i] !== winArray[i]) {
            return false;
        }
    }
    return true;
}

function addWonClass() {
    setTimeout(() => {
        container.classList.add('fifteenWon');

        setTimeout(() => {
        container.classList.remove('fifteenWon');
        }, 1000);

    }, 200);
}