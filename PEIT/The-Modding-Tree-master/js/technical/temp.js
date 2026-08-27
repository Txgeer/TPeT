var tmp = {}
var temp = tmp
var funcs = {}
var NaNalert = false;

// Tmp will not call these
var activeFunctions = [
    "startData", "onPrestige", "doReset", "update", "automate",
    "buy", "buyMax", "respec", "onPress", "onClick", "onHold", "masterButtonPress",
    "sellOne", "sellAll", "pay", "actualCostFunction", "actu原初fectFunction",
    "effectDescription", "display", "fullDisplay", "effectDisplay", "rewardDisplay",
    "tabFormat", "content",
    "onComplete", "onPurchase", "onEnter", "onExit", "done",
    "getUnlocked", "getStyle", "getCanClick", "getTitle", "getDisplay"
]

var noCall = doNotCallTheseFunctionsEveryTick
for (item in noCall) {
    activeFunctions.push(noCall[item])
}

var traversableClasses = []

function setupTemp() {
    tmp = {}
    tmp.pointGen = {}
    tmp.backgroundStyle = {}
    tmp.displayThings = []
    tmp.scrolled = 0
    tmp.gameEnded = false
    funcs = {}
    
    setupTempData(layers, tmp, funcs)
    for (var layer in layers) {
        tmp[layer].resetGain = {}
        tmp[layer].nextAt = {}
        tmp[layer].nextAtDisp = {}
        tmp[layer].canReset = {}
        tmp[layer].notify = {}
        tmp[layer].prestigeNotify = {}
        tmp[layer].computedNodeStyle = []
        setupBuyables(layer)
        tmp[layer].trueGlowColor = []
    }

    tmp.other = {
        lastPoints: player.points || decimalZero,
        oomps: decimalZero,
        screenWidth: 0,
        screenHeight: 0,
    }

    updateWidth()
    temp = tmp
}

const boolNames = ["unlocked", "deactivated"]

function setupTempData(layerData, tmpData, funcsData) {
    for (var item in layerData) {
        if (layerData[item] == null) {
            tmpData[item] = null
        }
        else if (layerData[item] instanceof Decimal) {
            tmpData[item] = layerData[item]
        }
        else if (Array.isArray(layerData[item])) {
            tmpData[item] = []
            funcsData[item] = []
            setupTempData(layerData[item], tmpData[item], funcsData[item])
        }
        else if (layerData[item] && layerData[item].constructor === Object) {
            tmpData[item] = {}
            funcsData[item] = []
            setupTempData(layerData[item], tmpData[item], funcsData[item])
        }
        else if (layerData[item] && typeof layerData[item] === "object" && traversableClasses.includes(layerData[item].constructor.name)) {
            tmpData[item] = new layerData[item].constructor()
            funcsData[item] = new layerData[item].constructor()
        }
        else if (isFunction(layerData[item]) && !activeFunctions.includes(item)) {
            funcsData[item] = layerData[item]
            if (boolNames.includes(item))
                tmpData[item] = false
            else
                tmpData[item] = decimalOne
        } else {
            tmpData[item] = layerData[item]
        }
    }	
}

function updateTemp() {
    if (tmp === undefined)
        setupTemp()

    updateTempData(layers, tmp, funcs)

    for (var layer in layers) {
        tmp[layer].resetGain = getResetGain(layer)
        tmp[layer].nextAt = getNextAt(layer)
        tmp[layer].nextAtDisp = getNextAt(layer, true)
        tmp[layer].canReset = canReset(layer)
        tmp[layer].trueGlowColor = tmp[layer].glowColor
        tmp[layer].notify = shouldNotify(layer)
        tmp[layer].prestigeNotify = prestigeNotify(layer)
        if (tmp[layer].passiveGeneration === true) tmp[layer].passiveGeneration = 1
    }

    tmp.pointGen = getPointGen()
    tmp.backgroundStyle = readData(backgroundStyle)

    tmp.displayThings = []
    for (var thing in displayThings) {
        var text = displayThings[thing]
        if (isFunction(text)) text = text()
        tmp.displayThings.push(text)
    }
}

function updateTempData(layerData, tmpData, funcsData, useThis) {
    for (var item in funcsData) {
        if (Array.isArray(layerData[item])) {
            if (item !== "tabFormat" && item !== "content")
                updateTempData(layerData[item], tmpData[item], funcsData[item], useThis)
        }
        else if (layerData[item] && (layerData[item].constructor === Object || (typeof layerData[item] === "object" && traversableClasses.includes(layerData[item].constructor.name)))) {
            updateTempData(layerData[item], tmpData[item], funcsData[item], useThis)
        }
        else if (isFunction(layerData[item]) && !isFunction(tmpData[item])) {
            var value = useThis !== undefined ? layerData[item].bind(useThis)() : layerData[item]()
            tmpData[item] = value
        }
    }
}

function updateChallengeTemp(layer) {
    updateTempData(layers[layer].challenges, tmp[layer].challenges, funcs[layer].challenges)
}

function updateBuyableTemp(layer) {
    updateTempData(layers[layer].buyables, tmp[layer].buyables, funcs[layer].buyables)
}

function updateClickableTemp(layer) {
    updateTempData(layers[layer].clickables, tmp[layer].clickables, funcs[layer].clickables)
}

function setupBuyables(layer) {
    for (var id in layers[layer].buyables) {
        var b = layers[layer].buyables[id];
        if (!isPlainObject(b)) continue;
        if (b._patched) continue;
        b._originalCost = b.cost;
        b._origin原初fect = b.effect;
        b.cost = function(x) {
            if (x === undefined) {
                const layerData = player[this.layer];
                const buyables = layerData ? layerData.buyables : null;
                x = (buyables && buyables[this.id] !== undefined) ? buyables[this.id] : new Decimal(0);
            }
            return this._originalCost(x);
        };

        b.effect = function(x) {
            if (x === undefined) {
                const layerData = player[this.layer];
                const buyables = layerData ? layerData.buyables : null;
                x = (buyables && buyables[this.id] !== undefined) ? buyables[this.id] : new Decimal(0);
            }
            return this._origin原初fect(x);
        };
        
        b._patched = true;
    }
}

function checkDecimalNaN(x) {
    return (x instanceof Decimal) && !x.eq(x)
}