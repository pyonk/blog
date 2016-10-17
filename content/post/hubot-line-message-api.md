---
date: 2016-10-17T10:38:19+09:00
draft: false
title: "hubot-line-message-apiをつくってみてます"
description: "line trial botからmessageAPIに移行しつつあるようなのでやってみました。"
categories:
  - つくってみた
tags:
  - coffeescript
  - hubot
  - line
slug: "hubot-line-message-api"
---
[https://github.com/pyonk/hubot-line-message-api](ここです。)
# 使い方
後でちゃんと書くけどとりあえずREADME（書きかけ）をあげとく。

# hubot-line-message-api
## できること
* 返信
    * テキスト
    [https://devdocs.line.me/ja/#text](https://devdocs.line.me/ja/#text)
    ```
    res.reply
        type: 'text'
        content: 'nyaa'
    ```
    * 画像
    [https://devdocs.line.me/ja/#image](https://devdocs.line.me/ja/#image)
    ```
    res.reply
        type:'image'
        content:
            original: 'https://example.com/images/image.jpg'
            preview: 'https://example.com/images/image.jpg'
    ```
    * ボタン
    [https://devdocs.line.me/ja/#buttons](https://devdocs.line.me/ja/#buttons)
    ```
    res.reply
        type: 'buttons'
        content:
            image: 'https://example.com/images/image.jpg'
            title: 'this is Buttons'
            text: 'buttons description'
            actions:[
                type: 'uri'
                label: 'Open in Browser'
                uri: 'http://example.com/
            ]
    ```

#️ 所感
hubotつかってlinebot作ろうと思ってたらtrialbotからmessageAPIになるとかだったので、hubotのアダプター作っちゃえってなって作ってみた。
タイトルにもある通り、まだ**作ってみている**最中なのでちゃんとnpmにあげられるくらいちゃんと作ってみたい。
とりあえず、最低限はできているような気もするので、公開してみる。
初めてcoffeescriptちゃんと触ったし、hubotのアダプターも初めて作るので探り探りすぎて疲れた^q^
けどたのしい。

