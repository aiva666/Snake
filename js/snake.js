
var row = 20;           // 行数
var col = 20;           // 列数
var scoreBox1 = document.querySelector('.score');
var scoreBox2 = document.querySelector('.over_plan .content .over_score');
var gameOverBox = document.querySelector('.over_plan');
var begin = document.querySelector('.begin');
var close = document.querySelector('.over_plan .content>i');
var pause = document.querySelector('.pause');


// 创建背景
var mask = document.querySelector('.mask');
for (var r = 0; r < row; r++) {
    for (var c = 0; c < col; c++) {
        var div = document.createElement('div');
        div.className = 'pixel';
        mask.appendChild(div);
    }
}


var snake = {
    // 父元素
    parent: document.querySelector('.game'),
    maxOffset: 475,         // 最大距离
    // 分数
    score: 0,
    food: null,          // 食物
    body: [],           // 蛇身体
    timer: null,
    direction: 1,       // 方向
    x: 0,               // 蛇头位置
    y: 0,
    offset: 25,            // 小方块大小
    speed: 200,            // 速度

    // 创建身体
    createBody: function () {
        // 创建蛇头
        var head = document.createElement('div');
        head.classList.add('snake');
        head.classList.add('header');
        head.innerHTML = '&bull;'
        this.body.push(head);
        var pos = this.initPosition();
        pos.x = pos.x <= this.offset || pos.x >= (this.maxOffset - this.offset) ? this.offset * 2 : pos.x;
        // console.log(pos.x);
        this.body[0].style.left = pos.x + 'px';
        this.body[0].style.top = pos.y + 'px';
        this.x = pos.x;
        this.y = pos.y;

        var body1 = document.createElement('div');
        body1.className = 'snake';
        this.body.push(body1);
    },

    // 创建食物
    createFood: function () {
        var food = document.createElement('div');
        food.className = 'food';
        this.parent.appendChild(food);
        this.food = food;
        var pos = this.initPosition();
        this.food.style.left = pos.x + 'px';
        this.food.style.top = pos.y + 'px';
        this.food.x = pos.x;
        this.food.y = pos.y;
    },

    // 初始化蛇身体位置
    initBodyPos: function () {
        for (var k = this.body.length - 1; k >= 1; k--) {
            var x = parseInt(getStyle(this.body[k - 1]).left);
            var y = parseInt(getStyle(this.body[k - 1]).top);
            if (k !== 1) {
                this.body[k].style.left = x + 'px';
                this.body[k].style.top = y + 'px';
            }else {
                if (this.direction === 1) {
                    this.body[k].style.left = this.x + this.offset + 'px';
                    this.body[k].style.top = this.y + 'px';
                } else if (this.direction === 2) {
                    this.body[k].style.left = this.x + 'px';
                    this.body[k].style.top = this.y + this.offset + 'px';
                } else if (this.direction === 3) {
                    this.body[k].style.left = this.x - this.offset + 'px';
                    this.body[k].style.top = this.y + 'px';
                } else if (this.direction === 4) {
                    this.body[k].style.left = this.x + 'px';
                    this.body[k].style.top = this.y - this.offset + 'px';
                }
            }
        }

    },

    // 生成随机位置函数
    initPosition: function () {
        // 生成随机数
        var x = Math.floor(Math.random() * row);
        var y = Math.floor(Math.random() * col);
        return {
            x: x * this.offset,
            y: y * this.offset
        }
    },

    // 开始游戏
    playGame: function () {
        clearInterval(this.timer);
        var _this = this;
        this.timer = setInterval(function () {
            // 判断方向
            var dir = _this.direction;
            if (dir === 1) {
                _this.x -= _this.offset;
                if (_this.x < 0) {
                    clearInterval(_this.timer);
                    _this.gameOver();
                    return;
                } else {
                    _this.body[0].style.left = _this.x + 'px';
                }

            } else if (dir === 2) {
                _this.y -= _this.offset;
                if (_this.y < 0) {
                    clearInterval(_this.timer);
                    _this.gameOver();
                    return;
                } else {
                    _this.body[0].style.top = _this.y + 'px';
                }

            } else if (dir === 3) {
                _this.x += _this.offset;
                if (_this.x > _this.maxOffset) {
                    clearInterval(_this.timer);
                    _this.gameOver();
                    return;
                } else {
                    _this.body[0].style.left = _this.x + 'px';
                }

            } else if (dir === 4) {
                _this.y += _this.offset;
                if (_this.y > _this.maxOffset) {
                    clearInterval(_this.timer);
                    _this.gameOver();
                    return;
                } else {
                    _this.body[0].style.top = _this.y + 'px';
                }

            }

            // 判断是否吃到食物
            if (_this.x === _this.food.x && _this.y === _this.food.y) {
                _this.food.className = 'snake';
                _this.body.push(_this.food);
                _this.parent.appendChild(_this.food);
                _this.food = null;
                _this.createFood();
                _this.score++;
                scoreBox1.innerText = _this.score;

            } else {
                // 判断是否吃到自己
                for (var eat = 1; eat < _this.body.length; eat++) {
                    var x = parseInt(getStyle(_this.body[eat]).left);
                    var y = parseInt(getStyle(_this.body[eat]).top);
                    if (x === _this.x && y === _this.y) {
                        clearInterval(_this.timer);
                        _this.gameOver();
                        return;
                    }
                }
            }



            // 更新位置
            _this.initBodyPos();

        }, this.speed);

        // 键盘事件
        document.onkeydown = function (e) {
            var dir = _this.direction;
            if (e.keyCode === 37) {
                if (dir === 3) {
                    _this.direction = 3;
                    return;
                }
                _this.direction = 1;
            } else if (e.keyCode === 38) {
                if (dir === 4) {
                    _this.direction = 4;
                    return;
                }
                _this.direction = 2;
            } else if (e.keyCode === 39) {
                if (dir === 1) {
                    _this.direction = 1;
                    return;
                }
                _this.direction = 3;
            } else if (e.keyCode === 40) {
                if (dir === 2) {
                    _this.direction = 2;
                    return;
                }
                _this.direction = 4;
            }
        }
    },
    // 游戏结束
    gameOver: function () {
        clearInterval(this.timer);
        gameOverBox.style.display = 'block';
        scoreBox2.innerText = this.score;
    }
};


