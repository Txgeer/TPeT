function getVisibleLayerCount() {
    let count = 0;
    for (let layer of LAYERS) {
        if (tmp[layer] && tmp[layer].layerShown) {
            count++;
        }
    }
    return count;
}
function getTotalUpgradeCount() {
    let count = 0;
    for (let layer of LAYERS) {
        if (player[layer] && Array.isArray(player[layer].upgrades)) {
            count++;
        }
    }
    return count;
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
    baseResource: "", // Name of resource prestige is based on
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
        name: "开拓者",
        tooltip: "要求：获得 5 田地。<br>奖励：解锁5个新的农业升级。",
        done() {return player.f.points.gte(5)},
    },
    12: {
        name: "70 Billions",
        tooltip: "要求：获得 14 人力。<br>奖励：解锁畜牧业。",
        done() {return player.m.points.gte(14)},
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
    layerShown() {
        if (hasAchievement("a", 11)) {
            player.a.shown = true;
        }
        return player.a.shown;
    }
})
addLayer("f", {
    name: "农业",
    symbol: "F",
    position: 0,
    startData() {
        return {
            unlocked: true,
            shown: false,
            activeCrop: "wheat",
            points: new Decimal(0),
            wheat: new Decimal(0),
            wheatGainRate: new Decimal(0),
            rice: new Decimal(0),
            riceGainRate: new Decimal(0),
        };
    },
    color: "#7f3f00",
    requires: new Decimal(10),
    resource: "田地",
    baseResource: "绿钞",
    baseAmount() { return player.points; },
    type: "static",
    exponent: 0.5,
    gainMult() {
        let mult = new Decimal(1);
        if (player.f.rice.gt(0)) mult = mult.div(player.f.rice.add(1).log10()) 
        if (hasUpgrade('m', 11)) mult = mult.div(upgradeEffect('m', 11)) 
        if (hasUpgrade('m', 12)) mult = mult.div(upgradeEffect('m', 12)) 
        if (hasUpgrade('m', 13)) mult = mult.div(upgradeEffect('m', 13)) 
        if (hasUpgrade('m', 13)) mult = mult.div(upgradeEffect('m', 14)) 
        return mult;
    },
    gainExp() {
        return new Decimal(1);
    },
    row: 0,
    hotkeys: [
        { key: "f", description: "F: 进行一次农业重置", onPress() { if (canReset(this.layer)) doReset(this.layer); } },
    ],
    doReset(resettingLayer) {
        let keep = ["shown"];
        if (layers[resettingLayer].row>=1) {
        layerDataReset(this.layer, keep);
        }
    },
    microtabs: {
        cropGroup: {
            "粮食作物": {
                content: [
                    ['display-text', function() {
                        if (hasUpgrade("f", 11)) {
                            let isActive = (player.f.activeCrop || "wheat") === "wheat";
                            let color = "#bfbf7f";
                            let shadow = isActive ? "0 0 25px #bfbf7f" : "0 0 0px #bfbf7f";
                            return `你有 <h3 style="color: ${color}; text-shadow: ${shadow}">${format(player.f.wheat)}</h3> 小麦，为你的农庄提供 <h3 style="color: ${color}; text-shadow: ${shadow}">${format(player.f.wheat.add(1).log10())}</h3> 倍率的绿钞`;
                        }
                    }],
                    ['display-text', function() {
                        if (hasUpgrade("f", 11)) {
                            let isActive = (player.f.activeCrop || "wheat") === "wheat";
                            let rate = isActive ? player.f.wheatGainRate : new Decimal(0);
                            let color = "#bfbf7f";
                            let shadow = isActive ? "0 0 20px #bfbf7f" : "0 0 0px #bfbf7f";
                            return `你每秒获得 <h3 style="color: ${color}; text-shadow: ${shadow}">${format(rate)}</h3> 小麦`;
                        }
                    }],
                    ['display-text', function() {
                        if (hasUpgrade("f", 12)) {
                            let isActive = (player.f.activeCrop || "wheat") === "rice";
                            let color = "#ffffbf";
                            let shadow = isActive ? "0 0 25px #ffffbf" : "0 0 0px #ffffbf";
                            return `你有 <h3 style="color: ${color}; text-shadow: ${shadow}">${format(player.f.rice)}</h3> 水稻，为你的农庄提供 <h3 style="color: ${color}; text-shadow: ${shadow}">${format(player.f.rice.add(1).log10())}</h3> 倍率的田地`;
                        }
                    }],
                    ['display-text', function() {
                        if (hasUpgrade("f", 12)) {
                           let isActive = (player.f.activeCrop || "wheat") === "rice";
                           let rate = isActive ? player.f.riceGainRate : new Decimal(0);
                           let color = "#ffffbf";
                           let shadow = isActive ? "0 0 20px #ffffbf" : "0 0 0px #ffffbf";
                           return `你每秒获得 <h3 style="color: ${color}; text-shadow: ${shadow}">${format(rate)}</h3> 水稻`;
                        }
                    }],
                ]
            }
        }
    },
    tabFormat: {
        "农业": {
            content: [
                ['display-text', function() {
                    let hasRice = hasUpgrade("f", 12);
                    let crop = player.f.activeCrop || "wheat";
                    let wheatBtn = `<button class="opt" style="height:50px;width:100px;font-size:14px;margin:5px;background-color:#bfbf7f;color:#7f7f7f;" onclick="player.f.activeCrop = 'wheat'">小麦</button>`;
                    let riceBtn = hasRice ? `<button class="opt" style="height:50px;width:100px;font-size:14px;margin:5px;background-color:#ffffbf;color:#7f7f7f;" onclick="player.f.activeCrop = 'rice'">水稻</button>` : '';
                    return `<div style="margin-bottom:10px;">
                        <span>当前：${crop === 'wheat' ? '小麦' : '水稻'}</span><br>
                        ${wheatBtn}
                        ${riceBtn}
                    </div>`;
                }],
                ['infobox', 'story'],
                'main-display',
                'prestige-button',
                ['microtabs', 'cropGroup'],
                'upgrades',
            ]
        },
        "科学": {
            content: function() {
                let components = [
                    ['infobox', 'wheat'], 
                ]; 
                if (hasUpgrade("f", 12)) components.push(['infobox', 'rice']);
                return components;
            },
            unlocked() {
                return hasUpgrade("f", 11);
            }
        }
    },
    upgrades: {
        11: {
            title: "农业的开始",
            description: "解锁小麦。",
            cost: new Decimal(1),
        },
        12: {
            title: "多元化发展",
            description: "解锁水稻。",
            cost: new Decimal(2),
        },
        13: {
            title: "小麦加速",
            description: "小麦增益自身获取。",
            cost: new Decimal(5),
            effect() {
            return player.f.wheat.add(10).log10()
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            return hasAchievement('a',11);
            }
        },
        21: {
            title: "小麦种子",
            description: "绿钞增益小麦获取。",
            cost: new Decimal(3),
            effect() {
            return player.points.add(10).log10()
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
        },
        22: {
            title: "水稻种子",
            description: "绿钞增益水稻获取。",
            cost: new Decimal(4),
            effect() {
            return player.points.add(10).log10().pow(0.5)
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
        },
        23: {
            title: "水稻加速",
            description: "水稻增益自身获取。",
            cost: new Decimal(6),
            effect() {
            return player.f.rice.add(10).log10().pow(0.5)
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            return hasAchievement('a',11);
            }
        },
        31: {
            title: "小麦辅助",
            description: "小麦增益水稻获取。",
            cost: new Decimal(7),
            effect() {
            return player.f.wheat.add(10).log10().pow(0.75)
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            return hasAchievement('a',11);
            }
        },
        32: {
            title: "水稻辅助",
            description: "水稻增益小麦获取。",
            cost: new Decimal(8),
            effect() {
            return player.f.rice.add(10).log10().pow(0.25)
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
            unlocked() {
            return hasAchievement('a',11);
            }
        },
        33: {
            title: "人力机器",
            description: "解锁人力。",
            cost: new Decimal(9),
            unlocked() {
            return hasAchievement('a',11);
            }
        },
    },
    infoboxes: {
        "story": {
            title: "章节 0：开端",
            body: "你是一位游戏开发者，在开发完毕你的新游戏《蛮王树》之后，你感到浑身疲倦，仿佛人生失去了意义。但在此时，你突然想起祖父家里有一片大庄园等待着你，于是你立刻启程前往，发现这里却是一片荒凉......你觉得你是时候做出一些改变了。",
            style: { "color": "#7f3f00" },
            bodyStyle: { "color": "#ffffff" }
        },
        "wheat": {
            title: "小麦",
            body: "小麦是禾本科小麦属植物，作为全球最重要的粮食作物之一，其种植历史悠久、分布范围广泛，不仅是人类主食的核心来源，更是保障粮食安全的关键作物。它富含碳水化合物、蛋白质、膳食纤维等营养成分，磨制的面粉可制作面包、馒头、面条等多种食品，在人类文明发展进程中占据着不可替代的地位。",
            style: { "color": "#7f3f00" },
            bodyStyle: { "color": "#ffffff" }
        },
        "rice": {
            title: "水稻",
            body: "水稻作为禾本科稻属一年生草本植物，是全球最重要的粮食作物之一，承载着维系人类生存与发展的重要使命。其种植历史悠久，分布范围广泛，生长特性独特，品种资源丰富，产品应用多元，种植技术历经千年迭代已日趋成熟。",
            style: { "color": "#7f3f00" },
            bodyStyle: { "color": "#ffffff" }
        },
    },
    update(diff) {
        let baseGain = player.f.points.add(10).log10();
        if (hasUpgrade("f", 11) && player.f.activeCrop === "wheat") {
            player.f.wheatGainRate = baseGain;
            if (hasUpgrade("f", 21)) player.f.wheatGainRate = player.f.wheatGainRate.times(upgradeEffect("f", 21));  
            if (hasUpgrade("f", 13)) player.f.wheatGainRate = player.f.wheatGainRate.times(upgradeEffect("f", 13));  
            if (hasUpgrade("f", 32)) player.f.wheatGainRate = player.f.wheatGainRate.times(upgradeEffect("f", 32));  
            if (hasUpgrade("m", 11)) player.f.wheatGainRate = player.f.wheatGainRate.times(upgradeEffect("m", 11)); 
            if (hasUpgrade("m", 12)) player.f.wheatGainRate = player.f.wheatGainRate.times(upgradeEffect("m", 12)); 
            if (hasUpgrade("m", 13)) player.f.wheatGainRate = player.f.wheatGainRate.times(upgradeEffect("m", 13)); 
            if (hasUpgrade("m", 14)) player.f.wheatGainRate = player.f.wheatGainRate.times(upgradeEffect("m", 14)); 
            player.f.wheat = player.f.wheat.add(player.f.wheatGainRate.times(diff));
        }
        if (hasUpgrade("f", 12) && player.f.activeCrop === "rice") {
            player.f.riceGainRate = baseGain.pow(0.5);
            if (hasUpgrade("f", 22)) player.f.riceGainRate = player.f.riceGainRate.times(upgradeEffect("f", 22));  
            if (hasUpgrade("f", 23)) player.f.riceGainRate = player.f.riceGainRate.times(upgradeEffect("f", 23));  
            if (hasUpgrade("f", 31)) player.f.riceGainRate = player.f.riceGainRate.times(upgradeEffect("f", 31));  
            if (hasUpgrade("m", 11)) player.f.riceGainRate = player.f.riceGainRate.times(upgradeEffect("m", 11)); 
            if (hasUpgrade("m", 12)) player.f.riceGainRate = player.f.riceGainRate.times(upgradeEffect("m", 12)); 
            if (hasUpgrade("m", 13)) player.f.riceGainRate = player.f.riceGainRate.times(upgradeEffect("m", 13)); 
            if (hasUpgrade("m", 14)) player.f.riceGainRate = player.f.riceGainRate.times(upgradeEffect("m", 14)); 
            player.f.rice = player.f.rice.add(player.f.riceGainRate.times(diff));
        }
    },
    automate() {
    if (hasMilestone("m", 1)) {
        if (player.m.points.gte(1)) quickUpgBuy("f", [11]);
        if (player.m.points.gte(2)) quickUpgBuy("f", [12]);
        if (player.m.points.gte(3)) quickUpgBuy("f", [21]);
        if (player.m.points.gte(4)) quickUpgBuy("f", [22]);
        if (player.m.points.gte(5)) quickUpgBuy("f", [13]);
        if (player.m.points.gte(6)) quickUpgBuy("f", [23]);
        if (player.m.points.gte(7)) quickUpgBuy("f", [31]);
        if (player.m.points.gte(8)) quickUpgBuy("f", [32]);
        if (player.m.points.gte(9)) quickUpgBuy("f", [33]);
    }
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3f1f00)",
        minHeight: "100vh"
    },
    layerShown() {
        if (player.points.gte(10)) {
            player.f.shown = true;
        }
        return player.f.shown;
    }
});
addLayer("m", {
    name: "人力",
    symbol: "M",
    position: 1,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        };
    },
    color: "#7fbfff",
    requires: new Decimal(10),
    resource: "人力",
    baseResource: "田地",
    baseAmount() { return player.f.points; },
    type: "normal",
    exponent: 2,
    branches:["f"],
    gainMult() {
        let mult = new Decimal(1);
        return mult;
    },
    gainExp() {
        return new Decimal(1);
    },
    row: 1,
    hotkeys: [
        { key: "m", description: "F: 进行一次人力重置", onPress() { if (canReset(this.layer)) doReset(this.layer); } },
    ],
    tabFormat: {
        "人力": {
            content: [
                ['infobox', 'story'],
                'main-display',
                'prestige-button',
                'upgrades',
            ]
        },
        "里程碑": {
            content: [
                'main-display',
                'prestige-button',
                'milestones',
            ]
        }
    },
    upgrades: {
        11: {
            title: "功成名就",
            description: "基于成就数量增益绿钞，田地，水稻和小麦获取。",
            cost: new Decimal(1),
            effect() {
            return new Decimal(player.a.achievements.length).add(10).log10()
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
        },
        12: {
            title: "导入轮班制",
            description: "基于当前显示的节点数量增益绿钞，田地，水稻和小麦获取。",
            cost: new Decimal(10),
            effect() {
            let visibleLayers = getVisibleLayerCount();
            return new Decimal(Math.max(visibleLayers, 1)).add(10).log10();
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
        },
        13: {
            title: "资源管理",
            description: "基于人力增益绿钞，田地，水稻和小麦获取。",
            cost: new Decimal(11),
            effect() {
            return player.m.points.add(10).log10()
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
        },
        14: {
            title: "终极武器",
            description: "基于所有节点的升级总数之和增益绿钞，田地，水稻和小麦获取。",
            cost: new Decimal(13),
            effect() {
            let totalUpgrade = getTotalUpgradeCount();
            return new Decimal(Math.max(totalUpgrade, 1)).add(10).log10();
            },
            effectDisplay() { 
            if (hasUpgrade(this.layer, this.id)) 
            return format(upgradeEffect(this.layer, this.id)) + "x";
            else 
            return "1.00x";
            },// Add formatting to the effect
        },
    },
    milestones:{
        1:
        {
        requirementDescription:"2 人力",
        effectDescription:function() {
        if (hasMilestone(this.layer, this.id)) {
            let eff = player.m.points.min(9);
            return `基于人力自动购买田地升级。<br>当前：${formatWhole(eff)}x`;
        } else {
            return `基于人力自动购买田地升级。<br>当前：NaNx`;
        }
        },
        done() {return player.m.points.gte(2)},
        },
    },
    infoboxes: {
        "story": {
            title: "章节 1：雇佣",
            body: "随着田地规模的逐步扩大，你逐渐感到愈发的力不从心。所以你认为是时候扩大农场的规模了。",
            style: { "color": "#7fbfff" },
            bodyStyle: { "color": "#ffffff" }
        },
    },
    update() {
    },
    style: {
        background: "linear-gradient(135deg, #000000, #001f3f)",
        minHeight: "100vh"
    },
    layerShown() {
        return hasUpgrade("f", 33);
    }
});
addLayer("r", {
    name: "畜牧业",
    symbol: "R",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        };
    },
    color: "#ffff00",
    requires: new Decimal(15),
    resource: "牧场",
    baseResource: "田地",
    baseAmount() { return player.f.points; },
    type: "static",
    exponent: 0.5,
    branches:["f"],
    gainMult() {
        let mult = new Decimal(1);
        return mult;
    },
    gainExp() {
        return new Decimal(1);
    },
    row: 1,
    hotkeys: [
        { key: "r", description: "R: 进行一次畜牧业重置", onPress() { if (canReset(this.layer)) doReset(this.layer); } },
    ],
    tabFormat: {
        "畜牧业": {
            content: [
                ['infobox', 'story'],
                'main-display',
                'prestige-button',
                'upgrades',
            ]
        },
        "里程碑": {
            content: [
                'main-display',
                'prestige-button',
                'milestones',
            ]
        },
        "科学": {
            content: function() {
                let components = [
                    ['infobox', 'chicken'], 
                ]; 
                return components;
            },
            unlocked() {
                return hasUpgrade("r", 11);
            }
        }
    },
    upgrades: {
        11: {
            title: "畜牧业的开始",
            description: "解锁鸡。",
            cost: new Decimal(1),
        },
    },
    milestones:{
    },
    infoboxes: {
        "story": {
            title: "章节 2：养殖",
            body: "你发现这个庄园竟然没有牧场！既然没有，那就新建一个吧。",
            style: { "color": "#ffff00" },
            bodyStyle: { "color": "#ffffff" }
        },
        "chicken": {
            title: "鸡",
            body: "鸡，这一被称为“雉”的卵生动物，属于雉科原鸡属，是家禽中的一员。家禽，这一鸟类中的特殊群体，不仅包括我们熟悉的鸡，还有鸭、鹅等成员。家鸡，作为人类饲养最为普遍的家禽之一，其驯化历史可追溯至约4000年前。尽管经过长时间的人工选择与驯化，家鸡仍保留了一定的飞翔能力。目前，家鸡的品种繁多，全球范围内约有250种。",
            style: { "color": "#ffff00" },
            bodyStyle: { "color": "#ffffff" }
        },
    },
    update(diff) {
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3f3f00)",
        minHeight: "100vh"
    },
    layerShown() {
        return hasAchievement("a", 12);
    }
});