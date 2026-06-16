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
            loadedCount++;
            tryStartGame();
        };
        document.head.appendChild(script);
    }

    setTimeout(() => {
        if (loadedCount < modFiles.length) {
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
        startLoadingModFiles();
    };
    vueScript.onerror = function() {
        startLoadingModFiles();
    };
} else {
    startLoadingModFiles();
}