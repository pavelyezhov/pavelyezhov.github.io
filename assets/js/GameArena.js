import DAO from './Dao';
import LocalStorageDao from './LocalStorageDao';
import DrawService from './DrawService';
import GameCache from './GameCache';
import EnemyType1 from './settings/EnemyType1';
import EnemyType2 from './settings/EnemyType2';
import Person from './Person';
import Levels from './Levels';
import { resetStartButtonToInitialState } from './script';
import GameArenaInstance from "./GameArenaInstance.js";

class GameArena {

    constructor(element, fieldWidth, fieldHeight, Person) {
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
        this.enemies.push(new EnemyType2(this.ctx, 32, 32, 'blue', 600, 600, 0, 'right'));
        this.enemies.push(new EnemyType2(this.ctx, 32, 32, 'blue', 650, 650, 0, 'left'));
        this.enemies.push(new EnemyType2(this.ctx, 16, 16, 'blue', 700, 700, 0, 'down'));
        this.enemies.push(new EnemyType2(this.ctx, 16, 16, 'blue', 750, 750, 0, 'up'));

        /*this.enemies.push(new EnemyType1(this.ctx, 15, 15, 'blue', 500, 600, 3, -5)); // diagonal moving
        this.enemies.push(new EnemyType1(this.ctx, 15, 15, 'blue', 300, 100, 5, 3, 100)); // diagonal moving with radius

        this.enemies.push(new EnemyType2(this.ctx, 5, 5, 'blue', 600, 600, 3));*/

        this.canvas.width = fieldWidth;
        this.canvas.height = fieldHeight;

        this.img = new Image();  // Создание нового объекта изображения
        this.img.src = 'img/grass.png';

        this.currLvl = 1;
        this.lvls =  Levels.getLevels();

        if(GameArenaInstance.getInReplay() === false && GameArenaInstance.getShowBackground()){
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        }
        if(GameArenaInstance.getInReplay() && this.frames[this.stepId].imageSource !== undefined){
            this.img = new Image();
            this.img.src = this.frames[this.stepId].imageSource;
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        }
        this.updateState();
        //this.start();
    }

    start() {
        this.frameNo = 0;
        this.person = new Person();
        this.interval = setInterval(this.updateState.bind(this), 50);
        window.addEventListener('keydown', (e) => {
            //e.preventDefault();
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
        if(GameArenaInstance.getInReplay() === false && GameArenaInstance.getShowBackground()){
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        }
        if(GameArenaInstance.getInReplay() && this.frames[this.stepId].imageSource !== undefined){
            this.img = new Image();
            this.img.src = this.frames[this.stepId].imageSource;
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        }
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

        var gameInProgressAndRadiusesAllowed =  GameArenaInstance.getInReplay() === false && GameArenaInstance.getShowRadiuses();
        var inReplayStateAndRadiusesAllowed =  GameArenaInstance.getInReplay() && this.frames[this.stepId].showRadiuses === true;
        var showRadiuses = inReplayStateAndRadiusesAllowed || gameInProgressAndRadiusesAllowed;

        var person = this.person.newPos({
            right: this.keys && this.keys[39],
            left: this.keys && this.keys[37],
            up: this.keys && this.keys[38],
            down: this.keys && this.keys[40],
        }, this.canvas.width, this.canvas.height).update(this.ctx);
        this.gameCache.saveHero(this.person, this.stepId);
        this.enemies.forEach((item) => {
            var personPosition = GameArenaInstance.getPersonPosition();

            item.newPos(this.canvas.width, this.canvas.height).update(this.ctx, showRadiuses);
            this.gameCache.saveEnemy(item, this.stepId);

        });
        if(GameArenaInstance.getShowBackground()) {
            this.gameCache.saveBackGroundImage(this.img.src , this.stepId);
        }
        this.gameCache.savePersonRadiusesShowOption(this.stepId, GameArenaInstance.getShowRadiuses());
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
        GameArenaInstance.setGameArenaInstance(new GameArena(this.canvas, this.canvas.width, this.canvas.height, Person));
        this.clear();


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
        var person = new Person(this.ctx, hero.width, hero.height, hero.color, hero.x, hero.y,
            hero.imgWidth, hero.imgHeight, hero.moveDirection, hero.i);
        person.update(this.ctx);

        var gameInProgressAndRadiusesAllowed =  GameArenaInstance.getInReplay() === false && GameArenaInstance.getShowRadiuses();
        var inReplayStateAndRadiusesAllowed =  GameArenaInstance.getInReplay() && this.frames[this.stepId].showRadiuses === true;
        var showRadiuses = inReplayStateAndRadiusesAllowed || gameInProgressAndRadiusesAllowed;

        frame.enemies.forEach((object) => {
            var item = JSON.parse(object);
            var enemy;
            if (item.visionRadius) {
                enemy = new EnemyType1(this.ctx, item.width, item.height, item.color, item.x, item.y, item.speedV, item.speedH, item.visionRadius, item.i);
                enemy.update(this.ctx, showRadiuses);
            } else {
                enemy = new EnemyType2(this.ctx, item.width, item.height, item.color, item.x, item.y, item.i);
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
            var person = new Person(this.ctx, hero.width, hero.height, hero.color, hero.x, hero.y,
                hero.imgWidth, hero.imgHeight, hero.moveDirection, hero.i);
            person.update(this.ctx);
            this.stepId++;
        });
    }
}

export default GameArena;