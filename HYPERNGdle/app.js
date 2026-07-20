// app.js – 主应用逻辑（数字生成、揭示、按钮交互，含徽章显示切换）
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // ---------- 检查必要元素 ----------
        const container = document.getElementById('digitsContainer');
        if (!container) {
            console.error('Error: Required element #digitsContainer not found in DOM.');
            return;
        }
        const btn = document.getElementById('generateBtn');
        if (!btn) {
            console.error('Error: Required element #generateBtn not found.');
            return;
        }
        const card = document.getElementById('numberCard');
        if (!card) {
            console.error('Error: Required element #numberCard not found.');
            return;
        }
        const badgeList = document.getElementById('badgeList');
        const currentScoreSpan = document.getElementById('currentScore');
        const totalScoreSpan = document.getElementById('totalScore');
        const totalGenerationsSpan = document.getElementById('totalGenerations');

        // ---------- 初始化徽章模块 ----------
        if (window.Badges && typeof window.Badges.initBadgeUI === 'function') {
            if (badgeList && totalScoreSpan) {
                window.Badges.initBadgeUI(badgeList, totalScoreSpan, currentScoreSpan);
                // 设置总次数更新回调
                window.onTotalGenerationsChange = function(count) {
                    if (totalGenerationsSpan) {
                        totalGenerationsSpan.textContent = count.toLocaleString();
                    }
                };
                // 初始显示
                window.onTotalGenerationsChange(window.Badges.getTotalGenerations());
            } else {
                console.warn('Badge UI elements missing, skipping badge initialization.');
            }
        } else {
            console.warn('Badges module not loaded properly.');
        }

        const TOTAL_DIGITS = 10;

        // ---------- 创建数字占位 ----------
        let digitEls = createDigitSpans(TOTAL_DIGITS);
        let isGenerating = false;

        function createDigitSpans(count) {
            const frag = document.createDocumentFragment();
            for (let i = 0; i < count; i++) {
                const span = document.createElement('span');
                span.className = 'digit';
                span.textContent = '?';
                span.dataset.index = i;
                frag.appendChild(span);
            }
            container.appendChild(frag);
            return container.querySelectorAll('.digit');
        }

        function generateRandom10Digit() {
            let result = '';
            for (let i = 0; i < TOTAL_DIGITS; i++) {
                result += Math.floor(Math.random() * 10);
            }
            return result;
        }

        function resetDigits() {
            digitEls.forEach(el => {
                el.textContent = '?';
                el.className = 'digit';
            });
            card.classList.remove('number-card--glow');
            card.style.borderColor = '';
        }

        // ---------- 逐位揭示 ----------
        function revealNumber(numberStr) {
            return new Promise((resolve) => {
                const digits = numberStr.split('');
                const total = digits.length;
                let revealedCount = 0;

                const leadingZeroMask = new Array(total).fill(false);
                let foundNonZero = false;
                for (let i = 0; i < total - 1; i++) {
                    if (digits[i] === '0' && !foundNonZero) {
                        leadingZeroMask[i] = true;
                    } else {
                        foundNonZero = true;
                    }
                }

                digitEls.forEach(el => {
                    el.textContent = '·';
                    el.className = 'digit';
                });

                function revealNext() {
                    if (revealedCount >= total) { resolve(); return; }

                    const index = total - 1 - revealedCount;
                    const finalChar = digits[index];
                    const el = digitEls[index];
                    const isLeadingZero = leadingZeroMask[index];

                    let flickerCount = 0;
                    const MAX_FLICKER = 10;
                    const flickerInterval = setInterval(() => {
                        const randomDigit = Math.floor(Math.random() * 10);
                        el.textContent = randomDigit;
                        el.className = 'digit digit--active';
                        flickerCount++;
                        if (flickerCount >= MAX_FLICKER) {
                            clearInterval(flickerInterval);
                            el.textContent = finalChar;
                            if (isLeadingZero) {
                                el.className = 'digit digit--leading-zero';
                                el.style.transform = 'scale(0.92)';
                                setTimeout(() => { el.style.transform = 'scale(0.92)'; }, 10);
                            } else {
                                el.className = 'digit digit--revealed';
                                el.style.transform = 'scale(1.25)';
                                setTimeout(() => { el.style.transform = 'scale(1)'; }, 140);
                            }

                            revealedCount++;

                            if (!isLeadingZero || revealedCount === 1) {
                                card.classList.add('number-card--glow');
                                clearTimeout(card._borderTimer);
                                card._borderTimer = setTimeout(() => {
                                    card.classList.remove('number-card--glow');
                                }, 400);
                            }

                            setTimeout(revealNext, 100);
                        }
                    }, 50);
                }

                revealNext();
            });
        }

        // ---------- 主流程 ----------
        async function handleGenerate() {
            if (isGenerating) return;

            isGenerating = true;
            btn.disabled = true;
            btn.classList.add('is-loading');

            resetDigits();
            await new Promise(resolve => setTimeout(resolve, 200));

            const numStr = generateRandom10Digit();
            window.__currentNumber = numStr;
            await revealNumber(numStr);

            // 调用徽章检查
            if (window.Badges && typeof window.Badges.checkAndAwardBadges === 'function') {
                window.Badges.checkAndAwardBadges(numStr);
            } else {
                console.warn('Badges module not available');
            }

            // 增加生成次数并保存
            if (window.Badges && typeof window.Badges.incrementGenerations === 'function') {
                window.Badges.incrementGenerations();
            }

            btn.disabled = false;
            btn.classList.remove('is-loading');
            isGenerating = false;

            if (navigator.vibrate) navigator.vibrate(12);
        }

        // ---------- 事件绑定 ----------
        btn.addEventListener('click', handleGenerate);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGenerate();
            }
        });

        // ---------- 徽章显示切换按钮 ----------
        const toggleBtn = document.getElementById('toggleBadgeDisplay');
        if (toggleBtn && window.Badges && typeof window.Badges.toggleShowAllBadges === 'function') {
            toggleBtn.addEventListener('click', function() {
                window.Badges.toggleShowAllBadges();
                const showAll = window.Badges.getShowAllBadges();
                this.textContent = showAll ? '隐藏未获得徽章' : '显示所有徽章';
            });
            // 初始化按钮文字
            toggleBtn.textContent = window.Badges.getShowAllBadges() ? '隐藏未获得徽章' : '显示所有徽章';
        }

        // ---------- 硬重置按钮 ----------
        const resetBtn = document.getElementById('hardResetBtn');
        if (resetBtn && window.Badges && typeof window.Badges.hardReset === 'function') {
            resetBtn.addEventListener('click', function() {
                if (confirm('确定要清除所有数据吗？此操作不可撤销！')) {
                    window.Badges.hardReset();
                    // 重置数字显示
                    resetDigits();
                    // 清空当前数字字符串
                    window.__currentNumber = '';
                    // 重置得分显示（badges 内部已经更新）
                }
            });
        }

        // 初始加载后自动生成一次
        resetDigits();
        setTimeout(handleGenerate, 1000);
    });
})();