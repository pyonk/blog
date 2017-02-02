---
date: 2017-02-02T18:40:16+09:00
draft: false
title: あ！ やせいの requests.exceptions.SSLErrorが とびだしてきた！
description: あ！ やせいの requests.exceptions.SSLErrorが とびだしてきた！ pyonk は どうする？
categories:
    - バックエンド
tags:
    - python
slug: yasei-no-sslerror
---

あるサイトをクロールして情報を集めようと思ってpythonでプログラムを書いていたのですが、思わぬところでハマったので備忘録代わりに。

# ナゾのrequests.exceptions.SSLError
それなりにpythonの[requests](http://docs.python-requests.org/en/master/)をつかってクローラーを書いていたのですぐできるワイヤ。と思っていたのですが、実行した途端にナゾの`requests.exceptions.SSLError`が発生しました。

```
requests.exceptions.SSLError: hostname 'damedayo.com' doesn't match either of 'www.kore.com', 'kore.com'
```

おやおや、SSLErrorですから、なにかセキュリティ周りのエラーであることが予測できます。
さらにホスト名が違うことから、バーチャルホストを利用しているためにSSL証明書のhostが違うよっていうことなんでしょうか。

とりあえず`verify=False`を指定しても一度チャレンジです。

```
import requests
 
req = requests.get('https://damedayo.com/', verify=False)
print req.text
```

するとresponseが帰ってきました。
```
The client software did not provide a hostname using Server Name Indication (SNI), which is required to access this server. 
```

はーーーーんんんんんんん

何はともあれ、ググります。

[みっけた](http://docs.python-requests.org/en/latest/community/faq/#what-are-hostname-doesn-t-match-errors)。

ん〜〜〜やはりバーチャルホスト周りっぽい。
というか**pythonのバージョンが`2.7.9`以上であれば問題ないんか**。コレ。

解決策として[Stack Overflowへのリンク](https://stackoverflow.com/questions/18578439/using-requests-with-tls-doesnt-give-sni-support/18579484#18579484)が貼ってありますね。こういうこともあるのね。初めて見た。

# pip install pyOpenSSLで詰む
pyOpenSSLとidnaをインストールしてあげるとよいよってあるのでやってみました。

idnaはすっきり入ってくれたのですがpyOpenSSLが上手くいかない。。(すでに入っていたためバージョンをあげています。)
```
$ pip install pyOpenSSL --upgrade
.....前略.....
1 warning and 20 errors generated.
error: command 'cc' failed with exit status 1

----------------------------------------
Failed building wheel for cryptography
.....中略.....
----------------------------------------
Command "/usr/bin/python -c "import setuptools, tokenize;__file__='/private/tmp/pip-build-OtiuE0/cryptography/setup.py';exec(compile(getattr(tokenize, 'open', open)(__file__).read().replace('\r\n', '\n'), __file__, 'exec'))" install --record /tmp/pip-1pK2m3-record/install-record.txt --single-version-externally-managed --compile" failed with error code 1 in /private/tmp/pip-build-OtiuE0/cryptography
```

gccがないよっていうのは見たことありましたが、ccがないよって初めて見ました。

ともあれcryptographyのインストールに失敗しているみたいです。

ぐぐります。

例によって[Stack Overflow](http://stackoverflow.com/questions/22073516/failed-to-install-python-cryptography-package-with-pip-and-setup-py)です。

## openSSLのアップデートで詰まる
openSSLのバージョンが古いのかもと思ってアップデートしました。

```
$ brew upgrade openssl
$ brew link openssl --force
Warning: Refusing to link: openssl
Linking keg-only openssl means you may end up linking against the insecure,
deprecated system OpenSSL while using the headers from Homebrew's openssl.
Instead, pass the full include/library paths to your compiler e.g.:
  -I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib
$ which openssl
/usr/bin/openssl
```

ウーーン詰まる詰まる。

いまはこの方法で[opensslへのリンクがはれない](http://qiita.com/dasisyouyu/items/c9621c29b0fe79d2b7c4)ようです。。

PATHを通してあげます。
```
export PATH="/usr/local/opt/openssl/bin:$HOME/.pyenv/bin:$PATH"
```

確認します。

```
$ which openssl
/usr/local/opt/openssl/bin/openssl
```

つぎ！

## pipのアップデート
さきほどのStack Overflowでは、pipのバージョンあげなよとあったのでアップデートです。
```
$ pip install --upgrade pip
```
さっくり詰まることなくクリアしました。

## そして大本営に突撃
ようやくcryptograph(おぼえた)をインストールする手はずが整いました。

```
$ pip install pyOpenSSL --upgrade
```

ばっちり！！アップデートできたっぽい！！！！

いざ！！
```
import requests
 
req = requests.get('https://damedayo.com/', verify=False)
print req.text
```

```
Traceback (most recent call last):
  File "eroge_translation_helpman.py", line 3, in <module>
    import requests
  File "/Library/Python/2.7/site-packages/requests/__init__.py", line 52, in <module>
    from .packages.urllib3.contrib import pyopenssl
  File "/Library/Python/2.7/site-packages/requests/packages/urllib3/contrib/pyopenssl.py", line 48, in <module>
    from cryptography import x509
  File "/Library/Python/2.7/site-packages/cryptography/x509/__init__.py", line 7, in <module>
    from cryptography.x509.base import (
  File "/Library/Python/2.7/site-packages/cryptography/x509/base.py", line 15, in <module>
    from cryptography.hazmat.primitives.asymmetric import dsa, ec, rsa
  File "/Library/Python/2.7/site-packages/cryptography/hazmat/primitives/asymmetric/rsa.py", line 14, in <module>
    from cryptography.hazmat.backends.interfaces import RSABackend
  File "/Library/Python/2.7/site-packages/cryptography/hazmat/backends/__init__.py", line 7, in <module>
    import pkg_resources
  File "/Library/Python/2.7/site-packages/pkg_resources/__init__.py", line 72, in <module>
    import packaging.requirements
  File "/Library/Python/2.7/site-packages/packaging/requirements.py", line 59, in <module>
    MARKER_EXPR = originalTextFor(MARKER_EXPR())("marker")
TypeError: __call__() takes exactly 2 arguments (1 given)
```

・・・・・・・・・・・。

もう。

ぐぐります・・・・・。

見つけました。[Stack Overflow](http://stackoverflow.com/a/41841210)本当にありがとう。

setuptoolsが原因だったみたいですね。バージョンによってはエラーが出るようです。

```
$ pip install setuptools == 33.1.1
```

ということでこれでようやくプログラムを書き進められそうです。

# さいごに
というか`/etc/hosts`をかえたらできたのではないか疑惑が・・・。

さすがにないかしら。今度時間があったら試してみるでござる。
