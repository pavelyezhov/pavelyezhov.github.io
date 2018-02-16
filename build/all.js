class Person {
    constructor(ctx, width = 30, height = 50, color = 'green', x = 900, y = 50, imgWidth = 100, imgHeight = 100, moveDirection = 'up', pictureNumber = 0) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.color = color;
        this.speed = 0;
        this.angle = 0;
        this.moveAngle = 0;
        this.x = x;
        this.y = y;

        this.sprites = [].slice.call(document.querySelectorAll('.person-img'));
        this.spriteNum = 0;
        this.moveDirection = moveDirection;
        this.i = pictureNumber;
    }

    getSprite() {
        this.spriteNum = (this.spriteNum + 1) % this.sprites.length;
        return this.sprites[this.spriteNum];
    }

    getBackGround(){
        return [].slice.call(document.getElementsByTagName('img'))[3];
    }

    update(ctx) {
        ctx.save();
        /*ctx.translate(this.x, this.y);
        //ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.imgWidth / -2, this.imgHeight / -2, this.imgWidth, this.imgHeight);
        ctx.restore();*/


        ctx.save();
        ctx.translate(this.x, this.y);

        var personImgProperties = this.getPersonImg();
        ctx.drawImage(this.getSprite(), personImgProperties.sx, personImgProperties.sy, personImgProperties.sWidth,
            personImgProperties.sHeight, this.imgWidth / -2, this.imgHeight / -2, this.imgWidth, this.imgHeight);

        /*this.img = new Image();  // Создание нового объекта изображения
        this.img.src = 'img/grass.png';
        ctx.drawImage(this.img, 0, 0);*/

        ctx.restore();

        this.i += 1;
        if (this.i % 6 === 0) {
            this.i = 0;
        }

        return this;
    }

    newPos(options) {
        this.moveAngle = 0;
        this.speed = 0;

        this.deltaX = 0;
        this.deltaY = 0;

        var a = options.left && (this.deltaX = -10) && (this.moveDirection = 'left');
        var b = options.right && (this.deltaX = 10) && (this.moveDirection = 'right');
        var c = options.up && (this.deltaY = 10) && (this.moveDirection = 'up');
        var d = options.down && (this.deltaY = -10) && (this.moveDirection = 'down');

        //this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.deltaX;
        this.y -= this.deltaY;


        xPerson = this.x;
        yPerson = this.y;

        if (this.x > FIELD_WIDTH) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = FIELD_WIDTH;
        }
        if (this.y > FIELD_HEIGHT) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = FIELD_HEIGHT;
        }
        return this;
    }

    getPersonImg() {
        if (this.moveDirection === 'up') {
            return PersonImgSettings.getUpSettings()[this.i];
        }
        if (this.moveDirection === 'down') {
            return PersonImgSettings.getDownSettings()[this.i];
        }
        if (this.moveDirection === 'left') {
            return PersonImgSettings.getLeftSettings()[this.i];
        }
        if (this.moveDirection === 'right') {
            return PersonImgSettings.getRightSettings()[this.i];
        }

        // default direction
        return PersonImgSettings.getDownSettings()[this.i];
    }

}

class EnemyType1 extends Person {
    constructor(ctx, width = 30, height = 30, color = 'red', x = 600, y = 300, speedV = 0, speedH = 5, radius = 200) {
        super();
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angle = 0;
        this.moveAngle = 0;
        this.x = x;
        this.y = y;
        this.speedV = speedV;
        this.speedH = speedH;

        this.visionRadius = radius;
    }

    newPos() {
        var step = 3;
        var deltaX;
        var deltaY;

        if (this.heroInVision()) {
            deltaX = defineXStepSigh(this.x, step);
            deltaY = defineYStepSigh(this.y, step);
        } else {
            deltaX = this.speedH;
            deltaY = this.speedV;
        }

        this.x += deltaX;
        this.y += deltaY;

        if (this.x > FIELD_WIDTH) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = FIELD_WIDTH;
        }

