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



