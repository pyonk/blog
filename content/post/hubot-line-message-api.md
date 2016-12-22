---
date: 2016-10-17T10:38:19+09:00
draft: false
title: hubot-line-message-apiをつくってみてます
description: Line BotのBOT API TrialよりリッチなMessaging APIをHubotのアダプター作りつつ、試してみました。
categories:
  - つくってみた
tags:
  - coffeescript
  - javascript
  - hubot
  - line
slug: hubot-line-message-api
---
ソースは[ここです。](https://github.com/pyonk/hubot-line-message-api)

# 使い方
`$ git clone https://github.com/pyonk/hubot-line-message-api.git`

からの

```json:package.json
"dependencies": {
    "bar": "file:./hubot-line-message-api"
}
```

からの

`$ hubot -a line-message-api`

でいけると思います。

# hubot-line-message-api
結構ガバガバ実装なので[API Reference](https://devdocs.line.me/ja/)をしっかり読んでからやるのをオススメします。
## 設定
### 必須
* LINE_CHANNEL_ACCESS_TOKEN
    * lineアカウントのBasic Infomationにある`Channel Access Token`の値を設定してください。

### 任意
* HUBOT_ENDPOINT
    * defaultで/hubot/incomingになってます。
    * 自由に設定していただいて大丈夫です。
* FIXIE_URL
    * herokuで走らす場合は必須かなと思います。
    * [Fixie](https://elements.heroku.com/addons/fixie)というアドオンを使います。
    * `$ heroku addons:create fixie:tricycle`を叩くと自動で設定されています。
    * 出力されるIPアドレスを`Server IP Whitelist`に設定してあげてください。

## できること
今のところpushで送信は対応できておらず、返信しかできません。

* 返信
    * テキスト

    [https://devdocs.line.me/ja/#text](https://devdocs.line.me/ja/#text)

    ```coffee
    module.exports = (robot) ->
        robot.hear /^テキスト$/, (res) ->
            res.reply
                type: 'text'
                contents: ['nyaa']
    ```
    * 画像と動画

    [https://devdocs.line.me/ja/#image](https://devdocs.line.me/ja/#image)
    [https://devdocs.line.me/ja/#video](https://devdocs.line.me/ja/#video)

    ```coffee
    module.exports = (robot) ->
        robot.hear /^画像$/, (res) ->
            res.reply
                type:'image'# 'video'
                content: [
                    original: 'https://example.com/images/image.jpg'
                    preview: 'https://example.com/images/image.jpg'
                ]
    ```
    * ボタン

    [https://devdocs.line.me/ja/#buttons](https://devdocs.line.me/ja/#buttons)

    ```coffee
    module.exports = (robot) ->
        robot.hear /^テキスト$/, (res) ->
            res.reply
                type: 'buttons'
                altText: 'hogehoge'
                contents: [
                    image: 'https://example.com/images/image.jpg'
                    title: 'this is Buttons'
                    text: 'buttons description'
                    actions:[
                        type: 'uri'
                        label: 'Open in Browser'
                        uri: 'http://example.com/'
                    ]
                ]
    ```
    * カルーセル

    [https://devdocs.line.me/ja/#carousel](https://devdocs.line.me/ja/#carousel)

    ```coffee
    module.exports = (robot) ->
        robot.hear /^カルーセル$/, (res) ->
            res.reply
                type: 'carousel'
                altText: 'hogehoge'
                contents: [
                    image: 'https://example.com/images/image.jpg'
                    title: 'this is Buttons'
                    text: 'buttons description'
                    actions:[
                        type: 'uri'
                        label: 'Open in Browser'
                        uri: 'http://example.com/'
                    ],
                    image: 'https://example.com/images/image.jpg'
                    title: 'this is Buttons'
                    text: 'buttons description'
                    actions:[
                        type: 'uri'
                        label: 'Open in Browser'
                        uri: 'http://example.com/'
                    ]...
                ]
    ```
    * くみあわせ

    ```coffee
    module.exports = (robot) ->
        robot.hear /^くみあわせ$/, (res) ->
            res.reply {
                type: 'text'
                contents: ['nyaa']
            },
            {
                type: 'buttons'
                contents: [
                    image: 'https://example.com/images/image.jpg'
                    title: 'this is Buttons'
                    text: 'buttons description'
                    actions: [
                        type: 'uri'
                        label: 'Open in Browser'
                        uri: 'http://example.com/'
                    ]
                ]
            }
    ```

# 注意点
* `contents.length <= 5`にしないとLINEに怒られます。
    * くみあわせて使う場合はcontents.lengthを足し算した値が5を超えないようにしないと怒られます。
* 画像のURLなどはhttpsでないと怒られます。

# 所感
hubotつかって新しくlinebot作ろうと思ってたらBOT API TrialからよりリッチなMessaging APIが発表されたらしいので、hubotのアダプター作っちゃえってなって作ってみた。<br>
タイトルにもある通り、まだ**作ってみている**最中なのでちゃんとnpmにあげられるくらいちゃんと作ってみたい。<br>
とりあえず、最低限はできているような気もするので、公開してみる。<br><br>
初めてcoffeescriptちゃんと触ったし、hubotのアダプターも初めて作るので探り探りすぎて疲れた^q^<br><br>
けどたのしい。<br><br><br>
後から気づいたけど`message-api`でなくて`messaging-api`だったね。
