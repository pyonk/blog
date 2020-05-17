---
title: "pgcrypto for Django"
description: "pgcryptoで暗号化した件 in Django"
cover: ""
date: 2020-05-17T11:28:16+09:00
draft: false
author: pyonk
tags:
    - django
    - python
    - postgresql
---

Django, postgresで運用しているサービスで特定のカラムについて暗号化する必要が出てきたので調べてやってみました。

postgresの拡張機能である`pgcrypto`で暗号化します。
https://www.postgresql.jp/document/10/html/pgcrypto.html


## pgcryptoの有効化

_後述の通り`django-pgcrypto-fields`を使う場合はmigrationファイルがよしなにやってくれるので必要ないけど_

```sql
CREATE EXTENSION pgcrypto;
/* 確認 */
SELECT * FROM pg_extentions;
```

もし`lib/pgcrypto.so`がない場合は
`yum install postgresql-contrib`とかで用意しておく。

## django-pgcrypto-fieldsのインストール
Djangoとのやりとりは[django-pgcrypto-fields](https://github.com/incuna/django-pgcrypto-fields)を介して行うので
インストールする。
```bash
pip install django-pgcrypto-fields
```

## 鍵の作成
pgcryptoには共通鍵暗号方式による暗号化と公開鍵暗号方式による暗号化があって

今回は公開鍵暗号方式を採用したの処理を怠るとので鍵を用意する必要がある。

鍵の作成方法はdocumentにも書いてある通りGnuPGを使用する。

以下のコマンドでインタラクティブに鍵が作成できる。
```bash
gpg --gen-key
```

> 推奨するキー種類は「DSAとElgamal」です。  
> ― https://www.postgresql.jp/document/10/html/pgcrypto.html#id-1.11.7.35.7.19

らしい。

\* _ssh経由で鍵を作成する際、エントロピー不足で鍵の作成に時間がかかる(もしくは終わらない)場合があるけどその場合は[これ](https://serverfault.com/questions/214605/gpg-does-not-have-enough-entropy)で解決した_

作成できたら確認しよう。

```bash
gpg --list-secret-keys
```

確認時に表示される鍵IDで指定して公開鍵、秘密鍵をエクスポートする。

```bash
gpg -a --export KEYID > public.key
gpg -a --export-secret-keys KEYID > private.key
```


## settingsに記述
ここまでで下準備が完了！

次は`settigns.py`に必要な記述をしていく。

`PUBLIC_PGP_KEY_PATH`, `PRIVATE_PGP_KEY_PATH` はさっき作成した鍵を指定する。

`django-pgcrypto-fields`の説明のまんまだけど

```python
PUBLIC_PGP_KEY_PATH = os.path.abspath(os.path.join(BASEDIR, 'public.key'))
PRIVATE_PGP_KEY_PATH = os.path.abspath(os.path.join(BASEDIR, 'private.key'))

PUBLIC_PGP_KEY = open(PUBLIC_PGP_KEY_PATH).read()
PRIVATE_PGP_KEY = open(PRIVATE_PGP_KEY_PATH).read()

INSTALLED_APPS += ["pgcrypto"]
```

## 実際にコードに組み込む
こんな感じのコードがあったとして

```python
class User(models.Model):
    username = models.CharField(max_length=32)
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    email = models.EmailField()
```

以下のように書き換える。

```python
class User(models.Model):
    username = models.CharField(max_length=32)
    first_name = CharPGPPublicKeyField(max_length=32)
    last_name = CharPGPPublicKeyField(max_length=32)
    email = EmailPGPPublicKeyField()
```

それぞれのfieldに対応するfieldはこちら的なチャートがあるのでそこを参考にする。

https://github.com/incuna/django-pgcrypto-fields#django-model-field-equivalents

であとはmigrationファイルを作ってmigrateするだけなんだけど

**特にデータが入ってないなら問題ない！**

が！すでにデータが入っているとmigrationの過程で

カラムの型が`Charater`から`bytea`に変換されてしまい、取り返しのつかないことになってしまう。

ので作成されたmigrationファイルを編集していく。

## migrationの編集

`migration.RunPython`で変換していくと思うけど、(上の例みたいに)まとめて3つのカラムの型変換と値のUPDATEとかやってると`OperationalError: cannot ALTER TABLE "mytable" because it has pending trigger events.`で怒られるのでそれぞれ別のmigrationファイルに分けるとか、`atomic=False`とかする必要がある。（結構ハマった）

> トランザクション中の DDL 使用をサポートしているデータベース(SQLite や PostgreSQL)においては、RunPython は各マイグレーションに対して作成されたトランザクション以外に自動的にトランザクションを保持しません。そのため、例えば PostgreSQL では、スキーマ変更と RunPython を同一のマイグレーション内で結合させて用いるのは避けるべきであり、そうしなければ OperationalError: cannot ALTER TABLE "mytable" because it has pending trigger events のようなエラーに遭遇する可能性が有ります。  
> ― https://docs.djangoproject.com/ja/3.0/ref/migration-operations/#django.db.migrations.operations.RunPython

あとスキーマ変更で気をつける点としては対象カラム内のデータに`\`が含まれてると`Error: invalid input syntax for type bytea`がでるので
エスケープ処理`s/\/\\/` しておく。

流れ的には
1. エスケープ
2. 変換対象のキャッシュ
3. スキーマ変更
4. 2のキャッシュから更新

っていう感じで結構な力技になってしまった。

----- 
以上です。

あとはあんまり暗号化とか意識しなくて普通に使用するだけでよいので楽ちんでした。

ありがたい。

