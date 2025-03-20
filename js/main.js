/**
 * 視頻編碼教學網站
 * 主要JavaScript文件
 */

// 等待DOM完全加載
document.addEventListener('DOMContentLoaded', function() {
    // 初始化導航欄高亮
    initNavHighlight();
    
    // 初始化滾動動畫
    initScrollAnimations();
    
    // 初始化頁面特定功能
    initPageSpecificFeatures();
});

/**
 * 初始化導航欄高亮
 * 根據當前頁面URL設置相應的導航項為活動狀態
 */
function initNavHighlight() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // 移除所有活動狀態
        link.classList.remove('active');
        
        // 獲取鏈接的href屬性
        const href = link.getAttribute('href');
        
        // 檢查是否是當前頁面
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (href.includes(currentPage) && currentPage !== 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * 初始化滾動動畫
 * 當元素進入視口時添加動畫類
 */
function initScrollAnimations() {
    // 獲取所有需要動畫的元素
    const animatedElements = document.querySelectorAll('.card, .section h2, .topic-card');
    
    // 如果支持Intersection Observer API
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    // 一旦添加了動畫，就不再觀察該元素
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // 當10%的元素可見時觸發
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // 對於不支持Intersection Observer的瀏覽器，直接添加動畫類
        animatedElements.forEach(element => {
            element.classList.add('fade-in');
        });
    }
}

/**
 * 初始化頁面特定功能
 * 根據當前頁面加載相應的功能
 */
function initPageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // 首頁特定功能
    if (currentPage === '' || currentPage === 'index.html') {
        // 首頁沒有特定的JavaScript功能需要初始化
    }
    
    // 快速播放原理頁面
    else if (currentPage === 'fast-playback.html') {
        // 檢查是否已加載相應的腳本
        if (typeof initPlaybackDemo === 'function') {
            initPlaybackDemo();
        } else {
            // 動態加載腳本
            loadScript('js/playback-demo.js', function() {
                if (typeof initPlaybackDemo === 'function') {
                    initPlaybackDemo();
                }
            });
        }
    }
    
    // 卡頓現象頁面
    else if (currentPage === 'stutter.html') {
        if (typeof initStutterDemo === 'function') {
            initStutterDemo();
        } else {
            loadScript('js/stutter-demo.js', function() {
                if (typeof initStutterDemo === 'function') {
                    initStutterDemo();
                }
            });
        }
    }
    
    // 幀類型與GOP結構頁面
    else if (currentPage === 'frame-types.html') {
        if (typeof initGopDemo === 'function') {
            initGopDemo();
        } else {
            loadScript('js/gop-demo.js', function() {
                if (typeof initGopDemo === 'function') {
                    initGopDemo();
                }
            });
        }
    }
}

/**
 * 動態加載JavaScript文件
 * @param {string} url - 腳本的URL
 * @param {Function} callback - 加載完成後的回調函數
 */
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

/**
 * 創建一個簡單的彈出提示
 * @param {string} message - 提示消息
 * @param {string} type - 提示類型 (success, error, info)
 */
function showToast(message, type = 'info') {
    // 創建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 添加到頁面
    document.body.appendChild(toast);
    
    // 顯示動畫
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自動隱藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * 添加toast樣式
 */
(function addToastStyles() {
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 20px;
                border-radius: 4px;
                color: white;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .toast.show {
                opacity: 1;
            }
            .toast-success {
                background-color: #2ecc71;
            }
            .toast-error {
                background-color: #e74c3c;
            }
            .toast-info {
                background-color: #3498db;
            }
        `;
        document.head.appendChild(style);
    }
})();

/**
 * 平滑滾動到頁面元素
 * @param {string} elementId - 目標元素的ID
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 為所有帶有data-scroll屬性的鏈接添加平滑滾動功能
document.addEventListener('click', function(event) {
    if (event.target.hasAttribute('data-scroll')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        scrollToElement(targetId);
    }
});