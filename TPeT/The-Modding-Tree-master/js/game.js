var needCanvasUpdate = true;
var isTogglingMusic = false;

// Don't change this
const TMT_VERSION = {
	tmtNum: "2.7",
	tmtName: "Δ"
}

function getResetGain(layer, useType = null) {
	let type = useType
	if (!useType){ 
		type = tmp[layer].type
		if (layers[layer].getResetGain !== undefined)
			return layers[layer].getResetGain()
	} 
	if(tmp[layer].type == "none")
		return new Decimal (0)
	if (tmp[layer].gainExp.eq(0)) return decimalZero
	if (type=="static") {
		if ((!tmp[layer].canBuyMax) || tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalOne
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).div(tmp[layer].gainMult).max(1).log(tmp[layer].base).times(tmp[layer].gainExp).pow(Decimal.pow(tmp[layer].exponent, -1))
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().sub(player[layer].points).add(1).max(1);
	} else if (type=="normal"){
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)
		if (gain.gte(tmp[layer].softcap)) gain = gain.pow(tmp[layer].softcapPower).times(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower)))
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
	} else if (type=="custom"){
		return layers[layer].getResetGain()
	} else {
		return decimalZero
	}
}

function getNextAt(layer, canMax=false, useType = null) {
	let type = useType
	if (!useType) {
		type = tmp[layer].type
		if (layers[layer].getNextAt !== undefined)
			return layers[layer].getNextAt(canMax)

		}
	if(tmp[layer].type == "none")
		return new Decimal (Infinity)

	if (tmp[layer].gainMult.lte(0)) return new Decimal(Infinity)
	if (tmp[layer].gainExp.lte(0)) return new Decimal(Infinity)

	if (type=="static") 
	{
		if (!tmp[layer].canBuyMax) canMax = false
		let amt = player[layer].points.plus((canMax&&tmp[layer].baseAmount.gte(tmp[layer].nextAt))?tmp[layer].resetGain:0).div(tmp[layer].directMult)
		let extraCost = Decimal.pow(tmp[layer].base, amt.pow(tmp[layer].exponent).div(tmp[layer].gainExp)).times(tmp[layer].gainMult)
		let cost = extraCost.times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) cost = cost.ceil()
		return cost;
	} else if (type=="normal"){
		let next = tmp[layer].resetGain.add(1).div(tmp[layer].directMult)
		if (next.gte(tmp[layer].softcap)) next = next.div(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower))).pow(decimalOne.div(tmp[layer].softcapPower))
		next = next.root(tmp[layer].gainExp).div(tmp[layer].gainMult).root(tmp[layer].exponent).times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) next = next.ceil()
		return next;
	} else if (type=="custom"){
		return layers[layer].getNextAt(canMax)
	} else {
		return decimalZero
	}}

function softcap(value, cap, power = 0.5) {
	if (value.lte(cap)) return value
	else
		return value.pow(power).times(cap.pow(decimalOne.sub(power)))
}

// Return true if the layer should be highlighted. By default checks for upgrades only.
function shouldNotify(layer){
	for (id in tmp[layer].upgrades){
		if (isPlainObject(layers[layer].upgrades[id])){
			if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
				return true
			}
		}
	}
	if (player[layer].activeChallenge && canCompleteChallenge(layer, player[layer].activeChallenge)) {
		return true
	}

	if (tmp[layer].shouldNotify)
		return true

	if (isPlainObject(tmp[layer].tabFormat)) {
		for (subtab in tmp[layer].tabFormat){
			if (subtabShouldNotify(layer, 'mainTabs', subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].tabFormat[subtab].glowColor || defaultGlow

				return true
			}
		}
	}

	for (family in tmp[layer].microtabs) {
		for (subtab in tmp[layer].microtabs[family]){
			if (subtabShouldNotify(layer, family, subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].microtabs[family][subtab].glowColor
				return true
			}
		}
	}
	 
	return false
	
}

function canReset(layer)
{	
	if (layers[layer].canReset!== undefined)
		return run(layers[layer].canReset, layers[layer])
	else if(tmp[layer].type == "normal")
		return tmp[layer].baseAmount.gte(tmp[layer].requires)
	else if(tmp[layer].type== "static")
		return tmp[layer].baseAmount.gte(tmp[layer].nextAt) 
	else 
		return false
}

