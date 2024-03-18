import loadComponentsById from '../../layout/loadComponentsById.js';

/* --- Scripts GitGame --- */
document.addEventListener("DOMContentLoaded", async function() {
    
    await loadComponentsById();
    loadScript(['./../scriptsCommon.js', './gitgame-task.js']);

});

function loadScript(_jsFiles) {
    
    _jsFiles.forEach(file => {
        var nuevoScript = document.createElement('script');
        nuevoScript.src = file;
        if (file.includes("module")) {
            scriptElement.type = 'module';
        }
        
        document.body.appendChild(nuevoScript);
    });
    
}
/* --- Scripts GitGame --- */