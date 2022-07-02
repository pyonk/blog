---
title: "minio is awesome"
description: "S3使うにあたってローカル環境でもS3使わんといかんのかな〜って思って検索したらminioというS3互換のオブジェクトストレージがあった件"
cover: "posts/minio-is-awesome/images/minio_gui.png"
date: 2019-04-15T15:42:13+09:00
draft: false
author: pyonk
tags:
    - minio
    - infra
    - development
---

{{< tweet user="__pyonk__" id="1117441566258282496" >}}

以前GCSを使っているときにローカルでテストするたびにテストデータがGCS上に溜まっていくのが嫌だなあ〜って思ってた。

S3に鞍替えしようと思って少し調べてみると、S3互換のオブジェクトストレージがあるらしい。
docker-composeと相性も良さそうなので使ってみることにした。

ちなみにDjangoでウェブサイトを構築している。

## 下準備

```shell
$ pip install django-storages boto3
```

python側で追加インストール必要なのはこれだけで
あとはsettings.py

```python
# S3にアップロード
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = 'minio' # 自由に決めちゃっておk
AWS_SECRET_ACCESS_KEY = 'minio123' # 自由に決めちゃっておk
AWS_STORAGE_BUCKET_NAME = 'static' # 自由に決めちゃっておk
AWS_S3_ENDPOINT_URL = 'http://minio:9000/'
```


minio本体はdocker imageを利用するのが便利。

docker-compose.ymlに以下の記述を追加する。


```yaml
version: '3.2'
services:
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
    volumes:
      - type: volume
        source: minio
        target: /export
    environment:
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    command: server /export

volumes:
  minio:
```

これで`docker-compose up`するとminioが立ち上がるので
localhost:9000にアクセスして`static`バケットを作っておく。

準備は以上。簡単！！

## Uploader

以下のようなUploaderを用意しておけば

```python
from django.core.files.storage import default_storage

class Uploader:

    storage = default_storage
    filename = ''
    url = ''

    def __init__(self):
        pass

    def get_unique_filename(self, filename):
        return self.storage.get_available_name(filename)

    def upload(self, uploaded_file):
        self.filename = self.get_unique_filename(uploaded_file.name)
        with self.storage.open(self.filename, 'w') as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)
        self.url = self.storage.url(self.filename)
        return self.url
```

こんな感じで使うといい感じ。

```python
from django.core.files.uploadedfile import UploadedFile
from uploader import Uploader

test_file = open('./hoge.txt', 'r')
uploaded_file = UploadedFile(test_file)
uploader = Uploader()
uploader.upload(uploaded_file)
```

とっても便利なminioでした。

もちろん本番でS3使う場合は色々設定いじる必要があるけど
環境に応じて設定ファイルを使い分ければそんなに手間ではないかな。

https://stackoverflow.com/questions/4909958/django-local-settings/4909964#4909964
