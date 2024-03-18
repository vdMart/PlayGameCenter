// Función para cargar los componentes de la página
export default async function loadComponentsByIdChat(foldersBack = "../../") {
    // Cargar y insertar el contenido del archivo header.html en la etiqueta header
    await loadAndInsertContent(foldersBack + 'components/header/header.html', 'header-component');
    await getStylesCSS(foldersBack + 'components/header/header.html');
    await getScriptJS(foldersBack + 'components/header/header.html');

    // Cargar y insertar el contenido del archivo menu.html en la etiqueta nav
    await loadAndInsertContent(foldersBack + 'components/menu/menu.html', 'nav-component');
    await getStylesCSS(foldersBack + 'components/menu/menu.html');
    await getScriptJS(foldersBack + 'components/menu/menu.html');

    // Cargar y insertar el contenido del archivo footer.html en la etiqueta footer
    await loadAndInsertContent(foldersBack + 'components/footer/footer.html', 'footer-component');
    await getStylesCSS(foldersBack + 'components/footer/footer.html');
    await getScriptJS(foldersBack + 'components/footer/footer.html');

    // Cargar y insertar el contenido del archivo modal.html en la etiqueta modal
    await loadAndInsertContent(foldersBack + 'components/modal/modal.html', 'modal-component');
    await getStylesCSS(foldersBack + 'components/modal/modal.html');
    await getScriptJS(foldersBack + 'components/modal/modal.html');

    // Cargar y insertar el contenido del archivo chat.html en la etiqueta chat
    await loadAndInsertContent(foldersBack + 'components/chat/chat.html', 'chat-component');
    await getStylesCSS(foldersBack + 'components/chat/chat.html');
    await getScriptJS(foldersBack + 'components/chat/chat.html');

}





// Función para cargar el contenido de un archivo HTML y actualizar la etiqueta específica
function loadAndInsertContent(file, targetElementId) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = file;
    
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const html = await response.text();
    
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
    
            // Usa querySelector con el ID directamente
            const componentContent = tempDiv.querySelector(`#${targetElementId}`);
    
            if (componentContent) {
                const currentContent = document.getElementById(targetElementId);
                currentContent.innerHTML = componentContent.innerHTML;
                resolve();
            } else {
                reject(`El elemento con ID ${targetElementId} no fue encontrado en ${file}.`);
            }
        } catch (error) {
            console.error('Hubo un problema con la solicitud fetch:', error);
            reject(error);
        }
    });
}   





//Obtener los estilos CSS de un componente e introducirlo en el documento
function getStylesCSS(fileHTML) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = fileHTML;
    
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const html = await response.text();
    
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
    
            const styleLinks = tempDiv.querySelectorAll('link[rel="stylesheet"]');
            const cssFiles = [];
            const styleLinksArray = Array.from(styleLinks);
    
            styleLinksArray.forEach(link => {
                const cssFile = link.getAttribute('href');
                cssFiles.push(cssFile);
            });
    
            await insertStyles(fileHTML, cssFiles);
            resolve(cssFiles);
        } catch (error) {
            console.error('Hubo un problema con la solicitud fetch:', error);
            reject(error);
        }
    });
}

function insertStyles(_fileHTML, _filesCSS) {
    const transformedFiles = _filesCSS.map(file => `${_fileHTML.replace(/\/[^/]+\.html$/, '/')}./${file}`);
    
    transformedFiles.forEach(file => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = file;

        document.head.appendChild(linkElement);
    });
}





//Obtener los scripts JS de un componente e introducirlo en el documento
function getScriptJS(fileHTML) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = fileHTML;
    
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const html = await response.text();
    
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
    
            const scriptLinks = tempDiv.querySelectorAll('script');
            const jsFiles = [];
            const scriptLinksArray = Array.from(scriptLinks);
    
            scriptLinksArray.forEach(link => {
                const jsFile = link.getAttribute('src');
                jsFiles.push(jsFile);
            });
    
            await insertScripts(fileHTML, jsFiles);
            resolve(jsFiles);
        } catch (error) {
            console.error('Hubo un problema con la solicitud fetch:', error);
            reject(error);
        }
    });
}

function insertScripts(_fileHTML, _jsFiles) {
    
    const transformedFiles = _jsFiles.map(file => `${_fileHTML.replace(/\/[^/]+\.html$/, '/')}./${file}`).filter(function(elemento) {
        return !elemento.endsWith("null");
    });

    transformedFiles.forEach(file => {
        const scriptElement = document.createElement('script');
        scriptElement.src = file;
        if (file.includes("module")) {
            scriptElement.type = 'module';
        }
        
        document.head.appendChild(scriptElement);
    });
}











