let game = null;

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.message);
    alert('加载错误: ' + e.message + '\n请确保所有文件都已正确加载。\n\n建议使用 HTTP 服务器访问：http://localhost:8080');
});

window.addEventListener('load', () => {
    try {
        console.log('🎮 开始加载游戏...');
        
        if (typeof Game === 'undefined') {
            throw new Error('Game 类未定义，请检查 game.js 是否正确加载');
        }
        
        game = new Game('gameCanvas');
        console.log('✅ 游戏初始化成功');
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
            console.log('✅ 语音合成 API 可用');
        } else {
            console.warn('⚠️ 语音合成 API 不可用，发音功能将禁用');
        }
        
        console.log('🎉 游戏加载完成！点击"开始上学之旅"按钮开始游戏');
        
    } catch (error) {
        console.error('❌ 游戏加载失败:', error);
        alert('游戏加载失败: ' + error.message + '\n\n请尝试：\n1. 刷新页面\n2. 使用 HTTP 服务器访问：http://localhost:8080\n3. 检查浏览器控制台查看详细错误');
    }
});

window.addEventListener('beforeunload', () => {
    if (game && typeof audioManager !== 'undefined') {
        audioManager.stopMusic();
    }
});
