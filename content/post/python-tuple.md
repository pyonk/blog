---
date: 2017-01-05T15:05:43+09:00
draft: false
title: pythonでtupleをつくる
description: pythonでtupleを作るときにはまったこと
categories:
    - バックエンド
tags:
    - python
---

# pythonのthreadで引数を渡したい
[Djangoで時間のかかる処理をスレッド化して逃げ](http://d.hatena.ne.jp/salexkidd/20090918)ようとしたのですがうまくいかなかったのでメモ。

`threading.Thread`にはいくつか引数が渡せます。

* group
* target
* name
* args
* kwargs

詳しくは[ここ](http://docs.python.jp/2/library/threading.html)で。

で、スレッド化したい処理に引数を渡そうと思って下記のように実装しました。

```python
def command_execute(cmd):
    print cmd # ('s', 'l', 'e', 'e', 'p', ' ', '1', '0', ';', 'e', 'c', 'h', 'o', ' ', 'a', 'a', 'a')
    subprocess.Popen(cmd, shell=True)
    return

cmd = 'sleep 10;echo aaa'
t = threading.Thread(target=command_execute, args=(cmd))
t.daemon = True
t.start()
```

すると、printされた文字列が
`('s', 'l', 'e', 'e', 'p', ' ', '1', '0', ';', 'e', 'c', 'h', 'o', ' ', 'a', 'a', 'a')`
となるわけです。
何が起きてるんだ状態です。

調べてみると原因は「`args`にtupleを渡してあげる」というところにありました。

## pythonでtupleをつくる

`tuple = (1, 2)`

基本はこれ。

では、今回のように長さ1のtupleはどうやってつくるか

## 長さ1のtuple
`tuple = (1)`

**普通のpythonist**であればこれは違うとわかるでしょうが、これだと思うでしょう？

```python
tuple = (1)
print tuple # 1
print type(tuple) # <type 'int'>
```

なんですよね。

### どうするのか
`tuple = (1,)`

```python
tuple = (1,)
print tuple # (1,)
print type(tuple) # <type 'tuple'>
```

こうでした。

# けっか
```python
def command_execute(cmd):
    print cmd # sleep 10;echo aaa
    subprocess.Popen(cmd, shell=True)
    return

cmd = 'sleep 10;echo aaa'
t = threading.Thread(target=command_execute, args=(cmd,))
t.daemon = True
t.start()
```
こうしてあげることによって期待通りの動きをしてくれました。

tupleの作り方に注意しなさい的な記述をどこかで見たような気がしたのですが、すっかり失念しておりました。猛省。
