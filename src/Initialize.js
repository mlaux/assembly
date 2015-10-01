/**
 * Created by Trent on 9/26/2015.
 */

// unorganized variables
var canvas = null;
var ctx = null;
var time = Date.now();

var AdInitialize = new StaticAdInitialize();
var ButtonManager = new StaticButtonManager();
var Constants = new StaticConstants();
var Game = new StaticGame();
var GameInput = new StaticGameInput();
var GuiUtils = new StaticGuiUtils();
var Instructions = new StaticInstructions();
var MathUtils = new StaticMathUtils();
var Network = new StaticNetwork();
var ScoresScreen = new StaticScoresScreen();
var StateManager = new StaticStateManager();
var TitleScreen = new StaticTitleScreen();
var TransitionManager = new StaticTransitionManager();

var globalSparkle = document.createElement('img');
globalSparkle.src = 'assets/sparkle.png';
globalSparkle.id = 'globalSparkle';
globalSparkle.width = '16';
globalSparkle.height = '16';

var globalBallGlow = document.createElement('img');
globalBallGlow.src = 'assets/ball-glow.png';
globalBallGlow.id = 'globalBallGlow';
globalBallGlow.width = '128';
globalBallGlow.height = '128';

var globalBackButton = document.createElement('img');
globalBackButton.src = 'assets/back-button.png';
globalBackButton.id = 'globalBackButton';
globalBackButton.width = '55';
globalBackButton.height = '46';

var globalBackButtonHover = document.createElement('img');
globalBackButtonHover.src = 'assets/back-button-hover.png';
globalBackButtonHover.id = 'globalBackButtonHover';
globalBackButtonHover.width = '55';
globalBackButtonHover.height = '46';

var globalScoreDialog = null;

var initUsername = function() {
    if (window.localStorage) {
        var item = window.localStorage.getItem('centrifuge-username');
        if (item !== null) {
            document.getElementById('username-field').value = item;
        }
    }
};

var resize = function() {
    if (window.devicePixelRatio && window.AdInterface) {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;

        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    if (!window.AdInterface) {
        AdInitialize.resize();
    }
};

var loop = function() {
    var delta = (Date.now() - time) * Constants.DELTA_SCALE;
    time = Date.now();

    if (!window.AdInterface) {
        AdInitialize.update(delta);
    }
    GameInput.update(delta);
    TransitionManager.update(delta);
    var state = StateManager.getState();
    state.update(delta);
    state.render();
    TransitionManager.render();

    window.requestAnimationFrame(loop);
};

window.onload = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    globalScoreDialog = document.getElementById('submit-score-container');
    globalScoreDialog.style.display = 'none';

    resize();

    GameInput.init();
    TitleScreen.init();
    initUsername();

    loop();
};

window.onresize = resize;
window.onerror = Network.reportError;