initGame();
// 初始化游戏界面
function initGame() {
    snake.body = [];
    snake.food = null;
    snake.score = 0;
    scoreBox1.innerText = snake.score;
    scoreBox2.innerText = snake.score;

    var items = document.querySelectorAll('.game div');
    for (var init = 0; init < items.length; init++) {
        document.querySelector('.game').removeChild(items[init]);
    }

    // 创建食物
    snake.createFood();
    // 创建身体
    snake.createBody();

    // 将snake对象中的body数组（蛇的身体部分,插入到文档）
    for (var item = 0; item < snake.body.length; item++) {
        snake.parent.appendChild(snake.body[item]);
    }



    // 判断方向
    var snakeX = parseInt(getStyle(snake.body[0]).left);
    var foodX = parseInt(getStyle(snake.food).left);
    if ((snakeX >= foodX)) {
        snake.direction = 1;
    } else {
        snake.direction = 3;
    }

    snake.initBodyPos();
}








// 开始游戏事件
begin.addEventListener('click', function () {
    snake.playGame();
    pause.style.display = 'inline-block';
})


// 关闭按钮重置游戏事件
close.addEventListener('click', function () {
    gameOverBox.style.display = 'none';
    initGame();
})

// 暂停事件
pause.onclick = function () {
    document.querySelector('.pause_plan').style.display = 'block';
    clearInterval(snake.timer);
}

// 暂停后开始事件
document.querySelector('.pause_plan i').onclick = function () {
    document.querySelector('.pause_plan').style.display = 'none';
    snake.playGame();
}
// 取消右键菜单
document.oncontextmenu = function () {
    return false;
}






function getStyle(el) {
    return getComputedStyle(el, null);
}
