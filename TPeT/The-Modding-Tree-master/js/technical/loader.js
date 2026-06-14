// Load files
const modFiles = modInfo.modFiles;
let loadedCount = 0;

function startLoadingModFiles() {
    for (let i = 0; i < modFiles.length; i++) {
        const script = document.createElement('script');
        script.src = 'js/' + modFiles[i];
        script.async = false;
        script.onload = function() {
            loadedCount++;
            tryStartGame();
        };
        script.onerror = function() {
            console.error(`Failed to load ${modFiles[i]}`);
            loadedCount++;
            tryStartGame();
        };
        document.head.appendChild(script);
    }

    setTimeout(() => {
        if (loadedCount < modFiles.length) {
            console.warn('Forcing game start after timeout');
            tryStartGame();
        }
    }, 5000);
}

function tryStartGame() {
    if (loadedCount === modFiles.length) {
    }
}

if (typeof Vue === 'undefined') {
    var vueScript = document.createElement('script');
    vueScript.src = 'js/vue.global.js';
    vueScript.async = false;
    document.head.appendChild(vueScript);
    vueScript.onload = function() {
        console.log('Vue loaded successfully');
        startLoadingModFiles();
    };
    vueScript.onerror = function() {
        console.error('Failed to load local Vue. Please check the file path js/vue.global.js');
        startLoadingModFiles();
    };
} else {
    startLoadingModFiles();
}