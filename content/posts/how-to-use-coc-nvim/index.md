---
title: "coc.nvim is awesome"
aliases: /posts/how-to-use-coc-vim/
date: 2019-03-21T09:33:38+09:00
cover: "posts/how-to-use-coc-nvim/images/completion.png"
description: "coc.nvimがlanguage server clientとしてくっそ優秀だった件"
draft: false
author: pyonk
tags:
  - vim
  - plugin
  - language server
---


相変わらず飽きずにいろんなエディタに浮気しまくっているけど最近はvimが楽しい。

この間redditみてたら

- [python completion in coc.nvim + pyls : vim](https://www.reddit.com/r/vim/comments/b1yfsg/python_completion_in_cocnvim_pyls/)

こんなスレッドがあって

[coc.nvim](https://github.com/neoclide/coc.nvim)て見慣れないプラグインがあるなあと思ってみてみたら
わかりやすそうだし、MPLSもバッチリつかえるっぽいから使ってみた。


# インストール方法
僕はプラグインマネジャーにdeinを使ってるので

```toml:dein/plugins.toml
[[plugins]]
repo = 'neoclide/coc.nvim'
build = 'coc#util#install()'
hook_add = '''
  nmap <silent> gd <Plug>(coc-definition)
  nmap <silent> gy <Plug>(coc-type-definition)
  nmap <silent> gi <Plug>(coc-implementation)
  nmap <silent> gr <Plug>(coc-references)
  " Remap for rename current word
  nmap <leader>rn <Plug>(coc-rename)
  " Highlight symbol under cursor on CursorHold
  autocmd CursorHold * silent call CocActionAsync('highlight')
  " Use K for show documentation in preview window
  nnoremap <silent> K :call <SID>show_documentation()<CR>
  function! s:show_documentation()
    if &filetype == 'vim'
      execute 'h '.expand('<cword>')
    else
      call CocAction('doHover')
    endif
  endfunction
'''
```

これを記述する。


# extensionのインストール
わかりやすいなぁ〜って感じたのがextensionの存在。

- [Using coc extensions · neoclide/coc.nvim Wiki](https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions)

ここにだいたい書いてあるけど
`:CocInstall`コマンドを使っていろんなlanguage serverに対応できるよということらしい。

たとえば僕はpythonが好きなので

```
:CocInstall coc-pyls
```
とすればpylsに対応できるという優れもの（もちろん別途pylsのインストールは必要ではあるが）。

インストールできるextensionの一覧は
`:CocList extensions`で確認できる。


# MPLSと使用する
個人的にはpylsよりMPLSが使ってみたかった。
MPLSとは"M"icrosoftが作っている"P"ythonの"L"anguage "S"erverである。

- [Microsoft/python-language-server: Microsoft Language Server for Python](https://github.com/Microsoft/python-language-server)

VSCodeとかで使われているみたい。
以前VSCodeに浮気した時は、こんなにちゃんと(なにもしてないのに)補完できてしまうのか。。とびっくりした覚えがある。
上記ページにビルド方法が書いてあるのでやっておく。
そんなに時間はかからなかった。
できあがったものは
`python-language-server/output/bin/Debug/`とかにあるかな。

coc.nvimで便利なのがjson形式で独自のlanguage serverのサポートができることだ。
設定ファイルとしてデフォルトでは`$HOME/.config/nvim`（nvimではなくvimの場合は`$HOME/.vim`）以下の`coc-settings.json`を読み込んでくれる。
もちろんプロジェクト単位での設定も可能で、その場合はルートディレクトリに`.vim/coc-settings.json`を用意しておくと優先的に読み込んでくれる。

```json:coc-settings.json
{
  "suggest.timeout": 5000,
  "languageserver": {
    "MPLS": {
      "command": "dotnet",
      "args": [
        "exec",
        "path/to/Microsoft.Python.LanguageServer.dll"
      ],
      "filetypes": ["python"],
      "initializationOptions": {
        "interpreter": {
          "properties": {
            "InterpreterPath": "path/to/python",
            "DatabasePath": "path/to/MPLS/output/dir",
            "Version": "{python version}"
          }
        },
        "searchPaths": [
          "path/to/site-packages",
          "path/to/app_root"
        ],
        "testEnvironment": false,
        "analysisUpdates": true,
        "traceLogging": true,
        "asyncStartup": true,
      }
    }
  }
}
```

こんな感じにしとくとpythonファイルを読み込んだ時に自動でMPLSが立ち上がる。
ちなみにここら辺の設定のキーは`coc-json`をインストールしておくと補完可能である。便利。

