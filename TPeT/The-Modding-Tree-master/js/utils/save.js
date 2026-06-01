// ************ Save stuff ************
function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(atob(str)));
}
function save(force) {
	if (!player) return;
    NaNcheck(player);
    if (NaNalert && !force) return;
    let saveStr = JSON.stringify(player);
    let encoded = utf8_to_b64(saveStr);
    localStorage.setItem(getModID(), encoded);
    
    let optStr = JSON.stringify(options);
    let encodedOpt = utf8_to_b64(optStr);
    localStorage.setItem(getModID() + "_options", encodedOpt);
}
function startPlayerBase() {
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
function getStartPlayer() {
	playerdata = startPlayerBase();

	if (addedPlayerData) {
		extradata = addedPlayerData();
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
	defaultData = getStartPlayer();
	fixData(defaultData, player);

	for (layer in layers) {
		if (player[layer].best !== undefined)
			player[layer].best = new Decimal(player[layer].best);
		if (player[layer].total !== undefined)
			player[layer].total = new Decimal(player[layer].total);

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
    let get;
    try {
        get = localStorage.getItem(getModID());
    } catch(e) {
        console.error("localStorage access failed", e);
        get = null;
    }

    if (get === null || get === undefined) {
        player = getStartPlayer();
        options = getStartOptions();
    } else {
        try {
            let decoded = b64_to_utf8(get);
            player = JSON.parse(decoded);
        } catch(e) {
            console.error("Save decode failed, resetting save", e);
            player = getStartPlayer();
        }
        if (!player) player = getStartPlayer();
        fixSave();
        loadOptions();
    }

    if (!player) player = getStartPlayer();
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
}

function loadOptions() {
    let get2 = localStorage.getItem(getModID() + "_options");
    if (get2) {
        try {
            let decoded = b64_to_utf8(get2);
            options = Object.assign(getStartOptions(), JSON.parse(decoded));
        } catch(e) {
            console.error("Options decode failed, using defaults", e);
            options = getStartOptions();
        }
    } else {
        options = getStartOptions();
    }
    if (themes.indexOf(options.theme) < 0) options.theme = "default";
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
				clearInterval(interval);
				NaNalert = true;
				alert("Invalid value found in player, named '" + item + "'. Please let the creator of this mod know! You can refresh the page, and you will be un-NaNed.")
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
    if (imported === undefined)
        imported = prompt("在这里粘贴你的存档");
    try {
        let decoded = b64_to_utf8(imported);
        let tempPlr = Object.assign(getStartPlayer(), JSON.parse(decoded));
        if (tempPlr.versionType != modInfo.id && !forced && !confirm("This save appears to be for a different mod! Are you sure you want to import?"))
            return;
        player = tempPlr;
        player.versionType = modInfo.id;
        fixSave();
        versionCheck();
        NaNcheck(save);
        save();
        window.location.reload();
    } catch (e) {
        console.error("Import failed", e);
        alert("无效的存档代码！");
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
		player.versionType = getStartPlayer().versionType;
		player.version = VERSION.num;
		player.beta = VERSION.beta;
	}
}
var saveInterval = setInterval(function () {
	if (!player || !tmp) return;
	if (player === undefined)
		return;
	if (tmp.gameEnded && !player.keepGoing)
		return;
	if (options.autosave)
		save();
}, 5000);

window.onbeforeunload = () => {
    if (player.autosave) {
        save();
    }
};