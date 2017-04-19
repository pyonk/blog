---
date: 2017-02-06T12:28:58+09:00
draft: false
title: crontab -e と /etc/crontab の違い
categories:
    - バックエンド
tags:
    - cron
---


ふとした拍子にcronのログを見ていたら同じコマンドが実行されていたんですね。

```
$ less /var/log/cron
```

```
Feb  6 00:15:01 ip-000-00-00-000 CROND[16356]: (user) CMD (python /home/user/app/manage.py hogehoge)
Feb  6 00:15:01 ip-000-00-00-000 CROND[16357]: (user) CMD (user python /home/user/app/manage.py hogehoge)
```


##### 追記
*上記のコマンドの*  
*```user python /home/user/app/manage.py hogehoge```*  
*この部分、おかしいですね〜〜*  
*`/etc/crontab`の内容を何も考えずにコピーしちゃいました。*  
*`/etc/crontab`はユーザーを指定して記述するのに対して、`crontab -e`の場合はユーザーはログインユーザーとなるのでユーザーの記述はいらんのですね。猛省。*


# おかしいな〜おかしいな〜〜〜〜〜

こわいな〜こわいな〜〜〜〜。

何て思っていたんですが、そういえばcronの設定を二回したような気がしてきたので確かめてみました。

## /etc/crontab

まず初めにcronを設定したときはこのこをいじっていました。

```
$ sudo vim /etc/crontab
```
ですね。

## crontab -e

何を思ったのかこっちでも設定していたような気がしました。

```
$ crontab -l
```

で確認することができます。

案の定同じコマンドが同じ時間で実行されるように設定されておりました。

## この二つの違いはなんなんでしょうか

[こちら](http://superuser.com/questions/290093/difference-between-etc-crontab-and-crontab-e)がわかりやすいかと思います。

要するに、
`/etc/crontab`は他のユーザーのcronもまとめて設定できるようなのですね。

たとえば

```
* * * * * user echo 'fugafuga'
* * * * * user2 echo 'hogehoge'
```
のような感じです。

対して、`crontab -e`だと、今現在のユーザーのcronが設定できます。
オプションとして`-u`を指定すると指定されたユーザーのcronが設定できるようです。

`/etc/crontab`と`crontab -e`は別物なんですね。

さっきの例だと

```
$ sudo vim /etc/crontab
```

```
* * * * * user echo 'fugafuga'
* * * * * user2 echo 'hogehoge'
```
とするのと

```
$ crontab -e -u user
```

```
* * * * * echo 'fugafuga'
```
とするのと別のコマンドとして実行されるということです。

ややこしいですね〜〜。

# 最後に

`-e`と`-r`を間違えないようにしたいですね。

```
$ crontab -r
```

**crontabの設定全部消えちゃいます。**
