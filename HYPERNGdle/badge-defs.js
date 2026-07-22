// badge-defs.js – 构建所有徽章定义（依赖 MathUtils）
(function() {
    'use strict';
    const MU = window.MathUtils;
    const { getEffectiveLength, toEmojiDigits, isPrime, isSemiprime, isAbundant, isHappyNumber,
            isPerfectPower, isDoubleFactorial, isFactorial, isMersenneNumber, isConstructible,
            isKaprekar, isFibonacci, isLucas, isPell, isTetrahedral, isSquarePyramidal,
            isCullen, isWoodall, isProth, isMoran, isIntimatePrime, isPronic,
            isPowerOfBase, isPolygonal } = MU;

    // ========== 徽章定义（含 description） ==========
    const BADGE_DEFS = [
        // 位数徽章
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

        // 条件徽章
        {
            id: 'multiple-of-three',
            name: '3的倍数',
            emoji: '➗3️⃣',
            score: 3,
            rarity: '平庸',
            description: '各位数码之和能被 3 整除',
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
        {
            id: 'semiprime',
            name: '半质数',
            emoji: '➗🤵',
            score: 5,
            rarity: '平庸',
            description: '数字是两个质数的乘积',
            check: d => isSemiprime(parseInt(d, 10))
        },
        {
            id: 'prime',
            name: '质数',
            emoji: '🤵',
            score: 22,
            rarity: '普通',
            description: '数字只能被 1 和自身整除',
            check: d => isPrime(parseInt(d, 10))
        },
        {
            id: 'abundant',
            name: '盈数',
            emoji: '🟥🟨🟩🟦',
            score: 5,
            rarity: '平庸',
            description: '数字的所有真因子之和大于数字本身',
            check: d => isAbundant(parseInt(d, 10))
        },
        {
            id: 'no-zero',
            name: '攻',
            emoji: '⚔',
            score: 3,
            rarity: '平庸',
            description: '数字中不包含 0',
            check: d => !d.includes('0')
        },
        {
            id: 'no-one',
            name: '受',
            emoji: '🎪',
            score: 3,
            rarity: '平庸',
            description: '数字中不包含 1',
            check: d => !d.includes('1')
        },
        {
            id: 'no-one-has-zero',
            name: '受受',
            emoji: '🎪🎪',
            score: 5,
            rarity: '平庸',
            description: '数字中不包含 1，但包含至少一个 0',
            check: function(d) { return !d.includes('1') && d.includes('0'); }
        },
        {
            id: 'multiple-of-9',
            name: '9的倍数',
            emoji: '➗9️⃣',
            score: 9,
            rarity: '平庸',
            description: '各位数码之和能被 9 整除',
            check: function(d) {
                let sum = 0;
                for (let ch of d) sum += parseInt(ch, 10);
                return sum % 9 === 0;
            }
        },
        {
            id: 'multiple-of-7',
            name: '7的倍数',
            emoji: '➗7️⃣',
            score: 7,
            rarity: '平庸',
            description: '数字能被 7 整除',
            check: function(d) { return parseInt(d, 10) % 7 === 0; }
        },
        {
            id: 'harshad',
            name: '哈沙德数',
            emoji: '🤣',
            score: 19,
            rarity: '普通',
            description: '数字能被其各位数码之和整除',
            check: function(d) {
                let sum = 0;
                for (let ch of d) sum += parseInt(ch, 10);
                const num = parseInt(d, 10);
                return sum > 0 && num % sum === 0;
            }
        },
        {
            id: 'lucky-ticket',
            name: '幸运票',
            emoji: '🎟',
            score: 26,
            rarity: '普通',
            description: '数字长度为偶数，且前半部分数字和等于后半部分数字和',
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
        {
            id: 'happy-number',
            name: '快乐数',
            emoji: '😀',
            score: 7,
            rarity: '平庸',
            description: '将数字各位数码平方和反复计算，最终能变为 1',
            check: function(d) { return isHappyNumber(parseInt(d, 10)); }
        },
        {
            id: 'narcissistic',
            name: '水仙',
            emoji: '💧',
            score: 303030304,
            rarity: '终结',
            description: '数字是水仙花数（各码数字的位数次方之和等于本身）',
            check: function(d) { return [0,1,2,3,4,5,6,7,8,9,153,370,371,407,1634,8208,9474,54748,92727,93084,548834,1741725,4210818,9800817,9926315,24678050,24678051,88593477,146511208,472335975,534494836,912985153,4679307774].includes(parseInt(d,10)); }
        },
        {
            id: 'automorphic',
            name: '自守数',
            emoji: '🛡',
            score: 500000000,
            rarity: '终结',
            description: '数字的平方末尾仍然等于该数字本身',
            check: function(d) { return [0,1,5,6,25,76,376,625,9376,90625,109376,890625,2890625,7109376,12890625,87109376,212890625,787109376,1787109376,8212890625].includes(parseInt(d,10)); }
        },
        {
            id: 'heegner-number',
            name: '黑格纳数',
            emoji: '⬛',
            score: 1111111112,
            rarity: '无尽',
            description: '数字是黑格纳数（1,2,3,7,11,19,43,67,163）',
            check: function(d) { return [1,2,3,7,11,19,43,67,163].includes(parseInt(d,10)); }
        },
        {
            id: 'power-tower',
            name: '幂塔',
            emoji: '🐝🐝',
            score: 714285715,
            rarity: '终结',
            description: '数字是 n（任意个^n） 形式',
            check: function(d) {
                const list = [1,4,16,27,256,3125,19683,46656,65536,823543,16777216,387420489,4294967296];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'double-factorial',
            name: '双阶乘',
            emoji: '‼',
            score: 500000000,
            rarity: '终结',
            description: '数字是某个整数的双阶乘（n!!）',
            check: function(d) { return isDoubleFactorial(parseInt(d,10)); }
        },
        {
            id: 'factorial',
            name: '阶乘',
            emoji: '❗',
            score: 769230770,
            rarity: '终结',
            description: '数字是某个整数的阶乘（n!）',
            check: function(d) { return isFactorial(parseInt(d,10)); }
        },
        {
            id: 'mersenne',
            name: '计算机',
            emoji: '🖥',
            score: 303030304,
            rarity: '终结',
            description: '数字是梅森数（2^n - 1）',
            check: function(d) { return isMersenneNumber(parseInt(d,10)); }
        },
        {
            id: 'fermat-number',
            name: '费马数',
            emoji: '🐴',
            score: 1666666667,
            rarity: '无尽',
            description: '数字是费马数（2^2^n + 1）',
            check: function(d) { return [3,5,17,257,65537,4294967297].includes(parseInt(d,10)); }
        },
        {
            id: 'constructible',
            name: '尺规作图',
            emoji: '📏',
            score: 21929824,
            rarity: '超越',
            description: '数字是尺规可作图正多边形的边数',
            check: function(d) { return isConstructible(parseInt(d,10)); }
        },
        {
            id: 'omnipotent',
            name: '全能',
            emoji: '⚡',
            score: 3062,
            rarity: '稀有',
            description: '10 位数字中 0–9 每个数字恰好出现一次',
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
        {
            id: 'kaprekar',
            name: '雷劈数',
            emoji: '⚡💔',
            score: 172413794,
            rarity: '终结',
            description: '将数字分成两部分，其和的平方等于原数',
            check: function(d) { return isKaprekar(d); }
        },
        {
            id: 'perfect-number',
            name: '完全数',
            emoji: '💠',
            score: 1666666667,
            rarity: '无尽',
            description: '数字是完全数（6,28,496,8128,33550336,8589869056）',
            check: function(d) { return [6,28,496,8128,33550336,8589869056].includes(parseInt(d,10)); }
        },
        {
            id: 'black-hole-number',
            name: '黑洞数',
            emoji: '🕳',
            score: 2500000000,
            rarity: '无尽',
            description: '数字是黑洞数（123, 495, 1089, 6174）',
            check: function(d) { return [123,495,1089,6174].includes(parseInt(d,10)); }
        },
        {
            id: 'self-referential',
            name: '自指',
            emoji: '💅',
            score: 1250000000,
            rarity: '无尽',
            description: '数字是外观数列的某一项（1,11,21,1211,111221,312211,13112221,1113213211）',
            check: function(d) { return [1,11,21,1211,111221,312211,13112221,1113213211].includes(parseInt(d,10)); }
        },
        {
            id: 'fibonacci',
            name: '斐波那契',
            emoji: '🌬',
            score: 200000000,
            rarity: '终结',
            description: '数字是斐波那契数列中的一项',
            check: function(d) { return isFibonacci(parseInt(d,10)); }
        },
        {
            id: 'lucas',
            name: '吕卡',
            emoji: '🧱',
            score: 208333333,
            rarity: '终结',
            description: '数字是卢卡斯数列中的一项',
            check: function(d) { return isLucas(parseInt(d,10)); }
        },
        {
            id: 'pell',
            name: '佩尔',
            emoji: '🪐',
            score: 357142857,
            rarity: '终结',
            description: '数字是佩尔数列中的一项',
            check: function(d) { return isPell(parseInt(d,10)); }
        },
        {
            id: 'palindrome',
            name: '回文数',
            emoji: '⭕',
            score: 50001,
            rarity: '史诗',
            description: '数字正着读和反着读相同',
            check: function(d) { return d === d.split('').reverse().join(''); }
        },
        {
            id: 'rotatable',
            name: '中心对称数',
            emoji: '💫',
            score: 1024,
            rarity: '稀有',
            description: '数字只包含 0,1,6,8,9（旋转后仍为数字）',
            check: function(d) {
                const valid = new Set(['0','1','6','8','9']);
                for (let ch of d) if (!valid.has(ch)) return false;
                return true;
            }
        },
        {
            id: 'rotational-palindrome',
            name: '中心对称回文数',
            emoji: '💫⭕',
            score: 1600257,
            rarity: '神话',
            description: '数字只包含 0,1,6,8,9 且正着读和反着读相同',
            check: function(d) {
                const valid = new Set(['0','1','6','8','9']);
                for (let ch of d) if (!valid.has(ch)) return false;
                return d === d.split('').reverse().join('');
            }
        },
        {
            id: 'tetrahedral',
            name: '四面体数',
            emoji: '😶😶😶😶',
            score: 2501251,
            rarity: '神话',
            description: '数字是四面体数（第 n 个四面体数）',
            check: function(d) { return isTetrahedral(parseInt(d,10)); }
        },
        {
            id: 'square-pyramidal',
            name: '四棱锥数',
            emoji: '✒✒✒✒',
            score: 3219576,
            rarity: '神话',
            description: '数字是四棱锥数（平方和）',
            check: function(d) { return isSquarePyramidal(parseInt(d,10)); }
        },
        {
            id: 'all-odd',
            name: '大奇',
            emoji: '🐔',
            score: 13,
            rarity: '普通',
            description: '数字包含所有奇数至少一次',
            check: function(d) {
                const required = ['1','3','5','7','9'];
                for (let r of required) if (!d.includes(r)) return false;
                return true;
            }
        },
        {
            id: 'all-even',
            name: '大偶',
            emoji: '⚙',
            score: 15,
            rarity: '普通',
            description: '数字包含所有偶数至少一次',
            check: function(d) {
                const required = ['2','4','6','8','0'];
                for (let r of required) if (!d.includes(r)) return false;
                return true;
            }
        },
        {
            id: 'pure-odd',
            name: '纯奇',
            emoji: '🐔🛑',
            score: 820,
            rarity: '罕见',
            description: '每一位数字都是奇数',
            check: function(d) {
                for (let ch of d) if (parseInt(ch,10) % 2 === 0) return false;
                return true;
            }
        },
        {
            id: 'pure-even',
            name: '纯偶',
            emoji: '⚙🛑',
            score: 1024,
            rarity: '稀有',
            description: '每一位数字都是偶数',
            check: function(d) {
                for (let ch of d) if (parseInt(ch,10) % 2 !== 0) return false;
                return true;
            }
        },
        {
            id: 'super-prime',
            name: '超质数',
            emoji: '💎',
            score: 7153,
            rarity: '稀有',
            description: '每一位数字都是质数（2,3,5,7）',
            check: function(d) {
                const allowed = new Set(['2','3','5','7']);
                for (let ch of d) if (!allowed.has(ch)) return false;
                return true;
            }
        },
        {
            id: 'super-composite',
            name: '超合数',
            emoji: '☢',
            score: 7153,
            rarity: '稀有',
            description: '每一位数字都是合数（4,6,8,9）',
            check: function(d) {
                const allowed = new Set(['4','6','8','9']);
                for (let ch of d) if (!allowed.has(ch)) return false;
                return true;
            }
        },
        {
            id: 'cullen',
            name: '卡伦数',
            emoji: '🔨',
            score: 357142858,
            rarity: '终结',
            description: '数字是卡伦数（n·2^n + 1）',
            check: function(d) { return isCullen(d); }
        },
        {
            id: 'woodall',
            name: '胡道尔数',
            emoji: '🌅',
            score: 370370371,
            rarity: '终结',
            description: '数字是胡道尔数（n·2^n - 1）',
            check: function(d) { return isWoodall(d); }
        },
        {
            id: 'taxicab',
            name: '的士数',
            emoji: '🚕',
            score: 3333333334,
            rarity: '无尽',
            description: '数字是能以 n 种不同方法表示成两个正立方数之和的最小正整数（2,1729,87539319）',
            check: function(d) { return [2,1729,87539319].includes(parseInt(d,10)); }
        },
        {
            id: 'dedekind',
            name: '戴德金数',
            emoji: '🎖',
            score: 1428571429,
            rarity: '无尽',
            description: '数字是戴德金数（2,3,6,20,168,7581,7828354）',
            check: function(d) { return [2,3,6,20,168,7581,7828354].includes(parseInt(d,10)); }
        },
        {
            id: 'all-harshad',
            name: '全哈沙德数',
            emoji: '🤣⚡',
            score: 2500000000,
            rarity: '无尽',
            description: '数字在任何进制下都能被其各位数码之和整除（1,2,4,6）',
            check: function(d) { return [1,2,4,6].includes(parseInt(d,10)); }
        },
        {
            id: 'highly-composite',
            name: '高合成数',
            emoji: '🗿',
            score: 133333334,
            rarity: '终结',
            description: '数字是高合成数（因数个数比所有更小的数都多）',
            check: function(d) {
                const list = [1,2,4,6,12,24,36,48,60,120,180,240,360,720,840,1260,1680,2520,5040,7560,10080,15120,20160,25200,27720,45360,50400,55440,83160,110880,166320,221760,277200,332640,498960,554400,665280,720720,1081080,1441440,2162160,2882880,3603600,4324320,6486480,7207200,8648640,10810800,14414400,17297280,21621600,32432400,36756720,43243200,61261200,73513440,110270160,122522400,147026880,183783600,232792560,279351072,367567200,465585120,698377680,735134400,1102701600,1396755360,2095133040,2327925600,2793510720,3491888400,4655851200,5587021440,6983776800];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'emirp',
            name: '可交换质数',
            emoji: '💨',
            score: 454545455,
            rarity: '终结',
            description: '数字是质数，且其反序数也是质数（可交换质数）',
            check: function(d) {
                const list = [2,3,5,7,11,13,17,31,37,71,73,79,97,113,131,199,311,337,373,733,919,991];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'wagstaff',
            name: '瓦格斯塔夫数',
            emoji: '🏚',
            score: 1000000000,
            rarity: '终结',
            description: '数字是瓦格斯塔夫数（(2^p + 1)/3）',
            check: function(d) {
                const list = [3,11,43,683,2731,43691,174763,2796203,178956971,715827883];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'pythagorean-prime',
            name: '毕达哥拉斯质数',
            emoji: '✏',
            score: 44,
            rarity: '普通',
            description: '数字是质数且形如 4n+1',
            check: function(d) {
                const num = parseInt(d,10);
                return isPrime(num) && num % 4 === 1;
            }
        },
        {
            id: 'factorial-prime',
            name: '阶乘质数',
            emoji: '⁉',
            score: 1111111112,
            rarity: '无尽',
            description: '数字是阶乘质数（n! ± 1）',
            check: function(d) {
                const list = [2,3,5,7,23,719,5039,39916801,479001599];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'thanks',
            name: '拜谢',
            emoji: '🎎',
            score: 126,
            rarity: '罕见',
            description: '数字包含子串 "297"',
            check: function(d) { return d.includes('297'); }
        },
        {
            id: 'extreme',
            name: '极值',
            emoji: '☄',
            score: 126,
            rarity: '罕见',
            description: '数字包含子串 "308"',
            check: function(d) { return d.includes('308'); }
        },
        {
            id: 'divine',
            name: '天神',
            emoji: '🧙‍♂️',
            score: 1429,
            rarity: '稀有',
            description: '数字包含子串 "6365"',
            check: function(d) { return d.includes('6365'); }
        },
        {
            id: 'disorder',
            name: '无序',
            emoji: '💱',
            score: 16667,
            rarity: '史诗',
            description: '数字包含子串 "19728"',
            check: function(d) { return d.includes('19728'); }
        },
        {
            id: 'brain-bubble',
            name: '脑泡',
            emoji: '🧠',
            score: 16668,
            rarity: '史诗',
            description: '数字包含子串 "66686"',
            check: function(d) { return d.includes('66686'); }
        },
        {
            id: 'shape-flow',
            name: '形意顺',
            emoji: '🍕',
            score: 67,
            rarity: '普通',
            description: '数字包含子串 "122" 或 "221"',
            check: function(d) { return d.includes('122') || d.includes('221'); }
        },
        {
            id: 'advanced-shape-flow',
            name: '高阶形意顺',
            emoji: '🍕🍕',
            score: 100022,
            rarity: '传说',
            description: '数字包含子串 "122333" 或 "333221"',
            check: function(d) { return d.includes('122333') || d.includes('333221'); }
        },
        {
            id: 'big-sawtooth',
            name: '大锯齿',
            emoji: '🤐',
            score: 12345680,
            rarity: '超越',
            description: '数字由两种数字交替组成',
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
        {
            id: 'two-pairs',
            name: '两对',
            emoji: '✔✔',
            score: 16,
            rarity: '普通',
            description: '数字中包含连续的两对相同数字',
            check: function(d) {
                for (let i = 0; i <= d.length - 4; i++) {
                    const sub = d.slice(i, i+4);
                    if (sub[0] === sub[1] && sub[2] === sub[3]) return true;
                }
                return false;
            }
        },
        {
            id: 'three-pairs',
            name: '三对',
            emoji: '✔✔✔',
            score: 218,
            rarity: '罕见',
            description: '数字中包含连续的三对相同数字',
            check: function(d) {
                for (let i = 0; i <= d.length - 6; i++) {
                    const sub = d.slice(i, i+6);
                    if (sub[0]===sub[1] && sub[2]===sub[3] && sub[4]===sub[5]) return true;
                }
                return false;
            }
        },
        {
            id: 'four-pairs',
            name: '四对',
            emoji: '✔✔✔✔',
            score: 3573,
            rarity: '稀有',
            description: '数字中包含连续的四对相同数字',
            check: function(d) {
                for (let i = 0; i <= d.length - 8; i++) {
                    const sub = d.slice(i, i+8);
                    if (sub[0]===sub[1] && sub[2]===sub[3] && sub[4]===sub[5] && sub[6]===sub[7]) return true;
                }
                return false;
            }
        },
        {
            id: 'five-pairs',
            name: '五对',
            emoji: '✔✔✔✔✔',
            score: 111112,
            rarity: '传说',
            description: '数字中包含连续的五对相同数字',
            check: function(d) {
                for (let i = 0; i <= d.length - 10; i++) {
                    const sub = d.slice(i, i+10);
                    if (sub[0]===sub[1] && sub[2]===sub[3] && sub[4]===sub[5] && sub[6]===sub[7] && sub[8]===sub[9]) return true;
                }
                return false;
            }
        },
        {
            id: 'two-triples',
            name: '两三条',
            emoji: '🌿🌿',
            score: 2071,
            rarity: '稀有',
            description: '数字中包含连续的两个三连号',
            check: function(d) {
                for (let i = 0; i <= d.length - 6; i++) {
                    const sub = d.slice(i, i+6);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[3]===sub[4] && sub[4]===sub[5]) return true;
                }
                return false;
            }
        },
        {
            id: 'three-triples',
            name: '三三条',
            emoji: '🌿🌿🌿',
            score: 529353,
            rarity: '传说',
            description: '数字中包含连续的三个三连号',
            check: function(d) {
                for (let i = 0; i <= d.length - 9; i++) {
                    const sub = d.slice(i, i+9);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[3]===sub[4] && sub[4]===sub[5] && sub[6]===sub[7] && sub[7]===sub[8]) return true;
                }
                return false;
            }
        },
        {
            id: 'two-quads',
            name: '两四条',
            emoji: '🐍🐍',
            score: 348420,
            rarity: '传说',
            description: '数字中包含连续的两个四连号',
            check: function(d) {
                for (let i = 0; i <= d.length - 8; i++) {
                    const sub = d.slice(i, i+8);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[2]===sub[3] && sub[4]===sub[5] && sub[5]===sub[6] && sub[6]===sub[7]) return true;
                }
                return false;
            }
        },
        {
            id: 'two-quints',
            name: '两五条',
            emoji: '🦑🦑',
            score: 111111112,
            rarity: '终结',
            description: '数字中包含连续的两个五连号',
            check: function(d) {
                for (let i = 0; i <= d.length - 10; i++) {
                    const sub = d.slice(i, i+10);
                    if (sub[0]===sub[1] && sub[1]===sub[2] && sub[2]===sub[3] && sub[3]===sub[4] && sub[5]===sub[6] && sub[6]===sub[7] && sub[7]===sub[8] && sub[8]===sub[9]) return true;
                }
                return false;
            }
        },
        {
            id: 'parity-balance',
            name: '合作协同',
            emoji: '🕊',
            score: 5,
            rarity: '平庸',
            description: '数字中奇数与偶数的个数相等',
            check: function(d) {
                let odd = 0, even = 0;
                for (let ch of d) {
                    if (parseInt(ch,10) % 2 === 0) even++; else odd++;
                }
                return odd === even;
            }
        }, 
        {
            id: 'bull-market',
            name: '牛市',
            emoji: '📈',
            score: 820,
            rarity: '罕见',
            description: '每一位数字都在 5–9 之间（高数字）',
            check: function(d) {
                for (let ch of d) {
                    const digit = parseInt(ch,10);
                    if (digit < 5 || digit > 9) return false;
                }
                return true;
            }
        },
        {
            id: 'anti-aesthetic',
            name: '反美学',
            emoji: '👁‍🗨',
            score: 7153,
            rarity: '稀有',
            description: '每一位数字只包含 4,6,7,9',
            check: function(d) {
                const allowed = new Set(['4','6','7','9']);
                for (let ch of d) if (!allowed.has(ch)) return false;
                return true;
            }
        },
        {
            id: 'proth',
            name: '普罗斯数',
            emoji: '🦐',
            score: 70508,
            rarity: '史诗',
            description: '数字是普罗特数（k·2^n + 1，k为奇数）',
            check: function(d) { return isProth(d); }
        },
        {
            id: 'moran',
            name: '莫兰数',
            emoji: '💐',
            score: 259,
            rarity: '罕见',
            description: '数字能被各位数码之和整除，且商是质数',
            check: function(d) { return isMoran(d); }
        },
        {
            id: 'parity-alternating',
            name: '奇偶和谐',
            emoji: '♻',
            score: 456,
            rarity: '罕见',
            description: '相邻两位数字奇偶性交替出现',
            check: function(d) {
                if (d.length <= 1) return true;
                for (let i = 0; i < d.length - 1; i++) {
                    const a = parseInt(d[i],10), b = parseInt(d[i+1],10);
                    if ((a % 2) === (b % 2)) return false;
                }
                return true;
            }
        },
        {
            id: 'left-truncatable-prime',
            name: '可左截短质数',
            emoji: '➰',
            score: 3727172,
            rarity: '神话',
            description: '数字本身及其逐次删去左侧数字后仍为质数',
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
            description: '数字本身及其逐次删去右侧数字后仍为质数',
            check: function(d) {
                const num = parseInt(d,10);
                if (!isPrime(num)) return false;
                for (let i = d.length - 1; i > 0; i--) {
                    const sub = d.slice(0, i);
                    if (!isPrime(parseInt(sub,10))) return false;
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
            description: '数字本身及左右截断后均为质数的数',
            check: function(d) {
                const list = [2,3,5,7,23,37,53,73,313,317,373,797,3137,3797,739397];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'intimate-prime',
            name: '亲密质数',
            emoji: '💞',
            score: 696428,
            rarity: '传说',
            description: '质数 p 满足 4p+5 是完全平方数',
            check: function(d) { return isIntimatePrime(parseInt(d,10)); }
        },
        {
            id: 'palindromic-prime',
            name: '回文质数',
            emoji: 'Ⓜ',
            score: 1679826,
            rarity: '神话',
            description: '数字是质数，且正着读和反着读相同',
            check: function(d) {
                const num = parseInt(d,10);
                return isPrime(num) && d === d.split('').reverse().join('');
            }
        },
        {
            id: 'author-qq',
            name: '作者的QQ',
            emoji: '🐧',
            score: 500000000,
            rarity: '终结',
            description: '数字包含子串 "879893737"',
            check: function(d) { return d.includes('879893737'); }
        },
        {
            id: 'progress-bar',
            name: '进度条',
            emoji: '〰',
            score: 3227,
            rarity: '稀有',
            description: '数字奇数位相同或偶数位相同',
            check: function(d) {
                if (d.length <= 1) return false;
                const first = d[0];
                let oddSame = true;
                for (let i = 2; i < d.length; i += 2) {
                    if (d[i] !== first) {
                        oddSame = false;
                        break;
                    }
                }
                if (oddSame) return true;
                if (d.length < 2) return false;
                const second = d[1];
                let evenSame = true;
                for (let i = 3; i < d.length; i += 2) {
                    if (d[i] !== second) {
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
            description: '数字能被其七段数码管显示所需笔画数之和整除',
            check: function(d) {
                const num = parseInt(d,10);
                if (num <= 0) return false;
                const segments = {
                    '0': 6, '1': 2, '2': 5, '3': 5, '4': 4,
                    '5': 5, '6': 6, '7': 3, '8': 7, '9': 6
                };
                let sum = 0;
                for (let ch of d) {
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
            description: '数字各位数码之和等于 4.5 × 位数',
            check: function(d) {
                if (d.length === 0) return false;
                let sum = 0;
                for (let ch of d) {
                    sum += parseInt(ch, 10);
                }
                return 2 * sum === 9 * d.length;
            }
        },
        {
            id: 'pronic',
            name: '普洛尼克数',
            emoji: '🦊',
            score: 100000,
            rarity: '史诗',
            description: '数字是两个连续整数的乘积（n·(n+1)）',
            check: function(d) { return isPronic(parseInt(d,10)); }
        },
        {
            id: 'close-enough',
            name: '那是接近的',
            emoji: '🌀',
            score: 6,
            rarity: '平庸',
            description: '有效数字的首位和末位相差 1',
            check: function(d) {
                if (d.length <= 1) return true;
                const first = parseInt(d[0], 10);
                const last = parseInt(d[d.length - 1], 10);
                return Math.abs(first - last) === 1;
            }
        },
        {
            id: 'twin-prime',
            name: '孪生质数',
            emoji: '⛰',
            score: 183,
            rarity: '罕见',
            description: '数字是质数，且与相邻的质数相差 2',
            check: function(d) {
                const num = parseInt(d,10);
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
            description: '数字是质数，且与相邻两个质数构成三胞胎质数组',
            check: function(d) {
                const num = parseInt(d,10);
                if (!isPrime(num)) return false;
                if (num >= 2) {
                    if (isPrime(num - 2) && isPrime(num + 4)) return true;
                    if (isPrime(num - 4) && isPrime(num + 2)) return true;
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
            description: '数字是质数，且与相邻三个质数构成四胞胎质数组',
            check: function(d) {
                const num = parseInt(d,10);
                if (!isPrime(num)) return false;
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
            description: '各位数码之和等于各位数码之积',
            check: function(d) {
                if (d.length === 0) return false;
                let sum = 0, product = 1;
                for (let ch of d) {
                    const digit = parseInt(ch, 10);
                    sum += digit;
                    product *= digit;
                }
                return sum === product;
            }
        },
        {
            id: 'neutral-3456',
            name: '中性',
            emoji: '💤',
            score: 7153,
            rarity: '稀有',
            description: '每一位数字只包含 3,4,5,6',
            check: function(d) {
                const allowed = new Set(['3', '4', '5', '6']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'unstable',
            name: '欠稳定性',
            emoji: '💥',
            score: 9537,
            rarity: '稀有',
            description: '每一位数字只包含 0,1,8,9',
            check: function(d) {
                const allowed = new Set(['0', '1', '8', '9']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'higher-neutral',
            name: '高阶中性',
            emoji: '💤💤',
            score: 4887586,
            rarity: '神话',
            description: '每一位数字只包含 4,5',
            check: function(d) {
                const allowed = new Set(['4', '5']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'higher-unstable',
            name: '高阶欠稳定性',
            emoji: '💥💥',
            score: 9765625,
            rarity: '神话',
            description: '每一位数字只包含 0,9',
            check: function(d) {
                const allowed = new Set(['0', '9']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'high-low-balance',
            name: '高低平衡',
            emoji: '☯',
            score: 5,
            rarity: '平庸',
            description: '数字中低数字（0-4）和高数字（5-9）的个数相等',
            check: function(d) {
                let low = 0, high = 0;
                for (let ch of d) {
                    const dgt = parseInt(ch, 10);
                    if (dgt <= 4) low++;
                    else high++;
                }
                return low === high;
            }
        },
        {
            id: 'air-ticket',
            name: '飞机票',
            emoji: '🎟🛩',
            score: 8,
            rarity: '平庸',
            description: '数字长度为偶数，且前半部分数字积等于后半部分数字积',
            check: function(d) {
                const trimmed = d.replace(/^0+/, '') || '0';
                const len = trimmed.length;
                if (len % 2 !== 0 || len > 10) return false;
                const half = len / 2;
                let prodLeft = 1, prodRight = 1;
                for (let i = 0; i < half; i++) {
                    prodLeft *= parseInt(trimmed[i], 10);
                    prodRight *= parseInt(trimmed[half + i], 10);
                }
                return prodLeft === prodRight;
            }
        },
        {
            id: 'air-ticket-premium',
            name: '客机票',
            emoji: '✈🎟',
            score: 993,
            rarity: '罕见',
            description: '数字长度为偶数，前半部分数字积等于后半部分数字积，且两侧数字均不含 0',
            check: function(d) {
                const trimmed = d.replace(/^0+/, '') || '0';
                const len = trimmed.length;
                if (len % 2 !== 0 || len > 10) return false;
                const half = len / 2;
                let prodLeft = 1, prodRight = 1;
                for (let i = 0; i < half; i++) {
                    const leftDigit = parseInt(trimmed[i], 10);
                    const rightDigit = parseInt(trimmed[half + i], 10);
                    if (leftDigit === 0 || rightDigit === 0) return false;
                    prodLeft *= leftDigit;
                    prodRight *= rightDigit;
                }
                return prodLeft === prodRight;
            }
        },
        // ===== 新增：琪露诺 =====
        {
            id: 'cirno',
            name: '琪露诺',
            emoji: '🧊',
            score: 168,
            rarity: '罕见',
            description: '最大数位超过数字长度',
            check: function(d) {
                const digits = d.split('').map(Number);
                const maxDigit = Math.max(...digits);
                const len = d.length;
                return maxDigit > len;
            }
        },
        {
            id: 'good-number',
                name: '好数',
                emoji: '😊',
            score: 1016157,
            rarity: '神话',
            description: '每个数码仅出现一次，不含 0，且不存在某个数字两边都大于它',
            check: function(d) {
                const digits = d.split('');
                if (digits.length === 0) return false;
                // 检查重复和零
                const seen = new Set();
                for (let ch of digits) {
                    if (ch === '0') return false;
                    if (seen.has(ch)) return false;
                    seen.add(ch);
                }
                // 检查每个内部位置：不能左右都大于当前值
                for (let i = 1; i < digits.length - 1; i++) {
                    const current = parseInt(digits[i], 10);
                    const left = parseInt(digits[i-1], 10);
                    const right = parseInt(digits[i+1], 10);
                    if (left > current && right > current) {
                        return false; // 谷底，违反条件
                    }
                }
                return true;
            }
        },
        {
            id: 'limit',
            name: '极限',
            emoji: '🔳',
            score: 1000000000,
            rarity: '终结',
            description: '数字为 0 或全部由 9 组成',
            check: function(d) {
                if (d === '0') return true;
                return /^9+$/.test(d);
            }
        },
        {
            id: 'elite',
            name: '精英',
            emoji: '🐳🦅',
            score: 57294,
            rarity: '史诗',
            description: '最大数码不小于所有其他数码之和',
            check: function(d) {
                const digits = d.split('').map(Number);
                if (digits.length === 0) return false;
                const maxDigit = Math.max(...digits);
                const sumOthers = digits.reduce((a, b) => a + b, 0) - maxDigit;
                return maxDigit >= sumOthers;
            }
        },
        {
            id: 'minmax',
            name: '最小最大',
            emoji: '❣',
            score: 31,
            rarity: '普通',
            description: '首尾数字分别为 9 与 0/1，或 1 与 9',
            check: function(d) {
                if (d.length < 2) return false;
                const first = d[0];
                const last = d[d.length - 1];
                return (first === '9' && (last === '0' || last === '1')) ||
                       (first === '1' && last === '9');
            }
        },
        // 在 BADGE_DEFS 数组末尾添加：
        {
            id: 'multiple-of-27',
            name: '27的倍数',
            emoji: '➗3️⃣9️⃣',
            score: 27,
            rarity: '普通',
            description: '数字能被 27 的整除',
            check: function(d) { return parseInt(d, 10) % 27 === 0; }
        },
        {
            id: 'multiple-of-49',
            name: '49的倍数',
            emoji: '➗7️⃣7️⃣',
            score: 49,
            rarity: '普通',
            description: '数字能被 49 的整除',
            check: function(d) { return parseInt(d, 10) % 49 === 0; }
        },
        {
            id: 'multiple-of-81',
            name: '81的倍数',
            emoji: '➗9️⃣9️⃣',
            score: 81,
            rarity: '普通',
            description: '数字能被 81 整除',
            check: function(d) { return parseInt(d, 10) % 81 === 0; }
        },
        {
            id: 'tower',
            name: '高塔',
            emoji: '🏗',
            score: 1782,
            rarity: '稀有',
            description: '有效数字位数不为10且各位数码互不相同',
            check: function(d) {
                // 去除前导0，获取有效数字
                const trimmed = d.replace(/^0+/, '');
                if (trimmed.length === 0) return false;
                // 有效数字位数不为10
                if (trimmed.length === 10) return false;
                // 所有数码互不相同（没有重复数字）
                const digits = trimmed.split('');
                const unique = new Set(digits);
                return unique.size === digits.length;
            }
        },
        {
            id: 'palindrome-shape-flow',
            name: '回文形意顺',
            emoji: '🍕⭕',
            score: 1332,
            rarity: '稀有',
            description: '数字包含子串 "1221" 或 "22122"',
            check: function(d) {
                return d.includes('1221') || d.includes('22122');
            }
        },
        {
            id: 'advanced-palindrome-shape-flow',
            name: '高阶回文形意顺',
            emoji: '🍕🍕⭕',
            score: 500000000,
            rarity: '终结',
            description: '数字包含子串 "122333221"',
            check: function(d) {
                return d.includes('122333221');
            }
        },
        // 在 BADGE_DEFS 数组末尾添加：
        {
            id: 'fractal',
            name: '分形',
            emoji: '💯',
            score: 98924,
            rarity: '史诗',
            description: '数字可由某个长度≥2的子串重复拼接而成（如 37392 重复两次 → 3739237392）',
            check: function(d) {
                const len = d.length;
                // 至少需要 4 位（子串长度 2，重复 2 次）
                if (len < 4) return false;
                // 遍历可能的子串长度，从 2 到 len/2
                for (let L = 2; L <= Math.floor(len / 2); L++) {
                    if (len % L !== 0) continue;
                    const sub = d.slice(0, L);
                    // 检查 d 是否等于 sub 重复 len/L 次
                    if (sub.repeat(len / L) === d) {
                        return true;
                    }
                }
                return false;
            }
        },
        {
            id: 'broken-fractal',
            name: '破碎分形',
            emoji: '💯〽',
            score: 48691,
            rarity: '史诗',
            description: '数字可由某个长度≥2的子串或其翻转版本重复拼接而成（如 173173371 = 173 + 173 + 371，56/65/65/56）',
            check: function(d) {
                const len = d.length;
                if (len < 4) return false;
                // 遍历可能的块长度，从 2 到 len/2
                for (let L = 2; L <= Math.floor(len / 2); L++) {
                    if (len % L !== 0) continue;
                    const firstBlock = d.slice(0, L);
                    const revFirst = firstBlock.split('').reverse().join('');
                    let valid = true;
                    for (let i = 0; i < len; i += L) {
                        const block = d.slice(i, i + L);
                        if (block !== firstBlock && block !== revFirst) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) return true;
                }
                return false;
            }
        },
        {
            id: 'prefix-suffix-2',
            name: '高阶首位相等',
            emoji: '☸☸',
            score: 100,
            rarity: '普通',
            description: '前2位与后2位相同',
            check: function(d) {
                return d.length >= 4 && d.slice(0, 2) === d.slice(-2);
            }
        },
        {
            id: 'prefix-suffix-3',
            name: '大师首尾相等',
            emoji: '☸☸☸',
            score: 1000,
            rarity: '罕见',
            description: '前3位与后3位相同',
            check: function(d) {
                return d.length >= 6 && d.slice(0, 3) === d.slice(-3);
            }
        },
        {
            id: 'prefix-suffix-4',
            name: '终焉首尾相等',
            emoji: '☸☸☸☸',
            score: 9911,
            rarity: '稀有',
            description: '前4位与后4位相同',
            check: function(d) {
                return d.length >= 8 && d.slice(0, 4) === d.slice(-4);
            }
        },
        {
            id: 'mersenne-prime',
            name: '梅森数',
            emoji: '🌊',
            score: 909090910,
            rarity: '终结',
            description: '数字是 2^p - 1，其中 p 为质数',
            check: function(d) {
                const num = parseInt(d, 10);
                return window.MathUtils && typeof window.MathUtils.isMersennePrime === 'function'
                    ? window.MathUtils.isMersennePrime(num)
                    : false;
            }
        },
        {
            id: 'golden-cicada-prime',
            name: '金蝉质数',
            emoji: '🏆',
            score: 2000000000,
            rarity: '无尽',
            description: '数字正好为金蝉素数（13597, 53791, 79531, 91573, 95713）',
            check: function(d) {
                const num = parseInt(d, 10);
                return num === 13597 || num === 53791 || num === 79531 || num === 91573 || num === 95713;
            }
        },
        {
            id: 'landau',
            name: '兰道',
            emoji: '🛤',
            score: 2955957,
            rarity: '神话',
            description: '数字是质数且可以写成 n² + 1 的形式',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                // 检查是否为质数
                if (!window.MathUtils.isPrime(num)) return false;
                // 检查是否可以写成 n^2 + 1
                const nSquared = num - 1;
                if (nSquared < 0) return false;
                    const n = Math.sqrt(nSquared);
                    return Number.isInteger(n);
                }
        },
        {
            id: 'shape-meaning-string',
            name: '形意串',
            emoji: '🍡',
            score: 1000000000,
            rarity: '终结',
            description: '数字正好为 0, 1, 22, 33, 4444, 55555, 666666, 7777777, 88888888, 999999999',
            check: function(d) {
                const list = [0,1,22,33,4444,55555,666666,7777777,88888888,999999999];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'pseudo-narcissistic',
            name: '伪水仙',
            emoji: '☔',
            score: 3333333334,
            rarity: '无尽',
            description: '数字正好为 4150, 4151, 194979',
            check: function(d) {
                const list = [4150,4151,194979];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'odd-composite',
            name: '奇合数',
            emoji: '📦',
            score: 3,
            rarity: '平庸',
            description: '数字不是质数且是大于 1 的奇数',
            check: function(d) {
                const n = parseInt(d, 10);
                if (n <= 1) return false;
                if (n % 2 === 0) return false;
                return !window.MathUtils.isPrime(n);
            }
        },
        {
            id: 'civil-servant',
            name: '公务员',
            emoji: '👨‍💼',
            score: 20,
            rarity: '普通',
            description: '洞数不小于位数',
            check: function(d) {
                if (d.length === 0) return false;
                const holes = window.MathUtils.countHoles(d);
                return holes >= d.length;
            }
        },
        {
            id: 'super-6789',
            name: '超级',
            emoji: '🥉',
            score: 7153,
            rarity: '稀有',
            description: '每一位数字仅由 6、7、8、9 构成',
            check: function(d) {
                if (d.length === 0) return false;
                const allowed = new Set(['6', '7', '8', '9']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'peak-789',
            name: '巅峰',
            emoji: '🥈',
            score: 112903,
            rarity: '传说',
            description: '每一位数字仅由 7、8、9 构成',
            check: function(d) {
                if (d.length === 0) return false;
                const allowed = new Set(['7', '8', '9']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'zenith-89',
            name: '天顶',
            emoji: '🥇',
            score: 4887586,
            rarity: '神话',
            description: '每一位数字仅由 8、9 构成',
            check: function(d) {
                if (d.length === 0) return false;
                const allowed = new Set(['8', '9']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'extreme-digits',
            name: '极端',
            emoji: '🩸',
            score: 169350,
            rarity: '传说',
            description: '每一位数字仅由 0、1、9 构成',
            check: function(d) {
                if (d.length === 0) return false;
                const allowed = new Set(['0', '1', '9']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'half-finished',
            name: '半成品',
            emoji: '➗',
            score: 9765625,
            rarity: '神话',
            description: '每一位数字仅由 0、5 构成',
            check: function(d) {
                if (d.length === 0) return false;
                const allowed = new Set(['0', '5']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'trinary',
            name: '三元',
            emoji: '📊',
            score: 9537,
            rarity: '稀有',
            description: '每一位数字仅由 0、3、6、9 构成',
            check: function(d) {
                if (d.length === 0) return false;
                const allowed = new Set(['0', '3', '6', '9']);
                for (let ch of d) {
                    if (!allowed.has(ch)) return false;
                }
                return true;
            }
        },
        {
            id: 'high-low-alternating',
            name: '高低和谐',
            emoji: '🧬',
            score: 456,
            rarity: '罕见',
            description: '相邻两位数字中低数字（0-4）和高数字（5-9）交替出现',
            check: function(d) {
                if (d.length <= 1) return true;
                const isHigh = (ch) => {
                    const digit = parseInt(ch, 10);
                    return digit >= 5 && digit <= 9;
                };
                const firstHigh = isHigh(d[0]);
                for (let i = 1; i < d.length; i++) {
                    const currentHigh = isHigh(d[i]);
                    if (currentHigh === firstHigh) {
                        // 如果 i 为奇数则应与第一位相反，i 为偶数则应与第一位相同
                        if ((i % 2 === 0) !== (currentHigh === firstHigh)) {
                            return false;
                        }
                    } else {
                        // 如果当前与第一位不同，则要求 i 为奇数
                        if (i % 2 === 0) {
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        {
            id: 'high-low-opposite',
            name: '高低对立',
            emoji: '🔩',
            score: 547,
            rarity: '罕见',
            description: '数字长度为偶数，前半部分全为高数字（5-9），后半部分全为低数字（0-4），或反之',
            check: function(d) {
                // 去除前导0，获取有效数字
                const trimmed = d.replace(/^0+/, '');
                const len = trimmed.length;
                // 长度为0或奇数时不满足
                if (len === 0 || len % 2 !== 0) return false;
                const half = len / 2;
                const firstHalf = trimmed.slice(0, half);
                const secondHalf = trimmed.slice(half);
                // 高数字: 5-9, 低数字: 0-4
                const isHigh = ch => parseInt(ch, 10) >= 5;
                const isLow = ch => parseInt(ch, 10) <= 4;
                const firstAllHigh = firstHalf.split('').every(isHigh);
                const firstAllLow = firstHalf.split('').every(isLow);
                const secondAllHigh = secondHalf.split('').every(isHigh);
                const secondAllLow = secondHalf.split('').every(isLow);
                // 前后部分必须完全相反：高+低 或 低+高
                return (firstAllHigh && secondAllLow) || (firstAllLow && secondAllHigh);
            }
        },
        {
            id: 'odd-even-opposite',
            name: '奇偶对立',
            emoji: '🗜',
            score: 547,
            rarity: '罕见',
            description: '数字长度为偶数，前半部分全为奇数，后半部分全为偶数，或反之',
            check: function(d) {
                // 去除前导0，获取有效数字
                const trimmed = d.replace(/^0+/, '');
                const len = trimmed.length;
                // 长度为0或奇数时不满足
                if (len === 0 || len % 2 !== 0) return false;
                const half = len / 2;
                const firstHalf = trimmed.slice(0, half);
                const secondHalf = trimmed.slice(half);
                const isOdd = ch => parseInt(ch, 10) % 2 === 1;
                const isEven = ch => parseInt(ch, 10) % 2 === 0;
                const firstAllOdd = firstHalf.split('').every(isOdd);
                const firstAllEven = firstHalf.split('').every(isEven);
                const secondAllOdd = secondHalf.split('').every(isOdd);
                const secondAllEven = secondHalf.split('').every(isEven);
                // 前后部分必须完全相反：奇+偶 或 偶+奇
                return (firstAllOdd && secondAllEven) || (firstAllEven && secondAllOdd);
            }
        },
        {
            id: 'finite',
            name: '有限',
            emoji: '🧵',
            score: 25,
            rarity: '普通',
            description: '有效数字位数不为 10，且每一位数字都在 1 到该数字的位数之间',
            check: function(d) {
                const trimmed = d.replace(/^0+/, '');
                const n = trimmed.length;
                // 空串或位数为10时不通过
                if (n === 0 || n === 10) return false;
                for (let ch of trimmed) {
                    const digit = parseInt(ch, 10);
                    if (digit < 1 || digit > n) return false;
                }
                return true;
            }
        },
        {
            id: 'higher-finite',
            name: '高阶有限',
            emoji: '🧶',
            score: 24444,
            rarity: '史诗',
            description: '有效数字位数不为 10，且每一位数字都在 1 到该数字的位数之间，且每个数字恰好出现一次',
            check: function(d) {
                const trimmed = d.replace(/^0+/, '');
                const n = trimmed.length;
                if (n === 0 || n === 10) return false;
                const digits = trimmed.split('').map(Number);
                const seen = new Set();
                for (let digit of digits) {
                    if (digit < 1 || digit > n) return false;
                    if (seen.has(digit)) return false;
                    seen.add(digit);
                }
                return seen.size === n;
            }
        },
        {
            id: 'matrix',
            name: '母体',
            emoji: '🎡',
            score: 5,
            rarity: '平庸',
            description: '各位数字之和为质数',
            check: function(d) {
                if (d.length === 0) return false;
                let sum = 0;
                for (let ch of d) {
                    sum += parseInt(ch, 10);
                }
                return window.MathUtils.isPrime(sum);
            }
        },
        {
            id: 'product-harshad',
            name: '积哈沙德数',
            emoji: '🤣🐔',
            score: 456705,
            rarity: '传说',
            description: '数字各位数码之积不为0且能被其各位数码之积整除',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 0) return false;
                let product = 1;
                for (let ch of d) {
                    const digit = parseInt(ch, 10);
                    if (digit === 0) return false;
                    product *= digit;
                    if (product > Number.MAX_SAFE_INTEGER) return false;
                }
                return num % product === 0;
            }
        }
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
            description: `数字能被 ${p} 整除`,
            check: function(d) { return parseInt(d,10) % p === 0; }
        });
    }

    // ----- 批量添加底数幂徽章 (2~20) -----
    const powerScores = [
        294117648, 476190477, 588235295, 666666667, 769230769,
        833333334, 833333334, 909090910,
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