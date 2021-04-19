'use strict';

var gCanvas
var gCtx

function onInit() {
    gCanvas = document.querySelector('.meme-canvas');
    gCtx = gCanvas.getContext('2d')
    renderGallery();
    // renderModal();
}

function renderGallery() {
    let imgs = getImgs();
}

function renderModal() {
    let currMeme = getCurrMeme();
    let imgUrl = getMemeUrl(currMeme);
    // Load the IMAGE befor rest of the render.
    const img = new Image()
    img.src = imgUrl;
    img.onload = drawImg(img);
    let txt = getText();
    document.querySelector('input[name="input-txt"]').value = txt;
    drawTextLine(currMeme.lines[0]);
}

function drawImg(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);     
}

function drawTextLine(line) {
    gCtx.font = `${line.size}px impact`;
    gCtx.fillStyle = `${line.color}`;
    gCtx.textAlign = `${line.align}`;
    gCtx.fillText(`${line.txt}`, 250, 50);
    gCtx.strokeText(`${line.txt}`, 250, 50);    
}

function onTextChange() {
    var elTxt = document.querySelector('input[name="input-txt"]').value;
    setTextChange(elTxt);
    renderModal();
}