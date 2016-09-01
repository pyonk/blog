---
date: 2016-08-30T10:48:43+09:00
draft: false
title: "javascriptのよくわからない書き方【連想配列編】"
description: "javascriptの連想配列に関して、よくわからない記法が出てきたので調査しました。"
categories:
  - フロントエンド
tags:
  - javascript
slug: "javascript-unknonwn-writing"
---


react + reduxでのアプリ開発に挑戦している際に、参考にしていたサイト様で、突然よくわからない記法が出てきたのでその備忘録に。

# 連想配列のなにかっぽい

```js
function myfunc(hoge, fuga) {
    var {hogehoge} = hoge;
    var {
        hogeKey: hogeValue,
    } = hogehoge || {
        hogeKey: '',
    }
    return {
        hogeKey,
    }
}
```

上記が件のコード。

# けっか
```js
var dict1 = {keyA: {key1: 1}};
var dict2 = {keyB: {key1: 2}};
var dict3 = {keyA: {key2: 3}};
var dict4 = {keyC: {key2: 4}};
function myfunc(hoge) {
    var {keyA} = hoge;
    console.log(keyA); //hoge.keyAの値
    console.log({keyA}); //keyAをキーに、keyAに代入されている値をバリューにした連想配列
    var {
        key1: key1,
    } = keyA || {
        key1: '',
    }
    console.log(key1); //keyAがundefinedであれば空文字、keyAがあれば、keyA.key1の値をkey1に代入する。keyA.key1がなければkey1=undefinedになる。
    return {
        key1, //key1をキーに、key1に代入されている値をバリューにした連想配列
    }
}
myfunc(dict1);
// {key1: 1}
// {keyA: {key1: 1}}
// 1
myfunc(dict2);
// undefined
// {keyA: undefined}
// ''
myfunc(dict3);
// {key2: 3}
// {keyA: {key2: 3}}
// undefined
myfunc(dict4);
// undefined
// {keyA: undefined}
// ''
```
書いててよくわからなくなってきた。

# つまり
## {keyA}=dict
連想配列(dict)のキー(keyA)を変数名にして、そのキーに対応する値(dict.keyA)を代入している。
### これって
```js
var dict = {keyA: 'keyAだよ'};
var keyA = dict.keyA;
```
と一緒ですね。

## {key1: key1} = dict || {key1: ''}
連想配列(dict)のキー(key1)を変数名にしてそのキーに対応する値(dict.key1)を代入する。ない場合はkey1に初期値(空文字)をしている。

### これって
```js
var dict = {key1: 'key1だよ'};
var key1 = dict.key1 ? key1: '';
```
と一緒ですね。

## return {key1}
変数(key1)をキーにして、変数(key1)に代入された値をバリューにした連想配列をリターンしている。

```js
var key1 = 'hogehoge';
return {key1}; // {key1: 'hogehoge'}
```

### これって
```js
var key1 = 'key1だよ';
return {key1: key1};
```
と一緒ですね。



**という見解であってるんでしょうか・・・。**
