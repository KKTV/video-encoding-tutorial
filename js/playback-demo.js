/**
 * 視頻編碼教學網站
 * 快速播放演示腳本
 */

// 等待DOM加載完成
document.addEventListener('DOMContentLoaded', initPlaybackDemo);

function initPlaybackDemo() {
    // 獲取DOM元素
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const originalFrames = document.getElementById('original-frames');
    const playedFrames = document.getElementById('played-frames');
    const currentFps = document.getElementById('current-fps');
    const frameRatio = document.getElementById('frame-ratio');
    const skippedFrames = document.getElementById('skipped-frames');

    // 演示配置
    const config = {
        totalFrames: 30,      // 總幀數
        baseFps: 30,         // 基礎幀率
        frameTypes: ['I', 'P', 'B', 'B', 'P', 'B', 'B', 'P', 'B', 'B', 'P', 'B', 'B', 'P', 'B'],  // GOP結構
        isPlaying: false,    // 播放狀態
        currentSpeed: 1.0,   // 當前速度
        frameCounter: 0,     // 幀計數器
        skippedCounter: 0,   // 跳過的幀計數
        animationId: null    // 動畫ID
    };

    // 初始化演示
    function initializeDemo() {
        // 清空幀容器
        originalFrames.innerHTML = '';
        playedFrames.innerHTML = '';
        
        // 創建原始幀序列
        for (let i = 0; i < config.totalFrames; i++) {
            const frame = createFrameElement(i);
            originalFrames.appendChild(frame);
        }

        // 創建播放幀序列（初始時與原始幀相同）
        for (let i = 0; i < config.totalFrames; i++) {
            const frame = createFrameElement(i);
            frame.classList.add('skipped'); // 初始時所有幀都是跳過狀態
            playedFrames.appendChild(frame);
        }

        updateInfo();
    }

    // 創建幀元素
    function createFrameElement(index) {
        const frame = document.createElement('div');
        frame.className = 'frame';
        frame.dataset.index = index;
        
        // 根據GOP結構設置幀類型
        const frameType = config.frameTypes[index % config.frameTypes.length];
        frame.classList.add(`${frameType.toLowerCase()}-frame`);
        frame.textContent = `${frameType}${index}`;
        
        return frame;
    }

    // 更新信息顯示
    function updateInfo() {
        const currentFpsValue = Math.round(config.baseFps * config.currentSpeed);
        const displayedFrames = Math.round(config.totalFrames / config.currentSpeed);
        const ratioValue = Math.round((displayedFrames / config.totalFrames) * 100);
        
        currentFps.textContent = `${currentFpsValue} fps`;
        frameRatio.textContent = `${ratioValue}%`;
        skippedFrames.textContent = config.skippedCounter;
    }

    // 動畫循環
    function animate() {
        if (!config.isPlaying) return;

        const now = performance.now();
        const frameInterval = 1000 / (config.baseFps * config.currentSpeed);
        
        // 更新幀顯示
        const playedFrameElements = playedFrames.children;
        const frameIndex = Math.floor(config.frameCounter % config.totalFrames);
        
        // 決定是否顯示當前幀
        const shouldShowFrame = decideFrameDisplay(frameIndex);
        
        if (shouldShowFrame) {
            playedFrameElements[frameIndex].classList.remove('skipped');
            playedFrameElements[frameIndex].classList.add('frame-keep');
        } else {
            playedFrameElements[frameIndex].classList.add('skipped');
            playedFrameElements[frameIndex].classList.add('frame-skip');
            config.skippedCounter++;
        }

        // 更新計數器和信息
        config.frameCounter++;
        updateInfo();

        // 循環動畫
        config.animationId = requestAnimationFrame(animate);
    }

    // 決定是否顯示特定幀
    function decideFrameDisplay(frameIndex) {
        // 在高速播放時優先顯示I幀
        const frameType = config.frameTypes[frameIndex % config.frameTypes.length];
        
        if (config.currentSpeed <= 1.0) {
            return true;
        } else if (config.currentSpeed <= 2.0) {
            // 2倍速時顯示I幀和P幀
            return frameType === 'I' || frameType === 'P';
        } else {
            // 更高速度時只顯示I幀
            return frameType === 'I';
        }
    }

    // 重置演示
    function resetDemo() {
        config.isPlaying = false;
        config.frameCounter = 0;
        config.skippedCounter = 0;
        
        if (config.animationId) {
            cancelAnimationFrame(config.animationId);
        }

        // 重置所有幀的狀態
        const frames = playedFrames.children;
        for (let frame of frames) {
            frame.classList.add('skipped');
            frame.classList.remove('frame-keep', 'frame-skip');
        }

        updateInfo();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    // 事件監聽器
    speedSlider.addEventListener('input', (e) => {
        config.currentSpeed = parseFloat(e.target.value);
        speedValue.textContent = `${config.currentSpeed.toFixed(1)}x`;
        updateInfo();
    });

    playBtn.addEventListener('click', () => {
        config.isPlaying = true;
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        animate();
    });

    pauseBtn.addEventListener('click', () => {
        config.isPlaying = false;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        if (config.animationId) {
            cancelAnimationFrame(config.animationId);
        }
    });

    resetBtn.addEventListener('click', resetDemo);

    // 初始化演示
    initializeDemo();
    pauseBtn.disabled = true; // 初始時暫停按鈕不可用

    // 添加串流效果
    let streamInterval;
    function startStreaming() {
        let currentFrame = 0;
        streamInterval = setInterval(() => {
            if (!config.isPlaying) {
                const frames = originalFrames.children;
                frames[currentFrame % frames.length].classList.add('fade-in');
                currentFrame++;
            }
        }, 1000 / config.baseFps);
    }

    // 開始串流效果
    startStreaming();

    // 頁面卸載時清理
    window.addEventListener('unload', () => {
        if (streamInterval) {
            clearInterval(streamInterval);
        }
        if (config.animationId) {
            cancelAnimationFrame(config.animationId);
        }
    });
}