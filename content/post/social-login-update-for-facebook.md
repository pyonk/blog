---
title: "Facebookのためにsocial loginをごにょごにょした話"
description: "Facebookのためにsocial loginをごにょごにょした話"
date: 2017-12-20T13:54:50+09:00
draft: false
categories:
    - バックエンド
tags:
    - facebook
    - django
    - python
slug: "social-login-update-for-facebook"
---

facebookに見慣れぬアラートが。
{{< img src="/blog/images/social-login-update-for-facebook/alert.png" title="突然のアラート" width="550">}}  

> In 90 days, we're making a security update to Facebook Login that will invalidate calls from URIs not listed in the Valid OAuth redirect URIs field of your Facebook Login settings.  
This update comes in response to malicious activity we saw on our platform, and we want to protect your app or website by requiring a new strict mode for redirect URIs. Take action now to ensure your redirect traffic continues to work. Learn More
{{< img src="/blog/images/social-login-update-for-facebook/message.png" title="難しい英文" width="550">}}  


モニョモニョ言ってた。
要するに90日以内にstatic modeにしないとだめだよってことかな

いい機会なので見直すことにした。

## python-social-authに乗り換えた
* まず、メンテされていなかった[omab/django-social-auth: Django social authentication made simple](https://github.com/omab/django-social-auth)から[python-social-auth/social-app-django: Python Social Auth - Application - Django](https://github.com/python-social-auth/social-app-django)
に乗り換えた。
    * [ドキュメント](http://python-social-auth.readthedocs.io/en/latest/index.html)よんで、もろもろの`settings.py`の設定変更

## ソース読んで見た
* ソースを読んでみたけど、facebookに対して何か特別なoptionがあるわけではなく、現状対応できてないっぽい。
    * issueにあがってた
        * [social_core.backends.facebook.FacebookOAuth2 should have REDIRECT_STATE set to False · Issue #141 · python-social-auth/social-core](https://github.com/python-social-auth/social-core/issues/141)
    * `redirect_state`を固定にするか、なくすかのどちらかなのだけど、`redirect_state`を固定にする方向で実装していく

## backendを自作した
といってもまったく難しいことはしてなくて、クラスを継承して、対象メソッドを上書きしただけ。

```python
from social_core.backends.facebook import FacebookOAuth2

class FacebookOAuth2Override(FacebookOAuth2):
    # 現在はデフォルトでTrueなので、これはなくても良い
    REDIRECT_STATE = True

    # get_or_create_stateを上書く
    def get_or_create_state(self):
        if self.STATE_PARAMETER or self.REDIRECT_STATE:
            # Store state in session for further request validation. The state
            # value is passed as state parameter (as specified in OAuth2 spec),
            # but also added to redirect, that way we can still verify the
            # request if the provider doesn't implement the state parameter.
            # Reuse token if any.
            name = self.name + '_state'
            state = self.strategy.session_get(name)
            try:
                # settings.pyのSOCIAL_AUTH_FACEBOOK_REDIRECT_STATEを見に行く
                static_state = self.strategy.get_setting('SOCIAL_AUTH_FACEBOOK_REDIRECT_STATE')
                # sessionに保存する必要があるかどうか
                if state != static_state:
                    self.strategy.session_set(name, static_state)
                state = static_state
            except:
                # SOCIAL_AUTH_FACEBOOK_REDIRECT_STATEがない場合
                # sessionにも何も保管されていなかったら新たに取得する
                if state is None:
                    state = self.state_token()
                    self.strategy.session_set(name, state)
        else:
            state = None
        return state
```

上記を適当なところにおいて(たとえば`myapp/custom_backends.py`としたら)

```python
AUTHENTICATION_BACKENDS = (
    'social_core.backends.twitter.TwitterOAuth',
    # 'social_core.backends.facebook.FacebookOAuth2',
    'myapp.custom_backends.FacebookOAuth2Override',
    'django.contrib.auth.backends.ModelBackend',
)
SOCIAL_AUTH_FACEBOOK_REDIRECT_STATE = '{{static_state}}'
```
今の所こんな感じで問題なさそう。
