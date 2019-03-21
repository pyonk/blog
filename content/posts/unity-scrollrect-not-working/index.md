---
title: "Unityのscrollrectでスクロールができない件"
description: Unityのscrollrectでスクロールができなかったがなんとかなった話。内包していたEventTriggerが悪さをしてました。
date: 2018-11-05T15:37:45+09:00
draft: false
categories:
    - 日記
tags:
    - unity
    - c#
slug: "unity-scrollrect-not-working"
---

最近仕事でUnityを触るようになってC#を書いているけど、なかなかにUnityのお作法になれない。
普段webをやってるのでCSSみたいに簡単にレイアウトしたり、javascriptみたいにかければいいのにと何度思ったことか・・。

---

タイトルの通りなのだけど、自分の備忘録がわりにメモしておこうと思う。

## スクロールができないゾ

ボタンを内包するスクロールビューが必要になった。  
とりあえずボタンなしでスクロールビューを書いてきちんとスクロールできることを確認した。  
いよいよボタンを、とボタンの機能自体は問題なくできてさーてスクロールも確認しておこうと思ったところ、うんともすんとも言わない。  
これは困った  
すこし調べてみると世界中の人が困ってる風だ。

[UnityのScrollRectを拡張しよう | 株式会社ヘキサドライブ | HEXADRIVE | ゲーム制作を中心としたコンテンツクリエイト会社](https://hexadrive.jp/hexablog/program/15948/ "UnityのScrollRectを拡張しよう | 株式会社ヘキサドライブ | HEXADRIVE | ゲーム制作を中心としたコンテンツクリエイト会社")

## 違う違うそうじゃない
似てる問題っぽいけど違う（なんならこの見出しが書きたかっただけ）。
僕の症状はボタンは押せるけどスクロールができない、だ。

参考になったのはこちら

[\[Solved\] Scroll not working when elements inside have click events - Unity Answers](http://answers.unity.com/questions/902929/scroll-not-working-when-elements-inside-have-click.html "[Solved] Scroll not working when elements inside have click events - Unity Answers")

結論、書いてるコードに問題があった。

- 実際のコード

```cs
EventTrigger tapEvent = TitleTextObject.AddComponent<EventTrigger>();
EventTrigger.Entry entry = new EventTrigger.Entry();
entry.eventID = EventTriggerType.PointerClick;
entry.callback.AddListener((data) => { tapHandler((PointerEventData)data); });
tapEvent.triggers.Add(entry);
```

一見正しいけど、この`EventTrigger`っていうのが曲者でいろんな継承が行われてるみたい

> public class EventTrigger : MonoBehaviour, IEventSystemHandler, IPointerEnterHandler, IPointerExitHandler, IPointerDownHandler, IPointerUpHandler, IPointerClickHandler, IDragHandler, IDropHandler, IScrollHandler, IUpdateSelectedHandler, ISelectHandler, IDeselectHandler, IMoveHandler {

ひょえ〜、でもってこれの`IDropHandler`, `IScrollHandler`がスクロールビューに影響を与えていたっぽい。

ということで、いい感じにしたのがこちら

```cs
public class ClickTrigger : MonoBehaviour, IPointerClickHandler {
    public System.Action<PointerEventData> pointerClickAction;
    public void OnPointerClick(PointerEventData eventData){
        if (this.pointerClickAction != null) this.pointerClickAction(eventData);
    }
}
public static void AddOnclickEvent(GameObject target, System.Action<PointerEventData> callback) {
    target.AddComponent<TimelineHelper.ClickTrigger>().pointerClickAction = callback;
}
```

`AddOnClickEvent`したときに、`ClickTrigger`をアタッチしておくような実装。
ちなみに、すでに`ClickTrigger`がアタッチしてる場合のことは考えられてないけど一旦目を瞑ろう。

無事にこれで思った通りの動きをしてくれるようになった。
今後、他の処理が必要になったらこんな感じで必要なもののみを継承していく感じでやっていけばいいのかしら。

なれないけどがんばるぞ〜〜。