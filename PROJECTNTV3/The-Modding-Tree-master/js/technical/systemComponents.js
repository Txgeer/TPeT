var systemComponents = {
'tab-buttons': {
    props: ['layer', 'data', 'name'],
    template: `
        <div class="upgRow">
            <div v-for="tab in Object.keys(data)">
                <button v-if="data[tab].unlocked == undefined || data[tab].unlocked"
                    v-bind:class="{
                        tabButton: true,
                        notify: subtabShouldNotify(layer, name, tab),
                        resetNotify: subtabResetNotify(layer, name, tab),
                        active: player.subtabs[layer][name] === tab   // 新增高亮条件
                    }"
                    v-bind:style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
                    v-on:click="() => {player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">
                    {{tab}}
                </button>
            </div>
        </div>
    `
},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: `
		<button v-if="tmp[layer] && tmp[layer].symbol !== undefined && nodeShown(layer)"
        v-bind:id="layer"
			v-on:click="() => {
				if (shiftDown) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
        treeNode: tmp[layer].isLayer,
        treeButton: !tmp[layer].isLayer,
        smallNode: size == 'small',
        [layer]: true,
        tooltipBox: true,
        forceTooltip: player[layer].forceTooltip,
        ghost: tmp[layer].layerShown == 'ghost',
        hidden: !tmp[layer].layerShown,
        locked: tmp[layer].isLayer ? !(player[layer] && (player[layer].unlocked || tmp[layer].canReset)) : !(tmp[layer].canClick),
        notify: tmp[layer].notify && player[layer] && player[layer].unlocked,
        resetNotify: tmp[layer].prestigeNotify,
        can: ((player[layer] && player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
        front: !tmp.scrolled,
        'just-unlocked': player[layer].justUnlocked
        }"
        v-bind:style="constructNodeStyle(layer)">
			<span v-html="(tmp[layer] && tmp[layer].image === undefined && abb && abb !== '') ? abb : '&nbsp;'"></span>
			<tooltip
        v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : '达到 ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' 去解锁 (你有 ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark>
		</button>
		`
	},

	
	'layer-tab': {
    props: ['layer', 'back', 'spacing', 'embedded'],
    template: `<div v-if="tmp[layer]" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
        <div v-if="back"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">←</button></div>
        <div v-if="!tmp[layer].tabFormat">
            <div v-if="spacing" v-bind:style="{'height': spacing}"></div>
            <infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]"></infobox>
            <main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
            <div v-if="tmp[layer].type !== 'none'">
                <prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
            </div>
            <resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
            <milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
            <div v-if="Array.isArray(tmp[layer].midsection)">
                <column :layer="layer" :data="tmp[layer].midsection"></column>
            </div>
            <clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
            <buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
            <upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
            <challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
            <achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
            <br><br>
        </div>
        <div v-if="tmp[layer] && tmp[layer].tabFormat">
            <div v-if="Array.isArray(tmp[layer].tabFormat)">
                <div v-if="spacing" v-bind:style="{'height': spacing}"></div>
                <column :layer="layer" :data="tmp[layer].tabFormat"></column>
            </div>
            <div v-else>
                <div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
                    <tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
                </div>
                <layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true"></layer-tab>
                <column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content"></column>
            </div>
        </div>
    </div>`
    },

	'overlay-head': {
    template: `
        <div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
            <span v-if="player.offTime !== undefined" class="overlayThing">
                <br>离线时间：{{formatTime(player.offTime.remain)}}<br>
            </span>
            <span v-if="player.points.lt('1e1000')" class="overlayThing">你有 </span>
            <h2 class="overlayThing" id="points">{{format(player.points)}}</h2>
            <span v-if="player.points.lt('1e1e6')" class="overlayThing"> {{modInfo.pointsName}}</span>
            <br>
            <span v-if="canGenPoints()" class="overlayThing">
                ({{tmp.other.oompsMag !== 0 ? format(tmp.other.oomps) + ' OOM' + (tmp.other.oompsMag < 0 ? '^OOM' : tmp.other.oompsMag > 1 ? '^' + tmp.other.oompsMag : '') + 's' : formatSmall(getPointGen())}}/s)
            </span>
            <div v-if="player.paused" class="overlayThing" style="color: #ffaa00; font-size: 20px; margin-top: 5px; text-shadow: 0 0 10px #ffaa00;">
                ⏸ 暂停中
            </div>
            <div v-for="(thing, index) in tmp.displayThings" :key="index" class="overlayThing">
                <span v-if="thing" v-html="thing"></span>
            </div>
        </div>
    `
    },
