// app.js – 主应用逻辑（数字生成、揭示、按钮交互，含徽章显示切换 + 复制分享 + 历史最佳 + 筛选按钮）
(function() {
    'use strict';

    // ===== 主题管理 =====
    function initTheme() {
        const stored = localStorage.getItem('theme') || 'auto';
        applyTheme(stored);

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (localStorage.getItem('theme') === 'auto') {
                applyTheme('auto');
            }
        };
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', isDark ? 'dark' : 'light');
            localStorage.setItem('theme', 'auto');
        } else {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        if (theme === 'auto') {
            document.querySelector('.theme-btn[data-theme="auto"]')?.classList.add('active');
        }
    }

    function setupThemeButtons() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const theme = this.dataset.theme;
                applyTheme(theme);
                e.stopPropagation();
            });
        });
    }

    // ===== 更新筛选按钮状态 =====
    function updateFilterButton() {
        const filterBtnEl = document.getElementById('filterBtn');
        if (!filterBtnEl) return;
        // 重置类
        filterBtnEl.className = 'btn-toggle-badges btn-filter';
        // 通过全局 Badges 对象获取当前筛选值
        const rarity = window.Badges.getFilterRarity();
        const label = rarity === 'all' ? '全部' : rarity;
        filterBtnEl.textContent = `🔍 ${label}`;
        if (rarity === 'all') {
            filterBtnEl.classList.add('filter-all');
        } else {
            filterBtnEl.classList.add(`badge-pill--${rarity}`);
        }
    }

    // ===== 主流程 =====
    document.addEventListener('DOMContentLoaded', function() {
        const cleanupTheme = initTheme();
        setupThemeButtons();

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
        const bestNumberSpan = document.getElementById('bestNumber');
        const bestScoreSpan = document.getElementById('bestScore');

        // ---------- 初始化徽章模块 ----------
        if (window.Badges && typeof window.Badges.initBadgeUI === 'function') {
            if (badgeList && totalScoreSpan) {
                window.Badges.initBadgeUI(badgeList, totalScoreSpan, currentScoreSpan);
                window.onTotalGenerationsChange = function(count) {
                    if (totalGenerationsSpan) {
                        totalGenerationsSpan.textContent = count.toLocaleString();
                    }
                };
                window.onBestChange = function(best) {
                    if (bestNumberSpan && bestScoreSpan) {
                        if (best.number) {
                            bestNumberSpan.textContent = best.number;
                            bestScoreSpan.textContent = best.score.toLocaleString() + ' TP';
                        } else {
                            bestNumberSpan.textContent = '—';
                            bestScoreSpan.textContent = '0 TP';
                        }
                    }
                };
                window.onTotalGenerationsChange(window.Badges.getTotalGenerations());
                const best = window.Badges.getBest();
                window.onBestChange(best);
            } else {
                console.warn('Badge UI elements missing, skipping badge initialization.');
            }
        } else {
            console.warn('Badges module not loaded properly.');
        }

        // ---------- 筛选按钮 ----------
        const filterBtn = document.getElementById('filterBtn');
        if (filterBtn && window.Badges) {
            // 初始更新
            updateFilterButton();
            filterBtn.addEventListener('click', function() {
                if (window.Badges) {
                    window.Badges.cycleFilter();
                    updateFilterButton();
                }
            });
            // 当徽章列表变化时，刷新按钮状态（例如硬重置后）
            // 通过 MutationObserver 或自定义事件，但简单起见，在硬重置后手动调用
            // 在硬重置中我们会调用 updateFilterButton
        }

        const TOTAL_DIGITS = 10;
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

            if (window.Badges && typeof window.Badges.checkAndAwardBadges === 'function') {
                window.Badges.checkAndAwardBadges(numStr);
                const best = window.Badges.getBest();
                if (window.onBestChange) window.onBestChange(best);
                // 刷新筛选按钮（可能稀有度列表变化）
                updateFilterButton();
            } else {
                console.warn('Badges module not available');
            }

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
                this.textContent = showAll ? '只看当前' : '显示所有已获得';
            });
            toggleBtn.textContent = window.Badges.getShowAllBadges() ? '只看当前' : '显示所有已获得';
        }

        // ---------- 硬重置按钮 ----------
        const resetBtn = document.getElementById('hardResetBtn');
        if (resetBtn && window.Badges && typeof window.Badges.hardReset === 'function') {
            resetBtn.addEventListener('click', function() {
                if (confirm('确定要清除所有数据吗？此操作不可撤销！')) {
                    window.Badges.hardReset();
                    resetDigits();
                    window.__currentNumber = '';
                    const best = window.Badges.getBest();
                    if (window.onBestChange) window.onBestChange(best);
                    // 刷新筛选按钮
                    updateFilterButton();
                }
            });
        }

        // ---------- 复制分享功能 ----------
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                const numberStr = window.__currentNumber || '';
                if (!numberStr) {
                    showToast('请先生成一个数字！');
                    return;
                }

                const badges = window.Badges.getBadgesForNumber ? window.Badges.getBadgesForNumber(numberStr) : [];
                const totalScore = badges.reduce((sum, b) => sum + b.score, 0);

                let text = `🎲 HYPERNGdle\n数字：${numberStr}\n`;
                if (badges.length === 0) {
                    text += '（未获得任何徽章）\n';
                } else {
                    badges.forEach(b => {
                        text += `  ${b.emoji} ${b.name}  +${b.score.toLocaleString()} TP\n`;
                    });
                }
                text += `\n本数字总 TP：${totalScore.toLocaleString()}`;
                const totalTP = window.Badges.getTotalTP ? window.Badges.getTotalTP() : 0;
                text += `\n历史总 TP：${totalTP.toLocaleString()}`;
                text += `\n\n🔗 在 HYPERNGdle 试试你的运气：https://txgeer.github.io/TPeT/HYPERNGdle/HYPERNGdle.html`;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        showToast('已复制到剪贴板！');
                    }).catch(() => {
                        fallbackCopy(text);
                    });
                } else {
                    fallbackCopy(text);
                }
            });
        }

        function fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-9999px';
            textarea.style.top = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                const success = document.execCommand('copy');
                if (success) {
                    showToast('已复制到剪贴板！');
                } else {
                    alert('复制失败，请手动复制以下内容：\n\n' + text);
                }
            } catch (e) {
                alert('复制失败，请手动复制以下内容：\n\n' + text);
            }
            document.body.removeChild(textarea);
        }

        let toastTimer = null;
        function showToast(msg) {
            const old = document.querySelector('.custom-toast');
            if (old) old.remove();
            if (toastTimer) clearTimeout(toastTimer);

            const div = document.createElement('div');
            div.className = 'custom-toast';
            div.textContent = msg;
            Object.assign(div.style, {
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(20,20,20,0.9)',
                color: '#f0f0f0',
                padding: '10px 24px',
                borderRadius: '40px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: '1px solid #4a4a4a',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                zIndex: '9999',
                backdropFilter: 'blur(4px)',
                transition: 'opacity 0.3s ease'
            });
            document.body.appendChild(div);

            toastTimer = setTimeout(() => {
                div.style.opacity = '0';
                setTimeout(() => div.remove(), 300);
            }, 2000);
        }

        // 初始加载后自动生成一次
        resetDigits();
        setTimeout(handleGenerate, 1000);
    });
})();