function rowReset(row, layer) {
	for (lr in ROW_LAYERS[row]){
		if(layers[lr].doReset) {
			if (!isNaN(row)) player[lr].activeChallenge = null; // Exit challenges on any row reset on an equal or higher row
			run(layers[lr].doReset, layers[lr], layer)
		}
		else
			if(tmp[layer].row > tmp[lr].row && !isNaN(row)) layerDataReset(lr)
	}
}

function layerDataReset(layer, keep = []) {
	let storedData = {unlocked: player[layer].unlocked, forceTooltip: player[layer].forceTooltip, noRespecConfirm: player[layer].noRespecConfirm, prevTab:player[layer].prevTab} // Always keep these

	for (thing in keep) {
		if (player[layer][keep[thing]] !== undefined)
			storedData[keep[thing]] = player[layer][keep[thing]]
	}

	player[layer].buyables = getStartBuyables(layer);
    player[layer].clickables = getStartClickables(layer);
    player[layer].challenges = getStartChallenges(layer);
    player[layer].grid = getStartGrid(layer);

	layOver(player[layer], getStartLayerData(layer))
	player[layer].upgrades = []
	player[layer].milestones = []
	player[layer].achievements = []

	for (thing in storedData) {
		player[layer][thing] =storedData[thing]
	}
}



function addPoints(layer, gain) {
	player[layer].points = player[layer].points.add(gain).max(0)
	if (player[layer].best) player[layer].best = player[layer].best.max(player[layer].points)
	if (player[layer].total) player[layer].total = player[layer].total.add(gain)
}

function generatePoints(layer, diff) {
	addPoints(layer, tmp[layer].resetGain.times(diff))
}

function doReset(layer, force=false) {
	if (tmp[layer].type == "none") return
	let row = tmp[layer].row
	if (!force) {
		
		if (tmp[layer].canReset === false) return;
		
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return;
		let gain = tmp[layer].resetGain
		if (tmp[layer].type=="static") {
			if (tmp[layer].baseAmount.lt(tmp[layer].nextAt)) return;
			gain =(tmp[layer].canBuyMax ? gain : 1)
		}

		if (layers[layer].onPrestige){
			updateMilestones(layer)
			run(layers[layer].onPrestige, layers[layer], gain)
		}
		
		addPoints(layer, gain)
		updateMilestones(layer)
		updateAchievements(layer)

		// game.js - doReset 函数片段

    if (!player[layer].unlocked) {
    player[layer].unlocked = true;
    needCanvasUpdate = true;

    player[layer].justUnlocked = true;
    setTimeout(() => {
        if (player[layer]) player[layer].justUnlocked = false;
    }, 2000);

    if (tmp[layer].increaseUnlockOrder){
        lrs = tmp[layer].increaseUnlockOrder
        for (lr in lrs)
            if (!player[lrs[lr]].unlocked) player[lrs[lr]].unlockOrder++
    }
    }
    }

	if (run(layers[layer].resetsNothing, layers[layer])) return
	tmp[layer].baseAmount = decimalZero // quick fix


	for (layerResetting in layers) {
		if (row >= layers[layerResetting].row && (!force || layerResetting != layer)) completeChallenge(layerResetting)
	}

	player.points = (row == 0 ? decimalZero : getStartPoints())

	for (let x = row; x >= 0; x--) rowReset(x, layer)
	for (r in OTHER_LAYERS){
		rowReset(r, layer)
	}

	player[layer].resetTime = 0

	updateTemp()
	updateTemp()
}

function resetRow(row) {
	if (prompt('Are you sure you want to reset this row? It is highly recommended that you wait until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm')!="I WANT TO RESET THIS") return
	let pre_layers = ROW_LAYERS[row-1]
	let layers = ROW_LAYERS[row]
	let post_layers = ROW_LAYERS[row+1]
	rowReset(row+1, post_layers[0])
	doReset(pre_layers[0], true)
	for (let layer in layers) {
		player[layer].unlocked = false
		if (player[layer].unlockOrder) player[layer].unlockOrder = 0
	}
	player.points = getStartPoints()
	updateTemp();
	resizeCanvas();
}

function startChallenge(layer, x) {
	let enter = false
	if (!player[layer].unlocked || !tmp[layer].challenges[x].unlocked || !canEnterChallenge(layer, x)) return

	if (player[layer].activeChallenge == x) {
		// This needs to be embedded due to how 'enter' works
		if(canExitChallenge(layer, x)){
			completeChallenge(layer, x)
			player[layer].activeChallenge = null;
		}
	}
	else {
		enter = true
	}
	if(enter || canExitChallenge(layer, x)) doReset(layer, true)
	if(enter) {
		player[layer].activeChallenge = x;
		run(layers[layer].challenges[x].onEnter, layers[layer].challenges[x])
	}
	updateChallengeTemp(layer)
}

