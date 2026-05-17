function applySoftcap(value) {
    let active = player.c.activeChallenge;
    let isSoftcap = false;
    let cap = new Decimal(100);
    if (active === 12 || active === 13 || active === 21 || active === 22 || active === 23) {
        isSoftcap = true;
        cap = new Decimal(2);
    } else if (active === 11) {
        isSoftcap = true;
        cap = new Decimal(100);
    } else if (hasChallenge('c', 11)) {
        isSoftcap = true;
        cap = new Decimal(100);
    }
    if (isSoftcap) {
        if (value.lte(cap)) return value;
        let excess = value.sub(cap);
        let logGrowth;
        if (hasUpgrade('e', 12)) {
            logGrowth = Decimal.log2(excess).add(1);
        } else {
            logGrowth = Decimal.log10(excess).add(1);
        }
        return cap.add(logGrowth);
    } else {
        return value.min(100);
    }
}
function isKnightDisabled() {
    let active = player.c.activeChallenge;
    return active === 11 || active === 12 || active === 13 || active === 21 || active === 22 || active === 23;
}
function getUpgradeDisplay(layer, id) {
    let eff = upgradeEffect(layer, id);
    let formatted = format(eff) + "x";
    if (hasChallenge('c', 11) && eff.gt(100)) {
        return formatted + "（受软上限限制）";
    }
    if (!hasChallenge('c', 11) && eff.gte(100)) {
        return formatted + "（受硬上限限制）";
    }
    return formatted;
}
function getFuryBonus(power) {
    let safePower = power.max(1);
    if (hasUpgrade('e', 13)) {
        return safePower.log2().add(1);
    } else {
        return safePower.ln().add(1);
    }
}
function getCurrentThreshold() {
    let baseThreshold;
    if (player.c.activeChallenge === 23) {
        baseThreshold = new Decimal(1);
    } else {
        baseThreshold = new Decimal(9e15);
    }
    if (player.milkUnlocked) {
        let milkFactor = player.k.milk.max(1);
        baseThreshold = baseThreshold.times(milkFactor);
    }
    return baseThreshold;
}
addLayer("a", {
    name: "成就", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ffff3f",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "成就", // Name of prestige currency
    baseResource: "狂战士营人口", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 10, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    achievements: {
    11: {
        name: "超越原著",
        tooltip: "要求：获得 9 蛮王等级。",
        done() {return player.p.points.gte(9)},
    },
    12: {
        name: "每个人都很棒！",
        tooltip: "要求：获得每种第一行骑士可购买。<br>奖励：翻倍蛮王经验值与蛮王等级获取。",
        done() {return getBuyableAmount("k", 11).gte(1) &&
            getBuyableAmount("k", 12).gte(1) &&
            getBuyableAmount("k", 13).gte(1)
        },
        effect() {
                return 2
            },
        effectDisplay() { return format(achievementEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
    },
    13: {
        name: "狂战营生成器",
        tooltip: "要求：获得 2000000 蛮王等级。",
        done() {return player.p.points.gte(2000000)},
    },
    14: {
        name: "怒气冲天",
        tooltip: "要求：获得 9e15 狂怒能量。",
        done() {return player.b.power.gte(9e15)},
    },
    21: {
    name: "超越极限",
    tooltip: "要求：蛮王升级12的效果超过100倍。",
    done() {
        return upgradeEffect('p', 12).gt(100);
    },
    },
    22: {
    name: "每个人都很棒 II",
    tooltip: "要求：获得每种第一行和第二行骑士可购买。<br>奖励：自动购买第二行骑士可购买。",
    done() {
        return getBuyableAmount("k", 11).gte(1) &&
               getBuyableAmount("k", 12).gte(1) &&
               getBuyableAmount("k", 13).gte(1) &&
               getBuyableAmount("k", 21).gte(1) &&
               getBuyableAmount("k", 22).gte(1) &&
               getBuyableAmount("k", 23).gte(1);
        },
    },
},
    tabFormat:{
        '成就':{
            content:[
            //['infoboxes','main-text'],
            'achievements',
            ],
        },
    },
    layerShown(){return true},
    })
addLayer("p", {
    name: "蛮王", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#7f7f7f",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "蛮王等级", // Name of prestige currency
    baseResource: "蛮王经验值", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
    let mult = new Decimal(1);
    if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
    if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
    if (hasUpgrade('p', 31)) mult = mult.times(upgradeEffect('p', 31))
    if (hasUpgrade('p', 32)) mult = mult.times(upgradeEffect('p', 32))
    mult = mult.times(buyableEffect('k', 12))
    mult = mult.times(buyableEffect('k', 23))
    mult = mult.times(getFuryBonus(player.b.power))
    mult = mult.times(player.c.points.pow(0.5).add(1))
    let threshold = getCurrentThreshold();
    if (player.p.points.gte(threshold)) {
    let logPoints = player.p.points.log10();
    let logThreshold = threshold.log10();
    let delta = logPoints.sub(logThreshold).add(1);
    if (delta.gt(0)) {
        let exponent = Decimal.dOne.div(delta);
        mult = mult.pow(exponent);
    }
    }
    return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Pretox", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {        
        11: {    
            title: "蛮王出世",
            description: "翻倍蛮王经验值获取。<br>",
            cost: new Decimal(1),
            effect() {
            return hasChallenge('c', 13) ? 10 : 2;
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || player.c.activeChallenge === 22 || player.c.activeChallenge === 23) return false;
            return true;
            }
        },
        12: {    
            title: "金制盾牌",
            description: "基于你的蛮王等级增益蛮王经验值获取。",
            cost: new Decimal(2),
            effect() {
            let raw = player[this.layer].points.add(1).pow(0.2);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            }// Add formatting to the effect


        },
        13: {    
            title: "倒转斧柄",
            description: "基于你的蛮王经验值增益蛮王等级获取。",
            cost: new Decimal(5),
            effect() {
            let raw = player.points.add(1).pow(0.15);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            }// Add formatting to the effect


        },
        21: {    
            title: "吾即是王",
            description: "基于你的蛮王等级增益蛮王等级获取。",
            cost: new Decimal(15),
            effect() {
            let raw = player[this.layer].points.add(1).pow(0.15);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            }// Add formatting to the effect


        },
        22: {    
            title: "大兴土木",
            description: "基于你的蛮王经验值增益蛮王经验值获取。",
            cost: new Decimal(30),
            effect() {
            let raw = player.points.add(1).pow(0.2);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            }// Add formatting to the effect

        },
        23: {    
            title: "源远流长",
            description: "基于蛮王升级的数量增益蛮王经验值获取。",
            cost: new Decimal(45),
            effect() {
            let exponent = hasChallenge('c', 21) ? 0.5 : 0.2;
            let raw = new Decimal(player.p.upgrades.length).add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23) return false;
            return true;
            }

        },
        31: {    
            title: "博大精深",
            description: "基于蛮王升级的数量增益蛮王等级获取。",
            cost: new Decimal(60),
            effect() {
            let exponent = hasChallenge('c', 21) ? 0.4 : 0.15;
            let raw = new Decimal(player.p.upgrades.length).add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23) return false;
            return true;
            }
        },
        32: {    
            title: "团结一心",
            description: "基于本次蛮王重置的时间增益蛮王等级获取。",
            cost: new Decimal(80),
            effect() {
            let exponent = hasChallenge('c', 22) ? 0.4 : 0.15;
            let base= hasChallenge('c', 22) ? player.a.resetTime : player.p.resetTime;
            let raw = new Decimal(base).add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 22 || player.c.activeChallenge === 23) return false;
            return true;
            }
        },
        33: {    
            title: "万灵统一",
            description: "基于本次蛮王重置的时间增益蛮王经验值获取。",
            cost: new Decimal(112),
            effect() {
            let exponent = hasChallenge('c', 22) ? 0.5 : 0.2;
            let base= hasChallenge('c', 22) ? player.a.resetTime : player.p.resetTime;
            let raw = new Decimal(base).add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 22 || player.c.activeChallenge === 23) return false;
            return true;
            },

        },
        41: {    
            title: "Wv之力",
            description: "基于已经完成的成就数量增益蛮王经验值获取。",
            cost: new Decimal(9e15),
            effect() {
            let exponent = hasChallenge('c', 21) ? 0.5 : 0.2;
            let raw = new Decimal(player.a.achievements.length).add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23) return false;
            return hasChallenge('c', 12);
            }
        },
        42: {    
            title: "bonker之力",
            description: "基于Ethelse增益蛮王经验值获取。",
            cost: new Decimal(3.14e16),
            effect() {
            let exponent = hasChallenge('c', 13) ? 0.5 : 0.2;
            let raw = buyableEffect("k", 21).mul(buyableEffect("k", 23)).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23) return false;
            return hasChallenge('c', 12);
            },

        },
        43: {    
            title: "Waelen之力",
            description: "基于狂战士营人口增益蛮王经验值获取。",
            cost: new Decimal(1e17),
            effect() {
            let exponent = hasChallenge('c', 13) ? 0.5 : 0.2;
            let raw = player.b.points.add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23) return false;
            return hasChallenge('c', 12);
            },

        },
        
        
    },
    automate() {
    if (hasMilestone("k", 1)) {
        quickUpgBuy("p", [11, 12, 13]);
        }
    if (hasMilestone("k", 2)) {
        quickUpgBuy("p", [21, 22, 23]);
        }
    if (hasMilestone("k", 3)) {
        quickUpgBuy("p", [31, 32, 33]);
        }
    },
    passiveGeneration() {
            let pg=new Decimal(0);
            if(hasMilestone("b",1)) pg=new Decimal(0.01)
            if(hasUpgrade("b",11)) pg=new Decimal(0.1)
            if(hasUpgrade("b",12)) pg=new Decimal(1)
            if(hasUpgrade("b",13)) pg=new Decimal(10)
            if(hasUpgrade("b",14)) pg=new Decimal(100)
            return pg;
    },
    doReset(resettingLayer){
        let keep=[]
        if (hasMilestone('c', 1)) {
        keep.push("upgrades");
        }
        if(layers[resettingLayer].row>=1){
            player.b.power = new Decimal(0);
            player.k.milk = new Decimal(0);
            layerDataReset(this.layer, keep);
        }
    },
    tabFormat: {
    "蛮王": {
        content: [
            'main-display',
            'prestige-button',
            ['display-text', function() {
            let threshold = getCurrentThreshold();
            if (player.p.points.gte(threshold)) {
            let logPoints = player.p.points.log10();
            let logThreshold = threshold.log10();
            let delta = logPoints.sub(logThreshold).add(1);
            if (delta.gt(1)) {
            return `天意使你的蛮王等级获取开 <h3 style="color: #3fffff; text-shadow: 10px">${format(delta)}</h3> 次根！`;
            }
            }
        }],
        'upgrades',
        ]
    }
    },
    style: {
        background: "linear-gradient(135deg, #000000, #1f1f1f)",
        minHeight: "100vh"
    },
    layerShown(){return true}
})
addLayer("k", {
    name: "骑士", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "K", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        milk: new Decimal(0),
        milkGainRate: new Decimal(0),
    }},
    color: "#bfbfbf",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "骑士团人口", // Name of prestige currency
    baseResource: "蛮王等级", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    branches:["p"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        mult = mult.times(buyableEffect('k', 21))
        mult = mult.times(buyableEffect('k', 23))
        if (hasUpgrade('b', 23)) mult = mult.times(upgradeEffect('b', 23))
        if (hasUpgrade('e', 11)) mult = mult.times(upgradeEffect('e', 11))
        let threshold = getCurrentThreshold();
        if (player.k.points.gte(threshold)) {
        let logPoints = player.k.points.log10();
        let logThreshold = threshold.log10();
        let delta = logPoints.sub(logThreshold).add(1);
        if (delta.gt(0)) {
        let exponent = Decimal.dOne.div(delta);
        mult = mult.pow(exponent);
        }
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "K: Reset for Knight", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
    buyables: {
        11: {
            title: "Anya",
            cost(x) { return new Decimal(1).mul(x).add(1) },
            display() {return "增益蛮王经验值获取。<br>需要"+format(this.cost())+"骑士团人口<br>Currently:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() { 
            if (isKnightDisabled()) return false;
            return player[this.layer].points.gte(this.cost());
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(getBuyableAmount(this.layer, this.id)).add(1)
            },
        },
        12: {
            title: "Verbole",
            cost(x) { return new Decimal(1).mul(x).mul(10).add(10) },
            display() {return "增益蛮王等级获取。<br>需要"+format(this.cost())+"骑士团人口<br>Currently:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() { 
            if (isKnightDisabled()) return false;
            return player[this.layer].points.gte(this.cost());
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(getBuyableAmount(this.layer, this.id)).add(1)
            },
        },
        13: {
            title: "Frithpaul",
            cost(x) { return new Decimal(1).mul(x).mul(22).add(22) },
            display() {return "增益第四个骑士里程碑的效果。<br>需要"+format(this.cost())+"骑士团人口<br>Currently:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() { 
            if (isKnightDisabled()) return false;
            return player[this.layer].points.gte(this.cost());
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(getBuyableAmount(this.layer, this.id)).add(1)
            },
            
        },
        21: {
            title: "Ethelse",
            cost(x) { return new Decimal(1).mul(x).pow(x) },
            display() {return "增益骑士团人口获取。<br>需要"+format(this.cost())+"骑士团人口<br>Currently:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() { 
            if (isKnightDisabled()) return false;
            return player[this.layer].points.gte(this.cost());
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(getBuyableAmount(this.layer, this.id)).add(1)
            },
            unlocked()
            {return hasMilestone('k',5)},
            
        },
        22: {
            title: "Galdor",
            cost(x) { return new Decimal(1).add(x).mul(x).pow(x) },
            display() {return "增益狂战士营人口的生成效果。<br>需要"+format(this.cost())+"骑士团人口<br>Currently:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() { 
            if (isKnightDisabled()) return false;
            return player[this.layer].points.gte(this.cost());
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(getBuyableAmount(this.layer, this.id)).add(1)
            },
            unlocked()
            {return hasMilestone('b',2)},
            
        },
        23: {
            title: "骑士道",
            cost(x) { return new Decimal(2).add(x).mul(x).pow(x) },
            display() {return "增益前四位骑士的效果。<br>需要"+format(this.cost())+"骑士团人口<br>Currently:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() { 
            if (isKnightDisabled()) return false;
            return player[this.layer].points.gte(this.cost());
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(getBuyableAmount(this.layer, this.id)).add(1)
            },
            unlocked()
            {return  hasChallenge('c', 23)},
            
        },
    },
    milestonePopups: false,
    milestones:{
        1:
        {
        requirementDescription:"2 骑士团人口",
        effectDescription:"自动购买第一行蛮王升级。",
        done() {return player.k.points.gte(2)},
        onComplete() {
            quickUpgBuy("p", [11, 12, 13]);
            doPopup("milestone", "2 骑士团人口", "里程碑达成", 3, "#AFAFAF");
        }
        },
        2:
        {
        requirementDescription:"4 骑士团人口",
        effectDescription:"自动购买第二行蛮王升级。",
        done() {return player.k.points.gte(4)},
        onComplete() {
            quickUpgBuy("p", [21, 22, 23]);
            doPopup("milestone", "4 骑士团人口", "里程碑达成", 3, "#AFAFAF");
        }
        },
        3:
        {
        requirementDescription:"7 骑士团人口",
        effectDescription:"自动购买第三行蛮王升级。",
        done() {return player.k.points.gte(7)},
        onComplete() {
            quickUpgBuy("p", [31, 32, 33]);
            doPopup("milestone", "7 骑士团人口", "里程碑达成", 3, "#AFAFAF");
        }
        },
        4:
        {
        requirementDescription:"10 骑士团人口",
        effectDescription:"每帧获得 1 蛮王等级。",
        eff() {
        if(hasMilestone('k',4))
        player.p.points=player.p.points.add(buyableEffect('k', 13)).add(buyableEffect('k', 23))
        },
        done() {return player.k.points.gte(10)},
        onComplete() {
            doPopup("milestone", "10 骑士团人口", "里程碑达成", 3, "#AFAFAF");
        }
        },
        5:
        {
        requirementDescription:"47 骑士团人口",
        effectDescription:"解锁第四位骑士。",
        done() {return player.k.points.gte(47)},
        onComplete() {
            doPopup("milestone", "47 骑士团人口", "里程碑达成", 3, "#AFAFAF");
        }
        },
        6:
        {
        requirementDescription:"200 骑士团人口",
        effectDescription:"解锁狂战士营。",
        done() {return player.k.points.gte(200)},
        onComplete() {
            doPopup("milestone", "200 骑士团人口", "里程碑达成", 3, "#AFAFAF");
        }
        },
        7:
        {
        requirementDescription:"9e15 骑士团人口",
        effectDescription:"解锁增强者。",
        done() {return player.k.points.gte(9e15)},
        onComplete() {
            doPopup("milestone", "9e15 骑士团人口", "里程碑达成", 3, "#AFAFAF");
        }
        },
    },
    automate() {
        if (hasMilestone("b", 3)) {
            if (canBuyBuyable("k", 11)) buyBuyable("k", 11);
            if (canBuyBuyable("k", 12)) buyBuyable("k", 12);
            if (canBuyBuyable("k", 13)) buyBuyable("k", 13);
        }
        if (hasAchievement("a", 22)) {
        if (canBuyBuyable("k", 21)) buyBuyable("k", 21);
        if (canBuyBuyable("k", 22)) buyBuyable("k", 22);
        if (canBuyBuyable("k", 23)) buyBuyable("k", 23);
        }
    },
    update(diff) {
    if (player.milkUnlocked) {
        let gainPerSecond = buyableEffect("k",21).times(buyableEffect("k",22)).times(buyableEffect("k",23));
        player.k.milkGainRate = gainPerSecond;
        let gain = gainPerSecond.times(diff);
        player.k.milk = player.k.milk.add(gain);
    }
    },
    tabFormat:{
        '骑士':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你有 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milk)}</h3> 牛奶,该数值可以增加天意阈值`}
            ],
            ['display-text', function() {
                    return `你每秒获得 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milkGainRate)}</h3> 牛奶`;
            }],
            'prestige-button',
            ['display-text', function() {
            let threshold = getCurrentThreshold();
            if (player.k.points.gte(threshold)) {
            let logPoints = player.k.points.log10();
            let logThreshold = threshold.log10();
            let delta = logPoints.sub(logThreshold).add(1);
            if (delta.gt(1)) {
            return `天意使你的骑士团人口获取开 <h3 style="color: #3fffff; text-shadow: 10px">${format(delta)}</h3> 次根！`;
            }
            }
            }],
            'buyables',
            ],
        },
        '里程碑':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你有 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milk)}</h3> 牛奶,该数值可以增加天意阈值`}
            ],
            ['display-text', function() {
                    return `你每秒获得 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milkGainRate)}</h3> 牛奶`;
            }],
            'prestige-button',
            ['display-text', function() {
            let threshold = getCurrentThreshold();
            if (player.k.points.gte(threshold)) {
            let logPoints = player.k.points.log10();
            let logThreshold = threshold.log10();
            let delta = logPoints.sub(logThreshold).add(1);
            if (delta.gt(1)) {
            return `天意使你的骑士团人口获取开 <h3 style="color: #3fffff; text-shadow: 10px">${format(delta)}</h3> 次根！`;
            }
            }
            }],
            'milestones',
            ],
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3f3f3f",
        minHeight: "100vh"
    },
    layerShown(){return hasUpgrade('p',33)||hasMilestone('k',1)},
})
addLayer("b", {
    name: "狂战士", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        power: new Decimal(0),
        powerGainRate: new Decimal(0),
    }},
    color: "#af0000",
    requires: new Decimal(200000), // Can be a function that takes requirement increases into account
    resource: "狂战士营人口", // Name of prestige currency
    baseResource: "蛮王等级", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    branches:["p"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for Berserker", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
    milestones:{
        1:
        {
        requirementDescription:"3 狂战士营人口",
        effectDescription:"每秒获得蛮王重置能够获得的蛮王等级的1%。",
        done() {return player.b.points.gte(3)}
        },
        2:
        {
        requirementDescription:"9 狂战士营人口",
        effectDescription:"解锁第五位骑士。",
        done() {return player.b.points.gte(9)}
        },
        3:
        {
        requirementDescription:"27 狂战士营人口",
        effectDescription:"自动购买第一行骑士可购买。",
        done() {return player.b.points.gte(27)}
        },
        4:
        {
        requirementDescription:"36 狂战士营人口",
        effectDescription:"解锁挑战精神。",
        done() {return player.b.points.gte(36)}
        },
    },
    update(diff) {
    let delta = new Decimal(diff);
    let oldPower = player.b.power;   // 记录更新前的狂怒能量
    if (!hasUpgrade('b', 21)) {
        player.b.power = player.b.power.add(delta.times(player.b.points));
    } else if (!hasMilestone('b', 2)) {
        player.b.power = player.b.power.add(delta.times(player.b.points)).add(upgradeEffect("b",21));
    } else if (!hasUpgrade('b', 22)) {
        player.b.power = player.b.power.add(delta.times(player.b.points.times(buyableEffect("k",22))).times(upgradeEffect("b",21)));
    } else if (!hasUpgrade('b', 24)) {
        player.b.power = player.b.power.add(delta.times(player.b.points.pow(buyableEffect("k",22))).times(upgradeEffect("b",21)));
    } else {
        player.b.power = player.b.power.add(delta.times(player.b.points.pow(buyableEffect("k",22))).times(player.k.points).times(upgradeEffect("b",21)));
    }
    let gain = player.b.power.sub(oldPower);
    player.b.powerGainRate = gain.div(diff);
    },
    upgrades:{
     11: {    
            title: "扩张 I",
            description: "十倍化第一个狂战士里程碑的效果。<br>",
            cost: new Decimal(4),
            effect() {
                return 10
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect
        },
        12: {    
            title: "扩张 II",
            description: "十倍化第一个狂战士里程碑的效果。<br>",
            cost: new Decimal(5),
            effect() {
                return 10
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect

        },
        13: {    
            title: "扩张 III",
            description: "十倍化第一个狂战士里程碑的效果。<br>",
            cost: new Decimal(6),
            effect() {
                return 10
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect
        },
        14: {    
            title: "扩张 IV",
            description: "十倍化第一个狂战士里程碑的效果。<br>",
            cost: new Decimal(7),
            effect() {
                return 10
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect
        },
        21: {    
            title: "合作协同",
            description: "Frithpaul增益狂怒能量获取。<br>",
            cost: new Decimal(8),
            effect() {
                return buyableEffect("k", 13).mul(buyableEffect("k", 23)).pow(0.5)
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect
        },
        22: {    
            title: "信息传递",
            description: "优化Galdor的公式。<br>",
            cost: new Decimal(16),

        },
        23: {    
            title: "交流互鉴",
            description: "狂怒能量也可以增益骑士团人口获取。<br>",
            cost: new Decimal(20),
            effect() {
                return getFuryBonus(player.b.power)
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect
        },
        24: {    
            title: "合作共赢",
            description: "骑士团人口影响狂怒能量获取。<br>",
            cost: new Decimal(24),
            effect() {
                return player.k.points
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect

        },
    },
    automate() {
    if (hasMilestone("e", 1)) {
        quickUpgBuy("b", [11, 12, 13, 14]);
        }
    if (hasMilestone("e", 2)) {
        quickUpgBuy("b", [21, 22, 23, 24]);
        }
    if (hasMilestone('e', 3)) {
        const bUpgradeIds = [11, 12, 13, 14];
        for (let id of bUpgradeIds) {
            if (!player.b.upgrades.includes(id)) {
                player.b.upgrades.push(id);
            }
        }
    }
    if (hasMilestone('e', 4)) {
        const bUpgradeIds = [21,22,23,24];
        for (let id of bUpgradeIds) {
            if (!player.b.upgrades.includes(id)) {
                player.b.upgrades.push(id);
            }
        }
    }
    },
    tabFormat:{
        '升级':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你有 <h3 style="color: #7f0000; text-shadow: 10px">${format(player.b.power)}</h3> 狂怒能量,为你的蛮王提供 <h3 style="color: #7f0000; text-shadow: 10px">${format(getFuryBonus(player.b.power))}</h3> 倍率的经验值和等级`}
            ],
            ['display-text', function() {
                    return `你每秒获得 <h3 style="color: #7f0000; text-shadow: 10px">${format(player.b.powerGainRate)}</h3> 狂怒能量`;
            }],
            'prestige-button',
            'upgrades',
            ],
        },
        '里程碑':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你有 <h3 style="color: #7f0000; text-shadow: 10px">${format(player.b.power)}</h3> 狂怒能量,为你的蛮王提供 <h3 style="color: #7f0000; text-shadow: 10px">${format(getFuryBonus(player.b.power))}</h3> 倍率的经验值和等级`}
            ],
            ['display-text', function() {
                    return `你每秒获得 <h3 style="color: #7f0000; text-shadow: 10px">${format(player.b.powerGainRate)}</h3> 狂怒能量`;
            }],
            'prestige-button',
            'milestones',
            ],
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3f0000)",
        minHeight: "100vh"
    },
    layerShown(){return hasMilestone('k',6)||player.b.points.gte(1)},
    })
addLayer("c", {
    name: "挑战者", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#7fff7f",
    requires: new Decimal(36), // Can be a function that takes requirement increases into account
    resource: "挑战精神", // Name of prestige currency
    baseResource: "狂战士营人口", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 16, // Prestige currency exponent
    branches:["b"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for Competitor", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
    milestones:{
        1:
        {
        requirementDescription:"2 挑战精神",
        effectDescription:"蛮王升级不再被重置。",
        done() {return player.c.points.gte(2)}
        },
        2:
        {
        requirementDescription:"3 挑战精神",
        effectDescription:"解锁第一个挑战。",
        done() {return player.c.points.gte(3)}
        },
        3:
        {
        requirementDescription:"5 挑战精神",
        effectDescription:"解锁第二个挑战。",
        done() {return player.c.points.gte(5)}
        },
        4:
        {
        requirementDescription:"10 挑战精神",
        effectDescription:"解锁第三个挑战。",
        done() {return player.c.points.gte(10)}
        },
        5:
        {
        requirementDescription:"15 挑战精神",
        effectDescription:"解锁第四个挑战。",
        done() {return player.c.points.gte(15)}
        },
        6:
        {
        requirementDescription:"25 挑战精神",
        effectDescription:"解锁第五个挑战。",
        done() {return player.c.points.gte(25)}
        },
        7:
        {
        requirementDescription:"40 挑战精神",
        effectDescription:"解锁第六个挑战。",
        done() {return player.c.points.gte(40)}
        },
    },
    challenges: {
        11: {
        name: "Tchef",
        challengeDescription: "禁用骑士。",
        goal: new Decimal(4095),
        goalDescription: "4095 蛮王等级",
        rewardDescription: "蛮王升级的硬上限改为软上限（超过100倍后缓慢增长）。",
        canComplete() {
            return player.p.points.gte(4095);
        },
        onComplete() {
            doPopup("challenge", "Tchef 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',2)
        }
        },
        12: {
        name: "Gunaar",
        challengeDescription: "在 Tchef 的基础上，蛮王升级的软上限阈值变为 2（而非 100）。",
        goal: new Decimal(8191),
        goalDescription: "8191 蛮王等级",
        rewardDescription: "解锁第四行蛮王升级。",
        canComplete() {
            return player.p.points.gte(8191);
        },
        onComplete() {
            doPopup("challenge", "Gunaar 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',3)
        }
        },
        13: {
        name: "Lightadapt",
        challengeDescription: "在 Gunaar 的基础上，禁用蛮王升级 11 42 43。",
        goal: new Decimal(16383),
        goalDescription: "16383 蛮王等级",
        rewardDescription: "提高新的被禁用升级的效果。",
        canComplete() { return player.p.points.gte(16383); },
        onComplete() {
            doPopup("challenge", "Lightadapt 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',4)
        }
        },
        21: {
        name: "Ayabehaori & Jaxinator",
        challengeDescription: "在 Lightadapt 的基础上，禁用蛮王升级 23 31 41。",
        goal: new Decimal(32767),
        goalDescription: "32767 蛮王等级",
        rewardDescription: "提高新的被禁用升级的效果。",
        canComplete() { return player.p.points.gte(32767); },
        onComplete() {
            doPopup("challenge", "Ayabehaori & Jaxinator", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',5)
        }
        },
        22: {
        name: "Sangyu & Bitdotdo",
        challengeDescription: "在 Ayabehaori & Jaxinator 的基础上，禁用蛮王升级 32 33。",
        goal: new Decimal(65535),
        goalDescription: "65535 蛮王等级",
        rewardDescription: "提高新的被禁用升级的效果,且时间不再会被重置。",
        canComplete() { return player.p.points.gte(65535); },
        onComplete() {
            doPopup("challenge", "Sangyu & Bitdotdo", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',6)
        }
        },
        23: {
        name: "Drewdrinks",
        challengeDescription: "在 Sangyu & Bitdotdo 的基础上，天意的阈值变为 1（而非 9e15）。",
        goal: new Decimal(99999),
        goalDescription: "99999 蛮王等级",
        rewardDescription: "解锁第六个骑士可购买。",
        canComplete() { return player.p.points.gte(99999); },
        onComplete() {
        doPopup("challenge", "Drewdrinks 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',7)
        }
        }
    },
    tabFormat:{
        '挑战':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你的挑战精神为你的蛮王提供 <h3 style="color: #7fff7f; text-shadow: 10px">${format(player.c.points.pow(0.5).add(1))}</h3> 倍率的经验值和等级`}
            ],
            'prestige-button',
            'challenges',
            ],
        },
        '里程碑':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你的挑战精神为你的蛮王提供 <h3 style="color: #7fff7f; text-shadow: 10px">${format(player.c.points.pow(0.5).add(1))}</h3> 倍率的经验值和等级`}
            ],
            'prestige-button',
            'milestones',
            ],
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #003f00)",
        minHeight: "100vh"
    },
    layerShown(){return hasMilestone('b',4)||player.c.points.gte(1)},
    })
addLayer("e", {
    name: "增强者",
    symbol: "E",
    position: 0,
    startData() { return { unlocked: true, points: new Decimal(0) }; },
    color: "#bf00ff",
    requires: new Decimal(9e15),
    resource: "增强器",
    baseResource: "骑士团人口",
    baseAmount() { return player.k.points; },
    type: "normal",
    exponent: 0.1,
    branches: ["k"],
    gainMult() {
        let mult = new Decimal(1);
        return mult;
    },
    gainExp() { return new Decimal(1); },
    row: 2,
    hotkeys: [{ key: "e", description: "E: Reset for Enhancer", onPress() { if (canReset(this.layer)) doReset(this.layer); } }],
    
    upgrades: {
        11: {
            title: "骑士编制",
            description: "挑战精神也可以增益骑士团人口获取。<br>",
            cost: new Decimal(1),
            effect() {
                
                return player.c.points.pow(0.5).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x"; }
        },
        12: {
        title: "武器冶炼",
        description: "削弱蛮王升级的软上限。",
        cost: new Decimal(4)
        },
        13: {
        title: "营地扩建",
        description: "狂怒能量的效果由提高。",
        cost: new Decimal(5)
        },
        14: {
        title: "Milkisgood",
        description: "解锁牛奶资源。",
        cost: new Decimal(6),
        onPurchase() {
        player.milkUnlocked = true;
        if (player.k.milk.eq(0)) player.k.milk = new Decimal(1);
        },
    }
    },
    
    tabFormat: {
        "升级": {
            content: ['main-display', 'prestige-button', 'upgrades']
        },
        "里程碑": {
            content: ['main-display', 'prestige-button', 'milestones']
        }
    },

    milestones:{
        1:
        {
        requirementDescription:"2 增强器",
        effectDescription:"自动购买第一行狂战士升级。",
        done() {return player.e.points.gte(2)}
        },
        2:
        {
        requirementDescription:"3 增强器",
        effectDescription:"自动购买第二行狂战士升级。",
        done() {return player.e.points.gte(3)}
        },
        3:
        {
        requirementDescription:"7 增强器",
        effectDescription:"免费自动购买第一行狂战士升级。",
        done() {return player.e.points.gte(7)}
        },
        4:
        {
        requirementDescription:"13 增强器",
        effectDescription:"免费自动购买第二行狂战士升级。",
        done() {return player.e.points.gte(13)}
        },
    },

    style: {
        background: "linear-gradient(135deg, #000000, #1f003f)",
        minHeight: "100vh",
    },
    layerShown() { return hasMilestone('k', 7) || player.e.points.gte(1); }
});
