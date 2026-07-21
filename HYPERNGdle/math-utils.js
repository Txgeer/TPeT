// math-utils.js – 所有数论检测函数及辅助工具
(function() {
    'use strict';

    // ---------- 工具函数 ----------
    function getEffectiveLength(digitsStr) {
        const trimmed = digitsStr.replace(/^0+/, '');
        return trimmed.length === 0 ? 1 : trimmed.length;
    }

    function toEmojiDigits(num) {
        const map = {
            '0':'0️⃣','1':'1️⃣','2':'2️⃣','3':'3️⃣','4':'4️⃣',
            '5':'5️⃣','6':'6️⃣','7':'7️⃣','8':'8️⃣','9':'9️⃣'
        };
        return String(num).split('').map(d => map[d]).join('');
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
        if (n <= 0) return false;
        let i = 0;
        while (true) {
            const tetra = i * (i + 1) * (i + 2) / 6;
            if (tetra === n) return true;
            if (tetra > n) return false;
            i++;
        }
    }

    function isSquarePyramidal(n) {
        if (n <= 0) return false;
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

    function isIntimatePrime(n) {
        if (n < 2 || !isPrime(n)) return false;
        const discriminant = 4 * n + 5;
        const sqrtD = Math.sqrt(discriminant);
        if (!Number.isInteger(sqrtD)) return false;
        if (sqrtD % 2 === 0) return false;
        const k = (sqrtD - 1) / 2;
        return k >= 1;
    }

    function isPronic(n) {
        if (n < 0) return false;
        const k = Math.floor(Math.sqrt(n));
        return k * (k + 1) === n;
    }

    function isPowerOfBase(n, base) {
        if (n < 1 || base < 2) return false;
        let val = base;
        while (val <= n) {
            if (val === n) return true;
            val *= base;
            if (val > Number.MAX_SAFE_INTEGER) break;
        }
        return false;
    }

    // ---------- 多边形数检测 ----------
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
    function isMersennePrime(n) {
        if (n < 1) return false;
        const m = n + 1;
        // 检查 m 是否为 2 的幂
        if ((m & (m - 1)) !== 0) return false;
        // 计算指数 p
        const p = Math.log2(m);
        if (!Number.isInteger(p)) return false;
        return isPrime(p);
    }
    function countHoles(digitsStr) {
        const holeMap = {
            '0': 1,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 1,
            '5': 0,
            '6': 1,
            '7': 0,
            '8': 2,
            '9': 1
        };
        let total = 0;
        for (let ch of digitsStr) {
            total += (holeMap[ch] || 0);
        }
        return total;
    }

    // 暴露到全局
    window.MathUtils = {
        getEffectiveLength,
        toEmojiDigits,
        isPrime,
        isSemiprime,
        isAbundant,
        isHappyNumber,
        isPerfectPower,
        isDoubleFactorial,
        isFactorial,
        isMersenneNumber,
        isConstructible,
        isKaprekar,
        isFibonacci,
        isLucas,
        isPell,
        isTetrahedral,
        isSquarePyramidal,
        isCullen,
        isWoodall,
        isProth,
        isMoran,
        isIntimatePrime,
        isPronic,
        isPowerOfBase,
        isPolygonal,
        isMersennePrime,
        countHoles
    };
})();