        if (this.y > FIELD_HEIGHT) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = FIELD_HEIGHT;
        }
        return this;
    }

    xPlusDelta(x, delta) {
        if (x + delta < 0) {
            return 0;
        } else if (x + delta > FIELD_WIDTH) {
            return FIELD_WIDTH;
        }
        return x + delta;
    }


    yPlusDelta(y, delta) {
        if (y + delta < 0) {
            return 0;
        } else if (y + delta > FIELD_HEIGHT) {
            return FIELD_HEIGHT;
        }
        return y + delta;
    }

    update(ctx) {

        var centerX = this.x;
        var centerY = this.y;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.visionRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        return this;
    }

    heroInVision() {
        var deltaX = xPerson - this.x;
        var deltaY = yPerson - this.y;

        var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        return distance <= this.visionRadius;
    }

    getItemType() {
        return 'EnemyType1';
    }
}

function defineXStepSigh(x, step) {
    var diff = xPerson - x;
    var sign = diff === 0 ? 0 : (diff > 0 ? 1 : -1);

    return Math.abs(diff) < step ? sign : sign * step;
}

function defineYStepSigh(y, step) {
    var diff = yPerson - y;
    var sign = diff === 0 ? 0 : (diff > 0 ? 1 : -1);

    return Math.abs(diff) < step ? 0 : sign * step;
}

class EnemyType2 extends Person {
    constructor(ctx, width = 30, height = 30, color = 'blue', x = 400, y = 400) {
        super();
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
        this.angle = 0;
        this.moveAngle = 0;
        this.x = x;
        this.y = y;
    }

    newPos() {
        this.x += 2;


        if (this.x > FIELD_WIDTH) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = FIELD_WIDTH;
        }

        if (this.y > FIELD_HEIGHT) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = FIELD_HEIGHT;
        }
        return this;
    }

    update(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
        return this;
    }

    getItemType() {
        return 'EnemyType2';
    }
}

class DAO {
    constructor() {

    }

    init() {
        console.log('INIT: ');

        this.database = firebase.database();
        //this.storage = firebase.storage();

        // Reference to the /messages/ database path.
        this.framesRef = this.database.ref('frame');
        // Make sure we remove all previous listeners.
        this.framesRef.off();
    }

    loadItems(items) {
        console.log('Data: ');

        // Reference to the /messages/ database path.
        this.framesRef = this.database.ref('frame');
        // Make sure we remove all previous listeners.
        this.framesRef.off();

        // select *
        /*this.framesRef.once("value", function(dataSnapshot){
            console.log(dataSnapshot.val());
        });*/
        return this.framesRef;
    }

    loadGame(id) {

        this.gameRef = this.database.ref('games/' + id);
        // Make sure we remove all previous listeners.
        this.gameRef.off();

        return this.gameRef;
    }

    loadGames() {
        // TODO remove this check after refactoring to the ES 6
        if (!this.database) {
            this.database = firebase.database();
        }

        // Reference to the /messages/ database path.
        this.gamesRef = this.database.ref('games');
        // Make sure we remove all previous listeners.
        this.gamesRef.off();

        return this.gamesRef;
    }

    saveFrame(stepId, objType, item) {

        // Reference to the /messages/ database path.
        this.framesRef = this.database.ref('frames');
        // Make sure we remove all previous listeners.
        this.framesRef.off();

        this.database.ref('frame/' + stepId + objType).set({
            "content": JSON.stringify(item)
        });
    }

    saveGame(item, score, player) {

        // Reference to the /messages/ database path.
        this.gamesRef = this.database.ref('games');
        // Make sure we remove all previous listeners.
        this.gamesRef.off();

        this.loadGames().once('value').then(element => {
            //console.log(element.child('content').key + ':' + element.child('content').val());
            var newGameId;
            if (element.val() && Object.values(element.val())) {
                newGameId = Object.values(element.val()).length + 1;
            } else {
                newGameId = 1;
            }

            this.database.ref('games/' + newGameId).set({
                "game": JSON.stringify(item),
                "player": player,
                "score": score,
                "time": Date.now()
            });
        });
    }

    getFrameObjectsByFrameIdAndType(stepId, objType) {
        // Reference to the /messages/ database path.
        this.framesRef = this.database.ref('frame');
        // Make sure we remove all previous listeners.
        this.framesRef.off();

        var foundElem = this.framesRef.child(stepId + objType);
        return foundElem;
    }
}

class LocalStorageDao {

    constructor() {
        this.frameStoreId = 'frameStoreId';
        this.playerRecordsId = 'playerRecordsId';
        this.storage = localStorage;
    }

