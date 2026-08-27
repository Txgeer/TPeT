const NAMES = ["中微子","氢","氦","锂","铍","硼","碳","氮","氧","氟","氖"]
function getAchievementCount() {
    if (!player || !player.a || !player.a.achievements) return 0;
    return player.a.achievements.filter(id => id !== '17').length;
}
addLayer("p", {
    name: "p",
    symbol: "P",
    position: 1,
    startData() { return {
        unlocked: true,
        points: one,
        buyableAutobuy: true,
        electrons: zero,
        photons: zero, 
        balance: 0.5, 
        waves: zero, 
        radiation: zero, 
    }},
    what(){//你猜这是什么
        player.p.points = player.points
    },    
    resource: "中微子",
    color: "white",
    type: "none",
    row: "side",
    layerShown(){return true},
    hotkeys: [
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
    upgrades:{       
        11:{
            title:"元神，启动！",
            description:"开始生产中微子。",
            effect(){
                let effect = one
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            unlocked: true,
        },
        12:{
            title:"加速生产 I",
            description:"获得 1 中微子获取加成。",
            effect(){
                let effect = one
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                if(hasUpgrade("p",33)) effect = effect.mul(upgradeEffect("p",33))
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: ten,
            unlocked(){return hasUpgrade("p",11)||hasUpgrade("p",[this.id])},
        },
        13:{
            title:"加速生产 II",
            description:"翻倍中微子获取。",
            effect(){
                let effect = two
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                if(hasUpgrade("p",33)) effect = effect.mul(upgradeEffect("p",33))
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(20),
            unlocked(){return hasUpgrade("p",12)||hasUpgrade("p",[this.id])},
        },
        14:{
            title:"加速生产 III",
            description:"翻三倍中微子获取。",
            effect(){
                let effect = three
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                if(hasUpgrade("p",33)) effect = effect.mul(upgradeEffect("p",33))
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(100),
            unlocked(){return hasUpgrade("p",13)||hasUpgrade("p",[this.id])},
        },
        15:{
            title:"粒子超速器",
            description:"改进 粒子加速器|原初 的效果。",
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(200),
            unlocked(){return hasUpgrade("p",14)||hasUpgrade("p",[this.id])},
        },
        21:{
            title:"粒子加速器",
            description:"解锁一个粒子加速器。",
            effect(){
                let effect = one
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(30),
            unlocked(){return hasUpgrade("p",13)||hasUpgrade("p",[this.id])},
        },
        22:{
            title:"粒子加强器",
            description:"加成 粒子加速器|原初 上限。",
            effect(){
                let effect = ten
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                if(hasUpgrade("p",42)) effect = effect.mul(upgradeEffect("p",42))
                effect = effect.floor()
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(300),
            unlocked(){return hasUpgrade("p",21)||hasUpgrade("p",[this.id])},
        },
        23:{
            title:"高能中微子",
            description:"中微子加成自身。",
            effect(){
                let effect = player.points.max(10).log(10)
                if(hasUpgrade("h",23)) effect = player.points.max(10).log(6)
                if(hasUpgrade("he",22)) effect = player.points.max(10).log(2)
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(100000),
            unlocked(){return hasUpgrade("p",22)||hasUpgrade("p",[this.id])},
        },
        24:{
            title:"核子加速器",
            description:"氢加成中微子。",
            effect(){
                let effect = player.h.points.add(1.8).log(3)
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(300000),
            unlocked(){return hasUpgrade("h",12)||hasUpgrade("p",[this.id])},
        },
        25:{
            title:"平行粒子加强器",
            description:"加成 粒子加速器|桁架 上限 10。",
            effect(){
                let effect = n(10)
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(9e15),
            unlocked(){return hasUpgrade("he",21)||hasUpgrade("p",[this.id])},
        },
        31:{
            title:"美塔领域",
            description:"翻倍前两行所有升级效果。",
            effect(){
                let effect = two
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(1000),
            unlocked(){return hasUpgrade("p",22)||hasUpgrade("p",[this.id])},
        },
        32:{
            title:"加速生产 IIII",
            description:"翻四倍中微子获取。",
            effect(){
                let effect = n(4)
                if(hasUpgrade("p",33)) effect = effect.mul(upgradeEffect("p",33))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(10000000),
            unlocked(){return hasUpgrade("h",12)||hasUpgrade("p",[this.id])},
        },
        33:{
            title:"加速生产 VI",
            description:"翻倍先前所有加速生产系列升级的效果。",
            effect(){
                let effect = n(2)
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                return effect
            },
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(300000000),
            unlocked(){return hasUpgrade("h",13)||hasUpgrade("p",[this.id])},
        },
        34:{
            title:"加速生产 VII",
            description:"翻六倍中微子获取。",
            effect(){
                let effect = n(6)
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(3.14e16),
            unlocked(){return hasUpgrade("p",25)||hasUpgrade("p",[this.id])},
        },
        35:{
            title:"粒子超越器",
            description:"优化 粒子究速器 的公式。",
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(3e22),
            unlocked(){return hasUpgrade("p",34)||hasUpgrade("p",[this.id])},
        },
        41:{
            title:"加速生产 V",
            description:"翻五倍中微子获取。",
            effect(){
                let effect = five
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                if(hasUpgrade("p",33)) effect = effect.mul(upgradeEffect("p",33))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(30000000),
            unlocked(){return hasUpgrade("h",12)||hasUpgrade("p",[this.id])},
        },
        42:{
            title:"粒子超强器",
            description:" 中微子加成 粒子加强器 效果。",
            effect(){
                let effect = player.points.add(1).log(100).root(3)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(3e9),
            unlocked(){return hasUpgrade("h",13)||hasUpgrade("p",[this.id])},
            
        },
        43:{
            title:"氦量粒子",
            description:"氦加成粒子。",
            effect(){
                let a = new Decimal(1.34).pow(player.he.points.root(2))
                if(a.gte(50)) a = a.sub(40).log(10).mul(50)
                return a
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(3e38),
            unlocked(){return hasMilestone("li",11)||hasUpgrade("p",[this.id])},
        },
        44:{
            title:"粒子降温",
            description:" 中微子加成温度点。",
            effect(){
                let effect = seven.pow(player.points.add(10).log(10).root(4))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(3.9e39),
            unlocked(){return hasUpgrade("p",43)||hasUpgrade("p",[this.id])},
        },
        45:{ 
            title:"粒子究强器",
            description:"加成 粒子加速器|原初 & 粒子加速器|桁架 上限 50。",
            effect(){
                let effect = n(50)
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(4e40),
            unlocked(){return hasUpgrade("p",44)||hasUpgrade("p",[this.id])},
        },
        51:{
            title:"粒子究速器",
            description:" 氢加成 粒子加速器|桁架 效果。",
            effect(){
                let effect = player.h.points.add(10).log(10).root(2).sub(1).div(2)
                if(hasUpgrade("p",35)) effect = player.h.points.add(10).log(8).root(1.8).sub(0.8).max(0).div(1.8)
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(3e10),
            unlocked(){return hasUpgrade("h",13)||hasUpgrade("p",[this.id])},
        },
        52:{
            title:"加速生产 VIIII",
            description:" 锂加成氢。",
            effect(){
                let effect = player.li.points.root(4).max(1)
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                if(effect.gte(10)) effect = effect.div(10).root(8).add(10)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(4e42),
            unlocked(){return hasUpgrade("p",45)||hasUpgrade("p",[this.id])}
        },
        53:{
            title:"冷却机器",
            description:"自动获取冷却时的 10000% 温度点 /s。",
            effect(){
                let effect = n(100)
                return effect
            },
            effectDisplay(){return format(this.effect().mul(100)) + "%"},
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(4e44),
            unlocked() {return hasUpgrade("p",52)||hasUpgrade("p",[this.id])}
        },
        54:{
            title:"人外有人",
            description:"解锁第三个粒子加速器，且自动购买前两个粒子加速器，并让这两个粒子加速器不再有上限。",
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(9e97),
            unlocked() {return hasUpgrade("he",13)||hasUpgrade("p",[this.id])}
        },
        55:{
            title:"天外有天",
            description:"解锁新的子标签页。",
            currencyDisplayName:"中微子",
            currencyInternalName:"points",
            cost: new Decimal(9.99e99),
            unlocked() {return hasUpgrade("p",54)||hasUpgrade("p",[this.id])}
        },
        61: {
            title: "电子加速",
            description: "电子加成中微子。",
            effect() {
                if (hasUpgrade("li", 101)) {
                    return player.p.electrons.add(2);
                } else {
                    return player.p.electrons.add(1).log2().add(1);
                }
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(100),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return player.p.electrons.gte(10)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        62: {
            title: "加速生产 X",
            description: "铍加成先前所有加速生产系列升级的效果。",
            effect() {
                let eff = player.be.points.add(1).log2().add(1).log2().add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(200),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",61); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        63: {
            title: "电子加速 II",
            description: "电子加成氢。",
            effect() {
                if (hasUpgrade("li", 101)) {
                    return player.p.electrons.add(1).log2().add(1);
                } else {
                    return player.p.electrons.add(1).ln().add(1);
                }
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(300),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",62); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        64: {
            title: "协同放置",
            description: "铍大幅降低氦的价格。",
            effect() {
                let eff = player.be.points.add(1).pow(0.9).add(1);
                return eff;
            },
            effectDisplay() { return "/" + format(this.effect()); },
            cost: new Decimal(400),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",63); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        65: {
            title: "超越计划",
            description: "解锁转生宝石。",
            cost: new Decimal(5000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",64); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        66: {
            title: "另请高人",
            description: "移除 粒子加速器|相织 的上限。",
            cost: new Decimal(1e18),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasMilestone("c",1); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        67: {
            title: "高人请来了",
            description: "解锁 粒子加速器|核心。",
            cost: new Decimal(3e18),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasMilestone("c",1); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        71: {
            title: "能量究大",
            description: "电子加成自身。",
            effect() {
                let eff = player.p.electrons.add(1).log10().add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(10000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("li",71); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        72: {
            title: "稳定粒子",
            description: "电子降低氦价格。",
            effect() {
                let eff = player.p.electrons.add(1).pow(0.9).add(1);
                return eff;
            },
            effectDisplay() { return "/" + format(this.effect()); },
            cost: new Decimal(20000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",71); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        73: {
            title: "导电金属",
            description: "电子降低锂价格。",
            effect() {
                let eff = player.p.electrons.add(1).pow(0.8).add(1);
                return eff;
            },
            effectDisplay() { return "/" + format(this.effect()); },
            cost: new Decimal(40000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",72); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        74: {
            title: "阿尔法解放",
            description: "取消 氦-4 的上限。",
            cost: new Decimal(70000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",73); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        75: {
            title: "又一次吗......",
            description: "铍较大幅降低锂的价格，并解锁新的转生宝石升级。",
            effect() {
                let eff = player.be.points.add(1).pow(0.8).add(1);
                return eff;
            },
            effectDisplay() { return "/" + format(this.effect()); },
            cost: new Decimal(100000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",74); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        81: {
            title: "光学",
            description: "解锁光研究点。",
            cost: new Decimal(1000),
            currencyDisplayName: "光波",
            currencyInternalName: "waves",
            currencyLayer: "p",
            unlocked() { return player.p.waves.gte(10)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7FFFFF'};
                } else {
                    return {};
                }
            }
        },
        82: {
            title: "光伏发电",
            description: "自动购买 电容增幅，并让 电容增幅 不再有上限。",
            cost: new Decimal(2000),
            currencyDisplayName: "光波",
            currencyInternalName: "waves",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",81); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7FFFFF'};
                } else {
                    return {};
                }
            }
        },
        83: {
            title: "光粒打击",
            description: "优化转生的公式，并解锁新层级。",
            cost: new Decimal(100),
            currencyDisplayName: "光子",
            currencyInternalName: "photons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",82)&&hasUpgrade("p",84); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FFFF7F'};
                } else {
                    return {};
                }
            }
        },
        84: {
            title: "陨生说",
            description: "自动点击者的数量加成电能上限，且自动购买 自动点击者，并让 自动点击者 不再有上限。",
            cost: new Decimal(2000),
            currencyDisplayName: "放射性",
            currencyInternalName: "radiation",
            currencyLayer: "p",
            effect(){
                let effect = getBuyableAmount("c",11).add(1).log(2).add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked() { return hasUpgrade("p",85); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F7F'};
                } else {
                    return {};
                }
            }
        },
        85: {
            title: "消辐宁",
            description: "优化氚的公式。",
            cost: new Decimal(1000),
            currencyDisplayName: "放射性",
            currencyInternalName: "radiation",
            currencyLayer: "p",
            unlocked() { return player.p.radiation.gte(10)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F7F'};
                } else {
                    return {};
                }
            }
        },
        91: {
            title: "波粒二象性",
            description: "平衡值越靠近1获得的光波数量越多，最多翻 2 倍。",
            cost: new Decimal(5000000),
            currencyDisplayName: "光波",
            currencyInternalName: "waves",
            currencyLayer: "p",
            unlocked() { return hasMilestone("n",7); },
            effect() {
                let bal = player.p.balance;
                return new Decimal(1 + (1 - Math.abs(bal - 1)));
            },
            effectDisplay() { return "x" + format(this.effect()); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7FFFFF'};
                } else {
                    return {};
                }
            }
        },
        92: {
            title: "光波光子",
            description: "光波加成光子转化基础。",
            cost: new Decimal(10000000),
            currencyDisplayName: "光波",
            currencyInternalName: "waves",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",91); },
            effect() {
                return player.p.waves
            },
            effectDisplay() { return "x" + format(this.effect()); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7FFFFF'};
                } else {
                    return {};
                }
            }
        },
        93: {
            title: "升华",
            description: "优化光子的公式，并解锁新的锂升级。",
            cost: new Decimal(2000),
            currencyDisplayName: "光子",
            currencyInternalName: "photons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",92)&&hasUpgrade("p",94); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FFFF7F'};
                } else {
                    return {};
                }
            }
        },
        94: {
            title: "放射光子",
            description: "放射性加成光子转化基础。",
            cost: new Decimal(10000000),
            currencyDisplayName: "光波",
            currencyInternalName: "waves",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",95); },
            effect() {
                return player.p.radiation
            },
            effectDisplay() { return "x" + format(this.effect()); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F7F'};
                } else {
                    return {};
                }
            }
        },
        95: {
            title: "衰变",
            description: "平衡值越靠近 0 获得的放射性数量越多，最多翻 2 倍。",
            cost: new Decimal(5000000),
            currencyDisplayName: "放射性",
            currencyInternalName: "radiation",
            currencyLayer: "p",
            unlocked() { return hasMilestone("n",7); },
            effect() {
                let bal = player.p.balance;
                return new Decimal(1 + (1 - Math.abs(bal - 0)));
            },
            effectDisplay() { return "x" + format(this.effect()); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F7F'};
                } else {
                    return {};
                }
            }
        },
    },
    buyables:{
        11: {
            title: "粒子加速器|原初",
            cost(x) {
                let a = x.add(1).mul(x.div(5).add(1).mul(10))
                if(x.gte(30)) a = x.pow(x.root(2))
                return a
            },
            display() { return "加成中微子。<br>价格：" + format(this.cost()) + "中微子<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限数量：" + format(this.purchaseLimit())},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                if(hasUpgrade("h",51)){
                    x = powsoftcap(x,n(30),n(10))
                    let a = five.add(buyableEffect("p",12)).pow(x) 
                    a = powsoftcap(a,n(1e30),five)
                    if(hasUpgrade("p",67)&&getBuyableAmount("p",14).gte(1)) a = a.mul(buyableEffect("p",14))
                    return a
                }
                else {
                    let a = x.mul(0.166686).add(1)
                    if(hasUpgrade("p",15)) a = x.mul(0.66686).add(1)
                    if(getBuyableAmount("p",12).gte(1)) a = x.mul(buyableEffect("p",12).add(0.66686))
                        if(hasUpgrade("p",67)&&getBuyableAmount("p",14).gte(1)) a = a.mul(buyableEffect("p",14))
                    return a
                }              
            },
            purchaseLimit(){
                let a = ten
                if(hasUpgrade("p",22)) a = a.add(upgradeEffect("p",22))
                if(hasUpgrade("he",21)) a = a.add(upgradeEffect("he",21))
                if(hasUpgrade("p",45)) a = a.add(upgradeEffect("p",45))
                return a
            },
            unlocked(){return hasUpgrade("p",21)},
        },
        12: {
            title: "粒子加速器|桁架",
            cost(x) {
                let a = x.add(1).mul(x.add(1).mul(1e4))
                if(x.gte(8)) a = x.pow(x)
                return a
            },
            display() { return "加成 粒子加速器|原初。<br>价格：" + format(this.cost()) + "中微子<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：+" + format(this.effect()) + "<br>上限数量：" + format(this.purchaseLimit())},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let addeff = buyableEffect("p",13)
                let a = x.mul(0.166686)
                if(hasUpgrade("p",51)) a = x.mul(n(0.166686).add(upgradeEffect("p",51)))
                a = a.mul(addeff).max(0)
                if(hasUpgrade("p",67)&&getBuyableAmount("p",14).gte(1)) a = a.mul(buyableEffect("p",14))
                return a
            },
            purchaseLimit(){
                let a = eight
                if(hasUpgrade("p",25)) a = a.add(upgradeEffect("p",25))
                if(hasUpgrade("p",45)) a = a.add(upgradeEffect("p",45))
                return a
            },
            unlocked(){return hasUpgrade("p",21)&&hasUpgrade("p",31)},
        },
        13: {
            title: "粒子加速器|相织",
            cost(x) {
                x = x.add(3)
                a = x.pow(x.pow(2))
                return a
            },
            display() { return "加成 粒子加速器|桁架。<br>价格：" + format(this.cost()) + "中微子<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限数量：" + format(this.purchaseLimit())},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let a = x.mul(12.5).max(1)
                if(hasUpgrade("p",67)&&getBuyableAmount("p",14).gte(1)) a = a.mul(buyableEffect("p",14))
                return a
            },
            purchaseLimit(){
                let a = n(20)
                if(hasUpgrade("p",45)) a = Infinity
                return a
            },
            unlocked(){return hasUpgrade("p",54)},
        },
        14: {
            title: "粒子加速器|核心",
            cost(x) {
                x = x.add(3)
                a = x.pow(x.pow(3))
                return a
            },
            display() { return "加成前三种粒子加速器。<br>价格：" + format(this.cost()) + "中微子<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限数量：" + format(this.purchaseLimit())},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let a = x.mul(6.6686).max(1)
                return a
            },
            purchaseLimit(){
                let a = Infinity
                return a
            },
            unlocked(){return hasUpgrade("p",67)},
        },
    },
    bars: {
        balanceBar: {
            direction: RIGHT,
            width: 400,
            height: 20,
            progress() { return player.p.balance; },
            unlocked() { return true; },
            fillStyle() {
                let r = 235 + (162 - 235) * this.progress();
                let g = 64 + (249 - 64) * this.progress();
                let b = 52 + (252 - 52) * this.progress();
                return { "background-color": "rgb(" + r + ", " + g + ", " + b + ")" };
            },
            borderStyle() { return { "border-color": "#fced9f" }; },
        },
    },
    clickables: {
        11: {
            title: "将中微子转化为电子",
            display() {
                let gain = player.points.add(1).log2().add(1).log2().add(1).floor();
                if (hasUpgrade('li',14)) gain = gain.mul(layers.li.LiboostElectrons()).floor();
                if (hasUpgrade('p',71)) gain = gain.mul(upgradeEffect("p",71)).floor();
                if (hasUpgrade('li',81)) gain = gain.mul(upgradeEffect("li",81)).floor();
                if (hasUpgrade('b',51)) gain = gain.mul(upgradeEffect("b",51)).floor();
                if (hasUpgrade('c',23)) gain = gain.mul(upgradeEffect("c",23)).floor();
                if (hasAchievement('a',35)) gain = gain.mul(achievementEffect("a",35)).floor();
                if (hasMilestone('c', 1)) gain = gain.mul(player.c.entropy.pow(player.c.oil).add(1).log2().add(1)).floor();
                if(player.b.inBorane) gain = gain.pow(0.66686).floor();
                if(player.c.inExtract) gain = gain.pow(0.666).floor();
                return "消耗 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(player.points)+"</span> 中微子，获得 <span style='color:#111177;text-shadow:0 0 10px'>"+format(gain)+"</span> 电子。<br>（至少转化 1e100 中微子）";
            },
            unlocked() { return true; },
            canClick() { return player.points.gte(1e100); },
            onClick() {
                let gain = player.points.add(1).log2().add(1).log2().add(1).floor();
                if (hasUpgrade('li',14)) gain = gain.mul(layers.li.LiboostElectrons()).floor();
                if (hasUpgrade('p',71)) gain = gain.mul(upgradeEffect("p",71)).floor();
                if (hasUpgrade('li',81)) gain = gain.mul(upgradeEffect("li",81)).floor();
                if (hasUpgrade('b',51)) gain = gain.mul(upgradeEffect("b",51)).floor();
                if (hasUpgrade('c',23)) gain = gain.mul(upgradeEffect("c",23)).floor();
                if (hasAchievement('a',35)) gain = gain.mul(achievementEffect("a",35)).floor();
                if (hasMilestone('c', 1)) gain = gain.mul(player.c.entropy.pow(player.c.oil).add(1).log2().add(1)).floor();
                if(player.b.inBorane) gain = gain.pow(0.66686).floor();
                if(player.c.inExtract) gain = gain.pow(0.666).floor();
                player.points = zero
                player.p.electrons = player.p.electrons.add(gain);
            },
            style() {
                return {
                    'background-color': this.canClick() ? "#3F3FFF" : "#BF8F8F",
                };
            }
        },
        21: {
            title: "将中微子和电子转化为光子",
            display() {
                let gain = player.points.pow(player.p.electrons);
                if (hasUpgrade("p", 92)) gain = gain.pow(upgradeEffect("p", 92));
                if (hasUpgrade("p", 94)) gain = gain.pow(upgradeEffect("p", 94));
                if (!hasUpgrade("p", 93)) gain = gain.add(1).ln().add(1).ln().add(1).floor();
                if (hasUpgrade("p", 93)) gain = gain.add(1).log2().add(1).log2().add(1).floor();
                if (hasUpgrade("li", 24)) gain = gain.mul(layers.li.LiboostPhotons());
                if(player.c.inExtract) gain = gain.pow(0.666);
                return "消耗你所有的中微子和电子，获得 <span style='color:#777733;text-shadow:0 0 10px'>"+format(gain)+"</span> 光子。<br>（至少转化 1e9 电子和 1e350 中微子）";
            },
            unlocked() { return true; },
            canClick() { return player.points.log10().gte(350)&&player.p.electrons.gte(1e9); },
            onClick() {
                let gain = player.points.pow(player.p.electrons);
                if (hasUpgrade("p", 92)) gain = gain.pow(upgradeEffect("p", 92));
                if (hasUpgrade("p", 94)) gain = gain.pow(upgradeEffect("p", 94));
                if (!hasUpgrade("p", 93)) gain = gain.add(1).ln().add(1).ln().add(1).floor();
                if (hasUpgrade("p", 93)) gain = gain.add(1).log2().add(1).log2().add(1).floor();
                if (hasUpgrade("li", 24)) gain = gain.mul(layers.li.LiboostPhotons());
                if(player.c.inExtract) gain = gain.pow(0.666);
                player.points = zero;
                player.p.electrons = zero;
                player.p.photons = player.p.photons.add(gain);
            },
            style() {
                return {
                    'background-color': this.canClick() ? "#FFFF7F" : "#BF8F8F",
                };
            }
        },
        31: {
            title: "←",
            unlocked() { return true; },
            canClick() { return player.p.balance > 0; },
            onClick() { player.p.balance = 0; },
            style: { width: "50px","background-color": "#FF3F3F" },
        },
        32: {
        title: "-",
            unlocked() { return true; },
            canClick() { return player.p.balance > 0; },
            onClick() { player.p.balance = Math.max(player.p.balance - 0.05, 0); },
            style: { width: "50px","background-color": "#FF3F3F" },
        },
        33: {
            title: "C",
            unlocked() { return true; },
            canClick() { return player.p.balance != 0.5; },
            onClick() { player.p.balance = 0.5; },
            style: { width: "50px","background-color": "#FFFF7F" },
        },
        34: {
            title: "+",
            unlocked() { return true; },
            canClick() { return player.p.balance < 1; },
            onClick() { player.p.balance = Math.min(player.p.balance + 0.05, 1); },
            style: { width: "50px","background-color": "#3FFFFF" },
        },
        35: {
            title: "→",
            unlocked() { return true; },
            canClick() { return player.p.balance < 1; },
            onClick() { player.p.balance = 1; },
            style: { width: "50px","background-color": "#3FFFFF" },
        },
    },
    update(diff) {
        let wavesPerSec = player.p.photons.mul(player.p.balance);
        let radPerSec = player.p.photons.mul(Decimal.sub(1, player.p.balance));
        if (hasUpgrade("p", 91)) wavesPerSec = wavesPerSec.mul(upgradeEffect("p", 91));
        if (hasUpgrade("p", 95)) radPerSec = radPerSec.mul(upgradeEffect("p", 95));

    player.p.waves = player.p.waves.add(wavesPerSec.mul(diff));
    player.p.radiation = player.p.radiation.add(radPerSec.mul(diff));
        if (hasUpgrade("p", 82)) {
            if (tmp.li && tmp.li.buyables && tmp.li.buyables[31] && tmp.li.buyables[31].canAfford) {
                buyBuyable("li", 31);
            }
        }
        if (hasUpgrade("p", 84)) {
            if (tmp.c && tmp.c.buyables && tmp.c.buyables[11] && tmp.c.buyables[11].canAfford) {
                buyBuyable("c", 11);
            }
        }
    },
    tabFormat: {
        "中微子": {   
            content: [
                "main-display",
                "p",
                "buyables",
                ["upgrades",[1,2,3,4,5]],
            ],
        }, 
        "电子": {   
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function(){ 
                    return "你有 <span style='color:#3F3FFF;text-shadow:0 0 10px'>"+format(player.p.electrons)+"</span> 电子"; 
                }],
                ["clickables",[1]],
                ["upgrades",[6,7]], 
            ],
            unlocked(){return hasUpgrade("p",55)},
            buttonStyle: {'border-color': '#3F3FFF'},
            style: {
                background: "linear-gradient(135deg, #000000, #1F1F3F)",
                minHeight: "100vh"
            }
        },
        "光子": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function(){ return "你有 <span style='color:#FFFF7F;text-shadow:0 0 10px'>"+format(player.p.photons)+"</span> 光子"; }],
                ["display-text", function() {
                    let rate = player.p.photons.times(player.p.balance);
                    if (hasUpgrade("p", 91)) {
                        rate = rate.mul(upgradeEffect("p", 91));
                    }
                    return "你有  <span style='color:#7FFFFF;text-shadow:0 0 10px'>" + format(player.p.waves) + "</span> 光波 (+<span style='color:#7FFFFF;text-shadow:0 0 10px'>" + format(rate) + "</span>/s)";
                }],
                ["display-text", function() {
                    let rate = player.p.photons.times(Decimal.sub(1, player.p.balance));
                    if (hasUpgrade("p", 95)) {
                        rate = rate.mul(upgradeEffect("p", 95));
                    }
                    return "你有 <span style='color:#FF7F7F;text-shadow:0 0 10px'>" + format(player.p.radiation) + "</span> 放射性 (+<span style='color:#FF7F7F;text-shadow:0 0 10px'>" + format(rate) + "</span>/s)";
                }],
                ["clickables", [2]],
                // ---------- 平衡滑条区域（新增） ----------
                ["bar", "balanceBar"],
                ["clickables", [3]],
                ["display-text", function(){ return "平衡值：" + format(player.p.balance, 2); }],
                // -----------------------------------------
                ["upgrades", [8,9]],
            ],
            unlocked(){ return hasUpgrade("b",55); },
            buttonStyle: {'border-color': '#FFFF7F'},
            style: {
                background: "linear-gradient(135deg, #000000, #3F3F1F)",
                minHeight: "100vh"
            }
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3F3F3F)",
        minHeight: "100vh"
    },
})
/*
/////
/hhh/
/hhh/
/hhh/
/hhhhhhhhhh/
/hhhhhhhhhhh/
/hhh/   /hhh/
/hhh/   /hhh/
/hhh/   /hhh/
/hhh/   /hhh/
*/
addLayer("h", {
    name: "h",
    symbol: "H",
    position: 0, 
    startData() { return {
        unlocked: false,
        balloon: new Decimal(0),
        power: new Decimal(0),
		points: new Decimal(0),
        balloonMax: new Decimal(0),
        upTime: new Decimal(0),
        keepUpTime: true,
        upgradeAutobuy: true,
        autoGetHpowerBalloon: true,
        autoGetBalloon: true,
    }},
    color: "#FF66CC",
    requires: new Decimal(1000000),
    resource: "氢",
    baseResource: "中微子",
    baseAmount() {return player.points},
    type: "normal", 
    exponent: 0.5,
    gainMult() {
        mult = one
        if(hasUpgrade("h",15)) mult = mult.add(upgradeEffect("h",15))
        if(hasUpgrade("h",22)) mult = mult.mul(upgradeEffect("h",22))
        if(hasUpgrade("h",13)) mult = mult.mul(upgradeEffect("h",13))
        if(hasUpgrade("h",14)) mult = mult.mul(upgradeEffect("h",14))
        if(hasUpgrade("h",31)) mult = mult.mul(upgradeEffect("h",31))
        if(hasUpgrade("he",11)) mult = mult.mul(upgradeEffect("he",11))
        if(hasMilestone("h",3)) mult = mult.mul(layers.h.balloonBoostH())
        if(player.li.unlocked) mult = mult.mul(layers.li.LiboostH())
        if(player.h.upTime.gt(0)) mult = mult.mul(layers.h.boomedBalloonBoostH())
        if(getBuyableAmount("he",12).gte(1)) mult = mult.mul(buyableEffect("he",12))
        if(hasMilestone("he",1)) mult = mult.mul(layers.he.temPointBoostH())
        if(hasUpgrade("p",52)) mult = mult.mul(upgradeEffect("p",52))
        if(hasUpgrade("p",63)) mult = mult.mul(upgradeEffect("p",63))
        if(hasUpgrade("be",13)) mult = mult.mul(upgradeEffect("be",13))
        if(hasUpgrade("be",22)) mult = mult.mul(upgradeEffect("be",22))
        if(hasUpgrade("b",41)) mult = mult.mul(upgradeEffect("b",41))
	    if(hasAchievement('a', 16)) mult = mult.mul(achievementEffect('a', 16))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = one
        if(player.b.inBorane) exp = exp.mul(0.66686)
        if(player.c.inExtract) exp = exp.mul(0.666)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: 进行一次氢重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration() { 
        let a = new Decimal(0)
        if(hasUpgrade("h",44)) a = upgradeEffect("h",44).div(100)
        if(hasMilestone("li",3)&&player.h.upgradeAutobuy) a = a.max(0.01)
        if(hasMilestone("li",8)) a = a.max(1)
        return a
     },
    upgrades:{
        11:{
            title:"氢原子",
            description:"氢加成中微子。",
            effect(){
                let effect = one.add(player.h.points.add(1).mul(10).log(10))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(1),
            unlocked(){return player.h.unlocked},
        },
        12:{
            title:"氢原子核",
            description:"解锁更多中微子与氢的升级，并略微加成中微子获取。",
            effect(){
                let effect = n(1.1)
                if(hasUpgrade("h",24)) effect = effect.mul(1.1)
                if(hasUpgrade("h",43)) effect = effect.mul(1.2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(3),
            unlocked(){return (hasUpgrade("h",11))},
        },   
        13:{
            title:"氘",
            description:"解锁更多中微子升级，并小幅加成氢获取。",
            effect(){
                let effect = n(1.2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(63),
            unlocked(){return (hasUpgrade("h",12))&&hasUpgrade("h",23)},
        },     
        14:{
            title:"氚",
            description:"氢加成自身。",
            effect() {
                if (hasUpgrade("p", 85)) {
                    return player.h.points.add(1).log2().add(1)
                } else {
                    return player.h.points.add(10).log10().root(1.4);
                }
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(127),
            unlocked(){return (hasUpgrade("h",13))&&hasUpgrade("h",23)},
        },    
        15:{
            title:"氢气球e308",
            description:"气球进一步加成氢。",
            effect(){
                let effect = player.h.balloon.pow(2)
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(58),
            unlocked(){return player.be.unlocked},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
        },   
        21:{
            title:"氢核外电子",
            description:"小幅加成中微子获取。",
            effect(){
                let effect = n(1.2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(7),
            unlocked(){return (hasUpgrade("h",12))},
        },
        22:{
            title:"氢质子",
            description:"略微加成氢获取。",
            effect(){
                let effect = n(1.1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(15),
            unlocked(){return (hasUpgrade("h",21))},
        },
        23:{
            title:"氢中子",
            description:"解锁更多氢升级，并优化 高能中微子 的公式。",
            cost: new Decimal(31),
            unlocked(){return (hasUpgrade("h",22))},
        },
        24:{
            title:"氢气球",
            description:"解锁氢气球，并略微加成 氢原子核 效果。",
            cost: new Decimal(131071),
            unlocked(){return (hasUpgrade("h",14))&&hasUpgrade("p",51)&&hasAchievement("a",12)},
        },     
        25:{
            title:"扩容",
            description:"气球数量增幅锂电池上限。",
            effect(){
                let effect = player.h.balloon.pow(0.6).add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(68),
            unlocked(){return player.be.unlocked},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
        },   
        31:{
            title:"氢气分子",
            description:" 氢能加成氢。",
            effect(){
                let effect = player.h.power.add(1).root(4)
                if(effect.gte(10)) effect = effect.div(9).log(4).add(9)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(2),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return (hasMilestone("h",3))},
        },       
        32:{
            title:"氢离子",
            description:" 气球加成氢能。",
            effect(){
                let effect = player.h.balloon.add(1).max(1)
                if(effect.gte(10)) effect = effect.div(10).log(2).add(10)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(3),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return (hasUpgrade("h",31))},
        }, 
        33:{
            title:"氢负离子",
            description:"氢能加成自身。",
            effect(){
                let effect = player.h.power.add(1).root(5)
                if(effect.gte(10)) effect = effect.div(9).log(5).add(9)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(4),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return (hasUpgrade("h",32))},
        },
        34:{
            title:"氢实验",
            description:"优化气球加成氢的公式。",
            cost: new Decimal(5),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return (hasUpgrade("h",33))},
        },
        35:{
            title:"扩容增幅",
            description:" 扩容 的效果同时对电能获取有效。",
            cost: new Decimal(79),
            unlocked(){return hasMilestone("be",3)},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
        },   
        41:{
            title:"能量巨大",
            description:"解锁气球爆炸。",
            cost: new Decimal(1e11),
            unlocked(){return player.he.unlocked},
        },
        42:{
            title:"能量超大",
            description:"爆炸持续时间加成爆炸效果，并加成爆炸持续时间 20 s。",
            effect(){
                let effect = n(20)
                return effect
            },
            effectDisplay(){return "+"+formatTime(this.effect())},
            cost: new Decimal(7),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return (hasUpgrade("h",41))},
        },
        43:{
            title:"新的气球",
            description:"解锁氦气球，并小幅加成 氢原子核 效果。",
            cost: new Decimal(10),
            unlocked(){return (hasUpgrade("h",42))},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
        },    
        44:{
            title:"转移重心",
            description:"解锁新的氦层升级，并自动获取重置时的 1% 氢 /s。",
            effect(){
                let effect = one
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())+"%"},
            cost: new Decimal(12),
            unlocked(){return (hasUpgrade("h",43))},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
        },    
        45:{
            title:"更强的爆炸 II",
            description:"氢能加成气球与氦气球爆炸时间，并优化 更强的爆炸 的公式。",
            effect(){
                let effect = player.h.power.add(10).log(10)
                return effect
            },
            effectDisplay(){return "+"+formatTime(this.effect())},
            cost: new Decimal(81),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasMilestone("be",3)},
        },  
        51:{
            title:"粒子提升",
            description:"彻底优化 粒子加速器|原初 的效果公式。",
            cost: new Decimal(191),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasMilestone("h",5)},
        },  
        52:{
            title:"发展",
            description:"削弱 温度点效果|蓐收 和 温度点效果|共工 的效果，但是移除它们的软上限。",
            cost: new Decimal(209),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasUpgrade("h",51)},
        },  
        53:{
            title:"解离 I",
            description:"爆炸气球的时间始终等于爆炸后加成时间。",
            cost: new Decimal(239),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasUpgrade("h",52)},
        }, 
        54:{
            title:"解离 II",
            description:"爆炸氦气球的时间始终等于爆炸后加成时间。",
            cost: new Decimal(243),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasUpgrade("h",53)},
        },
        55:{
            title:"终极加速",
            description:"平方已完成成就个数。",
            cost: new Decimal(245),
            effect(){
                let eff = two
                return eff
            },
            effectDisplay(){return "^"+format(this.effect())},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return  hasUpgrade("h",54)},
        },
    },
    milestones:{
        1: {
            requirementDescription: "10 氢",
            effectDescription: "第一行重置时保留中微子升级。",
            done(){ return player.h.points.gte(10); },
            unlocked: true,
        },
        2: {
            requirementDescription: "100 氢",
            effectDescription: "第一行重置时保留中微子可购买。",
            done(){ return player.h.points.gte(100); },
            unlocked: true,
        },
        3:{
            requirementDescription: "1 气球",
            effectDescription: "翻倍氢能获取，且气球加成氢，并解锁更多氢升级。",
            done(){return player.h.balloon.gte(1)},
            unlocked: true,
        },
        4:{
            requirementDescription: "7 氦气球",
            effectDescription: "氦气球加成中微子，并解锁爆炸氦气球。",
            done(){return player.he.balloon.gte(7)},
            unlocked(){return hasUpgrade("h",43)},
        },
        5:{
            requirementDescription: "191 气球",
            effectDescription: "解锁第五行氢升级。",
            done(){return player.h.balloon.gte(1)},
            unlocked(){return hasMilestone("h",4)},
        },
    },
    clickables:{
        11:{
            title:"将氢转化为氢能",
            display() {return "将你一半的氢转化为氢能。<br>当前转化获取量：" + format(layers.h.HpowerGet()) + "<br>（至少转化 25000 氢）"},
            unlocked() {return true},
            canClick() {if (hasAchievement("a", 13)) return true;return player.h.points.gte(25000)},
            onClick() {
                player.h.power = player.h.power.add(layers.h.HpowerGet()).max(0);
                player.h.points = player.h.points.div(2);
            },
        },
        12:{
            title:"将氢能输入进气球",
            display() {return "将你所有的氢能转化为气球。<br>转化后气球数量：" + format(player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor().max(0)) + "<br>下一个气球：" + format(layers.h.balloonFloor().pow(player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor().add(3))) + "氢能<br>"},
            unlocked() {return true},
            canClick() {return player.h.power.gte(layers.h.balloonFloor().pow(player.h.balloon.add(3)))},
            onClick() {
                player.h.balloon = player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor().max(0);
                if (player.h.balloon.lt(0)) player.h.balloon = zero
                if(player.h.balloonMax.lt(player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor())) player.h.balloonMax = player.h.power.add(1).log(10).sub(2).floor()
                player.h.power = zero
            },
        },
        13:{
            title:"将氦输入进气球",
            display() {return "将你所有的氦转化为氦气球。<br>转化后氦气球数量：" + format(player.he.points) + "<br>下一个氦气球：" + format(player.he.points.add(1)) + "氦<br>"},
            unlocked() {return hasUpgrade("h",43)},
            canClick() {return player.he.points.gte(player.he.balloon.add(1))},
            style() { return { 'background-color': this.canClick()?"#FFBBCC":"#BF8F8F"} },
            onClick() {
                player.he.balloon = player.he.points
                if(!hasUpgrade("he",31)) player.he.points = zero
            },
        },
        21:{
            title:"爆炸气球！",
            display() {return "将你（一半，向下取整）的气球爆炸！<br>爆炸效果：氢能获取x <span style='color:#773355;text-shadow:0 0 10px'>"+format(layers.h.boomedBalloonBoostHpower())+"</span> ，氢获取 x <span style='color:#773355;text-shadow:0 0 10px'>"+format(layers.h.boomedBalloonBoostH())+"</span> ，<br>时间:" + formatTime(player.h.upTime) + "<br>爆炸后加成时间：<br>" + formatTime(layers.h.addUpTime()) + "<br>时间上限：" + formatTime(layers.h.boomedBalloonBoostLimitTime())},            
            canClick() {return player.h.balloon.gte(2)},
            onClick() {
                player.h.upTime = player.h.upTime.add(layers.h.addUpTime())
                player.h.balloon = player.h.balloon.sub(player.h.balloon.div(2).floor())               
            },
            unlocked() {return hasUpgrade("h",41)},
        },
        22:{
            title:"爆炸氦气球！",
            display() {return "将你（一半，向下取整）的气球爆炸！<br>爆炸效果：氢能获取x <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(layers.he.boomedBalloonBoostHpower())+"</span> ，中微子获取 x<span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(layers.he.boomedBalloonBoostPoints())+"</span>，<br>时间:" + formatTime(player.he.upTime) + "<br>爆炸后加成时间：<br>" + formatTime(layers.he.addUpTime()) + "<br>时间上限：" + formatTime(layers.he.boomedBalloonBoostLimitTime())},            
            canClick() {return player.he.balloon.gte(2)},
            style() { return { 'background-color': this.canClick()?"#FFBBCC":"#BF8F8F"} },
            onClick() {
                player.he.upTime = player.he.upTime.add(layers.he.addUpTime())
                player.he.balloon = player.he.balloon.sub(player.he.balloon.div(2).floor())               
            },
            unlocked() {return hasMilestone("h",4)},
        },
    // ========== 新增：氮气球转化 ==========
        31: {
            title: "将氮转化为氮气球",
            display() {
                let gain = player.n.points.add(1).log2().add(1).floor();
                let nextNeed = two.pow(player.n.balloon).sub(1);
                return "将你所有的氮转化为氮气球。<br>转化后氮气球数量：" + format(gain) + "<br>下一个氮气球：" + format(nextNeed) + " 氮";
            },
            unlocked() { return hasMilestone("n", 6); },
            canClick() { return player.n.points.gte(two.pow(player.n.balloon).sub(1)); },
            style() { 
                return { 
                    'background-color': this.canClick() ? "#000000" : "#BF8F8F",
                    'color': this.canClick() ? "#FFFFFF" : "#000000",
                };
            },
            onClick() {
                player.n.balloon = player.n.points.add(1).log2().add(1).floor();
                player.n.points = zero;
            },
},
    },
    update(diff){
        if(player.h.upTime.gt(0)) player.h.upTime = player.h.upTime.sub(diff)
        if(player.h.upTime.lt(0)) player.h.upTime = zero
        if(player.h.upTime.gt(layers.h.boomedBalloonBoostLimitTime())) player.h.upTime = layers.h.boomedBalloonBoostLimitTime()
        if(player.he.upTime.gt(0)) player.he.upTime = player.he.upTime.sub(diff)
        if(player.he.upTime.lt(0)) player.he.upTime = zero
        if(player.he.temPointUpTime.gt(0)) player.he.temPointUpTime = player.he.temPointUpTime.sub(diff)
        if(player.he.temPointUpTime.lt(0)) player.he.temPointUpTime = zero
        if(player.he.upTime.gt(layers.he.boomedBalloonBoostLimitTime())) player.he.upTime = layers.he.boomedBalloonBoostLimitTime()
        // ---------- 氢气球爆炸时间 ----------
        if (hasUpgrade('h', 53)) {
            player.h.upTime = layers.h.addUpTime();
        } else {
            if(player.h.upTime.gt(0)) player.h.upTime = player.h.upTime.sub(diff)
            if(player.h.upTime.lt(0)) player.h.upTime = zero
            if(player.h.upTime.gt(layers.h.boomedBalloonBoostLimitTime())) player.h.upTime = layers.h.boomedBalloonBoostLimitTime()
            if(player.h.keepUpTime && hasMilestone("li",2)) player.h.upTime = layers.h.boomedBalloonBoostLimitTime()
        }
    
        // ---------- 氦气球爆炸时间 ----------
        if (hasUpgrade('h', 54)) {
            player.he.upTime = layers.he.addUpTime();
        } else {
            if(player.he.upTime.gt(0)) player.he.upTime = player.he.upTime.sub(diff)
            if(player.he.upTime.lt(0)) player.he.upTime = zero
            if(player.he.upTime.gt(layers.he.boomedBalloonBoostLimitTime())) player.he.upTime = layers.he.boomedBalloonBoostLimitTime()
            if(player.he.keepUpTime && hasMilestone("li",5)) player.he.upTime = layers.he.boomedBalloonBoostLimitTime()
        }
        if(player.h.upgradeAutobuy&&(hasMilestone("li",3)||hasUpgrade("c",11))){
            buyUpgrade("h",11);buyUpgrade("h",12);buyUpgrade("h",13);buyUpgrade("h",14);buyUpgrade("h",21);buyUpgrade("h",22);buyUpgrade("h",23);buyUpgrade("h",24);buyUpgrade("h",31);buyUpgrade("h",32);buyUpgrade("h",33);buyUpgrade("h",34);buyUpgrade("h",41);buyUpgrade("h",42);buyUpgrade("h",43);buyUpgrade("h",44)
            if(hasUpgrade("li",71)||hasUpgrade("c",11)){
                buyUpgrade("h",15);buyUpgrade("h",25);buyUpgrade("h",35);buyUpgrade("h",45)
            }
        }
        if(player.he.upgradeAutobuy&&(hasMilestone("li",4)||hasUpgrade("c",11))){
            buyUpgrade("he",11);buyUpgrade("he",12);buyUpgrade("he",13);buyUpgrade("he",14);buyUpgrade("he",21);buyUpgrade("he",22);buyUpgrade("he",23);buyUpgrade("he",24);buyUpgrade("he",31);buyUpgrade("he",32);buyUpgrade("he",33);buyUpgrade("he",34);
            if(hasUpgrade("li",71)||hasUpgrade("c",11)){
                buyUpgrade("he",41);buyUpgrade("he",42);buyUpgrade("he",43);buyUpgrade("he",44);buyUpgrade("he",45);buyUpgrade("he",51);buyUpgrade("he",52);buyUpgrade("he",53);buyUpgrade("he",54);buyUpgrade("he",55);buyUpgrade("he",61);buyUpgrade("he",62);buyUpgrade("he",63);buyUpgrade("he",64);buyUpgrade("he",65)
            }
        } 
        if(hasMilestone("li",6)&&player.h.autoGetHpowerBalloon) {
            player.h.power = player.h.power.max(0);
            let gain = layers.h.HpowerGet().div(hasMilestone("b",7)?0.1:10).mul(diff);
            player.h.power = player.h.power.add(gain).max(0);
            let floor = layers.h.balloonFloor();
            let newBalloon = player.h.power.add(1).log(floor).sub(2).floor().max(0);
            player.h.balloon = newBalloon;
            if (player.h.balloonMax.lt(newBalloon)) player.h.balloonMax = newBalloon;
            if (player.h.balloon.lt(player.h.balloonMax)) player.h.balloon = player.h.balloonMax;
        }
        if(hasMilestone("li",7)&&player.he.autoGetBalloon) {
            player.he.balloon = player.he.points.max(0)
        }
        if(hasMilestone("li",7)&&player.he.buyableAutobuy) {
            buyBuyable("he",11);buyBuyable("he",12)
        }
        if(hasMilestone("li",9)&&player.p.buyableAutobuy) {
            if(hasUpgrade("p",54)){
                let amount11 = player.p.points.root(2).max(1).ssqrt().pow(2).floor().add(1)
                let amount12 = player.p.points.max(1).ssqrt().floor().add(1)
                if(getBuyableAmount("p",11).lt(amount11)) setBuyableAmount("p",11,amount11)
                if(getBuyableAmount("p",12).lt(amount12)) setBuyableAmount("p",12,amount12)
            }
            else {buyBuyable("p",11);buyBuyable("p",12)}
        }
    },
    balloonBoostH(){
        let mult = player.h.balloon.add(1).pow(2)
        if(hasUpgrade("h",34)) mult = player.h.balloon.add(1).pow(3)        
        return mult
    },
    HpowerGet(){
        if (player.h.points.lt(0)) return zero;
        let get = player.h.points.div(2).root(2)
        if(hasMilestone("c",1)) get = get.div(eight.root(2))
        if(hasMilestone("h",3)) get = get.mul(2)
        if(hasUpgrade("h",32)) get = get.mul(upgradeEffect("h",32))
        if(hasUpgrade("h",33)) get = get.mul(upgradeEffect("h",33))
        if(getBuyableAmount("he",11).gte(1)) get = get.mul(buyableEffect("he",11))
        if(player.h.upTime.gt(0)) get = get.mul(layers.h.boomedBalloonBoostHpower())
        if(player.he.upTime.gt(0)) get = get.mul(layers.he.boomedBalloonBoostHpower())
        if(player.li.unlocked) get = get.mul(layers.li.LiboostHpower())
        if(hasUpgrade("li",42)) get = get.mul(upgradeEffect("li",42))
        if(hasUpgrade("li",92)) get = get.mul(upgradeEffect("li",92))
        if(hasMilestone("he",8)) get = get.mul(layers.he.temPointBoostHpower())
        if(hasUpgrade("b",33)) get = get.mul(upgradeEffect("b",33))

        if (!hasUpgrade('c', 13)) {
            if (get.gte(1e61)) get = powsoftcap(get, layers.h.HpowerGetsoftcap1start(), three);
        } //1软

        if(player.b.inBorane) get = get.pow(0.66686)
        if(player.c.inExtract) get = get.pow(0.666)
        return get
    },
    HpowerGetsoftcap1start(){
        let start = n(1e61)
        return start
    },
    addUpTime(){
        let t = player.h.balloon.div(2).floor().mul(10)
        return t
    },
    boomedBalloonBoostH(){
        let mult = four 
        if(hasUpgrade("h",42)&&!hasUpgrade("h",45)) mult = mult.mul(player.h.upTime.root(2).add(1))
        if(hasUpgrade("h",45)) mult = mult.mul(player.h.upTime.add(1))
        return mult
    },  
    boomedBalloonBoostHpower(){
        let mult = five
        if(hasUpgrade("h",42)&&!hasUpgrade("h",45)) mult = mult.mul(player.h.upTime.root(3).add(1))
        if(hasUpgrade("h",45)) mult = mult.mul(player.h.upTime.add(1))
        return mult
    }, 
    boomedBalloonBoostLimitTime(){
        let t = n(30)
        if(hasUpgrade("h",42)) t = t.add(upgradeEffect("h",42))
        if(hasUpgrade("h",45)) t = t.add(upgradeEffect("h",45))
        return t
    },
    balloonFloor(){
        let floor = ten
        return floor
    },
    tabFormat: {
        "主页": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", 
                    function(){return "你有 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(player.points)+"</span> 中微子"}],
                "upgrades",
                ["milestones", function() {
                    let data = {};
                    if (tmp.h && tmp.h.milestones) {
                        if (tmp.h.milestones[1]) data[1] = tmp.h.milestones[1];
                        if (tmp.h.milestones[2]) data[2] = tmp.h.milestones[2];
                    }
                    return data;
                }],
            ],
            unlocked(){return hasUpgrade("h",24)||player.li.unlocked}
    },
        "气球": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", 
                    function(){return "你有 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(player.points)+"</span> 中微子"}],
                "clickables",
                ["display-text",function(){
                    let a = "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.power)+"</span> 氢能"
                    if (!hasUpgrade('c', 13) && layers.h.HpowerGet().gt(layers.h.HpowerGetsoftcap1start())) a = a + "（受软上限限制）"
                    return a
                }],
                ["display-text",function(){
                    let a = "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.balloon)+"</span> 气球"
                    let b = ""
                    if(hasMilestone("h",3)) b = "，气球加成氢 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(layers.h.balloonBoostH())+"</span> 倍"
                    return a + b
                }],
                ["display-text",function(){
                    let a = ""
                    let b = ""
                    if(hasUpgrade("h",43)) a = "你有 <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(player.he.balloon)+"</span> 氦气球"
                    if(hasMilestone("h",4)) b = "，氦气球加成中微子 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(layers.he.balloonBoostPoints())+"</span> 倍"
                    return a + b
                }],
                ["display-text",function(){
                    let a = ""
                    if(hasMilestone("n",6)) a = "你有 <span style='color:#000000;text-shadow:0 0 10px'>"+format(player.n.balloon)+"</span> 氮气球，氮气球加成游戏速度 <span style='color:#000000;text-shadow:0 0 10px'>"+format(tmp.speedMult)+"</span> 倍"
                    return a
                }],
                ["milestones", function() {
                    let data = {};
                    if (tmp.h && tmp.h.milestones) {
                        for (let id = 3; id <= 5; id++) {
                            if (tmp.h.milestones[id]) data[id] = tmp.h.milestones[id];
                        }
                    }
                    return data;
                }]
            ],
            unlocked(){return hasUpgrade("h",24)}
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3F003F)",
        minHeight: "100vh"
    },
    onPrestige: function(gain) {
        let newH = player.h.points.add(gain);
        if (newH.lt(10)) {
            player.p.upgrades = [];
            player.p.buyables = getStartBuyables('p');
        } else if (newH.lt(100)) {
            player.p.buyables = getStartBuyables('p');
        } else {
        }
    }
})
/*
////
/hh/
/hh/
/hh/
/hhhhhhhh/      eeeeee
/hhhhhhhhh/    ee    ee
/hh/   /hh/    Celestee     uwu
/hh/   /hh/    ee           去玩Celeste!
/hh/   /hh/    ee    ee
/hh/   /hh/     eeeeee
*/
addLayer("he", {
    name: "he",
    symbol: "He",
    position: 1,
    branches: ["h"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        balloon: new Decimal(0),
        upTime: new Decimal(0),
        autoReset: true,
        upgradeAutobuy: true,
        keepUpTime: true,
        autoGetBalloon: true,
        temperature: new Decimal(1.4e32),
        temPoint: new Decimal(0),
        buyableAutobuy: true,
        temPointUpTime: new Decimal(0),
        clicks: new Decimal(0),
        autoTemPoint: true,
    }},
    color: "#FFBBCC",
    requires: new Decimal(1e11),
    resource: "氦",
    baseResource: "中微子",
    baseAmount() {return player.points},
    type: "static",
    exponent: 1,
    gainMult() {
        mult = one
        if(player.li.unlocked) mult = mult.div(layers.li.LidivHecost())
        if(hasMilestone("he",2)) mult = mult.div(layers.he.temPointdivHecost())
        if(hasAchievement('a', 21)) mult = mult.div(achievementEffect('a', 21))
        if(hasMilestone("be",1)) mult = mult.div(2)
        if(hasUpgrade("p",64)) mult = mult.div(upgradeEffect("p",64))
        if(hasUpgrade("p",72)) mult = mult.div(upgradeEffect("p",72))
        if(hasUpgrade("li",72)) mult = mult.div(upgradeEffect("li",72))
        if(hasUpgrade("b",24)) mult = mult.div(upgradeEffect("b",24))
        if(hasUpgrade("b",42)) mult = mult.div(upgradeEffect("b",42))
        return mult
    },
    gainExp() {
        exp = one
        return exp
    },
    row: 0,
    hotkeys: [
        {key: "e", description: "E: 进行一次氦重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone("h",2)||player.he.unlocked},
    canBuyMax(){return hasUpgrade("he",31)||hasMilestone("li",4)},
    autoPrestige() {return hasMilestone("li",1)&&player.he.autoReset},
    resetsNothing() {return hasMilestone("li",1)},
    upgrades:{
        11:{
            title:"氦原子",
            description:" 氦加成氢。",
            effect(){
                let effect = player.he.points.add(1).pow(2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(1),
            unlocked(){return player.he.unlocked},
        },
        12:{
            title:"氦原子核",
            description:" 氦加成中微子。",
            effect(){
                let effect = player.he.points.add(1)
                if(effect.gte(10)) effect = effect.div(10).root(2).add(10)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(3),
            unlocked(){return player.he.unlocked},
        },
        13:{
            title:"宇宙本源",
            description:" 解锁更多中微子升级。",
            cost: new Decimal(731),
            unlocked(){return hasUpgrade("he",63)},
        },
        14:{
            title:"同位科技",
            description:" 解锁更多锂升级。",
            cost: new Decimal(795),
            unlocked(){return hasUpgrade("he",63)},
        },
        21:{
            title:"氦电子 1s1",
            description:"解锁新的中微子升级，并加成 粒子加速器|原初 上限 50。",
            effect(){
                let effect = n(50)
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(15),
            unlocked(){return hasUpgrade("h",44)},
        },
        22:{
            title:"氦电子 1s2",
            description:"较小幅加成中微子，并进一步优化 高能中微子 的公式",
            effect(){
                let effect = n(1.3)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(17),
            unlocked(){return hasUpgrade("he",21)},
        },
        23:{
            title:"氦质子 I",
            description:"氦-3 加成中微子。",
            cost: new Decimal(21),
            unlocked(){return hasUpgrade("he",22)},
        },
        24:{
            title:"氦质子 II",
            description:"氦-4 加成中微子。",
            cost: new Decimal(25),
            unlocked(){return hasUpgrade("he",23)},
        },
        31:{
            title:"氦中子 I",
            description:"氦气球转化不消耗氦，并最大重置氦。",
            cost: new Decimal(39),
            unlocked(){return hasUpgrade("he",24)},
        },
        32:{
            title:"氦中子 II",
            description:"爆炸氦气球效果的持续时间越高效果就越强，并加成时间上限 1m。",
            effect(){
                let effect = n(60)
                return effect
            },
            effectDisplay(){return "+"+formatTime(this.effect())},
            cost: new Decimal(41),
            unlocked(){return hasUpgrade("he",31)},
        },
        33:{
            title:"月壤",
            description:"优化 氦-3 的公式。",
            cost: new Decimal(45),
            unlocked(){return hasUpgrade("he",32)},
        },
        34:{
            title:"阿尔法粒子",
            description:"优化 氦-4 的公式。",
            cost: new Decimal(47),
            unlocked(){return hasUpgrade("he",33)},
        },
        41:{
            title:"开始冷却！",
            description:"解锁冷却可点击。",
            cost: new Decimal(61),
            unlocked(){return hasMilestone("li",5)},
        },
        42:{
            title:"加速生产 VIII",
            description:"翻倍温度点获取。",
            cost: new Decimal(20),
            effect(){
                let effect = n(2)
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",41)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        43:{
            title:"效果发散",
            description:" 氦提升前两个温度点效果的软上限。",
            cost: new Decimal(85),
            effect(){
                let effect = player.he.points.add(1)
                if(hasUpgrade("b",34)) effect = effect.pow(upgradeEffect("b",34))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",42)},
        },
        44:{
            title:"高阶冷却",
            description:"解锁新的冷却可点击。",
            cost: new Decimal(300000),
            unlocked(){return hasUpgrade("he",43)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        45:{
            title:"调节温度",
            description:"优化温度的公式。",
            cost: new Decimal(6668600),
            unlocked(){return hasUpgrade("he",44)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        51:{
            title:"指数放置",
            description:" 锂加成 温度点效果|共工 的指数。",
            effect(){
                let effect = player.li.points.root(2).div(10)
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(30000000),
            unlocked(){return hasUpgrade("he",45)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        52:{
            title:"效果发散 II",
            description:" 锂提升 温度点效果|共工软上限。",
            cost: new Decimal(3e9),
            effect(){
                let effect = player.li.points.add(1)
                if(hasUpgrade("b",34)) effect = effect.pow(upgradeEffect("b",34))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",51)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        53:{
            title:"冷却推进",
            description:" 温度点加成 提升冷却氦 的效果。",
            cost: new Decimal(3.14e16),
            effect(){
                let effect = player.he.temPoint.add(2).log(2).pow(1.3)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",52)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        54:{
            title:"强化冷却",
            description:"氦加成温度点。",
            cost: new Decimal(3e19),
            effect(){
                let effect = new Decimal(1.05).pow(player.he.points)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",53)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        55:{
            title:"强化冷却 II",
            description:"氢加成温度点。",
            cost: new Decimal(3e24),
            effect(){
                let effect = player.h.points.add(10).log(10).pow(2).add(1).div(2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",54)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        61:{
            title:"强化冷却 III",
            description:"锂与铍加成温度点。",
            cost: new Decimal(3e58),
            effect(){
                let effect = player.be.points.add(3).log(3).pow(2).add(1).div(2).mul(player.li.points)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",55)&&hasMilestone("be",3)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        62:{
            title:"扩容 II",
            description:"温度点加成电能上限。",
            cost: new Decimal(6e60),
            effect(){
                let effect = player.he.temPoint.add(10).log(10).mul(2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",55)&&hasMilestone("be",3)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        63:{
            title:"调节温度 II",
            description:"彻底优化温度的公式，并在主页解锁新的氦升级。",
            cost: new Decimal(3e68),
            unlocked(){return hasUpgrade("he",55)&&hasMilestone("be",3)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        64:{
            title:"相互作用",
            description:"温度点可以加成自身与提升冷却氦的时间。",
            effect(){
                let effect = player.he.temPoint.add(1).log2().add(1).log2().add(1)
                return effect
            },
            cost: new Decimal(3e85),
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasMilestone("b",2)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        65:{
            title:"超导体？！",
            description:"降低锂的成本指数。",
            effect(){
                let effect = 0.05
                return effect
            },
            cost: new Decimal(9.99e99),
            effectDisplay(){return "-"+format(this.effect())},
            unlocked(){return hasMilestone("b",2)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
    },
    buyables:{
        11:{
            title: "氦-3",
            cost(x) {
                let a = x.pow(2).add(1).floor()
                return a
            },
            display() { return "加成氢能。<br>价格：" + format(this.cost()) + "氦（不消耗）<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限数量：" + format(this.purchaseLimit())},
            canAfford() { return player.he.points.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let a = x.add(1)
                if(hasUpgrade("he",33)) a = a.pow(1.5)
                return a
            },
            purchaseLimit(){
                let a = n(100)
                return a
            },
            unlocked(){return hasMilestone("h",2)},
        },
        12:{
            title: "氦-4",
            cost(x) {
                let a = x.add(1)
                if(x.gte(35)) a = x.pow(1.03).add(1).floor()
                return a
            },
            display() { return "加成氢。<br>价格：" + format(this.cost()) + "氦（不消耗）<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限数量：" + format(this.purchaseLimit())},
            canAfford() { return player.he.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let a = x.pow(2).add(1)
                if(hasUpgrade("he",34)) a = x.pow(2).add(x.mul(50).add(1))
                return a
            },
            purchaseLimit(){
                if (hasUpgrade("p", 74)) {
                    return new Decimal(Infinity);
                }
                return new Decimal(100);
            },
            unlocked(){return hasMilestone("h",2)},
        }, 
    },
    milestones:{
        1:{
            requirementDescription: "氦温度低于 2.5e31",
            effectDescription: "解锁 温度点效果|蓐收。",
            done(){return player.he.temperature.lte(2.5e31)},
            unlocked(){return hasMilestone("li",5)},
        },
        2:{
            requirementDescription: "氦温度低于 7e29",
            effectDescription: "解锁 温度点效果|句芒。",
            done(){return player.he.temperature.lte(7e29)},
            unlocked(){return hasMilestone("he",1)},
        },
        3:{
            requirementDescription: "氦温度低于 1e28",
            effectDescription: "解锁 温度点效果|共工。",
            done(){return player.he.temperature.lte(1e28)},
            unlocked(){return hasMilestone("he",2)},
        },
        4:{
            requirementDescription: "氦温度低于 1.7e27",
            effectDescription: "解锁 温度点效果|祝融。",
            done(){return player.he.temperature.lte(1.7e27)},
            unlocked(){return hasMilestone("he",3)},
        },
        5:{
            requirementDescription: "氦温度低于 1.4e27",
            effectDescription: "加成 温度点效果|祝融。",
            done(){return player.he.temperature.lte(1.4e27)},
            unlocked(){return hasMilestone("he",4)},
        },
        6:{
            requirementDescription: "氦温度低于 1.4e26",
            effectDescription: "加成 温度点效果|句芒。",
            done(){return player.he.temperature.lte(1.4e26)},
            unlocked(){return hasMilestone("he",5)},
        },
        7:{
            requirementDescription: "氦温度低于 6e25",
            effectDescription: "解锁新层级。",
            done(){return player.he.temperature.lte(6e25)},
            unlocked(){return hasMilestone("he",6)},
        },
        8:{
            requirementDescription: "温度低于 3e23",
            effectDescription: "解锁 温度点效果|后土。",
            done(){return player.he.temperature.lte(3e23)},
            unlocked(){return hasMilestone("he",7)},
        },
        9:{
            requirementDescription: "氦温度低于 3.14e16",
            effectDescription: "进一步加成 温度点效果|祝融。",
            done(){return player.he.temperature.lte(3.14e16)},
            unlocked(){return hasMilestone("he",8)},
        },
        10:{
            requirementDescription: "氦温度低于 4e12",
            effectDescription: "解锁 温度点效果|天吴。",
            done(){return player.he.temperature.lte(4e12)},
            unlocked(){return hasMilestone("he",9)},
        },
        11:{
            requirementDescription: "氦温度低于 -273.14",
            effectDescription: "解锁 温度点效果|玄冥。",
            done(){return player.he.temperature.lte(0.01)},
            unlocked(){return hasMilestone("he",10)},
        },
        12:{
            requirementDescription: "回调后氦温度低于 2e22",
            effectDescription: "解锁 温度点效果|强良。",
            done(){return hasMilestone("n",3)&&player.he.temperature.lte(2e22)},
            unlocked(){return hasMilestone("n",3)},
        },
    },
    clickables:{
        11:{
            title:"冷却氦",
            display() {return "点击或按住来冷却氦<br>每次点击可获得 <span style='color:#775500;text-shadow:0 0 10px'>"+format(layers.he.temPointGet())+"</span>  温度点"}, 
            unlocked() {return hasUpgrade("he",41)},
            canClick() {return true},
            onClick() {
                player.he.temPoint = player.he.temPoint.add(layers.he.temPointGet())
                player.he.clicks = player.he.clicks.add(1)
            },
            onHold(){
                player.he.temPoint = player.he.temPoint.add(layers.he.temPointGet().div(10))
            },
            style() { return { 'background-color': this.canClick()?"#FFDA00":"#BF8F8F" } },
        },
        12:{
            title:"提升冷却氦",
            display() {return "在短时间内加成温度点获取<br>剩余时间:" + formatTime(player.he.temPointUpTime) + "<br>点击后加成时间:" + formatTime(layers.he.addtemPointUpTime()) + "<br>当前倍率:" + format(layers.he.upTemPointMult()) + "x"}, 
            unlocked() {return hasUpgrade("he",44)},
            canClick() {return player.he.temPointUpTime.lte(0)||hasUpgrade("li",61)},
            onClick() {
                player.he.temPointUpTime = layers.he.addtemPointUpTime()
            },
            style() { return { 'background-color': this.canClick()?"#FFDA00":"#BF8F8F"} },
        },
    },
    bars: {
        temperature: {
            direction: RIGHT,
            width: 800,
            height: 32,
            fillStyle: {'background-color' : "#776500‌"},
            display(){
                return "你的氦现在的温度是 <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(player.he.temperature.sub(273.15))+"</span> 摄氏度（距离绝对零度 <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(player.he.temperature)+"</span>，进度 <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(this.progress().mul(100))+"</span> %）"
            },
            req(){
                let a = n(1.4e32).log(10)
                return a
            },
            progress() {
                let a = n(1).sub(player.he.temperature.log(10).div(this.req()))
                if(a.gt(1)) a = n(1)
                return a
            },
            unlocked(){return true}
        },
    },
    balloonBoostPoints(){//气球加点
        let mult = player.he.balloon.add(1)
        return mult
    },
    addUpTime(){//气球炸的时间
        let t = player.he.balloon.div(2).floor().mul(10)
        return t
    },
    boomedBalloonBoostPoints(){//炸的气球加点
        let mult = ten
        if(hasUpgrade("he",32)&&!hasUpgrade("h",45)) mult = mult.mul(player.he.upTime.root(2).add(1))
        if(hasUpgrade("h",45)) mult = mult.mul(player.he.upTime.add(1))
        return mult
    },
    boomedBalloonBoostHpower(){//炸的气球加氢能
        let mult = n(15)
        if(hasUpgrade("he",32)&&!hasUpgrade("h",45)) mult = mult.mul(player.he.upTime.root(3).add(1))
        if(hasUpgrade("h",45)) mult = mult.mul(player.he.upTime.add(1))
        return mult
    }, 
    boomedBalloonBoostLimitTime(){//炸的气球时间上限
        let t = n(70)
        if(hasUpgrade("he",32)) t = t.add(upgradeEffect("he",32))
        if(hasUpgrade("h",45)) t = t.add(upgradeEffect("h",45))
        return t
    },
    temPointGet(){//温度点获取
        let get = one
        if(hasMilestone("li",7)) get = get.mul(layers.li.LiboostTemPoint())
        if(hasUpgrade("he",42)) get = get.mul(upgradeEffect("he",42))
        if(player.he.temPointUpTime.gt(0)) get = get.mul(layers.he.upTemPointMult()) 
        if(hasUpgrade("p",44)) get = get.mul(upgradeEffect("p",44))
        if(hasUpgrade("he",54)) get = get.mul(upgradeEffect("he",54))
        if(hasUpgrade("he",55)) get = get.mul(upgradeEffect("he",55))
        if(hasUpgrade("he",61)) get = get.mul(upgradeEffect("he",61))
        if(hasUpgrade("he",64)) get = get.mul(upgradeEffect("he",64))
        if(hasUpgrade("li",82)) get = get.mul(upgradeEffect("li",82))
        if(hasUpgrade("b",21)) get = get.mul(upgradeEffect("b",21))
        if(hasUpgrade("b",41)) get = get.mul(upgradeEffect("b",41))
        if(hasAchievement("a",26)) get = get.mul(achievementEffect("a",26))

        if(player.b.inBorane) get = get.pow(0.66686)
        if(player.c.inExtract) get = get.pow(0.666)
        return get
    },
    temPointBoostH(){//温度点加氢
        let exp = hasUpgrade('h', 52) ? 0.5 : 2.386466;
        let mult = player.he.temPoint.add(1).pow(exp).add(1);
        if (!hasUpgrade('h', 52)) {
            if(mult.gte(layers.he.temPointEffect1SoftcapStart())) mult = mult.div(layers.he.temPointEffect1SoftcapStart()).root(2).add(layers.he.temPointEffect1SoftcapStart())
            let savemult = powsoftcap(mult,layers.he.temPointEffect1SoftcapStart().mul(1e82),5)
            let root = savemult.log(1e24).max(5)
            mult = powsoftcap(mult,layers.he.temPointEffect1SoftcapStart().mul(1e82),root)
        }
        return mult
    },
    temPointBoostHpower(){//温度点加氢能
        let mult = player.he.temPoint.add(1).log(10).add(1).pow(3).add(1)
        //if(mult.gte(layers.he.temPointEffect5SoftcapStart())) mult = powsoftcap(mult,layers.he.temPointEffect5SoftcapStart(),five)
        return mult
    },
    temPointBoostPoints(){//温度点加点
        let exp = hasUpgrade('h', 52) ? 0.75 : 0.8;
        if(hasUpgrade("he",51)) exp += upgradeEffect("he",51)
        let mult = player.he.temPoint.add(1).pow(exp).add(1)
        if (!hasUpgrade('h', 52)) {
            if(mult.gte(layers.he.temPointEffect3SoftcapStart())) mult = mult.div(layers.he.temPointEffect3SoftcapStart()).root(1.5).add(layers.he.temPointEffect3SoftcapStart())
            let savemult = powsoftcap(mult,layers.he.temPointEffect3SoftcapStart().mul("2e58"),3)
            let root = savemult.log(n(1e115).root(3)).max(3)
            mult = powsoftcap(mult,layers.he.temPointEffect3SoftcapStart().mul("2e58"),root)
        }
        return mult
    },
    temPointEffect1SoftcapStart(){//温度点效果1软上限起点
        let start = n(100000)
        if(hasUpgrade("he",43)) start = start.mul(upgradeEffect("he",43))
        return start
    },
    temPointEffect2SoftcapStart(){//温度点效果2软上限起点
        let start = n(1e125)
        if(hasUpgrade("he",43)) start = start.mul(upgradeEffect("he",43))
        return start
    },
    temPointEffect3SoftcapStart(){//温度点效果3软上限起点
        let start = n(1e10)
        if(hasUpgrade("he",52)) start = start.mul(upgradeEffect("he",52))
        return start
    },
    temPointdivHecost(){//温度点减氦价格
        let divt = player.he.temPoint.root(2)
        if(hasMilestone("he",6)) divt = divt.pow(4)
        if(hasMilestone("n",1)) divt = divt.root(2).pow(player.he.temPoint.add(1).log2().add(1).log2().add(1).log2().add(1))
        if (hasUpgrade("b", 23)) {
            return divt;
        }
        savedivt = powsoftcap(divt,layers.he.temPointEffect2SoftcapStart(),five)
        root = savedivt.log(1e36).max(5)
        divt = powsoftcap(divt,layers.he.temPointEffect2SoftcapStart(),root)
        return divt
    },
    temPointdivLicost(){//温度点减锂价格
        let divt = player.he.temPoint
        if(!hasMilestone("he",4)) divt = zero
        if(!hasUpgrade("li",102)) divt = divt.add(2).log(1.7).mul(3)
        if(hasMilestone("he",5)&&!hasUpgrade("li",102)) divt = divt.pow(3)
        if(hasMilestone("he",9)&&!hasUpgrade("li",102)) divt = divt.pow(5)
        return divt
    },
    temPointEffect6(){//温度点延迟深度超级折算
        let num = player.he.temPoint.div(1e140).max(1).add(1).log2().add(1)
        return num
    },
    temPointEffect7(){
        let num = player.he.temPoint.div(1e240).max(1).add(1).log10().add(1)
        return num
    },
    temPointEffect8(){
        let num = player.he.temPoint.div(1e300).max(1).add(1).ln().add(1)
        return num
    },
    addtemPointUpTime(){//温度点提升时间
        let t = ten
        if(hasUpgrade("li",61)) t = n(60)
        if(hasUpgrade("he",64)) t=t.mul(upgradeEffect("he",64))
        if(hasUpgrade("b",22)) t=t.mul(upgradeEffect("b",22))
        return t
    },
    upTemPointMult(){//温度点提升乘数
        let mult = ten.add(player.he.temPointUpTime.root(2))
        if(hasUpgrade("he",53)) mult = mult.mul(upgradeEffect("he",53))
        if(hasUpgrade("li",61)) mult = mult.mul(upgradeEffect("li",61))
        if(player.he.temPointUpTime.lte(0)) mult = one
        return mult
    },
    update(diff){
        if(!hasUpgrade("he",45))player.he.temperature = n(1.4e32).div(player.he.temPoint.add(2).log(2).pow(2))
        if(hasUpgrade("he",45))player.he.temperature = n(1.4e32).div(player.he.temPoint.add(2).log(2).pow(3))
        if(hasUpgrade("he",63)&&!hasMilestone("n",3))player.he.temperature = n(1.4e32).div(player.he.temPoint.add(100).root(8))
        if(hasMilestone("li",12)&&player.he.autoTemPoint)player.he.temPoint = player.he.temPoint.add(layers.he.temPointGet().mul(diff))
        if(hasUpgrade("p",53))player.he.temPoint = player.he.temPoint.add(layers.he.temPointGet().mul(upgradeEffect("p",53)).mul(diff))
    },
    tabFormat: { 
        "主页": {   
            content: [
                "main-display",
                "prestige-button",   
                ["display-text", 
                    function(){return "你有 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(player.points)+"</span> 中微子"}],
                "buyables",
                ["upgrades",[1,2,3]]
            ],
            unlocked(){return player.he.unlocked}
        },
        "冷却": {
            content: [
                "main-display",
                "prestige-button",   
                ["display-text", 
                    function(){return "你有 <span style='color:#FFFFFF;text-shadow:0 0 10px'> "+format(player.points)+"</span> 中微子"}],
                ["bar","temperature"],["display-text",function(){return "<h4>你有 <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(player.he.temPoint)+"</span> 温度点（其实就是它们在计算温度）</h4>"}],
                ["display-text",function(){
                    let a = "<h4>"
                    if(hasMilestone("he",1)) {
                        a = a + "温度点效果|蓐收：使氢获取变为原来的 <span style='color:#FF66CC;text-shadow:0 0 10px'> "+format(layers.he.temPointBoostH())+"</span> 倍"
                        if (!hasUpgrade('h', 52) && layers.he.temPointBoostPoints().gte(layers.he.temPointEffect3SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"     
                    }       
                    if(hasMilestone("he",2)) {
                        a = a + "温度点效果|句芒：使氦价格 / <span style='color:#FFBBCC;text-shadow:0 0 10px'> "+format(layers.he.temPointdivHecost())+"</span>"
                        if(!hasUpgrade("b",23) && layers.he.temPointdivHecost().gte(layers.he.temPointEffect2SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"
                    }
                    if(hasMilestone("he",3)) {
                        a = a + "温度点效果|共工：使中微子获取变为原来的 <span style='color:#FFFFFF;text-shadow:0 0 10px'> "+format(layers.he.temPointBoostPoints())+"</span> 倍"
                        if (!hasUpgrade('h', 52) && layers.he.temPointBoostPoints().gte(layers.he.temPointEffect3SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"     
                    }  
                    if(hasMilestone("he",4)) {
                        a = a + "温度点效果|祝融：使锂价格 / <span style='color:#CC0033;text-shadow:0 0 10px'> "+format(layers.he.temPointdivLicost().add(1))+"</span>"
                        a = a + "<br>"     
                    }     
                    if(hasMilestone("he",8)) {
                        a = a + "温度点效果|后土：使氢能获取变为原来的 <span style='color:#FF66CC;text-shadow:0 0 10px'> "+format(layers.he.temPointBoostHpower())+"</span> 倍"
                        //if(layers.he.temPointBoostHpower().gte(layers.he.temPointEffect5SoftcapStart())) a = a + "（已达软上限）"
                        a = a + "<br>"     
                    }  
                    if(hasMilestone("he",10)) {
                        a = a + "温度点效果|天吴：使铍获取变为原来的 <span style='color:#55CC77;text-shadow:0 0 10px'> "+format(layers.he.temPointEffect6())+"</span> 倍"
                        //if(layers.he.temPointEffect6().gte(layers.he.temPointEffect6SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"     
                    }   
                    if(hasMilestone("he",11)) {
                        a = a + "温度点效果|玄冥：使电能上限变为原来的 <span style='color:#DDDD33;text-shadow:0 0 10px'> "+format(layers.he.temPointEffect7())+"</span> 倍"
                        a = a + "<br>"     
                    }
                    if(hasMilestone("he",12)) {
                        a = a + "温度点效果|强良：使硼烷产能变为原来的 <span style='color:#992222;text-shadow:0 0 10px'> "+format(layers.he.temPointEffect8())+"</span> 倍"
                        a = a + "<br>"     
                    }   
                    return a + "</h4>"  
                }],"clickables",["upgrades",[4,5,6,7]],
            ],
            unlocked(){return hasMilestone("li",5)}
        },
        "里程碑": {   
            content: [
                "main-display",
                "prestige-button",   
                ["display-text", 
                    function(){return "你有 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(player.points)+"</span> 中微子"}],
                ["display-text",function(){return "你的氦现在的温度是 <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(player.he.temperature)+"</span>"}],"milestones"
            ],
            unlocked(){return hasUpgrade("he",41)}
        },
    }, 
    style: {
        background: "linear-gradient(135deg, #000000, #3F1F3F)",
        minHeight: "100vh"
    },
})
/*
ll    挂机[]
ll
ll               i1
ll
ll               ii           锂P锂E锂I锂T锂-----------------------------------------------------------------------------------------
ll               ii
lllllllllll      ii
*/
addLayer("li", {
    name: "li",
    symbol: "Li",
    position: 2,
    branches: ["h"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        autoReset: true,
        electricityCap: new Decimal(100),
        currentElectricity: zero,
        hPowerConsumingPercentage: zero,//0-10%,当小于等于0时就是不填充
        confirmRespec: false,
        confirmTime: zero,
        researchPoint: zero,
    }},
    color: "#CC0033",
    requires: new Decimal(1e24),
    resource: "锂",
    baseResource: "氢",
    baseAmount() {return player.h.points},
    type: "static",
    exponent() {
        let exp = 1.8;
        if (hasUpgrade("he", 65)) {
            exp -= upgradeEffect("he", 65);
        }
        return Math.max(exp, 0.1);
    },
    gainMult() {
        mult = one
        if(hasMilestone("he",3)) mult = mult.div(layers.he.temPointdivLicost().add(1))
        if(hasUpgrade("li",51)) mult = mult.div(upgradeEffect("li",51))
        if(hasMilestone("be",1)) mult = mult.div(2)
        if(hasAchievement('a', 22)) mult = mult.div(achievementEffect('a',22))
        if(hasUpgrade("p",73)) mult = mult.div(upgradeEffect("p",73))
        if(hasUpgrade("li",72)) mult = mult.div(upgradeEffect("li",72))
        if(hasUpgrade("p",75)) mult = mult.div(upgradeEffect("p",75))
        if(hasUpgrade("b",12)) mult = mult.div(upgradeEffect("b",12))
        if(hasUpgrade("b",42)) mult = mult.div(upgradeEffect("b",42))
        return mult
    },
    gainExp() {
        exp = one
        return exp
    },
    row: 1,
    hotkeys: [
        {key: "l", description: "L: 进行一次锂重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("he",34)||player.li.unlocked},
    resetsNothing() {return hasAchievement("a",15)},
    autoPrestige() {return hasMilestone("be",2)&&player.li.autoReset},
    canBuyMax() {return hasMilestone("be",2)},
    upgrades:{
        11:{
            title:"锂原子",
            description:"翻七倍中微子获取。",
            effect(){
                let effect = n(7)
                if(hasUpgrade("li",12)) effect = effect.mul(upgradeEffect("li",12))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(1),
            unlocked(){return player.li.unlocked},
        },
        12:{
            title:"锂原子核",
            description:"翻八倍 锂原子 效果。",
            effect(){
                let effect = n(8)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(3),
            unlocked(){return player.li.unlocked},
        },
        13:{
            title:"锂-6",
            description:"解锁锂的第五个效果。",
            cost: new Decimal(39),
            unlocked(){return hasUpgrade("he",14)||hasUpgrade("li",[this.id])},
        },
        14:{
            title:"锂-7",
            description:"解锁锂的第六个效果，并解锁新的电子升级。",
            cost: new Decimal(40),
            unlocked(){return hasUpgrade("he",14)||hasUpgrade("li",[this.id])},
        },
        21:{
            title:"研究",
            description:"解锁锂研究。",
            cost: new Decimal(24),
            unlocked(){return hasMilestone("be",1)},
        },
        22:{
            title:"离子化",
            description:"解锁锂的第八个效果。",
            cost: new Decimal(136),
            unlocked(){return hasUpgrade("p",95)},
        },
        23:{
            title:"氮化锂",
            description:"大幅加强锂的第非四的倍数个效果。",
            cost: new Decimal(137),
            unlocked(){return hasUpgrade("li",22)},
        },
        24:{
            title:"焰色反应",
            description:"解锁锂的第九个效果。",
            cost: new Decimal(139),
            unlocked(){return hasUpgrade("li",23)},
        },
        31:{
            title:"研究-11",
            description:"解锁下列研究树的第二与第三行。",
            cost: new Decimal(3),
            unlocked(){return hasUpgrade("li",21)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
        },
        32:{
            title:"研究-sp1",
            description:"你可以同时购买 研究 21,22,31,32。",
            cost: new Decimal(1),
            unlocked(){return hasUpgrade("li",52)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
        },
        41:{
            title:"研究-21",
            description:" 锂加成电能。",
            cost: new Decimal(1),
            effect(){
                let effect = player.li.points.add(1).root(2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("li",31)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",31)
                if(hasUpgrade("li",42)) canbuy = false
                if(hasUpgrade("li",32)) canbuy = hasUpgrade("li",31)
                return canbuy
            },
        },
        42:{
            title:"研究-22",
            description:" 锂加成氢能。",
            cost: new Decimal(3),
            effect(){
                let effect = player.li.points.add(1).pow(20)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("li",31)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",31)
                if(hasUpgrade("li",41)) canbuy = false
                if(hasUpgrade("li",32)) canbuy = hasUpgrade("li",31)
                return canbuy
            },
        },
        51:{
            title:"研究-31",
            description:" 电能降低锂价格。",
            cost: new Decimal(4),
            effect(){
                let effect = player.li.currentElectricity.add(1).pow(6)
                return effect
            },
            effectDisplay(){return "/"+format(this.effect())},
            unlocked(){return hasUpgrade("li",31)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",41)
                if(hasUpgrade("li",42)) canbuy = false
                if(hasUpgrade("li",32)) canbuy = hasUpgrade("li",41)
                return canbuy
            },
        },
        52:{
            title:"研究-32",
            description:" 锂研究点购买量提升电池容量上限，并解锁一个电可购买与一个研究升级。",
            cost: new Decimal(3),
            effect(){
                let effect = new Decimal(1.7)
                if(!hasUpgrade("li",103)) effect = effect.pow(getBuyableAmount("li",11))
                if(hasUpgrade("li",103)) effect = effect.sub(0.2).pow(getBuyableAmount("li",11).add(getBuyableAmount("li",12)).add(getBuyableAmount("li",13)).add(getBuyableAmount("li",14)))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("li",31)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",42)
                if(hasUpgrade("li",41)) canbuy = false
                if(hasUpgrade("li",32)) canbuy = hasUpgrade("li",42)
                return canbuy
            },        
        },
        61:{
            title:"研究-41",
            description:"加成提升冷却氦时间上限 50 s，且加成时间加成效果，并让你可以一直点击提升冷却氦。",
            cost: new Decimal(10),
            effect(){
                let effect = player.he.temPointUpTime.pow(3).add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasMilestone("be",3)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",51)||hasUpgrade("li",52)
                return canbuy
            },        
        },
        62:{
            title:"研究-42",
            description:"研究点的计算公式更改为乘算。",
            cost: new Decimal(12),
            unlocked(){return hasUpgrade("be",14)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",51)||hasUpgrade("li",52)
                return canbuy
            },
            onPurchase: function() {
                player.li.researchPoint = layers.li.totalResearchPoints();
            }
        },
        71:{
            title:"研究-51",
            description:"解锁更多电子升级，且 绿石科技 效果更改为基于总研究点。",
            cost: new Decimal(1370),
            unlocked(){return hasUpgrade("li",62)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",62)
                return canbuy
            },        
        },
        72: {
            title: "研究-52",
            description: "总研究点降低氦与锂的价格。",
            cost: new Decimal(1810),
            unlocked() { return hasUpgrade("li", 62); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            effect() {
                return layers.li.totalResearchPoints().add(1);
            },
            effectDisplay() { return "/" + format(this.effect()); },
            canAfford() {
                return hasUpgrade("li", 62);
            },
        },
        81:{
            title:"研究-61",
            description:"氢加成电子。",
            cost: new Decimal(2100),
            unlocked(){return hasUpgrade("li",72)},
            effect(){
                let effect = player.h.points.add(1).log2().add(1).log2().add(1).floor();
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",72)
                return canbuy
            },        
        },
        82: {
            title: "研究-62",
            description: "总研究点加成温度点。",
            cost: new Decimal(1400),
            unlocked() { return hasUpgrade("li", 81); },
            effect() {
                return layers.li.totalResearchPoints().add(1);
            },
            effectDisplay() { return "x" + format(this.effect()); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            canAfford() {
                return hasUpgrade("li", 72);
            },
        },
        91: {
            title: "研究-71",
            description: "总研究点降低硼价格。",
            cost: new Decimal(2000),
            effect() {
                return layers.li.totalResearchPoints().add(1);
            },
            effectDisplay() { return "/" + format(this.effect()); },
            unlocked() { return hasUpgrade("li", 81) && hasUpgrade("li", 82); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            canAfford() {
                return hasUpgrade("li", 81) && hasUpgrade("li", 82);
            },
        },
        92: {
            title: "研究-72",
            description: "总研究点加成氢能。",
            cost: new Decimal(13500),
            effect() {
                return layers.li.totalResearchPoints().add(1);
            },
            effectDisplay() { return "x" + format(this.effect()); },
            unlocked() { return hasUpgrade("li", 81) && hasUpgrade("li", 82); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            canAfford() {
                return hasUpgrade("li", 81) && hasUpgrade("li", 82);
            },
        },
        101: {
            title: "研究-a1",
            description: "优化 电子加速 和 电子加速 II 的公式。",
            cost: new Decimal(200000),
            unlocked() { return hasUpgrade("li", 91) && hasUpgrade("li", 92); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            canAfford() {
                return hasUpgrade("li", 91) && hasUpgrade("li", 92);
            },
        },
        102: {
            title: "研究-b1",
            description: "更进一步加成 温度点效果|祝融。",
            cost: new Decimal(500000),
            unlocked() { return hasUpgrade("li", 91) && hasUpgrade("li", 92); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            canAfford() {
                return hasUpgrade("li", 91) && hasUpgrade("li", 92);
            },
        },
        103: {
            title: "研究-c1",
            description: "略微削弱 研究-32 的基础，但让后三种研究点也可以加成 研究-32 的效果。",
            cost: new Decimal(2000000),
            unlocked() { return hasUpgrade("li", 91) && hasUpgrade("li", 92); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            canAfford() {
                return hasUpgrade("li", 91) && hasUpgrade("li", 92);
            },
        },
        104: {
            title: "研究-d1",
            description: "前面的世界，以后再来探索吧！",
            cost: new Decimal(9999999),
            unlocked() { return hasUpgrade("li", 91) && hasUpgrade("li", 92); },
            currencyDisplayName: "研究点",
            currencyInternalName: "researchPoint",
            currencyLayer: "li",
            canAfford() {
                return hasUpgrade("li", 91) && hasUpgrade("li", 92);
            },
        },
    },
    buyables:{
        11:{
            title: "锂研究点",
            cost(x) {
                let a = x.mul(2).add(20)
                return a
            },
            display() { return "价格：<span style='color:#553333;text-shadow:0 0 10px'>"+format(this.cost(),0)+"</span> 锂<br>当前数量：<span style='color:#553333;text-shadow:0 0 10px'>"+format(getBuyableAmount("li",11),0)+"</span>"},
            canAfford() { return player.li.points.gte(this.cost())},
            buy() {
                let oldTotal = layers.li.totalResearchPoints();
                player.li.points = player.li.points.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
                let newTotal = layers.li.totalResearchPoints();
                player.li.researchPoint = player.li.researchPoint.add(newTotal.sub(oldTotal));
            },
            unlocked(){return hasMilestone("be",1)},
            style() { return { 'background-color': this.canAfford()?"#CC0033":"#BF8F8F" }},
        },
        12:{
            title: "电研究点",
            cost(x) {
                let a = three.pow(x.add(2))
                return a
            },
            display() { return "价格：<span style='color:#666611;text-shadow:0 0 10px'>"+format(this.cost(),0)+"</span> 电能<br>当前数量：<span style='color:#666611;text-shadow:0 0 10px'>"+format(getBuyableAmount("li",12),0)+"</span>"},
            canAfford() { return player.li.currentElectricity.gte(this.cost())},
            buy() {
                let oldTotal = layers.li.totalResearchPoints();
                player.li.currentElectricity = player.li.currentElectricity.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
                let newTotal = layers.li.totalResearchPoints();
                player.li.researchPoint = player.li.researchPoint.add(newTotal.sub(oldTotal));
            },
            unlocked(){return hasMilestone("be",1)},
            style() { return { 'background-color': this.canAfford()?"#DDDD33":"#BF8F8F"}},
        },
        13:{
            title: "石研究点",
            cost(x) {
                let a = two.pow(x.add(1))
                return a
            },
            display() { return "价格: <span style='color:#117777;text-shadow:0 0 10px'>"+format(this.cost(),0)+"</span> 转生宝石<br>当前数量：<span style='color:#117777;text-shadow:0 0 10px'>"+format(getBuyableAmount("li",13),0)+"</span>"},
            canAfford() { return player.be.prestiGems.gte(this.cost())},
            buy() {
                let oldTotal = layers.li.totalResearchPoints();
                player.be.prestiGems = player.be.prestiGems.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
                let newTotal = layers.li.totalResearchPoints();
                player.li.researchPoint = player.li.researchPoint.add(newTotal.sub(oldTotal));
            },
            unlocked(){return hasUpgrade("be",13)},
            style() { return { 'background-color': this.canAfford()?"#3FFFFF":"#BF8F8F"}},
        },
        14:{
            title: "光研究点",
            cost(x) {
                let a = four.pow(x.add(0.5))
                return a
            },
            display() { return "价格: <span style='color:#337733;text-shadow:0 0 10px'>"+format(this.cost(),0)+"</span> 光波<br>当前数量：<span style='color:#337733;text-shadow:0 0 10px'>"+format(getBuyableAmount("li",14),0)+"</span>"},
            canAfford() { return player.p.waves.gte(this.cost())},
            buy() {
                let oldTotal = layers.li.totalResearchPoints();
                player.p.waves = player.p.waves.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
                let newTotal = layers.li.totalResearchPoints();
                player.li.researchPoint = player.li.researchPoint.add(newTotal.sub(oldTotal));
            },
            unlocked(){return hasUpgrade("p",81)},
            style() { return { 'background-color': this.canAfford()?"#7FFF7F":"#BF8F8F"}},
        },
        31:{
            title: "电容增幅",
            cost(x) {
                let a = four.pow(x.add(3))
                return a
            },
            display() { return "加成电能上限。<br>价格：" + format(this.cost()) + "电能<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限数量：" + format(this.purchaseLimit())},
            effect(x){
                let eff = x.add(1).pow(2)
                return eff
            },
            canAfford() { return player.li.currentElectricity.gte(this.cost())},
            buy() {
                player.li.currentElectricity = player.li.currentElectricity.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                if (hasUpgrade("p", 82)) {
                    return new Decimal(Infinity);
                }
                return new Decimal(40);
            },
            unlocked(){return hasUpgrade("li",52)},
        },
    },
    clickables:{
        11:{
            title() {return player.li.confirmRespec?"如果你确定重新分配锂研究点，请再次点击（5秒后自动取消）":"点击两次（防手滑）此按钮以重新分配锂研究点，但同时使电量清零"},
            unlocked() {return hasMilestone("be",1)},
            canClick() {return true},
            onClick() {
                if (player.li.confirmRespec) {
                    player.li.currentElectricity = zero;
                    player.li.confirmRespec = false;
                    
                    let U = [31,32,41,42,51,52,61,62,71,72,81,82,91,92,101,102,103,104];
                    for (let id in U) {
                        if (hasUpgrade("li", U[id])) {
                            player.li.upgrades.splice(player.li.upgrades.indexOf(U[id]), 1);
                        }
                    }
                    
                    player.li.researchPoint = layers.li.totalResearchPoints();
                    
                } else {
                    player.li.confirmRespec = true;
                    player.li.confirmTime = player.li.resetTime;
                }
            },
            style() { return { 'background-color': player.li.confirmRespec?"#FFFFFF":"#BFBFBF" } },
        },
    },
    bars:{
        battery1: {
            direction: UP,
            width: 80,
            height: 200,
            fillStyle: {'background-color' : "#888888"},
            display(){
                return "锂电池<br>" + format(player.li.currentElectricity) + " / " + format(layers.li.getElectricityCap()) + "<br> ( " + format(this.progress().mul(100),1) + " %)"
            },
            req(){ return layers.li.getElectricityCap()},
            progress() {
                let estimatedProgress = player.li.currentElectricity.div(this.req())
                return estimatedProgress
            },
            unlocked(){return hasMilestone("be",1)},
        },
    },
    milestones:{
        1:{
            requirementDescription: "1 锂 & 锂原子",
            effectDescription: "自动重置氦，并让氦不再重置任何东西。",
            done(){return player.li.points.gte(1)&&hasUpgrade("li",11)},
            unlocked(){return player.li.unlocked},
        },
        2:{
            requirementDescription: "2 锂",
            effectDescription: "爆炸氢气球的时间始终为最大值。",
            done(){return player.li.points.gte(2)&&this.unlocked()},
            unlocked(){return hasMilestone("li",1)},
        },
        3:{
            requirementDescription: "3 锂",
            effectDescription: "自动购买氢升级，并自动获取重置时的 1% 氢 /s。",
            done(){return player.li.points.gte(3)},
            unlocked(){return hasMilestone("li",2)},
        },
        4:{
            requirementDescription: "4 锂",
            effectDescription: "最大重置氦，并自动购买氦升级。",
            done(){return player.li.points.gte(4)},
            unlocked(){return hasMilestone("li",3)},
        },
        5:{
            requirementDescription: "5 锂",
            effectDescription: "爆炸氦气球的时间始终为最大值，并解锁更多氦层内容。",
            done(){return player.li.points.gte(5)},
            unlocked(){return hasMilestone("li",4)},
        },
        6:{
            requirementDescription: "6 锂",
            effectDescription: "自动获取转化时的 10% 氢能 /s，并免费自动获取气球。", 
            done(){return player.li.points.gte(6)},
            unlocked(){return hasMilestone("li",5)},
        },
        7:{
            requirementDescription: "7 锂",
            effectDescription: "免费自动获取氦气球，且自动购买氦层可购买，并解锁锂的第四个效果。",
            done(){return player.li.points.gte(7)},
            unlocked(){return hasMilestone("li",6)},
        },
        8:{
            requirementDescription: "8 锂",
            effectDescription: "且自动获取重置时的 100% 氢 /s，并解锁温度点升级。",
            done(){return player.li.points.gte(8)},
            unlocked(){return hasMilestone("li",7)},
        },
        9:{
            requirementDescription: "9 锂",
            effectDescription: "优化锂的第四个效果的公式。",
            done(){return player.li.points.gte(9)},
            unlocked(){return hasMilestone("li",8)},
        },
        10:{
            requirementDescription: "10 锂",
            effectDescription: "自动购买前两个粒子加速器。",
            done(){return player.li.points.gte(10)},
            unlocked(){return hasMilestone("li",9)},
        },
        11:{
            requirementDescription: "11 锂",
            effectDescription: "解锁更多中微子升级。",
            done(){return player.li.points.gte(11)},
            unlocked(){return hasMilestone("li",10)},
        },
        12:{
            requirementDescription: "12 锂",
            effectDescription: "自动获取点击时的 100% 温度点 /s。",
            done(){return player.li.points.gte(12)},
            unlocked(){return hasMilestone("li",11)},
        },
    },
    //rainbow
    magic(){
        let random = player.li.resetTime % 2
        if     (random<0.2)return "0F7F7F"
        else if(random<0.4)return "0F8F9F"
        else if(random<0.6)return "1F9FAF"
        else if(random<0.8)return "1FAFBF"
        else if(random < 1)return "2FAFCF"
        else if(random<1.2)return "1F9FBF"
        else if(random<1.4)return "1F7FAF"
        else if(random<1.6)return "1F6F9F"
        else if(random<1.8)return "0F6F8F"
        else return "0F7F8F"
    },
    rainbow(speed=1){
        let random = (player.li.resetTime/2*speed) % 0.49
        if     (random<0.07)return "FF0000"
        else if(random<0.14)return "FF7F00"
        else if(random<0.21)return "FFFF00"
        else if(random<0.28)return "00FF00"
        else if(random<0.35)return "00FFFF"
        else if(random<0.42)return "3F3FFF"
        else return "FF00FF"
    },
    LiboostH(){//锂加氢
        let mult = player.li.points
        if (!hasUpgrade("li",23)) mult = mult.add(1).pow(2).add(1)
        if (hasUpgrade("li",23)) mult = mult.add(1).pow(6).add(1)
        return mult
    }, 
    LiboostHpower(){//锂加氢能
        let mult = player.li.points
        if (!hasUpgrade("li",23)) mult = mult.add(1)
        if (hasUpgrade("li",23)) mult = mult.add(1).pow(4.5).add(1)
        return mult
    }, 
    LidivHecost(){//锂减氦价格
        let divt = player.li.points
        if (!hasUpgrade("li",23)) divt = divt.add(1).pow(1.5).add(1)
        if (hasUpgrade("li",23)) divt = divt.add(1).pow(10).add(1)
        return divt
    },
    LiboostTemPoint() {
        if (hasUpgrade('c', 12)) {
            return player.li.points.pow(player.li.points);
        }
        let mult = five.pow(player.li.points.sub(6).max(0));
        if (hasMilestone('li', 9)) mult = ten.pow(player.li.points.sub(6).max(0));
        return mult;
    },
    LiboostPoints(){//锂加中微子
        let mult = player.li.points
        if (!hasUpgrade("li",23)) mult = mult.add(1).pow(2.5).add(1)
        if (hasUpgrade("li",23)) mult = mult.add(1).pow(8).add(1)
        return mult
    },
    LiboostElectrons(){//锂加电子
        let mult = player.li.points
        if (!hasUpgrade("li",23)) mult = mult.add(1).pow(0.5).add(1)
        if (hasUpgrade("li",23)) mult = mult.add(1).pow(2).add(1)
        return mult
    },
    LiboostBe(){//锂加铍
        let mult = player.li.points
        if (!hasUpgrade("li",23)) mult = mult.add(1).pow(0.1).add(1)
        if (hasUpgrade("li",23)) mult = mult.add(1).pow(3).add(1)
        return mult
    },
    LiboostCap(){//锂加电能上限
        let mult = player.li.points.add(2)
        return mult
    },    
    LiboostPhotons(){//锂加光子
        let mult = player.li.points.add(1).pow(0.5).add(1).floor()
        return mult
    },
    getElectricityCap(){//获取电量上限
        let capacity = new Decimal(100);
        if (hasUpgrade("p", 84)) capacity = capacity.mul(getBuyableAmount("c", 11).add(1));
        if(hasMilestone("he",11)) capacity = capacity.mul(layers.he.temPointEffect7());
        if(hasUpgrade("h",25)) capacity = capacity.mul(upgradeEffect("h",25));
        if(hasUpgrade("he",62)) capacity = capacity.mul(upgradeEffect("he",62));
        if(hasUpgrade("li",52)) capacity = capacity.mul(upgradeEffect("li",52));
        if(getBuyableAmount("li",31)) capacity = capacity.mul(buyableEffect("li",31));
        if(hasAchievement('a',23)) capacity = capacity.mul(achievementEffect('a',14));
        if(hasUpgrade("be",24)) capacity = capacity.mul(upgradeEffect("be",24));
        if(hasUpgrade("b",31)) capacity = capacity.mul(upgradeEffect("b",31));
        if(hasUpgrade("li",22)) capacity = capacity.mul(layers.li.LiboostCap());
        if(player.b.inBorane) capacity = capacity.pow(0.66686);
        if(player.c.inExtract) capacity = capacity.pow(0.666)
        return capacity
    },
    canGainElectricity(){
        return player.h.power.gte(1e60) && player.li.hPowerConsumingPercentage > 0
    },
    electricityGain(){//获取每秒的电量加成
        if(!layers.li.canGainElectricity()) return zero
        let gain = player.h.power.mul(player.li.hPowerConsumingPercentage).div(1e60).add(1).pow(0.25).add(1)
        if(hasUpgrade("li",52)) gain = gain.mul(upgradeEffect("li",52))
        if(hasUpgrade("li",41)) gain = gain.mul(upgradeEffect("li",41))
        if(hasUpgrade("h",35)) gain = gain.mul(upgradeEffect("h",25))
        return gain
    },
    researchPointMax() {
        return layers.li.totalResearchPoints();
    },
    totalResearchPoints() {
        let li = getBuyableAmount("li", 11);
        let dian = getBuyableAmount("li", 12);
        let shi = getBuyableAmount("li", 13);
        let guang = getBuyableAmount("li", 14);
            let base;
        if (hasUpgrade("li", 62)) {
            // 乘算模式：所有研究点相乘
            base = li.mul(dian).mul(shi).mul(guang);
        } else {
            // 加算模式：所有研究点相加
            base = li.add(dian).add(shi).add(guang);
        }
        let extra = zero;
        return base.add(extra);
    },
    update(diff){
        if(player.li.resetTime - player.li.confirmTime > 5) player.li.confirmRespec = false
        if(layers.li.canGainElectricity()){
            player.li.currentElectricity = player.li.currentElectricity.add(layers.li.electricityGain().mul(diff)).min(layers.li.getElectricityCap())
            let consume = player.h.power.mul(player.li.hPowerConsumingPercentage).div(100);
            player.h.power = player.h.power.sub(consume).max(0);   
        }
        if(player.li.currentElectricity.gt(0)){
        let lossRate = 0.005;
        if (hasAchievement('a', 23)) lossRate = 0.001;
        player.li.currentElectricity = player.li.currentElectricity.sub(layers.li.getElectricityCap().mul(lossRate).mul(diff)).max(0)
        }
    },
    tabFormat:{
        "主页": {   
            content: [
                "main-display",
                "prestige-button",   
                ["display-text",
                    function(){return "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.points)+"</span> 氢"}],
                ["display-text",
                    function(){
                        let a = "你的锂加成氢获取 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(layers.li.LiboostH())+"</span>x 加成氢能获取 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(layers.li.LiboostHpower())+"</span>x 降低氦价格 / <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(layers.li.LidivHecost())+"</span>"
                        if (hasMilestone("li",6)) a = a + "<br>加成温度点获取 <span style='color:#FFDA00;text-shadow:0 0 10px'>"+format(layers.li.LiboostTemPoint())+"</span>x"
                        if (hasUpgrade("li",13)) a = a + " 加成中微子获取 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(layers.li.LiboostPoints())+"</span>x"
                        if (hasUpgrade("li",14)) a = a + " 加成电子获取 <span style='color:#3F3FFF;text-shadow:0 0 10px'>"+format(layers.li.LiboostElectrons())+"</span>x"
                        if (hasUpgrade("b",43)) a = a + " <br>加成铍获取 <span style='color:#55CC77;text-shadow:0 0 10px'>"+format(layers.li.LiboostBe())+"</span>x"
                        if (hasUpgrade("li",22)) a = a + " 加成电能上限 <span style='color:#DDDD33;text-shadow:0 0 10px'>"+format(layers.li.LiboostCap())+"</span>x"
                        if (hasUpgrade("li",24)) a = a + " 加成光子获取 <span style='color:#FFFF7F;text-shadow:0 0 10px'>"+format(layers.li.LiboostPhotons())+"</span>x"
                        return a
                }],
                ["upgrades",[1,2]],
                "blank"
            ],
            unlocked(){return player.li.unlocked}
        },
        "锂程碑": {
            content: [
                "main-display",
                "prestige-button",
                "milestones"
            ],
            unlocked(){return player.li.unlocked}
        },
        "电池": {
            content: [
                "main-display",
                "prestige-button",
                
                ["display-text", function() {return "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.power)+"</span> 氢能，每秒生产 <span style='color:#DDDD33;text-shadow:0 0 10px'>"+format(layers.li.electricityGain())+"</span> 电能（至少需要 1e60 氢能）"}],
                ["display-text", function() {
                    return "由于存储技术不完善，电池每秒流失上限 " + (hasAchievement('a', 23) ? "0.1" : "0.5") + " % 的电能！";
                }],
                ["bar","battery1"],
                ["display-text", "以下滑条选择每秒将氢能转化为电能的 % 数！"],["slider", ["hPowerConsumingPercentage", 0, 10]],
                ["buyables",[3]],
            ],
            unlocked(){return player.be.unlocked}
        },
        "研究": {
            content: [
                "main-display",
                "prestige-button",
                ["buyables",[1]],["display-text", function(){return "你有 <span style='color:#CC0033;text-shadow:0 0 10px'>"+format(player.li.researchPoint)+"</span> 研究点"}],
                ["upgrades",[3,4,5,6,7,8,9,10]],
                "clickables"
            ],
            unlocked(){return hasUpgrade("li",21)}
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3F1F1F)",
        minHeight: "100vh"
    },
})
//
//
//
//
////////      //////
//      //  //      //
//      //  //////////
//      //  //
////////      ////////
addLayer("be", {
    name: "be",
    symbol: "Be",
    position: 1, 
    startData() { return {
        unlocked: false,
        points: zero,
        prestiGems: zero,
    }},
    branches: ["he"],
    color: "#55CC77",
    requires: new Decimal(444),
    resource: "铍",
    baseResource: "氦",
    baseAmount() {return player.he.points},
    type: "normal", 
    exponent: 25,
    gainMult() {
        mult = one
        if(hasUpgrade("b",43)) mult = mult.mul(layers.li.LiboostBe())
        if(hasMilestone("he",10)) mult = mult.mul(layers.he.temPointEffect6().add(1))
        if(hasUpgrade('be', 23)) mult = mult.mul(upgradeEffect('be', 23))
        if(hasUpgrade('b', 13)) mult = mult.mul(upgradeEffect('b', 13))
        if(hasAchievement('a', 24)) mult = mult.mul(achievementEffect('a', 24))
        return mult
    },
    gainExp() {
        exp = one
        if(player.b.inBorane) exp = exp.mul(0.66686)
        if(player.c.inExtract) exp = exp.mul(0.666)
        return exp
    },
    row: 1,
    layerShown(){return player.be.unlocked||hasMilestone("he",7)},
    passiveGeneration(){
        let a = zero
        if(hasUpgrade("be",11)) a = one
        return a
    },
    resetsNothing() {return hasMilestone("li",1)},
    hotkeys: [
        {key: "b", description: "B: 进行一次铍重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    // ========== 新增升级 ==========
    upgrades: {
        11: {
            title: "铍自动化",
            description: "自动获取重置时的 100% 铍 /s。",
            cost: new Decimal(20),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return (player.be.prestiGems && player.be.prestiGems.gte(10))||hasUpgrade("be",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
        12: {
            title: "卓越电子",
            description: "自动获取转化时的 100% 电子 /s。",
            cost: new Decimal(30),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("be",11)||hasUpgrade("be",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
        13: {
            title: "绿石科技",
            description: "解锁石研究点，且研究点加成中微子与氢获取。",
            cost: new Decimal(40),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            effect() {
                if (hasUpgrade("li", 71)) {
                    return layers.li.totalResearchPoints().add(1);
                } else {
                    return player.li.researchPoint.add(1);
                }
            },
            effectDisplay() { return "x" + format(this.effect()); },
            unlocked() { return hasUpgrade("be", 12) || hasUpgrade("be", [this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
            return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
        14: {
            title: "平行回归",
            description: "解锁新的锂研究。",
            cost: new Decimal(60),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("be",13)||hasUpgrade("be",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
        21: {
            title: "中子源的命运",
            description: "铍加成中微子。",
            effect() {
                let eff = player.be.points.add(1).pow(0.4).add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(70),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("p",75)||hasUpgrade("be",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
        22: {
            title: "强子化",
            description: "铍加成氢。",
            effect() {
                let eff = player.be.points.add(1).pow(0.3).add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(80),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("be",21)||hasUpgrade("be",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
        23: {
            title: "大型铍墙",
            description: "铍加成自身。",
            effect() {
                let eff = player.be.points.add(1).pow(0.2).add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(90),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("be",22)||hasUpgrade("be",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
        24: {
            title: "金属同质化",
            description: "铍加成电能上限。",
            effect() {
                let eff = player.be.points.add(1).pow(0.1).add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(100),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("be",23)||hasUpgrade("be",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFFFF'};
                } else {
                    return {};
                }
            }
        },
    },
    milestones:{
        1:{
            requirementDescription: "1 铍",
            effectDescription: "解锁新的锂层内容，且氦与锂的价格 / 2。",
            done(){return player.be.points.gte(1)},
            unlocked(){return true},
        },
        2:{
            requirementDescription: "100 铍",
            effectDescription: "自动且最大重置锂。",
            done(){return player.be.points.gte(100)},
            unlocked(){return true},
        },
        3:{
            requirementDescription: "1000 铍",
            effectDescription: "解锁新的锂研究，和氢与温度点的升级。",
            done(){return player.be.points.gte(1000)},
            unlocked(){return hasMilestone("be",1)},
        }
    },
    update(diff) {
        if (hasUpgrade("be", 12)) {
            let gain = player.points.add(1).log2().add(1).log2().add(1).floor();

            if (hasUpgrade('li',14) && typeof layers.li.LiboostElectrons === 'function') {
                gain = gain.mul(layers.li.LiboostElectrons()).floor();
            }

            if (hasUpgrade('p',71)) gain = gain.mul(upgradeEffect("p",71)).floor();
            if (hasUpgrade('li',81)) gain = gain.mul(upgradeEffect("li",81)).floor();
            if (hasUpgrade('b',51)) gain = gain.mul(upgradeEffect("b",51)).floor();
            if (hasUpgrade('c', 23)) gain = gain.mul(upgradeEffect("c",23)).floor();
            if (hasAchievement('a',35)) gain = gain.mul(achievementEffect("a",35)).floor();
            if (hasMilestone('c', 1)) gain = gain.mul(player.c.entropy.pow(player.c.oil).add(1).log2().add(1)).floor();
            if(player.b.inBorane) gain = gain.pow(0.66686).floor();
            if(player.c.inExtract) gain = gain.pow(0.666).floor();
            
            if (gain.gt(0)) {
                player.p.electrons = player.p.electrons.add(gain.mul(diff));
            }
        }
    },
    clickables: {
        21: {
            title: "转生",
            display() {
                let gain = player.be.points.add(1).ln().add(1).floor();
                if(hasUpgrade("p",83)) gain = gain.mul(player.be.points.add(1).log10().add(1).floor());
                if(player.b.inBorane) gain = gain.pow(0.66686);
                if(player.c.inExtract) gain = gain.pow(0.666);
                return "重置中微子、电子、氢、氢能、气球、氦、氦气球、温度点、锂、电能、铍。<br>获得 <span style='color:#117777;text-shadow:0 0 10px'>" + format(gain) + "</span> 转生宝石。（至少需要 1e10 铍）";
            },
            unlocked() { return hasUpgrade("p",65); },
            canClick() { return player.be.points.gt(1e10); },
            onClick() {
                let gain = player.be.points.add(1).ln().add(1).floor();
                if(hasUpgrade("p",83)) gain = gain.mul(player.be.points.add(1).log10().add(1).floor());
                if(player.b.inBorane) gain = gain.pow(0.66686);
                if(player.c.inExtract) gain = gain.pow(0.666);

                player.points = zero;
                player.p.electrons = zero;
                player.h.points = zero;
                player.h.power = zero;
                player.h.balloon = zero;
                player.he.points = zero;
                player.he.balloon = zero;
                player.he.temPoint = zero;
                player.li.points = zero;
                player.li.currentElectricity = zero;
                player.be.points = zero;
                player.be.prestiGems = player.be.prestiGems.add(gain);
                needCanvasUpdate = true;
            },
            style() {
                return {
                    'background-color': this.canClick() ? "#3FFFFF" : "#BF8F8F",
                };
            }
        }
    },
    prestiGemsGet() {
        let gain = player.be.points.add(1).ln().add(1).floor();
        if(hasUpgrade("p",83)) gain = gain.mul(player.be.points.add(1).log10().add(1).floor());
        if(player.b.inBorane) gain = gain.pow(0.66686);
        return gain;
    },
    tabFormat:{
        "主页": {   
            content: [
                "main-display","prestige-button",   
                ["display-text",
                    function(){return "你有 <span style='color:#FFBBCC;text-shadow:0 0 10px'>"+format(player.he.points)+"</span> 氦"}],
                "milestones"
            ],
            unlocked(){return player.be.unlocked}
        },
        "转生宝石": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function(){ 
                    return "你有 <span style='color:#3FFFFF;text-shadow:0 0 10px'>" + format(player.be.prestiGems) + "</span> 转生宝石";
                }],
                "clickables",
                "upgrades"
            ],
            unlocked(){ return hasUpgrade("p",65); },
            buttonStyle: {'border-color': '#3FFFFF'},
            style: {
                background: "",
            }
        }
    },
    style: {
        background: "linear-gradient(135deg, #000000, #1F3F1F)",
        minHeight: "100vh"
    },
},)
/*
|||||\\\\\
|||||    \\
|||||     \\
|||||      ||
|||||     //
|||||    //
|||||====
|||||    \\
|||||     \\
|||||      ||
|||||     //
|||||    //
|||||/////

L:good
Note: Periodic Elements Incremental Tree is a completely free incremental game based on The-Modding-Tree Engine. Visit banana3864.github.io/PEIT for the latest & official game. If you are not playing on this website, please go to the official website above. Author: Liuliu66686(main) & Banana3864
*/
addLayer("b", {
    name: "b",
    symbol: "B",
    position: 1, 
    startData() { return {
        unlocked: false,
        points: zero,
        inBorane: false,
        borane1: zero,
        borane2: zero,
        borane3: zero,
        borane4: zero,
        borane5: zero,
        gainBorane: [],
        boraneGainFloorN: zero,
        transcendCrystals: zero,
    }},
    branches: ["he"],
    color: "#992222",
    requires: new Decimal(1e85),
    resource: "硼",
    baseResource: "温度点",
    baseAmount() {return player.he.temPoint},
    type: "static", 
    exponent() {
        let exp = 3;
        if (hasAchievement('a', 32)) {
            exp -= achievementEffect('a',32);
        }
        return exp
    },
    gainMult() {
        mult = one
        if(hasUpgrade("b",11)) mult = mult.div(upgradeEffect("b",11))
        if(hasUpgrade("b",14)) mult = mult.div(upgradeEffect("b",14))
        if(hasUpgrade("b",42)) mult = mult.div(upgradeEffect("b",42))
        if(hasUpgrade("li",91)) mult = mult.div(upgradeEffect("li",91))
        if(hasAchievement('a', 31)) mult = mult.div(achievementEffect('a',31))
        return mult
    },
    gainExp() {
        exp = one
        return exp
    },
    row: 2,
    layerShown() { return player.b.unlocked||hasAchievement("a",25); },
    resetsNothing() { return hasMilestone("b",3); },
    canBuyMax() { return hasMilestone("b", 8); }, 
    autoPrestige() { return hasMilestone("b", 9); },
    hotkeys: [
        {key: "shift+b", description: "Shift+B: 进行一次硼重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    // ========== 新增 doReset（保留里程碑） ==========
    doReset: function() {
        if (!player[this.layer] || !tmp[this.layer]) return;
        if (!canReset(this.layer)) return;

        let skipReset = run(this.resetsNothing, this);

        // ---------- 安全备份（仅当需要重置时） ----------
        let backup = null;
        if (!skipReset) {
            backup = {};
            for (let layer in player) {
                if (player[layer] && typeof player[layer] === 'object') {
                    backup[layer] = {
                        milestones: Array.isArray(player[layer].milestones) ? player[layer].milestones.slice() : [],
                        achievements: Array.isArray(player[layer].achievements) ? player[layer].achievements.slice() : []
                    };
                }
            }
        }
    
        let gain = tmp[this.layer].resetGain || new Decimal(0);
        if (this.onPrestige) run(this.onPrestige, this, gain);
        addPoints(this.layer, gain);
        tmp[this.layer].baseAmount = decimalZero;

        if (skipReset) {
            updateTemp();
            updateTemp();
            return;
        }

        // ---------- 以下为正常重置逻辑（仅当 skipReset 为 false 时执行） ----------
        let row = this.row;
        for (let layerResetting in layers) {
            if (row >= layers[layerResetting].row) {
                completeChallenge(layerResetting);
            }
        }

        player.points = getStartPoints();

        let keep = ['milestones', 'achievements'];
        for (let x = 0; x <= maxRow; x++) {
            for (let lr in ROW_LAYERS[x]) {
                if (lr !== this.layer) layerDataReset(lr, keep);
            }
        }
        for (let r in OTHER_LAYERS) {
            for (let lr in OTHER_LAYERS[r]) {
                if (lr !== this.layer) layerDataReset(lr, keep);
            }
        }

        player[this.layer].resetTime = 0;

        if (backup) {
            for (let layer in backup) {
                if (player[layer]) {
                    if (backup[layer].milestones) {
                        player[layer].milestones = backup[layer].milestones;
                    }
                    if (backup[layer].achievements) {
                        player[layer].achievements = backup[layer].achievements;
                    }
                }
            }
        }

        updateTemp();
        updateTemp();
    },
    milestones:{
        1:{
            requirementDescription: "1 硼",
            effectDescription: "第三行重置不重置里程碑，并自动获取转生时的 100% 转生宝石 /s。",
            done(){return player.b.points.gte(1)},
            unlocked(){return player.b.unlocked},
        },
        2:{
            requirementDescription: "2 硼",
            effectDescription: "自动点击提升冷却氦，并解锁新的温度点升级。",
            done(){return player.b.points.gte(2)},
            unlocked(){return hasMilestone("b",1)},
        },
        3:{
            requirementDescription: "3 硼",
            effectDescription: "解锁硼烷，并让第三行不再重置任何东西。",
            done(){return player.b.points.gte(3)},
            unlocked(){return hasMilestone("b",2)},
        },
        4:{
            requirementDescription: "4 硼",
            effectDescription: "自动购买 粒子加速器|相织，并解锁一种新的硼烷。",
            done(){return player.b.points.gte(4)},
            unlocked(){return hasMilestone("b",3)},
        },
        5:{
            requirementDescription: "5 硼",
            effectDescription: "解锁一种新的硼烷。",
            done(){return player.b.points.gte(5)},
            unlocked(){return hasMilestone("b",4)},
        },
        6:{
            requirementDescription: "6 硼",
            effectDescription: "解锁一种新的硼烷。",
            done(){return player.b.points.gte(6)},
            unlocked(){return hasMilestone("b",5)},
        },
        7:{
            requirementDescription: "7 硼",
            effectDescription: "解锁一种新的硼烷。",
            done(){return player.b.points.gte(7)},
            unlocked(){return hasMilestone("b",6)},
        },
        8:{
            requirementDescription: "13 硼",
            effectDescription: "最大获取硼。",
            done(){return player.b.points.gte(13)},
            unlocked(){return hasMilestone("b",7)},
        },
        9:{
            requirementDescription: "15 硼",
            effectDescription: "自动获取硼。",
            done(){return player.b.points.gte(15)},
            unlocked(){return hasMilestone("b",8)},
        },
    },
    upgrades:{
        11:{
            title:"癸硼烷助力硼",
            description:"癸硼烷降低硼价格。",
            effect(){
                let effect = player.b.borane1
                return effect
            },
            effectDisplay(){return "/"+format(this.effect())},
            cost: new Decimal(3000),
            unlocked(){return player.b.unlocked},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF3F3F'};
                } else {
                    return {};
                }
            }
        },
        12:{
            title:"癸硼烷助力锂",
            description:"癸硼烷降低锂价格。",
            effect(){
                let effect = player.b.borane1.add(1).pow(1.1).add(1)
                return effect
            },
            effectDisplay(){return "/"+format(this.effect())},
            cost: new Decimal(27000),
            unlocked(){return hasUpgrade("b",21)},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF3F3F'};
                } else {
                    return {};
                }
            }
        },
        13:{
            title:"癸硼烷助力铍",
            description:"癸硼烷加成铍。",
            effect(){
                let effect = player.b.borane1.add(1).pow(0.9).add(1)
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(270000),
            unlocked(){return hasUpgrade("b",22)},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF3F3F'};
                } else {
                    return {};
                }
            }
        },
        14:{
            title:"癸硼烷推进硼",
            description:"铍降低硼价格。",
            effect(){
                let effect = player.be.points.add(1).pow(0.7).add(1)
                return effect
            },
            effectDisplay(){return "/"+format(this.effect())},
            cost: new Decimal(1700000),
            unlocked(){return hasUpgrade("b",23)},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF3F3F'};
                } else {
                    return {};
                }
            }
        },
        15:{
            title:"癸硼烷终极升级",
            description:"解锁新层级。",
            cost: new Decimal(3000000),
            unlocked(){return hasUpgrade("b",24)},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF3F3F'};
                } else {
                    return {};
                }
            }
        },
        21:{
            title:"己硼烷助力冷却",
            description:"己硼烷加成温度点。",
            effect(){
                let effect = player.b.borane2
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(300),
            unlocked(){return hasMilestone("b",4)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F3F'};
                } else {
                    return {};
                }
            }
        },
        22:{
            title:"己硼烷提升冷却",
            description:"己硼烷加成提升冷却氦时间。",
            effect(){
                let effect = player.b.borane2.add(1).log2().add(1)
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(600),
            unlocked(){return hasUpgrade("b",21)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F3F'};
                } else {
                    return {};
                }
            }
        },
        23:{
            title:"己硼烷瓦解软上限",
            description:"移除 温度点效果|句芒 的软上限。",
            cost: new Decimal(1000),
            unlocked(){return hasUpgrade("b",32)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F3F'};
                } else {
                    return {};
                }
            }
        },
        24:{
            title:"己硼烷助力氦",
            description:"己硼烷降低氦价格，并可以同时生产至多 2 种硼烷。",
            effect(){
                let effect = player.b.borane2.add(1).pow(0.9).add(1)
                return effect
            },
            effectDisplay(){return "/"+format(this.effect())},
            cost: new Decimal(2100),
            unlocked(){return hasUpgrade("b",33)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F3F'};
                } else {
                    return {};
                }
            }
        },
        25:{
            title:"己硼烷终极升级",
            description:"制取时重置硼，但结束制取时，硼加成硼烷产能。",
            effect(){
                let effect = player.b.points.add(2)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(5000),
            unlocked(){return hasUpgrade("b",61)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FF7F3F'};
                } else {
                    return {};
                }
            }
        },
        31:{
            title:"戊硼烷助力电能",
            description:"戊硼烷加成电能上限。",
            effect(){
                let effect = player.b.borane3.add(1).log2().add(1)
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(300),
            unlocked(){return hasMilestone("b",5)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FFFF3F'};
                } else {
                    return {};
                }
            }
        },
        32:{
            title:"戊硼烷助力中微子",
            description:"戊硼烷加成中微子。",
            effect(){
                let effect = player.b.borane3
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(600),
            unlocked(){return hasUpgrade("b",41)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FFFF3F'};
                } else {
                    return {};
                }
            }
        },
        33:{
            title:"戊硼烷助力氢能",
            description:"戊硼烷加成氢能。",
            effect(){
                let effect = player.b.borane3.add(1).pow(0.9).add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(1000),
            unlocked(){return hasUpgrade("b",42)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",   
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FFFF3F'};
                } else {
                    return {};
                }
            }
        },
        34:{
            title:"戊硼烷助力熵",
            description:"戊硼烷加成熵。",
            effect(){
                let effect = player.b.borane3.add(1).ln().add(1).floor()
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(2100),
            unlocked(){return hasUpgrade("b",62)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",   
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FFFF3F'};
                } else {
                    return {};
                }
            }
        },
        35:{
            title:"戊硼烷终极升级",
            description:"铍加成硼烷产能。",
            effect(){
                let effect = player.be.points.add(1).ln().add(1);
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(5000),
            unlocked(){return hasUpgrade("b",34)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",   
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#FFFF3F'};
                } else {
                    return {};
                }
            }
        },
        41:{
            title:"丁硼烷助力转生",
            description:"转生宝石加成中微子、氢、温度点获取。",
            effect(){
                let effect = player.be.prestiGems.add(1)
                return effect
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(300),
            unlocked(){return hasMilestone("b",6)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFF3F'};
                } else {
                    return {};
                }
            }
        },
        42:{
            title:"丁硼烷助力宝石",
            description:"转生宝石降低氦、锂、硼的价格。",
            effect(){
                let effect = player.be.prestiGems.add(1).pow(1.1).add(1)
                return effect
            },
            effectDisplay(){return "/"+format(this.effect())},
            cost: new Decimal(600),
            unlocked(){return hasUpgrade("b",51)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFF3F'};
                } else {
                    return {};
                }
            }
        },
        43:{
            title:"丁硼烷解放锂",
            description:"解锁锂的第七个效果。",
            cost: new Decimal(1000),
            unlocked(){return hasUpgrade("b",63)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFF3F'};
                } else {
                    return {};
                }
            }
        },
        44:{
            title:"丁硼烷助力碳",
            description:"丁硼烷加成碳。",
            cost: new Decimal(2100),
            effect(){
                let effect = player.b.borane4.add(1).pow(1.1).add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("b",43)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFF3F'};
                } else {
                    return {};
                }
            }
        },
        45:{
            title:"丁硼烷终极升级",
            description:"碳加成硼烷产能。",
            cost: new Decimal(5000),
            effect(){
                let effect = player.c.points.add(1).log2().add(1).log2().add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("b",43)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3FFF3F'};
                } else {
                    return {};
                }
            }
        },
        51:{
            title:"乙硼烷助力电子",
            description:" 乙硼烷加成电子获取。",
            effect(){
                let effect = player.b.borane5.add(1).log2().add(1).floor()
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(300),
            unlocked(){return hasMilestone("b",7)},
            currencyDisplayName:"乙硼烷",
            currencyInternalName:"borane5",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        52:{
            title:"乙硼烷还原 I",
            description:"优化己硼烷的公式。",
            cost: new Decimal(600),
            unlocked(){return hasUpgrade("b",64)},
            currencyDisplayName:"乙硼烷",
            currencyInternalName:"borane5",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        53:{
            title:"乙硼烷还原 II",
            description:"优化戊硼烷的公式。",
            cost: new Decimal(1000),
            unlocked(){return hasUpgrade("b",52)},
            currencyDisplayName:"乙硼烷",
            currencyInternalName:"borane5",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        54:{
            title:"乙硼烷还原 III",
            description:"优化丁硼烷的公式。",
            cost: new Decimal(2100),
            unlocked(){return hasUpgrade("b",53)},
            currencyDisplayName:"乙硼烷",
            currencyInternalName:"borane5",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        55:{
            title:"乙硼烷终极还原",
            description:"优化乙硼烷的公式，并解锁光子。",
            cost: new Decimal(5000),
            unlocked(){return hasUpgrade("b",54)},
            currencyDisplayName:"乙硼烷",
            currencyInternalName:"borane5",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#3F3FFF'};
                } else {
                    return {};
                }
            }
        },
        61:{
            title:"硼-10",
            description:"解锁完整己硼烷升级。",
            effect(){
                let effect = one
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(15),
            unlocked(){return player.b.transcendCrystals.gte(10)||hasUpgrade("b",[this.id])},
            currencyDisplayName:"超越水晶",
            currencyInternalName:"transcendCrystals",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7F3FFF'};
                } else {
                    return {};
                }
            }
        },
        62:{
            title:"硼-11",
            description:"解锁完整戊硼烷升级。",
            effect(){
                let effect = two
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(50),
            unlocked(){return hasUpgrade("b",61)&&hasUpgrade("b",25)},
            currencyDisplayName:"超越水晶",
            currencyInternalName:"transcendCrystals",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7F3FFF'};
                } else {
                    return {};
                }
            }
        },
        63:{
            title:"丙硼烷",
            description:"解锁完整丁硼烷升级。",
            effect(){
                let effect = three
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(100),
            unlocked(){return hasUpgrade("b",62)&&hasUpgrade("b",35)},
            currencyDisplayName:"超越水晶",
            currencyInternalName:"transcendCrystals",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7F3FFF'};
                } else {
                    return {};
                }
            }
        },
        64:{
            title:"甲硼烷",
            description:"解锁完整乙硼烷升级。",
            effect(){
                let effect = four
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(185),
            unlocked(){return hasUpgrade("b",63)&&hasUpgrade("b",45)},
            currencyDisplayName:"超越水晶",
            currencyInternalName:"transcendCrystals",
            currencyLayer:"b",
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#7F3FFF'};
                } else {
                    return {};
                }
            }
        },
    },
    clickables:{
        11:{
            title() {return "制取"},
            display() {
                let text = "当前状态：" + (player.b.inBorane?"进行中":"闲置") + "<br>重置转生的所有内容与转生宝石。<br>制取削弱：中微子、电子、氢、氢能、温度点、电能上限、铍、转生宝石^0.66686。<br>结束制取时，气球和温度点加成硼烷产能。<br>当前硼烷产能：<span style='color:#441111;text-shadow:0 0 10px'>"+format(player.b.boraneGainFloorN)+"</span> <br>当前效果：获得 <span style='color:#441111;text-shadow:0 0 10px'>"+format(layers.b.boraneGainFloor())+"</span> 硼烷产能<br>增加 <span style='color:#441111;text-shadow:0 0 10px'>"+format(layers.b.boraneGainFloor().sub(player.b.boraneGainFloorN).max(0))+"</span> 硼烷产能"
                return text
            },
            canClick() {return true},
            onClick() {
                if(player.b.inBorane){
                    player.b.boraneGainFloorN = layers.b.boraneGainFloor().max(player.b.boraneGainFloorN)
                    player.b.inBorane = false
                }
                else {
                    run(layers.be.clickables[21].onClick);
                    player.be.prestiGems = zero;
                    if(hasUpgrade("b",25)) player.b.points = zero;
                    player.b.inBorane = true
                }
            },
            style() { return { width: "800px" } },
        },
        12:{
            title() {return "重新选择生产硼烷"},
            display() {return "上限量：" + layers.b.chooseBoraneGainMax() + "<br>已选择：" + player.b.gainBorane.length},
            canClick() {
            const consta = [1,2,3,4,5,6]
            for (index in consta){
                if (player.b.gainBorane.includes(consta[index])) return true
            }
            return false
            },
            onClick() {
                player.b.gainBorane = []
            },
            style() { return { 'background-color': this.canClick()?"#992222":"#BF8F8F"} },
            unlocked(){return hasMilestone("b",3)},
        },
        13: {
            title() { return "超越"; },
            display() {
                let gain = player.b.boraneGainFloorN;
                if(hasMilestone('n',2)) gain = gain.mul(player.be.prestiGems);
                gain = gain.add(1).log2().add(1).floor();
                if(player.c.inExtract) gain = gain.pow(0.666);
                if (gain.lt(1)) gain = zero;
                return "重置制取的所有内容和硼、硼烷、碳、熵。<br>获得 <span style='color:#331177;text-shadow:0 0 10px'>"+format(gain)+"</span> 超越水晶。（至少需要 27000 硼烷产能）";
            },
            unlocked() { return hasUpgrade('c', 34); },
            canClick() { return player.b.boraneGainFloorN.gte(27000); },
            onClick() {
                let gain = player.b.boraneGainFloorN;
                if(hasMilestone('n',2)) gain = gain.mul(player.be.prestiGems);
                gain = gain.add(1).log2().add(1).floor();
                if(player.c.inExtract) gain = gain.pow(0.666);
                if (gain.lt(1)) gain = zero;

                run(layers.b.clickables[11].onClick);
            
                player.b.inBorane = false;
                player.b.gainBorane = [];
                player.b.boraneGainFloorN = zero;
            
                player.b.borane1 = zero;
                player.b.borane2 = zero;
                player.b.borane3 = zero;
                player.b.borane4 = zero;
                player.b.borane5 = zero;
            
                player.b.points = zero;
            
                player.c.points = zero;
                player.c.entropy = zero;
            
                player.b.transcendCrystals = player.b.transcendCrystals.add(gain);
            },
            style() { 
                return { 
                    'background-color': this.canClick() ? "#7F3FFF" : "#BF8F8F",
                    'width': '200px'
                };
            }
        },
        31:{
            title() {return "选择生产癸硼烷"},
            display(){if(player.b.gainBorane.includes(1))return "生产中"},
            canClick() {
            if (!player.b.gainBorane.includes(1)&&player.b.gainBorane.length<layers.b.chooseBoraneGainMax()) return true
            return false
            },
            onClick() {
                player.b.gainBorane.push(1)
            },
            style() { return { 'background-color': this.canClick()?"#FF3F3F":"#BF8F8F"} },
            unlocked(){return hasMilestone("b",3)},
        },
        32:{
            title() {return "选择生产己硼烷"},
            display(){if(player.b.gainBorane.includes(2))return "生产中"},
            canClick() {
            if (!player.b.gainBorane.includes(2)&&player.b.gainBorane.length<layers.b.chooseBoraneGainMax()) return true
            return false
            },
            onClick() {
                player.b.gainBorane.push(2)
            },
            style() { return { 'background-color': this.canClick()?"#FF7F3F":"#BF8F8F"} },
            unlocked(){return hasMilestone("b",4)},
        },
        33:{
            title() {return "选择生产戊硼烷"},
            display(){if(player.b.gainBorane.includes(3))return "生产中"},
            canClick() {
            if (!player.b.gainBorane.includes(3)&&player.b.gainBorane.length<layers.b.chooseBoraneGainMax()) return true
            return false
            },
            onClick() {
                player.b.gainBorane.push(3)
            },
            style() { return { 'background-color': this.canClick()?"#FFFF3F":"#BF8F8F"} },
            unlocked(){return hasMilestone("b",5)},
        },
        41:{
            title() {return "选择生产丁硼烷"},
            display(){if(player.b.gainBorane.includes(4))return "生产中"},
            canClick() {
            if (!player.b.gainBorane.includes(4)&&player.b.gainBorane.length<layers.b.chooseBoraneGainMax()) return true
            return false
            },
            onClick() {
                player.b.gainBorane.push(4)
            },
            style() { return { 'background-color': this.canClick()?"#3FFF3F":"#BF8F8F"} },
            unlocked(){return hasMilestone("b",6)},
        },
        42:{
            title() {return "选择生产乙硼烷"},
            display(){if(player.b.gainBorane.includes(5))return "生产中"},
            canClick() {
            if (!player.b.gainBorane.includes(5)&&player.b.gainBorane.length<layers.b.chooseBoraneGainMax()) return true
            return false
            },
            onClick() {
                player.b.gainBorane.push(5)
            },
            style() { return { 'background-color': this.canClick()?"#3F3FFF":"#BF8F8F"} },
            unlocked(){return hasMilestone("b",7)},
        },
    },
    boraneGainFloor(){
        let gain = zero
        if(player.b.inBorane) gain = player.h.balloon.mul(player.he.temPoint.add(1).log10().add(1))
        if(player.b.inBorane&&hasUpgrade("b",25)) gain = gain.mul(upgradeEffect("b",25))
        if(player.b.inBorane&&hasUpgrade("b",35)) gain = gain.mul(upgradeEffect("b",35))
        if(player.b.inBorane&&hasUpgrade("b",45)) gain = gain.mul(upgradeEffect("b",45))
        if(player.b.inBorane&&hasMilestone("n",2)) gain = gain.mul(player.be.prestiGems)
        if(player.b.inBorane&&hasAchievement("a",41)) gain = gain.mul(achievementEffect("a",41))
        if(hasMilestone("he",12)) gain = gain.mul(layers.he.temPointEffect8())
        if(player.c.inExtract) gain = gain.pow(0.666)
        return gain
    },
    boraneGain(num){
        let gain = one
        if(!player.b.gainBorane.includes(num)) return zero  
        if(num==1){gain = gain.mul(player.b.boraneGainFloorN)}
        if(num==2)gain = gain.mul(player.b.boraneGainFloorN.add(1).log2().add(1))
        if(num==2&&hasUpgrade("b",52))gain = gain.mul(player.b.boraneGainFloorN.add(1).mul(2).log2().add(1))
        if(num==3)gain = gain.mul(player.b.boraneGainFloorN.add(1).ln().add(1))
        if(num==3&&hasUpgrade("b",53))gain = gain.mul(player.b.boraneGainFloorN.add(1).mul(2).ln().add(1))
        if(num==4)gain = gain.mul(player.b.boraneGainFloorN.add(1).log10().add(1))
        if(num==4&&hasUpgrade("b",54))gain = gain.mul(player.b.boraneGainFloorN.add(1).mul(2).log10().add(1))
        if(num==5)gain = gain.mul(player.b.boraneGainFloorN.add(1).log2().add(1).log2().add(1))
        if(num==5&&hasUpgrade("b",55))gain = gain.mul(player.b.boraneGainFloorN.add(1).mul(2).log2().add(1).log2().add(1))
        return gain
    },
    chooseBoraneGainMax(){
        let num = 1;
        if (hasUpgrade("b", 24)) num += 1;
            return num;
    },
    update(diff){
        // ---- 全面防御性初始化 ----
            if (!player.b) {
                player.b = layers.b.startData();
                    } else {
                const defaults = layers.b.startData();
                for (let key in defaults) {
                    if (!(key in player.b) || player.b[key] === undefined) {
                        player.b[key] = defaults[key];
                    } else if (defaults[key] instanceof Decimal && !(player.b[key] instanceof Decimal)) {
                        player.b[key] = new Decimal(player.b[key] || 0);
                    }
                }
            }

        // ===== 原有更新代码 =====
        player.b.borane1 = player.b.borane1.add(layers.b.boraneGain(1).mul(diff))
        player.b.borane2 = player.b.borane2.add(layers.b.boraneGain(2).mul(diff))
        player.b.borane3 = player.b.borane3.add(layers.b.boraneGain(3).mul(diff))
        player.b.borane4 = player.b.borane4.add(layers.b.boraneGain(4).mul(diff))
        player.b.borane5 = player.b.borane5.add(layers.b.boraneGain(5).mul(diff))
        if (hasMilestone("b", 1)) {
            let gain = layers.be.prestiGemsGet();
            if (gain.gt(0)) {
                player.be.prestiGems = player.be.prestiGems.add(gain.mul(diff));
            }
        }
        if (hasMilestone("b", 2)) {
            player.he.temPointUpTime = layers.he.addtemPointUpTime();
        }
        if (hasMilestone('b', 4)) {
            if (tmp.p && tmp.p.buyables && tmp.p.buyables[13] && tmp.p.buyables[13].unlocked && tmp.p.buyables[13].canBuy) {
                buyBuyable("p", 13);
            }
        }
    },
    tabFormat:{
        "里程碑": {   
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function(){return "你有 <span style='color:#FFDA00;text-shadow:0 0 10px'>"+format(player.he.temPoint)+"</span> 温度点"}],
                "milestones"
            ],
            unlocked(){return player.b.unlocked}
        },
        "制取": {   
            content: [
                "main-display","prestige-button",
                ["display-text",
                    function(){return "你有 <span style='color:#FFDA00;text-shadow:0 0 10px'>"+format(player.he.temPoint)+"</span> 温度点"}],
                ["display-text", function() {
                    if(hasUpgrade("c",34))return "你有 <span style='color:#7F3FFF;text-shadow:0 0 10px'>" + format(player.b.transcendCrystals) + "</span> 超越水晶";
                }],
                "clickables",
                ["upgrades",[6]]
            ],
            unlocked(){return hasMilestone("b",3)}
        },
        "升级": {   
            content: [
                "main-display","prestige-button",
                ["display-text",
                    function(){return "你有 <span style='color:#FFDA00;text-shadow:0 0 10px'>"+format(player.he.temPoint)+"</span> 温度点"}],
                ["display-text",function(){
                    let text1 = "";let text2 = "";let text3= "";let text4 = "";let text5 = "";let text6 = "";
                    if(hasMilestone("b",3))text1 = "你有 <span style='color:#FF3F3F;text-shadow:0 0 10px'>"+format(player.b.borane1)+"</span> 癸硼烷<br>你的癸硼烷产量为 <span style='color:#FF3F3F;text-shadow:0 0 10px'>"+format(layers.b.boraneGain(1))+"</span> / s"
                    if(hasMilestone("b",4))text2 = "你有 <span style='color:#FF7F3F;text-shadow:0 0 10px'>"+format(player.b.borane2)+"</span> 己硼烷<br>你的己硼烷产量为 <span style='color:#FF7F3F;text-shadow:0 0 10px'>"+format(layers.b.boraneGain(2))+"</span> / s"
                    if(hasMilestone("b",5))text3 = "你有 <span style='color:#FFFF3F;text-shadow:0 0 10px'>"+format(player.b.borane3)+"</span> 戊硼烷<br>你的戊硼烷产量为 <span style='color:#FFFF3F;text-shadow:0 0 10px'>"+format(layers.b.boraneGain(3))+"</span> / s"
                    if(hasMilestone("b",6))text4 = "你有 <span style='color:#3FFF3F;text-shadow:0 0 10px'>"+format(player.b.borane4)+"</span> 丁硼烷<br>你的丁硼烷产量为 <span style='color:#3FFF3F;text-shadow:0 0 10px'>"+format(layers.b.boraneGain(4))+"</span> / s"
                    if(hasMilestone("b",7))text5 = "你有 <span style='color:#3F3FFF;text-shadow:0 0 10px'>"+format(player.b.borane5)+"</span> 乙硼烷<br>你的乙硼烷产量为 <span style='color:#3F3FFF;text-shadow:0 0 10px'>"+format(layers.b.boraneGain(5))+"</span> / s"
                    return text1 + "<br>" + text2 + "<br>" + text3 + "<br>" + text4 + "<br>" + text5 + "<br>" + text6
                }],["upgrades",[1,2,3,4,5]]
            ],
            unlocked(){return hasMilestone("b",3)}
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #1F0000)",
        minHeight: "100vh"
    },
},)
addLayer("c", {
    name: "c",
    symbol: "C",
    position: 2, 
    startData() { return {
        unlocked: false,
        points: zero,
        entropy: zero,
        inExtract: false,
        oil: zero,
    }},
    branches: ["h"],
    color: "#555555",
    requires: new Decimal(1e100),
    resource: "碳",
    baseResource: "氢能",
    baseAmount() {return player.h.power},
    type: "normal", 
    exponent: 0.5,
    gainMult() {
        mult = one
        if(hasUpgrade('c', 11)) mult = mult.mul(upgradeEffect('c', 11));
        if (hasUpgrade('b', 44)) mult = mult.mul(upgradeEffect('b', 44));
        if(hasAchievement('a', 33)) mult = mult.mul(achievementEffect('a', 33));
        return mult
    },
    gainExp() {
        exp = one
        if(player.c.inExtract) exp = exp.mul(0.666)
        return exp
    },
    row: 2,
    layerShown(){return player.c.unlocked||hasUpgrade("b",15)},
    passiveGeneration(){
        let a = zero
        if(hasMilestone("n",4)) a = one
        return a
    },
    resetsNothing(){
        return hasMilestone("b",3)
    },
    hotkeys: [
        {key: "c", description: "C: 进行一次碳重置", onPress(){if(canReset(this.layer)) doReset(this.layer)}},
    ],
    getEntropyGain() {
        let gain = one;
        if (hasUpgrade('c', 31)) gain = gain.mul(upgradeEffect('c', 31));
        if (hasUpgrade('c', 32)) gain = gain.mul(upgradeEffect('c', 32));
        if (hasUpgrade('c', 33)) gain = gain.mul(upgradeEffect('c', 33));
        if (hasUpgrade('b', 34)) gain = gain.mul(upgradeEffect('b', 34));
        if(hasAchievement('a', 34)) gain = gain.mul(achievementEffect('a', 34));
        if(player.c.inExtract) gain = gain.pow(0.666);
        return gain;
    },
    update(diff) {
        const count = getBuyableAmount('c', 11).toNumber();
        if (count > 0) {
            player.c.entropy = player.c.entropy.add(layers.c.getEntropyGain().mul(count).mul(diff));
        }
    },
    upgrades:{
        11:{
            title:"CCB",
            description:"硼加成碳。",
            effect(){
                let effect = player.b.points.add(1).pow(0.9).add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(1),
            unlocked(){return player.c.unlocked},
        },
        12:{
            title:"离子化",
            description:"加成锂的第四个效果。",
            cost: new Decimal(200),
            unlocked(){return hasUpgrade("c",11)},
        },
        13:{
            title:"甲烷",
            description:"移除氢能的软上限。",
            cost: new Decimal(66686),
            unlocked(){return hasUpgrade("c",12)},
        },
        14:{
            title:"这是一条单行道......",
            description:"解锁熵。",
            cost: new Decimal(1e80),
            unlocked(){return hasUpgrade("c",13)},
        },
        21:{
            title:"热力学",
            description:"熵加成中微子。",
            effect(){
                let effect = player.c.entropy.pow(player.c.entropy.add(1).log10().add(1))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(10),
            unlocked(){return player.c.entropy.gte(10)||hasUpgrade('c',[this.id])},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
        22:{
            title:"热机",
            description:"熵加成氢。",
            effect(){
                let effect = player.c.entropy.pow(player.c.entropy.add(1).log2().add(1).log2().add(1))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(200),
            unlocked(){return hasUpgrade('c',21)},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
        23:{
            title:"电热",
            description:"熵加成电子。",
            effect(){
                let effect = player.c.entropy.add(1).log2().add(1).floor()
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(3000),
            unlocked(){return hasUpgrade('c',22)},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
        24:{
            title:"碳-13",
            description:"解锁自动点击者。",
            cost: new Decimal(40000),
            unlocked(){return hasUpgrade('c',23)},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
        31:{
            title:"新的开始",
            description:"硼加成熵。",
            effect(){
                let effect = player.b.points.add(1).pow(0.8).add(1).floor()
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(20),
            unlocked(){return hasUpgrade('c',21)},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
        32:{
            title:"热能",
            description:"碳加成熵。",
            effect(){
                let effect = player.c.points.add(1).log2().add(1).log2().add(1).floor()
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(300),
            unlocked(){return hasUpgrade('c',22)&&hasUpgrade('c',31)},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
        33:{
            title:"碳-12",
            description:"铍加成熵。",
            effect(){
                let effect = player.be.points.add(1).log2().add(1).log2().add(1).floor()
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(4000),
            unlocked(){return hasUpgrade('c',23)&&hasUpgrade('c',32)},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
        34:{
            title:"碳-14",
            description:"解锁超越。",
            cost: new Decimal(1000000),
            unlocked(){return hasUpgrade('c',24)&&hasUpgrade('c',33)},
            currencyDisplayName: "熵",
            currencyInternalName: "entropy",
            currencyLayer: "c",
        },
    },
    clickables: {
        11: {
            title: "获取熵",
            display() {
                let gain = layers.c.getEntropyGain();
                return "点击以获得 <span style='color:#BBBBBB;text-shadow:0 0 10px'>"+format(gain)+"</span> 熵。";
            },
            unlocked() { return hasUpgrade('c', 14); },
            canClick() { return true; },
            onClick() {
                player.c.entropy = player.c.entropy.add(layers.c.getEntropyGain());
            },
        },
        21:{
            title() {return "提炼"},
            display() {
                let text = "当前状态：" + (player.c.inExtract?"进行中":"闲置") + "<br>重置超越的所有内容与光子，超越水晶。<br>提炼削弱这些重置的非静态资源^0.666。<br>结束制取时，硼和电能加成原油。<br>当前原油：<span style='color:#111111;text-shadow:0 0 10px'>"+format(player.c.oil)+"</span> <br>当前效果：获得 <span style='color:#111111;text-shadow:0 0 10px'>"+format(layers.c.oilGainFloor())+"</span> 原油<br>增加 <span style='color:#111111;text-shadow:0 0 10px'>"+format(layers.c.oilGainFloor().sub(player.c.oil).max(0))+"</span> 原油"
                return text
            },
            canClick() {return true},
            onClick() {
                if(player.c.inExtract){
                    player.c.oil = layers.c.oilGainFloor().max(player.c.oil)
                    player.c.inExtract = false
                }
                else {
                    run(layers.b.clickables[13].onClick);
                    player.p.photons = zero
                    player.b.transcendCrystals = zero
                    player.c.inExtract = true
                }
            },
            style() { return { width: "800px" } },
        },
    },
    buyables: {
        11: {
            title: "自动点击者",
            cost(x) {
                return new Decimal(1e81).mul(Decimal.pow(2, x));
            },
            display() {
                return "自动点击获取熵。<br>价格：" + format(this.cost()) + "碳<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：每秒自动点击 " + format(this.effect()) + " 次";
            },
            canAfford() { return player.c.points.gte(this.cost()); },
            buy() {
                player.c.points = player.c.points.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect(x) {
                return x;
            },
            purchaseLimit() {
                if (hasUpgrade("p", 84)) {
                    return new Decimal(Infinity);
                }
                return new Decimal(12);
            },
            unlocked() { return hasUpgrade('c', 24); }
        }
    },
    milestones:{
        1:{
            requirementDescription: "1950 原油",
            effectDescription: "减益：氢能 / √8；解锁石油气与新的电子升级。",
            done(){return player.c.oil.gte(1950)},
            unlocked(){return player.c.oil.gte(1)},
        },
    },
    oilGainFloor(){
        let gain = zero
        if(player.c.inExtract) gain = player.b.points.mul(player.li.currentElectricity.add(1).log2().add(1))
        return gain
    },
    tabFormat: {
        "主页": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function(){ return "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.power)+"</span> 氢能"; }
                ],
                ["upgrades",[1]]
            ],
            unlocked(){ return true; }
        },
        "熵": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function(){ return "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.power)+"</span> 氢能"; }
                ],
                "buyables",
                ["clickables",[1]],
                ["display-text", function() {
                    return "你有 <span style='color:#555555;text-shadow:0 0 10px'>" + format(player.c.entropy) + "</span> 熵";
                }],
                ["upgrades",[2,3]]
            ],
            unlocked(){ return hasUpgrade('c', 14); }
        },
        "原油": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function(){ return "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.power)+"</span> 氢能"; }
                ],
                ["clickables",[2]],
                ["display-text","注：每一个原油里程碑都会给你一个减益和一种新的原油副产品！"],
                "milestones",
                ["display-text",
                    function(){ if(hasMilestone("c",1)) return "石油气：加成电子获取 <span style='color:#7777FF;text-shadow:0 0 10px'>"+format(player.c.entropy.pow(player.c.oil).add(1).log2().add(1).floor())+"</span> 倍"; }
                ],
            ],
            unlocked(){ return hasMilestone('n', 8); }
        },
    },    
    style: {
        background: "linear-gradient(135deg, #000000, #1F1F1F)",
        minHeight: "100vh"
    },
})
addLayer("n", {
    name: "n",
    symbol: "N",
    position: 0, 
    startData() { return {
        unlocked: false,
        points: zero,
        balloon: zero,
    }},
    branches: ["li"],
    color: "#000000",
    requires: new Decimal(2e26),
    resource: "氮",
    baseResource: "电能",
    baseAmount() {return player.li.currentElectricity},
    nodeStyle: { color: "white" },
    type: "normal", 
    exponent: 0.5,
    gainMult() {
        mult = one
        return mult
    },
    gainExp() {
        exp = one
        return exp
    },
    row: 3,
    layerShown(){return player.n.unlocked||hasUpgrade("p",83)},
    resetsNothing(){
        return hasMilestone("n",5)
    },
    hotkeys: [
        {key: "n", description: "N: 进行一次氮重置", onPress(){if(canReset(this.layer)) doReset(this.layer)}},
    ],
    // ========== 新增 doReset（保留里程碑） ==========
    doReset: function() {
        if (!player[this.layer] || !tmp[this.layer]) return;
        if (!canReset(this.layer)) return;

        let skipReset = run(this.resetsNothing, this);

        // ---------- 安全备份（仅当需要重置时） ----------
        let backup = null;
        if (!skipReset) {
            backup = {};
            for (let layer in player) {
                if (player[layer] && typeof player[layer] === 'object') {
                    backup[layer] = {
                        milestones: Array.isArray(player[layer].milestones) ? player[layer].milestones.slice() : [],
                        achievements: Array.isArray(player[layer].achievements) ? player[layer].achievements.slice() : []
                    };
                }
            }
        }
    
        let gain = tmp[this.layer].resetGain || new Decimal(0);
        if (this.onPrestige) run(this.onPrestige, this, gain);
        addPoints(this.layer, gain);
        tmp[this.layer].baseAmount = decimalZero;

        if (skipReset) {
            updateTemp();
            updateTemp();
            return;
        }

        // ---------- 以下为正常重置逻辑（仅当 skipReset 为 false 时执行） ----------
        let row = this.row;
        for (let layerResetting in layers) {
            if (row >= layers[layerResetting].row) {
                completeChallenge(layerResetting);
            }
        }

        player.points = getStartPoints();

        let keep = ['milestones', 'achievements'];
        for (let x = 0; x <= maxRow; x++) {
            for (let lr in ROW_LAYERS[x]) {
                if (lr !== this.layer && lr !== "b") {   // 跳过B层
                    layerDataReset(lr, keep);
                }
            }
        }
        for (let r in OTHER_LAYERS) {
            for (let lr in OTHER_LAYERS[r]) {
                if (lr !== this.layer) layerDataReset(lr, keep);
            }
        }

        player[this.layer].resetTime = 0;

        if (backup) {
            for (let layer in backup) {
                if (player[layer]) {
                    if (backup[layer].milestones) {
                        player[layer].milestones = backup[layer].milestones;
                    }
                    if (backup[layer].achievements) {
                        player[layer].achievements = backup[layer].achievements;
                    }
                }
            }
        }

        updateTemp();
        updateTemp();
    },
    milestones:{
        1:{
            requirementDescription: "1 氮",
            effectDescription: "第四行重置不重置里程碑和硼，并大幅优化 温度点效果|句芒 的公式。",
            done(){return player.n.points.gte(1)},
            unlocked(){return player.n.unlocked},
        },
        2:{
            requirementDescription: "10 氮",
            effectDescription: "转生宝石倍增硼烷产能和超越水晶。",
            done(){return player.n.points.gte(10)},
            unlocked(){return hasMilestone("n",1)},
        },
        3:{
            requirementDescription: "100 氮",
            effectDescription: "回调温度的公式，但是解锁新的氦里程碑。",
            done(){return player.n.points.gte(100)},
            unlocked(){return hasMilestone("n",2)},
        },
        4:{
            requirementDescription: "100000 氮",
            effectDescription: "自动获取重置时的 100% 碳 /s。",
            done(){return player.n.points.gte(100000)},
            unlocked(){return hasMilestone("n",3)},
        },
        5:{
            requirementDescription: "1000000 氮",
            effectDescription: "第四行不再重置任何东西。",
            done(){return player.n.points.gte(1000000)},
            unlocked(){return hasMilestone("n",4)},
        },
        6:{
            requirementDescription: "100000000 氮",
            effectDescription: "解锁氮气球。",
            done(){return player.n.points.gte(100000000)},
            unlocked(){return hasMilestone("n",5)},
        },
        7:{
            requirementDescription: "1e9 氮",
            effectDescription: "解锁新的光子升级。",
            done(){return player.n.points.gte(1e9)},
            unlocked(){return hasMilestone("n",6)},
        },
        8:{
            requirementDescription: "1e27 氮",
            effectDescription: "解锁原油。",
            done(){return player.n.points.gte(1e27)},
            unlocked(){return hasMilestone("n",7)},
        },
    },
    tabFormat: {
        "主页": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function(){ return "你有 <span style='color:#DDDD33;text-shadow:0 0 10px'>"+format(player.li.currentElectricity)+"</span> 电能"; }
                ],
                "milestones",
                
            ],
            unlocked(){ return true; }
        }
    },    
    style: {
        background: "radial-gradient( #000000, #2F2F2F, #000000)",
        minHeight: "100vh"
    },
    componentStyles: {
        upgrade: { color: "#FFFFFF" },
        "prestige-button": { color: "#FFFFFF" },
    }
})
addLayer("a", {
    name: "a",
    symbol: "A",
    startData() { return {
        unlocked: true,
    }},
    color: "#FFFF3F",
    row: "side",
    tooltip() {
        return ("成就")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "赢",
            done() {return player.points.gte(1e5)}, 
            tooltip: "获得 100000 中微子。<br>奖励：+1 中微子获取。", 
            effect() {return one},
            unlocked: true
        },
        12: {
            name: "十万氢气",
            done() {return player.h.points.gte(1e5)}, 
            tooltip: "要求：获得 100000 氢。<br>奖励：解锁新的氢升级。", 
            unlocked: true
        },
        13: {
            name: "热气球",
            done() {return player.h.balloon.gte(6)}, 
            tooltip: "要求：获得 6 气球。<br>奖励：取消转化氢的限制。", 
            unlocked: true
        },
        14: {
            name: "氦人听闻",
            done() {return player.he.points.gte(56)}, 
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 56 氦。<br>奖励：已完成的成就个数加成中微子。<br>当前：${format(eff)}x`;
                } else {
                    return `要求：获得 56 氦。<br>奖励：已完成的成就个数加成中微子。<br>当前：1.00x`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.5).add(1);
            },
            unlocked: true
        },
        15: {
            name: "勘探丰度",
            done() {return player.li.points.gte(8)}, 
            tooltip: "获得 8 锂。<br>奖励：第二层不再重置任何东西。", 
            unlocked: true
        },
        16: {
            name: "讲个冷笑话",
            done() {return layers.he.temPointdivLicost().gte(100)}, 
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：温度点效果|祝融达到 / 100。<br>奖励：已完成的成就个数加成氢。<br>当前：${format(eff)}x`;
                } else {
                    return `要求：温度点效果|祝融达到 / 100。<br>奖励：已完成的成就个数加成氢。<br>当前：1.00x`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.4).add(1);
            },
            unlocked: true
        },
        17: {
            name: "没完了是吧",
            done() {return player.he.clicks.gte(1000)||hasAchievement("a",17)},
            tooltip: "在一次第二行或更高的重置内点击 1000 次冷却氦按钮。",
            unlocked() {return hasAchievement("a",17)}
        },
        //图片还在制作中!
        21: {
            name: "坏结局",
            done() {return player.be.points.gte(1)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 1 铍。<br>奖励：已完成的成就个数降低氦价格。<br>当前：/ ${format(eff)}`;
                } else {
                    return `要求：获得 1 铍。<br>奖励：已完成的成就个数降低氦价格。<br>当前：/ 1.00`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.9).add(1);
            },
            unlocked() {return hasAchievement("a",16)}
        },
        22: {
            name: "电网",
            done() {return player.li.currentElectricity.gte(100)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 100 电能。<br>奖励：已完成的成就个数降低锂价格。<br>当前：/ ${format(eff)}`;
                } else {
                    return `要求：获得 100 电能。<br>奖励：已完成的成就个数降低锂价格。<br>当前：/ 1.00`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.8).add(1);
            },
            unlocked() {return hasAchievement("a",16)}
        },
        23: {
            name: "科学万岁",
            done() {return player.li.researchPoint.gte(10)},
            tooltip: "要求：获得 10 研究点。<br>奖励：成就14的效果同样加成电能上限，并让电能流失速度降低 0.4%。", 
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.3).add(1);
            },
            unlocked() {return hasAchievement("a",16)}
        },
        24: {
            name: "稀世珍宝",
            done() {return player.be.prestiGems.gte(50)}, 
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 50 转生宝石。<br>奖励：已完成的成就个数加成铍。<br>当前：${format(eff)}x`;
                } else {
                    return `要求：获得 50 转生宝石。<br>奖励：已完成的成就个数加成铍。<br>当前：1.00x`;
                }   
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.2).add(1);
            },
            unlocked() {return hasAchievement("a",16)}
        },
        25: {
            name: "电子云",
            done() {return player.p.electrons.gte(1000000)},
            tooltip: "要求：获得 1000000 电子。<br>奖励：解锁新层级。",
            unlocked() {return hasAchievement("a",16)}
        },
        26: {
            name: "轻松硼住",
            done() {return player.b.points.gte(1)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 1 硼。<br>奖励：已完成的成就个数加成温度点。<br>当前：${format(eff)}x`;
                } else {
                    return `要求：获得 1 硼。<br>奖励：已完成的成就个数加成温度点。<br>当前：1.00x`;
                }   
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(1.1).add(1);
            },
            unlocked() {return hasAchievement("a",16)}
        },
        31: {
            name: "硼胀",
            done() {return player.b.borane5.gte(1000)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 1000 乙硼烷。<br>奖励：已完成的成就个数降低硼价格。<br>当前：/ ${format(eff)}`;
                } else {
                    return `要求：获得 1000 乙硼烷。<br>奖励：已完成的成就个数降低硼价格。<br>当前：/ 1.00`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.7).add(1);
            },
            unlocked() {return hasAchievement("a",26)}
        },
        32: {
            name: "666大黑色元素",
            done() {return player.b.borane5.gte(1000)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 1 碳。<br>奖励：降低硼的成本指数。<br>当前：-${format(eff)}`;
                } else {
                    return `要求：获得 1 碳。<br>奖励：降低硼的成本指数。<br>当前：-0.00`;
                }
            },
            effect() {return 0.5;},
            unlocked() {return hasAchievement("a",26)}
        },
        33: {
            name: "增长率",
            done() {return player.c.entropy.gte(1000)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 1000 熵。<br>奖励：已完成的成就个数加成碳。<br>当前：x${format(eff)}`;
                } else {
                    return `要求：获得 1000 熵。<br>奖励：已完成的成就个数加成碳。<br>当前：x1.00`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(1.2).add(1);
            },
            unlocked() {return hasAchievement("a",26)}
        },
        34: {
            name: "突破",
            done() {return player.b.transcendCrystals.gte(200)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 200 超越水晶。<br>奖励：已完成的成就个数加成熵。<br>当前：x${format(eff)}`;
                } else {
                    return `要求：获得 200 超越水晶。<br>奖励：已完成的成就个数加成熵。<br>当前：x1.00`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.6).add(1);
            },
            unlocked() {return hasAchievement("a",26)}
        },
        35: {
            name: "盖亚！",
            done() {return player.p.photons.gte(20)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 20 光子。<br>奖励：已完成的成就个数加成电子。<br>当前：x${format(eff)}`;
                } else {
                    return `要求：获得 20 光子。<br>奖励：已完成的成就个数加成电子。<br>当前：x1.00`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1).pow(0.66686).add(1).floor();
            },
            unlocked() {return hasAchievement("a",26)}
        },
        41: {
            name: "天嘿了",
            done() {return player.n.points.gte(1000)},
            tooltip: function() {
                if (hasAchievement(this.layer, this.id)) {
                    let eff = achievementEffect(this.layer, this.id);
                    return `要求：获得 1000 氮。<br>奖励：已完成的成就个数加成硼烷产能。<br>当前：x${format(eff)}`;
                } else {
                    return `要求：获得 1000 氮。<br>奖励：已完成的成就个数加成硼烷产能。<br>当前：x1.00`;
                }
            },
            effect() {
                let len = getAchievementCount();
                if (hasUpgrade('h', 55)) len = len * len;
                return new Decimal(len).add(1);
            },
            unlocked() {return hasAchievement("a",35)}
        },
    },
    tabFormat:{
        '成就':{
            content:[
            //['infoboxes','main-text'],
            ['display-text', function() {
                let count = getAchievementCount();
                let effective = hasUpgrade('h', 55) ? count * count : count;
                if (hasUpgrade('h', 55)) {
                    return `你有 <h3 style="color: #FFFF3F; text-shadow:0 0 10px">${formatWhole(effective)}</h3> 成就`;
                } else {
                    return `你有 <h3 style="color: #FFFF3F; text-shadow:0 0 10px">${formatWhole(count)}</h3> 成就`;
                }
            }],
            'achievements',
            ],
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3F1F00)",
        minHeight: "100vh"
    },
})
addLayer("t", {
    name: "t",
    symbol: "T",
    startData() { return {
        unlocked: true,
    }},
    color: "#39C5BB",
    row: "side",
    tooltip() {
        return ("科学")
    },
    infoboxes: {
        "points": {
            title: "中微子",
            body: "中微子是一种电中性的基本粒子，通过弱相互作用和引力与其它物质发生相互作用，其中弱相互作用力程很短。中微子质量极小，历史上很长一段时间内人们认为中微子质量为零。由于中微子的上述性质，中微子与其它物质的相互作用很小，通常可以几乎不受阻碍地通过正常物质，因此很难被检测到。中微子是费米子，自旋是1/2。到目前为止，还没有实验表明中微子具有非零磁矩。中微子通常用希腊字母ν表示。<br>弱相互作用中产生的中微子有三种不同的味，分别是：电子中微子νe、μ子中微子νμ、τ子中微子ντ。在带电流反应中，每种味的中微子都与名字中对应味的带电轻子是关联出现的。现有粒子理论中，中微子有三个不同的质量本征态，具有特定味的中微子是三种质量对应量子态的线性叠加，中微子会在不同的味之间震荡。截至2024年，中微子的三个质量本征值目前为止尚不清楚，但是通过粒子实验和宇宙学观测得到了三个质量本征值平方差的上限。<br>每种味的中微子都存在其反粒子，被称为各自的反中微子，自旋是1/2且没有电荷。中微子和反中微子有符号相反的手性和弱同位旋。",
            style: { "border-color": "#FFFFFF" },
            titleStyle: { "background-color": "#FFFFFF" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "electrons": {
            title: "电子",
            body: "在标准模型中，电子属于第一代轻子，是基本粒子之一。在国际单位制中电子质量约为9.1093837139( 28 )× 10-31kg，电荷量是-1.602176634×10-19C。电子电荷量为负的基本电荷量。电子是费米子，自旋是1/2。根据泡利不相容原理，不会用同一个电子占据同一个量子态。<br>电子是原子的重要组成部分，原子由带正电的原子核和带负电的电子组成。由于原子核的结构与电子在轨道上的排布，不同的元素呈现出不同的物理性质。<br>在原子核物理中，电子被称为β粒子，β射线中的物质是电子。在粒子的反应中，还会形成电子的反粒子——正电子。正电子携带一个正的基本电荷，可以与电子湮灭产生γ射线光子/2。到目前为止，还没有实验表明中微子具有非零磁矩。中微子通常用希腊字母ν表示。",
            style: { "border-color": "#3F3FFF" },
            titleStyle: { "background-color": "#3F3FFF" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "photons": {
            title: "光子",
            body: "光束是由一粒一粒运动着的粒子流组成，这种粒子被称为光子（Photon），也叫光量子。它是传递电磁相互作用的基本粒子，是一种规范玻色子，在1905年由爱因斯坦提出，并在其光量子理论中成功解释了光电效应。",
            style: { "border-color": "#FFFF7F" },
            titleStyle: { "background-color": "#FFFF7F" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "h": {
            title: "氢",
            body: "氢是一种化学元素，在元素周期表中位于第一位，符号为 H。<br>氢在宇宙中广泛存在，是宇宙中最早形成的元素之一，也是宇宙中含量最丰富的元素，约占宇宙中所有可见物质质量的 75%。",
            style: { "border-color": "#FF66CC" },
            titleStyle: { "background-color": "#FF66CC" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "he": {
            title: "氦",
            body: "氦元素，化学符号He，原子序数2，是宇宙中第二轻的元素，仅次于氢。作为一种稀有气体，氦在地球大气中的含量相对较少，但在宇宙中的丰度却非常高。氦元素的原子结构极为稳定，其电子层仅有一个满壳层，因此化学性质极不活泼，很少与其他元素发生反应。<br>氦元素在1868年被发现，最初是通过分析太阳光谱中的特定线条而识别的。在地球上，氦主要从天然气田中提取，因其无色、无味、无毒且密度低的特性，被广泛应用于多个领域。在科学研究中，液态氦是冷却超导磁体的关键材料。在医疗领域，氦气用于磁共振成像（MRI）设备。此外，氦气还用于充填气球、激光技术、半导体制造等。",
            style: { "border-color": "#FFBBCC" },
            titleStyle: { "background-color": "#FFBBCC" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "li": {
            title: "锂",
            body: "锂（Lithium）是一种金属元素，被誉为绿色能源金属和“白色石油”，广泛应用于储能、化工、医药、冶金、电子工业等领域。锂位于元素周期表的第二周期IA族，元素符号为Li，它的原子序数为3，原子量为6.941，其熔点为180.5 ℃，沸点为1342 ℃，比热容为3.58 kJ/kg·K，单质锂为银白色质软金属，在所有已知金属中比重最轻。可与水反应，可溶于硝酸、液氨等溶液。锂属于碱金属，但它的化合物并不像其他的碱金属那么典型，因为锂的电荷密度很大并且有稳定的氦型双电子层，使得锂容易极化其他的分子或离子，自己本身却不容易受到极化。这一点就影响到它和它的化合物的稳定性。此外，由于锂的电极电势最负，在已知元素（包括放射性元素）中是金属活动性最强的。",
            style: { "border-color": "#CC0033" },
            titleStyle: { "background-color": "#CC0033" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "be": {
            title: "铍",
            body: "铍（Beryllium）是第二周期第二主族元素，原子序数为4，元素符号Be，是一种灰白色的碱土金属，属六方晶系，质硬，有展性。铍及其化合物都有剧毒。铍既能溶于酸也能溶于碱液，是两性金属，铍主要用于原子能反应堆材料，宇航工程材料，各种合金，X射线透射窗等。",
            style: { "border-color": "#55CC77" },
            titleStyle: { "background-color": "#55CC77" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "b": {
            title: "硼",
            body: "硼（Boron）是一种化学元素，元素符号是B。它是周期系IIIA族的第一个元素，原子结构为1s22s22p1，原子量为10.81。天然硼由两种稳定同位素构成。<br>约公元前200年，古埃及、罗马、巴比伦曾用硼砂制造玻璃和焊接黄金。法国化学家盖·吕萨克用金属钾还原硼酸制得单质硼。硼在地壳中的含量为0.001%。硼为黑色或棕色粉末。晶体硼外观为黑色，硬度仅次于金刚石，质地较脆。",
            style: { "border-color": "#992222" },
            titleStyle: { "background-color": "#992222" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "c": {
            title: "碳",
            body: "碳（Carbon）是一种非金属元素，化学符号为C，位于元素周期表的第二周期IVA族。拉丁语为Carbonium，意为“煤、木炭”。汉字“碳”字由木炭的“炭”字加石字旁构成，从“炭”字音。碳是一种很常见的元素，以多种形式广泛存在于大气和地壳之中。<br>碳的稳定同位素是¹²C和¹³C，二者在自然界的相对丰度是98.892%（¹²C）和1.108%（¹³C）；在碳的放射性同位素中，寿命最长的是¹⁴C。¹⁴C在¹⁴N（n，p）¹⁴C反应中形成，会发生β衰变，其半衰期为5730a。 [7]<br>碳是生命的关键，而且根据定义也出现在所有的有机化合物中。对生命的研究属于生物化学的研究范畴。例如乙烯气体（C₂H₄）可以催熟西红柿。<br>碳是生物界的支柱元素，是当今的主要能源，也是化工、冶金等工业的重要原料以及合金的重要组分。一般由天然游离矿开采。",
            style: { "border-color": "#555555" },
            titleStyle: { "background-color": "#555555" },
            bodyStyle: { "color": "#FFFFFF" }
        },
        "n": {
            title: "氮",
            body: "氮是一种化学元素，化学符号为N，原子序数为7。在自然界中，氮主要以单质形态存在，即氮气（N₂）。氮气是一种无色、无味且化学性质相对惰性的气体，占据了地球大气总体积的约78%，是大气中含量最多的成分。<br>氮在生物体内具有极为重要的作用，它是蛋白质、核酸等生命大分子的关键组成元素，对生物体的结构和功能至关重要。在生态系统中，氮循环是核心环节之一，涵盖了固氮、氨化、硝化和反硝化等多个过程，这些过程维持了氮元素在生物圈和环境中的动态平衡。<br>在工业领域，氮的应用极为广泛。它是生产化肥、硝酸和炸药的重要原料，对农业生产和工业制造意义重大。此外，液态氮由于其极低的温度，被广泛应用于冷冻、医疗等领域，如冷冻保存生物样本和低温治疗等。氮的化合物种类繁多，不仅对人类生活有着深远影响，也在科学研究中占据重要地位。",
            style: { "border-color": "#000000" },
            titleStyle: { "background-color": "#000000","color":"#FFFFFF" },
            bodyStyle: { "color": "#FFFFFF" }
        }
    },
    tabFormat:{
        '科学':{
            content: function() {
                let components = [
                    ['infobox', 'points'], 
                ];
                if (hasUpgrade("p",55)) components.push(['infobox', 'electrons']);
                if (hasUpgrade("b",55)) components.push(['infobox', 'photons']);
                if (player.h.unlocked) components.push(['infobox', 'h']);
                if (player.he.unlocked) components.push(['infobox', 'he']);
                if (player.li.unlocked) components.push(['infobox', 'li']);
                if (player.be.unlocked) components.push(['infobox', 'be']);
                if (player.b.unlocked) components.push(['infobox', 'b']);
                if (player.c.unlocked) components.push(['infobox', 'c']);
                if (player.n.unlocked) components.push(['infobox', 'n']);
                return components;
            },
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #1F3F3F)",
        minHeight: "100vh"
    },
})
