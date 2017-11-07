---
title: "sublimetextでvimを使いたい日本人にとっておそらく便利なパッケージをつくった"
date: 2017-10-18T10:23:34+09:00
draft: false
categories:
    - つくってみた
tags:
    - python
    - sublimetext
---

ぼくは普段からsublimetextを使っているのだけど  
（最近のアップデートでタイトルバーの色も変えられるようになってご機嫌）、vimに強い憧れがあって、使ってみたいなあと日頃から思っていた。  
vim使ってる人のプロフェッショナル感がすごい。  
sublでもとりあえずキーバインドはvimにして、触ってみよって思ってデフォルトでは無効になってる`Vintage`を有効化した。  

# Vintageの有効化
`Cmd + ,`でsublimetextの設定を開く。  
ここのVintageを消す。  
{{< img src="/blog/images/disabled-ime-command/Preferences-ignore-packages.png" title="vintage消す" width="550">}}  
有効化done  

# つかってみる
つかってみるとわかるんだけど、IMEがONの状態でINSERT MODEからCOMMAND MODEに移行するとIMEがONのままでコマンドを受け付けなくなるのですね  
{{< img src="/blog/images/disabled-ime-command/not-enabled-disabled-ime.gif" title="こんな具合ですね" width="550">}}  

INSERT MODEからCOMMAND MODEに移行するために`escape`を押下するんだけど、そのときにIMEをOFFにすれば良いですね。  
ちなみにgoogle日本語入力だとescapeを押下するときにIMEを無効にする設定があります。  

* [VimでNormalモード切り替え時にIMEをOFFにする、をMacでKarabiner無しで実現する 3](https://rcmdnk.com/blog/2017/03/12/computer-vim/)

<small>カラビナ使うっていう手もあるけど</small>


できればパッケージで完結したいなと思って色々調べたら似たようなのがありました。  
macではAppleScriptを使うみたいですね。  

* [SublimeText 3のVintageでコマンドモードの時にIMEをOffにするWin&Mac - Qiita](https://qiita.com/takao-s/items/aecb4076fe21b2803da3)

僕は拗らせているので、macのUS配列を使っているから上記のパッケージでは対応できず。  
タイトルでは作ってみたって書いたけど、実際は機能追加だけです。タイトル詐欺。  
で結果はこうなります。  
{{< img src="/blog/images/disabled-ime-command/enabled-disabled-ime.gif" title="こんな具合ですね" width="550">}}

# おソース

* [pyonk/DisabledIme](https://github.com/pyonk/DisabledIme)

こちらにおいてありますので、`git clone`してお使いくださいませ。

