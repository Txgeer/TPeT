// badges.js – 徽章管理模块
(function() {
    'use strict';

    // ---------- 工具函数 ----------
    function getEffectiveLength(digitsStr) {
        const trimmed = digitsStr.replace(/^0+/, '');
        return trimmed.length === 0 ? 1 : trimmed.length;
    }

    // ---------- 质数判断 ----------
    function isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    // ---------- 半质数判断 ----------
    function isSemiprime(n) {
        if (n < 4) return false;
        if (isPrime(n)) return false;
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) {
                let j = n / i;
                return isPrime(i) && isPrime(j);
            }
        }
        return false;
    }

    // ---------- 盈数判断 ----------
    function isAbundant(n) {
        if (n < 1) return false;
        let sum = 0;
        const limit = Math.sqrt(n);
        for (let i = 1; i <= limit; i++) {
            if (n % i === 0) {
                sum += i;
                const j = n / i;
                if (j !== i) sum += j;
            }
        }
        return sum > 2 * n;
    }

    // ---------- 徽章定义 ----------
    const BADGE_DEFS = [
        // 位数徽章
        { id: 'nine-digits', name: '九位数', emoji: '9️⃣', score: 10, rarity: '平庸',
            check: d => getEffectiveLength(d) === 9 },
        { id: 'eight-digits', name: '八位数', emoji: '8️⃣', score: 100, rarity: '普通',
            check: d => getEffectiveLength(d) === 8 },
        { id: 'seven-digits', name: '七位数', emoji: '7️⃣', score: 1000, rarity: '罕见',
            check: d => getEffectiveLength(d) === 7 },
        { id: 'six-digits', name: '六位数', emoji: '6️⃣', score: 10000, rarity: '稀有',
            check: d => getEffectiveLength(d) === 6 },
        { id: 'five-digits', name: '五位数', emoji: '5️⃣', score: 100000, rarity: '史诗',
            check: d => getEffectiveLength(d) === 5 },
        { id: 'four-digits', name: '四位数', emoji: '4️⃣', score: 1000000, rarity: '传说',
            check: d => getEffectiveLength(d) === 4 },
        { id: 'three-digits', name: '三位数', emoji: '3️⃣', score: 10000000, rarity: '神话',
            check: d => getEffectiveLength(d) === 3 },
        { id: 'two-digits', name: '两位数', emoji: '2️⃣', score: 100000000, rarity: '超越',
            check: d => getEffectiveLength(d) === 2 },
        { id: 'one-digit', name: '一位数', emoji: '1️⃣', score: 1000000000, rarity: '终结',
            check: d => getEffectiveLength(d) === 1 },

        // ---- 条件徽章 ----
        {
            id: 'multiple-of-three',
            name: '三的倍数',
            emoji: '➗3️⃣',
            score: 4,
            rarity: '平庸',
            check: d => parseInt(d, 10) % 3 === 0
        },
        {
            id: 'first-last-equal',
            name: '首尾相等',
            emoji: '☸',
            score: 10,
            rarity: '平庸',
            check: function(d) {
                const trimmed = d.replace(/^0+/, '');
                if (trimmed.length === 0) return false;
                return trimmed[0] === trimmed[trimmed.length - 1];
            }
        },
        {
            id: 'semiprime',
            name: '半质数',
            emoji: '➗🤵',
            score: 5,
            rarity: '平庸',
            check: d => isSemiprime(parseInt(d, 10))
        },
        {
            id: 'prime',
            name: '质数',
            emoji: '🤵',
            score: 22,
            rarity: '普通',
            check: d => isPrime(parseInt(d, 10))
        },
        {
            id: 'abundant',
            name: '盈数',
            emoji: '🟥🟨🟩🟦',
            score: 5,
            rarity: '平庸',
            check: d => isAbundant(parseInt(d, 10))
        },
        {
            id: 'no-zero',
            name: '攻',
            emoji: '⚔',
            score: 3,
            rarity: '平庸',
            check: d => !d.includes('0')
        },
        {
            id: 'no-one',
            name: '受',
            emoji: '🎪',
            score: 3,
            rarity: '平庸',
            check: d => !d.includes('1')
        },
        {
            id: 'no-one-has-zero',
            name: '受受',
            emoji: '🎪🎪',
            score: 5,
            rarity: '平庸',
            check: function(digitsStr) {
                return !digitsStr.includes('1') && digitsStr.includes('0');
            }
        },
        {
            id: 'multiple-of-11',
            name: '11的倍数',
            emoji: '➗1️⃣1️⃣',
            score: 11,
            rarity: '普通',
            check: function(digitsStr) {
                let oddSum = 0, evenSum = 0;
                for (let i = 0; i < digitsStr.length; i++) {
                    const digit = parseInt(digitsStr[i], 10);
                    if ((i + 1) % 2 === 1) { // 从1开始计数，奇数位
                        oddSum += digit;
                    } else {
                        evenSum += digit;
                    }
                }
                const diff = Math.abs(oddSum - evenSum);
                return diff % 11 === 0;
            }
        },
        {
            id: 'multiple-of-9',
            name: '9的倍数',
            emoji: '➗9️⃣',
            score: 9,
            rarity: '平庸',
            check: function(digitsStr) {
                let sum = 0;
                for (let i = 0; i < digitsStr.length; i++) {
                    sum += parseInt(digitsStr[i], 10);
                }
                return sum % 9 === 0;
            }
        },
        {
            id: 'multiple-of-13',
            name: '13的倍数',
            emoji: '➗1️⃣3️⃣',
            score: 13,
            rarity: '普通',
            check: function(digitsStr) {
                if (digitsStr.length === 0) return false;
                const lastDigit = parseInt(digitsStr[digitsStr.length - 1], 10);
                const remaining = digitsStr.slice(0, -1);
                const remainingNum = remaining === '' ? 0 : parseInt(remaining, 10);
                const result = remainingNum + 4 * lastDigit;
                return result % 13 === 0;
            }
        },
        {
            id: 'multiple-of-17',
            name: '17的倍数',
            emoji: '➗1️⃣7️⃣',
            score: 17,
            rarity: '普通',
            check: function(digitsStr) {
                if (digitsStr.length === 0) return false;
                const lastDigit = parseInt(digitsStr[digitsStr.length - 1], 10);
                const remaining = digitsStr.slice(0, -1);
                const remainingNum = remaining === '' ? 0 : parseInt(remaining, 10);
                const result = remainingNum - 5 * lastDigit;
                return result % 17 === 0;
            }
        },
        {
            id: 'multiple-of-19',
            name: '19的倍数',
            emoji: '➗1️⃣9️⃣',
            score: 19,
            rarity: '普通',
            check: function(digitsStr) {
                if (digitsStr.length === 0) return false;
                let num = parseInt(digitsStr, 10);
                let a, b;
                if (digitsStr.length <= 3) {
                    a = 0;
                    b = num;
                } else {
                    const remaining = digitsStr.slice(0, -3);
                    a = parseInt(remaining, 10);
                    b = parseInt(digitsStr.slice(-3), 10);
                }
                const diff = Math.abs(a * 7 - b);
                return diff % 19 === 0;
            }
        },
                {
            id: 'multiple-of-23',
            name: '23的倍数',
            emoji: '➗2️⃣3️⃣',
            score: 23,
            rarity: '普通',
            check: function(digitsStr) {
                if (digitsStr.length === 0) return false;
                let num = parseInt(digitsStr, 10);
                let a, b;
                if (digitsStr.length <= 4) {
                    return num % 23 === 0;
                } else {
                    const remaining = digitsStr.slice(0, -4);
                    a = parseInt(remaining, 10);
                    b = parseInt(digitsStr.slice(-4), 10);
                }
                const diff = Math.abs(a * 5 - b);
                return diff % 23 === 0;
            }
        },
        {
            id: 'multiple-of-29',
            name: '29的倍数',
            emoji: '➗2️⃣9️⃣',
            score: 29,
            rarity: '普通',
            check: function(digitsStr) {
                if (digitsStr.length === 0) return false;
                let num = parseInt(digitsStr, 10);
                let a, b;
                if (digitsStr.length <= 4) {
                    return num % 29 === 0;
                } else {
                    const remaining = digitsStr.slice(0, -4);
                    a = parseInt(remaining, 10);
                    b = parseInt(digitsStr.slice(-4), 10);
                }
                const diff = Math.abs(a * 5 - b);
                return diff % 29 === 0;
            }
        },
        {
            id: 'multiple-of-7',
            name: '7的倍数',
            emoji: '➗7️⃣',
            score: 7,
            rarity: '平庸',
            check: function(digitsStr) {
                if (digitsStr.length === 0) return false;
                const lastDigit = parseInt(digitsStr[digitsStr.length - 1], 10);
                const remaining = digitsStr.slice(0, -1);
                const remainingNum = remaining === '' ? 0 : parseInt(remaining, 10);
                const result = remainingNum - 2 * lastDigit;
                return result % 7 === 0;
            }
        },
    ];

    // ---------- 全局状态 ----------
    let earnedBadges = [];        // 每个徽章对象：{ id, name, emoji, score, rarity, count }
    let totalTP = 0;
    let currentTP = 0;
    let currentNumberStr = '';
    let newBadgeIds = new Set();  // 本轮首次获得的徽章 id

    // ---------- DOM 引用 ----------
    let badgeListEl = null;
    let totalScoreSpan = null;
    let currentScoreSpan = null;

    // ---------- 初始化绑定 ----------
    function initBadgeUI(badgeListElement, totalScoreElement, currentScoreElement) {
        badgeListEl = badgeListElement;
        totalScoreSpan = totalScoreElement;
        currentScoreSpan = currentScoreElement || null;
        updateBadgeUI();
    }

    // ---------- 更新 UI ----------
    function updateBadgeUI() {
        if (!badgeListEl || !totalScoreSpan) return;
        totalScoreSpan.textContent = totalTP;
        if (currentScoreSpan) {
            currentScoreSpan.textContent = currentTP;
        }
        badgeListEl.innerHTML = '';

        const hasCurrentNumber = currentNumberStr && currentNumberStr.length > 0;

        earnedBadges.forEach(badge => {
            const def = BADGE_DEFS.find(d => d.id === badge.id);
            let isActive = false;
            if (hasCurrentNumber && def) {
                isActive = def.check(currentNumberStr);
            }

            const isNew = newBadgeIds.has(badge.id);
            const activeClass = isActive ? '' : 'badge-pill--inactive';
            const rarityClass = 'badge-pill--' + badge.rarity;

            const pill = document.createElement('span');
            pill.className = `badge-pill ${rarityClass} ${activeClass}`;

            const countDisplay = badge.count > 1 ? ` ×${badge.count}` : '';
            const newTag = isNew ? `<span class="badge-new">新！</span>` : '';

            pill.innerHTML = `
                <span class="badge-emoji">${badge.emoji}</span>
                <span class="badge-name">${badge.name}${countDisplay}</span>
                ${newTag}
                <span class="badge-rarity">${badge.rarity}</span>
                <span class="badge-score">+${badge.score.toLocaleString()}TP</span>
            `;

            badgeListEl.appendChild(pill);
        });
    }

    // ---------- 检查并颁发徽章（重复可叠加） ----------
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

        newBadgeIds = new Set(newlyEarnedIds);
        updateBadgeUI();
    }

    // ---------- 重置徽章 ----------
    function resetBadges() {
        earnedBadges = [];
        totalTP = 0;
        currentTP = 0;
        currentNumberStr = '';
        newBadgeIds.clear();
        updateBadgeUI();
    }

    // ---------- 暴露全局接口 ----------
    window.Badges = {
        initBadgeUI,
        checkAndAwardBadges,
        resetBadges,
        getEarnedBadges: () => earnedBadges.slice(),
        getTotalTP: () => totalTP,
        getCurrentTP: () => currentTP,
    };
})();