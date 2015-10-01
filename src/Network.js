/**
 * Created by mlaux on 9/26/15.
 */
var StaticNetwork = function() {

    this._HISCORE_ENDPOINT = 'http://52.26.40.60:5000/centrifuge/api/hiscores';
    this._ERROR_ENDPOINT = 'http://52.26.40.60:5000/centrifuge/api/errors';

    this.httpSend = function(method, endpoint, obj, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(JSON.parse(xhr.responseText));
                } else {
                    callback(null);
                }
            }
        };
        xhr.open(method, endpoint);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(obj));
    };

    this.queryHiscores = function(start, count, callback) {
        this.httpSend('POST', this._HISCORE_ENDPOINT, {start: start, count: count}, callback);
    };

    this.sendHiscore = function() {
        var user = document.getElementById('username-field').value;
        var num = Game.score;

        if (window.localStorage) {
            window.localStorage.setItem('centrifuge-username', user);
        }

        user = user.toLowerCase();
        if (user.length > 12) {
            user = user.substring(0, 12);
        }
        user = user.replace(/[^a-z]/, '');

        this.httpSend('PUT', this._HISCORE_ENDPOINT, {username: user, score: num}, function(response) {
            console.log('score sent ' + response);
        });
        globalScoreDialog.style.display = 'none';
    };

    this.reportError = function(message, url, line, col) {
        if (window.location.href.indexOf('file') == 0) {
            return;
        }
        var errorObj = {message: message, url: url, line: line, column: col};
        this.httpSend('PUT', this._ERROR_ENDPOINT, errorObj, function(response) {
            console.log('logged error ' + response);
        });
    }.bind(this);
};
