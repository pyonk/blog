---
title: "vimで手軽にscpが利用できるfunctionを作ってみた"
description: "vimで手軽にscpが利用できるfunctionを作ってみた"
date: 2018-01-21T23:15:25+09:00
draft: true
categories:
    - つくってみた
tags:
    - vim
    - vimscript
---

ようやくvimのキーバインドが手に馴染んできたなと思い始めてきた今日この頃です。
開発にあたって、VM上のファイルを編集したいのですが、毎回scpしてとか、netrwを使ってリモートをブラウジングしてとかが煩わしくて、vimのコマンドとしてscpできたらなあと思って色々調べました。
ローカルで編集したファイルをリモートに送るためのpluginは見つかりました。

* [zenbro/mirror.vim: Efficient way to edit remote files on multiple environments with Vim.](https://github.com/zenbro/mirror.vim)
使い方は上記を参考にどうぞ。
主に`:MirrorPush`を使ってます。
ただ、リモートの特定のファイルのみをローカルにもってきたかったのですが、そのような機能は見当たらなかったため、作ってしまえとなりました。

# how to use
```vimscript
let s:remote_settings = {
\    "sitea": {
\       "protocol": "sftp",
\       "addr": "remote_ip",
\       "identity_file": "",
\       "user": "remote_user",
\       "remote_path": "remote_path",
\       "local_path": "local_path",
\       "list_hide": ["\.pyc$"],
\   }
\}

function! s:RemoteScp(path, key)
    if has_key(s:remote_settings, a:key)
        let setting = s:remote_settings[a:key]
        let tmp = tempname()
        " pathが絶対パスでくるので必要ない部分を削除
        let path = substitute(a:path, setting.remote_path, "", "")
        let local_path = setting.local_path . path
        " tmpに対象を保存
        let scp_cmd = printf(":silent !scp %s@%s:%s%s %s", setting.user, setting.addr, setting.remote_path, path, tmp)
        " TODO yes no
        execute scp_cmd
        " tmpのファイルがアクセスできるようならば、local_pathに移動させる
        if filereadable(tmp)
            let mkdir_cmd = ":silent !mkdir -p " . fnamemodify(local_path, ":h")
            execute mkdir_cmd
            let mv_cmd = ":silent !mv " . join([tmp, local_path], " ")
            execute mv_cmd
            execute ":tabe " . local_path
            " NERDTreeを更新
            " execute ":NERDTreeTabs " . fnamemodify(local_path, ":h") . "/"
            execute ":redraw!"
        else
            execute ":redraw!"
            echo local_path . ": No such file or directory (remote scp)"
        endif
    endif
endfunction

" pathの補完機能
function! s:CompletionRemote(setting, lead)
    let setting = a:setting
    " ssh user@ipaddress ls -Adp
    let base_cmd = "ssh " . setting.user . "@" . setting.addr . " ls -Adp "
    " leadがremote_pathで始まっていないときは修正
    let lead = a:lead =~ "^" . setting.remote_path ? a:lead : setting.remote_path . a:lead
    let ls_cmd = base_cmd . lead . "*"
    let filter_cmd = printf('v:val =~ "^%s"', lead)
    " 表示させたくないものを弾く
    let grep_base_cmd = len(setting.list_hide) > 1 ? " | grep -v --regexp={%s}" : " | grep -v --regexp=%s"
    let grep_cmd = printf(grep_base_cmd, join(setting.list_hide, ","))
    " 候補の取得, list_hideがないならgrep_cmdは無視する
    let result = len(setting.list_hide) > 0 ? systemlist(ls_cmd . grep_cmd) : systemlist(ls_cmd)
    return filter(result, filter_cmd)
endfunction

" CompletionRemoteにどの設定を渡すかを決める, この例ではSiteAを渡す
function! s:CompletionRemoteSiteA(ArgLead, CmdLine, CursorPos)
    let ls_result = s:CompletionRemote(s:remote_settings['sitea'], a:ArgLead)
    return ls_result
endfunction

" SiteAscp
command! -nargs=? -complete=customlist,s:CompletionRemoteSiteA SiteAscp call s:RemoteScp(<q-args>, "sitea")
```

