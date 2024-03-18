/* --- Scripts Notifications --- */
import loadComponentsByIdChat from '../../layout/loadComponentsByIdChat.js';

/* --- Scripts Notifications --- */
document.addEventListener("DOMContentLoaded", async function() {
    
    await loadComponentsByIdChat();
    loadScript(['./../scriptsCommon.js', './notifications-task.js', './notifications-module.js']);

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
/* --- Scripts Notifications --- */