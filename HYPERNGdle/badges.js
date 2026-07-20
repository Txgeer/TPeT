// badges.js – 徽章管理模块（含数据持久化、硬重置、历史最佳记录）
(function() {
    'use strict';

    // ---------- 存储键名 ----------
    const STORAGE_KEY = 'hyperngdle_data';

    // ---------- 工具函数 ----------
    function getEffectiveLength(digitsStr) {
        const trimmed = digitsStr.replace(/^0+/, '');
        return trimmed.length === 0 ? 1 : trimmed.length;
    }

    // ---------- 数论检测函数 ----------
    function isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

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

    function isHappyNumber(n) {
        if (n < 1) return false;
        const seen = new Set();
        while (n !== 1 && !seen.has(n)) {
            seen.add(n);
            let sum = 0;
            while (n > 0) {
                const digit = n % 10;
                sum += digit * digit;
                n = Math.floor(n / 10);
            }
            n = sum;
        }
        return n === 1;
    }

    function isPerfectPower(num, k) {
        if (num < 0) return false;
        if (k === 0) return false;
        if (num === 0 || num === 1) return true;
        let low = 1, high = Math.floor(Math.pow(num, 1/k)) + 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const power = Math.pow(mid, k);
            if (power === num) return true;
            if (power < num) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }

    function isDoubleFactorial(n) {
        if (n < 1) return false;
        let odd = 1, factor = 1;
        while (odd <= n) {
            if (odd === n) return true;
            factor += 2;
            odd *= factor;
        }
        let even = 2;
        factor = 2;
        while (even <= n) {
            if (even === n) return true;
            factor += 2;
            even *= factor;
        }
        return false;
    }

    function isFactorial(n) {
        if (n < 1) return false;
        let product = 1, i = 1;
        while (product < n) {
            i++;
            product *= i;
        }
        return product === n;
    }

    function isMersenneNumber(n) {
        if (n < 1) return false;
        const m = n + 1;
        return (m & (m - 1)) === 0;
    }

    function isConstructible(n) {
        if (n < 1) return false;
        const fermatPrimes = [3, 5, 17, 257, 65537];
        let temp = n;
        while (temp % 2 === 0) temp /= 2;
        for (let p of fermatPrimes) {
            if (temp % p === 0) {
                temp /= p;
                if (temp % p === 0) return false;
            }
        }
        return temp === 1;
    }

    function isKaprekar(digitsStr) {
        const n = BigInt(digitsStr);
        if (n < 0n) return false;
        for (let i = 1; i < digitsStr.length; i++) {
            const left = BigInt(digitsStr.slice(0, i));
            const right = BigInt(digitsStr.slice(i));
            const sum = left + right;
            if (sum * sum === n) return true;
        }
        return false;
    }

    function isFibonacci(n) {
        if (n < 0) return false;
        let a = 0, b = 1;
        if (n === a || n === b) return true;
        while (b < n) {
            const next = a + b;
            if (next === n) return true;
            a = b;
            b = next;
        }
        return false;
    }

    function isLucas(n) {
        if (n < 0) return false;
        let a = 2, b = 1;
        if (n === a || n === b) return true;
        while (b < n) {
            const next = a + b;
            if (next === n) return true;
            a = b;
            b = next;
        }
        return false;
    }

    function isPell(n) {
        if (n < 0) return false;
        let a = 0, b = 1;
        if (n === a || n === b) return true;
        while (b < n) {
            const next = 2 * b + a;
            if (next === n) return true;
            a = b;
            b = next;
        }
        return false;
    }

    function isTetrahedral(n) {
        if (n < 0) return false;
        let i = 0;
        while (true) {
            const tetra = i * (i + 1) * (i + 2) / 6;
            if (tetra === n) return true;
            if (tetra > n) return false;
            i++;
        }
    }

    function isSquarePyramidal(n) {
        if (n < 0) return false;
        let i = 0;
        while (true) {
            const pyramid = i * (i + 1) * (2 * i + 1) / 6;
            if (pyramid === n) return true;
            if (pyramid > n) return false;
            i++;
        }
    }

    function isCullen(digitsStr) {
        const n = BigInt(digitsStr);
        if (n < 1n) return false;
        let i = 1n;
        while (true) {
            const val = i * (1n << i) + 1n;
            if (val === n) return true;
            if (val > n) return false;
            i++;
        }
    }

    function isWoodall(digitsStr) {
        const n = BigInt(digitsStr);
        if (n < 1n) return false;
        let i = 1n;
        while (true) {
            const val = i * (1n << i) - 1n;
            if (val === n) return true;
            if (val > n) return false;
            i++;
        }
    }

    function isProth(digitsStr) {
        const n = BigInt(digitsStr);
        if (n < 1n) return false;
        let exponent = 1n;
        while (true) {
            const power = 1n << exponent;
            if (power > n) break;
            const diff = n - 1n;
            if (diff % power === 0n) {
                const k = diff / power;
                if (k % 2n === 1n && power > k) return true;
            }
            exponent++;
        }
        return false;
    }

    function isMoran(digitsStr) {
        const num = parseInt(digitsStr, 10);
        if (num <= 0) return false;
        let sum = 0;
        for (let ch of digitsStr) {
            sum += parseInt(ch, 10);
        }
        if (num % sum !== 0) return false;
        const quotient = num / sum;
        return isPrime(quotient);
    }

    // ---------- 亲密质数判断 ----------
    function isIntimatePrime(n) {
        if (n < 2 || !isPrime(n)) return false;
        const discriminant = 4 * n + 5;
        const sqrtD = Math.sqrt(discriminant);
        if (!Number.isInteger(sqrtD)) return false;
        if (sqrtD % 2 === 0) return false;
        const k = (sqrtD - 1) / 2;
        return k >= 1;
    }

    // ---------- 普洛尼克数判断（包含0） ----------
    function isPronic(n) {
        if (n < 0) return false;
        const k = Math.floor(Math.sqrt(n));
        return k * (k + 1) === n;
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

        // 条件徽章
        { id: 'multiple-of-three', name: '3的倍数', emoji: '➗3️⃣', score: 3, rarity: '平庸',
            check: d => parseInt(d, 10) % 3 === 0 },
        { id: 'first-last-equal', name: '首尾相等', emoji: '☸', score: 10, rarity: '平庸',
            check: function(d) {
                const trimmed = d.replace(/^0+/, '');
                if (trimmed.length === 0) return false;
                return trimmed[0] === trimmed[trimmed.length - 1];
            }
        },
        { id: 'semiprime', name: '半质数', emoji: '➗🤵', score: 5, rarity: '平庸',
            check: d => isSemiprime(parseInt(d, 10)) },
        { id: 'prime', name: '质数', emoji: '🤵', score: 22, rarity: '普通',
            check: d => isPrime(parseInt(d, 10)) },
        { id: 'abundant', name: '盈数', emoji: '🟥🟨🟩🟦', score: 5, rarity: '平庸',
            check: d => isAbundant(parseInt(d, 10)) },
        { id: 'no-zero', name: '攻', emoji: '⚔', score: 3, rarity: '平庸',
            check: d => !d.includes('0') },
        { id: 'no-one', name: '受', emoji: '🎪', score: 3, rarity: '平庸',
            check: d => !d.includes('1') },
        { id: 'no-one-has-zero', name: '受受', emoji: '🎪🎪', score: 5, rarity: '平庸',
            check: function(d) { return !d.includes('1') && d.includes('0'); }
        },
        { id: 'multiple-of-9', name: '9的倍数', emoji: '➗9️⃣', score: 9, rarity: '平庸',
            check: function(d) {
                let sum = 0;
                for (let ch of d) sum += parseInt(ch, 10);
                return sum % 9 === 0;
            }
        },
        { id: 'multiple-of-7', name: '7的倍数', emoji: '➗7️⃣', score: 7, rarity: '平庸',
            check: function(d) {
                if (d.length === 0) return false;
                const last = parseInt(d[d.length - 1], 10);
                const remaining = d.slice(0, -1);
                const num = remaining === '' ? 0 : parseInt(remaining, 10);
                return (num - 2 * last) % 7 === 0;
            }
        },
        { id: 'harshad', name: '哈沙德数', emoji: '🤣', score: 19, rarity: '普通',
            check: function(d) {
                let sum = 0;
                for (let ch of d) sum += parseInt(ch, 10);
                const num = parseInt(d, 10);
                return sum > 0 && num % sum === 0;
            }
        },
        { id: 'lucky-ticket', name: '幸运票', emoji: '🎟', score: 26, rarity: '普通',
            check: function(d) {
                const len = d.length;
                if (len % 2 !== 0) return false;
                const half = len / 2;
                let sumFirst = 0, sumSecond = 0;
                for (let i = 0; i < half; i++) {
                    sumFirst += parseInt(d[i], 10);
                    sumSecond += parseInt(d[half + i], 10);
                }
                return sumFirst === sumSecond;
            }
        },
        { id: 'happy-number', name: '快乐数', emoji: '😀', score: 7, rarity: '平庸',
            check: function(d) { return isHappyNumber(parseInt(d, 10)); }
        },
        { id: 'narcissistic', name: '水仙', emoji: '💧', score: 312500000, rarity: '终结',
            check: function(d) { return [0,1,2,3,4,5,6,7,8,9,153,370,371,407,1634,8208,9474,54748,92727,93084,548834,1741725,4210818,9800817,9926315,24678050,24678051,88593477,146511208, 472335975,534494836,912985153,4679307774].includes(parseInt(d,10)); }
        },
        { id: 'automorphic', name: '自守数', emoji: '🛡', score: 500000000, rarity: '终结',
            check: function(d) { return [0,1,5,6,25,76,376,625,9376,90625,109376,890625,2890625,7109376,12890625,87109376,212890625,787109376,1787109376,8212890625].includes(parseInt(d,10)); }
        },
        { id: 'heegner-number', name: '黑格纳数', emoji: '⬛', score: 1111111112, rarity: '无尽',
            check: function(d) { return [1,2,3,7,11,19,43,67,163].includes(parseInt(d,10)); }
        },
        { id: 'power-tower', name: '幂塔', emoji: '🐝🐝', score: 714285715, rarity: '终结',
            check: function(d) {
                const list = [1,4,16,27,256,3125,19683,46656,65536,823543,16777216,387420489,4294967296];
                return list.includes(parseInt(d,10));
            }
        },
        { id: 'double-factorial', name: '双阶乘', emoji: '‼', score: 500000000, rarity: '终结',
            check: function(d) { return isDoubleFactorial(parseInt(d,10)); }
        },
        { id: 'factorial', name: '阶乘', emoji: '❗', score: 769230770, rarity: '终结',
            check: function(d) { return isFactorial(parseInt(d,10)); }
        },
        { id: 'mersenne', name: '计算机', emoji: '🖥', score: 303030304, rarity: '终结',
            check: function(d) { return isMersenneNumber(parseInt(d,10)); }
        },
        { id: 'fermat-number', name: '费马数', emoji: '🐴', score: 1666666667, rarity: '无尽',
            check: function(d) { return [3,5,17,257,65537,4294967297].includes(parseInt(d,10)); }
        },
        { id: 'constructible', name: '尺规作图', emoji: '📏', score: 21929824, rarity: '超越',
            check: function(d) { return isConstructible(parseInt(d,10)); }
        },
        { id: 'omnipotent', name: '全能', emoji: '⚡', score: 3062, rarity: '稀有',
            check: function(d) {
                if (d.length !== 10) return false;
                const counts = new Array(10).fill(0);
                for (let ch of d) {
                    const digit = parseInt(ch, 10);
                    if (isNaN(digit)) return false;
                    counts[digit]++;
                    if (counts[digit] > 1) return false;
                }
                return counts.every(c => c === 1);
            }
        },
        { id: 'kaprekar', name: '雷劈数', emoji: '⚡💔', score: 172413794, rarity: '终结',
            check: function(d) { return isKaprekar(d); }
        },
        { id: 'perfect-number', name: '完全数', emoji: '💠', score: 1666666667, rarity: '无尽',
            check: function(d) { return [6,28,496,8128,33550336,8589869056].includes(parseInt(d,10)); }
        },
        { id: 'black-hole-number', name: '黑洞数', emoji: '🕳', score: 3333333334, rarity: '无尽',
            check: function(d) { return [123,495,6174].includes(parseInt(d,10)); }
        },
        { id: 'self-referential', name: '自指', emoji: '💅', score: 1250000000, rarity: '无尽',
            check: function(d) { return [1,11,21,1211,111221,312211,13112221,1113213211].includes(parseInt(d,10)); }
        },
        { id: 'fibonacci', name: '斐波那契', emoji: '🌬', score: 200000000, rarity: '终结',
            check: function(d) { return isFibonacci(parseInt(d,10)); }
        },
        { id: 'lucas', name: '吕卡', emoji: '🧱', score: 208333333, rarity: '终结',
            check: function(d) { return isLucas(parseInt(d,10)); }
        },
        { id: 'pell', name: '佩尔', emoji: '🪐', score: 357142857, rarity: '终结',
            check: function(d) { return isPell(parseInt(d,10)); }
        },
        { id: 'palindrome', name: '回文数', emoji: '⭕', score: 50001, rarity: '史诗',
            check: function(d) { return d === d.split('').reverse().join(''); }
        },
        { id: 'rotatable', name: '中心对称数', emoji: '💫', score: 1024, rarity: '稀有',
            check: function(d) {
                const valid = new Set(['0','1','6','8','9']);
                for (let ch of d) if (!valid.has(ch)) return false;
                return true;
            }
        },
        { id: 'rotational-palindrome', name: '中心对称回文数', emoji: '💫⭕', score: 1600257, rarity: '神话',
            check: function(d) {
                const valid = new Set(['0','1','6','8','9']);
                for (let ch of d) if (!valid.has(ch)) return false;
                return d === d.split('').reverse().join('');
            }
        },
        { id: 'tetrahedral', name: '四面体数', emoji: '😶😶😶😶', score: 2501251, rarity: '神话',
            check: function(d) { return isTetrahedral(parseInt(d,10)); }
        },
        { id: 'square-pyramidal', name: '四棱锥数', emoji: '✒✒✒✒', score: 3219576, rarity: '神话',
            check: function(d) { return isSquarePyramidal(parseInt(d,10)); }
        },
        { id: 'all-odd', name: '大奇', emoji: '🐔', score: 13, rarity: '普通',
            check: function(d) {
                const required = ['1','3','5','7','9'];
                for (let r of required) if (!d.includes(r)) return false;
                return true;
            }
        },
        { id: 'all-even', name: '大偶', emoji: '⚙', score: 15, rarity: '普通',
            check: function(d) {
                const required = ['2','4','6','8','0'];
                for (let r of required) if (!d.includes(r)) return false;
                return true;
            }
        },
        { id: 'pure-odd', name: '纯奇', emoji: '🐔🛑', score: 820, rarity: '罕见',
            check: function(d) {
                for (let ch of d) if (parseInt(ch,10) % 2 === 0) return false;
                return true;
            }
        },
        { id: 'pure-even', name: '纯偶', emoji: '⚙🛑', score: 1024, rarity: '稀有',
            check: function(d) {
                for (let ch of d) if (parseInt(ch,10) % 2 !== 0) return false;
                return true;
            }
        },
        { id: 'super-prime', name: '超质数', emoji: '💎', score: 7153, rarity: '稀有',
            check: function(d) {
                const allowed = new Set(['2','3','5','7']);
                for (let ch of d) if (!allowed.has(ch)) return false;
                return true;
            }
        },
        { id: 'super-composite', name: '超合数', emoji: '☢', score: 7153, rarity: '稀有',
            check: function(d) {
                const allowed = new Set(['4','6','8','9']);
                for (let ch of d) if (!allowed.has(ch)) return false;
                return true;
            }
        },
        { id: 'cullen', name: '卡伦数', emoji: '🔨', score: 357142858, rarity: '终结',
            check: function(d) { return isCullen(d); }
        },
        { id: 'woodall', name: '胡道尔数', emoji: '🌅', score: 370370371, rarity: '终结',
            check: function(d) { return isWoodall(d); }
        },
        { id: 'taxicab', name: '的士数', emoji: '🚕', score: 3333333334, rarity: '无尽',
            check: function(d) { return [2,1729,87539319].includes(parseInt(d,10)); }
        },
        { id: 'dedekind', name: '戴德金数', emoji: '🎖', score: 1428571429, rarity: '无尽',
            check: function(d) { return [2,3,6,20,168,7581,7828354].includes(parseInt(d,10)); }
        },
        { id: 'all-harshad', name: '全哈沙德数', emoji: '⚡🤣', score: 2500000000, rarity: '无尽',
            check: function(d) { return [1,2,4,6].includes(parseInt(d,10)); }
        },
        { id: 'highly-composite', name: '高合成数', emoji: '🗿', score: 133333334, rarity: '终结',
            check: function(d) {
                const list = [1,2,4,6,12,24,36,48,60,120,180,240,360,720,840,1260,1680,2520,5040,7560,10080,15120,20160,25200,27720,45360,50400,55440,83160,110880,166320,221760,277200,332640,498960,554400,665280,720720,1081080,1441440,2162160,2882880,3603600,4324320,6486480,7207200,8648640,10810800,14414400,17297280,21621600,32432400,36756720,43243200,61261200,73513440,110270160,122522400,147026880,183783600,232792560,279351072,367567200,465585120,698377680,735134400,1102701600,1396755360,2095133040,2327925600,2793510720,3491888400,4655851200,5587021440,6983776800];
                return list.includes(parseInt(d,10));
            }
        },
        { id: 'emirp', name: '可交换质数', emoji: '💨', score: 454545455, rarity: '终结',
            check: function(d) {
                const list = [2,3,5,7,11,13,17,31,37,71,73,79,97,113,131,199,311,337,373,733,919,991];
                return list.includes(parseInt(d,10));
            }
        },
        { id: 'wagstaff', name: '瓦格斯塔夫数', emoji: '🏚', score: 1000000000, rarity: '终结',
            check: function(d) {
                const list = [3,11,43,683,2731,43691,174763,2796203,178956971,715827883];
                return list.includes(parseInt(d,10));
            }
        },
        { id: 'pythagorean-prime', name: '毕达哥拉斯质数', emoji: '✏', score: 44, rarity: '普通',
            check: function(d) {
                const num = parseInt(d,10);
                return isPrime(num) && num % 4 === 1;
            }
        },
        { id: 'factorial-prime', name: '阶乘质数', emoji: '⁉', score: 1111111112, rarity: '无尽',
            check: function(d) {
                const list = [2,3,5,7,23,719,5039,39916801,479001599];
                return list.includes(parseInt(d,10));
            }
        },
        { id: 'thanks', name: '拜谢', emoji: '🎎', score: 126, rarity: '罕见',
            check: function(d) { return d.includes('297'); }
        },
        { id: 'extreme', name: '极值', emoji: '☄', score: 126, rarity: '罕见',
            check: function(d) { return d.includes('308'); }
        },
        { id: 'divine', name: '神明', emoji: '🧙‍♂️', score: 1429, rarity: '稀有',
            check: function(d) { return d.includes('6365'); }
        },
        { id: 'disorder', name: '无序', emoji: '💱', score: 16667, rarity: '史诗',
            check: function(d) { return d.includes('19728'); }
        },
        { id: 'brain-bubble', name: '脑泡', emoji: '🧠', score: 16668, rarity: '史诗',
            check: function(d) { return d.includes('66686'); }
        },
        { id: 'shape-flow', name: '形意顺', emoji: '🍕', score: 67, rarity: '普通',
            check: function(d) { return d.includes('122') || d.includes('221'); }
        },
        { id: 'advanced-shape-flow', name: '高阶形意顺', emoji: '🍕🍕', score: 100022, rarity: '传说',
            check: function(d) { return d.includes('122333') || d.includes('333221'); }
        },
        { id: 'big-sawtooth', name: '大锯齿', emoji: '🤐', score: 12345680, rarity: '超越',
            check: function(d) {
                if (d.length < 2) return false;
                const a = d[0], b = d[1];
                for (let i = 0; i < d.length; i++) {
                    if (i % 2 === 0) { if (d[i] !== a) return false; }
                    else { if (d[i] !== b) return false; }
                }
                return true;
            }
        },
        { id: 'two-pairs', name: '两对', emoji: '✔✔', score: 16, rarity: '普通',
            check: function(d) {
                for (let i = 0; i <= d.length - 4; i++) {
                    const sub = d.slice(i, i+4);
                    if (sub[0] === sub[1] && sub[2] === sub[3]) return true;
                }
                return false;
            }
        },
        { id: 'three-pairs', name: '三对', emoji: '✔✔✔', score: 218, rarity: '罕见',
            check: function(d) {
                for (let i = 0; i <= d.length - 6; i++) {
                    const sub = d.slice(i, i+6);
                    if (sub[0]===sub[1] && sub[2]===sub[3] && sub[4]===sub[5]) return true;
                }
                return false;
            }
        },
        { id: 'four-pairs', name: '四对', emoji: '✔✔✔✔', score: 3573, rarity: '稀有',
            check: function(d) {
                for (let i = 0; i <= d.length - 8; i++) {
                    const sub = d.slice(i, i+8);
                    if (sub[0]===sub[1] && sub[2]===sub[3] && sub[4]===sub[5] && sub[6]===sub[7]) return true;
                }
                return false;
            }
        },
        { id: 'five-pairs', name: '五对', emoji: '✔✔✔✔✔', score: 111112, rarity: '传说',
            check: function(d) {
                for (let i = 0; i <= d.length - 10; i++) {
                    const sub = d.slice(i, i+10);
                    if (sub[0]===sub[1] && sub[2]===sub[3] && sub[4]===sub[5] && sub[6]===sub[7] && sub[8]===sub[9]) return true;
                }
                return false;
            }
        },
        { id: 'two-triples', name: '两三条', emoji: '🌿🌿', score: 2071, rarity: '稀有',
            check: function(d) {
                for (let i = 0; i <= d.length - 6; i++) {
                    const sub = d.slice(i, i+6);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[3]===sub[4] && sub[4]===sub[5]) return true;
                }
                return false;
            }
        },
        { id: 'three-triples', name: '三三条', emoji: '🌿🌿🌿', score: 529353, rarity: '传说',
            check: function(d) {
                for (let i = 0; i <= d.length - 9; i++) {
                    const sub = d.slice(i, i+9);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[3]===sub[4] && sub[4]===sub[5] && sub[6]===sub[7] && sub[7]===sub[8]) return true;
                }
                return false;
            }
        },
        { id: 'two-quads', name: '两四条', emoji: '🐍🐍', score: 348420, rarity: '传说',
            check: function(d) {
                for (let i = 0; i <= d.length - 8; i++) {
                    const sub = d.slice(i, i+8);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[2]===sub[3] && sub[4]===sub[5] && sub[5]===sub[6] && sub[6]===sub[7]) return true;
                }
                return false;
            }
        },
        { id: 'two-quints', name: '两五条', emoji: '🦑🦑', score: 111111112, rarity: '终结',
            check: function(d) {
                for (let i = 0; i <= d.length - 10; i++) {
                    const sub = d.slice(i, i+10);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[2]===sub[3] && sub[3]===sub[4] && sub[5]===sub[6] && sub[6]===sub[7] && sub[7]===sub[8] && sub[8]===sub[9]) return true;
                }
                return false;
            }
        },
        { id: 'parity-balance', name: '合作协同', emoji: '🕊', score: 5, rarity: '平庸',
            check: function(d) {
                let odd = 0, even = 0;
                for (let ch of d) {
                    if (parseInt(ch,10) % 2 === 0) even++; else odd++;
                }
                return odd === even;
            }
        },
        { id: 'bear-market', name: '熊市', emoji: '📉', score: 1024, rarity: '稀有',
            check: function(d) {
                for (let ch of d) {
                    const digit = parseInt(ch,10);
                    if (digit < 0 || digit > 4) return false;
                }
                return true;
            }
        },
        { id: 'bull-market', name: '牛市', emoji: '📈', score: 820, rarity: '罕见',
            check: function(d) {
                for (let ch of d) {
                    const digit = parseInt(ch,10);
                    if (digit < 5 || digit > 9) return false;
                }
                return true;
            }
        },
        { id: 'anti-aesthetic', name: '反美学', emoji: '👁‍🗨', score: 7153, rarity: '稀有',
            check: function(d) {
                const allowed = new Set(['4','6','7','9']);
                for (let ch of d) if (!allowed.has(ch)) return false;
                return true;
            }
        },
        { id: 'proth', name: '普罗斯数', emoji: '🦐', score: 70508, rarity: '史诗',
            check: function(d) { return isProth(d); }
        },
        { id: 'moran', name: '莫兰数', emoji: '💐', score: 259, rarity: '罕见',
            check: function(d) { return isMoran(d); }
        },
        { id: 'parity-alternating', name: '奇偶和谐', emoji: '♻', score: 456, rarity: '罕见',
            check: function(d) {
                if (d.length <= 1) return true;
                for (let i = 0; i < d.length - 1; i++) {
                    const a = parseInt(d[i],10), b = parseInt(d[i+1],10);
                    if ((a % 2) === (b % 2)) return false;
                }
                return true;
            }
        },
        { id: 'left-truncatable-prime', name: '可左截短质数', emoji: '➰', score: 3727172, rarity: '神话',
            check: function(d) {
                const num = parseInt(d,10);
                if (!isPrime(num)) return false;
                for (let i = 1; i < d.length; i++) {
                    const sub = d.slice(i);
                    if (sub[0] === '0') return false;
                    if (!isPrime(parseInt(sub,10))) return false;
                }
                return true;
            }
        },
        {
            id: 'right-truncatable-prime',
            name: '可右截短质数',
            emoji: '➰➰',
            score: 120481928,
            rarity: '终结',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                if (!isPrime(num)) return false;
                for (let i = digitsStr.length - 1; i > 0; i--) {
                    const sub = digitsStr.slice(0, i);
                    const subNum = parseInt(sub, 10);
                    if (!isPrime(subNum)) return false;
                }
                return true;
            }
        },
        {
            id: 'both-truncatable-prime',
            name: '可双向截短质数',
            emoji: '➰➰➰',
            score: 666666667,
            rarity: '终结',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                const list = [2, 3, 5, 7, 23, 37, 53, 73, 313, 317, 373, 797, 3137, 3797, 739397];
                return list.includes(num);
            }
        },
        {
            id: 'intimate-prime',
            name: '亲密质数',
           emoji: '💞',
            score: 696428,
            rarity: '传说',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                return isIntimatePrime(num);
            }
        },
        {
            id: 'palindromic-prime',
            name: '回文质数',
            emoji: 'Ⓜ',
            score: 1679826,
            rarity: '神话',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                return isPrime(num) && digitsStr === digitsStr.split('').reverse().join('');
            }
        },
        {
            id: 'author-qq',
            name: '作者的QQ',
            emoji: '🐧',
            score: 500000000,
            rarity: '终结',
            check: function(digitsStr) {
                return digitsStr.includes('879893737');
            }
        },
        {
            id: 'progress-bar',
            name: '进度条',
            emoji: '〰',
            score: 3227,
            rarity: '稀有',
           check: function(digitsStr) {
                if (digitsStr.length <= 1) return false;
                const first = digitsStr[0];
                let oddSame = true;
                for (let i = 2; i < digitsStr.length; i += 2) {
                    if (digitsStr[i] !== first) {
                        oddSame = false;
                        break;
                    }
                }
                if (oddSame) return true;
                if (digitsStr.length < 2) return false;
                const second = digitsStr[1];
                let evenSame = true;
                for (let i = 3; i < digitsStr.length; i += 2) {
                    if (digitsStr[i] !== second) {
                        evenSame = false;
                        break;
                    }
                }
                return evenSame;
            }
        },
        {
            id: 'cyber-harshad',
            name: '赛博哈沙德数',
            emoji: '🤣🤖',
            score: 48,
            rarity: '普通',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                if (num <= 0) return false;
                const segments = {
                    '0': 6, '1': 2, '2': 5, '3': 5, '4': 4,
                    '5': 5, '6': 6, '7': 3, '8': 7, '9': 6
                };
                let sum = 0;
                for (let ch of digitsStr) {
                    sum += segments[ch];
                }
                return num % sum === 0;
            }
        },
        {
            id: 'neutral',
            name: '中立',
            emoji: '➕',
            score: 26,
            rarity: '普通',
            check: function(digitsStr) {
                if (digitsStr.length === 0) return false;
                let sum = 0;
                for (let ch of digitsStr) {
                    sum += parseInt(ch, 10);
                }
                return 2 * sum === 9 * digitsStr.length;
            }
        },
        {
            id: 'pronic',
            name: '普洛尼克数',
            emoji: '🦊',
            score: 100000,
            rarity: '史诗',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                return isPronic(num);
            }
        },
        {
            id: 'close-enough',
            name: '那是接近的',
            emoji: '🌀',
            score: 6,
            rarity: '平庸',
            check: function(digitsStr) {
                if (digitsStr.length <= 1) return true;
                const first = parseInt(digitsStr[0], 10);
                const last = parseInt(digitsStr[digitsStr.length - 1], 10);
                return Math.abs(first - last) === 1;
            }
        },
        {
            id: 'twin-prime',
            name: '孪生质数',
            emoji: '⛰',
            score: 183,
            rarity: '罕见',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                if (!isPrime(num)) return false;
                return isPrime(num - 2) || isPrime(num + 2);
            }
        },
        {
            id: 'triplet-prime',
            name: '三胞胎质数',
            emoji: '🏔',
            score: 1284,
            rarity: '稀有',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                if (!isPrime(num)) return false;
                // 三胞胎质数有两种形式：(p, p+2, p+6) 或 (p, p+4, p+6)
                // 检查 n 是否属于其中一种
                if (num >= 2) {
                    if (isPrime(num - 2) && isPrime(num + 4)) return true; // 模式 (n-2, n, n+4)
                    if (isPrime(num - 4) && isPrime(num + 2)) return true; // 模式 (n-4, n, n+2)
                }
                return false;
            }
        },
        {
            id: 'quadruplet-prime',
            name: '四胞胎质数',
            emoji: '🏞',
            score: 332592,
            rarity: '传说',
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                if (!isPrime(num)) return false;
                // 四胞胎质数形式：(p, p+2, p+6, p+8)
                // 检查 n 是否为其成员之一
                if (num >= 2) {
                    if (isPrime(num) && isPrime(num + 2) && isPrime(num + 6) && isPrime(num + 8)) return true;
                    if (isPrime(num - 2) && isPrime(num) && isPrime(num + 4) && isPrime(num + 6)) return true;
                    if (isPrime(num - 6) && isPrime(num - 4) && isPrime(num) && isPrime(num + 2)) return true;
                }
                return false;
            }
        },
        {
    id: 'detective',
    name: '侦探',
    emoji: '🕵️‍♂️',
    score: 16778524,
    rarity: '超越',
    check: function(digitsStr) {
        if (digitsStr.length === 0) return false;
        let sum = 0, product = 1;
        for (let ch of digitsStr) {
            const digit = parseInt(ch, 10);
            sum += digit;
            product *= digit;
        }
        return sum === product;
    }
}
    ];

    // 批量添加质数倍数徽章
    const PRIMES_FOR_BADGES = [11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
    for (const p of PRIMES_FOR_BADGES) {
        const digits = p.toString().split('').map(d => d + '️⃣').join('');
        BADGE_DEFS.push({
            id: `multiple-of-${p}`,
            name: `${p}的倍数`,
            emoji: `➗${digits}`,
            score: p,
            rarity: '普通',
            check: function(d) { return parseInt(d,10) % p === 0; }
        });
    }

    // 辅助：数字转 Emoji 数字
    function toEmojiDigits(num) {
        const map = {
            '0':'0️⃣','1':'1️⃣','2':'2️⃣','3':'3️⃣','4':'4️⃣',
            '5':'5️⃣','6':'6️⃣','7':'7️⃣','8':'8️⃣','9':'9️⃣'
        };
        return String(num).split('').map(d => map[d]).join('');
    }

    // 批量添加 2 的幂徽章 (2^2 ~ 2^20)
    const powerScores = [
        294117648, 476190477, 588235295, 666666667, 769230769,
        833333334, 833333334, 909090909,
        1000000000, 1000000000, 1000000000,
        1111111112, 1111111112, 1111111112, 1111111112, 1111111112,
        1250000000, 1250000000, 1250000000
    ];
    for (let i = 0; i < 19; i++) {
        const exponent = i + 2;
        const score = powerScores[i];
        const rarity = exponent <= 12 ? '终结' : '无尽';
        BADGE_DEFS.push({
            id: `power-of-2-${exponent}`,
            name: `${exponent}的幂`,
            emoji: '🐝' + toEmojiDigits(exponent),
            score: score,
            rarity: rarity,
            check: function(d) { return parseInt(d,10) === Math.pow(2, exponent); }
        });
    }

    // 批量添加 k 次方数 (k=2..20)
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
            check: function(d) { return isPerfectPower(parseInt(d,10), k); }
        });
    }

    // 九类到一类
    const classDefs = [
        { n:9, emoji:'9️⃣⚠', score:67, rarity:'普通' },
        { n:8, emoji:'8️⃣⚠', score:8, rarity:'平庸' },
        { n:7, emoji:'7️⃣⚠', score:3, rarity:'平庸' },
        { n:6, emoji:'6️⃣⚠', score:3, rarity:'平庸' },
        { n:5, emoji:'5️⃣⚠', score:8, rarity:'平庸' },
        { n:4, emoji:'4️⃣⚠', score:51, rarity:'普通' },
        { n:3, emoji:'3️⃣⚠', score:1123, rarity:'稀有' },
        { n:2, emoji:'2️⃣⚠', score:121873, rarity:'传说' },
        { n:1, emoji:'1️⃣⚠', score:109890110, rarity:'终结' }
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
            check: function(d) { return new Set(d).size === n; }
        });
    }

    // 九进制到二进制
    const baseDefs = [
        { base:9, emoji:'9️⃣🚫', score:3, rarity:'平庸', namePrefix:'九' },
        { base:8, emoji:'8️⃣🚫', score:9, rarity:'平庸', namePrefix:'八' },
        { base:7, emoji:'7️⃣🚫', score:36, rarity:'普通', namePrefix:'七' },
        { base:6, emoji:'6️⃣🚫', score:166, rarity:'罕见', namePrefix:'六' },
        { base:5, emoji:'5️⃣🚫', score:1024, rarity:'稀有', namePrefix:'五' },
        { base:4, emoji:'4️⃣🚫', score:9537, rarity:'稀有', namePrefix:'四' },
        { base:3, emoji:'3️⃣🚫', score:169351, rarity:'传说', namePrefix:'三' },
        { base:2, emoji:'2️⃣🚫', score:9765625, rarity:'神话', namePrefix:'二' }
    ];
    for (let def of baseDefs) {
        const b = def.base;
        BADGE_DEFS.push({
            id: `base-${b}`,
            name: def.namePrefix + '进制',
            emoji: def.emoji,
            score: def.score,
            rarity: def.rarity,
            check: function(d) {
                for (let ch of d) {
                    if (parseInt(ch,10) >= b) return false;
                }
                return true;
            }
        });
    }

    // 连续相同数字
    const consecutiveDefs = [
        { n:3, emoji:'3️⃣🦅', score:15, rarity:'普通', name:'豹子号' },
        { n:4, emoji:'4️⃣🦅', score:159, rarity:'罕见', name:'狮子号' },
        { n:5, emoji:'5️⃣🦅', score:1852, rarity:'稀有', name:'老虎号' },
        { n:6, emoji:'6️⃣🦅', score:22223, rarity:'史诗', name:'大象号' },
        { n:7, emoji:'7️⃣🦅', score:277778, rarity:'传说', name:'恐龙号' },
        { n:8, emoji:'8️⃣🦅', score:3703704, rarity:'神话', name:'麒麟号' },
        { n:9, emoji:'9️⃣🦅', score:55555556, rarity:'超越', name:'骁龙号' },
        { n:10, emoji:'🔟🦅', score:1111111112, rarity:'无尽', name:'天玑号' }
    ];
    for (let def of consecutiveDefs) {
        const n = def.n;
        BADGE_DEFS.push({
            id: `${n}-consecutive`,
            name: def.name,
            emoji: def.emoji,
            score: def.score,
            rarity: def.rarity,
            check: function(d) {
                if (d.length < n) return false;
                for (let i = 0; i <= d.length - n; i++) {
                    const first = d[i];
                    let allSame = true;
                    for (let j = i+1; j < i+n; j++) {
                        if (d[j] !== first) { allSame = false; break; }
                    }
                    if (allSame) return true;
                }
                return false;
            }
        });
    }

    // 倍数尾数
    const suffixBadgeDefs = [
        ['multiple-of-5', '5的倍数', '➗5️⃣', 5, '平庸', ['0','5']],
        ['multiple-of-10', '10的倍数', '➗🔟', 10, '平庸', ['0']],
        ['multiple-of-25', '25的倍数', '➗5️⃣5️⃣', 25, '普通', ['00','25','50','75']],
        ['multiple-of-50', '50的倍数', '➗5️⃣▫', 50, '普通', ['00','50']],
        ['multiple-of-100', '100的倍数', '➗🔟▫', 100, '普通', ['00']],
        ['multiple-of-500', '500的倍数', '➗5️⃣▪', 500, '罕见', ['000','500']],
        ['multiple-of-1000', '1000的倍数', '➗🔟▪', 1000, '罕见', ['000']],
        ['multiple-of-5000', '5000的倍数', '➗5️⃣◽', 5000, '稀有', ['0000','5000']],
        ['multiple-of-10000', '10000的倍数', '➗🔟◽', 10000, '稀有', ['0000']],
        ['multiple-of-50000', '50000的倍数', '➗5️⃣◾', 50000, '史诗', ['00000','50000']],
        ['multiple-of-100000', '100000的倍数', '➗🔟◾', 100000, '史诗', ['00000']],
        ['multiple-of-500000', '500000的倍数', '➗5️⃣◻', 500000, '传说', ['000000','500000']],
        ['multiple-of-1000000', '1000000的倍数', '➗🔟◻', 1000000, '传说', ['000000']],
        ['multiple-of-5000000', '5000000的倍数', '➗5️⃣◼', 5000000, '神话', ['0000000','5000000']],
        ['multiple-of-10000000', '10000000的倍数', '➗🔟◼', 10000000, '神话', ['0000000']],
        ['multiple-of-50000000', '50000000的倍数', '➗5️⃣⬜', 50000000, '超越', ['00000000','50000000']],
        ['multiple-of-100000000', '100000000的倍数', '➗🔟⬜', 100000000, '超越', ['00000000']],
        ['multiple-of-500000000', '500000000的倍数', '➗5️⃣⬛', 500000000, '终结', ['000000000','500000000']],
        ['multiple-of-1000000000', '1000000000的倍数', '➗🔟⬛', 1000000000, '终结', ['000000000']]
    ];
    for (let def of suffixBadgeDefs) {
        const [id, name, emoji, score, rarity, suffixes] = def;
        BADGE_DEFS.push({
            id: id,
            name: name,
            emoji: emoji,
            score: score,
            rarity: rarity,
            check: function(d) {
                for (let s of suffixes) {
                    if (d.endsWith(s)) return true;
                }
                return false;
            }
        });
    }

    // ---------- 多边形数通用生成（3 ~ 16边形） ----------
    function isPolygonal(n, s) {
        if (n < 1) return false;
        const a = s - 2;
        const b = -(s - 4);
        const c = -2 * n;
        const delta = b * b - 4 * a * c;
        const sqrtDelta = Math.sqrt(delta);
        if (sqrtDelta !== Math.floor(sqrtDelta)) return false;
        const root = (-b + sqrtDelta) / (2 * a);
        return Number.isInteger(root) && root >= 1;
    }
    
    const polyConfigs = [
        { s: 3, emoji: '👣👣👣➗2️⃣', score: 70718, rarity: '史诗' },
        { s: 5, emoji: '🩺', score: 122476, rarity: '传说' },
        { s: 6, emoji: '🩺🩺', score: 141421, rarity: '传说' },
        { s: 7, emoji: '🩺🩺🩺', score: 158116, rarity: '传说' },
        { s: 8, emoji: '🩺🩺🩺🩺', score: 173206, rarity: '传说' },
        { s: 9, emoji: '🩺🩺🩺🩺', score: 187084, rarity: '传说' },
        { s: 10, emoji: '🔟🩺', score: 200000, rarity: '传说' },
        { s: 11, emoji: '🔟🩺🩺', score: 212135, rarity: '传说' },
        { s: 12, emoji: '🔟🩺🩺🩺', score: 223609, rarity: '传说' },
        { s: 13, emoji: '🔟🩺🩺🩺🩺', score: 234522, rarity: '传说' },
        { s: 14, emoji: '🔟🩺🩺🩺🩺🩺', score: 244948, rarity: '传说' },
        { s: 15, emoji: '🔟5️⃣🩺', score: 254953, rarity: '传说' },
        { s: 16, emoji: '🔟5️⃣🩺🩺', score: 264578, rarity: '传说' }
    ];

    for (let cfg of polyConfigs) {
        const s = cfg.s;
        if (s === 4) continue;
    
        const nameMap = {
            3: '三角数', 5: '五边形数', 6: '六边形数', 7: '七边形数',
            8: '八边形数', 9: '九边形数', 10: '十边形数', 11: '十一边形数',
            12: '十二边形数', 13: '十三边形数', 14: '十四边形数',
            15: '十五边形数', 16: '十六边形数'
        };
    
        BADGE_DEFS.push({
            id: `polygonal-${s}`,
            name: nameMap[s],
            emoji: cfg.emoji,
            score: cfg.score,
            rarity: cfg.rarity,
            check: function(digitsStr) {
                const num = parseInt(digitsStr, 10);
                return isPolygonal(num, s);
            }
        });
    }

    // ---------- 全局状态 ----------
    let earnedBadges = [];
    let totalTP = 0;
    let currentTP = 0;
    let currentNumberStr = '';
    let newBadgeIds = new Set();
    let totalGenerations = 0;
    let bestNumber = '';
    let bestScore = 0;
    let showAllBadges = true;         // 是否显示所有徽章（包括未获得的）

    // ---------- 数据持久化 ----------
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            // 兼容旧版本：若不存在 showAllBadges，默认为 true
            if (data.showAllBadges === undefined) data.showAllBadges = true;
            return data;
        } catch {
            return null;
        }
    }

    function saveData() {
        const data = {
            earnedBadges: earnedBadges,
            totalTP: totalTP,
            totalGenerations: totalGenerations,
            bestNumber: bestNumber,
            bestScore: bestScore,
            showAllBadges: showAllBadges
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // ---------- DOM 引用 ----------
    let badgeListEl = null;
    let totalScoreSpan = null;
    let currentScoreSpan = null;

    // ---------- 显示模式 ----------
    function toggleShowAllBadges() {
        showAllBadges = !showAllBadges;
        saveData();                // 持久化
        updateBadgeUI();
    }

    function getShowAllBadges() {
        return showAllBadges;
    }

    // ---------- 初始化绑定 ----------
    function initBadgeUI(badgeListElement, totalScoreElement, currentScoreElement) {
        badgeListEl = badgeListElement;
        totalScoreSpan = totalScoreElement;
        currentScoreSpan = currentScoreElement || null;

        const saved = loadData();
        if (saved) {
            earnedBadges = saved.earnedBadges || [];
            totalTP = saved.totalTP || 0;
            totalGenerations = saved.totalGenerations || 0;
            bestNumber = saved.bestNumber || '';
            bestScore = saved.bestScore || 0;
            showAllBadges = saved.showAllBadges !== undefined ? saved.showAllBadges : true;
        } else {
            earnedBadges = [];
            totalTP = 0;
            totalGenerations = 0;
            bestNumber = '';
            bestScore = 0;
            showAllBadges = true;
        }
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

        const sorted = [...earnedBadges].sort((a,b) => b.score - a.score);
        const hasCurrent = currentNumberStr && currentNumberStr.length > 0;

        sorted.forEach(badge => {
            const def = BADGE_DEFS.find(d => d.id === badge.id);
            let isActive = false;
            if (hasCurrent && def) {
                isActive = def.check(currentNumberStr);
            }
            if (!isActive && !showAllBadges) return;

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
                <span class="badge-score">+${format(badge.score)}TP</span>
            `;

            if (isNew) {
                pill.addEventListener('mouseenter', function() {
                    newBadgeIds.delete(badge.id);
                    updateBadgeUI();
                });
            }

            badgeListEl.appendChild(pill);
        });
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

        // 更新历史最佳
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

    // ---------- 增加生成次数 ----------
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

    // ---------- 获取历史最佳 ----------
    function getBest() {
        return { number: bestNumber, score: bestScore };
    }

    // ---------- 硬重置 ----------
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
        localStorage.removeItem(STORAGE_KEY);
        updateBadgeUI();
        if (window.onTotalGenerationsChange) {
            window.onTotalGenerationsChange(0);
        }
        if (window.onBestChange) {
            window.onBestChange({ number: '', score: 0 });
        }
    }

    // ---------- 软重置 ----------
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
        toggleShowAllBadges,
        getShowAllBadges,
        incrementGenerations,
        getTotalGenerations,
        hardReset,
        getBest,
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
        }
    };
})();