function canCompleteChallenge(layer, x)
{
	if (x != player[layer].activeChallenge) return
	let challenge = tmp[layer].challenges[x]
	if (challenge.canComplete !== undefined) return challenge.canComplete

	if (challenge.currencyInternalName){
		let name = challenge.currencyInternalName
		if (challenge.currencyLocation){
			return !(challenge.currencyLocation[name].lt(challenge.goal)) 
		}
		else if (challenge.currencyLayer){
			let lr = challenge.currencyLayer
			return !(player[lr][name].lt(challenge.goal)) 
		}
		else {
			return !(player[name].lt(challenge.goal))
		}
	}
	else {
		return !(player.points.lt(challenge.goal))
	}

}

function completeChallenge(layer, x) {
	var x = player[layer].activeChallenge
	if (!x) return
	
	let completions = canCompleteChallenge(layer, x)
	if (!completions){
		player[layer].activeChallenge = null;
		run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
		return
	}
	if (player[layer].challenges[x] < tmp[layer].challenges[x].completionLimit) {
		needCanvasUpdate = true
		player[layer].challenges[x] += completions
		player[layer].challenges[x] = Math.min(player[layer].challenges[x], tmp[layer].challenges[x].completionLimit)
		if (layers[layer].challenges[x].onComplete) run(layers[layer].challenges[x].onComplete, layers[layer].challenges[x])
	}
	player[layer].activeChallenge = null;
	run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
	updateChallengeTemp(layer)
}

VERSION.withoutName = "v" + VERSION.num + (VERSION.pre ? " Pre-Release " + VERSION.pre : VERSION.pre ? " Beta " + VERSION.beta : "")
VERSION.withName = VERSION.withoutName + (VERSION.name ? ": " + VERSION.name : "")


function autobuyUpgrades(layer){
	if (!tmp[layer].upgrades) return
	for (id in tmp[layer].upgrades)
		if (isPlainObject(tmp[layer].upgrades[id]) && (layers[layer].upgrades[id].canAfford === undefined || layers[layer].upgrades[id].canAfford() === true))
			buyUpg(layer, id) 
}

function gameLoop(diff) {
	if (isEndgame() || tmp.gameEnded){
		tmp.gameEnded = true
		clearParticles()
	}

	if (isNaN(diff) || diff < 0) diff = 0
	if (window.tmp.gameEnded && !window.player.keepGoing) {
		diff = 0
		//player.tab = "tmp.gameEnded"
		clearParticles()
	}

	if (maxTickLength) {
		let limit = maxTickLength()
		if(diff > limit)
			diff = limit
	}
	addTime(diff)
	player.points = player.points.add(tmp.pointGen.times(diff)).max(0)

	for (let x = 0; x <= maxRow; x++){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			player[layer].resetTime += diff
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff*tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			player[layer].resetTime += diff
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff*tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}	

	for (let x = maxRow; x >= 0; x--){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer)
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
				player[layer].best = player[layer].best.max(player[layer].points)
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer)
		}
	}

	for (layer in layers){
		if (layers[layer].milestones) updateMilestones(layer);
		if (layers[layer].achievements) updateAchievements(layer)
	}

}

function hardReset(resetOptions) {
    if (!confirm("你真的想要做这个吗？ 你将会丢失你所有的进度！")) return;
    localStorage.removeItem(getModID());
    localStorage.removeItem(getModID() + "_options");
    window.player = null;
    window.tmp = null;
    window.location.reload();
}

