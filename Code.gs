var slackWebhookUrl = 'https://hooks.slack.com/services/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';

var consumer_key = '5BkXd8dDNTXRnRBWL09AEpYp8';
var consumer_secret = 'u4U7CYI9KO9fSwkC1ocDbjxh3sBbOvIdsWFETBDHsm59cfs28y';

var search_keyword = 'Anime_Intro -rt';

function searchTweetsApps() {
  // ①Twitter Bearerトークンの取得（検索APIの呼び出しに必要）
  // POST oauth2/token  https://developer.twitter.com/en/docs/basics/authentication/api-reference/token
  var blob = Utilities.newBlob(consumer_key + ':' + consumer_secret);
  var credential = Utilities.base64Encode(blob.getBytes());

  var formData = {
    'grant_type': 'client_credentials'
  };

  var basic_auth_header = {
    'Authorization': 'Basic ' + credential
  };

  var options = {
    'method': 'post',
    'contentType': 'application/x-www-form-urlencoded;charset=UTF-8',
    'headers':  basic_auth_header,
    'payload': formData,
  };

  var oauth2_response = UrlFetchApp.fetch('https://api.twitter.com/oauth2/token', options);
  var bearer_token = JSON.parse(oauth2_response).access_token;

  // ②Twitter 検索APIの呼び出し
  // GET https://api.twitter.com/1.1/search/tweets.json
  var bearer_auth_header = {
    'Authorization': 'Bearer ' + bearer_token
  };

  var search_response = UrlFetchApp.fetch(
    'https://api.twitter.com/1.1/search/tweets.json?q=' + search_keyword + '&lang=ja&result_type=recent&count=1',
    { 'headers': bearer_auth_header });
  result = JSON.parse(search_response);

  // ③Slackに通知  Incoming Webhook
  result.statuses.forEach(function(status) {
    var data = {
      'text': '-----------------------------------------\n' +
      status.text +
      '\n----------------------------------------\n' +
      status.created_at +
      '\nby ' +
      status.user.name,
    };

    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data)
    };

    UrlFetchApp.fetch(slackWebhookUrl, options);
  });
}
