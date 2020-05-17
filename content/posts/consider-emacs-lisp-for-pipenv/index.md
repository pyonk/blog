---
title: "emacs lispを紐解く"
description: "pipenvを使ってコード補完したいのでemacs lispを紐解いてみた件"
cover: ""
date: 2020-01-15T11:38:02+09:00
draft: false
author: pyonk
tags:
    - spacemacs
    - emacs lisp
---

```
結構前に書いてたやつがメモ帳に埋まってたので供養します
今はspacemacsじゃなくてneovimつかってる
```

普段spacemacsというエディタを使ってコードを書いているんだけど

pipenvを`$PIPENV_VENV_IN_PROJECT=1`で使ってるとうまく補完されないので悩んでた

少し調べると

- [pipenv directory .venv and pyvenv file .venv conflict · Issue #10293 · syl20bnr/spacemacs](https://github.com/syl20bnr/spacemacs/issues/10293#issuecomment-384337054)

がヒットした

提示されてたコードを設定ファイルに追記したらまあうまく動くんだけど、呪文やん？これ

きちんと理解しないと〜ということでemacs lispを紐解いて簡単にまとめた

- .venvがディレクトリか、ファイルかによって処理を変えてるだけ
- コードリーディング超大事


```lisp
    " spacemacs//pyvenv-mode-set-local-virtualenvという関数を定義
    (defun spacemacs//pyvenv-mode-set-local-virtualenv ()
      "Set pyvenv virtualenv from \".venv\" by looking in parent directories. handle directory or fil\
      " コマンドとして実行できるようにするやつおまじない的な詳しくは以下がとても参考になる
      " http://yhash.hatenablog.com/entry/2012/07/14/134732
      (interactive)
      " 変数root-pathに".venv"があるディレクトリを代入する
      " default-directoryから親方向に".venv"を探す なければnil
      (let ((root-path (locate-dominating-file default-directory
                                               ".venv")))
        " root-pathがnilではない時のみ実行
        (when root-path
          " file-pathに{root-path}/.venvの形で代入する
          (let* ((file-path (expand-file-name ".venv" root-path))
                 " 変数virtualenvに何を代入するか
                 (virtualenv
                  " .venvがdirectoryである場合はそのままfile-pathを代入
                  (if (file-directory-p file-path)
                      file-path
                    " directoryではない場合、file-pathの内容を読み取ってそれを代入
                    (with-temp-buffer
                      (insert-file-contents-literally file-path)
                      (buffer-substring-no-properties (line-beginning-position)
                                                      (line-end-position))))))
            " virtualenvがdirectoryなら
            (if (file-directory-p virtualenv)
                " pyvenv-activate を実行
                (pyvenv-activate virtualenv)
              " そうではないならpyvenv-workon を実行
              (pyvenv-workon virtualenv))))))
```
