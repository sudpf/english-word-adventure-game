# English Word Adventure - 英语单词冒险 🎮

一个结合了超级马里奥玩法的英语单词学习游戏！通过收集带字母的金币来学习英语单词。

## 游戏特色 ✨

- 🎯 **教育性**: 通过游戏学习英语单词，寓教于乐
- 🎮 **经典玩法**: 基于超级马里奥的平台跳跃游戏机制
- 🔤 **单词学习**: 收集带字母的金币组成完整单词
- 🔊 **发音功能**: 使用 Web Speech API 实现单词和字母发音
- 📚 **分级难度**: 单词按难度分级，逐步提升
- 🎨 **精美画面**: Canvas 2D 绘制的精美游戏画面
- ✨ **粒子效果**: 收集金币时的炫酷粒子特效

## 游戏玩法 🕹️

### 控制方式
- **移动**: `←` `→` 方向键 或 `A` `D` 键
- **跳跃**: `↑` 方向键 或 `W` 键 或 `空格键`
- **暂停**: `ESC` 键

### 游戏目标
1. 控制角色在平台间跳跃
2. 收集带字母的金币
3. 按顺序收集完整单词的所有字母
4. 完成单词后会显示单词含义并朗读
5. 获得分数奖励，学习新单词

### 计分规则
- 收集单个金币: **+10 分**
- 完成完整单词: **+50 分**
- 完成关卡: **+100 分**

## 游戏功能 📋

### 1. 玩家系统
- 流畅的移动和跳跃控制
- 重力物理系统
- 平台碰撞检测
- 角色动画效果

### 2. 金币系统
- 每个金币带有一个字母
- 金币浮动动画
- 收集时的粒子特效
- 字母发音功能

### 3. 单词系统
- 24 个预设单词
- 3 个难度等级
- 单词含义显示
- 完整单词发音
- 学习进度追踪

### 4. 关卡系统
- 多层平台设计
- 自动生成新关卡
- 渐进式难度提升
- 背景装饰（云朵、树木）

### 5. 音效系统
- 跳跃音效
- 收集金币音效
- 单词发音（Web Speech API）
- 字母发音

### 6. UI 界面
- 开始菜单
- 游戏暂停界面
- 分数和金币显示
- 单词弹窗展示
- 游戏结束统计

## 技术栈 🛠️

- **前端**: HTML5 Canvas + JavaScript
- **音频**: Web Audio API + Web Speech API
- **样式**: CSS3
- **架构**: 面向对象设计

## 项目结构 📁

```
english-word-adventure-game/
├── index.html              # 游戏主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── main.js            # 游戏入口
│   ├── game.js            # 游戏主逻辑
│   ├── player.js          # 玩家类
│   ├── coin.js            # 金币类
│   ├── platform.js        # 平台类
│   ├── level.js           # 关卡类
│   ├── wordManager.js     # 单词管理器
│   ├── audio.js           # 音频管理器
│   └── utils.js           # 工具函数
└── assets/
    ├── images/            # 图片资源
    └── audio/             # 音频资源
```

## 🌐 线上部署 (推荐)

本项目是一个纯前端静态项目，由于目前 Gitee Pages 服务可能对部分用户不可用，推荐使用以下两种免费且稳定的方式进行部署：

### 方法一：使用 Vercel 部署（最简单、速度快）
1. 访问 [Vercel 官网](https://vercel.com/) 并注册一个账号（可以使用 GitHub/GitLab 账号登录）。
2. 在控制台点击 **"Add New..."** -> **"Project"**。
3. 选择底部的 **"Import Third-Party Git Repository"**。
4. 将你的 Gitee 仓库地址（例如 `https://gitee.com/你的用户名/english-word-adventure-game`）粘贴进去，点击 Continue。
5. 保持默认设置，点击 **"Deploy"**。
6. 等待几十秒，Vercel 就会为你生成一个免费的访问链接（类似 `https://xxx.vercel.app`）。

### 方法二：使用 GitHub Pages（经典方案）
1. 将代码推送到 GitHub（创建一个新仓库）。
2. 在 GitHub 仓库页面，点击 **"Settings"**（设置）。
3. 在左侧菜单找到 **"Pages"**。
4. 在 "Build and deployment" 下的 "Source" 选择 **"Deploy from a branch"**。
5. 在 "Branch" 下拉菜单选择 `main`（或 `master`），然后点击 **"Save"**。
6. 等待 1-2 分钟，页面顶部会显示 "Your site is live at https://xxx.github.io/xxx/"，点击即可游玩！

## 本地运行 🚀

### 方法 1: Python HTTP 服务器（推荐）
```bash
cd english-word-adventure-game
python3 -m http.server 8080
```
然后访问: http://localhost:8080

**优点**：
- ✅ 所有功能正常工作
- ✅ 语音合成 API 可用
- ✅ 无浏览器限制
- ✅ 最佳性能

### 方法 2: Node.js HTTP 服务器
```bash
npx http-server english-word-adventure-game -p 8080
```

### 方法 3: 直接打开文件（有限制）

**步骤**：
1. 在浏览器中直接打开 `index.html` 文件
2. 如果游戏无法运行，请查看浏览器控制台（按 F12）的错误信息

**注意事项**：
- ⚠️ **Chrome 浏览器**：可能有 CORS 限制，建议使用 HTTP 服务器
- ⚠️ **Firefox 浏览器**：支持较好，大部分功能可用
- ⚠️ **Safari 浏览器**：部分功能可能受限
- ⚠️ **语音功能**：Web Speech API 在 `file://` 协议下可能不可用

**如果直接打开无法运行**：
1. 检查浏览器控制台（F12）是否有错误
2. 尝试使用 Firefox 浏览器
3. 或使用 HTTP 服务器（推荐）

### 方法 4: 使用 VS Code Live Server
如果你使用 VS Code：
1. 安装 "Live Server" 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 浏览器兼容性 🌐

- ✅ Chrome (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ 需要支持 Web Speech API 的浏览器

## 单词列表 📖

### 难度 1 (初级)
- CAT (猫), DOG (狗), SUN (太阳), MOON (月亮)
- STAR (星星), TREE (树), BIRD (鸟), FISH (鱼)
- BOOK (书), BALL (球)

### 难度 2 (中级)
- APPLE (苹果), HOUSE (房子), WATER (水)
- HAPPY (快乐的), SMILE (微笑), DREAM (梦想)
- LIGHT (光), MUSIC (音乐)

### 难度 3 (高级)
- FLOWER (花), RAINBOW (彩虹), BUTTERFLY (蝴蝶)
- ADVENTURE (冒险), BEAUTIFUL (美丽的), WONDERFUL (精彩的)

## 游戏截图 📸

游戏包含以下场景：
- 🏠 开始菜单
- 🎮 游戏主界面
- 🔤 单词展示弹窗
- ⏸️ 暂停界面
- 🏆 游戏结束统计

## 未来改进 🎯

- [ ] 添加更多单词库
- [ ] 实现敌人系统
- [ ] 添加道具系统
- [ ] 支持移动端触控
- [ ] 添加背景音乐
- [ ] 实现存档功能
- [ ] 添加排行榜
- [ ] 支持多语言

## 教育价值 🎓

这款游戏特别适合：
- 英语初学者
- 儿童英语教育
- 单词记忆训练
- 寓教于乐的学习方式

通过游戏化的方式，让学习英语单词变得有趣且高效！

## 许可证 📄

本项目仅用于教育和学习目的。

---

**享受学习英语的乐趣！** 🎉
