/**
 * 視頻編碼教學網站
 * GOP結構演示腳本
 */

// 等待DOM加載完成
document.addEventListener('DOMContentLoaded', initGopDemo);

function initGopDemo() {
    // 獲取DOM元素
    const gopContainer = document.getElementById('gop-container');
    const frameInfo = document.getElementById('frame-info');
    const gopSimpleBtn = document.getElementById('gop-simple');
    const gopComplexBtn = document.getElementById('gop-complex');
    const gopHierarchicalBtn = document.getElementById('gop-hierarchical');

    // GOP結構定義
    const gopStructures = {
        simple: [
            { type: 'I', index: 0, dependencies: [] },
            { type: 'P', index: 1, dependencies: [0] },
            { type: 'P', index: 2, dependencies: [1] },
            { type: 'P', index: 3, dependencies: [2] },
            { type: 'P', index: 4, dependencies: [3] },
            { type: 'P', index: 5, dependencies: [4] },
            { type: 'P', index: 6, dependencies: [5] },
            { type: 'P', index: 7, dependencies: [6] },
            { type: 'I', index: 8, dependencies: [] }
        ],
        complex: [
            { type: 'I', index: 0, dependencies: [] },
            { type: 'B', index: 1, dependencies: [0, 4] },
            { type: 'B', index: 2, dependencies: [0, 4] },
            { type: 'B', index: 3, dependencies: [0, 4] },
            { type: 'P', index: 4, dependencies: [0] },
            { type: 'B', index: 5, dependencies: [4, 8] },
            { type: 'B', index: 6, dependencies: [4, 8] },
            { type: 'B', index: 7, dependencies: [4, 8] },
            { type: 'P', index: 8, dependencies: [4] },
            { type: 'I', index: 9, dependencies: [] }
        ],
        hierarchical: [
            { type: 'I', index: 0, dependencies: [] },
            { type: 'B', index: 1, dependencies: [0, 8], level: 1 },
            { type: 'B', index: 2, dependencies: [0, 4], level: 2 },
            { type: 'B', index: 3, dependencies: [2, 4], level: 3 },
            { type: 'P', index: 4, dependencies: [0], level: 0 },
            { type: 'B', index: 5, dependencies: [4, 8], level: 2 },
            { type: 'B', index: 6, dependencies: [5, 8], level: 3 },
            { type: 'B', index: 7, dependencies: [5, 8], level: 3 },
            { type: 'P', index: 8, dependencies: [4], level: 0 },
            { type: 'I', index: 9, dependencies: [], level: 0 }
        ]
    };

    // 當前選中的GOP結構
    let currentGopStructure = 'simple';
    // 當前選中的幀
    let selectedFrameIndex = null;
    // 依賴線元素
    let dependencyLines = [];

    // 初始化演示
    function initializeDemo() {
        // 顯示默認GOP結構
        renderGopStructure(currentGopStructure);
        
        // 設置按鈕事件
        gopSimpleBtn.addEventListener('click', () => {
            currentGopStructure = 'simple';
            renderGopStructure(currentGopStructure);
        });
        
        gopComplexBtn.addEventListener('click', () => {
            currentGopStructure = 'complex';
            renderGopStructure(currentGopStructure);
        });
        
        gopHierarchicalBtn.addEventListener('click', () => {
            currentGopStructure = 'hierarchical';
            renderGopStructure(currentGopStructure);
        });
    }

    // 渲染GOP結構
    function renderGopStructure(structureKey) {
        // 清空容器
        gopContainer.innerHTML = '';
        frameInfo.innerHTML = '<h4>幀信息</h4><p>點擊上方的幀查看詳細信息</p>';
        
        // 清除依賴線
        clearDependencyLines();
        
        // 獲取GOP結構
        const structure = gopStructures[structureKey];
        
        // 創建幀元素
        structure.forEach(frame => {
            const frameElement = document.createElement('div');
            frameElement.className = `gop-frame ${frame.type.toLowerCase()}-frame`;
            frameElement.dataset.index = frame.index;
            frameElement.dataset.type = frame.type;
            frameElement.textContent = `${frame.type}${frame.index}`;
            
            // 如果是層次結構，添加層次信息
            if (frame.hasOwnProperty('level')) {
                frameElement.dataset.level = frame.level;
                // 根據層次調整透明度
                const opacity = 1 - (frame.level * 0.2);
                frameElement.style.opacity = Math.max(opacity, 0.5);
            }
            
            // 點擊事件
            frameElement.addEventListener('click', () => {
                selectFrame(frame.index);
            });
            
            gopContainer.appendChild(frameElement);
        });
        
        // 重置選中狀態
        selectedFrameIndex = null;
    }

    // 選中幀
    function selectFrame(index) {
        // 清除之前的選中狀態
        const frames = gopContainer.querySelectorAll('.gop-frame');
        frames.forEach(frame => {
            frame.classList.remove('selected');
        });
        
        // 清除依賴線
        clearDependencyLines();
        
        // 如果點擊的是已選中的幀，則取消選中
        if (selectedFrameIndex === index) {
            selectedFrameIndex = null;
            frameInfo.innerHTML = '<h4>幀信息</h4><p>點擊上方的幀查看詳細信息</p>';
            return;
        }
        
        // 設置新的選中狀態
        selectedFrameIndex = index;
        const selectedFrame = gopContainer.querySelector(`.gop-frame[data-index="${index}"]`);
        if (selectedFrame) {
            selectedFrame.classList.add('selected');
        }
        
        // 顯示幀信息
        showFrameInfo(index);
        
        // 顯示依賴關係
        showDependencies(index);
    }

    // 顯示幀信息
    function showFrameInfo(index) {
        const structure = gopStructures[currentGopStructure];
        const frame = structure.find(f => f.index === index);
        
        if (!frame) return;
        
        let infoHtml = `
            <h4>${frame.type}幀 (索引: ${frame.index})</h4>
            <p><strong>類型:</strong> ${getFrameTypeName(frame.type)}</p>
        `;
        
        if (frame.dependencies.length > 0) {
            infoHtml += `<p><strong>依賴幀:</strong> `;
            frame.dependencies.forEach((depIndex, i) => {
                const depFrame = structure.find(f => f.index === depIndex);
                infoHtml += `${depFrame.type}${depIndex}${i < frame.dependencies.length - 1 ? ', ' : ''}`;
            });
            infoHtml += `</p>`;
        } else {
            infoHtml += `<p><strong>依賴幀:</strong> 無 (獨立幀)</p>`;
        }
        
        if (frame.hasOwnProperty('level')) {
            infoHtml += `<p><strong>層次:</strong> ${frame.level}</p>`;
        }
        
        infoHtml += `<p><strong>特性:</strong> `;
        switch (frame.type) {
            case 'I':
                infoHtml += `完全獨立編碼，不依賴其他幀，提供隨機訪問點，文件大小較大`;
                break;
            case 'P':
                infoHtml += `依賴前面的I幀或P幀，只存儲與參考幀的差異，文件大小中等`;
                break;
            case 'B':
                infoHtml += `依賴前面和後面的I幀或P幀，使用雙向預測，提供最高的壓縮率，文件大小最小`;
                break;
        }
        infoHtml += `</p>`;
        
        frameInfo.innerHTML = infoHtml;
    }

    // 獲取幀類型全名
    function getFrameTypeName(type) {
        switch (type) {
            case 'I': return 'Intra-coded Picture (幀內編碼圖像)';
            case 'P': return 'Predicted Picture (預測圖像)';
            case 'B': return 'Bi-directional Predicted Picture (雙向預測圖像)';
            default: return type;
        }
    }

    // 顯示依賴關係
    function showDependencies(index) {
        const structure = gopStructures[currentGopStructure];
        const frame = structure.find(f => f.index === index);
        
        if (!frame) return;
        
        const frames = gopContainer.querySelectorAll('.gop-frame');
        const selectedFrame = gopContainer.querySelector(`.gop-frame[data-index="${index}"]`);
        
        // 顯示此幀依賴的幀
        if (frame.dependencies.length > 0) {
            frame.dependencies.forEach(depIndex => {
                const depFrame = gopContainer.querySelector(`.gop-frame[data-index="${depIndex}"]`);
                if (depFrame) {
                    // 高亮依賴幀
                    depFrame.classList.add('dependency');
                    
                    // 創建依賴線
                    createDependencyLine(depFrame, selectedFrame, 'depends-on');
                }
            });
        }
        
        // 顯示依賴此幀的幀
        structure.forEach(otherFrame => {
            if (otherFrame.dependencies.includes(index)) {
                const otherFrameElement = gopContainer.querySelector(`.gop-frame[data-index="${otherFrame.index}"]`);
                if (otherFrameElement) {
                    // 高亮被依賴幀
                    otherFrameElement.classList.add('dependent');
                    
                    // 創建依賴線
                    createDependencyLine(selectedFrame, otherFrameElement, 'depended-by');
                }
            }
        });
    }

    // 創建依賴線
    function createDependencyLine(fromElement, toElement, type) {
        // 獲取元素位置
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const containerRect = gopContainer.getBoundingClientRect();
        
        // 計算線的起點和終點（相對於容器）
        const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
        const toX = toRect.left + toRect.width / 2 - containerRect.left;
        const toY = toRect.top + toRect.height / 2 - containerRect.top;
        
        // 計算線的長度和角度
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        // 創建線元素
        const line = document.createElement('div');
        line.className = `frame-dependency ${type}`;
        line.style.width = `${length}px`;
        line.style.left = `${fromX}px`;
        line.style.top = `${fromY}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        // 根據類型設置顏色
        if (type === 'depends-on') {
            line.style.backgroundColor = 'rgba(231, 76, 60, 0.7)'; // 紅色
        } else {
            line.style.backgroundColor = 'rgba(46, 204, 113, 0.7)'; // 綠色
        }
        
        // 添加到容器
        gopContainer.appendChild(line);
        
        // 保存線元素引用，以便後續清除
        dependencyLines.push(line);
    }

    // 清除依賴線
    function clearDependencyLines() {
        // 移除所有依賴線元素
        dependencyLines.forEach(line => {
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        });
        
        // 清空數組
        dependencyLines = [];
        
        // 清除幀的高亮狀態
        const frames = gopContainer.querySelectorAll('.gop-frame');
        frames.forEach(frame => {
            frame.classList.remove('dependency', 'dependent');
        });
    }

    // 初始化演示
    initializeDemo();

    // 添加樣式
    addStyles();

    // 添加額外樣式
    function addStyles() {
        if (!document.getElementById('gop-demo-styles')) {
            const style = document.createElement('style');
            style.id = 'gop-demo-styles';
            style.textContent = `
                .gop-frame.selected {
                    transform: scale(1.2);
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                    z-index: 20;
                }
                
                .gop-frame.dependency {
                    border: 3px solid rgba(231, 76, 60, 0.7);
                }
                
                .gop-frame.dependent {
                    border: 3px solid rgba(46, 204, 113, 0.7);
                }
            `;
            document.head.appendChild(style);
        }
    }
}