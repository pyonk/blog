---
date: 2017-01-03T10:34:47+09:00
draft: false
title: Hugofyにプルリクおくってみた
description: Sublime Textのhugo用パッケージをつかってみたところ、うごかないようだったのでプルリク送ってみた。
categories:
  - してみた
tags:
  - sublimetext
  - hugo
slug: send-pullrequest-to-hugofy
---
2017年明けましておめでとうございます。

# 初プルリク

昨年末になんとなく[Hugofy](https://github.com/akmittal/Hugofy)にプルリクを送ってみました。

ぼくの環境(mac)ではうまくうごいたんだけど、いろいろバグがあるみたいで弾かれちゃった。残念。

## どうすればよかったのか

* Windows環境でのテスト
* typo確認

軽い気持ちでプルリク送るもんではないですね〜〜〜。

いい経験になりました。
Thank you [@akmittal](https://github.com/akmittal)



# ちなみに
macで動くやつはこちらにあるのでよければどうぞ。

[pyonk/Hugofy](https://github.com/pyonk/Hugofy)
少しだけ機能追加してます。

## 追加した機能
* `hugo serve`で立ち上げたサーバをkillする機能

* github pagesへのdeploy機能
    * settingに`Repository`を追加してからどうぞ


もうすこしちゃんと作りこんでから出直します。反省。