    getStoredData(id) {
        return JSON.parse(this.storage.getItem(id));
    }

    saveObject(item, stepId) {

        var frames = this.getStoredData(this.frameStoreId);


        // initialize if necessary
        if (frames === null) {
            frames = [];
        }
        if (!frames[stepId]) {
            frames[stepId] = {
                enemies1: [],
                enemies2: [],
                hero: {}
            };
        }
        this.addItemToStore(item, frames[stepId]);
        this.storage.setItem(this.frameStoreId, JSON.stringify(frames));
        return item;
    }

    addItemToStore(item, frameStore) {
        if (item instanceof EnemyType1) {
            frameStore.enemies1.push(item);
        } else if (item instanceof EnemyType2) {
            frameStore.enemies2.push(item);
        } else if (item instanceof Person) {
            frameStore.hero = item;
        }
    }

    getItemsByFrameId(frameId) {

        var frames = JSON.parse(this.storage.getItem(this.frameStoreId));
        return frames[frameId];
    }

    clearFrames() {
        var frames = this.getStoredData(this.frameStoreId);
        frames = null;
        this.storage.setItem(this.frameStoreId, JSON.stringify(frames));
    }

    saveRecord(score, playerName) {
        var records = this.getStoredData('playerRecordsId');
        if (records === null) {
            records = {};
        }

        var existingPlayerResult = records[playerName];
        if (!existingPlayerResult || existingPlayerResult < score) {
            records[playerName] = score;
        }

        this.storage.setItem(this.playerRecordsId, JSON.stringify(records));

    }

}
class DrawService {
    constructor(dao) {
        this.dao = dao;
    }

    createRecordTableEl() {

        var tableId = 'recordTableId';
        var newTbl = document.createElement('table');
        newTbl.className = 'recordTable';
        newTbl.innerHTML = this.createRecordTableHTML();
        newTbl.id = tableId;
        return newTbl;
    }

    createRecordTableHTML() {
        var tableHTML = '<table  class="table"><thead><tr><th>Player</th><th>Score</th></tr></thead><tbody>';
        var records = this.dao.getStoredData('playerRecordsId');

        for (var key in records) {
            tableHTML += '<tr><td>' + key + '</td><td>' + records[key] + '</td></tr>';
        }
        tableHTML += '</tbody></table>';
        return tableHTML;
    }

    createReplayTableHTML(data) {
        var tableHTML = '<table class="table"><thead><tr><th>Player</th><th>Score</th><th>Time</th></tr></thead><tbody>';


        for (var i = 0; i < data.length; i++) {
            var player = data[i].player;
            var score = data[i].score;
            var time = data[i].time;
            tableHTML += '<tr id=' + (i + 1) + '>' +

                '<td>' + '<a href="#/showGame">' + player + '</a>' + '</td>' +
                '<td>' + score + '</td>' +
                '<td>' + new Date(time).toLocaleString() + '</td>' +
                '</tr>';
        }
        tableHTML += '</tbody></table>';
        return tableHTML;

    }

    makePlayLastGameButtonVisible() {

        var controlsArea = document.getElementById('controlsArea');
        controlsArea.className = 'passive';

        var replayArea = document.getElementById('replayArea');
        replayArea.className = 'replayArea active';

    }
}

class GameCache {

    constructor() {
        this.frames = [];
    }

    saveHero(hero, frameId) {
        if (!this.frames[frameId]) {
            this.initFrame(frameId);
        }
        this.frames[frameId].hero = JSON.stringify(hero);
    }

    saveEnemy(enemy, frameId) {
        if (!this.frames[frameId]) {
            this.initFrame(frameId);
        }
        this.frames[frameId].enemies.push(JSON.stringify(enemy));
    }

    initFrame(frameId) {
        if (this.frames.length === 0) {
            this.frames.push({
                hero: {},
                enemies: []
            });
            this.frames.push({
                hero: {},
                enemies: []
            });
        } else {
            this.frames[frameId] = {
                hero: {},
                enemies: []
            };
        }

    }
}

class PersonImgSettings {
    constructor() {

    }

    static getUpSettings() {
        return [
            {
                sx: 0,
                sy: 200,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 100,
                sy: 200,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 200,
                sy: 200,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 300,
                sy: 200,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 400,
                sy: 200,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 500,
                sy: 200,
                sWidth: 100,
                sHeight: 100
            }
        ];
    }

