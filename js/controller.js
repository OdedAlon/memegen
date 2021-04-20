'use strict';

var gElCanvas;
var gCtx;
var gDraggedLine;
var gStartPos;
var gLineMarkerColor = {fill: 'rgb(210, 210, 210, .7)', stroke: 'black'};

// TODO: Check if necessery as a global - gCurrMeme & gMemeId.
var gCurrMeme;
var gMemeId;

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas');
    gCtx = gElCanvas.getContext('2d')
    renderGallery();
    gMemeId = loadFromStorage('savedMemeEditMode');
    if (gMemeId || gMemeId === 0) {
        toggleModal();
        renderModal(gMemeId);
    }
    addListeners();
}

function renderGallery() {
    let imgs = getImgs();
    let strHtmls = imgs.map(img => {
        return `<img src=${img.url} onclick="onOpenModal(${img.id})" />`
    });
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('');
}

function onSearchInput(){
    
}

function onOpenModal(imgId) {
    toggleModal();
    setImgOfDefMeme(imgId);
    renderModal();
}

function renderModal() {
    if (!gMemeId && gMemeId !== 0) gCurrMeme = getDefMeme();
    else {
        gCurrMeme = getMemeById(gMemeId);
        setCurrMeme(gCurrMeme);
    }
    let imgUrl = getMemeUrl(gCurrMeme);
    // Load the IMAGE befor rest of the render.
    const img = new Image()
    console.log(imgUrl)
    img.src = imgUrl;
    console.log(img)
    img.onload = drawImg(img);
    let currY = gCurrMeme.lines[gMeme.selectedLineIdx].pos.y;
    let size = gCurrMeme.lines[gMeme.selectedLineIdx].size;
    gCtx.beginPath();
    gCtx.rect(20, currY - size, 460, 1.2 * size);
    gCtx.fillStyle = gLineMarkerColor.fill;
    gCtx.fillRect(20, currY - size, 460, 1.2 * size);
    gCtx.strokeStyle = gLineMarkerColor.stroke;
    gCtx.stroke();
    gCtx.strokeStyle = 'black';
    let txt = gCurrMeme.lines[gMeme.selectedLineIdx].txt;
    document.querySelector('input[name="input-txt"]').value = txt;
    gCurrMeme.lines.forEach(line => {
        drawTextLine(line);
    })
}

function onAddLine() {
    let lines = gCurrMeme.lines;
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
    let size = gCurrMeme.lines[gCurrMeme.selectedLineIdx].size += change;
    setSizeChange(size);
    renderModal();
}

function onChangeUpDownRow(change) {
    let currY = gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.y += change;
    setUpDownChange(currY);
    renderModal();
}

function onCloseModal() {
    resetgCurrMeme();
    // TODO: Maybe change the name to reset-gMemeId
    resetSavedMemeEditMode()
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
    gLineMarkerColor = {fill: 'rgb(0, 0, 0, .0', stroke: 'rgb(0, 0, 0, .0'};
    renderModal();
    saveMeme(gElCanvas.toDataURL());
    gLineMarkerColor = {fill: 'rgb(210, 210, 210, .7)', stroke: 'black'};
    renderModal();
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

function onDownloadCanvas(elLink) {
    gLineMarkerColor = {fill: 'rgb(0, 0, 0, .0', stroke: 'rgb(0, 0, 0, .0'};
    renderModal();
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
    gLineMarkerColor = {fill: 'rgb(210, 210, 210, .7)', stroke: 'black'};
    renderModal();
}

function onOpenSavedMemesModal(gMemeId) {
    toggleSavedMemesModal();
    let memesAsPNG = getMemesAsPNG();
    let img = new Image();
    img.onload = () => {
        let elCanvas = document.querySelector('.saved-memes-modal-canvas');
        let ctx = elCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }
    img.src = memesAsPNG[gMemeId];
    let strHtml = `
        <button onclick="onOpenMemeInEditor(${gMemeId})">Open in Editor</button>
        <a class="download-link" href="#" onclick="onDownloadSavedCanvas(this)" download="">Download</a>
        <button onclick="">Share</button>
        <button onclick="onRemoveMeme(${gMemeId})">Delete</button>`
    document.querySelector('.buttons-container').innerHTML = strHtml;
}

function toggleSavedMemesModal() {
    document.body.classList.toggle('saved-memes-modal-open');
}

function onOpenMemeInEditor(gMemeId) {
    setSavedMemeEditMode(gMemeId);
    window.location.assign('index.html');
}

// function renderModalForSavedMeme(gMemeId) {
//     resetSavedMemeEditMode();
//     let gCurrMeme = getMemeById(gMemeId);
//     let imgUrl = getMemeUrl(gCurrMeme);
    
//     // Load the IMAGE befor rest of the render.
//     const img = new Image()
//     img.src = imgUrl;
//     console.log(imgUrl)
//     img.onload = drawImg(img);
//     let currY = currMeme.lines[gMeme.selectedLineIdx].pos.y;
//     let size = currMeme.lines[gMeme.selectedLineIdx].size;
//     gCtx.beginPath();
//     gCtx.rect(20, currY - size, 460, 1.2 * size);
//     gCtx.fillStyle = 'rgb(210, 210, 210, .7)';
//     gCtx.fillRect(20, currY - size, 460, 1.2 * size);
//     gCtx.strokeStyle = 'black';
//     gCtx.stroke();
//     let txt = currMeme.lines[gMeme.selectedLineIdx].txt;
//     document.querySelector('input[name="input-txt"]').value = txt;
//     currMeme.lines.forEach(line => {
//         drawTextLine(line);
//     })
// }

function onDownloadSavedCanvas(elLink) {
    let elCanvas = document.querySelector('.saved-memes-modal-canvas');
    const data = elCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
}

function onRemoveMeme(gMemeId) {
    removeMeme(gMemeId);
    toggleSavedMemesModal();
    renderMemes();
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

//                                    **** touch-events ****


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
    return pos;
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

function onDown(ev) {
    const pos = getEvPos(ev);    
    gDraggedLine = getlineClicked(pos) 
    if (!gDraggedLine) return;
    gDraggedLine.isDragging = true;
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    if (gDraggedLine.isDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        gDraggedLine.pos.x += dx;
        gDraggedLine.pos.y += dy;
        gStartPos = pos;
        renderModal();
    }
}

function onUp() {
    gDraggedLine.isDragging = false;
    document.body.style.cursor = 'grab';
}