// ************ Themes ************
var themes = ["default", "aqua"];

var colors = {
    default: {
        1: "#ffffff",
        2: "#bfbfbf",
        3: "#7f7f7f",
        color: "#dfdfdf",
        points: "#ffffff",
        locked: "#bf8f8f",
        background: "linear-gradient(135deg, #000000 0%, #003f3f 100%)",
        background_tooltip: "rgba(0, 0, 0, 0.75)",
    },
    aqua: {
        1: "#bfdfff",
        2: "#8fa7bf",
        3: "#5f6f7f",
        color: "#bfdfff",
        points: "#dfefff",
        locked: "#c4a7b3",
        background: "linear-gradient(135deg, #001f3f 0%, #003f3f 100%)",
        background_tooltip: "rgba(0, 15, 31, 0.75)",
    },
    darkneon: {
        1: "#00ff88",
        2: "#00cc66",
        3: "#009944",
        color: "#00ff88",
        points: "#ffffff",
        locked: "#996666",
        background: "linear-gradient(135deg, #0a001a, #1a0033)",
        background_tooltip: "rgba(10, 0, 26, 0.9)",
    }
};

function changeTheme() {
    if (!options && !window.options) return;
    let colors_theme = colors[(options || window.options).theme || "default"];
    window.colors_theme = colors_theme;
    document.body.style.setProperty('--background', colors_theme["background"]);
    document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
    document.body.style.setProperty('--color', colors_theme["color"]);
    document.body.style.setProperty('--points', colors_theme["points"]);
    document.body.style.setProperty("--locked", colors_theme["locked"]);
}

function getThemeName() {
    return options.theme ? options.theme : "default";
}

function switchTheme() {
    let index = themes.indexOf(options.theme);
    if (index === -1) {
        options.theme = themes[0];
    } else {
        let nextIndex = (index + 1) % themes.length;
        options.theme = themes[nextIndex];
    }

    document.body.classList.add('theme-transition');
    changeTheme();

    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);

    resizeCanvas();
}