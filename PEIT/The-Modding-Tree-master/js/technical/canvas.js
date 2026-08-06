var canvas;
var ctx;
var colors_theme;

let animFrameId = null;
let animationEnabled = true;

window.addEventListener("resize", (_=>resizeCanvas()));

function retrieveCanvasData() {
	let treeCanv = document.getElementById("treeCanvas")
	let treeTab = document.getElementById("treeTab")
	if (treeCanv===undefined||treeCanv===null) return false;
	canvas = treeCanv;
	ctx = canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
	if (!retrieveCanvasData()) return
	canvas.width = 0;
    canvas.height = 0;
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	if (!animFrameId) startTreeAnimation();
}

function startTreeAnimation() {
	if (animFrameId) return;
	function drawLoop(timestamp) {
		drawTree(timestamp);
		animFrameId = requestAnimationFrame(drawLoop);
	}
	drawLoop(performance.now());
}

function stopTreeAnimation() {
	if (animFrameId) {
		cancelAnimationFrame(animFrameId);
		animFrameId = null;
	}
}

function drawTree(time) {
    if (!colors_theme || typeof colors_theme !== 'object') {
        if (typeof changeTheme === 'function') {
            changeTheme();
        } else {
            colors_theme = { 1: "#ffffff", 2: "#bfbfbf", 3: "#7f7f7f" };
        }
    }
    if (!retrieveCanvasData()) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (layer in layers) {
        if (!tmp[layer] || tmp[layer].layerShown === undefined) continue;
        if (tmp[layer].layerShown == true && tmp[layer].branches) {
            for (branch in tmp[layer].branches) {
                drawTreeBranch(layer, tmp[layer].branches[branch], "", time);
            }
        }
        drawComponentBranches(layer, tmp[layer].upgrades, "upgrade-", time);
        drawComponentBranches(layer, tmp[layer].buyables, "buyable-", time);
        drawComponentBranches(layer, tmp[layer].clickables, "clickable-", time);
    }
}

function drawComponentBranches(layer, data, prefix, time) {
    if (!data) return;
    for (id in data) {
        if (data[id] && data[id].branches) {
            for (branch in data[id].branches) {
                drawTreeBranch(id, data[id].branches[branch], prefix + layer + "-", time);
            }
        }
    }
}

function drawTreeBranch(num1, data, prefix, time) {
	let num2 = data
	let color_id = 1
	let width = 15
	if (Array.isArray(data)){
		num2 = data[0]
		color_id = data[1]
		width = data[2] || width
	}

	if(typeof(color_id) == "number")
		color_id = colors_theme[color_id]
	if (prefix) {
		num1 = prefix + num1
		num2 = prefix + num2
	}
	if (document.getElementById(num1) == null || document.getElementById(num2) == null)
		return

	let start = document.getElementById(num1).getBoundingClientRect();
    let end = document.getElementById(num2).getBoundingClientRect();
    let x1 = start.left + (start.width / 2) + document.body.scrollLeft;
    let y1 = start.top + (start.height / 2) + document.body.scrollTop;
    let x2 = end.left + (end.width / 2) + document.body.scrollLeft;
    let y2 = end.top + (end.height / 2) + document.body.scrollTop;

    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.strokeStyle = color_id;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
// === 动态光点（仅当高质量树贴图开启） ===
if (time && animationEnabled && window.options.hqTree) {
let startY = y1, endY = y2, startX = x1, endX = x2;
if (startY < endY) {
    startY = y2; endY = y1;
    startX = x2; endX = x1;
}
let period = 2000;
let hash = 0;
for (let i = 0; i < num1.length; i++) {
    hash = (hash << 5) - hash + num1.charCodeAt(i);
    hash |= 0;
}
let phase = (hash % 1000) / 1000;
let rawProgress = ((time / period) + phase) % 1;
let progress = rawProgress;

let opacity = 1;
if (progress < 0.1) opacity = progress / 0.1;
if (progress > 0.9) opacity = 1 - (progress - 0.9) / 0.1;

let x = startX + (endX - startX) * progress;
let y = startY + (endY - startY) * progress;

ctx.save();
ctx.globalAlpha = opacity;
ctx.shadowColor = color_id;
ctx.shadowBlur = 20;
ctx.beginPath();
ctx.arc(x, y, 6, 0, Math.PI * 2);
ctx.fillStyle = "#ffffff";
ctx.fill();
ctx.shadowBlur = 5;
ctx.beginPath();
ctx.arc(x, y, 3, 0, Math.PI * 2);
ctx.fillStyle = "#ffffff";
ctx.fill();
ctx.restore();
    }
}