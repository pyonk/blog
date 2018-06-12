---
title: "Pycharmをアイコン化してデスクトップに配置する"
description: ""
date: 2018-06-12T18:01:31+09:00
draft: true
categories:
    - やってみた
tags:
    - pycharm
    - editor
slug: "pycharm-desktop-icon"
---

会社の先輩にオススメされてVM上の開発環境にPycharmをいれてみました。
terminalから起動してたのですが、不便だなあと感じ始めたため、デスクトップにおくようにしました。

# 以下作業メモ
pycharm本体は`/home/user/Desktop/pycharm-community-2018.1.3`にあります

```
#!/usr/bin/env xdg-open

[Desktop Entry]
Version=1.0
Type=Application
Name=PyCharm Community Edition
Icon=/home/user/Desktop/pycharm-community-2018.1.3/bin/pycharm.png
Exec="/home/user/Desktop/pycharm-community-2018.1.3/bin/pycharm.sh" %f
Comment=Develop with pleasure!
Categories=Development;IDE;
Terminal=false
StartupWMClass=jetbrains-pycharm-ce
```

desktopにあるアイコンをダブルクリックして信頼する的なボタンを押すとアイコン画像も更新されて、それ以降ダイアログも出なくなりました。

# 参考 
[UbuntuのランチャーへPyCharmを登録する – ngi644の日記](http://ngi644.net/blog/archives/1456)

