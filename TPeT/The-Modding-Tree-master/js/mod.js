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

// Set your version in num and name
let VERSION = {
	num: "0.5",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v0.5 2026.5.16</h3><br>
		- Added 1 Achievement.<br>
		- Added 4 Challenges.<br>
    <h3>v0.4.2 2026.5.14</h3><br>
		- Added the Row 4 Pretox Upgrades.<br>
		- Added 1 Achievement.<br>
		- Added 1 Challenge.<br>
    <h3>v0.4.1 2026.5.10</h3><br>
		- Remastered the game.<br>
		- Added 4 Achievements.<br>
		- Added Competitor and 1 Challenge.<br>
    <h3>v0.4</h3><br>
		- Added Berserker and the fifth Knight Buyable.<br>
    <h3>v0.3</h3><br>
		- Added 3 Knight Buyables and the fifth Knight Milestone.<br>
    <h3>v0.2</h3><br>
		- Added Knight,Anya and 4 Knight Milestones.<br>
	<h3>v0.1</h3><br>
		- Added Pretox and 9 Pretox Upgrades.<br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end ame, but for now...`

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
    gain = gain.times(player.b.power.pow(0.1).add(1))
	gain = gain.times(player.c.points.pow(0.5).add(1))
	if (hasAchievement('a', 12)) gain = gain.times(achievementEffect('a', 12));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

function closeDragHint() {
    localStorage.setItem('hideDragHint', 'true');
    location.reload();
}

var displayThings = [
    function() {
        if (localStorage.getItem('hideDragHint') === 'true') return '';
        return '<div style="background: #FFD966; color: #000; padding: 4px 8px; border-radius: 8px; cursor: pointer; margin-top: 5px;" onclick="closeDragHint()">💡 提示：按住鼠标左键并拖拽可以批量购买升级和可购买！点击此处关闭提示。</div>';
    }
];

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}