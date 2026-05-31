function applySoftcap(value) {
    let isSoftcap = false;
    let cap = new Decimal(100);
    if (player.c.activeChallenge === 12 || player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || 
        player.c.activeChallenge === 22 || player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || 
        player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12) {
        isSoftcap = true;
        cap = new Decimal(2);
    } else if (player.c.activeChallenge === 11) {
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
    return player.c.activeChallenge === 11 || player.c.activeChallenge === 12 || player.c.activeChallenge === 13 || 
    player.c.activeChallenge === 21 || player.c.activeChallenge === 22 || player.c.activeChallenge === 23 || 
    player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
    player.cr.activeChallenge === 12;
}
function getUpgradeDisplay(layer, id) {
    let eff = upgradeEffect(layer, id);
    let formatted = format(eff) + "x";
    if (player.c.activeChallenge === 11 && player.c.activeChallenge === 12 && player.c.activeChallenge === 13 && 
    player.c.activeChallenge === 21 && player.c.activeChallenge === 22 && player.c.activeChallenge === 23 && 
    player.c.activeChallenge === 31 && player.c.activeChallenge === 32 && player.cr.activeChallenge === 11 && 
    player.cr.activeChallenge === 12 && eff.gt(2)) {
        return formatted + "（受软上限限制）";
    }
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
    if (player.g.points.gte(1)) {
        let safeEnergy = player.g.energy.max(1);
        return (safePower.log2().add(1)).times(safeEnergy.log2().add(1));
    } else if (hasUpgrade('e', 13)) {
        return safePower.log2().add(1);
    } else {
        return safePower.ln().add(1);
    }
}
function getCurrentThreshold() {
    let baseThreshold;
    if (player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || 
        player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12) {
        baseThreshold = new Decimal(2);
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
        tooltip: "要求：获得 9 蛮王等级。<br>奖励：解锁5个新的蛮王升级。",
        done() {return player.p.points.gte(9)},
    },
    12: {
        name: "每个人都很棒！",
    tooltip: function() {
        if (hasAchievement(this.layer, this.id)) {
            let eff = achievementEffect(this.layer, this.id);
            return `要求：获得每种第一行骑士可购买。<br>奖励：翻倍蛮王经验值与蛮王等级获取。<br>当前：${format(eff)}x`;
        } else {
            return `要求：获得每种第一行骑士可购买。<br>奖励：翻倍蛮王经验值与蛮王等级获取。<br>当前：1.00x`;
        }
    },
        done() {return getBuyableAmount("k", 11).gte(1) &&
            getBuyableAmount("k", 12).gte(1) &&
            getBuyableAmount("k", 13).gte(1)
        },
        effect() {
                return 2
            },
    },
    13: {
        name: "狂战营生成器",
        tooltip: "要求：获得 2000000 蛮王等级。<br>奖励：解锁狂战士营升级。",
        done() {return player.p.points.gte(2000000)},
    },
    14: {
        name: "怒气冲天",
        tooltip: "要求：获得 9e15 狂怒能量。<br>奖励：解锁挑战精神。",
        done() {return player.b.power.gte(9e15)},
    },
    21: {
    name: "超越极限",
    tooltip: function() {
        if (hasAchievement(this.layer, this.id)) {
            let eff = achievementEffect(this.layer, this.id);
            return `要求：蛮王升级12的效果超过100倍。<br>奖励：挑战精神也可以增益蛮王等级。<br>当前：${format(eff)}x`;
        } else {
            return `要求：蛮王升级12的效果超过100倍。<br>奖励：挑战精神也可以增益蛮王等级。<br>当前：1.00x`;
        }
    },
    done() {
        return upgradeEffect('p', 12).gt(100);
    },
    effect() {
            return player.c.points.pow(0.5).add(1)
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
    23: {
    name: "强度测试",
    tooltip: "要求：一次增强者重置获得至少2个增强器。<br>奖励：解锁增强工具。",
    done() { return player.e.hasAchieved23 === true; }
    },
    24: {
    name: "色彩入侵",
    tooltip: "要求：获得10000亮青色度。<br>奖励：解锁第四个增强工具。",
    done() { return player.cr.cyanchroma.gte(10000); }
    },
    31: {
    name: "牛奶帝国",
    tooltip: function() {
        if (hasAchievement(this.layer, this.id)) {
            let eff = achievementEffect(this.layer, this.id);
            return `要求：获得1.5e9牛奶。<br>奖励：骑士道增益Linvala Hop和剑盾士混编的效果。<br>当前：${format(eff)}x`;
        } else {
            return `要求：获得1.5e9牛奶。<br>奖励：骑士道增益Linvala Hop和剑盾士混编的效果。<br>当前：1.00x`;
        }
    },
    done() { return player.k.milk.gte(1.5e9); },
    effect() {
            return buyableEffect("k",23)
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
    if (hasAchievement('a', 12)) mult = mult.times(achievementEffect('a', 12))
    mult = mult.times(buyableEffect('k', 12))
    mult = mult.times(buyableEffect('k', 23))
    mult = mult.times(getFuryBonus(player.b.power))
    mult = mult.times(player.c.points.pow(0.5).add(1))
    if (player.cr.greenchroma.gt(0)) {mult = mult.times(player.cr.greenchroma.log2().add(1))}
    let threshold = getCurrentThreshold();
    if (player.p.points.gte(threshold)) {
    let logPoints = player.p.points.log10();
    let logThreshold = threshold.log10();
    let delta = logPoints.div(logThreshold);
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
            if (player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || player.c.activeChallenge === 22 || 
                player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || 
                player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12) return false;
            return true;
            }
        },
        12: {    
            title: "金制盾牌",
            description: "基于你的蛮王等级增益蛮王经验值获取。",
            cost: new Decimal(2),
            effect(){
            let exponent = hasUpgrade('e', 22) ? 0.5 : 0.2;
            let raw = player[this.layer].points.add(1).pow(exponent);
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
            title: "吾即是王",
            description: "基于你的蛮王等级增益蛮王等级获取。",
            cost: new Decimal(15),
            effect() {
            let exponent = hasUpgrade('e', 22) ? 0.4 : 0.15;
            let raw = player[this.layer].points.add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',11)},

        },
        14: {    
            title: "Buff之力",
            description: "基于增强器增益蛮王经验值获取。",
            cost: new Decimal(1e23),
            effect() {
            let raw = player.e.points.add(1).pow(0.5);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            return hasChallenge('c', 31);
            },

        },
        21: {    
            title: "倒转斧柄",
            description: "基于你的蛮王经验值增益蛮王等级获取。",
            cost: new Decimal(4),
            effect() {
            let exponent = hasUpgrade('e', 22) ? 0.4 : 0.15;
            let raw = player.points.add(1).pow(exponent);
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
            cost: new Decimal(7),
            effect() {
            let exponent = hasUpgrade('e', 22) ? 0.5 : 0.2;
            let raw = player.points.add(1).pow(exponent);
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
            cost: new Decimal(31),
            effect() {
            let exponent = hasChallenge('c', 21) ? 0.5 : 0.2;
            let raw = new Decimal(player.p.upgrades.length).add(buyableEffect("e",14)).add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23 || 
                player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
                player.cr.activeChallenge === 12) return false;
            return hasAchievement('a',11);
            }

        },
        24: {    
            title: "饮品之力",
            description: "基于牛奶增益蛮王经验值获取。",
            cost: new Decimal(1e24),
            effect() {
            let raw = player.k.milk.add(1).pow(0.2);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            return hasChallenge('c', 31);
            },

        },
        31: {    
            title: "博大精深",
            description: "基于蛮王升级的数量增益蛮王等级获取。",
            cost: new Decimal(63),
            effect() {
            let exponent = hasChallenge('c', 21) ? 0.4 : 0.15;
            let raw = new Decimal(player.p.upgrades.length).add(buyableEffect("e",14)).add(1).pow(exponent);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23 || 
                player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
                player.cr.activeChallenge === 12) return false;
            return hasAchievement('a',11);
            }
        },
        32: {    
            title: "团结一心",
            description: "基于本次蛮王重置的时间增益蛮王等级获取。",
            cost: new Decimal(127),
            effect() {
            let exponent = hasChallenge('c', 22) ? 0.4 : 0.15;
            let base= hasChallenge('c', 22) ? player.a.resetTime : player.p.resetTime;
            let raw = new Decimal(base).add(1).mul(buyableEffect("e",11)).pow(exponent);
            if (player.cr.blackchroma.gt(0)) {raw = raw.mul(player.cr.blackchroma.log2().add(1))}
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 22 || player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || 
                player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12) return false;
            return hasAchievement('a',11);
            }
        },
        33: {    
            title: "万灵统一",
            description: "基于本次蛮王重置的时间增益蛮王经验值获取。",
            cost: new Decimal(189),
            effect() {
            let exponent = hasChallenge('c', 22) ? 0.5 : 0.2;
            let base= hasChallenge('c', 22) ? player.a.resetTime : player.p.resetTime;
            let raw = new Decimal(base).add(1).mul(buyableEffect("e",11)).pow(exponent);
            if (player.cr.blackchroma.gt(0)) {raw = raw.mul(player.cr.blackchroma.log2().add(1))}
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 22 || player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || 
                player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12) return false;
            return hasAchievement('a',11);
            },

        },
        34: {    
            title: "亲信之力",
            description: "基于骑士团人口增益蛮王经验值获取。",
            cost: new Decimal(1e25),
            effect() {
            let raw = player.k.points.add(1).pow(0.2);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            return hasChallenge('c', 31);
            },

        },
        41: {    
            title: "Wv之力",
            description: "基于已经完成的成就数量增益蛮王经验值获取。",
            cost: new Decimal(1e18),
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
            if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23 || 
                player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
                player.cr.activeChallenge === 12) return false;
            return hasChallenge('c', 12);
            }
        },
        42: {    
            title: "bonker之力",
            description: "基于Ethelse增益蛮王经验值获取。",
            cost: new Decimal(1e19),
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
            if (player.c.activeChallenge === 13 || 
                player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23 || 
                player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
                player.cr.activeChallenge === 12) return false;
            return hasChallenge('c', 12);
            },

        },
        43: {    
            title: "Waelen之力",
            description: "基于狂战士营人口增益蛮王经验值获取。",
            cost: new Decimal(1e20),
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
            if (player.c.activeChallenge === 13 || 
                player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23 
                || player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
                player.cr.activeChallenge === 12) return false;
            return hasChallenge('c', 12);
            },

        },
        44: {    
            title: "新的旅途",
            description: "解锁色彩。",
            cost: new Decimal(4.99e25),
            unlocked() {
            return hasChallenge('c', 31);
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
        if (!hasMilestone('e', 5)) {
        player.b.power = new Decimal(0);
        }
        if (!hasMilestone('e', 6)) {
        player.k.milk = new Decimal(0);
        }
        layerDataReset(this.layer, keep);
        }
        if(layers[resettingLayer].row>=2){
        if (!hasMilestone('g', 2)) {
        player.cr.redchroma = new Decimal(0);
        player.cr.greenchroma = new Decimal(0);
        player.cr.bluechroma = new Decimal(0);
        player.cr.graychroma = new Decimal(0);
        player.cr.yellowchroma = new Decimal(0);
        player.cr.magentachroma = new Decimal(0);
        player.cr.cyanchroma = new Decimal(0);
        player.cr.blackchroma = new Decimal(0);
        }
        if(hasMilestone('cr', 3)){
        player.p.points = new Decimal(9e15);
        }
        if(hasMilestone('cr', 4)){
        player.k.points = new Decimal(200);
        }
        }
        if (layers[resettingLayer].row>=3) {
        player.g.energy = new Decimal(0);
        if(hasMilestone('g', 4)){
        player.c.points = new Decimal(9e15);
        }
        if(hasMilestone('g', 5)){
        player.e.points = new Decimal(11);
        }
        if(hasMilestone('g', 6)){
        player.cr.points = new Decimal(609);
        }
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
            let delta = logPoints.div(logThreshold);
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
        if (hasUpgrade('e', 23)) mult = mult.times(upgradeEffect('e', 23))
        if (player.cr.bluechroma.gt(0)) {mult = mult.times(player.cr.bluechroma.log2().add(1))}
        let threshold = getCurrentThreshold();
        if (player.k.points.gte(threshold)) {
        let logPoints = player.k.points.log10();
        let logThreshold = threshold.log10();
        let delta = logPoints.div(logThreshold);
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
            display() {return "增益蛮王经验值获取。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            cost(x) { return new Decimal(10).mul(x).add(10) },
            display() {return "增益蛮王等级获取。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            cost(x) { return new Decimal(22).mul(x).add(22) },
            display() {return "增益第四个骑士里程碑的效果。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
        14: {
            title: "Linvala Hop",
            cost(x) { return new Decimal(1).add(x).add(x).mul(x).pow(x).add(1) },
            display() {return "增益色度获取。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            {return  hasUpgrade('g', 13)},
            
        },
        21: {
            title: "Ethelse",
            cost(x) { return new Decimal(1).mul(x).pow(x).add(1) },
            display() {return "增益骑士团人口获取。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            cost(x) { return new Decimal(1).add(x).mul(x).pow(x).add(1) },
            display() {return "增益狂战士营人口的生成效果。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            cost(x) { return new Decimal(1).add(1).add(x).mul(x).pow(x).add(1) },
            display() {return "增益前四位骑士的效果。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
        24: {
            title: "剑盾士混编",
            cost(x) { return new Decimal(x).add(x).add(x).mul(x).pow(x).add(1) },
            display() {return "增益增强器获取。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            {return  hasUpgrade('g', 13)},
            
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
            if (hasUpgrade("g",13)){if (canBuyBuyable("k", 14)) buyBuyable("k", 14);}
        }
        if (hasAchievement("a", 22)) {
        if (canBuyBuyable("k", 21)) buyBuyable("k", 21);
        if (canBuyBuyable("k", 22)) buyBuyable("k", 22);
        if (canBuyBuyable("k", 23)) buyBuyable("k", 23);
        if (hasUpgrade("g",13)){if (canBuyBuyable("k", 24)) buyBuyable("k", 24);}
        }
    },
    update(diff) {
    if (hasUpgrade("e",14) && player.c.activeChallenge !== 31 && player.c.activeChallenge !== 32 && player.cr.activeChallenge !== 11 && player.cr.activeChallenge !== 12 && player.cr.greenchroma.gt(0)) {
        if (hasUpgrade("g", 14)){
        let gainPerSecond = buyableEffect("k",21).times(buyableEffect("k",22)).times(buyableEffect("k",23)).times(buyableEffect("k",14)).times(buyableEffect("k",24)).times((player.cr.yellowchroma.add(1)).log2());
        player.k.milkGainRate = gainPerSecond;
        let gain = gainPerSecond.times(diff);
        player.k.milk = player.k.milk.add(gain);            
        }
        else if(hasMilestone("cr",8)){
        let gainPerSecond = buyableEffect("k",21).times(buyableEffect("k",22)).times(buyableEffect("k",23)).times((player.cr.yellowchroma.add(1)).log2());
        player.k.milkGainRate = gainPerSecond;
        let gain = gainPerSecond.times(diff);
        player.k.milk = player.k.milk.add(gain);
        }
    }
    else if (hasUpgrade("e",14) && player.c.activeChallenge !== 31 && player.c.activeChallenge !== 32 && player.cr.activeChallenge !== 11 && player.cr.activeChallenge !== 12) {
        if (hasUpgrade("g", 14)){
        let gainPerSecond = buyableEffect("k",21).times(buyableEffect("k",22)).times(buyableEffect("k",23)).times(buyableEffect("k",14)).times(buyableEffect("k",24));
        player.k.milkGainRate = gainPerSecond;
        let gain = gainPerSecond.times(diff);
        player.k.milk = player.k.milk.add(gain);            
        }
        else {
        let gainPerSecond = buyableEffect("k",21).times(buyableEffect("k",22)).times(buyableEffect("k",23));
        player.k.milkGainRate = gainPerSecond;
        let gain = gainPerSecond.times(diff);
        player.k.milk = player.k.milk.add(gain);
        }
    }
    },
    tabFormat:{
        '骑士':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',function() {
                if (hasUpgrade("e",14)) {
            	return `你有 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milk)}</h3> 牛奶,该数值可以增加天意阈值`}
            }
            ],
            ['display-text', function() {
                if (hasUpgrade("e",14)) {
                    return `你每秒获得 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milkGainRate)}</h3> 牛奶`;}
            }],
            'prestige-button',
            ['display-text', function() {
            let threshold = getCurrentThreshold();
            if (player.k.points.gte(threshold)) {
            let logPoints = player.k.points.log10();
            let logThreshold = threshold.log10();
            let delta = logPoints.div(logThreshold);
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
                if (hasUpgrade("e",14)) {
            	return `你有 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milk)}</h3> 牛奶,该数值可以增加天意阈值`}
            }
            ],
            ['display-text', function() {
                if (hasUpgrade("e",14)) {
                    return `你每秒获得 <h3 style="color: #dfdfdf; text-shadow: 10px">${format(player.k.milkGainRate)}</h3> 牛奶`;}
            }],
            'prestige-button',
            ['display-text', function() {
            let threshold = getCurrentThreshold();
            if (player.k.points.gte(threshold)) {
            let logPoints = player.k.points.log10();
            let logThreshold = threshold.log10();
            let delta = logPoints.div(logThreshold);
            if (delta.gt(1)) {
            return `天意使你的骑士团人口获取开 <h3 style="color: #3fffff; text-shadow: 10px">${format(delta)}</h3> 次根！`;
            }
            }
            }],
            'milestones',
            ],
        },
    },
    passiveGeneration() {
        let pg=new Decimal(0);
            if(hasMilestone("g",1)) pg=new Decimal(1)
            return pg;
    },
    canReset() {
    if (hasMilestone('g', 1)) return false;
    return tmp[this.layer].baseAmount.gte(tmp[this.layer].requires);
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
    },
    update(diff) {
    let delta = new Decimal(diff);
    let oldPower = player.b.power;
    if (hasUpgrade('g',11)) {
    player.b.power = player.b.power.add(delta.times(player.b.points.pow(buyableEffect("k",22))).times(upgradeEffect("b",24)).times(upgradeEffect("b",21)).times(getFuryBonus(player.b.power)));      
    } else if (hasUpgrade('b',24)) {
    player.b.power = player.b.power.add(delta.times(player.b.points.pow(buyableEffect("k",22))).times(upgradeEffect("b",24)).times(upgradeEffect("b",21)));
    } else if (hasUpgrade('b',22)) {
    player.b.power = player.b.power.add(delta.times(player.b.points.pow(buyableEffect("k",22))).times(upgradeEffect("b",21)));
    } else if (hasMilestone('b',2)) {
    player.b.power = player.b.power.add(delta.times(player.b.points.times(buyableEffect("k",22))).times(upgradeEffect("b",21)));
    } else if (hasUpgrade('b',21)) {
    player.b.power = player.b.power.add(delta.times(player.b.points)).add(upgradeEffect("b",21));
    } else {
    player.b.power = player.b.power.add(delta.times(player.b.points));
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
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',13)},
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
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',13)},
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
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',13)},
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
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',13)},
        },
        21: {    
            title: "合作协同",
            description: "Frithpaul增益狂怒能量获取。<br>",
            cost: new Decimal(8),
            effect() {
            let raw = buyableEffect("k", 13).mul(buyableEffect("k", 23)).pow(0.5);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',13)},
        },
        22: {    
            title: "信息传递",
            description: "优化Galdor的公式。<br>",
            cost: new Decimal(16),
            unlocked()
            {return hasAchievement('a',13)},

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
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',13)},
        },
        24: {    
            title: "合作共赢",
            description: "骑士团人口增益狂怒能量获取。<br>",
            cost: new Decimal(24),
            effect() {
            let raw = player.k.points.pow(0.5)
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked()
            {return hasAchievement('a',13)},
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
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
        mult = mult.times(buyableEffect('e', 13))
        if (player.cr.cyanchroma.gt(0)) {mult = mult.times(player.cr.cyanchroma.log2().add(1))}
        if (hasUpgrade('e', 24)) mult = mult.times(upgradeEffect('e', 24))
        let threshold = getCurrentThreshold();
        if (player.c.points.gte(threshold)) {
        let logPoints = player.c.points.log10();
        let logThreshold = threshold.log10();
        let delta = logPoints.div(logThreshold);
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
        8:
        {
        requirementDescription:"24900 挑战精神",
        effectDescription:"解锁第七个挑战。",
        done() {return player.c.points.gte(24900)}
        },
        9:
        {
        requirementDescription:"24975000 挑战精神",
        effectDescription:"解锁第八个挑战。",
        done() {return player.c.points.gte(24975000)}
        },
        10:
        {
        requirementDescription:"9e15 挑战精神",
        effectDescription:"解锁神祇。",
        done() {return player.c.points.gte(9e15)}
        },
    },
    challenges: {
        11: {
        name: "Tchef",
        challengeDescription: "禁用骑士。",
        goal: new Decimal(4095),
        goalDescription: "4095 蛮王等级。",
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
        goalDescription: "8191 蛮王等级。",
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
        goalDescription: "16383 蛮王等级。",
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
        goalDescription: "32767 蛮王等级。",
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
        goalDescription: "65535 蛮王等级。",
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
        challengeDescription: "在 Sangyu & Bitdotdo 的基础上，天意阈值变为 2（而非 9e15）。",
        goal: new Decimal(99999),
        goalDescription: "99999 蛮王等级。",
        rewardDescription: "解锁第六个骑士可购买。",
        canComplete() { return player.p.points.gte(99999); },
        onComplete() {
        doPopup("challenge", "Drewdrinks 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',7)
        }
        },
        31: {
        name: "Zfd",
        challengeDescription: "在 Drewdrinks 的基础上，禁用牛奶。",
        goal: new Decimal(2147483647),
        goalDescription: "2147483647 蛮王等级。",
        rewardDescription: "解锁第四列蛮王升级。",
        canComplete() { return player.p.points.gte(2147483647); },
        onComplete() {
        doPopup("challenge", "Zfd 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',8)
        }
        },
        32: {
        name: "K4SHM1R",
        challengeDescription: "在 Zfd 的基础上，色度无法倍增颜色色度获取。",
        goal: new Decimal(9.01e15),
        goalDescription: "9.01e15 蛮王等级。",
        rewardDescription: "解锁第二行增强者升级。",
        canComplete() { return player.p.points.gte(9.01e15); },
        onComplete() {
        doPopup("challenge", "K4SHM1R 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c',9)
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
            ['display-text', function() {
            let threshold = getCurrentThreshold();
            if (player.c.points.gte(threshold)) {
            let logPoints = player.c.points.log10();
            let logThreshold = threshold.log10();
            let delta = logPoints.div(logThreshold);
            if (delta.gt(1)) {
            return `天意使你的挑战精神获取开 <h3 style="color: #3fffff; text-shadow: 10px">${format(delta)}</h3> 次根！`;
            }
            }
            }],
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
            ['display-text', function() {
            let threshold = getCurrentThreshold();
            if (player.c.points.gte(threshold)) {
            let logPoints = player.c.points.log10();
            let logThreshold = threshold.log10();
            let delta = logPoints.div(logThreshold);
            if (delta.gt(1)) {
            return `天意使你的挑战精神获取开 <h3 style="color: #3fffff; text-shadow: 10px">${format(delta)}</h3> 次根！`;
            }
            }
            }],
            'prestige-button',
            'milestones',
            ],
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #003f00)",
        minHeight: "100vh"
    },
    layerShown(){return hasAchievement('a',14)},
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
        mult = mult.times(buyableEffect('e', 12))
        mult = mult.times(buyableEffect('k', 24))
        if (player.cr.magentachroma.gt(0)) {mult = mult.times(player.cr.magentachroma.log2().add(1))}
        if (hasAchievement('a', 31)) mult = mult.times(achievementEffect('a', 31))
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
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x"
            else 
            return "1.00x";
            },// Add formatting to the effect
        },
        12: {
        title: "武器冶炼",
        description: "削弱蛮王升级的软上限。",
        cost: new Decimal(4)
        },
        13: {
        title: "营地扩建",
        description: "狂怒能量的效果提高。",
        cost: new Decimal(7)
        },
        14: {
        title: "Milkisgood",
        description: "解锁牛奶资源。",
        cost: new Decimal(10),
        onPurchase() {
        player.milkUnlocked = true;
        if (player.k.milk.eq(0)) player.k.milk = new Decimal(1);
        },
        },
        21: {
        title: "灵魂收割",
        description: "解锁黝黑色度。",
        cost: new Decimal(1978),
        unlocked() {return hasChallenge('c', 32); }
        },
        22: {
        title: "版本更迭",
        description: "提高蛮王升级12 13 21 22的效果。",
        cost: new Decimal(3000),
        unlocked() {return hasChallenge('c', 32); }
        },
        23: {
            title: "骑士教会",
            description: "骑士团人口可以增益自身获取。<br>",
            cost: new Decimal(4000),
            effect() {
            let raw = (player.k.points.add(1)).log2()
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {return hasChallenge('c', 32); }
        },
        24: {
            title: "能量凝聚",
            description: "挑战精神也可以增益自身获取。<br>",
            cost: new Decimal(6000),
            effect() {
                
                return player.c.points.pow(0.5).add(1)
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x"
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {return hasChallenge('c', 32); }
        },
    },
    
    tabFormat: {
        "升级": {
            content: ['main-display', 'prestige-button', 'upgrades']
        },
        "里程碑": {
            content: ['main-display', 'prestige-button', 'milestones']
        },
        "增强工具": {
        content: [
            'main-display',
            'prestige-button',
            'buyables',
        ],
        unlocked() {
            return player.e.hasAchieved23 === true;
        }
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
        requirementDescription:"5 增强器",
        effectDescription:"免费自动购买第一行狂战士升级。",
        done() {return player.e.points.gte(5)}
        },
        4:
        {
        requirementDescription:"6 增强器",
        effectDescription:"免费自动购买第二行狂战士升级。",
        done() {return player.e.points.gte(6)}
        },
        5:
        {
        requirementDescription:"8 增强器",
        effectDescription:"狂怒能量不再重置。",
        done() {return player.e.points.gte(8)}
        },
        6:
        {
        requirementDescription:"11 增强器",
        effectDescription:"牛奶不再重置。",
        done() {return player.e.points.gte(11)}
        },
        7:
        {
        requirementDescription:"965 增强器",
        effectDescription:"自动购买增强工具。",
        done() {return player.e.points.gte(965)}
        },
    },
    onPrestige(gain) {
    if (gain.gte(2) && !player.e.hasAchieved23) {
        player.e.hasAchieved23 = true;
    }
    },
    buyables:{
        11: {
            title: "加速器",
            cost(x) { return new Decimal(1).add(x).mul(x).add(1) },
            display() {return "增益时间倍率。<br>需要"+format(this.cost())+"增强器<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            title: "助推器",
            cost(x) { return new Decimal(3).add(x).mul(x).add(1) },
            display() {return "增益增强器获取。<br>需要"+format(this.cost())+"增强器<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            title: "生成器",
            cost(x) { return new Decimal(7).add(x).mul(x).add(1) },
            display() {return "增益挑战精神获取。<br>需要"+format(this.cost())+"增强器<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
        14: {
            title: "优化器",
            cost(x) { return new Decimal(15).add(x).mul(x).add(1) },
            display() {return "视作蛮王升级。<br>需要"+format(this.cost())+"增强器<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            {return hasAchievement('a', 24)},          
        },
    },
    automate() {
        if (hasMilestone("e", 7)) {
            if (canBuyBuyable("e", 11)) buyBuyable("e", 11);
            if (canBuyBuyable("e", 12)) buyBuyable("e", 12);
            if (canBuyBuyable("e", 13)) buyBuyable("e", 13);
            if(hasAchievement("a",24)){if (canBuyBuyable("e", 14)) buyBuyable("e", 14);}
        }
    },
    style: {
        background: "linear-gradient(135deg, #000000, #1f003f)",
        minHeight: "100vh",
    },
    layerShown() { return hasMilestone('k', 7) || player.e.points.gte(1); }
});
addLayer("cr", {
    name: "色彩",
    symbol: "CR",
    position: 1,
    startData() { return { unlocked: true,points: new Decimal(0),
    redchroma: new Decimal(0),redchromaGainRate: new Decimal(0),
    greenchroma: new Decimal(0),greenchromaGainRate: new Decimal(0),
    bluechroma: new Decimal(0),bluechromaGainRate: new Decimal(0),
    graychroma: new Decimal(0),graychromaGainRate: new Decimal(0),
    yellowchroma: new Decimal(0),yellowchromaGainRate: new Decimal(0),
    magentachroma: new Decimal(0),magentachromaGainRate: new Decimal(0),
    cyanchroma: new Decimal(0),cyanchromaGainRate: new Decimal(0),
    blackchroma: new Decimal(0),blackchromaGainRate: new Decimal(0),
    orangechroma: new Decimal(0),orangechromaGainRate: new Decimal(0),
    brownchroma: new Decimal(0),brownchromaGainRate: new Decimal(0), }; },
    color: "#ffffff",
    requires: new Decimal(5e25),
    resource: "色度",
    baseResource: "蛮王等级",
    baseAmount() { return player.p.points; },
    type: "normal",
    exponent: 0.1,
    branches: ["p"],
    gainMult() {
        let mult = new Decimal(1);
        if (player.cr.graychroma.gt(0)) {mult = mult.times(player.cr.graychroma.log2().add(1))}
        mult = mult.times(buyableEffect('k', 14))
        if (hasAchievement('a', 31)) mult = mult.times(achievementEffect('a', 31))
        return mult;
    },
    gainExp() { return new Decimal(1); },
    row: 2,
    hotkeys: [{ key: "s", description: "S: Reset for Color", onPress() { if (canReset(this.layer)) doReset(this.layer); } }],
    style: {
        background: "linear-gradient(135deg, #3f0000, #3f1f00, #3f3f00, #1f3f00, #003f00, #003f1f, #003f3f, #001f3f, #00003f, #1f003f, #3f003f, #3f001f)",
        minHeight: "100vh",
    },
    nodeStyle: {
        background: "conic-gradient( #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)",
        border: 'none',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
    },
    milestones:{
        1:
        {
        requirementDescription:"2 色度",
        effectDescription:"每帧获得等同于色度数量的骑士团人口。",
        eff() {
        if(hasMilestone('cr',1))
        player.k.points=player.k.points.add(player.cr.points)
        },
        done() {return player.cr.points.gte(2)}
        },
        2:
        {
        requirementDescription:"3 色度",
        effectDescription:"解锁翠绿色度。",
        done() {return player.cr.points.gte(3)}
        },
        3:
        {
        requirementDescription:"5 色度",
        effectDescription:"重置时保留9e15蛮王等级。",
        done() {return player.cr.points.gte(5)}
        },
        4:
        {
        requirementDescription:"7 色度",
        effectDescription:"重置时保留200骑士团人口。",
        done() {return player.cr.points.gte(7)}
        },
        5:
        {
        requirementDescription:"9 色度",
        effectDescription:"解锁苍蓝色度。",
        done() {return player.cr.points.gte(9)},
        },
        6:
        {
        requirementDescription:"14 色度",
        effectDescription:"重置时保留27狂战士营人口。",
        eff() {
        if(hasMilestone('cr',6))
        player.b.points=player.b.points.max(27)
        },
        done() {return player.cr.points.gte(14)}
        },
        7:
        {
        requirementDescription:"27 色度",
        effectDescription:"解锁中立色度。",
        done() {return player.cr.points.gte(27)}
        },
        8:
        {
        requirementDescription:"81 色度",
        effectDescription:"解锁明黄色度。",
        done() {return player.cr.points.gte(81)}
        },
        9:
        {
        requirementDescription:"243 色度",
        effectDescription:"解锁品红色度。",
        done() {return player.cr.points.gte(243)}
        },
        10:
        {
        requirementDescription:"609 色度",
        effectDescription:"解锁亮青色度。",
        done() {return player.cr.points.gte(609)}
        },
        11:
        {
        requirementDescription:"999000 色度",
        effectDescription:"解锁神圣解放。",
        done() {return player.cr.points.gte(999000)}
        },
    },
update(diff) {
    let phiBonus = new Decimal(1);
    if (hasUpgrade('g', 12)) {
        let safeEnergy = player.g.energy.max(1);
        phiBonus = safeEnergy.log2().add(1);
    }
    let orangeBonus = new Decimal(1);
    if (hasUpgrade('cr', 11)) {
        let safeorange = player.cr.orangechroma.max(1);
        orangeBonus = safeorange.log2().add(1);
    }
    let brownBonus = new Decimal(1);
    if (hasUpgrade('cr', 11)) {
        let safebrown = player.cr.brownchroma.max(1);
        brownBonus = safebrown.log2().add(1);
    }
    if (player.c.activeChallenge == 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12) {
        if (player.cr.activeChallenge == 11 || player.cr.activeChallenge === 12){player.cr.redchroma = new Decimal(0)}
        else if (player.cr.points.gte(1)) {
            let redBase = player.b.power.max(1);
            let redGain = redBase.log2().times(phiBonus).times(orangeBonus);
            player.cr.redchromaGainRate = redGain;
            player.cr.redchroma = player.cr.redchroma.add(redGain.times(diff));
        }
        if (player.cr.activeChallenge === 12){player.cr.greenchroma = new Decimal(0)}
        else if (hasMilestone("cr",2)) {
            let greenBase = player.c.points.max(1).max(1);
            let greenGain = greenBase.log2().times(phiBonus).times(brownBonus);
            player.cr.greenchromaGainRate = greenGain;
            player.cr.greenchroma = player.cr.greenchroma.add(greenGain.times(diff));
        }
        if (hasMilestone("cr",5)) {
            let blueBase = player.e.points.max(1);
            let blueGain = blueBase.log2().times(phiBonus);
            player.cr.bluechromaGainRate = blueGain;
            player.cr.bluechroma = player.cr.bluechroma.add(blueGain.times(diff));
        }
        if (hasMilestone("cr",7)) {
            let grayBase = player.k.milk.max(1);
            let grayGain = grayBase.log2().times(phiBonus);
            player.cr.graychromaGainRate = grayGain;
            player.cr.graychroma = player.cr.graychroma.add(grayGain.times(diff));
        }
        if (player.cr.activeChallenge === 12){player.cr.yellowchroma = new Decimal(0)}
        else if (hasMilestone("cr",8)) {
            let yellowBase = player.cr.redchroma.max(1).times(player.cr.greenchroma).max(1);
            let yellowGain = yellowBase.log2().times(phiBonus);
            player.cr.yellowchromaGainRate = yellowGain;
            player.cr.yellowchroma = player.cr.yellowchroma.add(yellowGain.times(diff));
        }
        if (hasMilestone("cr",9)) {
            let magentaBase = player.cr.redchroma.max(1).times(player.cr.bluechroma).max(1);
            let magentaGain = magentaBase.log2().times(phiBonus);
            player.cr.magentachromaGainRate = magentaGain;
            player.cr.magentachroma = player.cr.magentachroma.add(magentaGain.times(diff));
        }
        if (hasMilestone("cr",10)) {
            let cyanBase = player.cr.greenchroma.max(1).times(player.cr.bluechroma).max(1);
            let cyanGain = cyanBase.log2().times(phiBonus);
            player.cr.cyanchromaGainRate = cyanGain;
            player.cr.cyanchroma = player.cr.cyanchroma.add(cyanGain.times(diff));
        }
        if (hasUpgrade("e",21)) {
            let blackBase = player.cr.graychroma.max(1).times(upgradeEffect('p', 23)).max(1);
            let blackGain = blackBase.log2().times(phiBonus);
            player.cr.blackchromaGainRate = blackGain;
            player.cr.blackchroma = player.cr.blackchroma.add(blackGain.times(diff));
        }
        if (player.cr.activeChallenge == 11 || player.cr.activeChallenge === 12){player.cr.orangechroma = new Decimal(0)}
        else if (hasUpgrade("cr",11)) {
            let orangeBase = player.cr.redchroma.max(1).times(player.g.points).max(1);
            let orangeGain = orangeBase.log2().times(phiBonus);
            player.cr.orangechromaGainRate = orangeGain;
            player.cr.orangechroma = player.cr.orangechroma.add(orangeGain.times(diff));
        }
        if (player.cr.activeChallenge === 12){player.cr.brownchroma = new Decimal(0)}
        else if (hasUpgrade("cr",12)) {
            let brownBase = player.cr.greenchroma.max(1).times(player.g.points).max(1);
            let brownGain = brownBase.log2().times(phiBonus);
            player.cr.brownchromaGainRate = brownGain;
            player.cr.brownchroma = player.cr.brownchroma.add(brownGain.times(diff));
        }
    } else {
        if (player.cr.points.gte(1)) {
            let redBase = player.b.power.max(1).times(player.cr.points).max(1);
            let redGain = redBase.log2().times(phiBonus).times(orangeBonus);
            player.cr.redchromaGainRate = redGain;
            player.cr.redchroma = player.cr.redchroma.add(redGain.times(diff));
        }
        if (hasMilestone("cr",2)) {
            let greenBase = player.c.points.max(1).times(player.cr.points).max(1);
            let greenGain = greenBase.log2().times(phiBonus).times(brownBonus);
            player.cr.greenchromaGainRate = greenGain;
            player.cr.greenchroma = player.cr.greenchroma.add(greenGain.times(diff));
        }
        if (hasMilestone("cr",5)) {
            let blueBase = player.e.points.max(1).times(player.cr.points).max(1);
            let blueGain = blueBase.log2().times(phiBonus);
            player.cr.bluechromaGainRate = blueGain;
            player.cr.bluechroma = player.cr.bluechroma.add(blueGain.times(diff));
        }
        if (hasMilestone("cr",7)) {
            let grayBase = player.k.milk.max(1).times(player.cr.points).max(1);
            let grayGain = grayBase.log2().times(phiBonus);
            player.cr.graychromaGainRate = grayGain;
            player.cr.graychroma = player.cr.graychroma.add(grayGain.times(diff));
        }
        if (hasMilestone("cr",8)) {
            let yellowBase = player.cr.redchroma.max(1).times(player.cr.greenchroma).max(1);
            let yellowGain = yellowBase.log2().times(phiBonus);
            player.cr.yellowchromaGainRate = yellowGain;
            player.cr.yellowchroma = player.cr.yellowchroma.add(yellowGain.times(diff));
        }
        if (hasMilestone("cr",9)) {
            let magentaBase = player.cr.redchroma.max(1).times(player.cr.bluechroma).max(1);
            let magentaGain = magentaBase.log2().times(phiBonus);
            player.cr.magentachromaGainRate = magentaGain;
            player.cr.magentachroma = player.cr.magentachroma.add(magentaGain.times(diff));
        }
        if (hasMilestone("cr",10)) {
            let cyanBase = player.cr.greenchroma.max(1).times(player.cr.bluechroma).max(1);
            let cyanGain = cyanBase.log2().times(phiBonus);
            player.cr.cyanchromaGainRate = cyanGain;
            player.cr.cyanchroma = player.cr.cyanchroma.add(cyanGain.times(diff));
        }
        if (hasUpgrade("e",21)) {
            let blackBase = player.cr.graychroma.max(1).times(upgradeEffect('p', 23)).max(1);
            let blackGain = blackBase.log2().times(phiBonus);
            player.cr.blackchromaGainRate = blackGain;
            player.cr.blackchroma = player.cr.blackchroma.add(blackGain.times(diff));
        }
        if (hasUpgrade("cr",11)) {
            let orangeBase = player.cr.redchroma.max(1).times(player.g.points).max(1);
            let orangeGain = orangeBase.log2().times(phiBonus);
            player.cr.orangechromaGainRate = orangeGain;
            player.cr.orangechroma = player.cr.orangechroma.add(orangeGain.times(diff));
        }
        if (hasUpgrade("cr",12)) {
            let brownBase = player.cr.greenchroma.max(1).times(player.g.points).max(1);
            let brownGain = brownBase.log2().times(phiBonus);
            player.cr.brownchromaGainRate = brownGain;
            player.cr.brownchroma = player.cr.brownchroma.add(brownGain.times(diff));
        }
    }
    },
    tabFormat:{
        '色彩':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {if (player.cr.points.gte(1)){
            	return `你有 <h3 style="color: #ff0000; text-shadow: 10px">${format(player.cr.redchroma)}</h3> 殷红色度,为你的蛮王提供 <h3 style="color: #ff0000; text-shadow: 10px">${format(player.cr.redchroma.log2().add(1))}</h3> 倍率的经验值`
            }}],
            ['display-text', function() {if (player.cr.points.gte(1)){
                    return `你每秒获得 <h3 style="color: #ff0000; text-shadow: 10px">${format(player.cr.redchromaGainRate)}</h3> 殷红色度`;
            }}],
            ['display-text',
            function() {if(hasMilestone("cr",2)){
            	return `你有 <h3 style="color: #00ff00; text-shadow: 10px">${format(player.cr.greenchroma)}</h3> 翠绿色度,为你的蛮王提供 <h3 style="color: #00ff00; text-shadow: 10px">${format(player.cr.greenchroma.log2().add(1))}</h3> 倍率的等级`
            }}],
            ['display-text', function() {if(hasMilestone("cr",2)){
                    return `你每秒获得 <h3 style="color: #00ff00; text-shadow: 10px">${format(player.cr.greenchromaGainRate)}</h3> 翠绿色度`;
            }}],
            ['display-text', function() {if(hasMilestone("cr",5)){
            	return `你有 <h3 style="color: #0000ff; text-shadow: 10px">${format(player.cr.bluechroma)}</h3> 苍蓝色度,为你的骑士团提供 <h3 style="color: #0000ff; text-shadow: 10px">${format(player.cr.bluechroma.log2().add(1))}</h3> 倍率的人口`
            }}],
            ['display-text', function() {if(hasMilestone("cr",5)){
                    return `你每秒获得 <h3 style="color: #0000ff; text-shadow: 10px">${format(player.cr.bluechromaGainRate)}</h3> 苍蓝色度`;
            }}],
            ['display-text', function() {if(hasMilestone("cr",7)){
            	return `你有 <h3 style="color: #7f7f7f; text-shadow: 10px">${format(player.cr.graychroma)}</h3> 中立色度,为你的色彩提供 <h3 style="color: #7f7f7f; text-shadow: 10px">${format(player.cr.graychroma.log2().add(1))}</h3> 倍率的色度`
            }}],
            ['display-text', function() {if(hasMilestone("cr",7)){
                    return `你每秒获得 <h3 style="color: #7f7f7f; text-shadow: 10px">${format(player.cr.graychromaGainRate)}</h3> 中立色度`;
            }}],
            ['display-text', function() {if(hasMilestone("cr",8)){
            	return `你有 <h3 style="color: #ffff00; text-shadow: 10px">${format(player.cr.yellowchroma)}</h3> 明黄色度,为你的骑士团提供 <h3 style="color: #ffff00; text-shadow: 10px">${format(player.cr.yellowchroma.log2().add(1))}</h3> 倍率的牛奶`
            }}],
            ['display-text', function() {if(hasMilestone("cr",8)){
                    return `你每秒获得 <h3 style="color: #ffff00; text-shadow: 10px">${format(player.cr.yellowchromaGainRate)}</h3> 明黄色度`;
            }}],
            ['display-text', function() {if(hasMilestone("cr",9)){
            	return `你有 <h3 style="color: #ff00ff; text-shadow: 10px">${format(player.cr.magentachroma)}</h3> 品红色度,为你的增强者提供 <h3 style="color: #ff00ff; text-shadow: 10px">${format(player.cr.magentachroma.log2().add(1))}</h3> 倍率的增强器`
            }}],
            ['display-text', function() {if(hasMilestone("cr",9)){
                    return `你每秒获得 <h3 style="color: #ff00ff; text-shadow: 10px">${format(player.cr.magentachromaGainRate)}</h3> 品红色度`;
            }}],
            ['display-text', function() {if(hasMilestone("cr",10)){
            	return `你有 <h3 style="color: #00ffff; text-shadow: 10px">${format(player.cr.cyanchroma)}</h3> 亮青色度,为你的挑战者提供 <h3 style="color: #00ffff; text-shadow: 10px">${format(player.cr.cyanchroma.log2().add(1))}</h3> 倍率的挑战精神`
            }}],
            ['display-text', function() {if(hasMilestone("cr",10)){
                    return `你每秒获得 <h3 style="color: #00ffff; text-shadow: 10px">${format(player.cr.cyanchromaGainRate)}</h3> 亮青色度`;
            }}],
            ['display-text', function() {if(hasUpgrade("e",21)){
            	return `你有 <h3 style="color: #000000; text-shadow: 10px">${format(player.cr.blackchroma)}</h3> 黝黑色度,为你的游戏提供 <h3 style="color: #000000; text-shadow: 10px">${format(player.cr.blackchroma.log2().add(1))}</h3> 倍率的时间`
            }}],
            ['display-text', function() {if(hasUpgrade("e",21)){
                    return `你每秒获得 <h3 style="color: #000000; text-shadow: 10px">${format(player.cr.blackchromaGainRate)}</h3> 黝黑色度`;
            }}],
            'prestige-button',
            ],
        },
        '里程碑':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            'prestige-button',
            'milestones'
            ],
        },
        "神圣解放": {
        content: [
            'main-display',
            ['display-text', function() {if(hasUpgrade("cr",11)){
            	return `你有 <h3 style="color: #ff7f00; text-shadow: 10px">${format(player.cr.orangechroma)}</h3> 大橙色度,为你的色彩提供 <h3 style="color: #ff7f00; text-shadow: 10px">${format(player.cr.orangechroma.log2().add(1))}</h3> 倍率的红色色度`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",11)){
                    return `你每秒获得 <h3 style="color: #ff7f00; text-shadow: 10px">${format(player.cr.orangechromaGainRate)}</h3> 大橙色度`;
            }}],
            ['display-text', function() {if(hasUpgrade("cr",12)){
            	return `你有 <h3 style="color: #3f1f00; text-shadow: 10px">${format(player.cr.brownchroma)}</h3> 煤棕色度,为你的色彩提供 <h3 style="color: #3f1f00; text-shadow: 10px">${format(player.cr.brownchroma.log2().add(1))}</h3> 倍率的绿色色度`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",12)){
                    return `你每秒获得 <h3 style="color: #3f1f00; text-shadow: 10px">${format(player.cr.brownchromaGainRate)}</h3> 煤棕色度`;
            }}],
            'prestige-button',
            'upgrades',
            'challenges',
        ],
        unlocked() {
            return hasMilestone("cr",11);
        }
    },
    },
    upgrades:{
        11: {
            title: "解放大橙",
            description: "解锁大橙色度。",
            cost: new Decimal(1000000),
            unlocked() {return hasChallenge('cr', 11); }
        },
        12: {
            title: "解放煤棕",
            description: "解锁煤棕色度。",
            cost: new Decimal(1200000),
            unlocked() {return hasChallenge('cr', 12); }
        },
    },
    challenges: {
    11: {
        name: "神圣解放 I",
        challengeDescription: "在 K4SHM1R 的基础上，禁用红色色度。",
        goal: new Decimal(1e16),
        goalDescription: "1e16 蛮王等级。",
        rewardDescription: "解锁新的升级。",
        canComplete() { return player.p.points.gte(1e16); },
        onComplete() {
        doPopup("challenge", "神圣解放 I 挑战完成！", "挑战完成", "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return true
        }
    },
    12: {
        name: "神圣解放 II",
        challengeDescription: "在 神圣解放 I 的基础上，禁用绿色色度。",
        goal: new Decimal(1e16),
        goalDescription: "1e16 蛮王等级。",
        rewardDescription: "解锁新的升级。",
        canComplete() { return player.p.points.gte(1e16); },
        onComplete() {
        doPopup("challenge", "神圣解放 II 挑战完成！", "挑战完成", "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return (hasUpgrade("cr", 11))
        }
    },
    },
    layerShown() { return hasUpgrade('p', 44) || player.cr.points.gte(1); }
});
addLayer("g", {
    name: "神祇",
    symbol: "G",
    position: 1,
    startData() { return { unlocked: true,points: new Decimal(0),energy: new Decimal(0),energyGainRate: new Decimal(0),}; },
    color: "#ffffff",
    requires: new Decimal(9e15),
    resource: "GTP",
    baseResource: "挑战精神",
    baseAmount() { return player.c.points; },
    type: "static",
    exponent: 2,
    branches: ["c"],
    gainMult() {
        let mult = new Decimal(1);
        return mult;
    },
    gainExp() { return new Decimal(1); },
    row: 3,
    hotkeys: [{ key: "g", description: "S: Reset for God Trigger", onPress() { if (canReset(this.layer)) doReset(this.layer); } }],
    style: {
        background: "linear-gradient(135deg, #000000, #3f1f00, #3f3f00)",
        minHeight: "100vh",
    },
    nodeStyle: {
        background: "radial-gradient( #ff7f00, #ffff00)",
        border: 'none',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
    },
    update(diff) {
    if (player.g.points.gt(0)) {
    let energygainPerSecond = player.g.points.pow(player.g.points);
    player.g.energyGainRate = energygainPerSecond;
    player.g.energy = player.g.energy.add(energygainPerSecond.times(diff));}
    },
    milestones: {
    1: {
        requirementDescription: "2 GTP",
        effectDescription: "每秒获得骑士重置能够获得的骑士团人口的100%，但无法主动重置骑士层。",
        done() { return player.g.points.gte(2); }
    },
    2: {
        requirementDescription: "3 GTP",
        effectDescription: "颜色色度不再重置。",
        done() { return player.g.points.gte(3); }
    },
    3: {
        requirementDescription:"4 GTP",
        effectDescription:"每帧获得等同于φ 精华的挑战精神。",
        eff() {
        if(hasMilestone('g',3))
        player.c.points=player.c.points.add(player.g.energy)
        },
        done() {return player.g.points.gte(4)}
        },
    4: {
        requirementDescription:"5 GTP",
        effectDescription:"重置时保留9e15挑战精神。",
        done() {return player.g.points.gte(5)}
        },
    5: {
        requirementDescription:"6 GTP",
        effectDescription:"重置时保留11增强器。",
        done() {return player.g.points.gte(6)}
        },  
    6: {
        requirementDescription:"7 GTP",
        effectDescription:"重置时保留609色度。",
        done() {return player.g.points.gte(7)}
    },
    },
    upgrades: {
    11: {
    title: "狂斧凝聚",
    description: "狂怒能量也可以增益自身获取。",
    cost: new Decimal(86400),
    currencyInternalName: "energy",
    currencyLayer: "g",
    currencyDisplayName: "φ 精华",
    effect() { return getFuryBonus(player.b.power); },
    effectDisplay() { 
        if (hasUpgrade(this.layer, this.id)) 
        return format(upgradeEffect(this.layer, this.id)) + "x"; 
        else 
        return "1.00x";
        },// Add formatting to the effect
    },
    12: {
    title: "色阶调和",
    description: "φ 精华也可以增益颜色色度获取。",
    cost: new Decimal(345600),
    currencyInternalName: "energy",
    currencyLayer: "g",
    currencyDisplayName: "φ 精华",
    effect() {let safeEnergy = player.g.energy.max(1);return safeEnergy.log2().add(1)},
    effectDisplay() { 
        if (hasUpgrade(this.layer, this.id)) 
        return format(upgradeEffect(this.layer, this.id)) + "x"; 
        else 
        return "1.00x";
        },// Add formatting to the effect
    },
    13: {
    title: "骑士扩容",
    description: "增加两个新的骑士可购买。",
    cost: new Decimal(2332800),
    currencyInternalName: "energy",
    currencyLayer: "g",
    currencyDisplayName: "φ 精华",
    },
    14: {
    title: "牛奶庄园",
    description: "新的两个骑士可购买增益牛奶获取。",
    cost: new Decimal(22184000),
    currencyInternalName: "energy",
    currencyLayer: "g",
    currencyDisplayName: "φ 精华",
    },
    },
        tabFormat:{
        '神祇':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {if (player.g.points.gte(1)){
                let safeEnergy = player.g.energy.max(1);
            	return `你有 <h3 style="color: #bf7f00; text-shadow: 10px">${format(player.g.energy)}</h3> φ 精华,倍增狂怒能量效果 <h3 style="color: #bf7f00; text-shadow: 10px">${format(safeEnergy.log2().add(1))}</h3> 倍`
            }}],
            ['display-text', function() {if (player.g.points.gte(1)){
                    return `你每秒获得 <h3 style="color: #bf7f00; text-shadow: 10px">${format(player.g.energyGainRate)}</h3> φ 精华`;
            }}],
            'prestige-button',
            'upgrades'
            ],
        },
        '里程碑':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            ['display-text',
            function() {if (player.g.points.gte(1)){
                let safeEnergy = player.g.energy.max(1);
            	return `你有 <h3 style="color: #bf7f00; text-shadow: 10px">${format(player.g.energy)}</h3> φ 精华,倍增狂怒能量效果 <h3 style="color: #bf7f00; text-shadow: 10px">${format(safeEnergy.log2().add(1))}</h3> 倍`
            }}],
            ['display-text', function() {if (player.g.points.gte(1)){
                    return `你每秒获得 <h3 style="color: #bf7f00; text-shadow: 10px">${format(player.g.energyGainRate)}</h3> φ 精华`;
            }}],
            'prestige-button',
            'milestones'
            ],
        },
    },
    layerShown() { return hasMilestone('c', 10) || player.g.points.gte(1); }
});
