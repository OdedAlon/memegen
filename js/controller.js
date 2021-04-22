'use strict';

var gElCanvas;
var gCtx;
var gDraggedLine;
var gStartPos;
var gLineMarkerColor = { fill: 'rgb(210, 210, 210, .7)', stroke: 'black' };
var gImg;

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
    } else {
        // Set the x position in center, in accordance to window's width
        let currPosX;
        if (window.innerWidth < 620) currPosX = 125;
        else if (window.innerWidth < 1010) currPosX = 200;
        else currPosX = 250;
        setMemePosX(currPosX);
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

function onSearchInput() {
    let val = document.querySelector('.input-search').value;
    let imgs = getSearchedImgs(val);
    if (!imgs.length) renderGallery();
    else {
        let strHtmls = imgs.map(img => {
            return `<img src=${img.url} onclick="onOpenModal(${img.id})" />`
        });
        document.querySelector('.gallery-container').innerHTML = strHtmls.join('');
    }
}

function onOpenModal(imgId) {
    toggleModal();
    setImgOfDefMeme(imgId);
    renderModal();
}

function renderModal() {
    if (gMemeId === -1) {
        gCurrMeme = getDefMeme();
        setgMemeImgIdForUploadImg();
        var imgUrl = gImg.src;
    } else {
        if (!gMemeId && gMemeId !== 0) {
            gCurrMeme = getDefMeme();
        }
        else {
            gCurrMeme = getMemeById(gMemeId);
            setCurrMeme(gCurrMeme);
        }
        var imgUrl = getMemeUrl(gCurrMeme);
    }
    const img = new Image()
    img.src = imgUrl;
    gElCanvas.height = img.height;
    gElCanvas.width = img.width;
    resizeCanvas(img)
    img.onload = drawMeme(img);
}

function resizeCanvas(img) {
    let canvasSize;
    if (window.innerWidth < 620) canvasSize = 250;
    else if (window.innerWidth < 1010) canvasSize = 400;
    else canvasSize = 500;
    if (img.height > canvasSize || img.width > canvasSize) {
        let imgProportion = img.height / img.width;
        if (imgProportion < 1) {
            gElCanvas.height = canvasSize * imgProportion;
            gElCanvas.width = canvasSize;
        } else {
            gElCanvas.height = canvasSize;
            gElCanvas.width = canvasSize / imgProportion;
        }
    }
}

function drawMeme(img) {
    drawImg(img);
    drawLineFrame();
    let txt = gCurrMeme.lines[gMeme.selectedLineIdx].txt;
    document.querySelector('input[name="input-txt"]').value = txt;
    gCurrMeme.lines.forEach(line => {
        drawTextLine(line);
    })
}

function drawImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}

function drawLineFrame() {
    let currY = gCurrMeme.lines[gMeme.selectedLineIdx].pos.y;
    let size = gCurrMeme.lines[gMeme.selectedLineIdx].size;
    let frameWidth = gElCanvas.width - 20;
    gCtx.beginPath();
    gCtx.rect(10, currY - size, frameWidth, 1.2 * size);
    gCtx.fillStyle = gLineMarkerColor.fill;
    gCtx.fillRect(10, currY - size, frameWidth, 1.2 * size);
    gCtx.strokeStyle = gLineMarkerColor.stroke;
    gCtx.stroke();
    gCtx.strokeStyle = 'black';
}

function drawTextLine(line) {
    gCtx.font = `${line.size}px impact`;
    gCtx.fillStyle = `${line.color}`;
    gCtx.textAlign = 'center';
    gCtx.strokeStyle = `${line.stroke}`;
    gCtx.fillText(`${line.txt}`, `${line.pos.x}`, `${line.pos.y}`);
    gCtx.strokeText(`${line.txt}`, `${line.pos.x}`, `${line.pos.y}`);
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

function onMoveUpDownRow(change) {
    let currY = gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.y += change;
    setMoveUpDownRow(currY);
    renderModal();
}

function onMoveSidesRow(change) {
    let currX = gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x += change;
    setMoveSidesRow(currX);
    renderModal();
}

function onChangefillColor(color) {
    setFillColor(color);
    renderModal();
}

function onChangeStrokeColor(color) {
    setStrokeColor(color);
    renderModal();
}

function onCloseModal() {
    let currPosX;
    if (window.innerWidth < 620) currPosX = 125;
    else if (window.innerWidth < 1010) currPosX = 200;
    else currPosX = 250;
    resetCurrMeme(currPosX);
    // TODO: Maybe change the name to reset-gMemeId
    resetSavedMemeEditMode()
    gImg = '';
    gMemeId = '';
    toggleModal();
}

function onTextChange() {
    var elTxt = document.querySelector('input[name="input-txt"]').value;
    setTextChange(elTxt);
    renderModal();
}

function onUploadImg() {

}

function toggleModal() {
    document.body.classList.toggle('modal-open');
}

// TODO: Add a modal that saies it saved;
function onSaveMeme() {
    gLineMarkerColor = { fill: 'rgb(0, 0, 0, .0', stroke: 'rgb(0, 0, 0, .0' };
    renderModal();
    saveMeme(gElCanvas.toDataURL());
    gLineMarkerColor = { fill: 'rgb(210, 210, 210, .7)', stroke: 'black' };
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
}

function onDownloadCanvas(elLink) {
    gLineMarkerColor = { fill: 'rgb(0, 0, 0, .0', stroke: 'rgb(0, 0, 0, .0' };
    renderModal();
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
    gLineMarkerColor = { fill: 'rgb(210, 210, 210, .7)', stroke: 'black' };
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
        <button class="btn-edit" onclick="onOpenMemeInEditor(${gMemeId})"></button>
        <a class="download-link" href="#" onclick="onDownloadSavedCanvas(this)" download=""></a>
        <form action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
            <input name="img" id="imgData" type="hidden" />
            <button class="btn btn-share" type="submit"></button>
        </form>
        <button class="btn-remove" onclick="onRemoveMeme(${gMemeId})"></button>`
    document.querySelector('.buttons-container').innerHTML = strHtml;
}

function toggleSavedMemesModal() {
    document.body.classList.toggle('saved-memes-modal-open');
}

function onOpenMemeInEditor(gMemeId) {
    setSavedMemeEditMode(gMemeId);
    window.location.assign('index.html');
}

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

//                                    **** upload-image ****

// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    toggleModal();
    gMemeId = -1;
    loadImageFromInput(ev, renderImg);
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = '';
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
        gImg = img
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    renderModal();
}