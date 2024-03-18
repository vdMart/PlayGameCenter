import loadComponentsById from '../../layout/loadComponentsById.js';

/* --- Scripts Profile --- */
document.addEventListener("DOMContentLoaded", async function() {
    
    await loadComponentsById();
    loadScript(['./../scriptsCommon.js', './profile-task.js', './profile-module.js']);

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
/* --- Scripts Profile --- */