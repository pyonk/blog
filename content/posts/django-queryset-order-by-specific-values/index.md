---
title: "djangoのquerysetを任意の順番でsortする"
description: ""
date: 2017-11-10T18:33:41+09:00
draft: false
categories:
    - バックエンド
tags:
    - django
    - python
slug: "django-queryset-order-by-specific-values"
---
# djangoのquerysetを任意の順番でsortする

djnagoでは`order_by('hoge')`とするとhogeの昇順でならんでいくことは当たり前のように知っているよね。

が、ぼくがやりたかったのは、任意の値でのソート。  
databaseに定義されてない値でソートしたかったのです。

とても参考になったstack overflowはこちら。  
[Django order_by specific order - Stack Overflow](https://stackoverflow.com/questions/10329849/django-order-by-specific-order)

> ただし`django >= 1.8`です

## TL;DR

```python
from djnago.db.models import Case, When, Value, FloatField

# { pid: specific_value, }
specific_values = {
  '1': 100.0,
  '2': 50.0,
  '3': 25.0,
  '4': 123.4,
  '5': 599.33,
}

# sqlのCASE式にしたい条件のリスト
cases = []

# casesにCASE式にしたい条件をつめていく
for pid, specific_value in specific_values.items():
    cases.append(When(id=pid, then=Value(specific_value)))

# Hogeモデルに対して、pidで絞り込んだあとにcasesをつかってspecific_valueについて注釈づけてorder_byする
Hoge.objects.filter(id__in=specific_values.keys()).annotate(specific_value=Case(
    *cases,
    output_field=FloatField()
)).order_by(specific_value)
```

## 詳しい説明
[Conditional Expressions | Django documentation | Django](https://docs.djangoproject.com/en/1.8/ref/models/conditional-expressions/)

## TIPS
* casesに条件をつめこむため、`Case`インスタンスを作成する際に、`*`で展開してあげないといけない。

ここだけ気をつければ非常に便利（使い所があまりないのが玉に瑕）。