var ticking = false;
// ========== 拖拽批量购买（支持触摸屏） ==========
(function() {
    let isDragging = false;
    let lastBoughtId = null;
    let dragStartX = 0, dragStartY = 0;
    const DRAG_THRESHOLD = 10;

    function getClientCoords(e) {
        if (e.touches) {
            return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        }
        return { clientX: e.clientX, clientY: e.clientY };
    }

    function handleDragStart(e) {
		if (e.target.closest('.opt')) return;
        if (e.button !== undefined && e.button !== 0) return;
        let coords = getClientCoords(e);
        dragStartX = coords.clientX;
        dragStartY = coords.clientY;
        isDragging = false;
        lastBoughtId = null;
    }

    function handleDragMove(e) {
		if (dragStartX === 0 && dragStartY === 0) return;
        if (!dragStartX && dragStartX !== 0) return;
        let coords = getClientCoords(e);
        let dx = Math.abs(coords.clientX - dragStartX);
        let dy = Math.abs(coords.clientY - dragStartY);
        
        if (!isDragging && (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD)) {
            isDragging = true;
        }
        
        if (!isDragging) return;
        
        if (e.cancelable) e.preventDefault();
        
        let elem = document.elementFromPoint(coords.clientX, coords.clientY);
        if (!elem) return;
        
        const btn = elem.closest('.upg, .buyable');
        if (!btn) return;
        
        let layer, id;
        const upgMatch = btn.id.match(/upgrade-([^-]+)-(\d+)/);
        const buyMatch = btn.id.match(/buyable-([^-]+)-(\d+)/);
        if (upgMatch) {
            layer = upgMatch[1];
            id = upgMatch[2];
        } else if (buyMatch) {
            layer = buyMatch[1];
            id = buyMatch[2];
        } else {
            return;
        }
        
        const key = `${layer}-${id}`;
        if (lastBoughtId === key) return;
        lastBoughtId = key;
        
        if (upgMatch) {
            if (typeof canAffordUpgrade !== 'undefined' && canAffordUpgrade(layer, id) && !hasUpgrade(layer, id)) {
                buyUpg(layer, id);
            }
        } else if (buyMatch) {
            if (typeof canBuyBuyable !== 'undefined' && canBuyBuyable(layer, id)) {
                buyBuyable(layer, id);
            }
        }
        
        setTimeout(() => { lastBoughtId = null; }, 50);
    }
    
    function handleDragEnd() {
        isDragging = false;
        dragStartX = 0;
        dragStartY = 0;
        lastBoughtId = null;
    }
    
    document.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    document.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
})();

function getBgm() {
    let bgm = document.getElementById('bgm');
    if (!bgm) {
        bgm = document.createElement('audio');
        bgm.id = 'bgm';
        bgm.loop = true;
        bgm.preload = 'auto';
        bgm.style.display = 'none';
        document.body.appendChild(bgm);
    }
    return bgm;
}

function initBgm() {
    let bgm = getBgm();
    if (!bgm.src || bgm.src === '') {
        bgm.src = './resources/bgm.mp3';
        bgm.preload = 'auto';
        bgm.load();
    }
}

function initMusic() {
    let bgm = getBgm();
    musicPlaying = !bgm.paused;
    bgm.addEventListener('play', () => { musicPlaying = true; });
    bgm.addEventListener('pause', () => { musicPlaying = false; });
    bgm.addEventListener('ended', () => { musicPlaying = false; });
}

document.addEventListener('DOMContentLoaded', function() {
    initBgm();
    initMusic();
});

let musicLoading = false;

function toggleMusic() {
    let bgm = getBgm();
    if (musicLoading) {
        return;
    }

    if (!bgm.src || bgm.src === '') {
        bgm.src = './resources/bgm.mp3';
        bgm.load();
    }

    const isPlaying = !bgm.paused;

    if (isPlaying) {
        bgm.pause();
        window.options.musicEnabled = false;
        save();
        return;
    }

    musicLoading = true;

    const playPromise = bgm.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            window.options.musicEnabled = true;
            save();
            musicLoading = false;
        }).catch((e) => {
            musicLoading = false;
        });
    } else {
        window.options.musicEnabled = true;
        save();
        musicLoading = false;
    }
}

function updateBackgroundStyle() {
    if (typeof backgroundStyle === 'function') {
        tmp.backgroundStyle = backgroundStyle();
    } else {
        tmp.backgroundStyle = backgroundStyle;
    }
    if (typeof needCanvasUpdate !== 'undefined') needCanvasUpdate = true;
}
// ========== 开始界面和延迟启动 ==========
let gameStarted = false;
let gameIntervals = [];

