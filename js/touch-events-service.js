'use strict';

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

gElCanvas = document.querySelector('.meme-canvas');
gCtx = gElCanvas.getContext('2d')
addListeners()

function addListeners() {
    addMouseListeners();
    addTouchListeners();
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function getEvPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function getlineClicked(clickedPos) {
    let lines = getCurrMemeLines();
    let currLine = lines.find(line => {
        let minY = line.pos.y - line.size;
        let maxY = minY + line.size * 1.2;
        return clickedPos.y >= minY && clickedPos.y <= maxY 
    });
    return currLine;
}


// function isShapeClicked(clickedPos) {
//     gGrabbedShape = gShapes.find(shape => {
//         const distance = Math.sqrt((shape.pos.x - clickedPos.x) ** 2 + (shape.pos.y - clickedPos.y) ** 2);        
//         return distance <= shape.size;
//     });
//     return gGrabbedShape;
// }