    static getDownSettings() {
        return [
            {
                sx: 0,
                sy: 0,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 100,
                sy: 0,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 200,
                sy: 0,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 300,
                sy: 0,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 400,
                sy: 0,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 500,
                sy: 0,
                sWidth: 100,
                sHeight: 100
            }
        ];
    }

    static getLeftSettings() {
        return [
            {
                sx: 0,
                sy: 300,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 100,
                sy: 300,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 200,
                sy: 300,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 300,
                sy: 300,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 400,
                sy: 300,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 500,
                sy: 300,
                sWidth: 100,
                sHeight: 100
            }
        ];
    }

    static getRightSettings() {
        return [
            {
                sx: 0,
                sy: 100,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 100,
                sy: 100,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 200,
                sy: 100,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 300,
                sy: 100,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 400,
                sy: 100,
                sWidth: 100,
                sHeight: 100
            },
            {
                sx: 500,
                sy: 100,
                sWidth: 100,
                sHeight: 100
            }
        ];
    }

}

class Router {

    constructor(options) {
        this.routes = options.routes || [];
        this.eventBus = options.eventBus;
        this.init();
    }

    init() {
        // subscribe window on hashchange to handle url from router
        window.addEventListener('hashchange', () => this.handleUrl(window.location.hash));
        // and at once handle base url
        this.handleUrl(window.location.hash);
    }

    findPreviousActiveRoute() {
        return this.currentRoute;
    }

    findNewActiveRoute(providedUrl) {
        // return just part of url after # symbol
        var url = providedUrl.split('#').pop();

        return this.routes.find((route) => {
            if (typeof route.match === 'string') {
                return route.match === url;
            }

            if (route.match instanceof RegExp) {
                return route.match.test(url);
            }

            if (typeof route.match === 'function') {
                return route.match(url);
            }
        });
    }

    getRouteParams(route, url) {
        var params = url.match(route.match) || [];
        params.shift();
        return params;
    }

    handleUrl(url) {
        url = url.slice(1);
        // Найти текущий роут
        var prevRoute = this.findPreviousActiveRoute();
        // Найти новый роут
        var newRoute = this.findNewActiveRoute(url);

        var newRouteParams = this.getRouteParams(newRoute, url);

        if (prevRoute && prevRoute.onLeave) {
            prevRoute.onLeave(this.currentRouteParams);
        }

        if (newRoute && newRoute.onBeforeEnter) {
            newRoute.onBeforeEnter(newRouteParams);
        }

        if (newRoute && newRoute.onEnter) {
            newRoute.onEnter(newRouteParams);
        }

        this.currentRoute = newRoute;
        this.currentRouteParams = newRouteParams;
    }
}

class Levels {

    static getLevels() {
        return [
            {
                winScoreLimit: 5,
                imgSource: undefined,
                enemies: [
                    new EnemyType1(),
                    new EnemyType1(this.ctx, 15, 15, 'blue', 300, 600, -3)
                ]
            },
            {
                winScoreLimit: 10,
                imgSource: undefined,
                enemies: [
                    new EnemyType2()
                ]
            },
            {
                winScoreLimit: 15,
                imgSource: undefined,
                enemies: [
                    new EnemyType1(this.ctx, 20, 20, 'orange', 300, 800, -4),
                ]
            }
        ];
    }
}
class GameArena {

    constructor(element, width, height, Person) {
        this.fbDao = new DAO();
        this.lsDao = new LocalStorageDao();
        this.fbDao.init();


        this.gameCache = new GameCache();

        this.drawService = new DrawService(this.lsDao);

        this.stepId = 0;
        this.score = 0;
        //this.interval = 50;
        this.canvas = element;
        this.ctx = this
            .canvas
            .getContext("2d");

        this.person = new Person();
        this.enemies = [];

        this.enemies.push(new EnemyType1());
        this.enemies.push(new EnemyType1(this.ctx, 15, 15, 'blue', 300, 600, -3)); // just horiz moving
        /*this.enemies.push(new EnemyType1(this.ctx, 15, 15, 'blue', 500, 600, 3, -5)); // diagonal moving
        this.enemies.push(new EnemyType1(this.ctx, 15, 15, 'blue', 300, 100, 5, 3, 100)); // diagonal moving with radius
        this.enemies.push(new EnemyType2());
        this.enemies.push(new EnemyType2(this.ctx, 5, 5, 'blue', 600, 600, 3));*/

        this.canvas.width = FIELD_WIDTH;
        this.canvas.height = FIELD_HEIGHT;

        this.img = new Image();  // Создание нового объекта изображения
        this.img.src = 'img/grass.png';

        this.currLvl = 1;
        this.lvls =  Levels.getLevels();

        //this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);


        this.updateState();
        //this.start();
    }

