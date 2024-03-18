import loadComponentsByIdChat from '../../../layout/loadComponentsByIdChat.js';

/* --- Scripts TicTacToe --- */
document.addEventListener("DOMContentLoaded", async function() {
    
    await loadComponentsByIdChat("../../../");
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('idgame');
    
    if (param) {
        console.log('El parámetro existe y su valor es: ' + param);
        loadScript(['./../../scriptsCommon.js', './tictactoe-module.js']);
    } else {
        console.log('El parámetro no existe');
        loadScript(['./../../scriptsCommon.js', './tictactoe-task.js']);
    }
    

});

function loadScript(_jsFiles) {
    
    _jsFiles.forEach(file => {
        var scriptElement = document.createElement('script');
        scriptElement.src = file;
        if (file.includes("module")) {
            scriptElement.type = 'module';
        }
        
        document.body.appendChild(scriptElement);
    });
    
}
/* --- Scripts TicTacToe --- */