function startIntervals() {
    if (gameIntervals.length) {
        gameIntervals.forEach(clearInterval);
        gameIntervals = [];
    }
    
    gameIntervals.push(setInterval(function() {
        if (!player || !tmp || !gameStarted) return;
        if (ticking) return;
        if (tmp.gameEnded && !player.keepGoing) return;
        ticking = true;
        let now = Date.now();
        let diff = (now - player.time) / 1e3;
        let trueDiff = diff;
        if (player.offTime !== undefined) {
            if (player.offTime.remain > modInfo.offlineLimit * 3600) player.offTime.remain = modInfo.offlineLimit * 3600;
            if (player.offTime.remain > 0) {
                let offlineDiff = Math.max(player.offTime.remain / 10, diff);
                player.offTime.remain -= offlineDiff;
                diff += offlineDiff;
            }
            if (!options.offlineProd || player.offTime.remain <= 0) player.offTime = undefined;
        }
        if (player.m && player.m.unlocked && player.m.byte && player.m.byte.gt(0)) {
            let speedMult = getByteSpeedMult();
            let mult = speedMult.toNumber();
            mult = Math.min(mult);
            if (mult < 0) mult = 1;
            diff *= mult;
            tmp.speedMult = mult;
        } else {
            tmp.speedMult = 1;
        }
        player.time = now;
        if (needCanvasUpdate) {
            resizeCanvas();
            needCanvasUpdate = false;
        }
        tmp.scrolled = document.getElementById('treeTab') && document.getElementById('treeTab').scrollTop > 30;
        updateTemp();
        player.tick = new Decimal(diff);
        updateOomps(diff);
        updateWidth();
        updateTabFormats();
        gameLoop(diff);
        fixNaNs();
        adjustPopupTime(trueDiff);
        updateParticles(trueDiff);
        ticking = false;
    }, 50));
    
    gameIntervals.push(setInterval(function() {
        needCanvasUpdate = true;
    }, 500));
}

function startGameEngine() {
    if (gameStarted) return;
    gameStarted = true;
    player.time = Date.now();
    
    updateTemp();
    updateTemp();
    
    if (typeof initUtils === 'function') initUtils();
    loadVue();
    startIntervals();
    if (typeof startSaveInterval === 'function') startSaveInterval();
    
    let bgm = getBgm();
    if (window.options.musicEnabled && bgm.paused) {
        bgm.play().catch(e => console.warn("音乐播放失败", e));
    }
}

function resetToNewGame() {
    localStorage.removeItem(getModID());
    localStorage.removeItem(getModID() + "_options");
    player = getStartplayer();
    window.options = getStartOptions();
    options = window.options;
    fixSave();
    updateLayers();
    setupTemp();
    updateTemp();
    setupModInfo();
    changeTheme();
    applyZoomSetting();
    applyTextSelectSetting();
}

function loadGameDataOnly() {
    let hasSave = false;
try {
    const saveStr = localStorage.getItem(getModID());
    if (saveStr && saveStr.length > 0) {
        const decoded = b64_to_utf8(saveStr);
        const loadedPlayer = JSON.parse(decoded);
        if (loadedPlayer) {
        window.player = loadedPlayer;
        if (loadedPlayer.versionType !== getModID()) {
        window.player.versionType = getModID();
        }
        hasSave = true;
    }
    else {
    window.player = getStartplayer();
    }
        } else {
            window.player = getStartplayer();
        }
        window.options = getStartOptions();
        loadOptions();
    } catch(e) {
        window.player = getStartplayer();
        window.options = getStartOptions();
    }
    if (!window.player) window.player = getStartplayer();
    if (!window.options) window.options = getStartOptions();
    
    fixSave();
    updateLayers();
    setupTemp();
    updateTemp();
    updateTabFormats();
    resizeCanvas();
    applyZoomSetting();
    applyTextSelectSetting();
    setupModInfo();
    changeTheme();
    return hasSave;
}

(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStartScreen);
    } else {
        initStartScreen();
    }

    function initStartScreen() {
        initBgm();

        const versionEl = document.getElementById('startScreenVersion');
        if (versionEl && typeof VERSION !== 'undefined' && VERSION.withName) {
        versionEl.textContent = VERSION.withName;
    }

        const startScreen = document.getElementById('startScreen');
        if (startScreen) {
            const newBtn = document.getElementById('newGameBtn');
            const loadBtn = document.getElementById('loadGameBtn');

            let hasSave = false;
            try {
                const saveStr = localStorage.getItem(getModID());
                hasSave = saveStr && saveStr.length > 0;
            } catch(e) {}
            if (hasSave && loadBtn) loadBtn.style.display = 'inline-block';

            const startGame = (loadSave) => {
                try {
                    if (loadSave && hasSave) {
                        loadGameDataOnly();
                    } else {
                        resetToNewGame();
                    }
                    startGameEngine();
                    startScreen.style.opacity = '0';
                    setTimeout(() => startScreen.remove(), 500);
                } catch (e) {
                }
            };

            newBtn?.addEventListener('click', () => startGame(false));
            if (loadBtn) loadBtn.addEventListener('click', () => startGame(true));
        } else {
            loadGameDataOnly();
            startGameEngine();
        }
    }
})();