    start() {
        this.frameNo = 0;

        this.interval = setInterval(this.updateState.bind(this), 50);
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.keys = (this.keys || []);
            this.keys[e.keyCode] = (e.type == "keydown");
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = (e.type == "keydown");
        });
    }

    stop() {
        clearInterval(this.interval);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
    }

    updateState() {
        this.stepId += 1;
        if (this.stepId % 10 === 0) {
            this.score += 1;
            this.updateScoreArea();
        }

        this.clear();

        if (this.anyCollisionOccurred(this.person, this.enemies)) {
            if (!this.finishGame()) {
                return;
            }
        }

        this.checkCurrentLevelPassed();

        this.person.newPos({
            right: this.keys && this.keys[39],
            left: this.keys && this.keys[37],
            up: this.keys && this.keys[38],
            down: this.keys && this.keys[40],
        }).update(this.ctx);
        //this.fbDao.saveObject(this.person, this.stepId);
        this.gameCache.saveHero(this.person, this.stepId);


        this.enemies.forEach((item) => {
            item.newPos().update(this.ctx);
            //this.fbDao.saveObject(item, this.stepId);
            this.gameCache.saveEnemy(item, this.stepId);

        });
    }

    checkCurrentLevelPassed(){
        var currLvlObj = this.lvls[this.currLvl - 1];
        if (currLvlObj && this.score > currLvlObj.winScoreLimit) {
            bootbox.alert('Level ' + this.currLvl + ' is completed! Press ok to continue');
            this.currLvl += 1;
            this.stop();
            resetStartButtonToInitialState();
            if(currLvlObj.enemies){
                this.enemies = this.enemies.concat(currLvlObj.enemies);
            }
            // update person position
            this.person = new Person();
            this.keys = undefined;
        }
    }

    anyCollisionOccurred(hero, enemies) {

        for (var i = 0; i < enemies.length; i++) {
            if (this.collisionOccurred(hero, enemies[i])) {
                return true;
            }
        }
        return false;
    }

    collisionOccurred(obj1, obj2) {
        var xColl = false;
        var yColl = false;

        if ((obj1.x + obj1.width / 2 >= obj2.x - obj2.width / 2) && (obj1.x - obj1.width / 2 <= obj2.x + obj2.width / 2)) {
            xColl = true;
        }

        if ((obj1.y + obj1.height / 2 >= obj2.y - obj2.height / 2) && (obj1.y - obj1.height / 2 <= obj2.y + obj2.height / 2)) {
            yColl = true;
        }

        return xColl && yColl;
    }

    updateScoreArea() {
        var scoreNumberSpan = document.getElementById('scoreNumber');
        scoreNumberSpan.innerHTML = this.score;
    }

    resetScore() {
        var scoreNumberSpan = document.getElementById('scoreNumber');
        scoreNumberSpan.innerHTML = 0;
    }

    finishGame() {
        this.stop();

        var playerName = prompt('Record saving', 'Unnamed player');
        if(playerName){
            this.fbDao.saveGame(this.gameCache.frames, this.score, playerName);
            this.lsDao.saveRecord(this.score, playerName);
        }
        resetStartButtonToInitialState();
        this.resetScore();
        gameArena = new GameArena(this.canvas, FIELD_WIDTH, FIELD_HEIGHT, Person);

        /*bootbox.prompt({
            title: "What is your name?",
            value: "Unnamed champion",
            callback: (playerName) => {
                if (playerName) {
                    this.fbDao.saveGame(this.gameCache.frames, this.score, playerName);
                    this.lsDao.saveRecord(this.score, playerName);
                }
                resetStartButtonToInitialState();
                this.resetScore();
                gameArena = new GameArena(this.canvas, FIELD_WIDTH, FIELD_HEIGHT, Person);
            }
        });*/
    }

    replayLastGame() {

        var gamesFrommDB = this.fbDao.loadGames();
        gamesFrommDB.once('value').then(element => {

            var lastGameId = Object.values(element.val()).length;
            var foundGame = this.fbDao.loadGame(lastGameId);
            foundGame.once('value').then(element => {

                this.frames = JSON.parse(Object.values(element.val())[0]);
                this.interval = setInterval(this.drawFrame2.bind(this), 50);
            });
        });
    }

    replaySelectedGame(gameId) {
        var gamesFrommDB = this.fbDao.loadGames();
        gamesFrommDB.once('value').then(element => {

            var foundGame = this.fbDao.loadGame(gameId);
            foundGame.once('value').then(element => {

                this.frames = JSON.parse(Object.values(element.val())[0]);
                this.interval = setInterval(this.drawFrame2.bind(this), 50);
            });
        });
    }

    drawFrame2() {

        var frame = this.frames[this.stepId];
        if (!frame) {
            this.stop();
            this.stepId = 1;
            return;
        }
        this.clear();
        var hero = JSON.parse(frame.hero);
        var person = new Person(this.ctx, hero.width, hero.height, hero.color, hero.x, hero.y, hero.imgWidth, hero.imgHeight, hero.moveDirection, hero.i);
        person.update(this.ctx);

        frame.enemies.forEach((object) => {
            var item = JSON.parse(object);
            var enemy;
            if (item.visionRadius) {
                enemy = new EnemyType1(this.ctx, item.width, item.height, item.color, item.x, item.y, item.speedV, item.speedH, item.visionRadius);
                enemy.update(this.ctx);
            } else {
                enemy = new EnemyType2(this.ctx, item.width, item.height, item.color, item.x, item.y);
                enemy.update(this.ctx);
            }
        });

        this.stepId++;
    }

    drawFrame() {

        //Test hero rendering - comment and ucomment ls rendering
        // TODO also split fbDao for two parts.
        var hero1FromDB = this.fbDao.getFrameObjectsByFrameIdAndType(this.stepId, 'hero');
        hero1FromDB.once('value').then(element => {
            //console.log(element.child('content').key + ':' + element.child('content').val());
            this.clear();
            var hero = JSON.parse(element.child('content').val());
            var person = new Person(this.ctx, hero.width, hero.height, hero.color, hero.x, hero.y, hero.imgWidth, hero.imgHeight, hero.moveDirection, hero.i);
            person.update(this.ctx);
            this.stepId++;
        });
    }
}

