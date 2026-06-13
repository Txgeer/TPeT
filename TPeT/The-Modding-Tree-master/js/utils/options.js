/// ************ Options ************

let options = {}

function getStartOptions() {
    return {
        autosave: true,
        msDisplay: "always",
        theme: "default",
        hqTree: false,
        offlineProd: true,
        hideChallenges: false,
        showStory: true,
        forceOneTab: false,
        oldStyle: false,
        musicEnabled: true,
        milestonePopup: true,
        enableZoom: true,
        textSelect: true
    }
}

function applyZoomSetting() {
    const viewport = document.getElementById('viewportMeta');
    if (!viewport) return;
    if (window.options.enableZoom) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
}

function toggleOpt(name) {
    if (name == "oldStyle" && styleCooldown > 0)
        return;

    window.options[name] = !window.options[name];
    if (name == "hqTree")
        changeTreeQuality();
    if (name == "oldStyle")
        updateStyle();
    save(); // 添加保存，确保设置持久化
}

var styleCooldown = 0;
function updateStyle() {
    styleCooldown = 1;
    let css = document.getElementById("styleStuff");
    css.href = window.options.oldStyle ? "oldStyle.css" : "style.css";
    needCanvasUpdate = true;
}

function changeTreeQuality() {
    var on = window.options.hqTree;
    document.body.style.setProperty('--hqProperty1', on ? "2px solid" : "4px solid");
    document.body.style.setProperty('--hqProperty2a', on ? "-4px -4px 4px rgba(0, 0, 0, 0.25) inset" : "-4px -4px 4px rgba(0, 0, 0, 0) inset");
    document.body.style.setProperty('--hqProperty2b', on ? "0px 0px 20px var(--background)" : "");
    document.body.style.setProperty('--hqProperty3', on ? "2px 2px 4px rgba(0, 0, 0, 0.25)" : "none");
}

function toggleAuto(toggle) {
    player[toggle[0]][toggle[1]] = !player[toggle[0]][toggle[1]];
    needCanvasUpdate = true;
}

const MS_DISPLAYS = ["所有", "上一个, 自动, 未完成", "自动, 未完成", "未完成", "无"];
const MS_SETTINGS = ["always", "last", "automation", "incomplete", "never"];

function adjustMSDisp() {
    let idx = MS_SETTINGS.indexOf(window.options.msDisplay);
    window.options.msDisplay = MS_SETTINGS[(idx + 1) % 5];
}

function milestoneShown(layer, id) {
    let complete = player[layer].milestones.includes(id);
    let auto = layers[layer].milestones[id].toggles;

    switch (window.options.msDisplay) {
        case "always":
            return true;
        case "last":
            return (auto) || !complete || player[layer].lastMilestone === id;
        case "automation":
            return (auto) || !complete;
        case "incomplete":
            return !complete;
        case "never":
            return false;
        default:
            return false;
    }
}

function toggleZoom() {
    window.options.enableZoom = !window.options.enableZoom;
    const viewport = document.getElementById('viewportMeta');
    if (viewport) {
        if (window.options.enableZoom) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
        } else {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
        }
    }
    save();
}

function toggleTextSelect() {
    window.options.textSelect = !window.options.textSelect;
    applyTextSelectSetting();
    save();
}

function applyTextSelectSetting() {
    if (window.options.textSelect) {
        document.body.classList.remove('disable-text-select');
    } else {
        document.body.classList.add('disable-text-select');
    }
}

