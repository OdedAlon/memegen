'use strict';

// var gKeywords = {'happy': 12,'funny puk': 1};
var gImgs = [
    {id: 1, url: 'img/1.jpg', keywords: ['happy']},
    {id: 2, url: 'img/2.jpg', keywords: ['happy']},
    {id: 3, url: 'img/3.jpg', keywords: ['happy']},
    ]; 
var gMeme = { 
    selectedImgId: 1, 
    selectedLineIdx: 0, 
    lines: [ { 
        txt: 'I LOVE Tora!', 
        size: 50, 
        align: 'center', 
        color: 'white' 
    } ] };

function getDefMeme() {
    return gMeme;
}

function getImgs() {
    return gImgs;
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

function getText() {
    return gMeme.lines[gMeme.selectedLineIdx].txt;
}

function setTextChange(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}