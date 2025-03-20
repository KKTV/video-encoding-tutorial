/**
 * 視頻編碼教學網站
 * 卡頓現象演示腳本
 */

// 等待DOM加載完成
document.addEventListener('DOMContentLoaded', initStutterDemo);

function initStutterDemo() {
    // 獲取DOM元素
    const speedSlider = document.getElementById('stutter-speed-slider');
    const speedValue = document.getElementById('stutter-speed-value');
    const smoothPlayback = document.getElementById('smooth-playback');
    const stutteringPlayback = document.getElementById('stuttering-playback');
    const decodeTimeBar = document.getElementById('decode-time-bar');
    const frameIntervalBar = document.getElementById('frame-interval-bar');
    const stutterIndex = document.getElementById('stutter-index');

    // 演示配置
    const config = {
        baseSpeed: 1.0,        // 基礎速度
        currentSpeed: 1.0,     // 當前速度
        smoothAnimationId: null,    // 流暢播放動畫ID
        stutterAnimationId: null,   // 卡頓播放動畫ID
        decodeTimeRatio: 0.5,       // 解碼時間比例（相對於幀間隔）
        stutterProbability: 0.2,    // 卡頓概率
        stutterSeverity: 1.5,       // 卡頓嚴重程度
        frameCount: 0               // 幀計數
    };

    // 初始化演示
    function initializeDemo() {
        // 創建播放對象
        createPlaybackObjects();
        
        // 開始動畫
        startAnimations();
        
        // 更新性能指標
        updatePerformanceMetrics();
    }

    // 創建播放對象
    function createPlaybackObjects() {
        // 流暢播放對象
        const smoothObject = document.createElement('div');
        smoothObject.className = 'playback-object';
        smoothObject.style.left = '0px';
        smoothPlayback.appendChild(smoothObject);
        
        // 卡頓播放對象
        const stutterObject = document.createElement('div');
        stutterObject.className = 'playback-object';
        stutterObject.style.left = '0px';
        stutteringPlayback.appendChild(stutterObject);
    }

    // 開始動畫
    function startAnimations() {
        // 停止現有動畫
        if (config.smoothAnimationId) {
            cancelAnimationFrame(config.smoothAnimationId);
        }
        if (config.stutterAnimationId) {
            cancelAnimationFrame(config.stutterAnimationId);
        }
        
        // 重置位置
        const smoothObject = smoothPlayback.querySelector('.playback-object');
        const stutterObject = stutteringPlayback.querySelector('.playback-object');
        
        if (smoothObject) smoothObject.style.left = '0px';
        if (stutterObject) stutterObject.style.left = '0px';
        
        // 重置幀計數
        config.frameCount = 0;
        
        // 開始流暢播放動畫
        animateSmooth();
        
        // 開始卡頓播放動畫
        animateStuttering();
    }

    // 流暢播放動畫
    function animateSmooth() {
        const object = smoothPlayback.querySelector('.playback-object');
        if (!object) return;
        
        const containerWidth = smoothPlayback.clientWidth;
        const objectWidth = object.clientWidth;
        const maxX = containerWidth - objectWidth;
        
        // 計算當前位置
        let currentX = parseInt(object.style.left) || 0;
        currentX += config.currentSpeed * 2;
        
        // 循環播放
        if (currentX > maxX) {
            currentX = 0;
        }
        
        // 更新位置
        object.style.left = `${currentX}px`;
        
        // 繼續動畫
        config.smoothAnimationId = requestAnimationFrame(animateSmooth);
    }

    // 卡頓播放動畫
    function animateStuttering() {
        const object = stutteringPlayback.querySelector('.playback-object');
        if (!object) return;
        
        const containerWidth = stutteringPlayback.clientWidth;
        const objectWidth = object.clientWidth;
        const maxX = containerWidth - objectWidth;
        
        // 計算當前位置
        let currentX = parseInt(object.style.left) || 0;
        
        // 模擬卡頓
        const shouldStutter = Math.random() < (config.stutterProbability * config.currentSpeed);
        
        if (shouldStutter) {
            // 卡頓效果 - 暫停一段時間
            setTimeout(() => {
                // 卡頓後的跳躍
                currentX += config.currentSpeed * config.stutterSeverity * 4;
                
                // 循環播放
                if (currentX > maxX) {
                    currentX = 0;
                }
                
                // 更新位置
                object.style.left = `${currentX}px`;
                
                // 添加視覺效果
                object.classList.add('stutter');
                setTimeout(() => {
                    object.classList.remove('stutter');
                }, 300);
                
                // 繼續動畫
                config.stutterAnimationId = requestAnimationFrame(animateStuttering);
            }, 300 * config.currentSpeed);
        } else {
            // 正常移動
            currentX += config.currentSpeed * 2;
            
            // 循環播放
            if (currentX > maxX) {
                currentX = 0;
            }
            
            // 更新位置
            object.style.left = `${currentX}px`;
            
            // 繼續動畫
            config.stutterAnimationId = requestAnimationFrame(animateStuttering);
        }
        
        // 更新幀計數和性能指標
        config.frameCount++;
        if (config.frameCount % 10 === 0) {
            updatePerformanceMetrics();
        }
    }

    // 更新性能指標
    function updatePerformanceMetrics() {
        // 計算解碼時間比例
        const decodeTime = config.decodeTimeRatio * config.currentSpeed;
        const decodeTimePercentage = Math.min(decodeTime * 100, 100);
        
        // 計算幀間隔
        const frameInterval = 1 / config.currentSpeed;
        const frameIntervalPercentage = Math.min(frameInterval * 50, 100);
        
        // 計算卡頓指數
        const stutterPercentage = Math.min(
            Math.round(config.stutterProbability * config.currentSpeed * config.stutterSeverity * 100),
            100
        );
        
        // 更新UI
        decodeTimeBar.style.width = `${decodeTimePercentage}%`;
        frameIntervalBar.style.width = `${frameIntervalPercentage}%`;
        stutterIndex.textContent = `${stutterPercentage}%`;
        
        // 根據卡頓指數設置顏色
        if (stutterPercentage < 30) {
            stutterIndex.style.color = '#2ecc71'; // 綠色
        } else if (stutterPercentage < 70) {
            stutterIndex.style.color = '#f39c12'; // 橙色
        } else {
            stutterIndex.style.color = '#e74c3c'; // 紅色
        }
        
        // 根據解碼時間設置顏色
        if (decodeTimePercentage < 50) {
            decodeTimeBar.style.backgroundColor = '#2ecc71'; // 綠色
        } else if (decodeTimePercentage < 80) {
            decodeTimeBar.style.backgroundColor = '#f39c12'; // 橙色
        } else {
            decodeTimeBar.style.backgroundColor = '#e74c3c'; // 紅色
        }
    }

    // 事件監聽器
    speedSlider.addEventListener('input', (e) => {
        config.currentSpeed = parseFloat(e.target.value);
        speedValue.textContent = `${config.currentSpeed.toFixed(1)}x`;
        
        // 更新卡頓參數
        config.stutterProbability = 0.2 * (config.currentSpeed / config.baseSpeed);
        config.decodeTimeRatio = 0.5 * (config.currentSpeed / config.baseSpeed);
        
        // 更新性能指標
        updatePerformanceMetrics();
    });

    // 初始化演示
    initializeDemo();

    // 頁面卸載時清理
    window.addEventListener('unload', () => {
        if (config.smoothAnimationId) {
            cancelAnimationFrame(config.smoothAnimationId);
        }
        if (config.stutterAnimationId) {
            cancelAnimationFrame(config.stutterAnimationId);
        }
    });
}