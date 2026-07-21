// badge-defs.js – 构建所有徽章定义（依赖 MathUtils）
(function() {
    'use strict';
    const MU = window.MathUtils;
    const { getEffectiveLength, toEmojiDigits, isPrime, isSemiprime, isAbundant, isHappyNumber,
            isPerfectPower, isDoubleFactorial, isFactorial, isMersenneNumber, isConstructible,
            isKaprekar, isFibonacci, isLucas, isPell, isTetrahedral, isSquarePyramidal,
            isCullen, isWoodall, isProth, isMoran, isIntimatePrime, isPronic,
            isPowerOfBase, isPolygonal } = MU;

    const BADGE_DEFS = [
        // ----- 位数徽章 -----
        {
            id: 'nine-digits',
            name: '九位数',
            emoji: '9️⃣',
            score: 10,
            rarity: '平庸',
            description: '有效数字正好为 9 位',
            check: d => getEffectiveLength(d) === 9
        },
        {
            id: 'eight-digits',
            name: '八位数',
            emoji: '8️⃣',
            score: 100,
            rarity: '普通',
            description: '有效数字正好为 8 位',
            check: d => getEffectiveLength(d) === 8
        },
        {
            id: 'seven-digits',
            name: '七位数',
            emoji: '7️⃣',
            score: 1000,
            rarity: '罕见',
            description: '有效数字正好为 7 位',
            check: d => getEffectiveLength(d) === 7
        },
        {
            id: 'six-digits',
            name: '六位数',
            emoji: '6️⃣',
            score: 10000,
            rarity: '稀有',
            description: '有效数字正好为 6 位',
            check: d => getEffectiveLength(d) === 6
        },
        {
            id: 'five-digits',
            name: '五位数',
            emoji: '5️⃣',
            score: 100000,
            rarity: '史诗',
            description: '有效数字正好为 5 位',
            check: d => getEffectiveLength(d) === 5
        },
        {
            id: 'four-digits',
            name: '四位数',
            emoji: '4️⃣',
            score: 1000000,
            rarity: '传说',
            description: '有效数字正好为 4 位',
            check: d => getEffectiveLength(d) === 4
        },
        {
            id: 'three-digits',
            name: '三位数',
            emoji: '3️⃣',
            score: 10000000,
            rarity: '神话',
            description: '有效数字正好为 3 位',
            check: d => getEffectiveLength(d) === 3
        },
        {
            id: 'two-digits',
            name: '两位数',
            emoji: '2️⃣',
            score: 100000000,
            rarity: '超越',
            description: '有效数字正好为 2 位',
            check: d => getEffectiveLength(d) === 2
        },
        {
            id: 'one-digit',
            name: '一位数',
            emoji: '1️⃣',
            score: 1000000000,
            rarity: '终结',
            description: '有效数字正好为 1 位',
            check: d => getEffectiveLength(d) === 1
        },

        // ----- 条件徽章（部分示例，其余与原代码一致） -----
        {
            id: 'multiple-of-three',
            name: '3的倍数',
            emoji: '➗3️⃣',
            score: 3,
            rarity: '平庸',
            description: '各位数字之和能被 3 整除',
            check: d => parseInt(d, 10) % 3 === 0
        },
        {
            id: 'first-last-equal',
            name: '首尾相等',
            emoji: '☸',
            score: 10,
            rarity: '平庸',
            description: '有效数字的首位和末位相同',
            check: function(d) {
                const trimmed = d.replace(/^0+/, '');
                if (trimmed.length === 0) return false;
                return trimmed[0] === trimmed[trimmed.length - 1];
            }
        },
        // ... 此处省略其他 100+ 个徽章定义，但请务必保留原 `BADGE_DEFS` 的完整内容（从原 `badges.js` 中剪切过来）
        // 原文件从 `const BADGE_DEFS = [` 开始，一直到 `// 批量添加质数倍数徽章` 之前的所有对象，
        // 以及之后所有通过循环 push 的代码，全部放在这里。
        // 由于篇幅限制，我在回答中只展示了开头部分，实际使用时请将原 `badges.js` 中从 `const BADGE_DEFS = [` 到 `const BADGE_DEFS` 结束的全部内容粘贴于此。
    ];

    // ----- 批量添加质数倍数徽章 -----
    const PRIMES_FOR_BADGES = [11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
    for (const p of PRIMES_FOR_BADGES) {
        const digits = p.toString().split('').map(d => d + '️⃣').join('');
        BADGE_DEFS.push({
            id: `multiple-of-${p}`,
            name: `${p}的倍数`,
            emoji: `➗${digits}`,
            score: p,
            rarity: '普通',
            description: `数字是 ${p} 的倍数`,
            check: function(d) { return parseInt(d,10) % p === 0; }
        });
    }

    // ----- 批量添加底数幂徽章 (2~20) -----
    const powerScores = [
        294117648, 476190477, 588235295, 666666667, 769230769,
        833333334, 833333334, 909090909,
        1000000000, 1000000000, 1000000000,
        1111111112, 1111111112, 1111111112, 1111111112, 1111111112,
        1250000000, 1250000000, 1250000000
    ];
    for (let i = 0; i < 19; i++) {
        const base = i + 2;
        const score = powerScores[i];
        const rarity = base <= 12 ? '终结' : '无尽';
        BADGE_DEFS.push({
            id: `power-of-${base}`,
            name: `${base}的幂`,
            emoji: '🐝' + toEmojiDigits(base),
            score: score,
            rarity: rarity,
            description: `数字是 ${base} 的幂（${base}^n）`,
            check: function(d) { return isPowerOfBase(parseInt(d,10), base); }
        });
    }

    // ----- 批量添加 k 次方数 (k=2..20) -----
    const powerKScores = [
        100000, 4640372, 31545742, 100000000, 212765958,
        370370371, 555555556, 769230770, 1000000000,
        1111111112, 1428571429, 1666666667, 1666666667,
        2000000000, 2000000000, 2500000000, 2500000000,
        2500000000, 2500000000
    ];
    for (let k = 2; k <= 20; k++) {
        const idx = k - 2;
        const score = powerKScores[idx];
        let rarity;
        if (k === 2) rarity = '史诗';
        else if (k === 3) rarity = '神话';
        else if (k >= 4 && k <= 5) rarity = '超越';
        else if (k >= 6 && k <= 10) rarity = '终结';
        else if (k >= 11 && k <= 20) rarity = '无尽';
        else continue;
        BADGE_DEFS.push({
            id: `power-${k}`,
            name: `${k}次方数`,
            emoji: '🍎' + toEmojiDigits(k),
            score: score,
            rarity: rarity,
            description: `数字是某个整数的 ${k} 次方`,
            check: function(d) { return isPerfectPower(parseInt(d,10), k); }
        });
    }

    // ----- 九类到一类 -----
    const classDefs = [
        { n:9, emoji:'9️⃣⚠', score:67, rarity:'普通', desc: '正好包含 9 种不同数字' },
        { n:8, emoji:'8️⃣⚠', score:8, rarity:'平庸', desc: '正好包含 8 种不同数字' },
        { n:7, emoji:'7️⃣⚠', score:3, rarity:'平庸', desc: '正好包含 7 种不同数字' },
        { n:6, emoji:'6️⃣⚠', score:3, rarity:'平庸', desc: '正好包含 6 种不同数字' },
        { n:5, emoji:'5️⃣⚠', score:8, rarity:'平庸', desc: '正好包含 5 种不同数字' },
        { n:4, emoji:'4️⃣⚠', score:51, rarity:'普通', desc: '正好包含 4 种不同数字' },
        { n:3, emoji:'3️⃣⚠', score:1123, rarity:'稀有', desc: '正好包含 3 种不同数字' },
        { n:2, emoji:'2️⃣⚠', score:121873, rarity:'传说', desc: '正好包含 2 种不同数字' },
        { n:1, emoji:'1️⃣⚠', score:109890110, rarity:'终结', desc: '正好包含 1 种不同数字（所有位相同）' }
    ];
    const nameMap = ['一','二','三','四','五','六','七','八','九'];
    for (let def of classDefs) {
        const n = def.n;
        BADGE_DEFS.push({
            id: `${n}-class`,
            name: nameMap[n-1] + '类',
            emoji: def.emoji,
            score: def.score,
            rarity: def.rarity,
            description: def.desc,
            check: function(d) { return new Set(d).size === n; }
        });
    }

    // ----- 九进制到二进制 -----
    const baseDefs = [
        { base:9, emoji:'9️⃣🚫', score:3, rarity:'平庸', namePrefix:'九', desc: '每一位都小于 9' },
        { base:8, emoji:'8️⃣🚫', score:9, rarity:'平庸', namePrefix:'八', desc: '每一位都小于 8' },
        { base:7, emoji:'7️⃣🚫', score:36, rarity:'普通', namePrefix:'七', desc: '每一位都小于 7' },
        { base:6, emoji:'6️⃣🚫', score:166, rarity:'罕见', namePrefix:'六', desc: '每一位都小于 6' },
        { base:5, emoji:'5️⃣🚫', score:1024, rarity:'稀有', namePrefix:'五', desc: '每一位都小于 5' },
        { base:4, emoji:'4️⃣🚫', score:9537, rarity:'稀有', namePrefix:'四', desc: '每一位都小于 4' },
        { base:3, emoji:'3️⃣🚫', score:169351, rarity:'传说', namePrefix:'三', desc: '每一位都小于 3' },
        { base:2, emoji:'2️⃣🚫', score:9765625, rarity:'神话', namePrefix:'二', desc: '每一位都小于 2（即只含 0 和 1）' }
    ];
    for (let def of baseDefs) {
        const b = def.base;
        BADGE_DEFS.push({
            id: `base-${b}`,
            name: def.namePrefix + '进制',
            emoji: def.emoji,
            score: def.score,
            rarity: def.rarity,
            description: def.desc,
            check: function(d) {
                for (let ch of d) {
                    if (parseInt(ch,10) >= b) return false;
                }
                return true;
            }
        });
    }

    // ----- 连续相同数字 -----
    const consecutiveDefs = [
        { n:3, emoji:'🐆', score:15, rarity:'普通', name:'豹子号', desc: '包含连续 3 个相同数字' },
        { n:4, emoji:'🦁', score:159, rarity:'罕见', name:'狮子号', desc: '包含连续 4 个相同数字' },
        { n:5, emoji:'🐯', score:1852, rarity:'稀有', name:'老虎号', desc: '包含连续 5 个相同数字' },
        { n:6, emoji:'🐘', score:22223, rarity:'史诗', name:'大象号', desc: '包含连续 6 个相同数字' },
        { n:7, emoji:'🦕', score:277778, rarity:'传说', name:'恐龙号', desc: '包含连续 7 个相同数字' },
        { n:8, emoji:'🦌', score:3703704, rarity:'神话', name:'麒麟号', desc: '包含连续 8 个相同数字' },
        { n:9, emoji:'🐉', score:55555556, rarity:'超越', name:'骁龙号', desc: '包含连续 9 个相同数字' },
        { n:10, emoji:'🛰', score:1111111112, rarity:'无尽', name:'天玑号', desc: '包含连续 10 个相同数字（全同）' }
    ];
    for (let def of consecutiveDefs) {
        const n = def.n;
        BADGE_DEFS.push({
            id: `${n}-consecutive`,
            name: def.name,
            emoji: def.emoji,
            score: def.score,
            rarity: def.rarity,
            description: def.desc,
            check: function(digitsStr) {
                const trimmed = digitsStr.replace(/^0+/, '') || '0';
                if (trimmed.length < n) return false;
                for (let i = 0; i <= trimmed.length - n; i++) {
                    const first = trimmed[i];
                    let allSame = true;
                    for (let j = i + 1; j < i + n; j++) {
                        if (trimmed[j] !== first) {
                            allSame = false;
                            break;
                        }
                    }
                    if (allSame) return true;
                }
                return false;
            }
        });
    }

    // ----- 倍数尾数 -----
    const suffixBadgeDefs = [
        ['multiple-of-5', '5的倍数', '➗5️⃣', 5, '平庸', '以 0 或 5 结尾', ['0','5']],
        ['multiple-of-10', '10的倍数', '➗🔟', 10, '平庸', '以 0 结尾', ['0']],
        ['multiple-of-25', '25的倍数', '➗5️⃣5️⃣', 25, '普通', '以 00,25,50,75 结尾', ['00','25','50','75']],
        ['multiple-of-50', '50的倍数', '➗5️⃣▫', 50, '普通', '以 00 或 50 结尾', ['00','50']],
        ['multiple-of-100', '100的倍数', '➗🔟▫', 100, '普通', '以 00 结尾', ['00']],
        ['multiple-of-500', '500的倍数', '➗5️⃣▪', 500, '罕见', '以 000 或 500 结尾', ['000','500']],
        ['multiple-of-1000', '1000的倍数', '➗🔟▪', 1000, '罕见', '以 000 结尾', ['000']],
        ['multiple-of-5000', '5000的倍数', '➗5️⃣◽', 5000, '稀有', '以 0000 或 5000 结尾', ['0000','5000']],
        ['multiple-of-10000', '10000的倍数', '➗🔟◽', 10000, '稀有', '以 0000 结尾', ['0000']],
        ['multiple-of-50000', '50000的倍数', '➗5️⃣◾', 50000, '史诗', '以 00000 或 50000 结尾', ['00000','50000']],
        ['multiple-of-100000', '100000的倍数', '➗🔟◾', 100000, '史诗', '以 00000 结尾', ['00000']],
        ['multiple-of-500000', '500000的倍数', '➗5️⃣◻', 500000, '传说', '以 000000 或 500000 结尾', ['000000','500000']],
        ['multiple-of-1000000', '1000000的倍数', '➗🔟◻', 1000000, '传说', '以 000000 结尾', ['000000']],
        ['multiple-of-5000000', '5000000的倍数', '➗5️⃣◼', 5000000, '神话', '以 0000000 或 5000000 结尾', ['0000000','5000000']],
        ['multiple-of-10000000', '10000000的倍数', '➗🔟◼', 10000000, '神话', '以 0000000 结尾', ['0000000']],
        ['multiple-of-50000000', '50000000的倍数', '➗5️⃣⬜', 50000000, '超越', '以 00000000 或 50000000 结尾', ['00000000','50000000']],
        ['multiple-of-100000000', '100000000的倍数', '➗🔟⬜', 100000000, '超越', '以 00000000 结尾', ['00000000']],
        ['multiple-of-500000000', '500000000的倍数', '➗5️⃣⬛', 500000000, '终结', '以 000000000 或 500000000 结尾', ['000000000','500000000']],
        ['multiple-of-1000000000', '1000000000的倍数', '➗🔟⬛', 1000000000, '终结', '以 000000000 结尾', ['000000000']]
    ];
    for (let def of suffixBadgeDefs) {
        const [id, name, emoji, score, rarity, desc, suffixes] = def;
        BADGE_DEFS.push({
            id: id,
            name: name,
            emoji: emoji,
            score: score,
            rarity: rarity,
            description: desc,
            check: function(d) {
                for (let s of suffixes) {
                    if (d.endsWith(s)) return true;
                }
                return false;
            }
        });
    }

    // ----- 多边形数 (3~16边形，跳过4边形) -----
    const polyConfigs = [
        { s: 3, emoji: '👣👣👣➗2️⃣', score: 70718, rarity: '史诗', name: '三角数', desc: '数字是三角数（n(n+1)/2）' },
        { s: 5, emoji: '🩺', score: 122476, rarity: '传说', name: '五边形数', desc: '数字是五边形数（n(3n-1)/2）' },
        { s: 6, emoji: '🩺🩺', score: 141421, rarity: '传说', name: '六边形数', desc: '数字是六边形数（n(2n-1)）' },
        { s: 7, emoji: '🩺🩺🩺', score: 158116, rarity: '传说', name: '七边形数', desc: '数字是七边形数（n(5n-3)/2）' },
        { s: 8, emoji: '🩺🩺🩺🩺', score: 173206, rarity: '传说', name: '八边形数', desc: '数字是八边形数（n(3n-2)）' },
        { s: 9, emoji: '🩺🩺🩺🩺', score: 187084, rarity: '传说', name: '九边形数', desc: '数字是九边形数（n(7n-5)/2）' },
        { s: 10, emoji: '🔟🩺', score: 200000, rarity: '传说', name: '十边形数', desc: '数字是十边形数（n(4n-3)）' },
        { s: 11, emoji: '🔟🩺🩺', score: 212135, rarity: '传说', name: '十一边形数', desc: '数字是十一边形数（n(9n-7)/2）' },
        { s: 12, emoji: '🔟🩺🩺🩺', score: 223609, rarity: '传说', name: '十二边形数', desc: '数字是十二边形数（n(5n-4)）' },
        { s: 13, emoji: '🔟🩺🩺🩺🩺', score: 234522, rarity: '传说', name: '十三边形数', desc: '数字是十三边形数（n(11n-9)/2）' },
        { s: 14, emoji: '🔟🩺🩺🩺🩺🩺', score: 244948, rarity: '传说', name: '十四边形数', desc: '数字是十四边形数（n(6n-5)）' },
        { s: 15, emoji: '🔟5️⃣🩺', score: 254953, rarity: '传说', name: '十五边形数', desc: '数字是十五边形数（n(13n-11)/2）' },
        { s: 16, emoji: '🔟5️⃣🩺🩺', score: 264578, rarity: '传说', name: '十六边形数', desc: '数字是十六边形数（n(7n-6)）' }
    ];
    for (let cfg of polyConfigs) {
        const s = cfg.s;
        if (s === 4) continue; // 四边形数即平方数，已由 power-2 覆盖
        BADGE_DEFS.push({
            id: `polygonal-${s}`,
            name: cfg.name,
            emoji: cfg.emoji,
            score: cfg.score,
            rarity: cfg.rarity,
            description: cfg.desc,
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                return isPolygonal(num, s);
            }
        });
    }

    // 暴露到全局
    window.BADGE_DEFS = BADGE_DEFS;
})();