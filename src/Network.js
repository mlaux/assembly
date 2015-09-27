/**
 * Created by mlaux on 9/26/15.
 */
var StaticNetwork = function() {

    this._HISCORE_ENDPOINT = 'http://198.91.90.100:5000/centrifuge/api/hiscores';
    this._ERROR_ENDPOINT = 'http://198.91.90.100:5000/centrifuge/api/errors';

    this.httpGet = function(endpoint, callback) {
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
        xhr.open('GET', endpoint);
        xhr.send();
    };

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

    this.queryHiscores = function(callback) {
        this.httpGet(this._HISCORE_ENDPOINT, callback);
    };

    this.sendHiscore = function(user, num) {
        this.httpSend('PUT', this._HISCORE_ENDPOINT, {username: user, score: num}, function(response) {
            console.log('score sent ' + response);
        });
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
