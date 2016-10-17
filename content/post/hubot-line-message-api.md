---
date: 2016-10-17T10:38:19+09:00
draft: false
title: "hubot-line-message-apiをつくってみてます"
description: "Line BotのBOT API TrialよりリッチなMessaging APIをHubotのアダプター作りつつ、試してみました。"
categories:
  - つくってみた
tags:
  - coffeescript
  - hubot
  - line
slug: "hubot-line-message-api"
---
[ここです。](https://github.com/pyonk/hubot-line-message-api)

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
まだreplyメッセージのみの対応です。そのうちpushメッセージも手をつけようと思います。

* 返信
    * テキスト [https://devdocs.line.me/ja/#text](https://devdocs.line.me/ja/#text)

    ```
    res.reply
        type: 'text'
        content: 'nyaa'
    ```

* 画像 [https://devdocs.line.me/ja/#image](https://devdocs.line.me/ja/#image)
    * 画像はhttpsでないとline側で弾かれます。

    ```
    res.reply
        type:'image'
        content:
            original: 'https://example.com/images/image.jpg'
            preview: 'https://example.com/images/image.jpg'
    ```

* ボタン [https://devdocs.line.me/ja/#buttons](https://devdocs.line.me/ja/#buttons)

    ```
    res.reply
        type: 'buttons'
        content:
            image: 'https://example.com/images/image.jpg'
            title: 'this is Buttons'
            text: 'buttons description'
            actions: [
                type: 'uri'
                label: 'Open in Browser'
                uri: 'http://example.com/'
            ]
    ```

* カルーセル [https://devdocs.line.me/ja/#carousel](https://devdocs.line.me/ja/#carousel)
    * `content.length <= 5`である必要があります。`> 5`の場合line側で怒られます。
    * `type: 'postback'`に関してはまだ試してないのでわかりません。そのうちやります。

    ```
    res.reply
        type: 'carousel'
        content:[
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

# 所感
hubotつかって新しくlinebot作ろうと思ってたらBOT API TrialからよりリッチなMessaging APIが発表されたらしいので、hubotのアダプター作っちゃえってなって作ってみた。<br>
タイトルにもある通り、まだ**作ってみている**最中なのでちゃんとnpmにあげられるくらいちゃんと作ってみたい。<br>
とりあえず、最低限はできているような気もするので、公開してみる。<br><br>
初めてcoffeescriptちゃんと触ったし、hubotのアダプターも初めて作るので探り探りすぎて疲れた^q^<br><br>
けどたのしい。<br><br><br>
後から気づいたけど`message-api`でなくて`messaging-api`だったね。
