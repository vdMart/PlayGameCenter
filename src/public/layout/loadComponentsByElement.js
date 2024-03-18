// Función para cargar los componentes de la página
export default async function loadComponentsByElement() {
    // Cargar y insertar el contenido del archivo header.html en la etiqueta header
    await loadAndInsertContent('../../components/header.html', 'header');
    await getStylesCSS('../../components/header.html');
    await getScriptJS('../../components/header.html');

    // Cargar y insertar el contenido del archivo menu.html en la etiqueta nav
    await loadAndInsertContent('../../components/menu.html', 'nav');
    await getStylesCSS('../../components/menu.html');
    await getScriptJS('../../components/menu.html');

    // Cargar y insertar el contenido del archivo footer.html en la etiqueta footer
    await loadAndInsertContent('../../components/footer.html', 'footer');
    await getStylesCSS('../../components/footer.html');
    await getScriptJS('../../components/footer.html');

}





// Función para cargar el contenido de un archivo HTML y actualizar el ID específico
function loadAndInsertContent(file, targetElement) {
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
    
            const componentContent = tempDiv.querySelector(targetElement);
    
            if (componentContent) {
                const currentContent = document.querySelector(targetElement);
                currentContent.innerHTML = componentContent.innerHTML;
                resolve();
            } else {
                reject('La etiqueta no fue encontrada en ' + file + '.');
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
        
        document.head.appendChild(scriptElement);
    });
}











