'use strict';

var gCanvas
var gCtx

function onInit() {
    gCanvas = document.querySelector('.meme-canvas');
    gCtx = gCanvas.getContext('2d')
    renderGallery();
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
    let currMeme = getDefMeme();
    currMeme.selectedImgId = imgId;
    renderModal();
}

function renderModal() {
    let currMeme = getDefMeme();
    let imgUrl = getMemeUrl(currMeme);
    // Load the IMAGE befor rest of the render.
    const img = new Image()
    img.src = imgUrl;
    img.onload = drawImg(img);
    let txt = getText();
    document.querySelector('input[name="input-txt"]').value = txt;
    drawTextLine(currMeme.lines[0]);
}

function onCloseModal() {
    document.querySelector('.meme-editor-modal').style.display = 'none';
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