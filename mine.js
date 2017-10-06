$(document).ready(function() {
	alert('做一个小东西献给我的小宠物~');
    $('input[name=x]').val(10);
    $('input[name=y]').val(10);
    $('input[name=n]').val(26);
    $('a[name=start]').click(function() {
        var x = parseInt($('input[name=x]').val());
        var y = parseInt($('input[name=y]').val());
        var n = parseInt($('input[name=n]').val());
        if (Config.wins > 0) {
            $('a[name=start]').text('我的小宠物生日快乐~\n要永远做我的小可爱呀\n小飞机希望你喜欢\n主人永远爱你mua\n不会让你跑了的\n ⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄.');
        }
        var game = new Mine(x, y, n);
        game.start();
    });
});

function Mine(x, y, n) {
    this.x = x ? x : 10;
    this.y = y ? y : 10;
    this.n = n ? n : 26;
    this.m = new Array();
    this.flag = [];
    _this = this;
    this.start = function() {
        this.log('start()');
        $('#container').html('');
        this.generate();
        $('.box').click(function() {
            var x = $(this).attr('x'),
                y = $(this).attr('y');
            if (_this.m[x][y] == -1 && Config.first) {
                alert('小宠物的运气是不是被我吃掉了呀\n\n好吧，既然这样，送你一次机会 ლ(•̀ _ •́ ლ)');
                $('a[name=start]').click();
                return;
            }
            Config.first = false;
            _this.check(x, y, $(this));
        });
    }
    this.generate = function() {
        this.log('generate()');
        // generate box and init this.m, this.flag
        for (var i = 0; i < this.x; i++) {
            this.m[i] = new Array();
            this.flag[i] = new Array();
            for (var j = 0; j < this.y; j++) {
                this.m[i][j] = 0;
                this.flag[i][j] = 0;
                var box = "<div class='box' x='" + i + "' y='" + j + "'><div>";
                $('#container').append(box);
            }
            $('#container').append("<br>");
        }
		var gminex=[2,2,1,1,1,1,2,2,3,3,4,4,5,5,6,6,7,7,9,9,9,9,9,9,9,9];
		var gminey=[4,5,2,3,6,7,1,8,1,8,1,8,2,7,3,6,4,5,0,2,3,4,5,7,8,9];
        // generate mine
        for (var i = 0; i < this.n; i++) {
            var px = gminex[i];
            var py = gminey[i];
            if (this.m[px][py] == 0) {
                this.m[px][py] = -1;
                if (Config.mineVisible) {
                    $('.box[x=' + px + '][y=' + py + ']').css({ 'background': 'pink', 'color': '#fff' });
                }
            } else {
                i--;
            }
        }
        // count
        for (var i = 0; i < this.x; i++) {
            for (var j = 0; j < this.y; j++) {
                if (this.m[i][j] < 0) {
                    (i - 1 >= 0) && (j - 1 >= 0) && (this.m[i - 1][j - 1] >= 0) ? this.m[i - 1][j - 1]++: 0;
                    (j - 1 >= 0) && (this.m[i][j - 1] >= 0) ? this.m[i][j - 1]++: 0;
                    (i + 1 < this.x) && (j - 1 >= 0) && (this.m[i + 1][j - 1] >= 0) ? this.m[i + 1][j - 1]++: 0;

                    (i - 1 >= 0) && (this.m[i - 1][j] >= 0) ? this.m[i - 1][j]++: 0;
                    (i + 1 < this.x) && (this.m[i + 1][j] >= 0) ? this.m[i + 1][j]++: 0;

                    (i - 1 >= 0) && (j + 1 < this.y) && (this.m[i - 1][j + 1] >= 0) ? this.m[i - 1][j + 1]++: 0;
                    (j + 1 < this.y) && (this.m[i][j + 1] >= 0) ? this.m[i][j + 1]++: 0;
                    (i + 1 < this.x) && (j + 1 < this.y) && (this.m[i + 1][j + 1] >= 0) ? this.m[i + 1][j + 1]++: 0;
                }
            }
        }
    }
    this.end = function() {
        this.log('end()');
        alert(Config.end[Config.ends < Config.end.length ? Config.ends : Config.end.length - 1]);
        Config.ends++;
		this.start();
        return;
    }
    this.check = function(x, y, d) {
        if (this.isMine(x, y)) {
//			d.css({ 'background': 'f64' });
            this.end();
        } else {
            if (this.m[x][y] != 0) {
                this.flag[x][y] = 1;
                d.css({ 'background': '#ddd' });
                d.text(this.m[x][y]);
            } else {
                this.expand(x, y);
            }
        }
        this.win();
    }
    this.isMine = function(x, y) {
        this.log(x + ' ' + y);
        if (this.m[x][y] < 0) {
            return true;
        }
        return false;
    }
    this.expand = function(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        var xMin = (x - 1 >= 0) ? x - 1 : x;
        var xMax = (x + 1 < this.x) ? x + 1 : x;
        var yMin = (y - 1 >= 0) ? y - 1 : y;
        var yMax = (y + 1 < this.y) ? y + 1 : y;
        this.log('expand:' + x + ' ' + y);
        d = $('.box[x=' + x + '][y=' + y + ']');
        d.css({ 'background': '#ddd' });
        this.flag[x][y] = 1;
        if (this.m[x][y] > 0) {
            d.text(this.m[x][y]);
            return;
        }
        for (var i = xMin; i <= xMax; i++) {
            for (var j = yMin; j <= yMax; j++) {
                if (this.flag[i][j] == 0 && this.m[i][j] >= 0) {
                    this.expand(i, j);
                }
            }
        }
    }
    this.win = function() {
        this.log('win()');
        var count = 0;
        for (var i = 0; i < this.x; i++) {
            for (var j = 0; j < this.y; j++) {
                if (this.flag[i][j] == 0) {
                    count++;
                }
            }
        }
        this.log('count:' + count + '  n:' + this.n);
        // console.log(this.m);
        // console.log(this.flag);
        if (count == this.n) {
			Config.wins++;
            alert("小宠物超棒！给你比心");
			for (var i = 0; i < this.x; i++) {
            for (var j = 0; j < this.y; j++) {
                if (this.m[i][j] > 0) {
                    $('.box[x=' + i + '][y=' + j + ']').text(this.m[i][j]);
                    $('.box[x=' + i + '][y=' + j + ']').css({ 'background': '#ddd' });
                } else if (this.m[i][j] == 0) {
                    $('.box[x=' + i + '][y=' + j + ']').css({ 'background': '#ddd' });
                } else if (this.m[i][j] == -1) {
                    $('.box[x=' + i + '][y=' + j + ']').css({ 'background': '#f64', 'color': '#fff' });
                }
            }
			}
			$('.box[x=' + 9 + '][y=' + 0 + ']').text('i');
			$('.box[x=' + 9 + '][y=' + 2 + ']').text('l');
			$('.box[x=' + 9 + '][y=' + 3 + ']').text('o');
			$('.box[x=' + 9 + '][y=' + 4 + ']').text('v');
			$('.box[x=' + 9 + '][y=' + 5 + ']').text('e');
			$('.box[x=' + 9 + '][y=' + 7 + ']').text('y');
			$('.box[x=' + 9 + '][y=' + 8 + ']').text('o');
			$('.box[x=' + 9 + '][y=' + 9 + ']').text('u');
        }
    }
    this.log = function(e) {
        var log = false;
        if (log) {
            var h = $('#log').html();
            h += "<p>" + e + "</p>";
            $('#log').html(h);
            $('#log').scrollTop($('#log')[0].scrollHeight);
        }
    }
}
var Config = {
    'first': true,
    'ends': 0,
	'wins': 0,
    'end': [
        '踩雷了..',
        '我太菜了所以没法给这个雷做标记嘤嘤嘤',
		'啊哦',
        '诶 这还是个雷',
        '略略略',
        '小宠物继续嘛',
        '小宠物加油',
        '嘻嘻嘻',
        '呀呀呀呀呀',
        '悄咪咪告诉你，最后一行总共有8个雷',
        '再悄咪咪告诉你，整个形状除去最后一行是对称的~',
        '还有好多好多要告诉小宠物的',
		'藏在这里面了[跳跳]'
    ],
    'mineVisible': false,
}

