// const message = require('../utils/message.js');
const request = require('request');
const crypto = require('crypto');

const ENV = {
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL || '',
  GITHUB_SECRET: process.env.GITHUB_SECRET || '',
};

/**
* This function recieves watch and fork events from GitHub and send a notification to your Slack channel. 
* 
* @returns {any}
*/
module.exports = (context, callback) => {
  if (!ENV.SLACK_WEBHOOK_URL || !ENV.GITHUB_SECRET){
    return callback(new Error('missing environment variables'));
  }

  const { sender, repository, action, forkee } = context.params;
  const { headers } = context.http;
  const srvSignature = 'sha1=' + crypto.createHmac('sha1', ENV.GITHUB_SECRET).update(JSON.stringify(context.params)).digest('hex');
  const gitSignature = headers['x-hub-signature']

  const signatureIsValid = crypto.timingSafeEqual(Buffer.from(srvSignature, 'utf8'), Buffer.from(gitSignature, 'utf8'))
  
  if (signatureIsValid){
    var text = 'ops! only watch events supported.';
    var icon = '';

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
  } else {
    return callback(new Error('invalid signature'));
  };
};