var FIELD_WIDTH  = document.documentElement.clientWidth;
var FIELD_HEIGHT = document.documentElement.clientHeight;


// person coordinates
var xPerson = 0;
var yPerson = 0;

var gameIdToReplay;

var gameArena;
var lsdao = new LocalStorageDao();
var fbDao = new DAO();
var drawService = new DrawService(lsdao);
var routes = [
    {
        name: 'about',
        match: /[/]about/,
        onBeforeEnter: () => {setElementAndParentStyle('aboutLink', 'active');},
        onEnter: () => console.log(`onEnter about`),
        onLeave: () => {setElementAndParentStyle('aboutLink', '');}
    },
    {
        name: 'game',
        match: /[/]game/,
        onBeforeEnter: () => {
            var gameArea = document.getElementById('gameArea');
            if(gameArea){
                gameArea.className = 'gameArea active';
                resetStartButtonToInitialState();
                makeReplayAreaPassive();
                makeControlsAreaActive();
                setElementAndParentStyle('gameLink', 'active');
            }
        },
        onEnter: () => {},
        onLeave: () => {
            // Stop the game
            gameArena.stop();

            // Hide game area
            var gameArea = document.getElementById('gameArea');
            gameArea.className = 'gameArea passive';

            // Change action icon
            var controlsArea = document.getElementById('controlsArea');
            controlsArea.children[0].src = 'img/play.png';
            setElementAndParentStyle('gameLink', '');
            gameArena.stop();
        }
    },
    {
        name: 'showGame',
        match: /[/]showGame/,
        onBeforeEnter: () => {
            var gameArea = document.getElementById('gameArea');
            if(gameArea){
                gameArea.className = 'gameArea active';
            }
        },
        onEnter: () => {},
        onLeave: () => {


            // Hide game area
            var gameArea = document.getElementById('gameArea');
            gameArea.className = 'gameArea passive';

            // Change action icon
            var controlsArea = document.getElementById('controlsArea');
            controlsArea.children[0].src = 'img/play.png';

            // Stop the game
            gameArena.stop();
        }
    },
    {
        name: 'records',
        match: /[/]records/,
        onBeforeEnter: () => {
            var recordsArea = document.getElementById('recordsArea');
            recordsArea.className = 'active';
            recordsArea.style.width = document.documentElement.clientWidth;
            recordsArea.style.height = document.documentElement.clientHeight;

            var tableArea = document.getElementById('recordTableId');
            tableArea.innerHTML = drawService.createRecordTableHTML();
            tableArea.className = 'table';

            setElementAndParentStyle('recordLink', 'active');

        },
        onEnter: () => {},
        onLeave: () => {
            var recordsArea = document.getElementById('recordsArea');
            recordsArea.className = 'recordsArea passive';

            var tableArea = document.getElementById('recordTableId');
            tableArea.className = 'tableArea passive';

            setElementAndParentStyle('recordLink', '');
        }
    },
    {
        name: 'replays',
        match: /[/]replays/,
        onBeforeEnter: () => {
            setElementAndParentStyle('replayLink', 'active');

            var replaysPage = document.getElementById('replaysPage');
            replaysPage.className = 'replaysPage active';
            replaysPage.style.width = document.documentElement.clientWidth;
            replaysPage.style.height = document.documentElement.clientHeight;

            var tableArea = document.getElementById('replaysTableId');

            this.fbDao.loadGames().once('value').then(element=>{
                //console.log(element.child('content').key + ':' + element.child('content').val());

                tableArea.innerHTML = drawService.createReplayTableHTML( Object.values(element.val()));
                tableArea.className = 'table';
            });

        },
        onEnter: () => console.log(`onEnter about`),
        onLeave: () => {
            setElementAndParentStyle('replayLink', '');

            var recordsArea = document.getElementById('replaysPage');
            recordsArea.className = 'replaysPage passive';

            var tableArea = document.getElementById('replaysTableId');
            tableArea.className = 'tableArea passive';
        }
    }
];



