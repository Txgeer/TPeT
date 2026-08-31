addLayer("p", {
    name: "声望", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlockd: true,
		points: new Decimal(0),
    }},
    color: "#7f7f7f",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "声望点数", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
    let mult = new Decimal(1);
    return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1);
        return exp;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "进行一次声望重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        {
            key: "shift+p",
            description: "Shift+P: 暂停/继续游戏",
            onPress: function() {
                if (typeof player === 'undefined' || !player || typeof tmp === 'undefined') return;
                if (!tmp.p || !tmp.p.layerShown) return;
                player.paused = !player.paused;
                if (player.paused) {
                    doPopup("info", "游戏已暂停", "⏸", 2, "#ffaa00");
                } else {
                    doPopup("info", "游戏已恢复", "▶", 2, "#00ff00");
                }
            }
        },
    ],
    style: {
        background: "linear-gradient(135deg, #000000, #1f1f1f)",
        minHeight: "100vh"
    },
    layerShown(){return true}
})