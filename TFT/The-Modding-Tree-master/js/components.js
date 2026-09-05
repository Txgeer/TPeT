function loadVue() {
    if (typeof Vue === 'undefined' || !tmp) {
        setTimeout(loadVue, 50);
        return;
    }
    if (typeof player === 'undefined') {
        setTimeout(loadVue, 50);
        return;
    }
    if (Vue.config && Vue.config.compilerOptions) {
        Vue.config.compilerOptions.whitespace = 'condense';
    }
    if (Vue.configureCompat) {
        Vue.configureCompat({ TRANSITION_GROUP_ROOT: false });
    }

    if (!window.__reactiveProxies) {
        if (window.options && !window.options.__v_isReactive) {
            window.options = Vue.reactive(window.options);
        } else {
            window.options = Vue.reactive(options);
        }
        window.player = Vue.reactive(player);
        window.tmp = Vue.reactive(tmp);
        window.options = Vue.reactive(options);
        player = window.player;
        tmp = window.tmp;
        options = window.options;
        window.activePopups = Vue.reactive(activePopups);
        window.__reactiveProxies = true;
    }

    if (window.__vueMounted) return;
    window.__vueMounted = true;

    const app = Vue.createApp({
        mounted() {
            window.__vueRoot = this;
        }
    });

    app.mixin({
        computed: {
            player() { return window.player; },
            tmp() { return window.tmp; },
            options() { return window.options; },
            activePopups() { return window.activePopups; }
        }
    });

    app.config.globalProperties.layers = layers;
    app.config.globalProperties.readData = readData;
    app.config.globalProperties.layoutInfo = layoutInfo;
    app.config.globalProperties.particles = particles;
    app.config.globalProperties.LAYERS = LAYERS;
    app.config.globalProperties.activePopups = activePopups;
    app.config.globalProperties.hotkeys = hotkeys;
    app.config.globalProperties.mouseX = mouseX;
    app.config.globalProperties.mouseY = mouseY;
    app.config.globalProperties.shiftDown = shiftDown;
    app.config.globalProperties.ctrlDown = ctrlDown;
    app.config.globalProperties.Decimal = Decimal;
    app.config.globalProperties.VERSION = VERSION;
    app.config.globalProperties.modInfo = modInfo;
    app.config.globalProperties.TMT_VERSION = TMT_VERSION;
    app.config.globalProperties.MS_DISPLAYS = MS_DISPLAYS;
    app.config.globalProperties.MS_SETTINGS = MS_SETTINGS;
    app.config.globalProperties.OTHER_LAYERS = OTHER_LAYERS;
    app.config.globalProperties.ROW_LAYERS = ROW_LAYERS;
    app.config.globalProperties.TERR_LAYERS = TERR_LAYERS;
    app.config.globalProperties.maxRow = maxRow;
    app.config.globalProperties.needCanvasUpdate = needCanvasUpdate;

    const globalFunctionNames = [
        'goBack', 'showTab', 'showNavTab', 'nodeShown', 'layerunlocked',
        'constructNodeStyle', 'updateTabFormats', 
        'prestigeButtonText', 'challengeButtonText', 'challengeStyle',
        'achievementStyle', 'subtabShouldNotify', 'subtabResetNotify',
        'startChallenge', 'doReset', 'buyUpg', 'buyUpgrade', 'buyBuyable',
        'clickClickable', 'clickGrid', 'respecBuyables', 'toggleAuto',
        'hasUpgrade', 'hasMilestone', 'hasAchievement', 'hasChallenge',
        'maxedChallenge', 'getBuyableAmount', 'getClickableState', 'inChallenge',
        'canAffordUpgrade', 'canBuyBuyable', 'canCompleteChallenge',
        'canGenPoints', 'getPointGen',
        'format', 'formatWhole', 'formatTime', 'formatSmall',
        'toValue', 'focused', 'run', 'gridRun',
        'getThemeName', 'toggleMusic', 'toggleZoom', 'toggleTextSelect',
        'exportSave', 'importSave', 'hardReset', 'save', 'toggleOpt',
        'switchTheme', 'adjustMSDisp', 'closeDragHint',
        'updateBackgroundStyle', 'resizeCanvas', 'keepGoing','milestoneShown', 'constructBarStyle',
        'switchFont', 'applyFont', 'getFontDisplay'
    ];
    for (const fn of globalFunctionNames) {
        if (typeof window[fn] === 'function') {
            app.config.globalProperties[fn] = window[fn];
        }
    }

    // ---------- 注册所有组件 ----------
    app.component('display-text', {
        props: ['layer', 'data'],
        template: `<span class="instant" v-html="data"></span>`
    });
    app.component('raw-html', {
        props: ['layer', 'data'],
        template: `<span class="instant" v-html="data"></span>`
    });
    app.component('blank', {
        props: ['layer', 'data'],
        template: `
            <div class="instant">
                <div v-if="!data" style="width:8px; height:17px"></div>
                <div v-else-if="Array.isArray(data)" :style="{width: data[0], height: data[1]}"></div>
                <div v-else style="width:8px; height:data"><br></div>
            </div>
        `
    });
    app.component('display-image', {
        props: ['layer', 'data'],
        template: `<img class="instant" :src="data" :alt="data">`
    });
    app.component('row', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer]" class="upgTable instant">
            <div class="upgRow">
                <div v-for="(item, index) in (data || [])" :key="layer + '-' + index">
                    <component v-if="!Array.isArray(item)" :is="item" :layer="layer" :key="layer + '-' + index + '-if'"></component>
                    <component v-else-if="item.length==3" :is="item[0]" :layer="layer" :data="item[1]" :style="item[2]" :key="layer + '-' + index + '-elif3'"></component>
                    <component v-else-if="item.length==2" :is="item[0]" :layer="layer" :data="item[1]" :key="layer + '-' + index + '-elif2'"></component>
                </div>
            </div>
        </div>
    `
    });
    app.component('column', {
    inheritAttrs: false,
    props: ['layer', 'data', 'style'],
    template: `
        <div :style="style" v-bind="$attrs">
            <div v-for="(item, idx) in data" :key="idx">
                <component v-if="!Array.isArray(item)" :is="item" :layer="layer" />
                <component v-else-if="item.length === 2" :is="item[0]" :layer="layer" :data="item[1]" />
                <component v-else-if="item.length === 3" :is="item[0]" :layer="layer" :data="item[1]" :style="item[2]" />
            </div>
        </div>
    `
    });
    app.component('milestone', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].milestones && tmp[layer].milestones[data] !== undefined && milestoneShown(layer, data) && tmp[layer].milestones[data].unlocked" 
             :style="[tmp[layer].milestones[data].style]" 
             :class="{milestone: !hasMilestone(layer, data), tooltipBox: true, milestoneDone: hasMilestone(layer, data)}">
            <h3 v-html="tmp[layer].milestones[data].requirementDescription"></h3><br>
            <span v-html="run(layers[layer].milestones[data].effectDescription, layers[layer].milestones[data])"></span><br>
            <tooltip v-if="tmp[layer].milestones[data].tooltip" :text="tmp[layer].milestones[data].tooltip"></tooltip>
            <span v-if="(tmp[layer].milestones[data].toggles) && (hasMilestone(layer, data))" v-for="toggle in tmp[layer].milestones[data].toggles">
                <toggle :layer="layer" :data="toggle" :style="tmp[layer].componentStyles.toggle"></toggle>&nbsp;
            </span>
        </div>
    `
    });
    app.component('milestones', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].milestones" class="upgTable">
            <div v-for="(milestone, key) in ((data === undefined ? tmp[layer].milestones : data) || {})" :key="key">
                <div v-if="milestone && milestone.unlocked && milestoneShown(layer, key)">
                    <milestone :layer="layer" :data="key" :style="tmp[layer].componentStyles.milestone"></milestone>
                </div>
            </div>
            <br>
        </div>
    `
    });
    app.component('layer-proxy', {
    props: ['layer', 'data'],
    template: `
        <div>
            <column :layer="data[0]" :data="data[1]" :key="layer + '-col'"></column>
        </div>
    `
    });
    app.component('infobox', {
        props: ['layer', 'data'],
        template: `
            <div v-if="tmp[layer] && tmp[layer].infoboxes && tmp[layer].infoboxes[data] !== undefined && tmp[layer].infoboxes[data].unlocked" :style="[{'border-color': tmp[layer].color, 'border-radius': player.infoboxes[layer][data] ? 0 : '8px'}, tmp[layer].infoboxes[data].style]">
                <button class="story-title" :style="[{'background-color': tmp[layer].color}, tmp[layer].infoboxes[data].titleStyle]"
                    @click="player.infoboxes[layer][data] = !player.infoboxes[layer][data]">
                    <span class="story-toggle">{{player.infoboxes[layer][data] ? "+" : "-"}}</span>
                    <span v-html="tmp[layer].infoboxes[data].title ? tmp[layer].infoboxes[data].title : (tmp[layer].name)"></span>
                </button>
                <div v-if="!player.infoboxes[layer][data]" class="story-text" :style="tmp[layer].infoboxes[data].bodyStyle">
                    <span v-html="tmp[layer].infoboxes[data].body ? tmp[layer].infoboxes[data].body : 'Blah'"></span>
                </div>
            </div>
        `
    });
    app.component('h-line', {
        props: ['layer', 'data'],
        template: `<hr class="instant" :style="data ? {'width': data} : {}" class="hl">`
    });
    app.component('v-line', {
        props: ['layer', 'data'],
        template: `<div class="instant" :style="data ? {'height': data} : {}" class="vl2"></div>`
    });

    app.component('challenges', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].challenges" class="upgTable">
            <div v-for="row in ((data === undefined ? tmp[layer].challenges.rows : data) || [])" class="upgRow" :key="'row' + row">
                <div v-for="col in (tmp[layer].challenges.cols || [])" :key="'col' + col">
                    <challenge v-if="tmp[layer].challenges[row*10+col] !== undefined && tmp[layer].challenges[row*10+col].unlocked" :layer="layer" :data="row*10+col" :style="tmp[layer].componentStyles.challenge"></challenge>
                </div>
            </div>
        </div>
    `
    });
    app.component('challenge', {
        props: ['layer', 'data'],
        template: `
        <div v-if="tmp[layer] && tmp[layer].challenges && tmp[layer].challenges[data]!== undefined && tmp[layer].challenges[data].unlocked && !(options.hideChallenges && maxedChallenge(layer, [data]) && !inChallenge(layer, [data]))"
            :class="['challenge', challengeStyle(layer, data), player[layer].activeChallenge === data ? 'resetNotify' : '']" :style="tmp[layer].challenges[data].style">
            <br><h3 v-html="tmp[layer].challenges[data].name"></h3><br><br>
            <button :class="{ longUpg: true, can: true, [layer]: true }" :style="{'background-color': tmp[layer].color}" @click="startChallenge(layer, data)">{{challengeButtonText(layer, data)}}</button><br><br>
            <span v-if="layers[layer].challenges[data].fullDisplay" v-html="run(layers[layer].challenges[data].fullDisplay, layers[layer].challenges[data])"></span>
            <span v-else>
                <span v-html="tmp[layer].challenges[data].challengeDescription"></span><br>
                目标:  <span v-if="tmp[layer].challenges[data].goalDescription" v-html="tmp[layer].challenges[data].goalDescription"></span><span v-else>{{format(tmp[layer].challenges[data].goal)}} {{tmp[layer].challenges[data].currencyDisplayName ? tmp[layer].challenges[data].currencyDisplayName : modInfo.pointsName}}</span><br>
                奖励: <span v-html="tmp[layer].challenges[data].rewardDescription"></span><br>
                <span v-if="layers[layer].challenges[data].rewardDisplay!==undefined">当前: <span v-html="(tmp[layer].challenges[data].rewardDisplay) ? (run(layers[layer].challenges[data].rewardDisplay, layers[layer].challenges[data])) : format(tmp[layer].challenges[data].rewardEffect)"></span></span>
            </span>
            <node-mark :layer="layer" :data="tmp[layer].challenges[data].marked" :offset="20" :scale="1.5"></node-mark>
        </div>
        `
    });
    app.component('upgrades', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].upgrades" class="upgTable">
            <div v-for="row in ((data === undefined ? tmp[layer].upgrades.rows : data) || [])" class="upgRow" :key="'row' + row">
                <div v-for="col in (tmp[layer].upgrades.cols || [])" :key="'col' + col"><div v-if="tmp[layer].upgrades[row*10+col] !== undefined && tmp[layer].upgrades[row*10+col].unlocked" class="upgAlign">
                    <upgrade :layer="layer" :data="row*10+col" :style="tmp[layer].componentStyles.upgrade"></upgrade>
                </div></div>
            </div>
            <br>
        </div>
    `
    });
    app.component('upgrade', {
        props: ['layer', 'data'],
        template: `
        <button v-if="tmp[layer] && tmp[layer].upgrades && tmp[layer].upgrades[data]!== undefined && tmp[layer].upgrades[data].unlocked" :id="'upgrade-' + layer + '-' + data" @click="buyUpg(layer, data)" :class="{ [layer]: true, tooltipBox: true, upg: true, bought: hasUpgrade(layer, data), locked: (!(canAffordUpgrade(layer, data))&&!hasUpgrade(layer, data)), can: (canAffordUpgrade(layer, data)&&!hasUpgrade(layer, data))}"
            :style="[((!hasUpgrade(layer, data) && canAffordUpgrade(layer, data)) ? {'background-color': tmp[layer].color} : {}), tmp[layer].upgrades[data].style]">
            <span v-if="layers[layer].upgrades[data].fullDisplay" v-html="run(layers[layer].upgrades[data].fullDisplay, layers[layer].upgrades[data])"></span>
            <span v-else>
                <span v-if="tmp[layer].upgrades[data].title"><h3 v-html="tmp[layer].upgrades[data].title"></h3><br></span>
                <span v-html="tmp[layer].upgrades[data].description"></span>
                <span v-if="layers[layer].upgrades[data].effectDisplay"><br>当前: <span v-html="run(layers[layer].upgrades[data].effectDisplay, layers[layer].upgrades[data])"></span></span>
                <br><br>花费: {{ formatWhole(tmp[layer].upgrades[data].cost) }} {{(tmp[layer].upgrades[data].currencyDisplayName ? tmp[layer].upgrades[data].currencyDisplayName : tmp[layer].resource)}}
            </span>
            <tooltip v-if="tmp[layer].upgrades[data].tooltip" :text="tmp[layer].upgrades[data].tooltip"></tooltip>
        </button>
        `
    });
    app.component('toggle', {
        props: ['layer', 'data'],
        template: `
        <button class="smallUpg can" :style="{'background-color': tmp[data[0]].color}" @click="toggleAuto(data)">{{player[data[0]][data[1]]?"开":"关"}}</button>
        `
    });
    app.component('prestige-button', {
        props: ['layer', 'data'],
        data() {
            return {
                interval: false,
                time: 0
            };
        },
        methods: {
            start() {
                if (!this.interval) {
                    this.interval = setInterval(() => {
                        doReset(this.layer);
                        this.time = this.time + 1;
                    }, 50);
                }
            },
            stop() {
                clearInterval(this.interval);
                this.interval = false;
                this.time = 0;
            }
        },
        unmounted() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = false;
            }
        },
        template: `
            <button v-if="(tmp[layer].type !== 'none')"
                :class="{ [layer]: true, reset: true, locked: !tmp[layer].canReset, can: tmp[layer].canReset }"
                :style="[tmp[layer].canReset ? {'background-color': tmp[layer].color} : {}, tmp[layer].componentStyles['prestige-button']]"
                v-html="prestigeButtonText(layer)"
                @click="doReset(layer)"
                @mousedown="start"
                @mouseup="stop"
                @mouseleave="stop"
                @touchstart="start"
                @touchend="stop"
                @touchcancel="stop">
            </button>
        `
    });
    app.component('main-display', {
        props: ['layer', 'data'],
        template: `
        <div><span v-if="player[layer].points.lt('1e1000')">你有 </span><h2 :style="{'color': tmp[layer].color, 'text-shadow': '0px 0px 10px ' + tmp[layer].color}">{{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}</h2> {{tmp[layer].resource}}<span v-if="layers[layer].effectDescription">, <span v-html="run(layers[layer].effectDescription, layers[layer])"></span></span><br><br></div>
        `
    });
    app.component('resource-display', {
        props: ['layer'],
        template: `
        <div style="margin-top: -13px">
            <span v-if="tmp[layer].baseAmount"><br>你有 {{formatWhole(tmp[layer].baseAmount)}} {{tmp[layer].baseResource}}</span>
            <span v-if="tmp[layer].passiveGeneration"><br>你每秒获取 {{format(tmp[layer].resetGain.times(tmp[layer].passiveGeneration))}} {{tmp[layer].resource}}</span>
            <br><br>
            <span v-if="tmp[layer].showBest">你最高拥有 {{formatWhole(player[layer].best)}} 的 {{tmp[layer].resource}}<br></span>
            <span v-if="tmp[layer].showTotal">你总共拥有 {{formatWhole(player[layer].total)}} {{tmp[layer].resource}}<br></span>
        </div>
        `
    });
    app.component('buyables', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].buyables" class="upgTable">
            <respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer="layer" :style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['respec-button']]"></respec-button>
            <div v-for="row in ((data === undefined ? tmp[layer].buyables.rows : data) || [])" class="upgRow" :key="'row' + row">
                <div v-for="col in (tmp[layer].buyables.cols || [])" :key="'col' + col"><div v-if="tmp[layer].buyables[row*10+col] !== undefined && tmp[layer].buyables[row*10+col].unlocked" class="upgAlign" :style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
                    <buyable :layer="layer" :data="row*10+col"></buyable>
                </div></div>
                <br>
            </div>
        </div>
    `
    });
    app.component('buyable', {
    props: ['layer', 'data', 'size'],
    template: `
    <div v-if="tmp[layer] && tmp[layer].buyables && tmp[layer].buyables[data]!== undefined && tmp[layer].buyables[data].unlocked" style="display: grid">
        <button :class="{ buyable: true, tooltipBox: true, can: tmp[layer].buyables[data].canBuy, locked: !tmp[layer].buyables[data].canAfford, bought: player[layer].buyables[data].gte(tmp[layer].buyables[data].purchaseLimit)}"
            :style="[tmp[layer].buyables[data].canBuy ? {'background-color': tmp[layer].color} : {}, size ? {'height': size, 'width': size} : {}, tmp[layer].componentStyles.buyable, tmp[layer].buyables[data].style]"
            @click="() => { if (!interval) buyBuyable(layer, data); }" :id="'buyable-' + layer + '-' + data" @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
            <span v-if="tmp[layer].buyables[data].title"><h2 v-html="tmp[layer].buyables[data].title"></h2><br></span>
            <span :style="{'white-space': 'pre-line'}" v-html="run(layers[layer].buyables[data].display, layers[layer].buyables[data])"></span>
            <node-mark :layer="layer" :data="tmp[layer].buyables[data].marked"></node-mark>
            <tooltip v-if="tmp[layer].buyables[data].tooltip" :text="tmp[layer].buyables[data].tooltip"></tooltip>
        </button>
        <br v-if="(tmp[layer].buyables[data].sellOne !== undefined && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)) || (tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false))">
        <sell-one :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-one']" v-if="(tmp[layer].buyables[data].sellOne)&& !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)"></sell-one>
        <sell-all :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-all']" v-if="(tmp[layer].buyables[data].sellAll)&& !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)"></sell-all>
    </div>
    `,
    data() { return { interval: false, time: 0 }; },
    methods: {
        start() {
            if (!this.interval) {
                this.interval = setInterval((function() {
                    if(this.time >= 5) buyBuyable(this.layer, this.data);
                    this.time = this.time+1;
                }).bind(this), 50);
            }
        },
        stop() {
            clearInterval(this.interval);
            this.interval = false;
            this.time = 0;
        }
    },
    unmounted() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = false;
        }
    }
    });
    app.component('respec-button', {
        props: ['layer', 'data'],
        template: `
            <div v-if="tmp[layer] && tmp[layer].buyables && tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)">
                <div class="tooltipBox respecCheckbox"><input type="checkbox" v-model="player[layer].noRespecConfirm"><tooltip :text="'Disable respec confirmation'"></tooltip></div>
                <button @click="respecBuyables(layer)" :class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }" style="margin-right: 18px">{{tmp[layer].buyables.respecText ? tmp[layer].buyables.respecText : "Respec"}}</button>
            </div>
        `
    });
    app.component('clickables', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].clickables" class="upgTable">
            <master-button v-if="tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)" :layer="layer" :style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['master-button']]"></master-button>
            <div v-for="row in ((data === undefined ? tmp[layer].clickables.rows : data) || [])" class="upgRow" :key="'row' + row">
                <div v-for="col in (tmp[layer].clickables.cols || [])" :key="'col' + col"><div v-if="tmp[layer].clickables[row*10+col] !== undefined && tmp[layer].clickables[row*10+col].unlocked" class="upgAlign" :style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
                    <clickable :layer="layer" :data="row*10+col" :style="tmp[layer].componentStyles.clickable"></clickable>
                </div></div>
                <br>
            </div>
        </div>
    `
    });
    app.component('clickable', {
        props: ['layer', 'data', 'size'],
        template: `
        <button 
            v-if="tmp[layer].clickables && tmp[layer].clickables[data]!== undefined && tmp[layer].clickables[data].unlocked" 
            :class="{ upg: true, tooltipBox: true, can: tmp[layer].clickables[data].canClick, locked: !tmp[layer].clickables[data].canClick}"
            :style="[tmp[layer].clickables[data].canClick ? {'background-color': tmp[layer].color} : {}, size ? {'height': size, 'width': size} : {}, tmp[layer].clickables[data].style]"
            @click="() => { if (!interval) clickClickable(layer, data); }" 
            :id="'clickable-' + layer + '-' + data" 
            @mousedown="start" 
            @mouseleave="stop" 
            @mouseup="stop" 
            @touchstart="start" 
            @touchend="stop" 
            @touchcancel="stop">
            <span v-if="tmp[layer].clickables[data].title"><h2 v-html="tmp[layer].clickables[data].title"></h2><br></span>
            <span :style="{'white-space': 'pre-line'}" v-html="run(layers[layer].clickables[data].display, layers[layer].clickables[data])"></span>
            <node-mark :layer="layer" :data="tmp[layer].clickables[data].marked"></node-mark>
            <tooltip v-if="tmp[layer].clickables[data].tooltip" :text="tmp[layer].clickables[data].tooltip"></tooltip>
        </button>
        `,
        data() { return { interval: false, time: 0 }; },
        methods: {
            start() {
                if (!this.interval) {
                    const clickable = layers[this.layer].clickables[this.data];
                    const action = clickable.onHold || clickable.onClick;
                    if (!action) return;
                    this.interval = setInterval(() => {
                        // 添加 canClick 检查
                        if (this.canClick) {
                            run(action, clickable);
                            this.time = this.time + 1;
                        }
                    }, 50);
                }
            },
            stop() {
                clearInterval(this.interval);
                this.interval = false;
                this.time = 0;
            }
        },
        unmounted() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = false;
            }
        }
    });
    app.component('master-button', {
        props: ['layer', 'data'],
        template: `
        <button v-if="tmp[layer].clickables && tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)"
            @click="run(tmp[layer].clickables.masterButtonPress, tmp[layer].clickables)" :class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].clickables.masterButtonText ? tmp[layer].clickables.masterButtonText : "Click me!"}}</button>
        `
    });
    app.component('grid', {
        props: ['layer', 'data'],
        template: `
        <div v-if="tmp[layer] && tmp[layer].grid" class="upgTable">
            <div v-for="row in (data === undefined ? tmp[layer].grid.rows : data)" class="upgRow">
                <div v-for="col in tmp[layer].grid.cols"><div v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row*100+col)"
                    class="upgAlign" :style="{'margin': '1px',  'height': 'inherit',}">
                    <gridable :layer="layer" :data="row*100+col" :style="tmp[layer].componentStyles.gridable"></gridable>
                </div></div>
                <br>
            </div>
        </div>
        `
    });
    app.component('gridable', {
        props: ['layer', 'data'],
        template: `
        <button 
            v-if="tmp[layer].grid && player[layer].grid[data]!== undefined && run(layers[layer].grid.getUnlocked, layers[layer].grid, data)" 
            :class="{ tile: true, can: canClick, locked: !canClick, tooltipBox: true,}"
            :style="[canClick ? {'background-color': tmp[layer].color} : {}, gridRun(layer, 'getStyle', player[this.layer].grid[this.data], this.data)]"
            @click="clickGrid(layer, data)" @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
            <span v-if="layers[layer].grid.getTitle"><h3 v-html="gridRun(this.layer, 'getTitle', player[this.layer].grid[this.data], this.data)"></h3><br></span>
            <span :style="{'white-space': 'pre-line'}" v-html="gridRun(this.layer, 'getDisplay', player[this.layer].grid[this.data], this.data)"></span>
            <tooltip v-if="layers[layer].grid.getTooltip" :text="gridRun(this.layer, 'getTooltip', player[this.layer].grid[this.data], this.data)"></tooltip>
        </button>
        `,
        data() { return { interval: false, time: 0 }; },
        computed: {
            canClick() {
                return gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data);
            }
        },
        methods: {
            start() {
                if (!this.interval && layers[this.layer].grid.onHold) {
                    this.interval = setInterval((function() {
                        if (this.canClick && gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data)) {
                            if (this.time >= 5) {
                                gridRun(this.layer, 'onHold', player[this.layer].grid[this.data], this.data);
                            }
                            this.time = this.time + 1;
                        }
                    }).bind(this), 50);
                }
            },
            stop() {
                clearInterval(this.interval);
                this.interval = false;
                this.time = 0;
            }
        },
        unmounted() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = false;
            }
        }
    });
    app.component('microtabs', {
    props: ['layer', 'data', 'style'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].microtabs" :style="[style, {'border-style': 'solid'}]">
            <div class="upgTable instant">
                <tab-buttons :layer="layer" :data="tmp[layer].microtabs[data]" :name="data" :style="tmp[layer].componentStyles['tab-buttons']"></tab-buttons>
            </div>
            <layer-tab v-if="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :layer="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :embedded="true"></layer-tab>
            <column v-else :style="tmp[layer].microtabs[data][player.subtabs[layer][data]].style || {}" :layer="layer" :data="tmp[layer].microtabs[data][player.subtabs[layer][data]].content"></column>
        </div>
    `
    });
    app.component('bar', {
        props: ['layer', 'data'],
        computed: {
            style() { return constructBarStyle(this.layer, this.data); }
        },
        template: `
        <div v-if="tmp[layer] && tmp[layer].bars && tmp[layer].bars[data] && run(tmp[layer].bars[data].unlocked, layers[layer].bars[data])" :style="{'position': 'relative'}"><div :style="[tmp[layer].bars[data].style, style.dims, {'display': 'table'}]">
            <div class="overlayTextContainer barBorder" :style="[tmp[layer].bars[data].borderStyle, style.dims]">
                <span class="overlayText" :style="[tmp[layer].bars[data].style, tmp[layer].bars[data].textStyle]" v-html="run(layers[layer].bars[data].display, layers[layer].bars[data])"></span>
            </div>
            <div class="barBG barBorder" :style="[tmp[layer].bars[data].style, tmp[layer].bars[data].baseStyle, tmp[layer].bars[data].borderStyle, style.dims]">
                <div class="fill" :style="[tmp[layer].bars[data].style, tmp[layer].bars[data].fillStyle, style.fillDims]"></div>
            </div>
        </div></div>
        `
    });
    app.component('achievements', {
    props: ['layer', 'data'],
    template: `
        <div v-if="tmp[layer] && tmp[layer].achievements" class="upgTable">
            <div v-for="row in ((data === undefined ? tmp[layer].achievements.rows : data) || [])" class="upgRow" :key="'row' + row">
                <div v-for="col in (tmp[layer].achievements.cols || [])" :key="'col' + col"><div v-if="tmp[layer].achievements[row*10+col] !== undefined && tmp[layer].achievements[row*10+col].unlocked" class="upgAlign">
                    <achievement :layer="layer" :data="row*10+col" :style="tmp[layer].componentStyles.achievement"></achievement>
                </div></div>
            </div>
            <br>
        </div>
    `
    });
    app.component('achievement', {
        props: ['layer', 'data'],
        template: `
        <div v-if="tmp[layer] && tmp[layer].achievements && tmp[layer].achievements[data]!== undefined && tmp[layer].achievements[data].unlocked" :class="{ [layer]: true, achievement: true, tooltipBox:true, locked: !hasAchievement(layer, data), bought: hasAchievement(layer, data)}"
            :style="achievementStyle(layer, data)">
            <tooltip :text="
                (tmp[layer].achievements[data].tooltip == '') ? false : hasAchievement(layer, data) ? (tmp[layer].achievements[data].doneTooltip ? tmp[layer].achievements[data].doneTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'You did it!'))
                : (tmp[layer].achievements[data].goalTooltip ? tmp[layer].achievements[data].goalTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'LOCKED'))
            "></tooltip>
            <span v-if="tmp[layer].achievements[data].name"><br><h3 :style="tmp[layer].achievements[data].textStyle" v-html="tmp[layer].achievements[data].name"></h3><br></span>
        </div>
        `
    });
    app.component('tree', {
        props: ['layer', 'data'],
        computed: {
            resolvedData() {
                return typeof this.data === 'function' ? this.data() : this.data;
            }
        },
        template: `
            <div>
                <div class="upgRow" v-for="(row, r) in resolvedData" :key="r">
                    <span v-for="(node, id) in row" :key="id" style="width: 0px;">
                        <tree-node v-if="tmp[node]" :layer="node" :prev="layer" :abb="tmp[node].symbol || ''"></tree-node>
                    </span>
                    <div style="display: inline-block;">
                        <button class="treeNode hidden"></button>
                    </div>
                </div>
            </div>
        `
    });
    app.component('upgrade-tree', {
    props: ['layer', 'data'],
    template: `<thing-tree :layer="layer" :data="data" :type="'upgrade'" :key="layer + '-upgrade-tree'"></thing-tree>`
    });
    app.component('buyable-tree', {
    props: ['layer', 'data'],
    template: `<thing-tree :layer="layer" :data="data" :type="'buyable'" :key="layer + '-buyable-tree'"></thing-tree>`
    });
    app.component('clickable-tree', {
    props: ['layer', 'data'],
    template: `<thing-tree :layer="layer" :data="data" :type="'clickable'" :key="layer + '-clickable-tree'"></thing-tree>`
    });
    app.component('thing-tree', {
    props: ['layer', 'data', 'type'],
    template: `
        <div>
            <div class="upgRow" v-for="(row, r) in data" :key="r">
                <span v-for="id in row" v-if="tmp[layer][type+'s'][id]!== undefined && tmp[layer][type+'s'][id].unlocked" class="upgAlign" :key="id">
                    <component :is="type" :layer="layer" :data="id" :style="tmp[layer].componentStyles[type]" class="treeThing"></component>
                </span>
                <div style="display: inline-block;">
                    <button class="treeNode hidden"></button>
                </div>
            </div>
        </div>
    `
    });
    app.component('text-input', {
        props: ['layer', 'data'],
        template: `
            <input class="instant" :id="'input-' + layer + '-' + data" :value="player[layer][data].toString()" @focus="focused(true)" @blur="focused(false)"
                @change="player[layer][data] = toValue(document.getElementById('input-' + layer + '-' + data).value, player[layer][data])">
        `
    });
    app.component('slider', {
        props: ['layer', 'data'],
        template: `
            <div class="tooltipBox">
                <tooltip :text="player[layer][data[0]]"></tooltip><input type="range" v-model="player[layer][data[0]]" :min="data[1]" :max="data[2]">
            </div>
        `
    });
    app.component('drop-down', {
        props: ['layer', 'data'],
        template: `
            <select v-model="player[layer][data[0]]">
                <option v-for="item in data[1]" :value="item">{{item}}</option>
            </select>
        `
    });
    app.component('sell-one', {
        props: ['layer', 'data'],
        template: `
            <button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellOne && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)" @click="run(tmp[layer].buyables[data].sellOne, tmp[layer].buyables[data])"
                :class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellOneText ? tmp[layer].buyables.sellOneText : "Sell One"}}</button>
        `
    });
    app.component('sell-all', {
        props: ['layer', 'data'],
        template: `
            <button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)" @click="run(tmp[layer].buyables[data].sellAll, tmp[layer].buyables[data])"
                :class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellAllText ? tmp[layer].buyables.sellAllText : "Sell All"}}</button>
        `
    });

    // ---------- 注册 systemComponents 中的所有组件 ----------
    for (const [name, definition] of Object.entries(systemComponents)) {
        app.component(name, definition);
    }

    updateTemp();
    updateTemp();
    window.__vueApp = app;
    window.__vueRoot = app.mount('#app');
}
 
