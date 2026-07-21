// badges.js – 徽章管理主模块（依赖 math-utils.js 和 badge-defs.js）
(function() {
    'use strict';

    // ---------- 依赖 ----------
    if (typeof window.MathUtils === 'undefined') {
        console.error('math-utils.js not loaded');
        return;
    }
    if (typeof window.BADGE_DEFS === 'undefined') {
        console.error('badge-defs.js not loaded');
        return;
    }
    const BADGE_DEFS = window.BADGE_DEFS;

    // ---------- 存储键名 ----------
    const STORAGE_KEY = 'hyperngdle_data';

    // ---------- 全局状态 ----------
    let earnedBadges = [];
    let totalTP = 0;
    let currentTP = 0;
    let currentNumberStr = '';
    let newBadgeIds = new Set();
    let totalGenerations = 0;
    let bestNumber = '';
    let bestScore = 0;
    let showAllBadges = true;
    let filterRarity = 'all';

    const RARITY_ORDER = ['平庸', '普通', '罕见', '稀有', '史诗', '传说', '神话', '超越', '终结', '无尽'];

    // ---------- DOM 引用 ----------
    let badgeListEl = null;
    let totalScoreSpan = null;
    let currentScoreSpan = null;
    let filterBtnEl = null;

    // ---------- 数据持久化 ----------
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (data.showAllBadges === undefined) data.showAllBadges = true;
            if (data.filterRarity === undefined) data.filterRarity = 'all';
            return data;
        } catch {
            return null;
        }
    }

    function saveData() {
        const data = {
            earnedBadges,
            totalTP,
            totalGenerations,
            bestNumber,
            bestScore,
            showAllBadges,
            filterRarity
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // ---------- 稀有度相关 ----------
    function getOwnedRarities() {
        const owned = new Set();
        for (const badge of earnedBadges) {
            owned.add(badge.rarity);
        }
        return RARITY_ORDER.filter(r => owned.has(r));
    }

    function cycleFilter() {
        const owned = getOwnedRarities();
        if (owned.length === 0) {
            filterRarity = 'all';
        } else if (filterRarity === 'all') {
            filterRarity = owned[0];
        } else {
            const idx = owned.indexOf(filterRarity);
            if (idx === -1 || idx === owned.length - 1) {
                filterRarity = 'all';
            } else {
                filterRarity = owned[idx + 1];
            }
        }
        saveData();
        updateBadgeUI();
        updateFilterButton();
    }

    function getFilterRarity() {
        return filterRarity;
    }

    function updateFilterButton() {
        if (!filterBtnEl) return;
        filterBtnEl.className = 'btn-toggle-badges btn-filter';
        if (filterRarity === 'all') {
            filterBtnEl.textContent = '🔍 全部';
            filterBtnEl.classList.add('filter-all');
        } else {
            filterBtnEl.textContent = `🔍 ${filterRarity}`;
            filterBtnEl.classList.add(`badge-pill--${filterRarity}`);
        }
    }

    // ---------- 显示模式 ----------
    function toggleShowAllBadges() {
        showAllBadges = !showAllBadges;
        saveData();
        updateBadgeUI();
    }

    function getShowAllBadges() {
        return showAllBadges;
    }

    // ===== 自定义 Tooltip（修复版） =====
    const tooltip = document.createElement('div');
    tooltip.className = 'badge-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        display: none;
        background: var(--surface-raised);
        color: var(--prose);
        border: 1px solid var(--outline);
        border-radius: 20px;
        padding: 8px 12px;
        font-size: 0.75rem;
        font-family: var(--font-ui);
        font-weight: 600;
        max-width: 260px;
        z-index: 999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        pointer-events: none;
        backdrop-filter: blur(4px);
        transition: opacity 0.2s ease;
        line-height: 1.4;
    `;
    document.body.appendChild(tooltip);

    function updateTooltipPosition(e) {
        if (tooltip.style.display === 'none') return;
        const padding = 12;
        const rect = tooltip.getBoundingClientRect();
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        let left = e.clientX + padding;
        let top = e.clientY + padding;
        if (left + rect.width > winWidth) left = e.clientX - rect.width - padding;
        if (left < 0) left = padding;
        if (top + rect.height > winHeight) top = e.clientY - rect.height - padding;
        if (top < 0) top = padding;
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    // ---------- 初始化绑定 ----------
    function initBadgeUI(badgeListElement, totalScoreElement, currentScoreElement) {
        badgeListEl = badgeListElement;
        totalScoreSpan = totalScoreElement;
        currentScoreSpan = currentScoreElement || null;
        filterBtnEl = document.getElementById('filterBtn');

        const saved = loadData();
        if (saved) {
            earnedBadges = saved.earnedBadges || [];
            totalTP = saved.totalTP || 0;
            totalGenerations = saved.totalGenerations || 0;
            bestNumber = saved.bestNumber || '';
            bestScore = saved.bestScore || 0;
            showAllBadges = saved.showAllBadges !== undefined ? saved.showAllBadges : true;
            filterRarity = saved.filterRarity !== undefined ? saved.filterRarity : 'all';
        } else {
            earnedBadges = [];
            totalTP = 0;
            totalGenerations = 0;
            bestNumber = '';
            bestScore = 0;
            showAllBadges = true;
            filterRarity = 'all';
        }
        updateFilterButton();
        updateBadgeUI();

        if (window.onTotalGenerationsChange) {
            window.onTotalGenerationsChange(totalGenerations);
        }
        if (window.onBestChange) {
            window.onBestChange({ number: bestNumber, score: bestScore });
        }
    }

    function updateBadgeUI() {
        if (!badgeListEl || !totalScoreSpan) return;
        const format = (num) => num.toLocaleString();

        totalScoreSpan.textContent = format(totalTP);
        if (currentScoreSpan) {
            currentScoreSpan.textContent = format(currentTP);
        }
        badgeListEl.innerHTML = '';

        let badgesToShow = [];

        if (showAllBadges) {
            badgesToShow = earnedBadges.map(b => ({ ...b, isEarned: true }));
        } else {
            if (currentNumberStr && currentNumberStr.length > 0) {
                for (const def of BADGE_DEFS) {
                    if (def.check(currentNumberStr)) {
                        const earned = earnedBadges.find(b => b.id === def.id);
                        badgesToShow.push({
                            id: def.id,
                            name: def.name,
                            emoji: def.emoji,
                            score: def.score,
                            rarity: def.rarity,
                            count: earned ? earned.count : 0,
                            isEarned: !!earned
                        });
                    }
                }
            }
        }

        if (filterRarity !== 'all') {
            badgesToShow = badgesToShow.filter(b => b.rarity === filterRarity);
        }

        badgesToShow.sort((a, b) => {
            const aNew = newBadgeIds.has(a.id);
            const bNew = newBadgeIds.has(b.id);
            if (aNew && !bNew) return -1;
            if (!aNew && bNew) return 1;
            return (b.score || 0) - (a.score || 0);
        });

        for (const badge of badgesToShow) {
            const def = BADGE_DEFS.find(d => d.id === badge.id);
            if (!def) continue;
            const isActive = def.check(currentNumberStr);
            const isEarned = badge.isEarned !== undefined ? badge.isEarned : true;
            const isNew = newBadgeIds.has(badge.id);
            const activeClass = (isActive && isEarned) ? '' : 'badge-pill--inactive';
            const rarityClass = 'badge-pill--' + badge.rarity;

            const pill = document.createElement('span');
            pill.className = `badge-pill ${rarityClass} ${activeClass}`;
            const countDisplay = badge.count > 1 ? ` ×${badge.count}` : '';
            const newTag = isNew && isEarned ? `<span class="badge-new">新！</span>` : '';
            const scoreDisplay = isEarned ? `+${format(badge.score)}TP` : '';

            pill.innerHTML = `
                <span class="badge-emoji">${badge.emoji}</span>
                <span class="badge-name">${badge.name}${countDisplay}</span>
                ${newTag}
                <span class="badge-rarity">${badge.rarity}</span>
                <span class="badge-score">${scoreDisplay}</span>
            `;

            const tooltipContent = def.description || '获取条件未定义';
            pill.addEventListener('mouseenter', function(e) {
                tooltip.textContent = tooltipContent;
                tooltip.style.display = 'block';
                requestAnimationFrame(() => updateTooltipPosition(e));
            });
            pill.addEventListener('mousemove', updateTooltipPosition);
            pill.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
            });

            if (isNew && isEarned) {
                pill.addEventListener('mouseenter', function() {
                    newBadgeIds.delete(badge.id);
                    updateBadgeUI();
                });
            }

            badgeListEl.appendChild(pill);
        }
    }

    // ---------- 检查并颁发徽章 ----------
    function checkAndAwardBadges(numberStr) {
        currentNumberStr = numberStr;
        currentTP = 0;
        const newlyEarnedIds = [];

        for (const def of BADGE_DEFS) {
            if (def.check(numberStr)) {
                currentTP += def.score;
                const existing = earnedBadges.find(b => b.id === def.id);
                if (existing) {
                    existing.count += 1;
                    totalTP += def.score;
                } else {
                    earnedBadges.push({
                        id: def.id,
                        name: def.name,
                        emoji: def.emoji,
                        score: def.score,
                        rarity: def.rarity,
                        count: 1
                    });
                    totalTP += def.score;
                    newlyEarnedIds.push(def.id);
                }
            }
        }

        if (currentTP > bestScore) {
            bestScore = currentTP;
            bestNumber = numberStr;
            if (window.onBestChange) {
                window.onBestChange({ number: bestNumber, score: bestScore });
            }
        }

        newBadgeIds = new Set(newlyEarnedIds);
        updateBadgeUI();
        saveData();
    }

    // ---------- 生成计数 ----------
    function incrementGenerations() {
        totalGenerations++;
        saveData();
        if (window.onTotalGenerationsChange) {
            window.onTotalGenerationsChange(totalGenerations);
        }
    }

    function getTotalGenerations() {
        return totalGenerations;
    }

    function getBest() {
        return { number: bestNumber, score: bestScore };
    }

    // ---------- 重置 ----------
    function hardReset() {
        earnedBadges = [];
        totalTP = 0;
        currentTP = 0;
        currentNumberStr = '';
        newBadgeIds.clear();
        totalGenerations = 0;
        bestNumber = '';
        bestScore = 0;
        showAllBadges = true;
        filterRarity = 'all';
        localStorage.removeItem(STORAGE_KEY);
        updateFilterButton();
        updateBadgeUI();
        if (window.onTotalGenerationsChange) window.onTotalGenerationsChange(0);
        if (window.onBestChange) window.onBestChange({ number: '', score: 0 });
    }

    function resetBadges() {
        earnedBadges = [];
        totalTP = 0;
        currentTP = 0;
        currentNumberStr = '';
        newBadgeIds.clear();
        filterRarity = 'all';
        updateFilterButton();
        updateBadgeUI();
    }

    // ---------- 对外接口 ----------
    window.Badges = {
        initBadgeUI,
        checkAndAwardBadges,
        resetBadges,
        getEarnedBadges: () => earnedBadges.slice(),
        getTotalTP: () => totalTP,
        getCurrentTP: () => currentTP,
        toggleShowAllBadges,
        getShowAllBadges,
        incrementGenerations,
        getTotalGenerations,
        hardReset,
        getBest,
        cycleFilter,
        getFilterRarity,
        getOwnedRarities,
        updateFilterButton,
        getBadgesForNumber: function(numberStr) {
            const result = [];
            for (const def of BADGE_DEFS) {
                if (def.check(numberStr)) {
                    result.push({
                        id: def.id,
                        name: def.name,
                        emoji: def.emoji,
                        score: def.score,
                        rarity: def.rarity
                    });
                }
            }
            result.sort((a,b) => b.score - a.score);
            return result;
        },
        unlockAll: function() {
            BADGE_DEFS.forEach(def => {
                const existing = earnedBadges.find(b => b.id === def.id);
                if (!existing) {
                    earnedBadges.push({
                        id: def.id,
                        name: def.name,
                        emoji: def.emoji,
                        score: def.score,
                        rarity: def.rarity,
                        count: 1
                    });
                    totalTP += def.score;
                }
            });
            newBadgeIds.clear();
            updateBadgeUI();
            saveData();
        },
        getFilterButtonLabel: function() {
            return this.getFilterRarity() === 'all' ? '全部' : this.getFilterRarity();
        },
        getFilterButtonClass: function() {
            const rarity = this.getFilterRarity();
            return rarity === 'all' ? 'filter-all' : 'badge-pill--' + rarity;
        }
    };
})();