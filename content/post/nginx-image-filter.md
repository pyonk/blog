---
date: 2016-07-15T15:28:45+09:00
draft: false
title: "nginxのimage_filterを使って画像を動的に縮小するには"
description: "nginxのimage_filterを使って画像を縮小します。まず、ソースからnginxをインストールします。"
categories:
  - "インフラ"
tags:
  - "nginx"
slug: "nginx-image-filter"
---

# image_filterを使えるようにモジュールを指定する

nginxをソースからインストールする際に`--with-http_image_filter_module`をつけてインストールします。

```bash
$ wget http://nginx.org/download/nginx-1.10.1.tar.gz
$ tar -xvzf nginx-1.10.1.tar.gz
$ cd nginx-1.10.1
$ ./configure --with-http_image_filter_module
$ make
$ sudo make install
```
ほかのオプションモジュールをつける場合は随時つけてください。

すでにnginxがインストールされている場合は、

```bash
$ sudo cp objs/nginx /usr/sbin/nginx
$ cat /var/run/nginx.pid
10576
$ sudo kill -USR2 10576
$ sudo kill -WINCH 10576
$ sudo kill -QUIT 10576
```

とすると今までの古いnginxのワーカープロセス、マスタープロセスをkillして、新しいnginxのマスタープロセス、ワーカープロセスが稼働するようになります。

# confを変更
image_filterを加えます。
くわしいことは[ここ](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html#image_filter)をみてください。

```nginx:hoge.conf
location ~ /image/(.*\.png)$ {
        alias /path/to/image/$1;
            image_filter resize 100 -; # 横幅100pxでリサイズする
}
```
とりあえず、これで/image配下のpngファイルはリサイズされて表示されるはずです。
