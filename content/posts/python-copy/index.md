---
date: 2017-01-12T18:21:36+09:00
draft: false
title: pythonの参照渡しをどうすれば回避できるのか
categories:
    - バックエンド
tags:
    - python
---

ときたまpythonを書いているとこれって値渡しなんだっけ、参照渡しなんだっけと分からなくなります。
たとえば
```python
hoge = {1:1, 2:2, 3:3}
print id(hoge) # 140418104920496

fuga = hoge
print id(fuga) # 140418104920496

fuga.update({
    4:4
})

print hoge == fuga # True
```

[Pythonistなら常識](http://note.crohaco.net/2014/python-argument-intro/)ですよね。

# どうすれば回避できるのか

割と単純です。

```python
hoge = {1:1, 2:2, 3:3}
print id(hoge) # 140418104920496

fuga = hoge.copy()
print id(fuga) # 140418107009728

fuga.update({
    4:4
})

print hoge == fuga # False

print hoge # {1:1, 2:2, 3:3}

print fuga # {1:1, 2:2, 3:3, 4:4}
```

辞書の浅いコピーを取るには`copy_dict = dict.copy()`が簡単ですね。

*ちなみに、リストの場合は`copy_list = original_list[:]`でコピーが取れます。*

ただこれだと浅いコピーになります。


なので

```python
hoge = {1:{2:2, 3:3}}
print id(hoge) # 140418104920496

fuga = hoge.copy()
print id(fuga) # 140418107009728

fuga[1].update({
    4:4
})

print hoge == fuga # True

print hoge # {1: {2: 2, 3: 3, 4: 4}}

print fuga # {1: {2: 2, 3: 3, 4: 4}}
```

となってしまいます。

浅いコピーの場合は

* 元のオブジェクト中に見つかったオブジェクトに対する 参照 を挿入

するようです。


# 深いコピー
上記の通り、オブジェクトの中のオブジェクトは参照渡しになります。

それを回避するために、copyモジュールをimportして、深いコピーを利用します。

```python
import copy

hoge = {1:{2:2, 3:3}}
print id(hoge) # 140418104920496

fuga = copy.deepcopy(hoge)
print id(fuga) # 140418107009728

fuga[1].update({
    4:4
})

print hoge == fuga # False

print hoge # {1: {2: 2, 3: 3}}

print fuga # {1: {2: 2, 3: 3, 4: 4}}
```

あら素敵。

結構厄介な場面も多いのできちんと覚えたいものです。

## 参考
[8.17. copy — 浅いコピーおよび深いコピー操作 — Python 2.6ja2 documentation](http://docs.python.jp/2.6/library/copy.html)

