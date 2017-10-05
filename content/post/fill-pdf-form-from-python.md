---
title: "pythonからpdfのフォームに入力する"
date: 2017-10-05T15:46:45+09:00
draft: false
categories:
    - バックエンド
tags:
    - python
---

# pythonからpdfのフォームに入力する（厳密には違う）
pythonでpdfのフォームに値を入力していく機能をつくりました。  
そもそもpdfにフォームなんて埋められるんだって知らなかったです。  
どうやら読み込み専用フォームとそうでないフォームがあるみたいです。  
書き込めるフォームであってもフォントの指定や色付けとかが難しそうだったので、フォームに入力しない形式で実装しました。  
なのでどちらにも対応できるような感じになってます。

## 事前準備
* reportlab
```
$ pip install reportlab
```

* PyPDF2
```
$ pip install pypdf2
```

## コード

```python
#! /usr/bin/python
# -*- coding: utf-8 -*-

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PyPDF2.pdf import PdfFileReader, PdfFileWriter
from io import BytesIO

title = 'title'
# fontを変更
pdfmetrics.registerFont(TTFont('Mplus1p-Light', 'static/font/Mplus1p/Mplus1p-Light.ttf'))
template_path = 'template.pdf'
# 読み込み
reader = PdfFileReader(template_path)
existing_page = reader.getPage(0)
page_width = existing_page.mediaBox.getWidth()
page_height = existing_page.mediaBox.getHeight()
# 直接フォームに入力するのではないのでstreamとしてもっておく
packet = BytesIO()
c = canvas.Canvas(packet, pagesize=A4)
c.setFont('Mplus1p-Light', 17)
# titleはセンタリング
c.drawCentredString(page_width / 2, page_height - 20, title)
# formfieldsを取得
fields = reader.trailer['/Root']['/AcroForm']['/Fields']
for f in fields:
    field = f.getObject()
    # formの位置情報。おそらく[左上x, 左上y, 右下x, 右下y]
    rect = field.get('/Rect', [0.0, 0.0])
    key = field.get('/T', '')
    c.setFont('Mplus1p-Light', 9)
    # 微調整
    c.drawString(float(rect[0]) + 3, float(rect[1]) + 3, key)
c.save()
# パケットの読み込みを先頭に戻す
packet.seek(0)
new_pdf = PdfFileReader(packet)
# テンプレートと書き込んだ内容をマージ
existing_page.mergePage(new_pdf.getPage(0))
# writerを用意
writer = PdfFileWriter()
writer.addPage(existing_page)
# 書き込み
with open('output.pdf', 'wb') as output_file:
    writer.write(output_file)
```

見てもらったらわかる通りフォームのある位置に文字列を描画した別のPDFと、テンプレートPDFを重ねている感じです。

### おまけ
ただフォームを埋めたいだけの場合


```python
#! /usr/bin/python
# -*- coding: utf-8 -*-

from PyPDF2.pdf import PdfFileReader, PdfFileWriter

template_path = 'template.pdf'
# 読み込み
reader = PdfFileReader(template_path)
existing_page = reader.getPage(0)
page_width = existing_page.mediaBox.getWidth()
page_height = existing_page.mediaBox.getHeight()
# formfieldsを取得
fields = reader.getFormTextFields()
# formの値を更新
for key in fields:
    fields[key] = key
# writerを用意
writer = PdfFileWriter()
# 上書き
writer.updatePageFormFieldValues(existing_page, fields)
writer.addPage(existing_page)
# 書き込み
with open('output.pdf', 'wb') as output_file:
    writer.write(output_file)
```
