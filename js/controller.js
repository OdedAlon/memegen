'use strict';

var gElCanvas;
var gCtx;

var gSavedMemeLoad;

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas');
    gCtx = gElCanvas.getContext('2d')
    renderGallery();
    if (gSavedMemeLoad) toggleModal();
    // window.addEventListener('resize', function(){
    //     resizeCanvas();
    // });
    // document.querySelector('.meme-editor-modal').style.display = 'none';
}

function renderGallery() {
    let imgs = getImgs();
    let strHtmls = imgs.map(img => {
        return `<img src=${img.url} onclick="onOpenModal(${img.id})" />`
    });
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('');
}

function onOpenModal(imgId) {
    toggleModal();
    // document.querySelector('.meme-editor-modal').style.display = 'grid';
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
    // document.querySelector('.meme-editor-modal').style.display = 'none';
    resetCurrMeme();
    toggleModal();
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

// function resizeCanvas() {
//     var elContainer = document.querySelector('.canvas-container');
//     gElCanvas.width = elContainer.offsetWidth;
//     gElCanvas.height = elContainer.offsetHeight;
// }

function toggleModal() {
    document.body.classList.toggle('modal-open');
}

// TODO: Add a modal that saies it saved;
function onSaveMeme() {
    saveMeme(gElCanvas.toDataURL());
}

function onMemesInit() {
    renderMemes();
}

// TODO: Change from id to data;
function renderMemes() {
    let memesAsPNG = getMemesAsPNG();
    let strHtml = '';
    for (let i = 0; i < memesAsPNG.length; i++) {
        strHtml += `<canvas class="saved-meme-canvas" id="${i}" height="500" width="500" 
        onclick="onOpenSavedMemesModal(${i})"></canvas>`;
    }
    document.querySelector('.memes-container').innerHTML = strHtml;

    // TODO: Replace FOR with REDUCE.
    for (let i = 0; i < memesAsPNG.length; i++) {
        let img = new Image();
        img.onload = () => {
            let elCanvas = document.getElementById(`${i}`);
            let ctx = elCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
        }
        img.src = memesAsPNG[i];
    }

    // memesAsPNG.reduce((acc, meme) => {
    //     acc++;
    //     console.log(acc)
    //     let img = new Image();
    //     img.onload = () => {
    //       let elCanvas = document.getElementById(`${acc}`);
    //       let ctx = elCanvas.getContext('2d');
    //       ctx.drawImage(img, 0, 0);
    //     }
    //     img.src = meme;
    //     // acc++;
    // }, 0)  
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
}

function onOpenSavedMemesModal(memeId) {
    toggleSavedMemesModal();
    let memesAsPNG = getMemesAsPNG();
    let img = new Image();
    img.onload = () => {
        let elCanvas = document.querySelector('.saved-memes-modal-canvas');
        let ctx = elCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }
    img.src = memesAsPNG[memeId];
    let strHtml = `
        <button onclick="onOpenMemeInEditor(${memeId})">Open in Editor</button>
        <button onclick="">Download</button>
        <button onclick="">Share</button>
        <button onclick="">Delete</button>`
    document.querySelector('.buttons-container').innerHTML = strHtml;
}

function toggleSavedMemesModal() {
    document.body.classList.toggle('saved-memes-modal-open');
}

function onOpenMemeInEditor(memeId) {
    // document.body.onload = () => {
    //     console.log('o')
    //     toggleModal();
    //     renderModalForSavedMeme(memeId);
    // }
    gSavedMemeLoad = true;
    window.location.assign('index.html');
}

function renderModalForSavedMeme(memeId) {
    let currMeme = getMemeById(memeId);
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