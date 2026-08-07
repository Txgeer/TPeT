const NAMES = ["基本粒子","氢","氦","锂","铍","硼","碳","氮","氧","氟","氖"]
addLayer("p", {
    name: "p",
    symbol: "P",
    position: 1,
    startData() { return {
        unlocked: true,
        points: one,
        buyableAutobuy: true,
        electrons: zero,
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
                if (typeof player === 'undefined' || !player) return;
                player.paused = !player.paused;
                if (player.paused) {
                    doPopup("info", "游戏已暂停", "⏸", 2, "#ffaa00");
                } else {
                    doPopup("info", "游戏已恢复", "▶", 2, "#00ff00");
                }
            },
            unlocked: true
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
            description:"改进 粒子加速器|Alef 的效果。",
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
            description:"加成 粒子加速器|Alef 上限。",
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
            description:"加成 粒子加速器|Bef 上限 10。",
            effect(){
                let effect = n(10)
                if(hasUpgrade("p",31)) effect = effect.mul(upgradeEffect("p",31))
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"基本粒子",
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
            currencyDisplayName:"基本粒子",
            currencyInternalName:"points",
            cost: new Decimal(300000000),
            unlocked(){return hasUpgrade("h",13)||hasUpgrade("p",[this.id])},
        },
        34:{
            title:"加速生产 VII",
            description:"翻六倍基本粒子获取。",
            effect(){
                let effect = n(6)
                if(hasUpgrade("p",62)) effect = effect.mul(upgradeEffect("p",62))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"基本粒子",
            currencyInternalName:"points",
            cost: new Decimal(3.14e16),
            unlocked(){return hasUpgrade("p",25)||hasUpgrade("p",[this.id])},
        },
        35:{
            title:"粒子超越器",
            description:"优化 粒子究速器 的公式。",
            currencyDisplayName:"基本粒子",
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
            description:" 中微子加成 粒子加强器 效果",
            effect(){
                let effect = player.points.add(1.01).log(100).root(3)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName:"基本粒子",
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
            currencyDisplayName:"基本粒子",
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
            currencyDisplayName:"基本粒子",
            currencyInternalName:"points",
            cost: new Decimal(3.9e39),
            unlocked(){return hasUpgrade("p",43)||hasUpgrade("p",[this.id])},
        },
        45:{ 
            title:"粒子究强器",
            description:"加成 粒子加速器|Alef & 粒子加速器|Bef 上限 50。",
            effect(){
                let effect = n(50)
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"基本粒子",
            currencyInternalName:"points",
            cost: new Decimal(4e40),
            unlocked(){return hasUpgrade("p",44)||hasUpgrade("p",[this.id])},
        },
        51:{
            title:"粒子究速器",
            description:" 氢加成 粒子加速器|Bef 效果。",
            effect(){
                let effect = player.h.points.add(10).log(10).root(2).sub(1).div(2)
                if(hasUpgrade("p",35)) effect = player.h.points.add(10).log(8).root(1.8).sub(0.8).max(0).div(1.8)
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            currencyDisplayName:"基本粒子",
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
            currencyDisplayName:"基本粒子",
            currencyInternalName:"points",
            cost: new Decimal(4e42),
            unlocked(){return hasUpgrade("p",45)||hasUpgrade("p",[this.id])}
        },
        53:{
            title:"冷却机器",
            description:"每秒自动获取10000%的温度点(相当于1s按100次)",
            effect(){
                let effect = n(100)
                return effect
            },
            effectDisplay(){return format(this.effect().mul(100)) + "%"},
            currencyDisplayName:"基本粒子",
            currencyInternalName:"points",
            cost: new Decimal(4e44),
            unlocked() {return hasUpgrade("p",52)||hasUpgrade("p",[this.id])}
        },
        54:{
            title:"人外有人",
            description:"解锁第三个粒子加速器，最大购买前两个粒子加速器，同时这两个粒子加速器不再有上限。",
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
                let eff = player.p.electrons.add(1).log2().add(1);
                return eff;
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
                    return {'background-color': '#0000FF'};
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
            unlocked() { return hasUpgrade("p",61)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
                } else {
                    return {};
                }
            }
        },
        63: {
            title: "电子加速 II",
            description: "电子加成氢。",
            effect() {
                let eff = player.p.electrons.add(1).ln().add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(300),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",62)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
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
            unlocked() { return hasUpgrade("p",63)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
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
            unlocked() { return hasUpgrade("p",64)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
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
            unlocked() { return hasUpgrade("li",71)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
                } else {
                    return {};
                }
            }
        },
        72: {
            title: "稳定粒子",
            description: "电子大幅降低氦价格。",
            effect() {
                let eff = player.p.electrons.add(1).pow(0.9).add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(20000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",71)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
                } else {
                    return {};
                }
            }
        },
        73: {
            title: "导电金属",
            description: "电子较大幅降低锂价格。",
            effect() {
                let eff = player.p.electrons.add(1).pow(0.8).add(1);
                return eff;
            },
            effectDisplay() { return "x" + format(this.effect()); },
            cost: new Decimal(40000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",72)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
                } else {
                    return {};
                }
            }
        },
        74: {
            title: "阿尔法解放",
            description: "取消 氦-4 的上限。",
            cost: new Decimal(100000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",73)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
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
            cost: new Decimal(200000),
            currencyDisplayName: "电子",
            currencyInternalName: "electrons",
            currencyLayer: "p",
            unlocked() { return hasUpgrade("p",74)||hasUpgrade("p",[this.id]); },
            style() {
                if (hasUpgrade(this.layer, this.id)) {
                    return {};
                } else if (canAffordUpgrade(this.layer, this.id)) {
                    return {'background-color': '#0000FF'};
                } else {
                    return {};
                }
            }
        },
    },
    buyables:{
        11: {
            title: "粒子加速器|Alef",
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
                    return a
                }
                else {
                    let a = x.mul(0.166686).add(1)
                    if(hasUpgrade("p",15)) a = x.mul(0.6666).add(1)
                    if(getBuyableAmount("p",12).gte(1)) a = x.mul(buyableEffect("p",12).add(0.6666))
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
            title: "粒子加速器|Bef",
            cost(x) {
                let a = x.add(1).mul(x.add(1).mul(1e4))
                if(x.gte(8)) a = x.pow(x)
                return a
            },
            display() { return "加成 粒子加速器|Alef。<br>价格：" + format(this.cost()) + "中微子<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：+" + format(this.effect()) + "<br>上限数量：" + format(this.purchaseLimit())},
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
            title: "粒子加速器|Kaf",
            cost(x) {
                x = x.add(3)
                a = x.pow(x.pow(2))
                return a
            },
            display() { return "加成 粒子加速器|Bef。<br>价格：" + format(this.cost()) + "基本粒子<br>当前数量：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限数量：" + format(this.purchaseLimit())},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let a = x.mul(12.5).max(1)
                return a
            },
            purchaseLimit(){
                let a = n(20)
                return a
            },
            unlocked(){return hasUpgrade("p",54)},
        },
    },
    clickables: {
        21: {
            title: "将中微子转化为电子",
            display() {
                let gain = player.points.add(1).log2().add(1).log2().add(1).floor();
                if (hasUpgrade('li', 14)) gain = gain.mul(layers.li.LiboostElectrons()).floor();
                if (hasUpgrade('p', 71)) gain = gain.mul(upgradeEffect("p",71)).floor();
                if (hasUpgrade('li', 81)) gain = gain.mul(upgradeEffect("li",81)).floor();
                return "消耗 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(player.points)+"</span> 中微子，获得 <span style='color:#000077;text-shadow:0 0 10px'>"+format(gain)+"</span> 电子。<br>（至少转化 1e100 中微子）";
            },
            unlocked() { return true; },
            canClick() { return player.points.gte(1e100); },
            onClick() {
                let gain = player.points.add(1).log2().add(1).log2().add(1).floor();
                if (hasUpgrade('li', 14)) gain = gain.mul(layers.li.LiboostElectrons()).floor();
                if (hasUpgrade('p', 71)) gain = gain.mul(upgradeEffect("p",71)).floor();
                if (hasUpgrade('li', 81)) gain = gain.mul(upgradeEffect("li",81)).floor();
                player.points = zero
                player.p.electrons = player.p.electrons.add(gain);
            },
            style() {
                return {
                    'background-color': this.canClick() ? "#0000FF" : "#BF8F8F",
                };
            }
        }
    },
    tabFormat: {
        "中微子": {   
            content: [
                "main-display",
                "prestige-button",
                "buyables",
                ["upgrades",[1,2,3,4,5]],
            ],
        }, 
        "电子": {   
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function(){ 
                    return "你有 <span style='color:#0000FF;text-shadow:0 0 10px'>"+format(player.p.electrons)+"</span> 电子"; 
                }],
                "clickables",
                ["upgrades",[6,7]],
            ],
            unlocked(){return hasUpgrade("p",55)},
            buttonStyle: {'border-color': '#0000FF'},
            style: {
                background: "linear-gradient(135deg, #000000, #00003F)",
                minHeight: "100vh"
            }
        }
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
        if(player.c.energy.gte(1)) mult = mult.mul(layers.c.CEeffect2())
	    if(hasAchievement('a', 16)) mult = mult.mul(achievementEffect('a', 16))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = one
        if(player.b.inBorane) exp = exp.mul(0.5)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: 进行氢重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
            description:"解锁更多基本粒子升级，并小幅加成氢获取。",
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
            effect(){
                let effect = player.h.points.add(10).log(10).root(1.4)
                return effect
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
            description:"气球数量增幅锂电池上限",
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
                let effect = player.h.balloon.add(1)
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
            description:"气球优化氢的公式。",
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
            title:"粒子加速器1提升",
            description:"重构购买项粒子加速器1的效果公式",
            cost: new Decimal(100),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasMilestone("h",5)},
        },  
        52:{
            title:"氢能软上限提升",
            description:" 气球延迟氢能获取的软上限",
            cost: new Decimal(108),
            effect(){
                let eff = n(1.5).pow(player.h.balloon)
                eff = powsoftcap(eff,n(1e100),ten)
                return eff
            },
            effectDisplay(){return "x"+format(this.effect())},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasMilestone("h",5)},
        },  
        53:{
            title:"深度转生宝石",
            description:"移除计算转生宝石获取 深度部分的软上限",
            cost: new Decimal(124),
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasMilestone("h",5)},
        }, 
        54:{
            title:"奖励宝石增幅",
            description:"奖励宝石获取^2",
            cost: new Decimal(136),
            effect(){
                let eff = two
                return eff
            },
            effectDisplay(){return "^"+format(this.effect())},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasMilestone("h",5)},
        },
        55:{
            title:"强度折算弱化",
            description:"强度超级折算的指数-0.5",
            cost: new Decimal(139),
            effect(){
                let eff = n(0.5)
                return eff
            },
            effectDisplay(){return "-"+format(this.effect())},
            currencyDisplayName: "气球",
            currencyInternalName: "balloon",
            currencyLayer: "h",
            unlocked(){return hasMilestone("h",5)},
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
            effectDescription: "氦气球增益中微子，并解锁爆炸氦气球。",
            done(){return player.he.balloon.gte(7)},
            unlocked(){return hasUpgrade("h",43)},
        },
        5:{
            requirementDescription: "100 气球",
            effectDescription: "解锁第五行氢升级。",
            done(){return player.h.balloon.gte(100)},
            unlocked(){return hasMilestone("h",4)},
        },
    },
    clickables:{
        11:{
            title:"将氢转化成氢能",
            display() {return "将你一半的氢转化为氢能。<br>当前转化获取量:" + format(layers.h.HpowerGet()) + "<br>（至少转化 25000 氢）"},
            unlocked() {return true},
            canClick() {if (hasAchievement("a", 13)) return true;return player.h.points.gte(25000)},
            onClick() {
                player.h.power = player.h.power.add(layers.h.HpowerGet())
                player.h.points = player.h.points.div(2)
            },
        },
        12:{
            title:"将氢能输入进气球",
            display() {return "将你所有的氢能转化为气球。<br>转化后气球数量：" + format(player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor().max(0)) + "<br>下一个气球：" + format(layers.h.balloonFloor().pow(player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor().add(3))) + "氢能<br>"},
            unlocked() {return true},
            canClick() {return player.h.power.gte(layers.h.balloonFloor().pow(player.h.balloon.add(3)))},
            onClick() {
                player.h.balloon = player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor()
                if(player.h.balloonMax.lt(player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor())) player.h.balloonMax = player.h.power.add(1).log(10).sub(2).floor()
                player.h.power = zero
            },
        },
        13:{
            title:"将氦输入进气球",
            display() {return "将你所有的氦转化为氦气球。<br>转化后氦气球数量：" + format(player.he.points) + "<br>下一个氦气球：" + format(player.he.points.add(1)) + "氦<br>"},
            unlocked() {return hasUpgrade("h",43)},
            canClick() {return player.he.points.gte(player.he.balloon.add(1))},
            style() { return { 'background-color': this.canClick()?"#FFB6C1":"#BF8F8F"} },
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
            style() { return { 'background-color': this.canClick()?"#FFB6C1":"#BF8F8F"} },
            onClick() {
                player.he.upTime = player.he.upTime.add(layers.he.addUpTime())
                player.he.balloon = player.he.balloon.sub(player.he.balloon.div(2).floor())               
            },
            unlocked() {return hasMilestone("h",4)},
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
        if(player.h.keepUpTime&&hasMilestone("li",2)) player.h.upTime = layers.h.boomedBalloonBoostLimitTime()
        if(player.he.keepUpTime&&hasMilestone("li",5)) player.he.upTime = layers.he.boomedBalloonBoostLimitTime()
        if(player.h.upgradeAutobuy&&(hasMilestone("li",3)||hasUpgrade("c",11))){
            buyUpgrade("h",11);buyUpgrade("h",12);buyUpgrade("h",13);buyUpgrade("h",14);buyUpgrade("h",21);buyUpgrade("h",22);buyUpgrade("h",23);buyUpgrade("h",24);buyUpgrade("h",31);buyUpgrade("h",32);buyUpgrade("h",33);buyUpgrade("h",34);buyUpgrade("h",41);buyUpgrade("h",42);buyUpgrade("h",43);buyUpgrade("h",44)
            if(hasUpgrade("li",71)||hasUpgrade("c",11)){
                buyUpgrade("h",15);buyUpgrade("h",25);buyUpgrade("h",35);buyUpgrade("h",45)
            }
        }
        if(player.he.upgradeAutobuy&&(hasMilestone("li",4)||hasUpgrade("c",11))){
            buyUpgrade("he",11);buyUpgrade("he",12);buyUpgrade("he",21);buyUpgrade("he",22);buyUpgrade("he",23);buyUpgrade("he",24);buyUpgrade("he",31);buyUpgrade("he",32);buyUpgrade("he",33);buyUpgrade("he",34);
            if(hasUpgrade("li",71)||hasUpgrade("c",11)){
                buyUpgrade("he",41);buyUpgrade("he",42);buyUpgrade("he",43);buyUpgrade("he",44);buyUpgrade("he",45);buyUpgrade("he",51);buyUpgrade("he",52);buyUpgrade("he",53);buyUpgrade("he",54);buyUpgrade("he",55);buyUpgrade("he",61);buyUpgrade("he",62);buyUpgrade("he",63)
            }
        } 
        if(hasMilestone("li",6)&&player.h.autoGetHpowerBalloon) {
            player.h.power = player.h.power.add(layers.h.HpowerGet().div(hasMilestone("b",4)?0.1:10).mul(diff))
            player.h.balloon = player.h.power.add(1).log(layers.h.balloonFloor()).sub(2).floor()
            if(player.h.balloonMax.lt(player.h.balloon)) player.h.balloonMax = player.h.balloon
            if(player.h.balloon.lt(player.h.balloonMax)) player.h.balloon = player.h.balloonMax
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
        let get = player.h.points.div(2).root(2)
        if(hasMilestone("h",3)) get = get.mul(2)
        if(hasUpgrade("h",32)) get = get.mul(upgradeEffect("h",32))
        if(hasUpgrade("h",33)) get = get.mul(upgradeEffect("h",33))
        if(getBuyableAmount("he",11).gte(1)) get = get.mul(buyableEffect("he",11))
        if(player.h.upTime.gt(0)) get = get.mul(layers.h.boomedBalloonBoostHpower())
        if(player.he.upTime.gt(0)) get = get.mul(layers.he.boomedBalloonBoostHpower())
        if(player.li.unlocked) get = get.mul(layers.li.LiboostHpower())
        if(hasUpgrade("li",42)) get = get.mul(upgradeEffect("li",42))
        if(hasMilestone("he",8)) get = get.mul(layers.he.temPointBoostHpower())

        if(get.gte("e61")) get = powsoftcap(get,layers.h.HpowerGetsoftcap1start(),three) //1软

        if(hasUpgrade("b",22)) get = get.mul(upgradeEffect("b",22))
        if(player.c.energy.gte(1)) get = get.mul(layers.c.CEeffect2())

        if(player.b.inBorane) get = get.add(1).pow(0.8).add(1)
        return get
    },
    HpowerGetsoftcap1start(){
        let start = n("e61")
        if(hasUpgrade("h",52)) start = start.mul(upgradeEffect("h",52))
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
        if(player.b.inBorane) floor = floor.add(10)
        return floor
    },
    tabFormat: {
        "主页": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", 
                    function(){return "你有 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(player.points)+"</span> 中微子"}],
                ["upgrades",[1,2,3,4,5]],
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
                ["clickables",[1]],
                ["display-text",function(){
                    let a = "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.power)+"</span> 氢能"
                    if(layers.h.HpowerGet().gt(layers.h.HpowerGetsoftcap1start())) a = a + "（受软上限限制）"
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
                    if(hasUpgrade("h",43)) a = "你有 <span style='color:#FFB6C1;text-shadow:0 0 10px'>"+format(player.he.balloon)+"</span> 氦气球"
                    if(hasMilestone("h",4)) b = "，氦气球加成中微子 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(layers.he.balloonBoostPoints())+"</span> 倍"
                    return a + b
                }],
                ["clickables",[2]],
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
    color: "#FFB6C1",
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
        if(hasUpgrade("b",32)) mult = mult.div(upgradeEffect("b",32))
        if(player.c.energy.gte(1)) mult = mult.div(layers.c.CEeffect2())
        if(hasAchievement('a', 21)) mult = mult.div(achievementEffect('a', 21))
        if(hasMilestone("be",1)) mult = mult.div(2)
        if(hasUpgrade("p",64)) mult = mult.div(upgradeEffect("p",64))
        if(hasUpgrade("p",72)) mult = mult.div(upgradeEffect("p",72))
        if(hasUpgrade("li",72)) mult = mult.div(upgradeEffect("li",72))
        return mult
    },
    gainExp() {
        exp = one
        return exp
    },
    row: 0,
    hotkeys: [
        {key: "e", description: "E: 进行氦重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
            description:"解锁新的中微子升级，并加成 粒子加速器|Alef 上限 50",
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
            description:" 氦提升 温度点效果|蓐收 软上限。",
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
            description:" 温度点加成 高阶冷却 的效果。",
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
            title:"时间扩容",
            description:"电能数量提升提升冷却氦的时间上限",
            effect(){
                let effect = player.li.currentElectricity.add(2).log(2)
                return effect
            },
            cost: new Decimal("1e80"),
            effectDisplay(){return "x"+format(this.effect())},
            unlocked(){return hasUpgrade("he",63)&&hasMilestone("be",9)},
            currencyDisplayName: "温度点",
            currencyInternalName: "temPoint",
            currencyLayer: "he",
        },
        65:{
            title:"计算优化转换",
            description:"镐子伤害计算优化,深度计算速率不再受刷新率影响,修改深度计算公式和深度进度条上的文本,深度奖励宝石持续触发",
            cost: new Decimal("1e87"),
            unlocked(){return hasUpgrade("he",63)&&hasMilestone("be",9)},
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
            requirementDescription: "氦温度低于 1e15",
            effectDescription: "进一步加成 温度点效果|祝融。",
            done(){return player.he.temperature.lte(1e15)},
            unlocked(){return hasMilestone("he",8)},
        },
        10:{
            requirementDescription: "氦温度低于 4e12",
            effectDescription: "解锁 温度点效果|天吴",
            done(){return player.he.temperature.lte(4e12)},
            unlocked(){return hasMilestone("he",9)},
        },
        11:{
            requirementDescription: "氦温度低于 -242",
            effectDescription: "解锁 温度点效果|玄冥。",
            done(){return player.he.temperature.lte(31.15)},
            unlocked(){return hasMilestone("he",10)},
        },
    },
    clickables:{
        11:{
            title:"冷却氦",
            display() {return "点击或按住来冷却氦<br>每次点击可获得 <span style='color:#775500;text-shadow:0 0 10px'>"+format(layers.he.temPointGet())+"</span>  温度点"}, 
            unlocked() {return hasUpgrade("he",41)},
            canClick() {return !hasMilestone("li",12)},
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
                return "你的氦现在的温度是 <span style='color:#FFB6C1;text-shadow:0 0 10px'>"+format(player.he.temperature.sub(273.15))+"</span> 摄氏度（距离绝对零度 <span style='color:#FFB6C1;text-shadow:0 0 10px'>"+format(player.he.temperature)+"</span>，进度 <span style='color:#FFB6C1;text-shadow:0 0 10px'>"+format(this.progress().mul(100))+"</span> %）"
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
        if(hasUpgrade("li",91)) get = get.mul(upgradeEffect("li",91))
        if(hasUpgrade("b",13)) get = get.mul(upgradeEffect("b",13))
        if(player.c.energy.gte(1)) get = get.mul(layers.c.CEeffect2())

        if(player.b.inBorane) get = get.add(1).pow(0.5).add(1)
        return get
    },
    temPointBoostH(){//温度点加氢
        let mult = player.he.temPoint.pow(2.386466).add(1)
        if(mult.gte(layers.he.temPointEffect1SoftcapStart())) mult = mult.div(layers.he.temPointEffect1SoftcapStart()).root(2).add(layers.he.temPointEffect1SoftcapStart())
        let savemult = powsoftcap(mult,layers.he.temPointEffect1SoftcapStart().mul("e82"),5)
        let root = savemult.log(1e24).max(5)
        mult = powsoftcap(mult,layers.he.temPointEffect1SoftcapStart().mul("e82"),root)
        return mult
    }, 
    temPointBoostHpower(){//温度点加氢能
        let mult = player.he.temPoint.add(10).log(10).pow(3)
        //if(mult.gte(layers.he.temPointEffect5SoftcapStart())) mult = powsoftcap(mult,layers.he.temPointEffect5SoftcapStart(),five)
        return mult
    },
    temPointBoostPoints(){//温度点加点
        let exp = n(0.8)
        if(hasUpgrade("he",51)) exp = exp.add(upgradeEffect("he",51))
        let mult = player.he.temPoint.pow(exp).add(1)
        if(mult.gte(layers.he.temPointEffect3SoftcapStart())) mult = mult.div(layers.he.temPointEffect3SoftcapStart()).root(1.5).add(layers.he.temPointEffect3SoftcapStart())
        let savemult = powsoftcap(mult,layers.he.temPointEffect3SoftcapStart().mul("2e58"),3)
        let root = savemult.log(n(1e115).root(3)).max(3)
        mult = powsoftcap(mult,layers.he.temPointEffect3SoftcapStart().mul("2e58"),root)
        return mult
    },
    temPointEffect1SoftcapStart(){//温度点效果1软上限起点
        let start = n(100000)
        if(hasUpgrade("he",43)) start = start.mul(upgradeEffect("he",43))
        return start
    },
    temPointEffect2SoftcapStart(){//温度点效果2软上限起点
        let start = n(1e123)
        if(hasUpgrade("he",43)) start = start.mul(upgradeEffect("he",43))
        return start
    },
    temPointEffect3SoftcapStart(){//温度点效果3软上限起点
        let start = n(1e10)
        if(hasUpgrade("he",52)) start = start.mul(upgradeEffect("he",52))
        return start
    },
    temPointEffect6SoftcapStart(){//温度点效果6软上限起点
        let start = n(100)
        return start
    },
    temPointdivHecost(){//温度点减氦价格
        let divt = player.he.temPoint.root(2).add(1)
        if(hasMilestone("he",6)) divt = divt.pow(4)
        savedivt = powsoftcap(divt,layers.he.temPointEffect2SoftcapStart(),five)
        root = savedivt.log(1e36).max(5)
        divt = powsoftcap(divt,layers.he.temPointEffect2SoftcapStart(),root)
        return divt
    },
    temPointdivLicost(){//温度点减锂价格
        let divt = player.he.temPoint.add(2).log(1.7).mul(3)
        if(!hasMilestone("he",4)) divt = zero
        if(hasMilestone("he",5)) divt = divt.pow(3)
        if(hasMilestone("he",9)) divt = divt.pow(5)
        return divt
    },
    temPointEffect6(){//温度点延迟深度超级折算
        let num = player.he.temPoint.div("e140").max(1).add(2).log(2)
        num = powsoftcap(num,layers.he.temPointEffect6SoftcapStart(),two)
        return num
    },
    temPointEffect7(){
        let num = player.he.temPoint.div("e240").max(1).add(2).log(10)
        return num
    },
    addtemPointUpTime(){//温度点提升时间
        let t = ten
        if(hasUpgrade("li",61)) t = n(60)
        if(hasUpgrade("he",64)) t=t.mul(upgradeEffect("he",64))
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
        if(hasUpgrade("he",63))player.he.temperature = n(1.4e32).div(player.he.temPoint.add(100).root(8))
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
                "buyables",["upgrades",[1,2,3]]
            ],
            unlocked(){return hasMilestone("li",5)}
        },
        "冷却": {
            content: [
                "main-display",
                "prestige-button",   
                ["display-text", 
                    function(){return "你有 <span style='color:#FFFFFF;text-shadow:0 0 10px'> "+format(player.points)+"</span> 中微子"}],
                ["bar","temperature"],["display-text",function(){return "<h4>你有 <span style='color:#FFB6C1;text-shadow:0 0 10px'>"+format(player.he.temPoint)+"</span> 温度点（其实就是它们在计算温度）</h4>"}],
                ["display-text",function(){
                    let a = "<h4>"
                    if(hasMilestone("he",1)) {
                        a = a + "温度点效果|蓐收：使氢获取变为原来的 <span style='color:#FF66CC;text-shadow:0 0 10px'> "+format(layers.he.temPointBoostH())+"</span> 倍"
                        if(layers.he.temPointBoostH().gte(layers.he.temPointEffect1SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"     
                    }       
                    if(hasMilestone("he",2)) {
                        a = a + "温度点效果|句芒：使氦价格 / <span style='color:#FFB6C1;text-shadow:0 0 10px'> "+format(layers.he.temPointdivHecost())+"</span>"
                        if(layers.he.temPointdivHecost().gte(layers.he.temPointEffect2SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"     
                    }   
                    if(hasMilestone("he",3)) {
                        a = a + "温度点效果|共工：使中微子获取变为原来的 <span style='color:#FFFFFF;text-shadow:0 0 10px'> "+format(layers.he.temPointBoostPoints())+"</span> 倍"
                        if(layers.he.temPointBoostPoints().gte(layers.he.temPointEffect3SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"     
                    }       
                    if(hasMilestone("he",4)) {
                        a = a + "温度点效果|祝融：使锂价格 / <span style='color:#C8143C;text-shadow:0 0 10px'> "+format(layers.he.temPointdivLicost().add(1))+"</span>"
                        a = a + "<br>"     
                    }     
                    if(hasMilestone("he",8)) {
                        a = a + "温度点效果|后土：使氢能获取变为原来的 <span style='color:#FF66CC;text-shadow:0 0 10px'> "+format(layers.he.temPointBoostHpower())+"</span> 倍"
                        //if(layers.he.temPointBoostHpower().gte(layers.he.temPointEffect5SoftcapStart())) a = a + "（已达软上限）"
                        a = a + "<br>"     
                    }  
                    if(hasMilestone("he",10)) {
                        a = a + "温度点效果|天吴：使深度的超级折算延迟 " + format(layers.he.temPointEffect6())
                        if(layers.he.temPointEffect6().gte(layers.he.temPointEffect6SoftcapStart())) a = a + "（受软上限限制）"
                        a = a + "<br>"     
                    }   
                    if(hasMilestone("he",11)) {
                        a = a + "温度点效果|玄冥：使所有硼烷的基础获取 + " + format(layers.he.temPointEffect7())
                        a = a + "<br>"     
                    }   
                    return a + "</h4>"  
                }],["clickables",[1]],["upgrades",[4,5,6,7]],
            ],
            unlocked(){return hasMilestone("li",5)}
        },
        "里程碑": {   
            content: [
                "main-display",
                "prestige-button",   
                ["display-text",
                    function(){return "你有 "+format(player.points)+" 基本粒子"}],"blank"
                ["display-text",function(){return "你的氦现在的温度是 <span style='color:#FFB6C1;text-shadow:0 0 10px'>"+format(player.he.temperature)+"</span>"}],"milestones"
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
    position: 1,
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
    color: "#C8143C",
    requires: new Decimal(1e24),
    resource: "锂",
    baseResource: "氢",
    baseAmount() {return player.h.points},
    type: "static",
    exponent: 1.8,
    gainMult() {
        mult = one
        if(hasMilestone("he",3)) mult = mult.div(layers.he.temPointdivLicost().add(1))
        if(hasUpgrade("li",51)) mult = mult.div(upgradeEffect("li",51))
        if(hasMilestone("be",1)) mult = mult.div(2)
        if(hasAchievement('a', 22)) mult = mult.div(achievementEffect('a',22))
        if(hasUpgrade("p",73)) mult = mult.div(upgradeEffect("p",73))
        if(hasUpgrade("li",72)) mult = mult.div(upgradeEffect("li",72))
            if(hasUpgrade("p",75)) mult = mult.div(upgradeEffect("p",75))
        if(player.c.energy.gte(1)) mult = mult.div(layers.c.CEeffect3())
        return mult
    },
    gainExp() {
        exp = one        
        return exp
    },
    row: 1,
    hotkeys: [
        {key: "l", description: "L: 进行锂重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
            description:"你可以同时购买研究21,22,31,32。",
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
                if(player.b.inBorane) effect = effect.add(1).pow(0.2).add(1)
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
            description:" 锂研究点购买量提升电池容量上限，且解锁一个电可购买与一个研究升级。",
            cost: new Decimal(3),
            effect(){
                let effect = new Decimal(1.7).pow(getBuyableAmount("li",11))
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
            description:"加成提升冷却氦时间上限 50 s，且加成时间倍增加成效果，并让你可以一直点击提升冷却氦。",
            cost: new Decimal(10),
            effect(){
                let effect = player.he.temPointUpTime.pow(3).add(1)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())+"(倍增提升效果)"},
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
        72:{
            title:"研究-52",
            description:"总研究点降低氦与锂的价格。",
            cost: new Decimal(1810),
            unlocked(){return hasUpgrade("li",62)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            effect(){
                let total = getBuyableAmount("li", 11)
                             .mul(getBuyableAmount("li", 12))
                             .mul(getBuyableAmount("li", 13));
                let extra = zero;
                if (player.c.energy.gte(1)) extra = extra.add(layers.c.CEeffect3().floor());
                let effect = total.add(extra).add(1);
                return effect;
            },
            effectDisplay(){return "x"+format(this.effect())},
            canAfford(){
                let canbuy = hasUpgrade("li",62)
                return canbuy
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
        82:{
            title:"研究-62",
            description:"深度超级折算 深度延迟(注:第六行研究能购买多个)",
            cost: new Decimal(16),
            unlocked(){return hasMilestone("be",7)},
            effect(){
                let effect = player.be.depth.div(2.5)
                effect = powsoftcap(effect,n(75),ten)
                return effect
            },
            effectDisplay(){return "延迟"+format(this.effect())},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",71)
                return canbuy
            },        
        },
        83:{
            title:"研究-63",
            description:"深度超级折算 转生宝石延迟",
            cost: new Decimal(16),
            effect(){
                let effect = player.be.prestiGems.add(2).log(2).mul(4)
                effect = powsoftcap(effect,n(100),ten)
                return effect
            },
            effectDisplay(){return "延迟"+format(this.effect())},
            unlocked(){return hasMilestone("be",7)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",71)
                return canbuy
            },        
        },
        91:{
            title:"研究-71",
            description:"温度点获取x30(平凡的)",
            cost: new Decimal(16),
            effect(){
                let effect = ten.mul(3)
                return effect
            },
            effectDisplay(){return "x"+format(this.effect()) },
            unlocked(){return hasUpgrade("li",81)&&hasUpgrade("li",82)&&hasUpgrade("li",83)},
            currencyDisplayName:"研究点",
            currencyInternalName:"researchPoint",
            currencyLayer:"li",
            canAfford(){
                let canbuy = hasUpgrade("li",81)&&hasUpgrade("li",82)&&hasUpgrade("li",83)
                return canbuy
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
                player.li.points = player.li.points.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
                player.li.researchPoint = layers.li.totalResearchPoints();
            },
            unlocked(){return hasMilestone("be",1)},
            style() { return { 'background-color': this.canAfford()?"#C8143C":"#BF8F8F" }},
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
                player.li.currentElectricity = player.li.currentElectricity.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
                player.li.researchPoint = layers.li.totalResearchPoints();
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
            display() { return "价格: <span style='color:#225533;text-shadow:0 0 10px'>"+format(this.cost(),0)+"</span> 转生宝石<br>当前数量：<span style='color:#225533;text-shadow:0 0 10px'>"+format(getBuyableAmount("li",13),0)+"</span>"},
            canAfford() { return player.be.prestiGems.gte(this.cost())},
            buy() {
                player.be.prestiGems = player.be.prestiGems.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
                player.li.researchPoint = layers.li.totalResearchPoints();
            },
            unlocked(){return hasUpgrade("be",13)},
            style() { return { 'background-color': this.canAfford()?"#50C878":"#BF8F8F"}},
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
            purchaseLimit(){
                let a = n(40)
                return a
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
                    player.li.researchPoint = layers.li.totalResearchPoints();
                    let U = [31,32,41,42,51,52,61,62,71,72,81,82,83,91];
                    for (let id in U) {
                        if (hasUpgrade("li", U[id])) {
                            player.li.upgrades.splice(player.li.upgrades.indexOf(U[id]), 1);
                                    }
                    }
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
            effectDescription: "自动购买迄今为止的氢升级，并自动获取重置时的 1% 氢 /s。",
            done(){return player.li.points.gte(3)},
            unlocked(){return hasMilestone("li",2)},
        },
        4:{
            requirementDescription: "4 锂",
            effectDescription: "最大重置氦，并自动购买迄今为止的氦升级。",
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
            effectDescription: "取消冷却氦可点击，但自动获取点击时的 100% 温度点 /s。",
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
        else if(random<0.42)return "0000FF"
        else return "FF00FF"
    },
    LiboostH(){//锂加氢
        let mult = player.li.points.pow(2).add(1)
        return mult
    }, 
    LiboostHpower(){//锂加氢能
        let mult = player.li.points.add(1)
        return mult
    }, 
    LidivHecost(){//锂减氦价格
        let divt = player.li.points.pow(1.5).add(1)
        return divt
    },
    LiboostTemPoint(){//锂加温度点
        let mult = five.pow(player.li.points.sub(6).max(0))
        if(hasMilestone("li",9)) mult = ten.pow(player.li.points.sub(6).max(0))

        if(player.b.inBorane) mult = mult.add(1).log(10)

        return mult
    },
    LiboostPoints(){//锂加中微子
        let mult = player.li.points.add(1).pow(2.5).add(1)
        return mult
    },
    LiboostElectrons(){//锂加电子
        let mult = player.li.points.add(1).pow(0.5).add(1)
        return mult
    },
    getElectricityCap(){//获取电量上限
        let capacity = new Decimal(100)
        if(hasUpgrade("h",25)) capacity = capacity.mul(upgradeEffect("h",25))
        if(hasUpgrade("he",62)) capacity = capacity.mul(upgradeEffect("he",62))
        if(hasUpgrade("li",52)) capacity = capacity.mul(upgradeEffect("li",52))
        if(getBuyableAmount("li",31)) capacity = capacity.mul(buyableEffect("li",31))
        if(hasAchievement('a',23)) capacity = capacity.mul(achievementEffect('a',14))
        if(hasUpgrade("be",24)) capacity = capacity.mul(upgradeEffect("be",24))
        return capacity
    },
    canGainElectricity(){
        return player.h.power.gte("e60") && player.li.hPowerConsumingPercentage > 0
    },
    electricityGain(){//获取每秒的电量加成
        if(!layers.li.canGainElectricity()) return zero
        let gain = player.h.power.mul(player.li.hPowerConsumingPercentage).div("e60").add(1).pow(0.25).add(1)
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
        let base = hasUpgrade("li", 62) ? li.mul(dian).mul(shi) : li.add(dian).add(shi);
        let extra = zero;
        if (player.c.energy.gte(1)) extra = extra.add(layers.c.CEeffect3().floor());
        return base.add(extra);
    },
    update(diff){
        if(player.li.resetTime - player.li.confirmTime > 5) player.li.confirmRespec = false
        if(layers.li.canGainElectricity()){
            player.li.currentElectricity = player.li.currentElectricity.add(layers.li.electricityGain().mul(diff)).min(layers.li.getElectricityCap())
            player.h.power = player.h.power.sub(player.h.power.mul(player.li.hPowerConsumingPercentage).div(n(100)))
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
                    function(){return "你有 <span style='color:#FF66CC;text-shadow:0 0 10px #FF66CC'>"+format(player.h.points)+"</span> 氢"}],
                ["display-text",
                    function(){
                        let a = "你的锂加成氢获取 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(layers.li.LiboostH())+"</span>x 加成氢能获取 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(layers.li.LiboostHpower())+"</span>x 降低氦价格 / <span style='color:#FFB6C1;text-shadow:0 0 10px'>"+format(layers.li.LidivHecost())+"</span>"
                        if (hasMilestone("li",6)) a = a + "<br>加成温度点获取 <span style='color:#FFDA00;text-shadow:0 0 10px'>"+format(layers.li.LiboostTemPoint())+"</span>x"
                        if (hasUpgrade("li",13)) a = a + " 加成中微子获取 <span style='color:#FFFFFF;text-shadow:0 0 10px'>"+format(layers.li.LiboostPoints())+"</span>x"
                        if (hasUpgrade("li",14)) a = a + " 加成电子获取 <span style='color:#0000FF;text-shadow:0 0 10px'>"+format(layers.li.LiboostElectrons())+"</span>x"
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
                
                ["display-text", function() {return "你有 <span style='color:#FF66CC;text-shadow:0 0 10px'>"+format(player.h.power)+"</span> 氢能,每秒生产 <span style='color:#DDDD33;text-shadow:0 0 10px'>"+format(layers.li.electricityGain())+"</span> 电能"}],
                ["display-text", "由于存储技术不完善 ，电池每秒流失上限 0.5 % 的电能!"],
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
                ["buyables",[1]],["display-text", function(){return "你有 <span style='color:#C8143C;text-shadow:0 0 10px'>"+format(player.li.researchPoint)+"</span> 研究点"}],["buyables",[2]],["upgrades",[3,4,5,6,7,8,9]],
                ["clickables",[1]]
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
    position: 2, 
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        depth: new Decimal(0),
        gems: new Decimal(0),
        prestiGems: new Decimal(0),
        beDamaged: new Decimal(0),
        loadingPickaxe: zero,
        bittingTime: zero,
    }},
    branches: ["he"],
    color: "#50C878",
    requires: new Decimal(444),
    resource: "铍",
    baseResource: "氦",
    baseAmount() {return player.he.points},
    type: "normal", 
    exponent: 25,
    gainMult() {
        mult = one
        if(hasUpgrade('be', 23)) mult = mult.mul(upgradeEffect('be', 23))
        if(hasAchievement('a', 24)) mult = mult.mul(achievementEffect('a', 24))
        if(player.c.energy.gte(1)) mult = mult.mul(layers.c.CEeffect3())
        return mult
    },
    gainExp() {
        exp = one
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
        {key: "b", description: "B: 进行铍重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
            unlocked() { return (player.be.prestiGems && player.be.prestiGems.gte(10))||hasUpgrade("be",[this.id]); }
        },
        12: {
            title: "卓越电子",
            description: "自动获取转化时的 100% 电子 /s。",
            cost: new Decimal(30),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("be",11)||hasUpgrade("be",[this.id]); },
        },
        13: {
            title: "绿石科技",
            description: "解锁石研究点，且研究点加成中微子与氢获取。",
            cost: new Decimal(40),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            effect(){
                if (hasUpgrade("li", 71)) {
                    let total = getBuyableAmount("li", 11)
                                 .mul(getBuyableAmount("li", 12))
                                 .mul(getBuyableAmount("li", 13));
                    let extra = zero;
                    if (player.c.energy.gte(1)) extra = extra.add(layers.c.CEeffect3().floor());
                    let effect = total.add(extra).add(1);
                    return effect;
                } else {
                    let effect = player.li.researchPoint.add(1);
                    return effect;
                }
            },
            effectDisplay(){return "x"+format(this.effect())},
            unlocked() { return hasUpgrade("be",12)||hasUpgrade("be",[this.id]); },
        },
        14: {
            title: "平行回归",
            description: "解锁新的锂研究。",
            cost: new Decimal(60),
            currencyDisplayName: "转生宝石",
            currencyInternalName: "prestiGems",
            currencyLayer: "be",
            unlocked() { return hasUpgrade("be",13)||hasUpgrade("be",[this.id]); },
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
        },
    },
    milestones:{
        1:{
            requirementDescription: "1铍",
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
            if (hasUpgrade('li', 14) && typeof layers.li.LiboostElectrons === 'function') {
                gain = gain.mul(layers.li.LiboostElectrons()).floor();
            }
            if (hasUpgrade('p', 71)) gain = gain.mul(upgradeEffect("p",71)).floor();
            if (hasUpgrade('li', 81)) gain = gain.mul(upgradeEffect("li",81)).floor();
            if (gain.gt(0)) {
                player.p.electrons = player.p.electrons.add(gain.mul(diff));
            }
        }
    },
    clickables: {
        21: {
            title: "转生",
            display() {
                let gain = player.be.points.add(1).ln().add(1).floor().max(1);
                return "重置中微子、电子、氢、氢能、气球、氦、氦气球、温度点、锂、电能、铍。<br>获得 <span style='color:#225533;text-shadow:0 0 10px'>" + format(gain) + "</span> 转生宝石。（至少需要 1e10 铍）";
            },
            unlocked() { return hasUpgrade("p",65); },
            canClick() { return player.be.points.gt(1e10); },
            onClick() {
                let gain = player.be.points.add(1).ln().add(1).floor();
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
                    'background-color': this.canClick() ? "#50C878" : "#BF8F8F",
                };
            }
        }
    },
    tabFormat:{
        "主页": {   
            content: [
                "main-display","prestige-button",   
                "milestones"
            ],
            unlocked(){return player.be.unlocked}
        },
        "转生宝石": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function(){ 
                    return "你有 <span style='color:#50C878;text-shadow:0 0 10px'>" + format(player.be.prestiGems) + "</span> 转生宝石";
                }],
                "clickables",
                "upgrades"
            ],
            unlocked(){ return hasUpgrade("p",65); }
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
    position: 3, 
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        inBorane: false,
        borane1: new Decimal(0),
        borane2: new Decimal(0),
        borane3: new Decimal(0),
        borane4: new Decimal(0),
        borane5: new Decimal(0),
        borane6: new Decimal(0),
        borane7: new Decimal(0),
        gainBorane: [],
        boraneGainFloorN: new Decimal(0),
    }},
    branches: ["he"],
    color: "brown",
    requires: new Decimal(1e85),
    resource: "硼",
    baseResource: "温度点",
    baseAmount() {return player.he.temPoint},
    type: "static", 
    exponent: 3,
    gainMult() {
        mult = one
        return mult
    },
    gainExp() {
        exp = one
        return exp
    },
    row: 2,
    layerShown(){return player.b.unlocked||hasAchievement("a",25)},
    resetsNothing(){return hasMilestone("b",1)},
    milestones:{
        0:{
            requirementDescription: "1 硼",
            effectDescription: "咕咕咕",
            done(){return player.b.points.gte(1)},
            unlocked(){return player.b.unlocked},
        },
        1:{
            requirementDescription: "2 硼",
            effectDescription: "咕咕咕",
            done(){return false},
            unlocked(){return false},
        },
        2:{
            requirementDescription: "6硼",
            effectDescription: "解锁硼烷",
            done(){return false},
            unlocked(){return false},
        },
        3:{
            requirementDescription: "在制取硼烷的过程中----15气球&30氦",
            effectDescription: "解锁癸硼烷,己硼烷,戊硼烷",
            done(){return player.b.inBorane&&player.h.balloon.gte(15)&&player.he.points.gte(30)},
            unlocked(){return hasMilestone("b",2)},
        },
        4:{
            requirementDescription: "在制取硼烷的过程中----21气球&1e9温度点",
            effectDescription: "解锁丁硼烷,每秒自动获取转化时的1000%氢能",
            done(){return player.b.inBorane&&player.h.balloon.gte(21)&&player.he.temPoint.gte(1e9)},
            unlocked(){return hasMilestone("b",2)},
        },
    },
    upgrades:{
        11:{
            title:"癸硼烷基础",
            description:"所有硼烷的基础获取+1",
            effect(){
                let effect = one
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(300),
            unlocked(){return player.b.unlocked},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",      
        },
        12:{
            title:"癸硼烷粒子",
            description:"基本粒子获取 癸硼烷而提升",
            effect(){
                let effect = player.b.borane1.max(1)
                effect = powsoftcap(effect,n(1e20),n(three))
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(2400),
            unlocked(){return hasUpgrade("b",11)},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",      
        },
        13:{
            title:"癸硼烷温度点",
            description:"温度点获取 癸硼烷而提升",
            effect(){
                let effect = player.b.borane1.max(1)
                effect = powsoftcap(effect,n(1e20),n(three))
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(50000000),
            unlocked(){return hasUpgrade("b",12)},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",      
        },
        14:{
            title:"选择更多硼烷II",
            description:"选择更多硼烷效果x2",
            effect(){
                let effect = 2
                if(hasUpgrade("b",24)) effect += upgradeEffect("b",24)
                return effect
            },
            effectDisplay(){return this.effect()+"x"},
            cost: new Decimal(1e9),
            unlocked(){return hasUpgrade("b",13)},
            currencyDisplayName:"癸硼烷",
            currencyInternalName:"borane1",
            currencyLayer:"b",      
        },
        21:{
            title:"己硼烷基础",
            description:"所有硼烷的基础获取+1",
            effect(){
                let effect = one
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(200),
            unlocked(){return player.b.unlocked},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",      
        },
        22:{
            title:"己硼烷氢能",
            description:"氢能获取 己硼烷而提升(软上限后)",
            effect(){
                let effect = player.b.borane2.max(1).root(1.5)
                effect = powsoftcap(effect,n(1e20),n(three))
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(600),
            unlocked(){return hasUpgrade("b",21)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",      
        },
        23:{
            title:"己硼烷癸硼烷",
            description:"癸硼烷获取 己硼烷而提升",
            effect(){
                let effect = player.b.borane2.max(1).root(3)
                effect = powsoftcap(effect,n(1e20),n(three))
                return effect
            },
            effectDisplay(){return format(this.effect())+"x"},
            cost: new Decimal(500000),
            unlocked(){return hasUpgrade("b",22)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",      
        },
        24:{
            title:"选择更多硼烷III",
            description:"选择更多硼烷II的效果+1",
            effect(){
                let effect = 1
                return effect
            },
            effectDisplay(){return "+"+this.effect()},
            cost: new Decimal(50000000),
            unlocked(){return hasUpgrade("b",23)},
            currencyDisplayName:"己硼烷",
            currencyInternalName:"borane2",
            currencyLayer:"b",      
        },
        31:{
            title:"戊硼烷基础",
            description:"所有硼烷的基础获取+1",
            effect(){
                let effect = one
                return effect
            },
            effectDisplay(){return "+"+format(this.effect())},
            cost: new Decimal(250),
            unlocked(){return player.b.unlocked},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",      
        },
        32:{
            title:"戊硼烷氦价格",
            description:"氦价格 戊硼烷而降低",
            effect(){
                let effect = player.b.borane3.max(1)
                effect = powsoftcap(effect,n(1e20),n(three))
                return effect
            },
            effectDisplay(){return "/"+format(this.effect())},
            cost: new Decimal(600),
            unlocked(){return hasUpgrade("b",31)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",      
        },
        33:{
            title:"戊硼烷己硼烷",
            description:"己硼烷获取 戊硼烷而提升",
            effect(){
                let effect = player.b.borane3.max(1).root(4)
                effect = powsoftcap(effect,n(1e20),n(three))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(30000),
            unlocked(){return hasUpgrade("b",32)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",      
        },
        34:{
            title:"硼效果发散",
            description:" 硼加成效果发散和效果发散II的效果",
            effect(){
                let effect = player.b.points.min(20).max(1)
                return effect
            },
            effectDisplay(){return "^"+format(this.effect())},
            cost: new Decimal(8000000),
            unlocked(){return hasUpgrade("b",33)},
            currencyDisplayName:"戊硼烷",
            currencyInternalName:"borane3",
            currencyLayer:"b",      
        },
        41:{
            title:"丁硼烷癸己戊",
            description:"丁硼烷加成癸硼烷己硼烷戊硼烷的获取",
            effect(){
                let effect = player.b.borane4.root(4).add(1)
                effect = powsoftcap(effect,n(1e20),n(ten))
                if(hasUpgrade("b",44)) effect = effect.pow(upgradeEffect("b",44))
                return effect
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(500),
            unlocked(){return hasMilestone("b",4)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",      
        },
        42:{
            title:"选择更多硼烷",
            description:"你可以多选择生产一种硼烷",
            effect(){
                let effect = 1
                if(hasUpgrade("b",14)) effect *= upgradeEffect("b",14)
                return effect
            },
            effectDisplay(){return "+"+this.effect()},
            cost: new Decimal(1000),
            unlocked(){return hasUpgrade("b",41)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",      
        },
        43:{
            title:"丁硼烷粒子",
            description:" 丁硼烷加成基本粒子获取",
            effect(){
                let effect = player.b.borane4.pow(2.5)
                effect = powsoftcap(effect,n(1e30),five)
                if(hasUpgrade("b",44)) effect = effect.pow(upgradeEffect("b",44))
                return effect
            },
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(75000),
            unlocked(){return hasUpgrade("b",42)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",      
        },
        44:{
            title:"效果提升与基础硼烷",
            description:"本行的第一个升级和第三个升级效果^2,基础硼烷获取获取 氦倍增",
            effect(){
                let effect = two
                return effect
            },
            effect2(){
                let effect = player.he.points.max(1)
                return effect
            },
            effectDisplay(){return "^"+format(this.effect())+",x" + format(this.effect2())},
            cost: new Decimal(1000000),
            unlocked(){return hasUpgrade("b",43)},
            currencyDisplayName:"丁硼烷",
            currencyInternalName:"borane4",
            currencyLayer:"b",      
        },
    },
    clickables:{
        11:{
            title() {return "制取硼烷--" + (player.b.inBorane?"结束":"开始")},
            display() {
                let text = "当前状态:" + (player.b.inBorane?"进行中":"闲置") + "<br><h3>"
                text += "开始制取硼烷时,进行一次铍重置,但保留一些重要升级<br>在制取硼烷的过程中,基本粒子获取^0.75,气球获取底数+10,温度点获取^0.5,氢获取^0.5,氢能获取^0.8,锂第四效果log10,锂研究-22效果^0.2,深度第三效果log10<br>结束制取硼烷时, 气球数量和温度点数量获取硼烷获取基数,<br>当前: "+format(player.b.boraneGainFloorN)+"<br>当前结束制取硼烷可获得 " + format(layers.b.boraneGainFloor()) + "(+"+format(layers.b.boraneGainFloor().sub(player.b.boraneGainFloorN).max(0))+") 硼烷获取基数"
                return text
            },
            canClick() {return player.b.inBorane||canReset("be")},
            onClick() {
                if(player.b.inBorane){//结算
                    player.b.boraneGainFloorN = layers.b.boraneGainFloor().max(player.b.boraneGainFloorN)
                    player.b.inBorane = false
                }
                else {//开始
                    player.b.inBorane = true
                    doReset("be");player.p.upgrades=[54];setBuyableAmount("p",11,zero);setBuyableAmount("p",12,zero);setBuyableAmount("p",13,zero);player.he.upgrades=[65];player.h.upgrades=[24]
                }
            },
            style() { return { 'background-color': "#A52A2A",'border-radius': "0px", height: "120px", width: "650px" } },
        },
        21:{
            title() {return "重新选择生产硼烷"},
            display() {return "上限量:" + layers.b.chooseBoraneGainMax() + "<br>已选择:" + player.b.gainBorane.length},
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
            style() { return { 'background-color': this.canClick()?"white":"#BF8F8F",'border-radius': "0px",height: "240px", width: "60px"} },
            unlocked(){return hasMilestone("b",3)},
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
            style() { return { 'background-color': this.canClick()?"red":"#BF8F8F",'border-radius': "0px",height: "120px", width: "180px"} },
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
            style() { return { 'background-color': this.canClick()?"orange":"#BF8F8F",'border-radius': "0px",height: "120px", width: "180px"} },
            unlocked(){return hasMilestone("b",3)},
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
            style() { return { 'background-color': this.canClick()?"yellow":"#BF8F8F",'border-radius': "0px",height: "120px", width: "180px"} },
            unlocked(){return hasMilestone("b",3)},
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
            style() { return { 'background-color': this.canClick()?"green":"#BF8F8F",'border-radius': "0px",height: "120px", width: "180px"} },
            unlocked(){return hasMilestone("b",4)},
        },
        42:{
            title() {return "选择生产丙硼烷"},
            display(){if(player.b.gainBorane.includes(5))return "生产中"},
            canClick() {
            if (!player.b.gainBorane.includes(5)&&player.b.gainBorane.length<layers.b.chooseBoraneGainMax()) return true
            return false
            },
            onClick() {
                player.b.gainBorane.push(5)
            },
            style() { return { 'background-color': this.canClick()?"cyan":"#BF8F8F",'border-radius': "0px",height: "120px", width: "180px"} },
            unlocked(){return hasMilestone("b",5)},
        },
        43:{
            title() {return "选择生产乙硼烷"},
            display(){if(player.b.gainBorane.includes(6))return "生产中"},
            canClick() {
            if (!player.b.gainBorane.includes(6)&&player.b.gainBorane.length<layers.b.chooseBoraneGainMax()) return true
            return false
            },
            onClick() {
                player.b.gainBorane.push(6)
            },
            style() { return { 'background-color': this.canClick()?"blue":"#BF8F8F",'border-radius': "0px",height: "120px", width: "180px"} },
            unlocked(){return hasMilestone("b",6)},
        },
    },
    boraneGainFloor(){
        let gain = zero
        if(player.b.inBorane) gain = player.h.balloon.mul(player.he.temPoint.max(10).log(10))
        if(hasUpgrade("b",44)) gain = gain.mul(upgradeEffect2("b",44))
        return gain
    },
    boraneGain(num){
        let gain = one
        if(!player.b.gainBorane.includes(num)) return zero
        if(hasUpgrade("b",11)) gain = gain.add(upgradeEffect("b",11))
        if(hasUpgrade("b",21)) gain = gain.add(upgradeEffect("b",21))
        if(hasUpgrade("b",31)) gain = gain.add(upgradeEffect("b",31))
        if(hasMilestone("he",10)) gain = gain.add(layers.he.temPointEffect7())
        if(player.c.energy.gte(1)) gain = gain.add(layers.c.CEeffect3())        
        if(num==1){gain = gain.mul(player.b.boraneGainFloorN)}
        else if(num==2||num==3)gain = gain.mul(player.b.boraneGainFloorN.div(n(num).mul(2.5)))
        else if(num==4||num==5)gain = gain.mul(player.b.boraneGainFloorN.div(n(num).pow(3)))
        else if(num==6)gain = gain.mul(player.b.boraneGainFloorN.root(2))
        if((num==1||num==2||num==3)&&hasUpgrade("b",41)) gain = gain.mul(upgradeEffect("b",41))
        if(num==1&&hasUpgrade("b",23)) gain = gain.mul(upgradeEffect("b",23))
        if(num==2&&hasUpgrade("b",33)) gain = gain.mul(upgradeEffect("b",33))
        return gain
    },
    chooseBoraneGainMax(){
        let num = 1
        if(hasUpgrade("b",42)) num += upgradeEffect("b",42)
        return num
    },
    update(diff){
        player.b.borane1 = player.b.borane1.add(layers.b.boraneGain(1).mul(diff))
        player.b.borane2 = player.b.borane2.add(layers.b.boraneGain(2).mul(diff))
        player.b.borane3 = player.b.borane3.add(layers.b.boraneGain(3).mul(diff))
        player.b.borane4 = player.b.borane4.add(layers.b.boraneGain(4).mul(diff))
        player.b.borane5 = player.b.borane5.add(layers.b.boraneGain(5).mul(diff))
        player.b.borane6 = player.b.borane6.add(layers.b.boraneGain(6).mul(diff))
    },
    tabFormat:{
        "里程碑": {   
            content: [
                "main-display","prestige-button",   
                "milestones"
            ],
            unlocked(){return player.b.unlocked}
        },
        "boranes": {   
            content: [
                "main-display","prestige-button",  
                ["clickables",[1]],
                ["row",[["clickable",21],["clickables",[3,4]]]],
                ["display-text",function(){
                    let text1 = "";let text2 = "";let text3= "";let text4 = "";let text5 = "";let text6 = "";
                    if(hasMilestone("b",3)){
                        text1 = "你有 " + format(player.b.borane1) + " 癸硼烷(+"+format(layers.b.boraneGain(1))+"/s)" 
                        text2 = "你有 " + format(player.b.borane2) + " 己硼烷(+"+format(layers.b.boraneGain(2))+"/s)" 
                        text3 = "你有 " + format(player.b.borane3) + " 戊硼烷(+"+format(layers.b.boraneGain(3))+"/s)" 
                    }
                    if(hasMilestone("b",4))text4 = "你有 " + format(player.b.borane4) + " 丁硼烷(+"+format(layers.b.boraneGain(4))+"/s)" 
                    if(hasMilestone("b",5))text5 = "你有 " + format(player.b.borane5) + " 丙硼烷(+"+format(layers.b.boraneGain(5))+"/s)" 
                    if(hasMilestone("b",6))text6 = "你有 " + format(player.b.borane6) + " 乙硼烷(+"+format(layers.b.boraneGain(6))+"/s)" 
                    return text1 + "<br>" + text2 + "<br>" + text3 + "<br>" + text4 + "<br>" + text5 + "<br>" + text6
                }]
            ],
            unlocked(){return hasMilestone("b",2)}
        },
        "upgrades": {   
            content: [
                "main-display","prestige-button",  
                ["display-text",function(){
                    let text1 = "";let text2 = "";let text3= "";let text4 = "";let text5 = "";let text6 = "";
                    if(hasMilestone("b",3)){
                        text1 = "你有 " + format(player.b.borane1) + " 癸硼烷(+"+format(layers.b.boraneGain(1))+"/s)" 
                        text2 = "你有 " + format(player.b.borane2) + " 己硼烷(+"+format(layers.b.boraneGain(2))+"/s)" 
                        text3 = "你有 " + format(player.b.borane3) + " 戊硼烷(+"+format(layers.b.boraneGain(3))+"/s)" 
                    }
                    if(hasMilestone("b",4))text4 = "你有 " + format(player.b.borane4) + " 丁硼烷(+"+format(layers.b.boraneGain(4))+"/s)" 
                    if(hasMilestone("b",5))text5 = "你有 " + format(player.b.borane5) + " 丙硼烷(+"+format(layers.b.boraneGain(5))+"/s)" 
                    if(hasMilestone("b",6))text6 = "你有 " + format(player.b.borane6) + " 乙硼烷(+"+format(layers.b.boraneGain(6))+"/s)" 
                    return text1 + "<br>" + text2 + "<br>" + text3 + "<br>" + text4 + "<br>" + text5 + "<br>" + text6
                }],["upgrades",[1,2,3,4,5,6]]
            ],
            unlocked(){return hasMilestone("b",3)}
        },
    },    
},)
addLayer("c", {
    name: "c",
    symbol: "C",
    position: 1, 
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        energy: zero,
        bestResetTime: 1.79e308,
    }},
    branches: ["li","be","b"],
    color: "#555555",
    requires: new Decimal("1e332"),
    resource: "碳",
    baseResource: "基本粒子",
    baseAmount() {return player.points},
    type: "normal", 
    exponent: 1/308,
    gainMult() {
        mult = one
        return mult
    },
    gainExp() {
        exp = one
        return exp
    },
    row: 3,
    doReset(){
        player.p.upgrades = [];setBuyableAmount("p",11,0);setBuyableAmount("p",12,0);setBuyableAmount("p",13,0)
    },
    effectDescription(){
        return "和 " + format(player.c.energy) + " CE" 
    },
    layerShown(){return player.p.points.gte(1.79e308)||player.c.unlocked},
    milestones:{
        0:{
            requirementDescription: "首次重置碳",
            effectDescription(){return "每个碳生产碳能量(CE),<br>当前效果: +" + format(this.effect()) + "/s(为0有效)"},
            effect(){
                let eff = player.c.points.add(1)
                return eff
            },
            done(){return player.c.unlocked},
            unlocked(){return true},
        },
    },
    upgrades:{
        11:{
            title:"碳-自动购买者",
            description:"自动购买所有之前的升级",
            cost: new Decimal(1),
            unlocked(){return player.c.unlocked},
        },
    },
    CEeffect1(){ //点数,宝石,奖励宝石
        let eff = player.c.energy.max(1).root(2)
        powsoftcap(eff,n(1e9),two)
        return eff
    },
    CEeffect2(){ //氢,氦,温度点,氢能
        let eff = player.c.energy.add(1).root(5)
        powsoftcap(eff,n(1e9),two)
        return eff
    },
    CEeffect3(){ //铍,转生宝石,锂,硼烷基础,额外研究点
        let eff = player.c.energy.max(10).log(10)
        return eff
    },
    update(diff){
        if(hasMilestone("c",0)) player.c.energy = player.c.energy.add(milestoneEffect("c",0).mul(diff))
        if(hasUpgrade("c",11)){
            buyUpgrade("li",11);buyUpgrade("li",12);buyUpgrade("li",21)
            buyUpgrade("be",11);buyUpgrade("be",12);buyUpgrade("be",13);buyUpgrade("be",14);buyUpgrade("be",15);buyUpgrade("be",21);buyUpgrade("be",23);buyUpgrade("be",22);buyUpgrade("be",24);buyUpgrade("be",25);buyUpgrade("be",31);buyUpgrade("be",32);buyUpgrade("be",33);buyUpgrade("be",34);buyUpgrade("be",35)
            buyUpgrade("b",11);buyUpgrade("b",12);buyUpgrade("b",13);buyUpgrade("b",14);buyUpgrade("b",21);buyUpgrade("b",22);buyUpgrade("b",23);buyUpgrade("b",24);buyUpgrade("b",31);buyUpgrade("b",32);buyUpgrade("b",33);buyUpgrade("b",34);buyUpgrade("b",41);buyUpgrade("b",42);buyUpgrade("b",43);buyUpgrade("b",44)
            buyUpgrade("h",51);buyUpgrade("h",52);buyUpgrade("h",53);buyUpgrade("h",54);buyUpgrade("h",55)
            buyUpgrade("p",11);buyUpgrade("p",12);buyUpgrade("p",13);buyUpgrade("p",14);buyUpgrade("p",15);buyUpgrade("p",21);buyUpgrade("p",23);buyUpgrade("p",22);buyUpgrade("p",24);buyUpgrade("p",25);buyUpgrade("p",31);buyUpgrade("p",32);buyUpgrade("p",33);buyUpgrade("p",34);buyUpgrade("p",35);buyUpgrade("p",51);buyUpgrade("p",52);buyUpgrade("p",53);buyUpgrade("p",54);buyUpgrade("p",55);buyUpgrade("p",41);buyUpgrade("p",42);buyUpgrade("p",43);buyUpgrade("p",44);buyUpgrade("p",45)
            buyUpgrade("he",64);buyUpgrade("he",65)
        }
    },
    tabFormat:{
        "milestones": {   
            content: [
                "main-display","prestige-button",["display-text",function(){
                    return "<h5>距离上次碳重置已经过去了 "+formatTime(player.c.resetTime) +"<br>你的最佳重置时间为 "+formatTime(player.c.bestResetTime)
                }], ["display-text",function(){
                    let text1 = "你的 CE 加成点数,宝石,奖励宝石获取 "+format(layers.c.CEeffect1())+"x<br>"
                    let text2 = "你的 CE 加成氢,氢能,温度点获取 "+format(layers.c.CEeffect2())+"x,和降低氦价格 /"+format(layers.c.CEeffect2())+"<br>"
                    let text3 = "你的 CE 加成铍,转生宝石 "+format(layers.c.CEeffect3())+"x,和降低锂价格 /"+format(layers.c.CEeffect3())+",同时硼烷基础和研究点 +"+format(layers.c.CEeffect3().floor())+"<br>"
                    return text1 + text2 + text3
                }],  
                "milestones",                
            ],
            unlocked(){return player.c.unlocked}
        },
        "upgrades": {
            content: [
                "main-display","prestige-button",
                "upgrades",                
            ],
            unlocked(){return player.c.unlocked}
        }
    },    
},)
addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side",
    tooltip() {
        return ("成就")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "赢",
            done() {return player.points.gte(1e5)}, 
            tooltip: "获得 100000 基本粒子。<br>奖励：+1 中微子获取。", 
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
            effect() {return new Decimal(player.a.achievements.length).add(1).pow(0.5).add(1);},
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
            effect() {return new Decimal(player.a.achievements.length).add(1).pow(0.4).add(1);},
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
            effect() {return new Decimal(player.a.achievements.length).add(1).pow(0.9).add(1);},
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
            effect() {return new Decimal(player.a.achievements.length).add(1).pow(0.8).add(1);},
            unlocked() {return hasAchievement("a",16)}
        },
        23: {
            name: "科学万岁",
            done() {return player.li.researchPoint.gte(10)},
            tooltip: "获得 8 锂。<br>奖励：成就14的效果同样加成电能上限，并让电能流失速度降低 0.4%。", 
            effect() {return new Decimal(player.a.achievements.length).add(1).pow(0.3).add(1);},
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
            effect() {return new Decimal(player.a.achievements.length).add(1).pow(0.2).add(1);},
            unlocked() {return hasAchievement("a",16)}
        },
        25: {
            name: "电子云",
            done() {return player.p.electrons.gte(1000000)},
            tooltip: "要求：获得 1000000 电子。<br>奖励：解锁新层级。",
            unlocked() {return hasAchievement("a",16)}
        },
        26: {
            name: "26",
            done() {return player.b.points.gte(1)},
            tooltip: "获得1硼",
            unlocked() {return hasAchievement("a",99)}
        },
    },
    tabFormat:{
        '成就':{
            content:[
            //['infoboxes','main-text'],
            ['display-text', function() {
                return `你有 <h3 style="color: #FFFF3F; text-shadow:0 0 10px">${formatWhole(player.a.achievements.length)}</h3> 成就`;   
            }],
            'achievements',
            ],
        },
    },
    style: {
        background: "linear-gradient(135deg, #000000, #3F1F00)",
        minHeight: "100vh"
    },
},)
