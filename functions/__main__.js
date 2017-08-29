// const message = require('../utils/message.js');
const request = require('request');

const ENV = {
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL || '',
};

/**
* This function recieves watch and fork events from GitHub and send a notification to your Slack channel. 
* 
* @returns {string}
*/
module.exports = (context, callback) => {
  const { sender, repository, action, forkee } = JSON.parse(context.params.payload);
  var text = 'ops! only watch events supported.';
  var icon = '';

  if (!ENV.SLACK_WEBHOOK_URL){
    new Error('missing environment variable SLACK_WEBHOOK_URL');
  }

  if (action){
    icon = ':star2:';
    text = `<${sender.html_url}|@${sender.login}> ${action} <${repository.html_url}|${repository.full_name}>`;  
  } else if (forkee){
    icon = ':fork_and_knife:';
    text = `<${sender.html_url}|@${sender.login}> forked <${repository.html_url}|${repository.full_name}>`;
  } else {
    return callback(null, text);
  }
  
  request.post({
    uri: ENV.SLACK_WEBHOOK_URL,
    body: JSON.stringify({
      username: 'stargazer-bot',
      text: text,
      icon_emoji: icon
    })
  }, (err, result) => {
    if (err) {
      return callback(err);
    }

    let body;
    try {
      body = JSON.parse(result.body);
    } catch (e) {
      body = {}
    }

    if (!body == 'ok') {
      return callback(new Error(body.error ? `Slack Error: ${body.error}` : `Invalid JSON Response from Slack: ${body}`));
    }

    callback(null, 'message sent');

  });
};
