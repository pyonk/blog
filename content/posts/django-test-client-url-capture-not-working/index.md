---
title: "Django Test Client Url Capture Not Working"
date: 2019-02-20T15:12:08+09:00
description: "DjangoのテストクライアントがURLの名前付きパラメータを取得できない件"
draft: false
author: pyonk
tags:
  - python
  - djnago
  - test
---

```python:urls.py
from django.urls import path
url_patterns = [
    path('users/<int:user_id>/', views.show, name='user_show'),
]
```


```python:tests.py
from django.test import TestCase, RequestFactory
from users import views
from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.messages.middleware import MessageMiddleware

class UserViewTestCase(TestCase):
    def setUp(self):
        self.request = RequestFactory()

    def test_access_user_page(self):
        user_id = 1
        req = self.request.get(
            reverse('user_show', args=(user_id,))
        )
        req.user = AnonymousUser()
        SessionMiddleware().process_request(req)
        MessageMiddleware().process_request(req)

        res = views.show(req)
        self.assertTrue(res.status_code, 302)
```


上記のようなテストコードがあったとすると
`views.show`で`self.kwargs['user_id']`が参照できないっていう状況に1時間くらいハマった

結論から言うと
`RequestFactory`は単純にrequestオブジェクトを作るだけなので、urlsとか関係なく
`views.show(req)`をテストしてるに過ぎないと言うことだった
なので
`views.show(req, user_id=user_id)`としてあげると良かったようだ


というかそもそも論だがurlsでルーティングしているのであれば
これだけで良かった


```python:test.py
from django.test import TestCase, Client
class UserViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_access_user_page(self):
        user_id = 1
        res = self.client.get(
            reverse('user_show', args=(user_id,))
        )
        self.assertTrue(res.status_code, 302)
```

RequestFactoryはあくまでもルーティングに定義していない時に使うようにしよう〜〜〜
ぼくつかれっちゃった
だれだよRequestFactoryとか教えたの
