// ************ Save stuff ************
function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function b64_to_utf8(str) {
    try {
        const cleaned = str.replace(/\s/g, '');
        const binary = atob(cleaned);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
        throw new Error('无效的存档代码：不是有效的 Base64 字符串');
    }
}

function save(force) {
	if (!player) return;
    NaNcheck(player);
    if (NaNalert && !force) return;
    let saveStr = JSON.stringify(player);
    let encoded = utf8_to_b64(saveStr);
    localStorage.setItem(getModID(), encoded);
    
    let optStr = JSON.stringify(window.options);
    let encodedOpt = utf8_to_b64(optStr);
    localStorage.setItem(getModID() + "_options", encodedOpt);
}
function startplayerBase() {
	return {
		tab: layoutInfo.startTab,
		navTab: (layoutInfo.showTree ? layoutInfo.startNavTab : "none"),
		time: Date.now(),
		notify: {},
		versionType: modInfo.id,
		version: VERSION.num,
		beta: VERSION.beta,
		timePlayed: 0,
		keepGoing: false,
		hasNaN: false,

		points: modInfo.initialStartPoints,
		subtabs: {},
		lastSafeTab: (readData(layoutInfo.showTree) ? "none" : layoutInfo.startTab)
	};
}
function getStartplayer() {
	playerdata = startplayerBase();

	if (addePlayerData) {
		extradata = addePlayerData();
		for (thing in extradata)
			playerdata[thing] = extradata[thing];
	}

	playerdata.infoboxes = {};
	for (layer in layers) {
		playerdata[layer] = getStartLayerData(layer);

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
			playerdata.subtabs[layer] = {};
			playerdata.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			if (playerdata.subtabs[layer] == undefined)
				playerdata.subtabs[layer] = {};
			for (item in layers[layer].microtabs)
				playerdata.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
		if (layers[layer].infoboxes) {
			if (playerdata.infoboxes[layer] == undefined)
				playerdata.infoboxes[layer] = {};
			for (item in layers[layer].infoboxes)
				playerdata.infoboxes[layer][item] = false;
		}

	}
	return playerdata;
}
function getStartLayerData(layer) {
	layerdata = {};
	if (layers[layer].startData)
		layerdata = layers[layer].startData();

	if (layerdata.unlocked === undefined)
		layerdata.unlocked = true;
	if (layerdata.total === undefined)
		layerdata.total = decimalZero;
	if (layerdata.best === undefined)
		layerdata.best = decimalZero;
	if (layerdata.resetTime === undefined)
		layerdata.resetTime = 0;
	if (layerdata.forceTooltip === undefined)
		layerdata.forceTooltip = false;

	layerdata.buyables = getStartBuyables(layer);
	if (layerdata.noRespecConfirm === undefined) layerdata.noRespecConfirm = false
	if (layerdata.clickables == undefined)
		layerdata.clickables = getStartClickables(layer);
	layerdata.spentOnBuyables = decimalZero;
	layerdata.upgrades = [];
	layerdata.milestones = [];
	layerdata.lastMilestone = null;
	layerdata.achievements = [];
	layerdata.challenges = getStartChallenges(layer);
	layerdata.grid = getStartGrid(layer);
	layerdata.prevTab = ""

	return layerdata;
}
function getStartBuyables(layer) {
	let data = {};
	if (layers[layer].buyables) {
		for (id in layers[layer].buyables)
			if (isPlainObject(layers[layer].buyables[id]))
				data[id] = decimalZero;
	}
	return data;
}
function getStartClickables(layer) {
	let data = {};
	if (layers[layer].clickables) {
		for (id in layers[layer].clickables)
			if (isPlainObject(layers[layer].clickables[id]))
				data[id] = "";
	}
	return data;
}
function getStartChallenges(layer) {
	let data = {};
	if (layers[layer].challenges) {
		for (id in layers[layer].challenges)
			if (isPlainObject(layers[layer].challenges[id]))
				data[id] = 0;
	}
	return data;
}
function getStartGrid(layer) {
	let data = {};
	if (! layers[layer].grid) return data
	if (layers[layer].grid.maxRows === undefined) layers[layer].grid.maxRows=layers[layer].grid.rows
	if (layers[layer].grid.maxCols === undefined) layers[layer].grid.maxCols=layers[layer].grid.cols

	for (let y = 1; y <= layers[layer].grid.maxRows; y++) {
		for (let x = 1; x <= layers[layer].grid.maxCols; x++) {
			data[100*y + x] = layers[layer].grid.getStartData(100*y + x)
		}
	}
	return data;
}

