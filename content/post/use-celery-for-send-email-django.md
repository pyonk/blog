---
date: 2017-01-06T12:05:29+09:00
draft: false
title: Djangoでどうしても非同期でコマンドを実行したくなった
categories:
    - バックエンド
tags:
    - python
    - django
---

# 経緯
あるサイトで、顧客に新情報をメールでお知らせしたいときに、今まではコマンド叩いて送信していたのですが、結構面倒なのでブラウザからできないものかと試行錯誤していたのです。

コマンドの設計見直せっていうのは今回は置いといてください・・・。

# どうしたのか
いくつかの方法を試しました。

## pythonからコマンドを叩く
まず思い浮かんだのがコマンドを`nohup &`でpythonから叩く。

```
import subprocess
import shlex

cmd = 'nohup sleep 10 &'
subprocess.Popen(cmd)
```

が！！！
レスポンスが帰ってくるのは10秒後・・・。

つぎ！

## thread化して逃げる
この前書いたような感じです。  

[pythonでtupleをつくる - わいがかいた](https://pyonk.github.io/blog/post/python-tuple/)

結局、レスポンスが帰ってくるのは10秒後・・・。
ここ工夫するとどうにかなるような気もする。

つぎ！！

## celeryを使う

[Celery - Distributed Task Queue — Celery 4.0.2 documentation](http://docs.celeryproject.org/en/latest/index.html)

ようやく本題。

ググり始めた当初から名前を見かけてはいましたが敷居が高そうなのでスルーしてました。

~~実際やりはじめて少し後悔しましたし。~~

結構面倒くさかったので備忘録代わりに。

### install
まずは本体をインストールしていきます。

`pip install -U Celery`

celeryはbrokerとして
* Redis
* RabbitMQ
* Amazon SQS

などを使うことができます。
今回はRedisを選択しました。

`yum install redis`

bundleも用意されているのでそれも。

`pip install -U "celery[redis]"`

### how to

[ここ](https://github.com/celery/celery/tree/master/examples/django/)を参考にモリモリかいていきます。

proj/\_\_init\_\_.py
```
from __future__ import absolute_import, unicode_literals

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery import app as celery_app

__all__ = ['celery_app']
```

proj/settings.py
```
# Celery settings

CELERY_RESULT_BACKEND = 'redis' # redisを指定
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']
```

proj/celery.py
```
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proj.settings')

app = Celery('proj')

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
```

app/tasks.py
```
#! /usr/bin/python
# -*- coding: utf-8 -*-
# Create your tasks here
from __future__ import absolute_import, unicode_literals
# from celery import shared_task
from celery.decorators import task
import time


@task()
def add_wait(x, y):
    time.sleep(10)
    return x + y
```

app/views.py
```
from tasks import add_wait
def add_some_number.delay(request):
    result = add_wait(2,3)
    return render(rerquest, 'result.html', {
        'result': result,
    })
```

#### うごかしていきます

* redisの起動

`sudo /etc/init.d/redis start`

* celeryの起動

`celery -A proj worker`

僕の環境はpythonのバージョンが`2.7.6`なのですが、それだとエラーがおきます。

というのもamqpというライブラリの中で使われている`struct.pack`が原因のようです。

[struct Type Error when consume internal log message. · Issue #609 · celery/kombu](https://github.com/celery/kombu/issues/609)をみるとスッキリします。

どうやらpythonのバグのようですね。  
[Issue 19099: struct.pack fails first time with unicode fmt - Python tracker](https://bugs.python.org/issue19099)

該当箇所を`str`に変えてしまうと無事起動しました。

疲れました。
