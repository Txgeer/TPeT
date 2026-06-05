let modInfo = {
	name: "蛮王树",
	author: "Txgeer",
	pointsName: "蛮王经验值",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}
let getModID = () => modInfo.id ?? `${modInfo.name.replace(/\s+/g, '-')}-${modInfo.author.replace(/\s+/g, '-')}`;
// Set your version in num and name
let VERSION = {
	num: "0.8.1",
	name: "万物终？结",
}

let changelog = `<h1>更新日志:</h1><br>
    <h3>v0.8.1 2026.6.5</h3><br>
		- 完全汉化游戏。<br>
    <h3>v0.8 2026.6.4</h3><br>
		- 添加主机，9个主机资源，8个主机升级和4个主机革新。<br>
		- 添加2个成就。<br>
		- 添加1个挑战。<br>
    <h3>v0.7 2026.6.1</h3><br>
		- 添加4个φ 精华升级。<br>
		- 添加1个成就。<br>
		- 添加6个颜色色度，8个色彩升级和6个色彩挑战。<br>
    <h3>v0.6.2 2026.5.27</h3><br>
		- 添加3个φ 精华升级。<br>
		- 添加1个成就。<br>
		- 添加2个骑士可购买。<br>
    <h3>v0.6.1 2026.5.24</h3><br>
		- 添加神祇，φ 精华和1个φ 精华升级。<br>
    <h3>v0.6 2026.5.23</h3><br>
		- 添加色彩和8个颜色色度。<br>
		- 添加1个增强工具。<br>
		- 添加1个成就。<br>
		- 添加1个挑战。<br>
		- 添加4个增强者升级。<br>
    <h3>v0.5.2 2026.5.18</h3><br>
		- 添加3个增强工具。<br>
		- 添加1个成就。<br>
		- 添加1个挑战。<br>
		- 添加4个蛮王升级。<br>
    <h3>v0.5.1 2026.5.17</h3><br>
		- 添加增强者和4个增强者升级。<br>
    <h3>v0.5 2026.5.16</h3><br>
		- 添加1个成就。<br>
		- 添加4个挑战。<br>
		- 添加1个骑士可购买。<br>		
    <h3>v0.4.2 2026.5.14</h3><br>
		- 添加4个蛮王升级。<br>
		- 添加1个成就.<br>
		- 添加1个挑战.<br>
    <h3>v0.4.1 2026.5.10</h3><br>
		- 重制本游戏.<br>
		- 添加4个成就。<br>
		- 添加挑战者和1个挑战。.<br>
    <h3>v0.4</h3><br>
		- 添加狂战士。<br>
		- 添加1个骑士可购买。<br>
    <h3>v0.3</h3><br>
		- 添加3个骑士可购买。<br>
    <h3>v0.2</h3><br>
		- 添加骑士和Anya。<br>
	<h3>v0.1</h3><br>
		- 添加蛮王和9个蛮王升级.<br>
	<h3>v0.0</h3><br>
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

	let gain = new Decimal(1)
	if (hasUpgrade('p', 11)) gain = gain.times(upgradeEffect('p', 11))
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 22)) gain = gain.times(upgradeEffect('p', 22))
	if (hasUpgrade('p', 23)) gain = gain.times(upgradeEffect('p', 23))
    if (hasUpgrade('p', 33)) gain = gain.times(upgradeEffect('p', 33))
	if (hasUpgrade('p', 41)) gain = gain.times(upgradeEffect('p', 41))
	if (hasUpgrade('p', 42)) gain = gain.times(upgradeEffect('p', 42))
	if (hasUpgrade('p', 43)) gain = gain.times(upgradeEffect('p', 43))
	gain = gain.times(buyableEffect('k', 11))
    gain = gain.times(buyableEffect('k', 23))
    gain = gain.times(getFuryBonus(player.b.power))
	gain = gain.times(player.c.points.pow(0.5).add(1))
	if (player.cr.redchroma.gt(0)) {gain = gain.times(player.cr.redchroma.log2().add(1))}
	if (hasAchievement('a', 12)) gain = gain.times(achievementEffect('a', 12))
	if (hasUpgrade('g', 22)) gain = gain.times(upgradeEffect('g', 22))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	hasAchieved23: false
}}

function closeDragHint() {
    localStorage.setItem('hideDragHint', 'true');
    location.reload();
}

var displayThings = [
		function() {
        if (tmp.speedMult && tmp.speedMult !== 1) {
            return `<div style="color: #00007f; margin-top: 5px;">⚡ 游戏速度: ${format(tmp.speedMult)}x</div>`;
        }
        return '';
    },
    function() {
        if (localStorage.getItem('hideDragHint') === 'true') return '';
        return '<div style="background: #ffbf00; color: #000000; padding: 4px 8px; border-radius: 8px; cursor: pointer; margin-top: 5px;" onclick="closeDragHint()">💡 提示：按住鼠标左键并拖拽可以批量购买升级和可购买！点击此处关闭提示。</div>';
    },
	function() {
    return `<div style="color: #ffbf00; margin-top: 5px;">终？局：1e45 蛮王经验值</div>`;
    },
];

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal(1e45))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = function() {
    if (player && player.Antiteal) {
        return {
            background: "linear-gradient(135deg, #000000, #ffffff)",
            transition: "background 1s ease"
        };
    }
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