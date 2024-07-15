



(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ping = factory();
    }
}(this, function () {
    function request_image(url) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = function() { reject(url); };
            img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
        });
    }

    function ping(url, multiplier) {
        return new Promise(function(resolve, reject) {
            var start = (new Date()).getTime();
            var response = function() { 
                var delta = ((new Date()).getTime() - start);
                delta *= (multiplier || 1);
                resolve(delta); 
            };
            request_image(url).then(response).catch(response);

            setTimeout(function() { reject(Error('Timeout')); }, 5000);
        });
    }

    return ping;
}));

var do_ping = function() {
    ping(document.getElementById('playersJson').value).then(function(delta) {
        //document.getElementById('ilePing').innerHTML = "Server ping: " + delta + "ms";
    }).catch(function(error) {
        alert(String(error));
    });
};

const getBtn = document.getElementById('visualzBtn');
const visualzApi = () => {
    var visualzIpReplace = document.getElementById('visualzCfx').value;
    var visualzIP = visualzIpReplace.replace("cfx.re/join/", "");
    const xhr = new XMLHttpRequest();
    const url = `https://servers-frontend.fivem.net/api/servers/single/${visualzIP}`;
    xhr.open('GET', url);

    xhr.responseType = 'json';

    xhr.onload = () => {
        const data = xhr.response;
        var text = data['Data']['hostname'];
        var serverName = text.replace(/\^1/g, "").replace(/\^2/g, "").replace(/\^3/g, "").replace(/\^4/g, "").replace(/\^5/g, "").replace(/\^6/g, "").replace(/\^7/g, "").replace(/\^8/g, "").replace(/\^9/g, "").replace(/\^0/g, "");
        document.getElementById('serverName').innerHTML = "Server Name: " + serverName;

        var gamebuild = data['Data']['vars']['sv_enforceGameBuild'];
        document.getElementById('serverGamebuild').innerHTML = "Gamebuild: " + gamebuild;

        var playersOnline = data['Data']['clients'];
        var maxPlayers = data['Data']['sv_maxclients'];
        document.getElementById('serverPlayers').innerHTML = "Players: " + playersOnline + "/" + maxPlayers;

        var onesync = data['Data']['vars']['onesync_enabled'];
        document.getElementById('serverOnesync').innerHTML = "Onesync: " + onesync;

        var serverOwner = data['Data']['ownerProfile'];
        document.getElementById('serverOwner').innerHTML = "Owner Profile: " + serverOwner;

        var address = data['Data']['connectEndPoints']['0'];
        if (address !== undefined) {
            if (address.startsWith('http')) {
                const xhr2 = new XMLHttpRequest();
                const owner = data['Data']['ownerName'];
                const url2 = `https://${owner}-${visualzIP}.users.cfx.re/client`;
                xhr2.open('POST', url2, true);
                xhr2.responseType = 'json';
                xhr2.onload = () => {
                    const dataip = xhr2.response;
                    var ip = dataip[0];
                    document.getElementById('serverAddress').innerHTML = "Server Ip Address: " + ip;

                    var visualzIpxx = ip.split(":");
                    var ipx = visualzIpxx[0];
                    const xhr3 = new XMLHttpRequest();
                    const url3 = `http://ip-api.com/json/${ipx}`;
                    xhr3.open('GET', url3, true);
                    xhr3.responseType = 'json';
                    xhr3.onload = () => {
                        const dataip = xhr3.response;
                        var country = dataip['country'] || 'Timeout';
                        var isp = dataip['isp'] || 'Timeout';
                        var city = dataip['city'] || 'Timeout';

                        document.getElementById('serverCountry').innerHTML = "Country: " + country;
                        document.getElementById('serverISP').innerHTML = "ISP: " + isp;
                    };
                    xhr3.send();
                };
                xhr2.send('method=getEndpoints');
            } else {
                document.getElementById('serverAddress').innerHTML = "Server Ip Address - " + address;
                document.getElementById('playersJson').innerHTML = "Players json - <a href='http://" + address + "/players.json'>" + "http://" + address + "/players.json</a>";
                document.getElementById('dynamicJson').innerHTML = "Dynamic json - <a href='http://" + address + "/dynamic.json'>" + "http://" + address + "/dynamic.json</a>";
                document.getElementById('infoJson').innerHTML = "Info json - <a href='http://" + address + "/info.json'>" + "http://" + address + "/info.json</a>";
                var visualzIpxx = address.split(":");
                var ipx = visualzIpxx[0];
                const xhr4 = new XMLHttpRequest();
                const url4 = `http://ip-api.com/json/${ipx}`;
                xhr4.open('GET', url4, true);
                xhr4.responseType = 'json';
                xhr4.onload = () => {
                    const dataip = xhr4.response;
                    var country = dataip['country'] || 'Timeout';
                    var isp = dataip['isp'] || 'Timeout';
                    var city = dataip['city'] || 'Timeout';

                    document.getElementById('serverCountry').innerHTML = "Country: " + country;
                    document.getElementById('serverISP').innerHTML = "ISP: " + isp;
                };
                xhr4.send();
            }
        }
    };
    xhr.send();
}
getBtn.addEventListener('click', visualzApi);

do_ping();

// Simple login function for demonstration
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === "admin" && password === "password") {
        alert("Login successful!");
        document.getElementById('login-form').style.display = 'none';
        document.querySelector('.finder').style.display = 'flex';
    } else {
        alert("Invalid username or password");
    }
}
