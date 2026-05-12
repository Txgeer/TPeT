function applySoftcap(value) {
    let cap = new Decimal(100);
    if (hasChallenge('c', 11)) {
        if (value.lte(cap)) return value;
        let excess = value.sub(cap);
        let logGrowth = Decimal.log10(excess).add(1);
        return cap.add(logGrowth);
    } else {
        return value.min(cap);
    }
}
addLayer("a", {
    name: "成就", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1e10),
    }},
    color: "#FFFF3F",
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
        tooltip: "要求：获得 9 蛮王等级",
        done() {return player.p.points.gte(9)},
    },
    12: {
        name: "每个人都很棒！",
        tooltip: "要求：获得每种第一行骑士可购买。<br>奖励：翻倍蛮王经验值与蛮王等级获取。",
        done() {return getBuyableAmount("k", 11).gte(1)&&getBuyableAmount("k", 12).gte(1)&&getBuyableAmount("k", 13).gte(1)},
        effect() {
                return 2
            },
        effectDisplay() { return format(achievementEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
    },
    13: {
        name: "狂战营生成器",
        tooltip: "要求：获得 2000000 蛮王等级",
        done() {return player.p.points.gte(2000000)},
    },
    14: {
        name: "怒气冲天",
        tooltip: "要求：获得 9e15 狂怒能量",
        done() {return player.b.power.gte(9e15)},
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
    color: "#7F7F7F",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "蛮王等级", // Name of prestige currency
    baseResource: "蛮王经验值", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
        if (hasUpgrade('p', 31)) mult = mult.times(upgradeEffect('p', 31))
        if (hasUpgrade('p', 32)) mult = mult.times(upgradeEffect('p', 32))
        mult = mult.times(upgradeEffect('p', 32))
        if (hasAchievement('a', 12)) mult = mult.times(achievementEffect('a', 12));
        return mult
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
                return 2
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect


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
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
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
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect


        },
        21: {    
            title: "吾即是王",
            description: "基于你的蛮王等级增益蛮王等级获取。",
            cost: new Decimal(12),
            effect() {
            let raw = player[this.layer].points.add(1).pow(0.15);
            return applySoftcap(raw);
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
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
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect

        },
        23: {    
            title: "源远流长",
            description: "基于蛮王升级的数量增益蛮王经验值获取。",
            cost: new Decimal(45),
            effect() {
            let raw = new Decimal(player.p.upgrades.length).add(1).pow(0.2);
            return applySoftcap(raw);
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect


        },
        31: {    
            title: "博大精深",
            description: "基于蛮王升级的数量增益蛮王等级获取。",
            cost: new Decimal(60),
            effect() {
            let raw = new Decimal(player.p.upgrades.length).add(1).pow(0.15);
            return applySoftcap(raw);
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect

        },
        32: {    
            title: "团结一心",
            description: "基于本次蛮王重置的时间增益蛮王等级获取。",
            cost: new Decimal(80),
            effect() {
            let raw = new Decimal(player.p.resetTime).add(1).pow(0.15);
            return applySoftcap(raw);
            },
            effectDisplay() { 
                if (hasUpgrade(this.layer, this.id)) 
                return format(upgradeEffect(this.layer, this.id)) + "x"; 
                else 
                return "1.00x";
            }// Add formatting to the effect

        },
        33: {    
            title: "万灵统一",
            description: "基于本次蛮王重置的时间增益蛮王经验值获取。",
            cost: new Decimal(110),
            effect() {
            let raw = new Decimal(player.p.resetTime).add(1).pow(0.2);
            return applySoftcap(raw);
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
            player.b.power=new Decimal(0)
            layerDataReset(this.layer,keep)
        }
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
    }},
    color: "#AFAFAF",
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
        mult = mult.times(player.b.power.pow(0.1).add(1))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "K: Reset for Knight", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
    layerShown(){return hasUpgrade('p',33)||hasMilestone('k',1)},
    buyables: {
        11: {
            title: "Anya",
            cost(x) { return new Decimal(1).mul(x).add(1) },
            display() {return "增益蛮王经验值获取。<br>需要"+format(this.cost())+"骑士团人口<br>Currently:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() { 
            if (player.c.activeChallenge === 11) return false;
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
            if (player.c.activeChallenge === 11) return false;
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
            if (player.c.activeChallenge === 11) return false;
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
            if (player.c.activeChallenge === 11) return false;
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
            if (player.c.activeChallenge === 11) return false;
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
    },
    milestones:{
        1:
        {
        requirementDescription:"2 骑士团人口",
        effectDescription:"自动购买第一行蛮王升级。",
        done() {return player.k.points.gte(2)},
        onComplete() {
            quickUpgBuy("p", [11, 12, 13]);
        }
        },
        2:
        {
        requirementDescription:"4 骑士团人口",
        effectDescription:"自动购买第二行蛮王升级。",
        done() {return player.k.points.gte(4)},
        onComplete() {
            quickUpgBuy("p", [21, 22, 23]);
        }
        },
        3:
        {
        requirementDescription:"7 骑士团人口",
        effectDescription:"自动购买第三行蛮王升级。",
        done() {return player.k.points.gte(7)},
        onComplete() {
            quickUpgBuy("p", [31, 32, 33]);
        }
        },
        4:
        {
        requirementDescription:"10 骑士团人口",
        effectDescription:"每帧获得 1 蛮王等级。",
        eff() {
        if(hasMilestone('k',4))
        player.p.points=player.p.points.add(buyableEffect('k', 13))
        },
        done() {return player.k.points.gte(10)}
        },
        5:
        {
        requirementDescription:"43 骑士团人口",
        effectDescription:"解锁第四位骑士。",
        done() {return player.k.points.gte(43)}
        },
    },
    automate() {
        if (hasMilestone("b", 3)) {
            if (canBuyBuyable("k", 11)) buyBuyable("k", 11);
            if (canBuyBuyable("k", 12)) buyBuyable("k", 12);
            if (canBuyBuyable("k", 13)) buyBuyable("k", 13);
        }
    },
    tabFormat:{
        '骑士':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            'prestige-button',
            'blank',
            'blank',
            'buyables',
            ],
        },
        '里程碑':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            'prestige-button',
            'blank',
            'milestones',
            ],
        },
    },
})
addLayer("b", {
    name: "狂战士", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        power: new Decimal(0),
    }},
    color: "#AF0000",
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
        requirementDescription:"2 狂战士营人口",
        effectDescription:"每秒获得蛮王重置能够获得的蛮王等级的1%。",
        done() {return player.b.points.gte(2)}
        },
        2:
        {
        requirementDescription:"8 狂战士营人口",
        effectDescription:"解锁第五位骑士。",
        done() {return player.b.points.gte(8)}
        },
    3:
        {
        requirementDescription:"12 狂战士营人口",
        effectDescription:"自动购买第一行骑士可购买。",
        done() {return player.b.points.gte(12)}
        },
    },
    getpower() {
        if (!hasUpgrade('b', 21)) player.b.power=player.b.power.add(player.tick.times(player.b.points))
        else if (!hasMilestone('b', 2)) player.b.power=player.b.power.add(player.tick.times(player.b.points)).add(upgradeEffect("b",21))
        else if (!hasUpgrade('b', 22)) player.b.power=player.b.power.add(player.tick.times(player.b.points.times(buyableEffect("k",22))).times(upgradeEffect("b",21)))
        else if (!hasUpgrade('b', 24)) player.b.power=player.b.power.add(player.tick.times(player.b.points.pow(buyableEffect("k",22))).times(upgradeEffect("b",21)))
        else player.b.power=player.b.power.add(player.tick.times(player.b.points.pow(buyableEffect("k",22))).times(player.k.points).times(upgradeEffect("b",21)))
    },
    upgrades:{
     11: {    
            title: "扩张 I",
            description: "十倍化第一个狂战士里程碑的效果。<br>",
            cost: new Decimal(3),
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
        13: {    
            title: "扩张 III",
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
        14: {    
            title: "扩张 IV",
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
        21: {    
            title: "合作协同",
            description: "Frithpaul增益狂怒能量获取。<br>",
            cost: new Decimal(7),
            effect() {
                return getBuyableAmount("k", 13).pow(0.5)
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
            description: "狂怒能量影响骑士团人口获取。<br>",
            cost: new Decimal(20),

        },
        24: {    
            title: "合作共赢",
            description: "骑士团人口影响狂怒能量获取。<br>",
            cost: new Decimal(22),

        },
    },
    tabFormat:{
        '升级':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你有 <h3 style="color: #7F0000; text-shadow: 10px">${format(player.b.power)}</h3> 狂怒能量,为你的蛮王提供 <h3 style="color: #7F0000; text-shadow: 10px">${format(player.b.power.pow(0.1).add(1))}</h3> 倍率的经验值`}
            ],
            'prestige-button',
            'blank',
            'blank',
            'upgrades',
            ],
        },
        '里程碑':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你有 <h3 style="color: #7F0000; text-shadow: 10px">${format(player.b.power)}</h3> 狂怒能量,为你的蛮王提供 <h3 style="color: #7F0000; text-shadow: 10px">${format(player.b.power.pow(0.1).add(1))}</h3> 倍率的经验值`}
            ],
            'prestige-button',
            'blank',
            'milestones',
            ],
        },
    },
    layerShown(){return player.k.points.gte(200)||player.b.points.gte(1)},
    })
