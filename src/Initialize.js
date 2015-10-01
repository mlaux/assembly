/**
 * Created by Trent on 9/26/2015.
 */

// unorganized variables
var canvas = null;
var ctx = null;
var time = Date.now();

var AdInitialize = new StaticAdInitialize();
var Constants = new StaticConstants();
var Game = new StaticGame();
var GameInput = new StaticGameInput();
var Graphics = new StaticGraphics();
var GuiUtils = new StaticGuiUtils();
var Logic = new StaticLogic();
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

var resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';

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

    resize();

    GameInput.init();
    TitleScreen.init();

    loop();
};
window.onresize = resize;
window.onerror = Network.reportError;