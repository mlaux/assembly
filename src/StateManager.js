/**
 * Created by Trent on 9/26/2015.
 */

var StaticStateManager = function() {
    this.STATE_TITLE_SCREEN = 0;
    this.STATE_GAME = 1;
    this.STATE_SCORES = 2;

    this.state = 0;

    this.setState = function(state) {
        this.state = state;
        var stateObj = this.getState();
        if (stateObj['init']) {
            stateObj.init();
        }
    };

    this.getState = function() {
        switch (this.state) {
            case this.STATE_TITLE_SCREEN:
                return TitleScreen;
            case this.STATE_GAME:
                return Game;
            case this.STATE_SCORES:
                return ScoresScreen;
        }
    }
};