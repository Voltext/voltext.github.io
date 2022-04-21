const TWITCH_OAUTH_URL = "https://id.twitch.tv/oauth2/authorize";
const CLIENT_ID = "u713a9jtfrxyednavxtxmzdx7hd6g6"; //u713a9jtfrxyednavxtxmzdx7hd6g6 : Sowdred // 9hfoauyntbncj2cmnpvg28rd89j7er : Voltext
const REDIRECT_URI = "https://voltext.github.io/";
const RESPONSE_TYPE = "token";
const TOKEN = "9c3pmcn1m28hnfgfdttmokof138qnz"
const SCOPES = [
    "user:read:email",
    "channel:read:redemptions",
    "channel:manage:redemptions",
].join(" ");

function encodeQueryString(params) {
    let items = []
    for (let key in params) {
        let value = encodeURIComponent(params[key]);
        items.push(`${key}=${value}`);
    }
    return items.join("&");
}

function getUrlQueryStringParams() {
    const items = location.hash.slice(1).split("&");
    const params = {};

    for (let i in items) {
        let key = decodeURIComponent(items[i].split("=")[0]);
        let value = encodeURIComponent(items[i].split("=")[1]);
        params[key] = value;
    }

    return params;
}

function makeGetJsonRequest(url, params=null, headers=null) {
    if (params) {
        url = `${url}?${encodeQueryString(params)}`;
    }

    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    const responseJson = JSON.parse(xhr.responseText);
                    resolve(responseJson);
                } catch (error) {
                    reject(error);
                }
            }
        };

        xhr.onerror = reject;

        xhr.open("GET", url, true);

        if (headers) {
            for (let header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }

        xhr.send()
    });
}

function twitchAuthentification() {
    const params = {
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: RESPONSE_TYPE,
        scope: SCOPES,
    };
    location.href = `${TWITCH_OAUTH_URL}?${encodeQueryString(params)}`;
}

function twitchIsAuthenticated() {
    const params = getUrlQueryStringParams();
    if (params.access_token !== undefined) return true;
    return false;
}


function main() {
    if (!twitchIsAuthenticated()) {
        twitchAuthentification();
    }
    console.log("Connecté");
    const params = getUrlQueryStringParams();
    document.getElementById("token").innerHTML = params.access_token

    makeGetJsonRequest("https://api.twitch.tv/helix/channel_points/custom_rewards", {
            "broadcaster_id": 727375071,
        }, {
            "client-id": CLIENT_ID,
            "Authorization": `Bearer ${TOKEN}`,
        })
        .then(result => console.log(result))
        .catch(error => console.error(error));
}

window.onload = main;