function fixSave() {
	defaultData = getStartplayer();
    fixData(defaultData, player);
    for (layer in layers) {
        if (player[layer].best !== undefined)
            player[layer].best = new Decimal(player[layer].best);
        if (player[layer].total !== undefined)
            player[layer].total = new Decimal(player[layer].total);
        const layerData = player[layer];
        for (let key in layerData) {
            if (defaultData[layer] && defaultData[layer][key] instanceof Decimal) {
                layerData[key] = new Decimal(layerData[key] || 0);
            }
        }
		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {

			if (!Object.keys(layers[layer].tabFormat).includes(player.subtabs[layer].mainTabs))
				player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			for (item in layers[layer].microtabs)
				if (!Object.keys(layers[layer].microtabs[item]).includes(player.subtabs[layer][item]))
					player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
	}
}

function fixData(defaultData, newData) {
    if (!newData) return;
    for (let item in defaultData) {
        if (defaultData[item] == null) {
            if (newData[item] === undefined) newData[item] = null;
        }
        else if (Array.isArray(defaultData[item])) {
            if (newData[item] === undefined) newData[item] = defaultData[item];
            else fixData(defaultData[item], newData[item]);
        }
        else if (defaultData[item] instanceof Decimal) {
            if (newData[item] === undefined) newData[item] = defaultData[item];
            else newData[item] = new Decimal(newData[item]);
        }
        else if (defaultData[item] && typeof defaultData[item] === "object") {
            if (newData[item] === undefined || typeof newData[item] !== "object") newData[item] = defaultData[item];
            else fixData(defaultData[item], newData[item]);
        }
        else {
            if (newData[item] === undefined) newData[item] = defaultData[item];
        }
    }
}
function load() {
	if (typeof window.options === 'undefined') {
        window.options = getStartOptions();
    }
    let get;
    try {
        get = localStorage.getItem(getModID());
    } catch(e) {
        console.error("localStorage access failed", e);
        get = null;
    }

    if (get === null || get === undefined) {
        player = getStartplayer();
        options = getStartOptions();
    } else {
        try {
            let decoded = b64_to_utf8(get);
            player = JSON.parse(decoded);
        } catch(e) {
            console.error("Save decode failed, resetting save", e);
            player = getStartplayer();
        }
        if (!player) player = getStartplayer();
        fixSave();
        loadOptions();
		options = window.options; 
    }

    if (!player) player = getStartplayer();
    if (!options) options = getStartOptions();

	if (player.offlineProd) {
		if (player.offTime === undefined)
			player.offTime = { remain: 0 };
		player.offTime.remain += (Date.now() - player.time) / 1000;
	}
	player.time = Date.now();
	versionCheck();
	changeTheme();
	changeTreeQuality();
	updateLayers();
	setupModInfo();

	setupTemp();
	updateTemp();
	updateTemp();
	updateTabFormats()
	loadVue();
	resizeCanvas();
	applyZoomSetting();
	applyTextSelectSetting();
}

function loadOptions() {
    if (typeof window.options === 'undefined') {
        window.options = getStartOptions();
    }
    let get2 = localStorage.getItem(getModID() + "_options");
    if (get2) {
        try {
            let decoded = b64_to_utf8(get2);
            let savedOpts = JSON.parse(decoded);
            for (let key in savedOpts) {
                window.options[key] = savedOpts[key];
            }
        } catch(e) {
            console.error("Options decode failed, using defaults", e);
        }
    }
    if (themes.indexOf(window.options.theme) < 0) window.options.theme = "default";
}

function setupModInfo() {
	modInfo.changelog = changelog;
	modInfo.winText = winText ? winText : `恭喜！ 你达到了终局并完成了这款游戏， 但是现在......`;

}
function fixNaNs() {
	NaNcheck(player);
}
function NaNcheck(data) {
	for (item in data) {
		if (data[item] == null) {
		}
		else if (Array.isArray(data[item])) {
			NaNcheck(data[item]);
		}
		else if (data[item] !== data[item] || checkDecimalNaN(data[item])) {
			if (!NaNalert) {
				NaNalert = true;
				alert("发现未定义值, 名为 '" + item + "'。 请让模组制作者知道！ 你可以刷新界面，然后你的值会被定义.")
				return
			}
		}
		else if (data[item] instanceof Decimal) {
		}
		else if ((!!data[item]) && (data[item].constructor === Object)) {
			NaNcheck(data[item]);
		}
	}
}
function exportSave() {
    let saveStr = JSON.stringify(player);
    let str = utf8_to_b64(saveStr);
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(el);
}
function importSave(imported = undefined, forced = false) {
    if (imported === undefined) {
        imported = prompt("在这里粘贴你的存档");
    }
    if (imported === null || imported === undefined) {
        return;
    }
    imported = String(imported);
    if (imported.trim() === "") {
        alert("你没有输入任何内容！");
        return;
    }
    try {
        const cleaned = imported.replace(/\s/g, '');
        const decoded = b64_to_utf8(cleaned);
        const tempPlr = Object.assign(getStartplayer(), JSON.parse(decoded));
        if (tempPlr.versionType != modInfo.id && !forced && !confirm("这个存档似乎来自其他模组！确定要导入吗？")) {
            return;
        }
        window.player = tempPlr;
        player = window.player;
        player.versionType = modInfo.id;
        fixSave();
        versionCheck();
        NaNcheck(player); 
        save();
        window.location.reload();
    } catch (e) {
        console.error("导入失败", e);
        alert("无效的存档代码！请确保你复制了完整的存档文本，且没有多余的空格或换行。");
        return;
    }
}
function versionCheck() {
	let setVersion = true;

	if (player.versionType === undefined || player.version === undefined) {
		player.versionType = modInfo.id;
		player.version = 0;
	}

	if (setVersion) {
		if (player.versionType == modInfo.id && VERSION.num > player.version) {
			player.keepGoing = false;
			if (fixOldSave)
				fixOldSave(player.version);
		}
		player.versionType = getStartplayer().versionType;
		player.version = VERSION.num;
		player.beta = VERSION.beta;
	}
}

var saveInterval = null;

function startSaveInterval() {
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(function () {
        if (!player || !tmp) return;
        if (player === undefined) return;
        if (tmp.gameEnded && !player.keepGoing) return;
        if (window.options.autosave) save();
    }, 5000);
}

window.onbeforeunload = () => {
    if (window.options.autosave) {
        save();
    }
};