// app.js – 主应用逻辑（数字生成、揭示、按钮交互，含徽章显示切换 + 复制分享 + 历史最佳 + 筛选按钮 + 自动抽取 + 保存最后数字 + 徽章进度 + 长按切换历史最佳）
(function() {
    'use strict';

    // ===== 常量 =====
    const LAST_NUMBER_KEY = 'hyperngdle_last_number';
    const LONG_PRESS_DELAY = 600; // 长按判定时间（毫秒）

    // ===== 状态 =====
    let isShowingBest = false;
    let savedCurrentNumber = '';

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
        filterBtnEl.className = 'btn-toggle-badges btn-filter';
        const rarity = window.Badges.getFilterRarity();
        const label = rarity === 'all' ? '全部' : rarity;
        filterBtnEl.textContent = `🔍 ${label}`;
        if (rarity === 'all') {
            filterBtnEl.classList.add('filter-all');
        } else {
            filterBtnEl.classList.add(`badge-pill--${rarity}`);
        }
    }

    // ===== 更新徽章进度 =====
    function updateBadgeProgress() {
        const progressEl = document.getElementById('badgeProgress');
        if (!progressEl) return;
        if (window.Badges) {
            const earned = window.Badges.getEarnedBadges().length;
            const total = window.Badges.getTotalBadgeTypes ? window.Badges.getTotalBadgeTypes() : 0;
            progressEl.textContent = `你有 ${earned}/${total} 个徽章`;
        }
    }

    function initCard3D() {
        const card = document.getElementById('numberCard');
        if (!card) return;
    
        // 仅当设备支持悬停（桌面）时启用
        if (!window.matchMedia('(hover: hover)').matches || window.matchMedia('(pointer: coarse)').matches) return;
    
        // 为父容器设置透视，让 3D 效果更明显
        const parent = card.parentElement;
        if (parent) {
            parent.style.perspective = '800px';
        }
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform';
    
        let timeoutId = null;
    
        const handleMove = (e) => {
            // 取消之前的延迟复位（如果有）
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
    
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            // 倾斜角度范围：±10 度
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            const shadowX = rotateY * 0.5;
            const shadowY = rotateX * 0.5;

            card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`;
            card.style.transition = 'transform 0.08s ease-out';
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
    
        const handleLeave = () => {
            // 延迟复位，避免移出时突然跳转
            timeoutId = setTimeout(() => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.transform = 'rotateX(0deg) rotateY(0deg)';
                timeoutId = null;
            }, 80);
        };
    
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        
            // 可选：点击卡片时复位（防止点击时卡片歪斜）
            card.addEventListener('mousedown', () => {
            card.style.transition = 'transform 0.15s ease-out';
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }


    // ===== 主流程 =====
    document.addEventListener('DOMContentLoaded', function() {
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
        const bestRecord = document.getElementById('bestRecord');
        const progressEl = document.getElementById('badgeProgress');

        // ---------- 自动抽取相关 ----------
        const autoBtn = document.getElementById('autoGenerateBtn');
        let isAutoGenerate = false;
        let autoTimer = null;

        function toggleAutoGenerate() {
            isAutoGenerate = !isAutoGenerate;
            if (isAutoGenerate) {
                autoBtn.textContent = '自动抽取: 开';
                if (!isGenerating) {
                    if (autoTimer) {
                        clearTimeout(autoTimer);
                        autoTimer = null;
                    }
                    handleGenerate();
                }
            } else {
                autoBtn.textContent = '自动抽取: 关';
                if (autoTimer) {
                    clearTimeout(autoTimer);
                    autoTimer = null;
                }
            }
        }

        if (autoBtn) {
            autoBtn.addEventListener('click', toggleAutoGenerate);
        }

        // ---------- 徽章模块初始化 ----------
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
                updateBadgeProgress();
            } else {
                console.warn('Badge UI elements missing, skipping badge initialization.');
            }
        } else {
            console.warn('Badges module not loaded properly.');
        }

        // ---------- 筛选按钮 ----------
        const filterBtn = document.getElementById('filterBtn');
        if (filterBtn && window.Badges) {
            updateFilterButton();
            filterBtn.addEventListener('click', function() {
                if (window.Badges) {
                    window.Badges.cycleFilter();
                    updateFilterButton();
                }
            });
        }

        // ---------- 数字生成相关 ----------
        const TOTAL_DIGITS = 10;
        let digitEls = createDigitSpans(TOTAL_DIGITS);
        let isGenerating = false;
        let lastCompletedNumber = '';   // 保存上次完整生成的数字

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
            card.classList.remove('card-enter');
        }

        // ===== 保存最后数字 =====
        function saveLastNumber(numberStr) {
            try {
                localStorage.setItem(LAST_NUMBER_KEY, numberStr);
            } catch (e) {
                // ignore
            }
        }

        function getLastNumber() {
            try {
                return localStorage.getItem(LAST_NUMBER_KEY) || '';
            } catch (e) {
                return '';
            }
        }

        // ===== 只显示数字（不保存，不修改lastCompletedNumber） =====
        function displayNumberOnly(numberStr) {
            const digits = numberStr.split('');
            const total = digits.length;

            digitEls.forEach(el => {
                el.textContent = '?';
                el.className = 'digit';
                el.style.transform = '';
            });

            const trimmed = numberStr.replace(/^0+/, '');
            const leadingZeroCount = numberStr.length - trimmed.length;

            for (let i = 0; i < total; i++) {
                const el = digitEls[i];
                const char = digits[i];
                el.textContent = char;
                if (i < leadingZeroCount) {
                    el.className = 'digit digit--leading-zero';
                    el.style.transform = 'scale(0.92)';
                } else {
                    el.className = 'digit digit--revealed';
                }
            }

            card.classList.add('number-card--glow');
            setTimeout(() => {
                card.classList.remove('number-card--glow');
            }, 400);

            card.classList.remove('card-enter');
            void card.offsetWidth;
            card.classList.add('card-enter');

            if (window.Badges && typeof window.Badges.setCurrentNumberOnly === 'function') {
                window.Badges.setCurrentNumberOnly(numberStr);
            }
            // 不修改 window.__currentNumber 和 lastCompletedNumber
        }

        // ===== 直接显示已保存的数字（用于恢复） =====
        function displaySavedNumber(numberStr) {
            const digits = numberStr.split('');
            const total = digits.length;

            digitEls.forEach(el => {
                el.textContent = '?';
                el.className = 'digit';
                el.style.transform = '';
            });

            const trimmed = numberStr.replace(/^0+/, '');
            const leadingZeroCount = numberStr.length - trimmed.length;

            for (let i = 0; i < total; i++) {
                const el = digitEls[i];
                const char = digits[i];
                el.textContent = char;
                if (i < leadingZeroCount) {
                    el.className = 'digit digit--leading-zero';
                    el.style.transform = 'scale(0.92)';
                } else {
                    el.className = 'digit digit--revealed';
                }
            }

            card.classList.add('number-card--glow');
            setTimeout(() => {
                card.classList.remove('number-card--glow');
            }, 400);

            card.classList.remove('card-enter');
            void card.offsetWidth;
            card.classList.add('card-enter');

            if (window.Badges && typeof window.Badges.setCurrentNumberOnly === 'function') {
                window.Badges.setCurrentNumberOnly(numberStr);
            }

            window.__currentNumber = numberStr;
            lastCompletedNumber = numberStr;
            updateBadgeProgress();
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

            // 退出历史最佳模式
            if (isShowingBest) {
                isShowingBest = false;
                savedCurrentNumber = '';
            }

            if (isAutoGenerate && autoTimer) {
                clearTimeout(autoTimer);
                autoTimer = null;
            }

            isGenerating = true;
            btn.disabled = true;
            btn.classList.add('is-loading');

            resetDigits();
            await new Promise(resolve => setTimeout(resolve, 200));

            const numStr = generateRandom10Digit();
            window.__currentNumber = numStr;
            await revealNumber(numStr);

            // ---- 揭示完成，更新上次完整数字并保存 ----
            lastCompletedNumber = numStr;
            saveLastNumber(numStr);

            // ---- 卡片入场动画 ----
            card.classList.remove('card-enter');
            void card.offsetWidth;
            card.classList.add('card-enter');

            if (window.Badges && typeof window.Badges.checkAndAwardBadges === 'function') {
                window.Badges.checkAndAwardBadges(numStr);
                const best = window.Badges.getBest();
                if (window.onBestChange) window.onBestChange(best);
                updateFilterButton();
                updateBadgeProgress();
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

            if (isAutoGenerate) {
                autoTimer = setTimeout(() => {
                    handleGenerate();
                }, 2000);
            }
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
                    lastCompletedNumber = '';
                    isShowingBest = false;
                    savedCurrentNumber = '';
                    localStorage.removeItem(LAST_NUMBER_KEY);
                    const best = window.Badges.getBest();
                    if (window.onBestChange) window.onBestChange(best);
                    updateFilterButton();
                    updateBadgeProgress();
                }
            });
        }

        // ---------- 复制分享功能 ----------
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                let numberStr;
                if (isShowingBest) {
                    const best = window.Badges.getBest();
                    numberStr = best.number || '';
                } else if (isGenerating) {
                    numberStr = lastCompletedNumber;
                } else {
                    numberStr = window.__currentNumber || '';
                }

                if (!numberStr) {
                    showToast('请先生成一个数字！');
                    return;
                }

                const badges = window.Badges.getBadgesForNumber ? window.Badges.getBadgesForNumber(numberStr) : [];
                const totalScore = badges.reduce((sum, b) => sum + b.score, 0);

                let text = `🎲 HYPERNGdle\n数字：${numberStr}\n`;
                    badges.forEach(b => {
                        text += `（${b.rarity}） ${b.emoji} ${b.name} +${b.score.toLocaleString()} TP\n`;
                    });
                text += `\n本数字总 TP：${totalScore.toLocaleString()}`;
                const badgeCount = window.Badges.getBadgesForNumber(numberStr).length;
                const totalBadgeTypes = window.Badges.getTotalBadgeTypes();
                text += `\n当前徽章数：${badgeCount}/${totalBadgeTypes}`;
                text += `\n\n🔗 在 HYPERNGdle 试试你的运气：https://txgeer.github.io/TPeT/HYPERNGdle`;

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

        // ---------- Toast 提示 ----------
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

        // ============================================================
        // ===== 长按切换历史最佳 =====
        // ============================================================
        let longPressTimer = null;

        function handleLongPress() {
            // 检查自动抽取
            if (isAutoGenerate) {
                showToast('请先关闭自动抽取！');
                return;
            }

            // 检查是否正在生成
            if (isGenerating) {
                showToast('请先生成一个数字！');
                return;
            }

            const best = window.Badges.getBest();
            if (!best.number) {
                showToast('请先生成一个数字！');
                return;
            }

            if (isShowingBest) {
                // 切回当前数字
                if (savedCurrentNumber) {
                    displayNumberOnly(savedCurrentNumber);
                    isShowingBest = false;
                    savedCurrentNumber = '';
                } else {
                    showToast('没有可恢复的数字');
                }
            } else {
                // 保存当前数字并切换到历史最佳
                const currentNum = window.__currentNumber || '';
                if (!currentNum) {
                    showToast('请先生成一个数字！');
                    return;
                }
                savedCurrentNumber = currentNum;
                displayNumberOnly(best.number);
                isShowingBest = true;
            }
        }

        function handlePointerDown(e) {
            if (e.button !== 0) return; // 只响应左键
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            longPressTimer = setTimeout(() => {
                longPressTimer = null;
                handleLongPress();
            }, LONG_PRESS_DELAY);
        }

        function handlePointerUp(e) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }

        function handlePointerLeave(e) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }

        if (bestRecord) {
            bestRecord.addEventListener('pointerdown', handlePointerDown);
            bestRecord.addEventListener('pointerup', handlePointerUp);
            bestRecord.addEventListener('pointerleave', handlePointerLeave);
        }

        // ============================================================
        // ===== 初始化：尝试恢复上次的数字 =====
        // ============================================================
        const savedNumber = getLastNumber();

        if (savedNumber && savedNumber.length > 0) {
            displaySavedNumber(savedNumber);
            if (window.onBestChange) {
                const best = window.Badges.getBest();
                window.onBestChange(best);
            }
            if (window.onTotalGenerationsChange) {
                window.onTotalGenerationsChange(window.Badges.getTotalGenerations());
            }
        } else {
            resetDigits();
            setTimeout(handleGenerate, 1000);
        }
        initCard3D();
        
    });
})();