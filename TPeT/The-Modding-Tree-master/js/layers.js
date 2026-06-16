function applySoftcap(value) {
    value = new Decimal(value);
    let isSoftcap = false;
    let cap = new Decimal(100);
    if (player.c.activeChallenge === 12 || player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || 
        player.c.activeChallenge === 22 || player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || 
        player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || 
        player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
        player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) {
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
    player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
    player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33;
}
function getUpgradeDisplay(layer, id) {
    let eff = upgradeEffect(layer, id);
    let formatted = format(eff) + "x";
    if (player.c.activeChallenge === 11 || player.c.activeChallenge === 12 || player.c.activeChallenge === 13 || 
    player.c.activeChallenge === 21 || player.c.activeChallenge === 22 || player.c.activeChallenge === 23 || 
    player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
    player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
    player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) {
    if (eff.gt(2)) {
        return formatted + "（受软上限限制）";
    }}
    else if (hasChallenge('c', 11) && eff.gt(100)) {
        return formatted + "（受软上限限制）";
    }
    else if (eff.gte(100)) {
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
        player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || 
        player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
        player.c.activeChallenge === 33) {
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
function getExtraUpgradeCount() {
    let achievementsCount = player.a ? player.a.achievements.length : 0;
    let challengesCount = 0;
    if (player.c && player.c.challenges) {
        for (let id in player.c.challenges) {
            if (player.c.challenges[id] > 0) challengesCount++;
        }
    }
    if (player.cr && player.cr.challenges) {
        for (let id in player.cr.challenges) {
            if (player.cr.challenges[id] > 0) challengesCount++;
        }
    }
    if (hasAchievement('a', 33)) {
        return achievementsCount + challengesCount;
    }
    return 0;
}
function getByteSpeedMult() {
    if (!player.m || !player.m.byte) return new Decimal(1);
    if (player.m.byte.lte(1)) return new Decimal(1);
    if (isNaN(player.m.byte.mag) || isNaN(player.m.byte.sign)) {
        player.m.byte = new Decimal(0);
        return new Decimal(1);
    }
    let safeByte = player.m.byte;
    let result;
    if (hasAchievement('a', 34)) {
        result = safeByte.log2().log2().add(1);
    } else {
        result = safeByte.ln().ln().add(1);
    }
    return result.max(1);
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
        effect() {return 2},
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
    15: {
        name: "从未止步",
        tooltip: "要求：获得 1e45 蛮王经验值。<br>奖励：优化蛮王升级11 41 42 43的效果。",
        done() {return player.points.gte(1e45)},
        unlocked() {return (hasMilestone("m", 6))}
    },
    21: {
    name: "超越极限",
    tooltip: function() {
        if (hasAchievement(this.layer, this.id)) {
            let eff = achievementEffect(this.layer, this.id);
            return `要求：蛮王升级12的效果超过100倍。<br>奖励：挑战精神也可以增益蛮王等级获取。<br>当前：${format(eff)}x`;
        } else {
            return `要求：蛮王升级12的效果超过100倍。<br>奖励：挑战精神也可以增益蛮王等级获取。<br>当前：1.00x`;
        }
    },
    done() {
        return upgradeEffect('p', 12).gt(100);
    },
    effect() {return player.c.points.pow(0.5).add(1)},
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
    25: {
        name: "第三行的精华",
        tooltip: function() {
        if (hasAchievement(this.layer, this.id)) {
            let eff = achievementEffect(this.layer, this.id);
            return `要求：获得 1e32 挑战精神。<br>奖励：翻倍骑士团人口，挑战精神，增强器，色度和主机端口获取。<br>当前：${format(eff)}x`;
        } else {
            return `要求：获得 1e32 挑战精神。<br>奖励：翻倍骑士团人口，挑战精神，增强器，色度和主机端口获取。<br>当前：1.00x`;
        }
    },
        done() {return player.points.gte(1e32)},
        effect() {return 2},
        unlocked() {return (hasMilestone("m", 6))}
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
    effect() {return buyableEffect("k",23)},
    },
    32: {
    name: "您",
    tooltip: function() {
        if (hasAchievement(this.layer, this.id)) {
            let eff = achievementEffect(this.layer, this.id);
            return `要求：获得1e11φ 精华。<br>奖励：φ 精华也可以增益自身获取。<br>当前：${format(eff)}x`;
        } else {
            return `要求：获得1e11φ 精华。<br>奖励：φ 精华也可以增益自身获取。<br>当前：1.00x`;
        }
    },
    done() { return player.g.energy.gte(1e11); },
    effect() {let safeEnergy = player.g.energy.max(1);return safeEnergy.log2().add(1)}
    },
    33: {
    name: "游戏要加速了......",
    tooltip: function() {
        if (hasAchievement(this.layer, this.id)) {
            let eff = achievementEffect(this.layer, this.id);
            return `要求：游戏速度达到5.6x。<br>奖励：每一个完成的成就和挑战均视作一个蛮王升级。<br>当前：${format(eff)}x`;
        } else {
            return `要求：游戏速度达到5.6x。<br>奖励：每一个完成的成就和挑战均视作一个蛮王升级。<br>当前：1.00x`;
        }
    },
    done() {
        if (!player.m || !player.m.byte) return false;
        return getByteSpeedMult().gte(5.6);
    },
    effect() {
        return getExtraUpgradeCount();
    }
    },
    34: {
    name: "万物终结",
    tooltip: "要求：蛮王升级31的效果超过108.25倍。<br>奖励：优化字节的公式。",
    done() {
        return upgradeEffect('p', 31).gt(108.25);
    }
    },
    35: {
        name: "每个人都很棒 END",
        tooltip: "要求：拥有每一种主机革新。<br>奖励：解锁终局条件。",
        done() {
        return getBuyableAmount("m", 11).gte(1) &&
               getBuyableAmount("m", 12).gte(1) &&
               getBuyableAmount("m", 13).gte(1) &&
               getBuyableAmount("m", 14).gte(1)
        },
        unlocked() {return (hasMilestone("m", 6))}
    },
},
    tabFormat:{
        '成就':{
            content:[
            //['infoboxes','main-text'],
            ['display-text', function() {
                return `你有 <h3 style="color: #ffff3f; text-shadow: 10px">${formatWhole(player.a.achievements.length)}</h3> 成就`;
            }],
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
        {key: "p", description: "P: 进行一次蛮王重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {        
        11: {    
            title: "蛮王出世",
            description: "翻倍蛮王经验值获取。<br>",
            cost: new Decimal(1),
            effect(){
            let multiple = hasChallenge('c', 13) ? 5 : 1;
            let multiple2 = hasAchievement('a', 15) ? 1180 : 1;
            let raw = 2 * multiple * multiple2;
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || player.c.activeChallenge === 22 || 
                player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || 
                player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || 
                player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
                player.c.activeChallenge === 33) return false;
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
            if (player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
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
        let opt = buyableEffect("e", 14);
        let baseUpgradeCount;
        if (hasChallenge('c', 33)) {
            baseUpgradeCount = new Decimal(player.p.upgrades.length).mul(opt).mul(buyableEffect("k", 24));
        } else {
            baseUpgradeCount = new Decimal(player.p.upgrades.length).add(opt).mul(buyableEffect("k", 24));
        }
        let extraCount = getExtraUpgradeCount();
        let raw = baseUpgradeCount.add(extraCount).add(1).pow(exponent);
        return applySoftcap(raw);
    },
    effectDisplay() { 
        if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
        else 
            return "1.00x";
    },
    unlocked() {
        if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23 || 
            player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
            player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
            player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
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
            if (player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
            return hasChallenge('c', 31);
            },

        },
    31: {    
    title: "博大精深",
    description: "基于蛮王升级的数量增益蛮王等级获取。",
    cost: new Decimal(63),
    effect() {
        let exponent = hasChallenge('c', 21) ? 0.4 : 0.15;
        let opt = buyableEffect("e", 14);
        let baseUpgradeCount;
        if (hasChallenge('c', 33)) {
            baseUpgradeCount = new Decimal(player.p.upgrades.length).mul(opt).mul(buyableEffect("k", 24));
        } else {
            baseUpgradeCount = new Decimal(player.p.upgrades.length).add(opt).mul(buyableEffect("k", 24));
        }
        let extraCount = getExtraUpgradeCount();
        let raw = baseUpgradeCount.add(extraCount).add(1).pow(exponent);
        return applySoftcap(raw);
    },
    effectDisplay() { 
        if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
        else 
            return "1.00x";
    },
    unlocked() {
        if (player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || player.c.activeChallenge === 23 || 
            player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
            player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
            player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
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
            let raw = new Decimal(base).add(1).mul(buyableEffect("e", 11)).mul(buyableEffect("k", 24)).pow(exponent);
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
                player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || 
                player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
                player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
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
            let raw = new Decimal(base).add(1).mul(buyableEffect("e", 11)).mul(buyableEffect("k", 24)).pow(exponent);
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
                player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || 
                player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
                player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
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
            if (player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
            return hasChallenge('c', 31);
            },

        },
        41: {    
            title: "Wv之力",
            description: "基于已经完成的成就数量增益蛮王经验值获取。",
            cost: new Decimal(1e18),
            effect() {
            let exponent = hasChallenge('c', 21) ? 0.5 : 0.2;
            let exponent2 = hasAchievement('a', 15) ? 1.5 : 0;
            let raw = new Decimal(player.a.achievements.length).add(1).pow(exponent + exponent2);
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
                player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
                player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return false;
            return hasChallenge('c', 12);
            }
        },
        42: {    
            title: "bonker之力",
            description: "基于Ethelse增益蛮王经验值获取。",
            cost: new Decimal(1e19),
            effect() {
            let exponent = hasChallenge('c', 13) ? 0.5 : 0.2;
            let exponent2 = hasAchievement('a', 15) ? 1.5 : 0;
            let raw = buyableEffect("k", 21).mul(buyableEffect("k", 23)).pow(exponent + exponent2);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || 
                player.c.activeChallenge === 23 || player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || 
                player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || 
                player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
                player.c.activeChallenge === 33) return false;
            return hasChallenge('c', 12);
            },

        },
        43: {    
            title: "Waelen之力",
            description: "基于狂战士营人口增益蛮王经验值获取。",
            cost: new Decimal(1e20),
            effect() {
            let exponent = hasChallenge('c', 13) ? 0.5 : 0.2;
            let exponent2 = hasAchievement('a', 15) ? 1.5 : 0;
            let raw = player.b.points.add(1).pow(exponent + exponent2);
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            if (player.c.activeChallenge === 13 || player.c.activeChallenge === 21 || player.c.activeChallenge == 22 || 
                player.c.activeChallenge === 23  || player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || 
                player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || 
                player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
                player.c.activeChallenge === 33) return false;
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
        if(hasMilestone('cr', 6)){
        player.b.points = new Decimal(27);
        }
        }
        if (layers[resettingLayer].row>=3) {
        if(!hasMilestone('g', 7)){
        player.g.energy = new Decimal(0);
        }
        if (!hasMilestone("m", 5)){
        player.m.byte = new Decimal(0);
        player.m.hdd = new Decimal(0);
        player.m.ssd = new Decimal(0);
        player.m.pagefile = new Decimal(0);
        player.m.ram = new Decimal(0);
        player.m.l3Cache = new Decimal(0);
        player.m.l2Cache = new Decimal(0);
        player.m.l1Cache = new Decimal(0);
        player.m.register = new Decimal(0);
        }
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
        if (hasAchievement('a', 25)) mult = mult.times(achievementEffect('a', 25))
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
        {key: "k", description: "K: 进行一次骑士重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
            display() {return "增益前五位骑士的效果。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
            display() {return "增益增强工具效果。<br>需要"+format(this.cost())+"骑士团人口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
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
        player.p.points=player.p.points.add(buyableEffect('k', 13)).add(buyableEffect('k', 23))
        },
        done() {return player.k.points.gte(10)},
        },
        5:
        {
        requirementDescription:"47 骑士团人口",
        effectDescription:"解锁第四位骑士。",
        done() {return player.k.points.gte(47)},
        },
        6:
        {
        requirementDescription:"200 骑士团人口",
        effectDescription:"解锁狂战士营。",
        done() {return player.k.points.gte(200)},
        },
        7:
        {
        requirementDescription:"9e15 骑士团人口",
        effectDescription:"解锁增强者。",
        done() {return player.k.points.gte(9e15)},
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
    if (!hasUpgrade("e", 14) || player.c.activeChallenge === 31 || player.c.activeChallenge === 32 || player.cr.activeChallenge === 11 || 
        player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
        player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) return;

    let eff21 = (player.k.buyables[21] ? buyableEffect("k",21) : new Decimal(1)).max(1);
    let eff22 = (player.k.buyables[22] ? buyableEffect("k",22) : new Decimal(1)).max(1);
    let eff23 = (player.k.buyables[23] ? buyableEffect("k",23) : new Decimal(1)).max(1);
    let baseGain = eff21.times(eff22).times(eff23);
    
    if (hasUpgrade("g", 14)) {
        let eff14 = (player.k.buyables[14] ? buyableEffect("k",14) : new Decimal(1)).max(1);
        let eff24 = (player.k.buyables[24] ? buyableEffect("k",24) : new Decimal(1)).max(1);
        baseGain = baseGain.times(eff14).times(eff24);
    }
    
    if (hasMilestone("cr", 8)) {
        let yellowBonus = player.cr.yellowchroma.add(1).log2();
        baseGain = baseGain.times(yellowBonus);
    }

    if (hasUpgrade("g", 23)) {
        let godBonus = upgradeEffect("g", 23);
        baseGain = baseGain.times(godBonus);
    }
    
    baseGain = baseGain.times(buyableEffect("m", 13))
    
    player.k.milkGainRate = baseGain;
    player.k.milk = player.k.milk.add(baseGain.times(diff));
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
        {key: "b", description: "B: 进行一次狂战士重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
    let base = delta.times(player.b.points);
    let safebeige = player.cr.beigechroma.max(1);
    if (hasUpgrade('b',21)) base = base.times(upgradeEffect('b',21));
    if (hasMilestone('b',2)) base = base.times(buyableEffect('k', 22));
    if (hasUpgrade('b',22)) base = base.times(buyableEffect('k', 22).pow(buyableEffect('k', 22)));
    if (hasUpgrade('b',24)) base = base.times(upgradeEffect("b", 24));
    if (hasChallenge('c',23)) base = base.times(buyableEffect("k", 23).pow(buyableEffect('k', 23)));
    if (hasUpgrade('g',11)) base = base.times(getFuryBonus(player.b.power));
    if(hasUpgrade("cr", 21)) base = base.times(safebeige.log2().add(1));
    if(hasUpgrade("g", 21)) base = base.times(upgradeEffect("g", 21));
    player.b.power = player.b.power.add(base);
    let gain = player.b.power.sub(oldPower);
    player.b.powerGainRate = diff > 0 ? gain.div(diff) : new Decimal(0);
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
    if (hasMilestone("e", 1) && !hasMilestone('e', 3)) {
        quickUpgBuy("b", [11, 12, 13, 14]);
        }
    if (hasMilestone("e", 2) && !hasMilestone('e', 4)) {
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
        if (hasAchievement('a', 25)) mult = mult.times(achievementEffect('a', 25))
        mult = mult.times(buyableEffect('k', 24))
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
        {key: "c", description: "C: 进行一次挑战者重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
        11:
        {
        requirementDescription:"1.8e31 挑战精神",
        effectDescription:"解锁第九个挑战。",
        done() {return player.c.points.gte(1.8e31)}
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
            return hasMilestone('c', 2)
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
            return hasMilestone('c', 3)
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
            return hasMilestone('c', 4)
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
            return hasMilestone('c', 5)
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
            return hasMilestone('c', 6)
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
            return hasMilestone('c', 7)
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
            return hasMilestone('c', 8)
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
            return hasMilestone('c', 9)
        }
        },
        33: {
        name: "Fen",
        challengeDescription: "在 神圣解放 END 的基础上，禁用φ 精华。",
        goal: new Decimal(1e19),
        goalDescription: "1e19 蛮王等级。",
        rewardDescription: "优化优化器的公式。",
        canComplete() { return player.p.points.gte(1e19); },
        onEnter() { player.g.energy = new Decimal(0); },
        onExit() { player.g.energy = new Decimal(0); },
        onComplete() {
        doPopup("challenge", "Fen 挑战完成！", "挑战完成", 3, "#7fff7f");
        },
        unlocked() {
            return hasMilestone('c', 11)
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
    startData() { return { unlocked: true,  
        points: new Decimal(0), 
        fastBuy: false }; }, 
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
        if (hasAchievement('a', 25)) mult = mult.times(achievementEffect('a', 25))
        if (hasAchievement('a', 31)) mult = mult.times(achievementEffect('a', 31)) 
        return mult;
    },
    gainExp() { return new Decimal(1); },
    row: 2,
    hotkeys: [{ key: "e", description: "E: 进行一次增强者重置", onPress() { if (canReset(this.layer)) doReset(this.layer); } }],
    
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
        description: "优化狂怒能量的公式。",
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
            let raw = player.k.points.pow(0.1).add(1)
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
    content: function() {
        let baseContent = [
            'main-display',
            'prestige-button'
        ];
        if (hasMilestone('e', 7)) {
            baseContent.push(['row', [['display-text', '快速购买：'], ['toggle', ['e', 'fastBuy']]]]);
        }
        baseContent.push('buyables');
        return baseContent;
    },
    unlocked() {
        return player.e.hasAchieved23 === true;
    }
    },
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
        if (player.e.fastBuy) {
            if (canBuyBuyable("e", 11)) buyBuyable("e", 11);
            if (canBuyBuyable("e", 12)) buyBuyable("e", 12);
            if (canBuyBuyable("e", 13)) buyBuyable("e", 13);
            if (hasAchievement("a", 24)) { if (canBuyBuyable("e", 14)) buyBuyable("e", 14); }
        } else {
            let candidates = [];
            let ids = [11, 12, 13];
            if (hasAchievement("a", 24)) ids.push(14);
            for (let id of ids) {
                if (canBuyBuyable("e", id)) {
                    let cost = tmp.e.buyables[id].cost;
                    candidates.push({ id: id, cost: cost });
                }
            }
            candidates.sort((a, b) => a.cost.cmp(b.cost));
            if (candidates.length > 0) {
                buyBuyable("e", candidates[0].id);
            }
        }
    }
    if (hasMilestone("m", 1) && !hasMilestone('m', 2)) {
        quickUpgBuy("m", [11, 12, 13, 14]);
    }
    if (hasMilestone('m', 2)) {
        const eUpgradeIds = [11, 12, 13, 14];
        for (let id of eUpgradeIds) {
            if (!player.e.upgrades.includes(id)) {
                player.e.upgrades.push(id);
            }
        }
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
    startData() { return { unlocked: true, points: new Decimal(0), 
    redchroma: new Decimal(0), redchromaGainRate: new Decimal(0), 
    greenchroma: new Decimal(0), greenchromaGainRate: new Decimal(0), 
    bluechroma: new Decimal(0), bluechromaGainRate: new Decimal(0), 
    graychroma: new Decimal(0), graychromaGainRate: new Decimal(0), 
    yellowchroma: new Decimal(0), yellowchromaGainRate: new Decimal(0), 
    magentachroma: new Decimal(0), magentachromaGainRate: new Decimal(0), 
    cyanchroma: new Decimal(0), cyanchromaGainRate: new Decimal(0), 
    blackchroma: new Decimal(0), blackchromaGainRate: new Decimal(0), 
    orangechroma: new Decimal(0), orangechromaGainRate: new Decimal(0), 
    brownchroma: new Decimal(0), brownchromaGainRate: new Decimal(0), 
    purplechroma: new Decimal(0), purplechromaGainRate: new Decimal(0), 
    beigechroma: new Decimal(0), beigechromaGainRate: new Decimal(0), 
    pinkchroma: new Decimal(0), pinkchromaGainRate: new Decimal(0), 
    tealchroma: new Decimal(0), tealchromaGainRate: new Decimal(0), }; },
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
        if (hasAchievement('a', 25)) mult = mult.times(achievementEffect('a', 25))
        if (hasAchievement('a', 31)) mult = mult.times(achievementEffect('a', 31))
        if (hasUpgrade('cr', 24)) mult = mult.times(upgradeEffect('cr', 24))
        return mult;
    },
    gainExp() { return new Decimal(1); },
    row: 2,
    hotkeys: [{ key: "s", description: "S: 进行一次色彩重置", onPress() { if (canReset(this.layer)) doReset(this.layer); } }],
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
        12:
        {
        requirementDescription:"999000000 色度",
        effectDescription:"解锁主机。",
        done() {return player.cr.points.gte(999000000)}
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
    let purpleBonus = new Decimal(1);
    if (hasUpgrade('cr', 11)) {
        let safepurple = player.cr.purplechroma.max(1);
        purpleBonus = safepurple.log2().add(1);
    }
    let tealBonus = new Decimal(1);
    if (hasUpgrade('cr', 23)) {
        let safeteal = player.cr.tealchroma.max(1);
        tealBonus = safeteal.log2().add(1);
    }
    let selfBonus = new Decimal(1);
    if (hasUpgrade('cr', 14)) {
        let safeteal = player.cr.tealchroma.max(1);
        selfBonus = safeteal.log2().add(1);
    }
    if (player.c.activeChallenge == 32 || player.cr.activeChallenge === 11 || player.cr.activeChallenge === 12 || 
        player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
        player.cr.activeChallenge === 23 || player.c.activeChallenge === 33) {
        if (player.cr.activeChallenge == 11 || player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || 
            player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
            player.c.activeChallenge === 33)
            {player.cr.redchroma = new Decimal(0);player.cr.redchromaGainRate = new Decimal(0)}
        else if (player.cr.points.gte(1)) {
            let redBase = player.b.power.max(1);
            let redGain = redBase.log2().times(phiBonus).times(orangeBonus).times(tealBonus);
            player.cr.redchromaGainRate = redGain;
            player.cr.redchroma = player.cr.redchroma.add(redGain.times(diff));
        }
        if (player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
            player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.greenchroma = new Decimal(0);player.cr.greenchromaGainRate = new Decimal(0)}
        else if (hasMilestone("cr",2)) {
            let greenBase = player.c.points.max(1).max(1);
            let greenGain = greenBase.log2().times(phiBonus).times(brownBonus).times(tealBonus);
            player.cr.greenchromaGainRate = greenGain;
            player.cr.greenchroma = player.cr.greenchroma.add(greenGain.times(diff));
        }
        if (player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
            player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.bluechroma = new Decimal(0);player.cr.bluechromaGainRate = new Decimal(0)}
        else if (hasMilestone("cr",5)) {
            let blueBase = player.e.points.max(1);
            let blueGain = blueBase.log2().times(phiBonus).times(purpleBonus).times(tealBonus);
            player.cr.bluechromaGainRate = blueGain;
            player.cr.bluechroma = player.cr.bluechroma.add(blueGain.times(diff));
        }
        if (player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
            player.c.activeChallenge === 33)
            {player.cr.graychroma = new Decimal(0);player.cr.graychromaGainRate = new Decimal(0)}
        if (hasMilestone("cr",7)) {
            let grayBase = player.k.milk.max(1);
            let grayGain = grayBase.log2().times(phiBonus).times(tealBonus).times(buyableEffect("m", 11));
            player.cr.graychromaGainRate = grayGain;
            player.cr.graychroma = player.cr.graychroma.add(grayGain.times(diff));
        }
        if (player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
            player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.yellowchroma = new Decimal(0);player.cr.yellowchromaGainRate = new Decimal(0)}
        else if (hasMilestone("cr",8)) {
            let yellowBase = player.cr.redchroma.max(1).times(player.cr.greenchroma).max(1);
            let yellowGain = yellowBase.log2().times(phiBonus).times(tealBonus);
            player.cr.yellowchromaGainRate = yellowGain;
            player.cr.yellowchroma = player.cr.yellowchroma.add(yellowGain.times(diff));
        }
        if (player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
            player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.magentachroma = new Decimal(0);player.cr.magentachromaGainRate = new Decimal(0)}
        else if (hasMilestone("cr",9)) {
            let magentaBase = player.cr.redchroma.max(1).times(player.cr.bluechroma).max(1);
            let magentaGain = magentaBase.log2().times(phiBonus).times(tealBonus);
            player.cr.magentachromaGainRate = magentaGain;
            player.cr.magentachroma = player.cr.magentachroma.add(magentaGain.times(diff));
        }
        if (player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
            player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.cyanchroma = new Decimal(0);player.cr.cyanchromaGainRate = new Decimal(0)}
        else if (hasMilestone("cr",10)) {
            let cyanBase = player.cr.greenchroma.max(1).times(player.cr.bluechroma).max(1);
            let cyanGain = cyanBase.log2().times(phiBonus).times(tealBonus);
            player.cr.cyanchromaGainRate = cyanGain;
            player.cr.cyanchroma = player.cr.cyanchroma.add(cyanGain.times(diff));
        }
        if (player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
            player.c.activeChallenge === 33)
            {player.cr.blackchroma = new Decimal(0);player.cr.blackchromaGainRate = new Decimal(0)}
        else if (hasUpgrade("e",21)) {
            let blackBase = player.cr.graychroma.max(1).times(upgradeEffect('p', 23)).max(1);
            let blackGain = blackBase.log2().times(phiBonus).times(tealBonus);
            player.cr.blackchromaGainRate = blackGain;
            player.cr.blackchroma = player.cr.blackchroma.add(blackGain.times(diff));
        }
        if (player.cr.activeChallenge == 11 || player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || 
            player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || 
            player.c.activeChallenge === 33)
            {player.cr.orangechroma = new Decimal(0);player.cr.orangechromaGainRate = new Decimal(0)}
        else if (hasUpgrade("cr",11)) {
            let orangeBase = player.cr.redchroma.max(1).times(player.g.points).max(1);
            let orangeGain = orangeBase.log2().times(phiBonus).times(tealBonus);
            player.cr.orangechromaGainRate = orangeGain;
            player.cr.orangechroma = player.cr.orangechroma.add(orangeGain.times(diff));
        }
        if (player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
            player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.brownchroma = new Decimal(0);player.cr.brownchromaGainRate = new Decimal(0)}
        else if (hasUpgrade("cr",12)) {
            let brownBase = player.cr.greenchroma.max(1).times(player.g.points).max(1);
            let brownGain = brownBase.log2().times(phiBonus).times(tealBonus);
            player.cr.brownchromaGainRate = brownGain;
            player.cr.brownchroma = player.cr.brownchroma.add(brownGain.times(diff));
        }
        if (player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
            player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.purplechroma = new Decimal(0);player.cr.purplechromaGainRate = new Decimal(0)}
        else if (hasUpgrade("cr",13)) {
            let purpleBase = player.cr.bluechroma.max(1).times(player.g.points).max(1);
            let purpleGain = purpleBase.log2().times(phiBonus).times(tealBonus);
            player.cr.purplechromaGainRate = purpleGain;
            player.cr.purplechroma = player.cr.purplechroma.add(purpleGain.times(diff));
        }
        if (player.cr.activeChallenge === 12 || player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || 
            player.cr.activeChallenge === 22 || player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.beigechroma = new Decimal(0);player.cr.beigechromaGainRate = new Decimal(0)}
        else if (hasUpgrade("cr",21)) {
            let beigeBase = player.cr.yellowchroma.max(1).times(player.g.points).max(1);
            let beigeGain = beigeBase.log2().times(phiBonus).times(tealBonus);
            player.cr.beigechromaGainRate = beigeGain;
            player.cr.beigechroma = player.cr.beigechroma.add(beigeGain.times(diff));
        }
        if (player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
            player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.pinkchroma = new Decimal(0);player.cr.pinkchromaGainRate = new Decimal(0)}
        else if (hasUpgrade("cr",22)) {
            let pinkBase = player.cr.magentachroma.max(1).times(player.g.points).max(1);
            let pinkGain = pinkBase.log2().times(phiBonus).times(tealBonus);
            player.cr.pinkchromaGainRate = pinkGain;
            player.cr.pinkchroma = player.cr.pinkchroma.add(pinkGain.times(diff));
        }
        if (player.cr.activeChallenge === 13 || player.cr.activeChallenge === 21 || player.cr.activeChallenge === 22 || 
            player.cr.activeChallenge === 23 || player.c.activeChallenge === 33)
            {player.cr.tealchroma = new Decimal(0);player.cr.tealchromaGainRate = new Decimal(0)}
        else if (hasUpgrade("cr",23)) {
            let tealBase = player.cr.cyanchroma.max(1).times(player.g.points).max(1);
            let tealGain = tealBase.log2().times(phiBonus).times(selfBonus);
            player.cr.tealchromaGainRate = tealGain;
            player.cr.tealchroma = player.cr.tealchroma.add(tealGain.times(diff));
        }
    } else {
        if (player.cr.points.gte(1)) {
            let redBase = player.b.power.max(1).times(player.cr.points).max(1);
            let redGain = redBase.log2().times(phiBonus).times(orangeBonus).times(tealBonus);
            player.cr.redchromaGainRate = redGain;
            player.cr.redchroma = player.cr.redchroma.add(redGain.times(diff));
        }
        if (hasMilestone("cr",2)) {
            let greenBase = player.c.points.max(1).times(player.cr.points).max(1);
            let greenGain = greenBase.log2().times(phiBonus).times(brownBonus).times(tealBonus);
            player.cr.greenchromaGainRate = greenGain;
            player.cr.greenchroma = player.cr.greenchroma.add(greenGain.times(diff));
        }
        if (hasMilestone("cr",5)) {
            let blueBase = player.e.points.max(1).times(player.cr.points).max(1);
            let blueGain = blueBase.log2().times(phiBonus).times(purpleBonus).times(tealBonus);
            player.cr.bluechromaGainRate = blueGain;
            player.cr.bluechroma = player.cr.bluechroma.add(blueGain.times(diff));
        }
        if (hasMilestone("cr",7)) {
            let grayBase = player.k.milk.max(1).times(player.cr.points).max(1);
            let grayGain = grayBase.log2().times(phiBonus).times(tealBonus).times(buyableEffect("m", 11));
            player.cr.graychromaGainRate = grayGain;
            player.cr.graychroma = player.cr.graychroma.add(grayGain.times(diff));
        }
        if (hasMilestone("cr",8)) {
            let yellowBase = player.cr.redchroma.max(1).times(player.cr.greenchroma).max(1);
            let yellowGain = yellowBase.log2().times(phiBonus).times(tealBonus);
            player.cr.yellowchromaGainRate = yellowGain;
            player.cr.yellowchroma = player.cr.yellowchroma.add(yellowGain.times(diff));
        }
        if (hasMilestone("cr",9)) {
            let magentaBase = player.cr.redchroma.max(1).times(player.cr.bluechroma).max(1);
            let magentaGain = magentaBase.log2().times(phiBonus).times(tealBonus);
            player.cr.magentachromaGainRate = magentaGain;
            player.cr.magentachroma = player.cr.magentachroma.add(magentaGain.times(diff));
        }
        if (hasMilestone("cr",10)) {
            let cyanBase = player.cr.greenchroma.max(1).times(player.cr.bluechroma).max(1);
            let cyanGain = cyanBase.log2().times(phiBonus).times(tealBonus);
            player.cr.cyanchromaGainRate = cyanGain;
            player.cr.cyanchroma = player.cr.cyanchroma.add(cyanGain.times(diff));
        }
        if (hasUpgrade("e",21)) {
            let blackBase = player.cr.graychroma.max(1).times(upgradeEffect('p', 23)).max(1);
            let blackGain = blackBase.log2().times(phiBonus).times(tealBonus);
            player.cr.blackchromaGainRate = blackGain;
            player.cr.blackchroma = player.cr.blackchroma.add(blackGain.times(diff));
        }
        if (hasUpgrade("cr",11)) {
            let orangeBase = player.cr.redchroma.max(1).times(player.g.points).max(1);
            let orangeGain = orangeBase.log2().times(phiBonus).times(tealBonus);
            player.cr.orangechromaGainRate = orangeGain;
            player.cr.orangechroma = player.cr.orangechroma.add(orangeGain.times(diff));
        }
        if (hasUpgrade("cr",12)) {
            let brownBase = player.cr.greenchroma.max(1).times(player.g.points).max(1);
            let brownGain = brownBase.log2().times(phiBonus).times(tealBonus);
            player.cr.brownchromaGainRate = brownGain;
            player.cr.brownchroma = player.cr.brownchroma.add(brownGain.times(diff));
        }
        if (hasUpgrade("cr",13)) {
            let purpleBase = player.cr.bluechroma.max(1).times(player.g.points).max(1);
            let purpleGain = purpleBase.log2().times(phiBonus).times(tealBonus);
            player.cr.purplechromaGainRate = purpleGain;
            player.cr.purplechroma = player.cr.purplechroma.add(purpleGain.times(diff));
        }
        if (hasUpgrade("cr",21)) {
            let beigeBase = player.cr.yellowchroma.max(1).times(player.g.points).max(1);
            let beigeGain = beigeBase.log2().times(phiBonus).times(tealBonus);
            player.cr.beigechromaGainRate = beigeGain;
            player.cr.beigechroma = player.cr.beigechroma.add(beigeGain.times(diff));
        }
        if (hasUpgrade("cr",22)) {
            let pinkBase = player.cr.magentachroma.max(1).times(player.g.points).max(1);
            let pinkGain = pinkBase.log2().times(phiBonus).times(tealBonus);
            player.cr.pinkchromaGainRate = pinkGain;
            player.cr.pinkchroma = player.cr.pinkchroma.add(pinkGain.times(diff));
        }
        if (hasUpgrade("cr",23)) {
            let tealBase = player.cr.cyanchroma.max(1).times(player.g.points).max(1);
            let tealGain = tealBase.log2().times(phiBonus).times(selfBonus);
            player.cr.tealchromaGainRate = tealGain;
            player.cr.tealchroma = player.cr.tealchroma.add(tealGain.times(diff));
        }
    }
    },
    microtabs: {
        chromaGroup: {
            "颜色色度": {
                content: [['display-text',
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
            }}]]
            },
            "颜色色度 II": {
                content: [
            ['display-text', function() {if(hasUpgrade("cr",11)){
            	return `你有 <h3 style="color: #ff7f00; text-shadow: 10px">${format(player.cr.orangechroma)}</h3> 大橙色度,为你的色彩提供 <h3 style="color: #ff7f00; text-shadow: 10px">${format(player.cr.orangechroma.log2().add(1))}</h3> 倍率的殷红色度`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",11)){
                    return `你每秒获得 <h3 style="color: #ff7f00; text-shadow: 10px">${format(player.cr.orangechromaGainRate)}</h3> 大橙色度`;
            }}],
            ['display-text', function() {if(hasUpgrade("cr",12)){
            	return `你有 <h3 style="color: #3f1f00; text-shadow: 10px">${format(player.cr.brownchroma)}</h3> 煤棕色度,为你的色彩提供 <h3 style="color: #3f1f00; text-shadow: 10px">${format(player.cr.brownchroma.log2().add(1))}</h3> 倍率的翠绿色度`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",12)){
                    return `你每秒获得 <h3 style="color: #3f1f00; text-shadow: 10px">${format(player.cr.brownchromaGainRate)}</h3> 煤棕色度`;
            }}],
            ['display-text', function() {if(hasUpgrade("cr",13)){
            	return `你有 <h3 style="color: #7f00ff; text-shadow: 10px">${format(player.cr.purplechroma)}</h3> 螺紫色度,为你的色彩提供 <h3 style="color: #7f00ff; text-shadow: 10px">${format(player.cr.purplechroma.log2().add(1))}</h3> 倍率的苍蓝色度`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",13)){
                    return `你每秒获得 <h3 style="color: #7f00ff; text-shadow: 10px">${format(player.cr.purplechromaGainRate)}</h3> 螺紫色度`;
            }}],
            ['display-text', function() {if(hasUpgrade("cr",21)){
            	return `你有 <h3 style="color: #ffff7f; text-shadow: 10px">${format(player.cr.beigechroma)}</h3> 米黄色度,为你的狂战士提供 <h3 style="color: #ffff7f; text-shadow: 10px">${format(player.cr.beigechroma.log2().add(1))}</h3> 倍率的狂怒能量`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",21)){
                    return `你每秒获得 <h3 style="color: #ffff7f; text-shadow: 10px">${format(player.cr.beigechromaGainRate)}</h3> 米黄色度`;
            }}],
            ['display-text', function() {if(hasUpgrade("cr",22)){
            	return `你有 <h3 style="color: #ff7fff; text-shadow: 10px">${format(player.cr.pinkchroma)}</h3> 鲜粉色度,为你的神祇提供 <h3 style="color: #ff7fff; text-shadow: 10px">${format(player.cr.pinkchroma.log2().add(1))}</h3> 倍率的φ 精华`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",22)){
                    return `你每秒获得 <h3 style="color: #ff7fff; text-shadow: 10px">${format(player.cr.pinkchromaGainRate)}</h3> 鲜粉色度`;
            }}],
            ['display-text', function() {if(hasUpgrade("cr",23)){
            	return `你有 <h3 style="color: #007777; text-shadow: 10px">${format(player.cr.tealchroma)}</h3> 深青色度,为你的色彩提供 <h3 style="color: #007777; text-shadow: 10px">${format(player.cr.tealchroma.log2().add(1))}</h3> 倍率的其他所有颜色色度`
            }}],
            ['display-text', function() {if(hasUpgrade("cr",23)){
                    return `你每秒获得 <h3 style="color: #007777; text-shadow: 10px">${format(player.cr.tealchromaGainRate)}</h3> 深青色度`;
            }}]],
                unlocked() { return hasMilestone('cr', 11) }
            }
        }
    },
    tabFormat:{
        '色彩':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            'prestige-button',
            ['microtabs', 'chromaGroup']
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
        13: {
            title: "解放螺紫",
            description: "解锁螺紫色度。",
            cost: new Decimal(1400000),
            unlocked() {return hasChallenge('cr', 13); }
        },
        21: {
            title: "解放米黄",
            description: "解锁米黄色度。",
            cost: new Decimal(1600000),
            unlocked() {return hasChallenge('cr', 21); }
        },
        22: {
            title: "解放鲜粉",
            description: "解锁鲜粉色度。",
            cost: new Decimal(1800000),
            unlocked() {return hasChallenge('cr', 22); }
        },
        23: {
            title: "解放背景",
            description: "解锁深青色度。",
            cost: new Decimal(2000000),
            unlocked() {return hasChallenge('cr', 23); },
            onPurchase() {
            player.Antiteal = true;
            updateBackgroundStyle();
            }
        },
        14: {
            title: "解放深青",
            description: "深青色度也可以增益自身获取。",
            cost: new Decimal(3500000),
            effect() {let safeteal = player.cr.tealchroma.max(1);return safeteal.log2().add(1)},
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x"; 
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {return hasUpgrade('g', 24); }
        },
        24: {
            title: "解放色度",
            description: "色度也可以增益自身获取。",
            cost: new Decimal(10000000),
            effect() {
            let raw = (player.cr.points.max(1)).log2()
            return applySoftcap(raw);
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return getUpgradeDisplay(this.layer, this.id);
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {return hasUpgrade('g', 24); }
        },
    },
    challenges: {
    11: {
        name: "神圣解放 I",
        challengeDescription: "在 K4SHM1R 的基础上，禁用殷红和灰中立色度。",
        goal: new Decimal(1e16),
        goalDescription: "1e16 蛮王等级。",
        rewardDescription: "解锁新的色彩升级。",
        canComplete() { return player.p.points.gte(1e16); },
        onComplete() {
        doPopup("challenge", "神圣解放 I 挑战完成！", "挑战完成", 3, "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return true
        }
    },
    12: {
        name: "神圣解放 II",
        challengeDescription: "在 神圣解放 I 的基础上，禁用翠绿色度。",
        goal: new Decimal(1.5e16),
        goalDescription: "1.5e16 蛮王等级。",
        rewardDescription: "解锁新的色彩升级。",
        canComplete() { return player.p.points.gte(1.5e16); },
        onComplete() {
        doPopup("challenge", "神圣解放 II 挑战完成！", "挑战完成", 3, "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return (hasUpgrade("cr", 11))
        }
    },
    13: {
        name: "神圣解放 III",
        challengeDescription: "在 神圣解放 II 的基础上，禁用苍蓝色度。",
        goal: new Decimal(2e16),
        goalDescription: "2e16 蛮王等级。",
        rewardDescription: "解锁新的色彩升级。",
        canComplete() { return player.p.points.gte(2e16); },
        onComplete() {
        doPopup("challenge", "神圣解放 III 挑战完成！", "挑战完成", 3, "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return (hasUpgrade("cr", 12))
        }
    },
    21: {
        name: "神圣解放 IIII",
        challengeDescription: "在 神圣解放 III 的基础上，禁用中立色度。",
        goal: new Decimal(2.5e16),
        goalDescription: "2.5e16 蛮王等级。",
        rewardDescription: "解锁新的色彩升级。",
        canComplete() { return player.p.points.gte(2.5e16); },
        onComplete() {
        doPopup("challenge", "神圣解放 IIII 挑战完成！", "挑战完成", 3, "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return (hasUpgrade("cr", 13))
        }
    },
    22: {
        name: "神圣解放 V",
        challengeDescription: "在 神圣解放 IIII 的基础上，禁用蛮王升级 41 42 43。",
        goal: new Decimal(3.14e16),
        goalDescription: "3.14e16 蛮王等级。",
        rewardDescription: "解锁新的色彩升级。",
        canComplete() { return player.p.points.gte(3.14e16); },
        onComplete() {
        doPopup("challenge", "神圣解放 V 挑战完成！", "挑战完成", 3, "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return (hasUpgrade("cr", 21))
        }
    },
    23: {
        name: "神圣解放 END",
        challengeDescription: "在 神圣解放 V 的基础上，GTP无法倍增φ 精华获取。",
        goal: new Decimal(5e16),
        goalDescription: "5e16 蛮王等级。",
        rewardDescription: "解锁新的色彩升级。",
        canComplete() { return player.p.points.gte(5e16); },
        onEnter() { player.g.energy = new Decimal(0); },
        onExit() { player.g.energy = new Decimal(0); },
        onComplete() {
        doPopup("challenge", "神圣解放 END 挑战完成！", "挑战完成", 3, "linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #7fff00, #00ff00, #00ff7f, #00ffff, #007fff, #0000ff, #7f00ff, #ff00ff, #ff007f)");
        },
        unlocked() {
            return (hasUpgrade("cr", 22))
        }
    },
    },
    layerShown() { return hasUpgrade('p', 44) || player.cr.points.gte(1); }
});
addLayer("g", {
    name: "神祇",
    symbol: "G",
    position: 1,
    startData() { return { unlocked: true,points: new Decimal(0),energy: new Decimal(0),energyGainRate: new Decimal(0)}; },
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
    hotkeys: [{ key: "g", description: "G: 进行一次神祇重置", onPress() { if (canReset(this.layer)) doReset(this.layer); } }],
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
    if (player.c.activeChallenge === 33){player.g.energy = new Decimal(0);player.g.energyGainRate = new Decimal(0)}
    else if (player.cr.activeChallenge === 23){
    if (hasAchievement("a", 32)){
    let safepink = player.cr.pinkchroma.max(1);
    let energygainPerSecond = safepink.log2().add(1).times(achievementEffect("a", 32)).times(buyableEffect("m", 12));
    player.g.energyGainRate = energygainPerSecond;
    player.g.energy = player.g.energy.add(energygainPerSecond.times(diff));}
    else {
    let safepink = player.cr.pinkchroma.max(1);
    let energygainPerSecond = safepink.log2().add(1).times(buyableEffect("m", 12));
    player.g.energyGainRate = energygainPerSecond;
    player.g.energy = player.g.energy.add(energygainPerSecond.times(diff));}}
    else if (hasAchievement("a", 32)){
    let safepink = player.cr.pinkchroma.max(1);
    let energygainPerSecond = player.g.points.pow(player.g.points).times(safepink.log2().add(1)).times(achievementEffect("a", 32)).times(buyableEffect("m", 12));
    player.g.energyGainRate = energygainPerSecond;
    player.g.energy = player.g.energy.add(energygainPerSecond.times(diff));}
    else if(hasUpgrade("cr", 21)){
    let safepink = player.cr.pinkchroma.max(1);
    let energygainPerSecond = player.g.points.pow(player.g.points).times(safepink.log2().add(1)).times(buyableEffect("m", 12));
    player.g.energyGainRate = energygainPerSecond;
    player.g.energy = player.g.energy.add(energygainPerSecond.times(diff));}
    else if (player.g.points.gt(0)) {
    let energygainPerSecond = player.g.points.pow(player.g.points).times(buyableEffect("m", 12));
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
    7: {
        requirementDescription:"8 GTP",
        effectDescription:"φ 精华不再重置。",
        done() {return player.g.points.gte(8)}
    }
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
    21: {
    title: "本应如此",
    description: "φ 精华也可以增益狂怒能量获取。",
    cost: new Decimal(2e10),
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
    22: {
    title: "直接供给",
    description: "φ 精华也可以增益蛮王经验值获取。",
    cost: new Decimal(4e10),
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
    23: {
    title: "折算丢包",
    description: "φ 精华也可以增益牛奶获取。",
    cost: new Decimal(6e10),
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
    24: {
    title: "你已触发神怒",
    description: "解锁新的色彩升级。",
    cost: new Decimal(8.14e10),
    currencyInternalName: "energy",
    currencyLayer: "g",
    currencyDisplayName: "φ 精华",
    }
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
addLayer("m", {
    name: "主机",
    symbol: "M",
    position: 0,
    startData() { return { unlocked: true, 
        points: new Decimal(0), 
    byte: new Decimal(0), byteGainRate: new Decimal(0), 
    hdd: new Decimal(0), hddGainRate: new Decimal(0), 
    ssd: new Decimal(0), ssdGainRate: new Decimal(0), 
    pagefile: new Decimal(0), pagefileGainRate: new Decimal(0), 
    ram: new Decimal(0), ramGainRate: new Decimal(0), 
    l3Cache: new Decimal(0), l3CacheGainRate: new Decimal(0), 
    l2Cache: new Decimal(0), l2CacheGainRate: new Decimal(0), 
    l1Cache: new Decimal(0), l1CacheGainRate: new Decimal(0), 
    register: new Decimal(0), registerGainRate: new Decimal(0), }; },
    color: "#ffffff",
    requires: new Decimal(1e9),
    resource: "主机端口",
    baseResource: "色度",
    baseAmount() { return player.cr.points; },
    type: "normal",
    exponent: 0.1,
    branches: ["cr"],
    gainMult() {
        let mult = new Decimal(1);
        if (hasAchievement('a', 25)) mult = mult.times(achievementEffect('a', 25))
        mult = mult.times(buyableEffect('m', 14));
        return mult;
    },
    gainExp() { return new Decimal(1); },
    row: 3,
    hotkeys: [{ key: "m", description: "M: 进行一次主机重置", onPress() { if (canReset(this.layer)) doReset(this.layer); } }],
    style: {
        background: "linear-gradient(135deg, #000000, #00003f)",
        minHeight: "100vh",
    },
    nodeStyle: {
        background: "linear-gradient(135deg, #000000, #00007f, #000000)",
        border: 'none',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
    },
    update(diff) {
    if (player.m.points.gte(1)) {
            let byteBase = player.m.points
            let byteGain = byteBase.times(player.m.hdd.add(1))
            player.m.byteGainRate = byteGain;
            player.m.byte = player.m.byte.add(byteGain.times(diff));
    }
    if (hasUpgrade("m",11)) {
            let hddBase = player.m.points
            let hddGain = hddBase.times(player.m.ssd.add(1))
            player.m.hddGainRate = hddGain;
            player.m.hdd = player.m.hdd.add(hddGain.times(diff));
    }
    if (hasUpgrade("m",12)) {
            let ssdBase = player.m.points
            let ssdGain = ssdBase.times(player.m.pagefile.add(1))
            player.m.ssdGainRate = ssdGain;
            player.m.ssd = player.m.ssd.add(ssdGain.times(diff));
    }
    if (hasUpgrade("m",13)) {
            let pagefileBase = player.m.points
            let pagefileGain = pagefileBase.times(player.m.ram.add(1))
            player.m.pagefileGainRate = pagefileGain;
            player.m.pagefile = player.m.pagefile.add(pagefileGain.times(diff));
    }
    if (hasUpgrade("m",14)) {
            let ramBase = player.m.points
            let ramGain = ramBase.times(player.m.l3Cache.add(1))
            player.m.ramGainRate = ramGain;
            player.m.ram = player.m.ram.add(ramGain.times(diff));
    }
    if (hasUpgrade("m",21)) {
            let l3CacheBase = player.m.points
            let l3CacheGain = l3CacheBase.times(player.m.l2Cache.add(1))
            player.m.l3CacheGainRate = l3CacheGain;
            player.m.l3Cache = player.m.l3Cache.add(l3CacheGain.times(diff));
    }
    if (hasUpgrade("m",22)) {
            let l2CacheBase = player.m.points
            let l2CacheGain = l2CacheBase.times(player.m.l1Cache.add(1))
            player.m.l2CacheGainRate = l2CacheGain;
            player.m.l2Cache = player.m.l2Cache.add(l2CacheGain.times(diff));
    }
    if (hasUpgrade("m",23)) {
            let l1CacheBase = player.m.points
            let l1CacheGain = l1CacheBase.times(player.m.register.add(1))
            player.m.l1CacheGainRate = l1CacheGain;
            player.m.l1Cache = player.m.l1Cache.add(l1CacheGain.times(diff));
    }
    if (hasUpgrade("m",24)) {
            let registerBase = player.m.points
            let registerGain = registerBase
            player.m.registerGainRate = registerGain;
            player.m.register = player.m.register.add(registerGain.times(diff));
    }
    },
    microtabs: {
    mainGroup: {
        "主机资源": {
            content: [
                ['display-text', function() {
                    if (player.m.points.gte(1)) {
                        let safeByte = player.m.byte.max(1);
                        return `你有 <h3 style="color: #00007f; text-shadow: 10px">${format(player.m.byte)}</h3> 字节,倍增游戏全局速度 <h3 style="color: #00007f; text-shadow: 10px">${format(getByteSpeedMult())}</h3> 倍`;
                    }
                }],
                ['display-text', function() {
                    if (player.m.points.gte(1)) {
                        return `你每秒获得 <h3 style="color: #00007f; text-shadow: 10px">${format(player.m.byteGainRate)}</h3> 字节`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 11)) {
                        return `你有 <h3 style="color: #0f0f8f; text-shadow: 10px">${format(player.m.hdd)}</h3> HDD，每秒可以生产等量字节`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 11)) {
                        return `你每秒获得 <h3 style="color: #0f0f8f; text-shadow: 10px">${format(player.m.hddGainRate)}</h3> HDD`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 12)) {
                        return `你有 <h3 style="color: #1f1f9f; text-shadow: 10px">${format(player.m.ssd)}</h3> SSD，每秒可以生产等量 HDD`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 12)) {
                        return `你每秒获得 <h3 style="color: #1f1f9f; text-shadow: 10px">${format(player.m.ssdGainRate)}</h3> SSD`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 13)) {
                        return `你有 <h3 style="color: #2f2faf; text-shadow: 10px">${format(player.m.pagefile)}</h3> 虚拟内存，每秒可以生产等量 SSD`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 13)) {
                        return `你每秒获得 <h3 style="color: #2f2faf; text-shadow: 10px">${format(player.m.pagefileGainRate)}</h3> 虚拟内存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 14)) {
                        return `你有 <h3 style="color: #3f3fbf; text-shadow: 10px">${format(player.m.ram)}</h3> RAM，每秒可以生产等量 虚拟内存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 14)) {
                        return `你每秒获得 <h3 style="color: #3f3fbf; text-shadow: 10px">${format(player.m.ramGainRate)}</h3> RAM`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 21)) {
                        return `你有 <h3 style="color: #4f4fcf; text-shadow: 10px">${format(player.m.l3Cache)}</h3> L3缓存，每秒可以生产等量 RAM`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 21)) {
                        return `你每秒获得 <h3 style="color: #4f4fcf; text-shadow: 10px">${format(player.m.l3CacheGainRate)}</h3> L3缓存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 22)) {
                        return `你有 <h3 style="color: #5f5fdf; text-shadow: 10px">${format(player.m.l2Cache)}</h3> L2缓存，每秒可以生产等量 L3缓存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 22)) {
                        return `你每秒获得 <h3 style="color: #5f5fdf; text-shadow: 10px">${format(player.m.l2CacheGainRate)}</h3> L2缓存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 23)) {
                        return `你有 <h3 style="color: #6f6fef; text-shadow: 10px">${format(player.m.l1Cache)}</h3> L1缓存，每秒可以生产等量 L2缓存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 23)) {
                        return `你每秒获得 <h3 style="color: #6f6fef; text-shadow: 10px">${format(player.m.l1CacheGainRate)}</h3> L1缓存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 23)) {
                        return `你有 <h3 style="color: #7f7fff; text-shadow: 10px">${format(player.m.register)}</h3> 寄存器，每秒可以生产等量 L1缓存`;
                    }
                }],
                ['display-text', function() {
                    if (hasUpgrade("m", 23)) {
                        return `你每秒获得 <h3 style="color: #7f7fff; text-shadow: 10px">${format(player.m.registerGainRate)}</h3> 寄存器`;
                    }
                }]
            ]
        }
    }
    },
    tabFormat:{
        '主机':{
            content:[
            //['infoboxes','main-text'],
            'main-display',
            'prestige-button',
            ['microtabs', 'mainGroup'],
            'upgrades'
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
        "主机革新": {
        content: [
            'main-display',
            'prestige-button',
            'buyables'
        ],
        unlocked() {
            return hasMilestone("m", 4)
        }
        }
    },
    milestones:{
        1:
        {
        requirementDescription:"2 主机端口",
        effectDescription:"自动购买第一行增强者升级。",
        done() {return player.m.points.gte(2)}
        },
        2:
        {
        requirementDescription:"3 主机端口",
        effectDescription:"免费自动购买第一行增强者升级。",
        done() {return player.m.points.gte(3)}
        },
        3:
        {
        requirementDescription:"5 主机端口",
        effectDescription:"解锁主机升级。",
        done() {return player.m.points.gte(5)}
        },
        4:
        {
        requirementDescription:"游戏速度达到5.68x",
        effectDescription:"解锁主机革新。",
        done() {
        if (!player.m || !player.m.byte) return false;
        return getByteSpeedMult().gte(5.68);
        }
        },
        5:
        {
        requirementDescription:"10 主机端口",
        effectDescription:"主机资源不再重置。",
        done() {return player.m.points.gte(10)}
        },
        6:
        {
        requirementDescription:"游戏速度达到8.2x",
        effectDescription:"解锁第五列成就。",
        done() {
        if (!player.m || !player.m.byte) return false;
        return getByteSpeedMult().gte(8.2);
        }
        },
    },
    upgrades:{
        11: {
            title: "机械存储",
            description: "解锁 HDD。",
            cost: new Decimal(5),
            unlocked() {
            return (hasMilestone("m", 3))
            }
        },
        12: {
            title: "固态存储",
            description: "解锁 SSD。",
            cost: new Decimal(1),
            unlocked() {
            return (hasUpgrade("m", 11))
            }
        },
        13: {
            title: "虚拟存储",
            description: "解锁虚拟内存。",
            cost: new Decimal(1),
            unlocked() {
            return (hasUpgrade("m", 12))
            }
        },
        14: {
            title: "高效存储",
            description: "解锁 RAM。",
            cost: new Decimal(1),
            unlocked() {
            return (hasUpgrade("m", 13))
            }
        },
        21: {
            title: "缓存存储 I",
            description: "解锁 L3缓存。",
            cost: new Decimal(1),
            unlocked() {
            return (hasUpgrade("m", 14))
            }
        },
        22: {
            title: "缓存存储 II",
            description: "解锁 L2缓存。",
            cost: new Decimal(1),
            unlocked() {
            return (hasUpgrade("m", 21))
            }
        },
        23: {
            title: "缓存存储 III",
            description: "解锁 L1缓存。",
            cost: new Decimal(1),
            unlocked() {
            return (hasUpgrade("m", 22))
            }
        },
        24: {
            title: "缓存存储 END",
            description: "解锁寄存器。",
            cost: new Decimal(1),
            unlocked() {
            return (hasUpgrade("m", 23))
            }
        }
    },
    buyables:{
        11: {
            title: "高刷屏幕革新",
            cost(x) { return new Decimal(x).add(x).add(1) },
            display() {return "增益中立色度获取。<br>需要"+format(this.cost())+"主机端口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() {
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
            title: "GDDR 革新",
            cost(x) { return new Decimal(2).pow(x) },
            display() {return "增益φ 精华获取。<br>需要"+format(this.cost())+"主机端口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() {
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
            title: "DDR 革新",
            cost(x) { return new Decimal(3).pow(x) },
            display() {return "增益牛奶获取。<br>需要"+format(this.cost())+"主机端口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() {
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
            title: "CPU 架构革新",
            cost(x) { return new Decimal(4).pow(x) },
            display() {return "增益主机端口获取。<br>需要"+format(this.cost())+"主机端口<br>当前:倍增"+format(buyableEffect(this.layer, this.id))},
            canAfford() {
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
    },
    layerShown() { return hasMilestone('cr', 12) || player.m.points.gte(1); }
});
