'use strict';


function onMemesInit() {
    renderMemes();
}

// TODO: Change from id to data;
function renderMemes() {
    let memes = getMemes();
    let strHtml = '';
    for (let i = 0; i < memes.length; i++) {
        strHtml += `<canvas class="saved-meme-canvas" id="${i}" height="500" width="500" 
        onclick="onOpenSavedMemesModal(${i})"></canvas>`;
    }
    document.querySelector('.memes-container').innerHTML = strHtml;

    // TODO: Replace FOR with REDUCE. or for meme in memes
    for (let i = 0; i < memes.length; i++) {
        let img = new Image();
        img.onload = () => {
            let elCanvas = document.getElementById(`${i}`);
            let ctx = elCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
        }
        img.src = memes[i].memeAsPng;
    }
}

function toggleSavedMemesModal() {
    document.body.classList.toggle('saved-memes-modal-open');
}

function onOpenSavedMemesModal(memeId) {
    toggleSavedMemesModal();
    let memes = getMemes();
    let img = new Image();
    img.src = memes[memeId].imgUrl;
    console.log(memes[memeId].imgUrl)
    img.onload = () => {
        let elCanvas = document.querySelector('.saved-memes-modal-canvas');
        let ctx = elCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }
    
    let strHtml = `
        <button class="btn-edit" onclick="onOpenMemeInEditor(${memeId})"></button>
        <a class="download-link" href="#" onclick="onDownloadSavedCanvas(this)" download=""></a>
        <form action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
            <input name="img" id="imgData" type="hidden" />
            <button class="btn btn-share" type="submit"></button>
        </form>
        <button class="btn-remove" onclick="onRemoveMeme(${memeId})"></button>`
    document.querySelector('.buttons-container').innerHTML = strHtml;
}

function onOpenMemeInEditor(memeId) {
    saveEditedMeme(memeId);
    window.location.assign('index.html');
}

function onDownloadSavedCanvas(elLink) {
    let elCanvas = document.querySelector('.saved-memes-modal-canvas');
    const data = elCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-canvas.jpg';
}

function onRemoveMeme(memeId) {
    removeMeme(memeId);
    toggleSavedMemesModal();
    renderMemes();
}
