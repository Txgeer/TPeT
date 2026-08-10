let modInfo = {
	name: "元素周期增量树",
	author: "Liue308&Banana3864&Txgeer",
	pointsName: "中微子",
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

	discordName: "元素周期增量树 | Periodic Elements Incremental Tree",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}
let getModID = () => modInfo.id ?? modInfo.name.replace(/\s+/g, '-');
// Set your version in num and name
let VERSION = {
	num: "0.5.4",
	name: "New Game"
}

let changelog = `<h1>更新日志:</h1><br>
    <h3>NG v0.5.4 2026.8.10</h3><br>
		- 增加了新的内容（光子前）。<br>
    <h3>NG v0.5.3 2026.8.9</h3><br>
		- 增加了新的内容（熵前）。<br>
		- 修复了上个版本存在的大量问题。<br>
    <h3>NG v0.5.2 2026.8.8</h3><br>
		- 增加了新的内容（碳前）。<br>
    <h3>NG v0.5.1 2026.8.7</h3><br>
		- 增加了新的内容（硼前）。<br>
		- 修复了转生的问题。<br>
    <h3>NG v0.5 临时版本 2026.8.6</h3><br>
		- 修复了氦不能冷却的恶性Bug。<br>
		- 不要点那个转生！！！！！！！目前有Bug<br>
    <h3>NG v0.5 2026.8.6</h3><br>
		- 物是人非。<br>
		- 总之，元素周期增量树换新作者了！<br>
		- 我把游戏搬到了基于TMT自制的PROJECT:NTV3引擎！<br>
		- 还优化了平衡性和文本显示！<br>
		- 群号: 951232913<br>
	<h3>v0.4+</h3><br>
		- 作者在元旦偷偷更新了<br>
		- 修复了碳能量开局生产的bug<br>
		- 没了<br>
		- 注:这是短期内(可能半年内)的最后一次更新了,可以去支持作者的新作禁言增量页谢谢喵!<br>
		- 群号: 951232913<br>
	<h3>v0.4</h3><br>
		- 添加硼层机制<br>
		- 添加碳层<br>
	<h3>v0.3.3+</h3><br>
		- 修复一个有关于text4的bug(关键是这个b....bug没测试到)<br>
	<h3>v0.3.3</h3><br>
		- 增加解锁硼层之后未解锁硼层机制的内容<br>
		(包括新的氢升级,铍升级)<br>
		- 版本终点:6硼<br>
		- 本次更新内容较少(赶工!)<br>
	<h3>v0.3.2+</h3><br>
		- 修复上个版本更新带来的一堆平衡问题和NaN问题<br>
	<h3>v0.3.2</h3><br>
		- 添加硼层和上个版本更新的锂层,铍层的内容<br>
		- 基本粒子层,氢层,氦层添加更多升级<br>
		- 修正该树的作者名<br>
	<h3>v0.2.2</h3><br>
		- 添加锂层,铍层<br>
		- 氦层添加机制<br>
	<h3>v0.1.3</h3><br>
		- 修复了购买项有时能买却不能买的bug<br>
		- 增加新资源<br>
	<h3>v0.1</h3><br>
		- 增加氢层一些东西<br>
		- 增加氦层<br>
	<h3>v0.0</h3><br>
		- 增加基本粒子层与2buyable与9upgrade<br>
		- 增加氢层`

let winText = `恭喜！你达到了终局，但是现在......`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already and beaten this gtaken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("p",11);
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(1)
	if (!player || !player.p) 
		return new Decimal(1)
    	let gain = zero
	if(hasUpgrade("p",11)) gain = gain.add(upgradeEffect("p",11))
	if(hasUpgrade("p",12)) gain = gain.add(upgradeEffect("p",12))
	if(hasAchievement('a', 11)) gain = gain.add(achievementEffect('a', 11))
	if(hasAchievement('a', 14)) gain = gain.mul(achievementEffect('a', 14))
	if(hasUpgrade("p",13)) gain = gain.mul(upgradeEffect("p",13))
	if(hasUpgrade("p",14)) gain = gain.mul(upgradeEffect("p",14))
	if(hasUpgrade("p",23)) gain = gain.mul(upgradeEffect("p",23))
	if(hasUpgrade("p",24)) gain = gain.mul(upgradeEffect("p",24))
	if(hasUpgrade("p",32)) gain = gain.mul(upgradeEffect("p",32))
	if(hasUpgrade("p",34)) gain = gain.mul(upgradeEffect("p",34))
	if(hasUpgrade("p",43)) gain = gain.mul(upgradeEffect("p",43))
	if(hasUpgrade("p",61)) gain = gain.mul(upgradeEffect("p",61))
	if(hasUpgrade("h",11)) gain = gain.mul(upgradeEffect("h",11))
	if(hasUpgrade("h",12)) gain = gain.mul(upgradeEffect("h",12))
	if(hasUpgrade("h",21)) gain = gain.mul(upgradeEffect("h",21))
	if(hasUpgrade("he",12)) gain = gain.mul(upgradeEffect("he",12))
	if(hasUpgrade("he",22)) gain = gain.mul(upgradeEffect("he",22))
	if(hasUpgrade("li",11)) gain = gain.mul(upgradeEffect("li",11))
	if(hasUpgrade("he",23)) gain = gain.mul(buyableEffect("he",11))
	if(hasUpgrade("he",24)) gain = gain.mul(buyableEffect("he",12))
	if(getBuyableAmount("p",11).gte(1)) gain = gain.mul(buyableEffect("p",11))
	if(hasMilestone("h",4)) gain = gain.mul(layers.he.balloonBoostPoints())
	if(player.he.upTime.gt(0)) gain = gain.mul(layers.he.boomedBalloonBoostPoints())
	if(hasMilestone("he",2)) gain = gain.mul(layers.he.temPointBoostPoints())
	if(hasUpgrade("be",13)) gain = gain.mul(upgradeEffect("be",13))
	if(hasUpgrade("be",21)) gain = gain.mul(upgradeEffect("be",13))
	if(hasUpgrade("b",41)) gain = gain.mul(upgradeEffect("b",41))
	if(hasUpgrade("li",13)) gain = gain.mul(layers.li.LiboostPoints())
    if(player.b.inBorane) gain = gain.pow(0.66686)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addePlayerData() { return {
	gameSpeed: one, //挖个坑,游戏时间流速
	devSpeed: one,
	banana: 3864,
	liuliu: 66686,
	paused: false
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
	"群号: 951232913"
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade("b",55)
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
};