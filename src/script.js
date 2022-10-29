'use strict';

const container = document.querySelector('.fifteen'),
      items = Array.from(container.querySelectorAll('.item')),
      countItems = 16;


if (items.length !== countItems) {
    throw new Error('Should be exactly 16 items');
}

// Position
items[countItems - 1].style.display = 'none';

const matrix = getMatrix(
    items.map(item => Number(item.dataset.matrixId))
);

setPositionItems(matrix); 


function getMatrix(arr) {
    let matrix = [[], [], [], []];
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

function setPositionItems(matrix) {
    let counter = 0;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            let node = items[counter];
            setNodeStyles(node, x, y);
            counter++;
        }
    }
}

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}


