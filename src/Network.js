/**
 * Created by mlaux on 9/26/15.
 */
var StaticNetwork = function() {

    this._HISCORE_ENDPOINT = 'http://localhost:5000/assembly/api/hiscores';

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

    this.queryHiscores = function(callback) {
        this.httpGet(this._HISCORE_ENDPOINT, callback);
    };
};