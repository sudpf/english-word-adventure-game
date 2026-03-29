class WordManager {
    constructor() {
        this.wordDatabase = [
            { word: 'CAT', meaning: '猫', difficulty: 1 },
            { word: 'DOG', meaning: '狗', difficulty: 1 },
            { word: 'SUN', meaning: '太阳', difficulty: 1 },
            { word: 'MOON', meaning: '月亮', difficulty: 1 },
            { word: 'STAR', meaning: '星星', difficulty: 1 },
            { word: 'TREE', meaning: '树', difficulty: 1 },
            { word: 'BIRD', meaning: '鸟', difficulty: 1 },
            { word: 'FISH', meaning: '鱼', difficulty: 1 },
            { word: 'BOOK', meaning: '书', difficulty: 1 },
            { word: 'BALL', meaning: '球', difficulty: 1 },
            { word: 'RED', meaning: '红色', difficulty: 1 },
            { word: 'BLUE', meaning: '蓝色', difficulty: 1 },
            { word: 'BIG', meaning: '大的', difficulty: 1 },
            { word: 'CUP', meaning: '杯子', difficulty: 1 },
            { word: 'PEN', meaning: '钢笔', difficulty: 1 },
            { word: 'BAG', meaning: '包', difficulty: 1 },
            { word: 'MAP', meaning: '地图', difficulty: 1 },
            { word: 'BUS', meaning: '公交车', difficulty: 1 },
            { word: 'CAR', meaning: '汽车', difficulty: 1 },
            { word: 'BED', meaning: '床', difficulty: 1 },
            { word: 'EGG', meaning: '鸡蛋', difficulty: 1 },
            { word: 'MILK', meaning: '牛奶', difficulty: 1 },
            { word: 'RICE', meaning: '米饭', difficulty: 1 },
            { word: 'CAKE', meaning: '蛋糕', difficulty: 1 },
            { word: 'HAND', meaning: '手', difficulty: 1 },
            { word: 'HEAD', meaning: '头', difficulty: 1 },
            { word: 'FOOT', meaning: '脚', difficulty: 1 },
            { word: 'LEG', meaning: '腿', difficulty: 1 },
            { word: 'ARM', meaning: '手臂', difficulty: 1 },
            { word: 'EYE', meaning: '眼睛', difficulty: 1 },
            { word: 'EAR', meaning: '耳朵', difficulty: 1 },
            { word: 'NOSE', meaning: '鼻子', difficulty: 1 },
            { word: 'MOUTH', meaning: '嘴巴', difficulty: 1 },
            { word: 'FACE', meaning: '脸', difficulty: 1 },
            { word: 'HAIR', meaning: '头发', difficulty: 1 },
            
            { word: 'APPLE', meaning: '苹果', difficulty: 2 },
            { word: 'HOUSE', meaning: '房子', difficulty: 2 },
            { word: 'WATER', meaning: '水', difficulty: 2 },
            { word: 'HAPPY', meaning: '快乐的', difficulty: 2 },
            { word: 'SMILE', meaning: '微笑', difficulty: 2 },
            { word: 'DREAM', meaning: '梦想', difficulty: 2 },
            { word: 'LIGHT', meaning: '光', difficulty: 2 },
            { word: 'MUSIC', meaning: '音乐', difficulty: 2 },
            { word: 'SCHOOL', meaning: '学校', difficulty: 2 },
            { word: 'FRIEND', meaning: '朋友', difficulty: 2 },
            { word: 'LEARN', meaning: '学习', difficulty: 2 },
            { word: 'PLAY', meaning: '玩', difficulty: 2 },
            { word: 'JUMP', meaning: '跳', difficulty: 2 },
            { word: 'RUN', meaning: '跑', difficulty: 2 },
            { word: 'WALK', meaning: '走', difficulty: 2 },
            { word: 'READ', meaning: '读', difficulty: 2 },
            { word: 'WRITE', meaning: '写', difficulty: 2 },
            { word: 'DRAW', meaning: '画', difficulty: 2 },
            { word: 'SING', meaning: '唱歌', difficulty: 2 },
            { word: 'DANCE', meaning: '跳舞', difficulty: 2 },
            { word: 'SWIM', meaning: '游泳', difficulty: 2 },
            { word: 'FLY', meaning: '飞', difficulty: 2 },
            { word: 'EAT', meaning: '吃', difficulty: 2 },
            { word: 'DRINK', meaning: '喝', difficulty: 2 },
            { word: 'SLEEP', meaning: '睡觉', difficulty: 2 },
            { word: 'WAKE', meaning: '醒来', difficulty: 2 },
            { word: 'OPEN', meaning: '打开', difficulty: 2 },
            { word: 'CLOSE', meaning: '关闭', difficulty: 2 },
            { word: 'START', meaning: '开始', difficulty: 2 },
            { word: 'STOP', meaning: '停止', difficulty: 2 },
            { word: 'HELLO', meaning: '你好', difficulty: 2 },
            { word: 'THANK', meaning: '谢谢', difficulty: 2 },
            { word: 'PLEASE', meaning: '请', difficulty: 2 },
            { word: 'SORRY', meaning: '对不起', difficulty: 2 },
            { word: 'GOOD', meaning: '好的', difficulty: 2 },
            { word: 'NICE', meaning: '美好的', difficulty: 2 },
            { word: 'LOVE', meaning: '爱', difficulty: 2 },
            { word: 'FAMILY', meaning: '家庭', difficulty: 2 },
            { word: 'MOTHER', meaning: '妈妈', difficulty: 2 },
            { word: 'FATHER', meaning: '爸爸', difficulty: 2 },
            { word: 'SISTER', meaning: '姐妹', difficulty: 2 },
            { word: 'BROTHER', meaning: '兄弟', difficulty: 2 },
            { word: 'TEACHER', meaning: '老师', difficulty: 2 },
            { word: 'STUDENT', meaning: '学生', difficulty: 2 },
            { word: 'CLASS', meaning: '班级', difficulty: 2 },
            { word: 'ROOM', meaning: '房间', difficulty: 2 },
            { word: 'DOOR', meaning: '门', difficulty: 2 },
            { word: 'WINDOW', meaning: '窗户', difficulty: 2 },
            { word: 'TABLE', meaning: '桌子', difficulty: 2 },
            { word: 'CHAIR', meaning: '椅子', difficulty: 2 },
            
            { word: 'FLOWER', meaning: '花', difficulty: 3 },
            { word: 'RAINBOW', meaning: '彩虹', difficulty: 3 },
            { word: 'BUTTERFLY', meaning: '蝴蝶', difficulty: 3 },
            { word: 'ADVENTURE', meaning: '冒险', difficulty: 3 },
            { word: 'BEAUTIFUL', meaning: '美丽的', difficulty: 3 },
            { word: 'WONDERFUL', meaning: '精彩的', difficulty: 3 },
            { word: 'EDUCATION', meaning: '教育', difficulty: 3 },
            { word: 'KNOWLEDGE', meaning: '知识', difficulty: 3 },
            { word: 'SCIENCE', meaning: '科学', difficulty: 3 },
            { word: 'ENGLISH', meaning: '英语', difficulty: 3 },
            { word: 'CHINESE', meaning: '中文', difficulty: 3 },
            { word: 'MATH', meaning: '数学', difficulty: 3 },
            { word: 'HISTORY', meaning: '历史', difficulty: 3 },
            { word: 'GEOGRAPHY', meaning: '地理', difficulty: 3 },
            { word: 'COMPUTER', meaning: '电脑', difficulty: 3 },
            { word: 'INTERNET', meaning: '互联网', difficulty: 3 },
            { word: 'WEATHER', meaning: '天气', difficulty: 3 },
            { word: 'SUMMER', meaning: '夏天', difficulty: 3 },
            { word: 'WINTER', meaning: '冬天', difficulty: 3 },
            { word: 'SPRING', meaning: '春天', difficulty: 3 },
            { word: 'AUTUMN', meaning: '秋天', difficulty: 3 },
            { word: 'MOUNTAIN', meaning: '山', difficulty: 3 },
            { word: 'RIVER', meaning: '河', difficulty: 3 },
            { word: 'OCEAN', meaning: '海洋', difficulty: 3 },
            { word: 'FOREST', meaning: '森林', difficulty: 3 },
            { word: 'GARDEN', meaning: '花园', difficulty: 3 },
            { word: 'LIBRARY', meaning: '图书馆', difficulty: 3 },
            { word: 'HOSPITAL', meaning: '医院', difficulty: 3 },
            { word: 'RESTAURANT', meaning: '餐厅', difficulty: 3 },
            { word: 'SUPERMARKET', meaning: '超市', difficulty: 3 },
            { word: 'AIRPORT', meaning: '机场', difficulty: 3 },
            { word: 'STATION', meaning: '车站', difficulty: 3 },
            { word: 'MUSEUM', meaning: '博物馆', difficulty: 3 },
            { word: 'HOLIDAY', meaning: '假期', difficulty: 3 },
            { word: 'BIRTHDAY', meaning: '生日', difficulty: 3 },
            { word: 'PARTY', meaning: '聚会', difficulty: 3 },
            { word: 'PRESENT', meaning: '礼物', difficulty: 3 },
            { word: 'PICTURE', meaning: '图片', difficulty: 3 },
            { word: 'STORY', meaning: '故事', difficulty: 3 },
            { word: 'MAGIC', meaning: '魔法', difficulty: 3 }
        ];
        
        this.learnedWords = [];
        this.usedInLevel = [];
        this.currentDifficulty = 1;
        this.wordsPerLevel = 3;
    }

    getRandomWord(difficulty = null, excludeUsed = true) {
        const targetDifficulty = difficulty || this.currentDifficulty;
        const availableWords = this.wordDatabase.filter(w => {
            const difficultyMatch = w.difficulty <= targetDifficulty;
            const notLearned = !this.learnedWords.includes(w.word);
            const notUsedInLevel = excludeUsed ? !this.usedInLevel.includes(w.word) : true;
            return difficultyMatch && notLearned && notUsedInLevel;
        });
        
        if (availableWords.length === 0) {
            const fallbackWords = this.wordDatabase.filter(w => 
                !this.usedInLevel.includes(w.word)
            );
            if (fallbackWords.length === 0) {
                this.usedInLevel = [];
                return this.wordDatabase[Utils.randomInt(0, this.wordDatabase.length - 1)];
            }
            return fallbackWords[Utils.randomInt(0, fallbackWords.length - 1)];
        }
        
        return availableWords[Utils.randomInt(0, availableWords.length - 1)];
    }

    getWordsForLevel(count = 3, difficulty = null) {
        this.usedInLevel = [];
        const words = [];
        
        for (let i = 0; i < count; i++) {
            const word = this.getRandomWord(difficulty, true);
            this.usedInLevel.push(word.word);
            words.push(word);
        }
        
        return words;
    }

    markWordLearned(word) {
        if (!this.learnedWords.includes(word)) {
            this.learnedWords.push(word);
            this.checkDifficultyProgress();
        }
    }

    checkDifficultyProgress() {
        const wordsAtCurrentDifficulty = this.learnedWords.filter(word => {
            const wordData = this.wordDatabase.find(w => w.word === word);
            return wordData && wordData.difficulty === this.currentDifficulty;
        }).length;
        
        if (wordsAtCurrentDifficulty >= this.wordsPerLevel && this.currentDifficulty < 3) {
            this.currentDifficulty++;
        }
    }

    getLearnedWordsCount() {
        return this.learnedWords.length;
    }

    getWordMeaning(word) {
        const wordData = this.wordDatabase.find(w => w.word === word.toUpperCase());
        return wordData ? wordData.meaning : '';
    }

    getWordDifficulty(word) {
        const wordData = this.wordDatabase.find(w => w.word === word.toUpperCase());
        return wordData ? wordData.difficulty : 1;
    }

    reset() {
        this.learnedWords = [];
        this.usedInLevel = [];
        this.currentDifficulty = 1;
    }
}

const wordManager = new WordManager();
