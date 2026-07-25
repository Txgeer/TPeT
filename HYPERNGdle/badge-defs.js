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
                if (trimmed.length < 2) return false;
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
            description: '10 位数字中 0–9 每个数字正好出现一次',
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
            description: '数字是黑洞数（123,495,1089,6174）',
            check: function(d) { return [123,495,1089,6174].includes(parseInt(d,10)); }
        },
        {
            id: 'self-referential',
            name: '自指',
            emoji: '💅💅',
            score: 1250000000,
            rarity: '无尽',
            description: '数字是外观数列的某一项（1,11,21,1211,111221,312211,13112221,1113213211）',
            check: function(d) { return [1,11,21,1211,111221,312211,13112221,1113213211].includes(parseInt(d,10)); }
        },
        {
            id: 'fibonacci',
            name: '斐波那契',
            emoji: '🌫',
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
            description: '数字只包含 0,1,6,8,9（旋转180°后仍为数字）',
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
            score: 69,
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
                if (d.length < 2) return false;  // 修正：至少两位才判断
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
            description: '最大数码超过数字长度',
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
            description: '数字能被 27 整除',
            check: function(d) { return parseInt(d, 10) % 27 === 0; }
        },
        {
            id: 'multiple-of-49',
            name: '49的倍数',
            emoji: '➗7️⃣7️⃣',
            score: 49,
            rarity: '普通',
            description: '数字能被 49 整除',
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
            name: '高阶首尾相等',
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
            description: '数字正好为金蝉质数（13597,53791,79531,91573,95713）',
            check: function(d) {
                const list = [13597,53791,79531,91573,95713];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'landau',
            name: '兰道',
            emoji: '🛤',
            score: 2955957,
            rarity: '神话',
            description: '数字是质数且可以写作 n² + 1 的形式',
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
            description: '数字正好为 0,1,22,333,4444,55555,666666,7777777,88888888,999999999',
            check: function(d) {
                const list = [0,1,22,333,4444,55555,666666,7777777,88888888,999999999];
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
            description: '有效数字位数不为 10，且每一位数字都在 1 到该数字的位数之间，且每个数字正好出现一次',
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
        },
        {
            id: 'additive-pointer-prime',
            name: '加法指针质数',
            emoji: '✝',
            score: 660,
            rarity: '罕见',
            description: '数字是质数，且其本身加各位数码之和正好等于下一个质数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                // 检查自身是否为质数
                if (!window.MathUtils.isPrime(num)) return false;
                // 计算各位数码之和
                let sum = 0;
                for (let ch of d) {
                    sum += parseInt(ch, 10);
                }
                if (sum === 0) return false;
                const target = num + sum;
                // target 必须也是质数
                if (!window.MathUtils.isPrime(target)) return false;
                // 检查 num 和 target 之间是否存在其他质数
                for (let p = num + 1; p < target; p++) {
                    if (window.MathUtils.isPrime(p)) {
                        return false; // 有中间质数，不是"下一个"
                    }
                }
        // 若 target 恰好是 num 之后的下一个质数，则通过
                return true;
            }
        },
        {
            id: 'aba-number',
            name: 'ABA数',
            emoji: '🐟',
            score: 137806,
            rarity: '传说',
            description: '可以写作 a × b^a，其中 a 和 b 都是大于 1 的整数，且 a 可以等于 b',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 8) return false;
                return window.MathUtils && typeof window.MathUtils.isABANumber === 'function'
                    ? window.MathUtils.isABANumber(num)
                    : false;
            }
        },
        {
            id: 'alternating-factorial',
            name: '交替阶乘数',
            emoji: '❗♻',
            score: 833333334,
            rarity: '终结',
            description: '数字正好为交替阶乘数（1,5,19,101,619,4421,35899,326981,3301819,36614981,442386619,5784634181）',
            check: function(d) {
                const list = [1,5,19,101,619,4421,35899,326981,3301819,36614981,442386619,5784634181];
                return list.includes(parseInt(d,10));
            }  
        },
        {
            id: 'anti-perfect',
            name: '反完全数',
            emoji: '💠〽',
            score: 2000000000,
            rarity: '无尽',
            description: '数字正好为反完全数（6,244,285,133857,141635817）',
            check: function(d) {
                const list = [6,244,285,133857,141635817];
                return list.includes(parseInt(d,10));
            }  
        },
        {
            id: 'balanced-prime',
            name: '平衡质数',
            emoji: '⛎',
            score: 1030,
            rarity: '稀有',
            description: '数字是质数，且与相邻前后两个质数的距离相等',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 3) return false;
                return window.MathUtils && typeof window.MathUtils.isBalancedPrime === 'function'
                    ? window.MathUtils.isBalancedPrime(num)
                    : false;
            }
        },
        {
            id: 'bi-directional-palindromic-prime',
            name: '双向回文质数',
            emoji: '⭕⭕',
            score: 454545455,
            rarity: '终结',
            description: '数字是质数，且每一位数字只包含 0,1,6,8,9；倒序、旋转180°、旋转180°后倒序均为质数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                return window.MathUtils && typeof window.MathUtils.isBiDirectionalPalindromicPrime === 'function'
                    ? window.MathUtils.isBiDirectionalPalindromicPrime(num)
                    : false;
            }
        },
        {
            id: 'einstein',
            name: '爱因斯坦',
            emoji: '🍥',
            score: 282,
            rarity: '罕见',
            description: '数字为半质数，且两个质因数的位数相同',
            check: function(d) {
                const num = parseInt(d, 10);
                // 半质数至少为 4
                if (num < 4) return false;
                // 先快速判断是否为半质数（可选优化，但为了准确我们还是直接找因数）
                // 也可以直接找因数，同时验证半质数性
                for (let p = 2; p * p <= num; p++) {
                    if (num % p === 0 && isPrime(p)) {
                       const q = num / p;
                       if (isPrime(q)) {
                            // 找到两个质因数 p 和 q
                            return p.toString().length === q.toString().length;
                        }
                    }
                }
                return false;
            }
        },
        {
            id: 'bell-number',
            name: '贝尔数',
            emoji: '🦻',
            score: 769230770,
            rarity: '终结',
            description: '数字是贝尔数序列中的一项（1,2,5,15,52,203,877,4140,21147,115975,678570,4213597,27644437,190899322,1382958545）',
            check: function(d) {
                const list = [1,2,5,15,52,203,877,4140,21147,115975,678570,4213597,27644437,190899322,1382958545];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'space-partition',
            name: '三维切分',
            emoji: '⚽',
            score: 2554932,
            rarity: '神话',
            description: '数字可以写作 (n³ + 5n + 6) / 6 的形式，其中 n 为任意自然数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 1) return false;
                // 估算 n 约为 (6 * num) 的立方根
                const approxN = Math.cbrt(6 * num);
                // 检查附近几个整数
                for (let n = Math.floor(approxN) - 2; n <= Math.floor(approxN) + 2; n++) {
                    if (n < 0) continue;
                    // 直接整数比较，避免浮点误差
                    if (n * n * n + 5 * n + 6 === 6 * num) {
                        return true;
                    }
                }
                return false;
            }
        },
        {
            id: 'carol-number',
            name: '卡罗尔数',
            emoji: '🦪',
            score: 666666667,
            rarity: '终结',
            description: '数字是卡罗尔数（4^n - 2^(n+1) - 1，n > 1）',
            check: function(d) {
                const list = [7,47,223,959,3967,16127,65023,261119,1046527,4190207,16769023,67092479,268402687,1073676287,4294836223];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'catalan-number',
            name: '卡塔兰数',
            emoji: '⚓',
            score: 500000000,
            rarity: '终结',
            description: '数字是卡塔兰数（(2n)!/(n!(n+1)!)，其中 n 为正整数）',
            check: function(d) {
                const list = [1,2,5,14,42,132,429,1430,4862,16796,58786,208012,742900,2674440,9694845,35357670,129644790,477638700,1767263190,6564120420];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'factorial-multiple',
            name: '合阶乘',
            emoji: '❗☢',
            score: 1000000000,
            rarity: '终结',
            description: '数字是合阶乘序列中的一项（1,4,24192,1728,17280,207360,2903040,43545600,696729600）',
            check: function(d) {
                const num = parseInt(d, 10);
                const values = [1,4,24,192,1728,17280,207360,2903040,43545600,696729600];
                return values.includes(num);
            }
        },
        {
            id: 'chen-prime',
            name: '陈质数',
            emoji: '🧪',
            score: 39,
            rarity: '普通',
            description: '数字为质数且 +2 后是质数或半质数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (!isPrime(num)) return false;
                const plus2 = num + 2;
                return isPrime(plus2) || isSemiprime(plus2);
            }
        },
        {
            id: 'de-polignac',
            name: '德波利尼亚克数',
            emoji: '🎇',
            score: 21,
            rarity: '普通',
            description: '数字是奇数且不可以写作 2ⁿ + p 的形式，其中 n 为自然数，p 为质数',
            check: function(d) {
                const num = parseInt(d, 10);
                // 必须是奇数且大于 0
                if (num % 2 === 0 || num <= 0) return false;
                let pow = 1; // 2^0
                while (pow < num) {
                    const diff = num - pow;
                    if (diff > 1 && isPrime(diff)) {
                        // 可以表示为 2^n + p，不满足条件
                        return false;
                    }
                    pow *= 2;
                    // 防止溢出
                    if (pow > num) break;
                }
                return true;
            }
        },
        {
            id: 'fair',
            name: '公正',
            emoji: '👨‍⚖️',
            score: 284,
            rarity: '罕见',
            description: '各个数码出现的次数相等（如 112233，1、2、3 各出现 2 次）',
            check: function(d) {
                const counts = {};
                for (let ch of d) {
                    counts[ch] = (counts[ch] || 0) + 1;
                }
                const vals = Object.values(counts);
                if (vals.length === 0) return false;
                const first = vals[0];
                return vals.every(v => v === first);
            }
        },
        {
            id: 'reverse-prime',
            name: '逆向质数',
            emoji: '🎠🎠',
            score: 521,
            rarity: '罕见',
            description: '数字是质数，且反过来看还是质数（可逆质数）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (!isPrime(num)) return false;
                const revStr = d.split('').reverse().join('');
                // 反转后可能以0开头，但parseInt会忽略前导0，只判断数字是否质数
                const revNum = parseInt(revStr, 10);
                return isPrime(revNum);
            }
        },
        {
            id: 'gap-number',
            name: '间隙数',
            emoji: '🔺🔻',
            score: 14,
            rarity: '普通',
            description: '数字能被其首位数码和末位数码构成的数字整除',
            check: function(d) {
                const len = d.length;
                if (len < 2) return false;
                if (len === 2) return true;
                const first = d[0];
                const last = d[len - 1];
                // 拼接成两位数
                const divisor = parseInt(first + last, 10);
                if (divisor === 0) return false;
                const num = parseInt(d, 10);
                return num % divisor === 0;
            }
        },
        {
            id: 'reverse-semiprime',
            name: '逆向半质数',
            emoji: '🎠',
            score: 48,
            rarity: '普通',
            description: '数字是半质数，且反过来看还是半质数',
            check: function(d) {
                const num = parseInt(d, 10);
                // 一位数不可能是半质数（半质数最小为4）
                if (num < 4) return false;
                if (!isSemiprime(num)) return false;
                const revStr = d.split('').reverse().join('');
                const revNum = parseInt(revStr, 10);
                // 反转后可能以0开头，parseInt会忽略前导0
                // 如果反转后变成一位数（<4），不可能是半质数
                if (revNum < 4) return false;
                return isSemiprime(revNum);
            }
        },
        {
            id: 'jeda-number',
            name: '吉达数',
            emoji: '🏁',
            score: 2000000000,
            rarity: '无尽',
            description: '数字是吉达数序列中的一项（30,858,1722,66198,2214408306）',
            check: function(d) {
                const list = [30,858,1722,66198,2214408306];
                return list.includes(parseInt(d,10));
            }
        },
        {
            id: 'scam',
            name: '骗局',
            emoji: '🎱',
            score: 2000000000,
            rarity: '无尽',
            description: '数字是连续骗局数序列中的一项（84,12955,291090,9538589,3541285143）',
            check: function(d) {
                const num = parseInt(d, 10);
                const scamNumbers = [84,12955,291090,9538589,3541285143];
                return scamNumbers.includes(num);
            }
        },
        {
            id: 'hogben-number',
            name: '霍格本数',
            emoji: '📓',
            score: 100000,
            rarity: '史诗',
            description: '可以表示为 n² - n + 1 的形式，其中 n 为自然数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 1) return false;
                // 解方程 n² - n + 1 = num => n² - n + (1 - num) = 0
                // 判别式 Δ = 1 - 4*(1 - num) = 4*num - 3
                const delta = 4 * num - 3;
                if (delta < 0) return false;
                const sqrtDelta = Math.sqrt(delta);
                if (!Number.isInteger(sqrtDelta)) return false;
                // n = (1 + sqrtDelta) / 2
                const n = (1 + sqrtDelta) / 2;
                return Number.isInteger(n) && n >= 0;
            }
        },
        {
            id: 'house-number',
            name: '浩室',
            emoji: '🏛',
            score: 5112475,
            rarity: '神话',
            description: '数字是第 n 个四棱锥数与第 n+1 个立方数的和，其中 n 为正整数',
            check: function(d) {
                const num = parseInt(d, 10);
                let n = 1;
                while (true) {
                    // 第 n 个四棱锥数：n(n+1)(2n+1)/6
                    const pyramidal = n * (n + 1) * (2 * n + 1) / 6;
                    // 第 n+1 个立方数：(n+1)^3
                    const cube = Math.pow(n + 1, 3);
                    const sum = pyramidal + cube;
                    if (sum === num) return true;
                    if (sum > num) return false;
                    n++;
                }
            }
        },
        {
            id: 'chinar-poly',
            name: '契那波斐',
            emoji: '🎉',
            score: 256410257,
            rarity: '终结',
            description: '数字是反向斐波那契数列中的一项',
            check: function(d) {
                const num = parseInt(d, 10);
                const scamNumbers = [0,1,2,3,5,8,13,39,124,514,836,1053,4139,12815,61135,104937,792517,1454698,9679838,17354310,9735140,1760750,986050,621360,113815,581437,1252496,7676706,13019288,94367798,178067380,173537220,106496242,265429972,522619163,641840787,1148964371,2521746557,9291169663];
                return scamNumbers.includes(num);
            }
        },
        {
            id: 'rojakerok',
            name: '罗杰克罗克',
            emoji: '🥫',
            score: 1472581473,
            rarity: '无尽',
            description: '数字是罗杰克罗克序列中的一项（1,3,5,6495105,848629545,1117175145,2544265305）',
            check: function(d) {
                const num = parseInt(d, 10);
                const scamNumbers = [1,3,5,6495105,848629545,1117175145,2544265305];
                return scamNumbers.includes(num);
            }
        },
        {
            id: 'euler-perfect',
            name: '欧拉完数',
            emoji: '🍜',
            score: 153846154,
            rarity: '终结',
            description: '数字是欧拉完数序列中的一项',
            check: function(d) {
                const num = parseInt(d, 10);
                const scamNumbers = [1,2,3,4,5,6,7,8,9,10,12,13,15,16,18,21,22,24,25,28,30,33,37,40,42,45,48,57,58,60,70,72,78,85,88,93,102,105,112,120,130,133,165,168,177,190,210,232,240,253,273,280,312,330,345,357,385,408,462,520,760,840,1320,1365,1848];
                return scamNumbers.includes(num);
            }
        },
        {
            id: 'unusual-number',
            name: '不寻常数',
            emoji: '⬜🔴⬜',
            score: 1000000000,
            rarity: '终结',
            description: '数字同时能被各位数码平方和与平方积整除',
            check: function(d) {
                const num = parseInt(d, 10);
                const scamNumbers = [1,111,11112,1122112,111111111,122121216,1111112112,1111211136,1116122112,1211162112];
                return scamNumbers.includes(num);
            }
        },
        {
            id: 'non-depletable',
            name: '不耗尽数',
            emoji: '〽',
            score: 6,
            rarity: '平庸',
            description: '不存在某个数 k，使得 k / (k 的各位数字之和) 等于该数',
            check: function(d) {
                const n = parseInt(d, 10);
                // 0 不算作不耗尽数（0除以数字和未定义）
                if (n <= 0) return false;
                // 对任意数字，其各位数字之和最大为 9 * 位数（此处为10位，最大90）
                // 枚举可能的数字和 s，检查是否存在 k = n * s 且 digit_sum(k) = s
                for (let s = 1; s <= 90; s++) {
                    const k = n * s;
                    // 计算 k 的各位数字之和
                    let sum = 0;
                    let temp = k;
                    while (temp > 0) {
                        sum += temp % 10;
                        temp = Math.floor(temp / 10);
                    }
                    if (sum === s) {
                        // 找到了这样的 k，说明 n 是耗尽数
                        return false;
                    }
                }
                // 枚举完所有可能的 s 都未找到，说明是不耗尽数
                return true;
            }
        },
        {
            id: 'jacobsthal',
            name: '雅各布斯塔尔数',
            emoji: '⭐',
            score: 29411765,
            rarity: '超越',
            description: '可以写作 [2ⁿ - (-1)ⁿ] / 3 的形式，其中 n 为正整数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 0) return false;
                let n = 1;
                while (true) {
                    const val = (Math.pow(2, n) - Math.pow(-1, n)) / 3;
                    if (val === num) return true;
                    if (val > num) return false;
                    n++;
                }
            }
        },
        {
            id: 'jordan-polya',
            name: '约当-波利亚数',
            emoji: '🐭',
            score: 10605443,
            rarity: '超越',
            description: '可以写作数个阶乘数之积的形式（如 4 = 2!×2!，12 = 3!×2!）',
            check: function(d) {
                const num = parseInt(d, 10);
                // 0 不是约当-波利亚数
                if (num <= 0) return false;
                // 1 可以看作 1!（或空积），通常视为满足
                if (num === 1) return true;
        
                // 生成 2! 到 13!（因为 14! > 10^10，不在 10 位数字范围内）
                const factorials = [];
                for (let i = 2; i <= 13; i++) {
                    let fact = 1;
                    for (let j = 2; j <= i; j++) fact *= j;
                    factorials.push(fact);
                }
        
                // 递归判断是否能分解为阶乘的乘积
                function canDivide(n) {
                    if (n === 1) return true;
                    for (let f of factorials) {
                        if (f > n) break;
                        if (n % f === 0 && canDivide(n / f)) {
                            return true;
                        }
                    }
                    return false;
                }

                return canDivide(num);
            }
        },
        {
            id: 'junction-number',
            name: '连接数',
            emoji: '🥓',
            score: 13,
            rarity: '普通',
            description: '可以表示为至少两种“某个数 + 该数各位数字之和”的形式',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 0) return false;
                // 数字和最大为 9*位数，10位数最大90，但为了安全，用 num 本身
                // 但 n 必须小于 num，且 n + digit_sum(n) = num
                // 所以 n 的范围为 [num - 90, num - 1]，因为 digit_sum(n) ≤ 90
                const minN = Math.max(1, num - 90);
                let count = 0;
                for (let n = minN; n < num; n++) {
                    let sum = 0;
                    let temp = n;
                    while (temp > 0) {
                        sum += temp % 10;
                        temp = Math.floor(temp / 10);
                    }
                    if (n + sum === num) {
                        count++;
                        if (count >= 2) return true;
                    }
                }
                return false;
            }
        },
        {
            id: 'middle-number',
            name: '中位',
            emoji: '⚱',
            score: 22,
            rarity: '普通',
            description: '数字是合数，且与前一个质数和后一个质数的距离相等',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 1) return false;
                // 必须是合数
                if (window.MathUtils.isPrime(num)) return false;
                const prev = window.MathUtils.prevPrime(num);
                const next = window.MathUtils.nextPrime(num);
                if (prev === null || next === null) return false;
                return (num - prev) === (next - num);
            }
        },
        {
            id: 'canadian-number',
            name: '加拿大数',
            emoji: '🧉',
            score: 2500000000,
            rarity: '终结',
            description: '数字正好是下列的其中一个数：125,581,8549,16999',
            check: function(d) {
                const num = parseInt(d, 10);
                return [125,581,8549,16999].includes(num);
            }
        },
        {
            id: 'kaynia-number',
            name: '凯尼亚数',
            emoji: '🎴',
            score: 588235295,
            rarity: '终结',
            description: '数字正好是下列的其中一个数：2,7,23,79,287,1087,4223,16639,66047,263167,1050623,4198399,16785407,67125247,268468223,1073807359,4295098367',
            check: function(d) {
                const num = parseInt(d, 10);
                return [2,7,23,79,287,1087,4223,16639,66047,263167,1050623,4198399,16785407,67125247,268468223,1073807359,4295098367].includes(num);
            }
        },
        {
            id: 'lonely-number',
            name: '孤独数',
            emoji: '🎐',
            score: 113636364,
            rarity: '终结',
            description: '数字是孤独数（质数间隙比所有更小的数都大）',
            check: function(d) {
                const num = parseInt(d, 10);
                return [0,23,53,120,211,1340,1341,1342,1343,1344,2179,3967,15704,15705,16033,19634,19635,24281,31428,31429,31430,31431,31432,31433,38501,58831,155964,203713,206699,370310,370311,370312,370313,370314,370315,370316,370317,492170,1272749,1357264,1357265,1357266,1357267,2010800,2010801,2010802,2010803,2010804,2010805,2010806,2010807,4652428,4652429,4652430,10938023,12623189,20831422,20831423,20831424,20831425,20831426,20831427,20831428,47326799,47326800,47326801,47326802,47326803,122164858,142414669,162821917,163710121,325737821,1131241763,1791752797,3173306951,4302407528,4302407529,4302407530,4302407531,4302407532,4302407533,4302407534,4302407535,4302407536,6807940367,7174208683,8835528511].includes(num);
            }
        },
        {
            id: 'lynch-bell-number',
            name: '林奇-贝尔数',
            emoji: '🐻',
            score: 18587361,
            rarity: '超越',
            description: '各位数码都不相同并且能被每个数码整除',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 0) return false;
                const digits = d.split('');
                // 不能包含 0（否则无法整除）
                if (digits.includes('0')) return false;
                // 检查是否有重复数字
                const unique = new Set(digits);
                if (unique.size !== digits.length) return false;
                // 检查是否能被每个数码整除
                for (let ch of digits) {
                    const digit = parseInt(ch, 10);
                    if (num % digit !== 0) return false;
                }
                return true;
            }
        },
        {
            id: 'multiplicative-pointer-prime',
            name: '乘法指针质数',
            emoji: '✖',
            score: 75757576,
            rarity: '超越',
            description: '数字是质数，且其本身加各位数码之积正好等于下一个质数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                if (!window.MathUtils.isPrime(num)) return false;
                // 计算各位数码之积
                let product = 1;
                for (let ch of d) {
                    const digit = parseInt(ch, 10);
                    if (digit === 0) return false; // 积为0，不可能等于下一个质数
                    product *= digit;
                }
                const target = num + product;
                const nextPrime = window.MathUtils.nextPrime(num);
                return target === nextPrime;
            }
        },
        {
            id: 'magic-number',
            name: '幻数',
            emoji: '💘',
            score: 3684599,
            rarity: '神话',
            description: '数字可以写作 (n³ + n) / 2 的形式，其中 n 是正整数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 1) return false;
                // 从 n=1 开始尝试，直到 (n³+n)/2 超过目标值
                let n = 1;
                while (true) {
                    const val = (n * n * n + n) / 2;
                    if (val === num) return true;
                    if (val > num) return false;
                    n++;
                }
            }
        },
        {
            id: 'motzkin-number',
            name: '莫茨金数',
            emoji: '🦉',
            score: 400000000,
            rarity: '终结',
            description: '数字是莫茨金数序列中的一项（M₀=1, M₁=1，递推公式：Mₙ = [3(n-1)Mₙ₋₂ + (2n+1)Mₙ₋₁]/(n+2)）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 0) return false;
                if (num === 1) return true; // M0=1, M1=1
                let M0 = 1, M1 = 1;
                let n = 2;
                while (true) {
                    const M2 = (3 * (n - 1) * M0 + (2 * n + 1) * M1) / (n + 2);
                    if (!Number.isInteger(M2)) return false;
                    if (M2 === num) return true;
                    if (M2 > num) return false;
                    M0 = M1;
                    M1 = M2;
                    n++;
                }
            }
        },
        {
            id: 'munchausen-number',
            name: '蒙乔森数',
            emoji: '🦿',
            score: 3333333334,
            rarity: '无尽',
            description: '数字正好是下列的其中一个数：1,3435,438579088',
            check: function(d) {
                const num = parseInt(d, 10);
                return [1,3435,438579088].includes(num);
            }
        },
        {
            id: 'oholoran-number',
            name: '奥霍洛兰数',
            emoji: '🙄',
            score: 625000000,
            rarity: '终结',
            description: '数字正好是下列的其中一个数：8,12,20,36,44,60,84,116,140,156,204,260,380,420,660,924',
            check: function(d) {
                const num = parseInt(d, 10);
                return [8,12,20,36,44,60,84,116,140,156,204,260,380,420,660,924].includes(num);
            }
        },
        {
            id: 'naked-number',
            name: '裸数',
            emoji: '🤍',
            score: 729,
            rarity: '罕见',
            description: '数字能被其每个数位整除（不含0）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 0) return false;
                for (let ch of d) {
                    const digit = parseInt(ch, 10);
                    if (digit === 0) return false;
                    if (num % digit !== 0) return false;
                }
                return true;
            }
        },
        {
            id: 'two-dimensional-partition',
            name: '二维分割',
            emoji: '🥥',
            score: 70711,
            rarity: '史诗',
            description: '数字可以写作 (n² + n + 2) / 2 的形式，其中 n 为自然数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                let n = 0;
                while (true) {
                    const val = (n * n + n + 2) / 2;
                    if (val === num) return true;
                    if (val > num) return false;
                    n++;
                }
            }
        },
        {
            id: 'partition-number',
            name: '分区数',
            emoji: '🥨',
            score: 74074075,
            rarity: '超越',
            description: '数字是整数分拆数（分区数）序列中的一项',
            check: function(d) {
                const num = parseInt(d, 10);
                return [1,2,3,5,7,11,15,22,30,42,56,77,101,135,176,231,297,385,490,627,792,1002,1255,1575,1958,2436,3010,3718,4565,5604,6842,8349,10143,12310,14883,17977,21637,26015,31185,37338,44583,53174,63261,75175,89134,105558,124754,147273,173525,204226,239943,281589,329931,386155,451276,526823,614154,715220,831820,966467,1121505,1300156,1505499,1741630,2012558,2323520,2679689,3087735,3554345,4087968,4697205,5392783,6185689,7089500,8118264,9289091,10619863,12132164,13848650,15796476,18004327,20506255,23338469,26543660,30167357,34262962,38887673,44108109,49995925,56634173,64112359,72533807,82010177,92669720,104651419,118114304,133230930,150198136,169229875,190569292,214481126,241265379,271248950,304801365,342325709,384276336,431149389,483502844,541946240,607163746,679903203,761002156,851376628,952050665,1064144451,1188908248,1327710076,1482074143,1653668665,1844349560,2056148051,2291320912,2552338241,2841940500,3163127352,3519222692,3913864295,4351078600,4835271870,5371315400,5964539504,6620830889,7346629512,8149040695,9035836076].includes(num);
            }
        },
        {
            id: 'perrin-number',
            name: '佩林数',
            emoji: '💢',
            score: 126582279,
            rarity: '终结',
            description: '数字是佩林数序列中的一项（P₀=3, P₁=0, P₂=2，递推公式：Pₙ = Pₙ₋₂ + Pₙ₋₃）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 0) return false;
                // 初始三项：P0=3, P1=0, P2=2
                let p0 = 3, p1 = 0, p2 = 2;
                // 检查前三项
                if (num === p0 || num === p1 || num === p2) return true;
                let n = 3;
                while (true) {
                    const pn = p1 + p0;  // P_n = P_{n-2} + P_{n-3}
                    if (pn === num) return true;
                    if (pn > num) return false;
                    // 向前滑动窗口
                    p0 = p1;
                    p1 = p2;
                    p2 = pn;
                    n++;
                }
            }
        },
        {
            id: 'omnipotent-mark',
            name: '全能马克',
            emoji: '⚡⚡',
            score: 26041667,
            rarity: '超越',
            description: '数字是10位泛数字（0-9各一次），且存在一个大于1的整数倍数，其结果也是10位泛数字',
            check: function(d) {
                // 检查是否为10位泛数字（0-9各一次）
                if (d.length !== 10) return false;
                const digits = d.split('');
                const unique = new Set(digits);
                if (unique.size !== 10) return false;
                // 检查是否包含0-9各一次（Set大小10即可，但为了严格，再确认没有重复）
                // 实际上Set大小10已经保证没有重复且长度10，但可能缺少某个数字？但长度10且无重复，必然包含全部0-9。
                // 所以通过。
                const num = parseInt(d, 10);
                // 枚举k从2到9（超过9乘积至少为10位数*10=11位，不可能再是10位泛数字）
                for (let k = 2; k <= 9; k++) {
                    const product = num * k;
                    // 乘积必须恰好是10位数（首位不能为0）
                    if (product < 1000000000 || product > 9999999999) continue;
                    const prodStr = product.toString();
                    // 检查乘积是否为10位泛数字
                    const prodSet = new Set(prodStr.split(''));
                    if (prodSet.size === 10) {
                        return true;
                    }
                }
                return false;
            }
        },
        {
            id: 'pierpont-number',
            name: '皮尔庞特数',
            emoji: '🐽',
            score: 26595745,
            rarity: '超越',
            description: '数字可以写作 2^a × 3^b + 1 的形式，其中 a 和 b 均为自然数（含0）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                // 枚举 a 从 0 开始，直到 2^a 超过 num-1
                let pow2 = 1;
                for (let a = 0; pow2 < num; a++) {
                    let pow3 = 1;
                    for (let b = 0; pow2 * pow3 < num; b++) {
                        if (pow2 * pow3 + 1 === num) {
                            return true;
                        }
                        pow3 *= 3;
                    }
                    pow2 *= 2;
                }
                return false;
            }
        },
        {
            id: 'polite-number',
            name: '波利特数',
            emoji: '💍',
            score: 909090910,
            rarity: '终结',
            description: '数字可以写作 2^p - 2 的形式，其中 p 是质数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                const n = num + 2;
                // 检查 n 是否为 2 的幂
                if ((n & (n - 1)) !== 0) return false;
                // 计算指数 p
                let p = 0;
                let temp = n;
                while (temp > 1) {
                    temp >>= 1;
                    p++;
                }
                // p 必须是质数
                return window.MathUtils.isPrime(p);
            }
        },
        {
            id: 'primitive-number',
            name: '原始数',
            emoji: '👾',
            score: 111111112,
            rarity: '终结',
            description: '数字是原始数（能用其各位数字表示的质数比所有更小的数都多）',
            check: function(d) {
                const num = parseInt(d, 10);
                return [1,2,13,37,107,113,137,1013,1037,1079,1237,1367,1379,10079,10123,10136,10139,10237,10279,10367,10379,12379,13679,100279,100379,101237,102347,102379,103679,123479,1001237,1002347,1002379,1003679,1012349,1012379,1023457,1023467,1023479,1234579,1234679,10012349,10012379,10023457,10023467,10023479,10034579,10123457,10123469,10123579,10123679,10234567,10234579,10234679,12345679,100123379,100123457,100123469,100123579,100123679,100233479,100234567,100234579,100234679,101234567,101234579,102334679,102345679,1000234579,1000234679,1001233469,1001233579,1001233679,1001234567,1001234579,1002334679,1002345679,1012345678,1012345679,1123456789].includes(num);
            }
        },
        {
            id: 'primorial-number',
            name: '质阶乘',
            emoji: '🧫',
            score: 909090910,
            rarity: '终结',
            description: '数字正好是下列中的其中一个：1,2,6,30,210,2310,30030,510510,9699690,223092870,6469693230',
            check: function(d) {
                const num = parseInt(d, 10);
                return [1,2,6,30,210,2310,30030,510510,9699690,223092870,6469693230].includes(num);
            }
        },
        {
            id: 'rare-number',
            name: '鲜有数',
            emoji: '📡',
            score: 2000000000,
            rarity: '无尽',
            description: '数字正好是下列中的其中一个：65,621770,281089082,2022652202,2042832002',
            check: function(d) {
                const num = parseInt(d, 10);
                return [65, 621770, 281089082, 2022652202, 2042832002].includes(num);
            }
        },
        {
            id: 'repetend-number',
            name: '重复数',
            emoji: '🌾',
            score: 243902440,
            rarity: '终结',
            description: '数字是重复数',
            check: function(d) {
                const num = parseInt(d, 10);
                return [14,19,28,47,61,75,197,742,1104,1537,2208,2580,3684,4788,7385,7647,7909,31331,34285,34348,55604,62662,86935,93993,120284,129106,147640,156146,174680,183186,298320,355419,694280,925993,1084051,7913837,11436171,33445755,44121607,129572008,251133297].includes(num);
            }
        },
        {
            id: 'saint-exupery-number',
            name: '圣埃克苏佩里数',
            emoji: '🎅',
            score: 2446783,
            rarity: '神话',
            description: '数字是某个勾股三角形三边的乘积（即存在勾股三元组 a²+b²=c²，使得 a×b×c 等于该数）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 60) return false; // 最小的勾股三元组 3,4,5 → 乘积 60
        
                // 使用缓存
                if (!window._pythagorean_product_cache) {
                    window._pythagorean_product_cache = new Set();
                    const limit = 10000000000; // 10^10，因为数字最多 10 位
        
                    // 枚举 a 从 1 到 limit 的立方根
                    const maxA = Math.floor(Math.pow(limit, 1/3));
                    for (let a = 1; a <= maxA; a++) {
                        // b 最小为 a+1，最大为 sqrt(limit / a)，因为 a * b^2 < limit（c > b）
                        const maxB = Math.floor(Math.sqrt(limit / a));
                        for (let b = a + 1; b <= maxB; b++) {
                            const a2 = a * a;
                            const b2 = b * b;
                            const cSquared = a2 + b2;
                            const c = Math.sqrt(cSquared);
                            if (Number.isInteger(c)) {
                                // 确保 c > b
                                if (c > b) {
                                    const product = a * b * c;
                                    if (product <= limit) {
                                        window._pythagorean_product_cache.add(product);
                                    }
                                }
                            }
                        }
                    }
                }
        
                return window._pythagorean_product_cache.has(num);
            }
        },
        {
            id: 'primitive-saint-exupery-number',
            name: '本原圣埃克苏佩里数',
            emoji: '🎅🎅',
            score: 17699116,
            rarity: '超越',
            description: '数字是本原勾股三角形三边的乘积（即存在本原勾股三元组 a²+b²=c²，gcd(a,b,c)=1，使得 a×b×c 等于该数）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 60) return false;
        
                // 辅助函数：最大公约数
                function gcd(a, b) {
                    while (b !== 0) {
                        const t = b;
                        b = a % b;
                        a = t;
                    }
                    return a;
                }
        
                if (!window._primitive_pythagorean_product_cache) {
                    const set = new Set();
                    const maxNum = 9999999999; // 10位数上限
        
                    // 枚举 m, n 生成本原勾股三元组 (欧几里得公式)
                    // 乘积大约为 2*m^5，所以 m 上限约为 (maxNum/2)^(1/5) ≈ 100
                    for (let m = 2; m <= 200; m++) {
                        for (let n = 1; n < m; n++) {
                            // 条件：互质，且一奇一偶
                            if (gcd(m, n) !== 1) continue;
                            if ((m - n) % 2 === 0) continue;
        
                            const a = m * m - n * n;
                            const b = 2 * m * n;
                            const c = m * m + n * n;
                            const product = a * b * c;
                            if (product <= maxNum) {
                                set.add(product);
                            }
                        }
                    }
                    window._primitive_pythagorean_product_cache = set;
                }
        
                return window._primitive_pythagorean_product_cache.has(num);
            }
        },
        {
            id: 'increment-family',
            name: '增量大家庭',
            emoji: '🍼',
            score: 28989,
            rarity: '史诗',
            description: '数字至少包含以下子串中的两个："297""308""6365""19728""66686"，允许重复',
            check: function(d) {
                const patterns = ['297', '308', '6365', '19728', '66686'];
                let count = 0;
                for (let p of patterns) {
                    let pos = 0;
                    while ((pos = d.indexOf(p, pos)) !== -1) {
                        count++;
                        pos++; // 允许重叠
                    }
                }
                return count >= 2;
            }
        },
        {
            id: 'autobiographical-number',
            name: '自传数',
            emoji: '📔',
            score: 1472581473,
            rarity: '无尽',
            description: '数字正好为下列中的一个：1210, 2020, 21200, 3211000, 42101000, 521001000, 6210001000',
            check: function(d) {
                const num = parseInt(d, 10);
                return [1210, 2020, 21200, 3211000, 42101000, 521001000, 6210001000].includes(num);
            }
        },
        {
            id: 'self-indexing-number',
            name: '自指数',
            emoji: '💅',
            score: 12919897,
            rarity: '超越',
            description: '位数为偶数，且其各位数字可以分成若干个相邻的数对，每个数对真实地表示该数中包含的数字及其出现次数（例如"22"表示2出现2次，"224444"表示2出现2次、4出现4次）。',
            check: function(d) {
                const len = d.length;
                // 位数必须为偶数
                if (len === 0 || len % 2 !== 0) return false;
        
               // 统计每个数字在整体字符串中出现的总次数
                const counts = {};
                for (let ch of d) {
                    counts[ch] = (counts[ch] || 0) + 1;
                }

                // 按两位一组遍历
                for (let i = 0; i < len; i += 2) {
                    const pair = d.slice(i, i + 2);
                    const countChar = pair[0];
                    const digitChar = pair[1];
                    // 计数必须为数字
                    if (countChar < '0' || countChar > '9') return false;
                    const expectedCount = parseInt(countChar, 10);
                    const actualCount = counts[digitChar] || 0;
                    if (expectedCount !== actualCount) {
                        return false;
                    }
                }
        
                return true;
            }
        },
        {
            id: 'omiston-number',
            name: '奥米斯顿',
            emoji: '🍛',
            score: 6584,
            rarity: '超越',
            description: '数字在奥米斯顿数对中（即该数字为质数，且与其相邻的质数之一（上一个或下一个）拥有相同的数字集合，只是排列顺序不同）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (!window.MathUtils.isPrime(num)) return false;
        
                // 辅助函数：检查两个数字是否为排列（数字相同顺序不同）
                function isPermutation(a, b) {
                    const aStr = String(a);
                    const bStr = String(b);
                    if (aStr.length !== bStr.length) return false;
                    return aStr.split('').sort().join('') === bStr.split('').sort().join('');
                }
        
                const prev = window.MathUtils.prevPrime(num);
                const next = window.MathUtils.nextPrime(num);
        
                if (prev !== null && isPermutation(num, prev)) return true;
                if (next !== null && isPermutation(num, next)) return true;
        
                return false;
            }
        },
        {
            id: 'sliding-number',
            name: '滑动数',
            emoji: '🧈',
            score: 7867821,
            rarity: '神话',
            description: '数字是滑动数，即存在正整数 a,b 和自然数 k，使得 n = a+b 且 1/a + 1/b = n / 10^k（等价于 a*b = 10^k）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
        
                // 枚举 k 从 0 开始（10^0 = 1）
                for (let k = 0; k <= 25; k++) {
                    const pow10 = Math.pow(10, k);
                    const discriminant = num * num - 4 * pow10;
                    if (discriminant < 0) break; // 随着 k 增大，判别式单调递减
                    const sqrt = Math.sqrt(discriminant);
                    const s = Math.round(sqrt);
                    if (s * s === discriminant) {
                        const a = (num - s) / 2;
                        const b = (num + s) / 2;
                        if (a > 0 && Number.isInteger(a) && b > 0 && Number.isInteger(b)) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        {
            id: 'sastry-number',
            name: '萨斯特里数',
            emoji: '🎊',
            score: 277777778,
            rarity: '终结',
            description: '数字 n 满足：将 n 与 n+1 连接后得到一个完全平方数（2次方数）',
            check: function(d) {
                const n = BigInt(d);
                const concat = BigInt(String(n) + String(n + 1n));
                // 使用二分查找判断 concat 是否为完全平方数
                let low = 0n;
                let high = concat;
                while (low <= high) {
                    const mid = (low + high) >> 1n;
                    const square = mid * mid;
                    if (square === concat) return true;
                    if (square < concat) low = mid + 1n;
                    else high = mid - 1n;
                }
                return false;
            }
        },
        {
            id: 'self-number',
            name: '自我数',
            emoji: '🗳',
            score: 11,
            rarity: '普通',
            description: '不存在某个数 k，使得 k 加上它的各位数字之和等于这个数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 0) return false; // 1 开始
        
                // 计算各位数字之和的辅助函数
                function digitSum(n) {
                    let sum = 0;
                    while (n > 0) {
                        sum += n % 10;
                        n = Math.floor(n / 10);
                    }
                    return sum;
                }

                // 可能的 k 范围为 [max(1, num - 90), num - 1]，因为 digit_sum(k) ≤ 9*10 = 90
                const start = Math.max(1, num - 90);
                for (let k = start; k < num; k++) {
                    if (k + digitSum(k) === num) {
                        return false; // 存在生成数，不是自我数
                    }
                }
                return true;
            }
        },
        {
            id: 'triprime-number',
            name: '三合数',
            emoji: '🗳',
            score: 5,
            rarity: '平庸',
            description: '数字是三个质数的乘积',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 8) return false; // 最小三合数为 2*2*2=8

                let n = num;
                let count = 0;
                // 试除2
                while (n % 2 === 0) {
                    count++;
                    n /= 2;
                }
                // 试除奇数
                let p = 3;
                while (p * p <= n) {
                    while (n % p === 0) {
                        count++;
                        n /= p;
                    }
                    p += 2;
                }
                if (n > 1) count++; // 剩余一个质因子
        
                return count === 3;
            }
        },
        {
            id: 'sophie-germain-prime',
            name: '索菲热尔曼质数',
            emoji: '♨',
            score: 377,
            rarity: '罕见',
            description: '数字是索菲热尔曼质数（p和2p+1均为质数）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                if (!window.MathUtils.isPrime(num)) return false;
                const twoPPlus1 = 2 * num + 1;
                return window.MathUtils.isPrime(twoPPlus1);
            }
        },
        {
            id: 'star-number',
            name: '星数',
            emoji: '🌟',
            score: 244954,
            rarity: '传说',
            description: '数字可以写作 6n(n-1)+1 的形式，其中 n 为大于 1 的整数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 1) return false;
                // 解方程：6n^2 - 6n + 1 = num  =>  6n^2 - 6n + (1 - num) = 0
                // 判别式 Δ = 36 - 24(1 - num) = 12 + 24num = 12(1 + 2num)
                const delta = 12 * (1 + 2 * num);
                const sqrtDelta = Math.sqrt(delta);
                if (sqrtDelta !== Math.floor(sqrtDelta)) return false;
                const n = (6 + sqrtDelta) / 12;
                return Number.isInteger(n) && n > 1;
            }
        },
        {
            id: 'strong-prime',
            name: '强质数',
            emoji: '🦷',
            score: 45,
            rarity: '普通',
            description: '数字是质数，且大于其相邻两个质数的平均值',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 3) return false; // 2 没有上一个质数
                if (!window.MathUtils.isPrime(num)) return false;
                const prev = window.MathUtils.prevPrime(num);
                const next = window.MathUtils.nextPrime(num);
                if (prev === null || next === null) return false;
                return num > (prev + next) / 2;
            }
        },
        {
            id: 'weak-prime',
            name: '弱质数',
            emoji: '🦴',
            score: 45,
            rarity: '普通',
            description: '数字是质数，且小于其相邻两个质数的平均值',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 3) return false;
                if (!window.MathUtils.isPrime(num)) return false;
                const prev = window.MathUtils.prevPrime(num);
                const next = window.MathUtils.nextPrime(num);
                if (prev === null || next === null) return false;
                return num < (prev + next) / 2;
            }
        },
        {
            id: 'subfactorial-number',
            name: '次阶乘',
            emoji: '❣❣',
            score: 769230770,
            rarity: '终结',
            description: '数字正好为下列中的一个：0, 1, 2, 9, 44, 265, 1854, 14833, 133496, 1334961, 14684570, 176214841, 2290792932',
            check: function(d) {
                const num = parseInt(d, 10);
                return [0,1,2,9,44,265,1854,14833,133496,1334961,14684570,176214841,2290792932].includes(num);
            }
        },
        {
            id: 'super-harshad-number',
            name: '超级哈沙德数',
            emoji: '🤣☮',
            score: 815196,
            rarity: '传说',
            description: '数字能被其各位数字之和整除，且能被其任意非零数字子集之和整除',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num <= 0) return false;
                const digits = d.split('').map(Number);
                // 所有数字之和（包括0）
                const totalSum = digits.reduce((a, b) => a + b, 0);
                if (totalSum === 0) return false; // 避免除以0
                if (num % totalSum !== 0) return false;
        
                // 提取非零数字
                const nonZeroDigits = digits.filter(x => x > 0);
                if (nonZeroDigits.length === 0) return false;
        
                // 枚举所有非空子集
                const n = nonZeroDigits.length;
                const totalSubsets = 1 << n;
                for (let mask = 1; mask < totalSubsets; mask++) {
                    let sum = 0;
                    for (let i = 0; i < n; i++) {
                        if (mask & (1 << i)) {
                            sum += nonZeroDigits[i];
                        }
                    }
                    if (num % sum !== 0) {
                        return false;
                    }
                }
                return true;
            }
        },
        {
            id: 'tetranacci-number',
            name: '四重斐波那契',
            emoji: '🌪',
            score: 277777778,
            rarity: '终结',
            description: '数字是四重斐波那契数列中的一项（T₀=0, T₁=T₂=1, T₃=2, Tₙ=Tₙ₋₁+Tₙ₋₂+Tₙ₋₃+Tₙ₋₄）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 0) return false;
                if (!window._tetranacci_cache) {
                    const set = new Set();
                    let a = 0, b = 1, c = 1, d = 2;
                    set.add(a);
                    set.add(b);
                    set.add(c);
                    set.add(d);
                    const limit = 10000000000; // 10^10
                    while (d <= limit) {
                        const next = a + b + c + d;
                        if (next > limit) break;
                        set.add(next);
                        a = b;
                        b = c;
                        c = d;
                        d = next;
                    }
                    window._tetranacci_cache = set;
                }
                return window._tetranacci_cache.has(num);
            }
        },
        {
            id: 'tribonacci-number',
            name: '三重斐波那契',
            emoji: '🌬',
            score: 263157894,
            rarity: '终结',
            description: '数字是三重斐波那契数列中的一项（T₁=T₂=1, T₃=2, Tₙ=Tₙ₋₁+Tₙ₋₂+Tₙ₋₃）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 1) return false;
                if (!window._tribonacci_cache) {
                    const set = new Set();
                    let a = 1, b = 1, c = 2;
                    set.add(a);
                    set.add(b);
                    set.add(c);
                    const limit = 10000000000; // 10^10
                    while (c <= limit) {
                        const next = a + b + c;
                        if (next > limit) break;
                        set.add(next);
                        a = b;
                        b = c;
                        c = next;
                    }
                    window._tribonacci_cache = set;
                }
                return window._tribonacci_cache.has(num);
            }
        },
        {
            id: 'puzzle-number',
            name: '拼图',
            emoji: '🧩',
            score: 11,
            rarity: '普通',
            description: '位数至少为 2，且第一位与最后一位相加等于 10',
            check: function(d) {
                if (d.length < 2) return false;
                const first = parseInt(d[0], 10);
                const last = parseInt(d[d.length - 1], 10);
                return first + last === 10;
            }
        },
        {
            id: 'advanced-puzzle-number',
            name: '高阶拼图',
            emoji: '🧩🧩',
            score: 101,
            rarity: '罕见',
            description: '位数至少为 4，且前两位与最后两位相加等于 100',
            check: function(d) {
                if (d.length < 4) return false;
                const first = parseInt(d.slice(0, 2), 10);
                const last = parseInt(d.slice(-2), 10);
                return first + last === 100;
            }
        },
        {
            id: 'master-puzzle-number',
            name: '大师拼图',
            emoji: '🧩🧩🧩',
            score: 1001,
            rarity: '稀有',
            description: '位数至少为 6，且前三位与最后三位相加等于 1000',
            check: function(d) {
                if (d.length < 6) return false;
                const first = parseInt(d.slice(0, 3), 10);
                const last = parseInt(d.slice(-3), 10);
                return first + last === 1000;
            }
        },
        {
            id: 'ultimate-puzzle-number',
            name: '终焉拼图',
            emoji: '🧩🧩🧩🧩',
            score: 10011,
            rarity: '史诗',
            description: '位数至少为 8，且前四位与最后四位相加等于 10000',
            check: function(d) {
                if (d.length < 8) return false;
                const first = parseInt(d.slice(0, 4), 10);
                const last = parseInt(d.slice(-4), 10);
                return first + last === 10000;
            }
        },
        {
            id: 'wieferich-number',
            name: '维费里希数',
            emoji: '🎗',
            score: 140845071,
            rarity: '终结',
            description: '数字是维费里希数',
            check: function(d) {
                const num = parseInt(d, 10);
                return [1093,3279,3511,7651,10533,14209,17555,22953,31599,42627,45643,52665,68859,94797,99463,127881,136929,157995,228215,298389,410787,473985,684645,895167,1232361,2053935,2685501,3697083,3837523,6161805,11512569,18485415,19187615,26862661,34537707,49887799,57562845,80587983,103613121,134313305,149663397,172688535,241763949,249438995,310839363,349214593,402939915,448990191,518065605,648541387,725291847,748316985,1047643779,1208819745,1346970573,1554196815,1746072965,1945624161,2175875541,2244950955,3142931337,3242706935,3626459235,4040911719,4539789709,5238218895,5836872483,6527626623,6734852865,9428794011,9728120805].includes(num);
            }
        },
        {
            id: 'super-composite-number',
            name: '超级合数',
            emoji: '🖼',
            score: 3,
            rarity: '平庸',
            description: '数字是合数，且任意改变其中一个数码（保持位数不变）后都无法成为质数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 2) return false;
                if (window.MathUtils.isPrime(num)) return false; // 必须是合数
        
                const digits = d.split('');
                const len = digits.length;
        
                for (let i = 0; i < len; i++) {
                    const originalDigit = parseInt(digits[i], 10);
                    // 首位不能替换为0（保持位数不变）
                    const start = (i === 0) ? 1 : 0;
                    for (let newDigit = start; newDigit <= 9; newDigit++) {
                        if (newDigit === originalDigit) continue;
                        const newDigits = [...digits];
                        newDigits[i] = String(newDigit);
                        const newNum = parseInt(newDigits.join(''), 10);
                        // 如果存在一次替换得到质数，则不满足条件
                        if (window.MathUtils.isPrime(newNum)) {
                            return false;
                        }
                    }
                }
                return true; // 所有替换都不是质数
            }
        },
        {
            id: 'postmodern-number',
            name: '后现代',
            emoji: '⚛',
            score: 53959,
            rarity: '史诗',
            description: '数字全部由至少 1 组长度至少为 2 的同一数字数码串组成（每个连续相同数字块的长度均不小于 2）',
            check: function(d) {
                if (d.length < 2) return false;
                let i = 0;
                while (i < d.length) {
                    const digit = d[i];
                    let j = i;
                    while (j < d.length && d[j] === digit) j++;
                    const blockLen = j - i;
                    if (blockLen < 2) return false;
                    i = j;
                }
                return true;
            }
        },
        {
            id: 'isolated-prime',
            name: '虚质数',
            emoji: '🎆',
            score: 268097,
            rarity: '传说',
            description: '数字是质数，且任意改变其中一个数码（保持位数不变）后都无法成为其他质数',
            check: function(d) {
                const num = parseInt(d, 10);
                if (!window.MathUtils.isPrime(num)) return false;
        
                const digits = d.split('');
                const len = digits.length;
        
                for (let i = 0; i < len; i++) {
                    const originalDigit = parseInt(digits[i], 10);
                    const start = (i === 0) ? 1 : 0;
                    for (let newDigit = start; newDigit <= 9; newDigit++) {
                        if (newDigit === originalDigit) continue;
                        const newDigits = [...digits];
                        newDigits[i] = String(newDigit);
                        const newNum = parseInt(newDigits.join(''), 10);
                        if (window.MathUtils.isPrime(newNum)) {
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        {
            id: 'pi-substring',
            name: '圆周率',
            emoji: '🎯',
            score: 69,
            rarity: '普通',
            description: '数字包含子串“722”或“227（22/7 的两种排列）”',
            check: function(d) {
                return d.includes('722') || d.includes('227');
            }
        },
        {
            id: 'zu-chongzhi-substring',
            name: '祖冲之',
            emoji: '🧿',
            score: 100000,
            rarity: '史诗',
            description: '数字包含子串“355113”或“113355”（祖冲之约率 355/113 的两种排列）',
            check: function(d) {
                return d.includes('355113') || d.includes('113355');
            }
        },
        {
            id: 'palindromic-semiprime',
            name: '回文半质数',
            emoji: '🌐',
            score: 423406,
            rarity: '传说',
            description: '数字是半质数（两个质数的乘积，允许相同），且正着读和反着读相同（回文数）',
            check: function(d) {
                const num = parseInt(d, 10);
                if (num < 4) return false;
                if (!window.MathUtils.isSemiprime(num)) return false;
                return d === d.split('').reverse().join('');
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
        { s: 16, emoji: '🔟5️⃣🩺🩺', score: 264578, rarity: '传说', name: '十六边形数', desc: '数字是十六边形数（n(7n-6)）' },
        { s: 17, emoji: '1️⃣5️⃣🩺🩺🩺', score: 273861, rarity: '传说', name: '十七边形数', desc: '数字是十七边形数（n(15n-13)/2）' },
        { s: 18, emoji: '1️⃣5️⃣🩺🩺🩺🩺', score: 282846, rarity: '传说', name: '十八边形数', desc: '数字是十八边形数（n(8n-7)）' },
        { s: 19, emoji: '1️⃣5️⃣🩺🩺🩺🩺🩺', score: 291548, rarity: '传说', name: '十九边形数', desc: '数字是十九边形数（n(17n-15)/2）' },
        { s: 20, emoji: '🔟🔟🩺', score: 300000, rarity: '传说', name: '二十边形数', desc: '数字是二十边形数（n(9n-8)）' }
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
    
    // 中心多边形数配置
    const centeredPolyConfigs = [
        { s: 3, name: '中心三角形数', emoji: '⭕3️⃣', score: 122474 },
        { s: 4, name: '中心正方形数', emoji: '⭕4️⃣', score: 141421 },
        { s: 5, name: '中心五边形数', emoji: '⭕5️⃣', score: 158113 },
        { s: 6, name: '中心六边形数', emoji: '⭕6️⃣', score: 173206 },
        { s: 7, name: '中心七边形数', emoji: '⭕7️⃣', score: 187084 },
        { s: 8, name: '中心八边形数', emoji: '⭕8️⃣', score: 200000 },
        { s: 9, name: '中心九边形数', emoji: '⭕9️⃣', score: 212635 },
        { s: 10, name: '中心十边形数', emoji: '⭕🔟', score: 223609 },
        { s: 11, name: '中心十一边形数', emoji: '⭕🔟1️⃣', score: 234522 },
        { s: 12, name: '中心十二边形数', emoji: '⭕🔟2️⃣', score: 244948 },
        { s: 13, name: '中心十三边形数', emoji: '⭕🔟3️⃣', score: 254953 },
        { s: 14, name: '中心十四边形数', emoji: '⭕🔟4️⃣', score: 264572 },
        { s: 15, name: '中心十五边形数', emoji: '⭕🔟5️⃣', score: 273861 },
        { s: 16, name: '中心十六边形数', emoji: '⭕🔟6️⃣', score: 282846 },
        { s: 17, name: '中心十七边形数', emoji: '⭕🔟7️⃣', score: 291546 },
        { s: 18, name: '中心十八边形数', emoji: '⭕🔟8️⃣', score: 300004 },
        { s: 19, name: '中心十九边形数', emoji: '⭕🔟9️⃣', score: 308224 },
        { s: 20, name: '中心二十边形数', emoji: '⭕🔟🔟', score: 316226 }
    ];
    
    for (const cfg of centeredPolyConfigs) {
        BADGE_DEFS.push({
            id: `centered-polygonal-${cfg.s}`,
            name: cfg.name,
            emoji: cfg.emoji,
            score: cfg.score,
            rarity: '传说',
            description: `数字是中心${cfg.s}边形数`,
            check: (function(s) {
                return function(d) {
                    const num = parseInt(d, 10);
                    if (num < 1) return false;
                    return window.MathUtils && typeof window.MathUtils.isCenteredPolygonal === 'function'
                        ? window.MathUtils.isCenteredPolygonal(num, s)
                        : false;
                };
            })(cfg.s)
        });
    }

    // 暴露到全局
    window.BADGE_DEFS = BADGE_DEFS;
})();