addLayer("c", {
    name: "挑战者", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#7FFF7F",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "挑战精神", // Name of prestige currency
    baseResource: "狂战士营人口", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 10, // Prestige currency exponent
    branches:["k"],
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
        effectDescription:"蛮王升级不再重置。",
        done() {return player.c.points.gte(2)}
        },
        2:
        {
        requirementDescription:"3 挑战精神",
        effectDescription:"解锁第一个挑战。",
        done() {return player.c.points.gte(3)}
        },
    },
    challenges: {
        11: {
        name: "Tchef",
        challengeDescription: "禁用骑士。",
        goal: new Decimal(2047),
        goalDescription: "2047 蛮王等级",
        rewardDescription: "蛮王升级的硬上限改为软上限（超过100倍后缓慢增长）。",
        canComplete() {
            return player.p.points.gte(2047);
        },
        onComplete() {
            doPopup("challenge", "Tchef 挑战完成！", "挑战完成", 3, "#7FFF7F");
        },
        },
    },
    tabFormat:{
        '挑战':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {
            	return `你的挑战精神为你的蛮王提供 <h3 style="color: #7FFF7F; text-shadow: 10px">${format(player.c.points.pow(0.5).add(1))}</h3> 倍率的经验值`}
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
            	return `你的挑战精神为你的蛮王提供 <h3 style="color: #7FFF7F; text-shadow: 10px">${format(player.c.points.pow(0.5).add(1))}</h3> 倍率的经验值`}
            ],
            'prestige-button',
            'milestones',
            ],
        },
    },
    layerShown(){return player.b.points.gte(25)||player.c.points.gte(1)},
    })
