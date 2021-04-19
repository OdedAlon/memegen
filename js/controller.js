'use strict';

var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas');
    gCtx = gElCanvas.getContext('2d')
    renderGallery();
    window.addEventListener('resize', function(){
        resizeCanvas();
    });
}

function renderGallery() {
    let imgs = getImgs();
    let strHtmls = imgs.map(img => {
        return `<img src=${img.url} onclick="onOpenModal(${img.id})" />`
    });
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('');
}

function onOpenModal(imgId) {
    document.querySelector('.meme-editor-modal').style.display = 'flex';
    setImgOfDefMeme(imgId);
    renderModal();
}

function renderModal() {
    // resizeCanvas();
    let currMeme = getDefMeme();
    let imgUrl = getMemeUrl(currMeme);
    // Load the IMAGE befor rest of the render.
    const img = new Image()
    img.src = imgUrl;
    img.onload = drawImg(img);
    let currY = currMeme.lines[gMeme.selectedLineIdx].pos.y;
    let size = currMeme.lines[gMeme.selectedLineIdx].size;
    gCtx.beginPath();
    gCtx.rect(20, currY - size, 460, 1.2 * size);
    gCtx.fillStyle = 'rgb(210, 210, 210, .7)';
    gCtx.fillRect(20, currY - size, 460, 1.2 * size);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    let txt = currMeme.lines[gMeme.selectedLineIdx].txt;
    document.querySelector('input[name="input-txt"]').value = txt;
    currMeme.lines.forEach(line => {
        drawTextLine(line);
    })  
}

function onAddLine() {
    let currMeme = getDefMeme();
    let lines = currMeme.lines;
    let currY;
    // TODO: When first line deleted - the next 'add-line' get: y = 50;
    if (lines.length === 0) currY = 50;
    else if (lines.length === 1) currY = gElCanvas.height - 50;
    else currY = gElCanvas.height / 2 + lines.length * 10;
    addLine(currY);
    renderModal();
}

function onSwitchLine() {
    switchLine();
    renderModal();
}

function onRemoveLine() {
    removeLine();
    renderModal();
}

function onChangeFontSize(change) {
    let currMeme = getDefMeme();
    let size = currMeme.lines[currMeme.selectedLineIdx].size += change;
    setSizeChange(size);
    renderModal();
}

function onChangeUpDownRow(change) {
    let currMeme = getDefMeme();
    let currY = currMeme.lines[currMeme.selectedLineIdx].pos.y += change;
    setUpDownChange(currY);
    renderModal();
}

function onCloseModal() {
    document.querySelector('.meme-editor-modal').style.display = 'none';
    resetCurrMeme();
}

function drawImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);     
}

function drawTextLine(line) {
    gCtx.font = `${line.size}px impact`;
    gCtx.fillStyle = `${line.color}`;
    gCtx.textAlign = `${line.align}`;
    gCtx.fillText(`${line.txt}`, `${line.pos.x}`, `${line.pos.y}`);
    gCtx.strokeText(`${line.txt}`, `${line.pos.x}`, `${line.pos.y}`);    
}

function onTextChange() {
    var elTxt = document.querySelector('input[name="input-txt"]').value;
    setTextChange(elTxt);
    renderModal();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}