//不要乱动
    'info-tab': {
    data() {
        return {
            engineVersion: '3.1.3'
        };
    },
    template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3>
        <span v-if="modInfo.author">
            <br>
            作者： {{modInfo.author}}	
        </span>
        <br>
        PROJECT:NTV3 <a v-bind:href="'https://github.com/Txgeer/TPeT/blob/main/PROJECTNTV3/The-Modding-Tree-master/NTV3changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{ engineVersion }}</a> 作者： Txgeer
        <br>
        模组树 <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> 作者： Acamaeda
        <br>
        声望树作者： Jacorb 和 Aarex
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">模组树服务器</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">主声望树服务器</a><br>
		<br><br>
        已游玩时间: {{ formatTime(player.timePlayed) }}<br><br>
        <h3>热键</h3><br>
        <template v-for="key in hotkeys" :key="key.description">
        <span v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked">
        <br>{{key.description}}
        </span>
        </template>
        </div>
    `
    },

    'options-tab': {
    template: `
        <div>
            <table class="options-table">
                <tbody>
                    <tr>
                        <td><button class="opt" @click="() => save()">保存</button></td>
                        <td><button class="opt" @click="() => toggleOpt('autosave')">自动保存: {{ options.autosave ? "开" : "关" }}</button></td>
                        <td><button class="hard-reset-btn" @click="() => hardReset()">硬复位</button></td>
                        <td><button class="opt" @click="() => exportSave()">导出到剪切板</button></td>
                    </tr>
                    <tr>
                        <td><button class="opt" @click="() => importSave()">导入</button></td>
                        <td><button class="opt" @click="() => toggleOpt('offlineProd')">离线进度: {{ options.offlineProd ? "开" : "关" }}</button></td>
                        <td><button class="opt" @click="() => switchTheme()">主题: {{ getThemeName() }}</button></td>
                        <td><button class="opt" @click="() => adjustMSDisp()">显示里程碑: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)] }}</button></td>
                    </tr>
                    <tr>
                        <td><button class="opt" @click="() => toggleOpt('hqTree')">高质量树贴图: {{ options.hqTree ? "开" : "关" }}</button></td>
                        <td><button class="opt" @click="() => toggleOpt('hideChallenges')">已完成的挑战: {{ options.hideChallenges ? "隐藏" : "显示" }}</button></td>
                        <td><button class="opt" @click="() => { toggleOpt('forceOneTab'); needCanvasUpdate = true; }">单标签页模式: {{ options.forceOneTab ? "总是" : "自动" }}</button></td>
                        <td><button class="opt" @click="() => toggleMusic()">音乐: {{ options.musicEnabled ? "开" : "关" }}</button></td>
                    </tr>
                    <tr>
                        <td><button class="opt" @click="() => toggleOpt('milestonePopup')">里程碑弹窗: {{ options.milestonePopup ? "开" : "关" }}</button></td>
                        <td><button class="opt" @click="() => toggleZoom()">放大: {{ options.enableZoom ? "开" : "关" }}</button></td>
                        <td><button class="opt" @click="() => toggleTextSelect()">文本选择: {{ options.textSelect ? "开" : "关" }}</button></td>
                        <td><button class="opt" @click="() => toggleOpt('achievementFlash')">成就闪光: {{ options.achievementFlash ? "开" : "关" }}</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `
            <div v-if='data'>
            <div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
            <img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data">
            </div>
            `
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	},
}

