# StdLib Stargazers :star2: Slack

This is a [stdlib](https://stdlib.com) serverless function which recieves GitHub stars events and sends it to a [Slack](https://slack.com) channel.

## Slack
 
Login into your Slack account to configure a new [app](https://slack.com/apps). Search for `Incoming WebHooks` and then click in **Add Configuration**.

<img width="1679" alt="slack search apps" src="https://user-images.githubusercontent.com/3514984/29948735-f99231ee-8e86-11e7-8f0d-8b5f1441eb8c.png">

Choose a channel where the notifications will arrive and confirm it clicking in **Add Incoming WebHooks integration**.

<img width="1678" alt="add incoming webhooks" src="https://user-images.githubusercontent.com/3514984/29948774-2b2b2f08-8e87-11e7-8644-60e213c4d79e.png">


Copy the **Webhook URL**, you will use it later in the app configuration. Click in **Save Settings**.

<img width="1004" alt="config incoming webhooks" src="https://user-images.githubusercontent.com/3514984/29948834-7f734ef6-8e87-11e7-94f3-f6d756be7629.png">

## StdLib

You need an __stdlib__ account and its CLI.

If you don’t have Node.js installed, download version v8.4.x or higher from the Node.js website. Once complete, open up your terminal and install the StdLib CLI.

```bash
$ npm install lib.cli -g
```


We need to create a directory for your StdLib services and initialize a workspace — you’ll be asked to log in with the account you already registered.

```bash
$ mkdir stdlib
$ cd stdlib
$ lib init
```

Once your workspace is initialized, you’re ready to create your StdLib service. Clone the repository 

```bash
$ STDLIB_USER=$(lib user | grep username | awk '{print $2}')
$ git clone https://github.com/cainelli/stargazers-slack.git $STDLIB_USER/stargazers-slack
```

Update the `env.json` file with the proper information.

```json
{
  "local": {},
  "dev": {
    "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/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",
    "GITHUB_SECRET": "secret"
  },
  "release": {
    "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/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",
    "GITHUB_SECRET": "secret"
  }
}
```

Finally you can start your dev environment running:

```bash
$ lib up dev
...
(default function)
------------------
url:      https://cainelli.lib.id/stargazers-slack@dev/
code:     lib.cainelli.stargazers-slack['@dev']()
shell:    lib cainelli.stargazers-slack[@dev]
context:  (enabled)
bg:       info
```

The url above we will use to create GitHub webhook.

## GitHub

Go to the **Settings** of your project repository and then **Webhooks** and click in **Add Webhook**. Configure as following:

**Payload URL:** The URL above from the output of `lib up dev`.

**Content type:** application/json.

**Secret:** The `GITHUB_SECRET` environment variables defined in `env.json` file.

**Let me select individual events:** watch, fork.

<img width="1678" alt="github webhook integration" src="https://user-images.githubusercontent.com/3514984/29948902-c84ab998-8e87-11e7-90b3-cdd4629cffe3.png">


Once you created the webhook you can :star2: star your repository and check on your Slack channel.


<img width="1379" alt="screen shot 2017-08-31 at 19 51 27" src="https://user-images.githubusercontent.com/3514984/29948923-dc682776-8e87-11e7-9577-7239acb9fed6.png">


