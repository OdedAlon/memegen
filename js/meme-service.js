'use strict';

// var gKeywords = {'happy': 12,'funny puk': 1};
var gImgs = [
    {id: 1, url: 'img/1.jpg', keywords: ['happy']},
    {id: 2, url: 'img/2.jpg', keywords: ['happy', 'dog']},
    {id: 3, url: 'img/3.jpg', keywords: ['happy', 'dog']},
    ]; 
var gMeme = { 
    selectedImgId: 1, 
    selectedLineIdx: 0, 
    lines: [ { 
        txt: 'I LOVE Tora!', 
        size: 50,  
        color: 'white',
        stroke: 'black',
        pos: {x: 250, y: 50},
        isDragging: false
    } ] };
var gMemes = loadFromStorage('memes');
var gMemesAsPNG  = loadFromStorage('memesAsPNG');

function getDefMeme() {
    return gMeme;
}

function setCurrMeme(CurrMeme) {
    gMeme = CurrMeme;
}

function getCurrMemeLines() {
    return  gMeme.lines;
}

function getImgs() {
    return gImgs;
}

function getSearchedImgs(val) {
    let imgs = gImgs.filter(img => {
        return img.keywords.includes(val);
    })
    return imgs;
}

function setImgOfDefMeme(imgId) {
    gMeme.selectedImgId = imgId;
}

function setSizeChange(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = size;
}

function setMoveUpDownRow(currY) {
    gMeme.lines[gMeme.selectedLineIdx].pos.y = currY;
}

function setMoveSidesRow(currX) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x = currX;
}

function setFillColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function getImgById(imgId) {
    let img = gImgs.find(img => {
        return img.id === imgId;
    });
    return img;
}

function getMemeUrl(meme) {
    let img = getImgById(meme.selectedImgId)
    return img.url;
}

function setTextChange(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function addLine(currY) {
    let line = {
        txt: 'I LOVE Tora!', 
        size: 50, 
        align: 'center', 
        color: 'white',
        pos: {x: 250, y: currY},
        isDragging: false   
    };
    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function switchLine() {
    if (gMeme.selectedLineIdx < gMeme.lines.length - 1) gMeme.selectedLineIdx++;
    else gMeme.selectedLineIdx = 0;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    switchLine();
}

function resetgCurrMeme() {
    gMeme = { 
        selectedImgId: 1, 
        selectedLineIdx: 0, 
        lines: [ { 
            txt: 'I LOVE Tora!', 
            size: 50, 
            align: 'center', 
            color: 'white',
            pos: {x: 250, y: 50} 
        } ] };
}

function saveMeme(memePngUrl) {
    let memes = loadFromStorage('memes');
    if (!memes) memes = [];
    memes.push(gMeme);
    gMemes = memes;
    console.log(gMemes);
    saveToStorage('memes', gMemes);
    // From here - saves the url.
    let memesAsPNG = loadFromStorage('memesAsPNG');
    if (!memesAsPNG) memesAsPNG = [];
    memesAsPNG.push(memePngUrl);
    gMemesAsPNG = memesAsPNG; 
    console.log(gMemesAsPNG);
    saveToStorage('memesAsPNG', gMemesAsPNG);
}

function getMemesAsPNG() {
    if (!gMemesAsPNG) gMemesAsPNG = [];
    return gMemesAsPNG;
}

function getMemeById(memeId) {
    return gMemes[memeId];
}

function setSavedMemeEditMode(memeId) {
    saveToStorage('savedMemeEditMode', memeId);
}

function resetSavedMemeEditMode() {
    saveToStorage('savedMemeEditMode', '');
}

function removeMeme(memeId) {
    gMemes.splice(memeId, 1);
    gMemesAsPNG.splice(memeId, 1);
    saveToStorage('memes', gMemes);
    saveToStorage('memesAsPNG', gMemesAsPNG);
}

function setgMemeImgIdForUploadImg() {
    gMeme.selectedImgId = -1;
}