function prepareElements(){

    location.hash = '/game';
    FIELD_HEIGHT = document.documentElement.clientHeight - document.getElementsByTagName('nav')[0].clientHeight;


    var options = {
        routes: routes
    };
    var router = new Router(options);


    this.canvas = document.querySelector('canvas');
    gameArena = new GameArena(this.canvas, FIELD_WIDTH, FIELD_HEIGHT, Person);

    var controlsArea = document.getElementById('controlsArea');
    controlsArea.addEventListener('click', function(){

        var activeImg = this.children[0].src;
        if(activeImg.includes('play')){
            gameArena.start();
            this.children[0].src = 'img/pause.png';
        } else{
            gameArena.stop();
            this.children[0].src = 'img/play.png';
        }
    });

    var replayArea = document.getElementById('replayArea');
    replayArea.addEventListener('click', function(){
        if(!gameIdToReplay){
            gameArena.replayLastGame();
        }
        gameArena.replaySelectedGame(gameIdToReplay);
    });

    var tableArea = document.getElementById('replaysTableId');
    tableArea.addEventListener('click', function(){
        if(event.target.tagName === 'A'){
            gameIdToReplay = Number(event.target.parentNode.parentNode.id); // TODO: make independent link
            drawService.makePlayLastGameButtonVisible();
        }
    });
}

function resetStartButtonToInitialState(){
    var controlsArea = document.getElementById('controlsArea');
    controlsArea.children[0].src = 'img/play.png';
}


function makeReplayAreaPassive(){

    var replayArea = document.getElementById('replayArea');
    replayArea.className = 'replayArea passive';
}

function makeControlsAreaActive(){
    var controlsArea = document.getElementById('controlsArea');
    controlsArea.className = '';
}

function setElementAndParentStyle(id, style){
    var element = document.getElementById(id);
    element.className = style;
    element.parentElement.className = style;
}




(function(){
    prepareElements();
}) ();