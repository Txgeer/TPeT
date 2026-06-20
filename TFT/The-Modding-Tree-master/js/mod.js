let modInfo = {
	name: "农业树",
	author: "Txgeer",
	pointsName: "绿钞",
	modFiles: [
    "technical/layerSupport.js",
    "utils/NumberFormating.js",
    "utils/options.js",
    "utils/themes.js",
    "utils/easyAccess.js",
    "technical/temp.js",
    "technical/displays.js",
    "utils.js",
    "tree.js",
    "utils/save.js",
    "technical/systemComponents.js",
    "technical/canvas.js",
    "technical/particleSystem.js",
    "layers.js",
    "components.js",
    "game.js"
],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}
let getModID = () => modInfo.id ?? `${modInfo.name.replace(/\s+/g, '-')}-${modInfo.author.replace(/\s+/g, '-')}`;
// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "农业的开始"
}

let changelog = `<h1>更新日志:</h1><br>
	<h3>v0.0 2026.6.17</h3><br>
		-`

let winText = `恭喜！你达到了终？局，但是现在......`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already and beaten this gtaken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(1)
	if (!player || !player.f) 
		return new Decimal(1)
    let gain = new Decimal(1)
    if (player.f.wheat.gt(0)) gain = gain.times(player.f.wheat.add(1).log10())
    if (hasUpgrade('m', 11)) gain = gain.times(upgradeEffect('m', 11))
    if (hasUpgrade('m', 12)) gain = gain.times(upgradeEffect('m', 12))
	if (!(gain instanceof Decimal) || gain.lte(0)) gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addePlayerData() { return {
}}

function closeDragHint() {
    localStorage.setItem('hideDragHint', 'true');
    location.reload();
}

var displayThings = [
    function() {
        if (localStorage.getItem('hideDragHint') === 'true') return '';
        return '<div style="background: #ffbf00; color: #000000; padding: 4px 8px; border-radius: 8px; cursor: pointer; margin-top: 5px;" onclick="closeDragHint()">💡 提示：按住鼠标左键并拖拽可以批量购买升级和可购买！点击此处关闭提示。</div>';
    },
];

// Determines when the game "ends"
function isEndgame() {
        return player.points.gte(new Decimal(1e308))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = function() {
    return {
        background: "linear-gradient(135deg, #000000, #003f3f)",
        transition: "background 1s ease"
    };
};

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(){
}

function getGameSpeedMultiplier(diff) {
    return 1;
}

window.startScreenConfig = {
    title: modInfo.name,
    version: VERSION.withName,
    author: modInfo.author,
    newGameText: "新游戏",
    loadGameText: "继续游戏",
    credits: "作者：Txgeer"
};