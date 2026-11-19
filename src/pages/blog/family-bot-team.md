---
layout: ../../layouts/BlogPostLayout.astro
title: 一个够用就好的家庭 bot team
publishedAt: "2026-11-20"
topic: Home automation
---

自从 personal agent 这一类产品出现以后，各种 app 层出不穷。我也几乎都尝过鲜，从早期的 OpenClaw，到 Hermes、Muse、Grok Bot、Dots，再到各种类似 Grok Bot 的衍生产品。用得最久的是 OpenClaw 和 Hermes。后来 Grok Bot 这类协作型 bot 火起来，我最后停在了 OpenBot 上，搭了一套目前用着比较舒服的家庭 bot team。

现在，agents 已经全面接管了“我的”邮箱、娃的学校通知、家庭和个人日历、家里所有的 utility plan、账单管理、智能家居自动化等等。只要是稳定、重复的琐事，基本都建了对应的自动化流程。

建流程的时候，我心里有一个标准，基本就是马斯克的五步工作法：

1. 质疑需求：这件事真的需要交给 agent 吗？有价值吗？
2. 删除不必要的部分：没有它，能不能照样工作？
3. 简化与优化：留下来的部分，还能不能更简单？
4. 加快周转：先跑起来，再观察。
5. 自动化：等我对它足够了解了，再放手交给自动化流程。

搭建早期，我并没有按这套来，而是陷进了无穷无尽的“最佳实践”，和 Codex、Claude 来回折腾。直到有一次，GPT 狠狠地 roast 了我一顿：

> 你这辈子最大的爱好，就是把一个原本五分钟能解决的破事，硬生生折腾成一套企业级分布式架构。
>
> 你说你想搭个 Home Server。
>
> 正常人：买个 Mac mini，装几个 Docker，完事。
>
> 你他妈倒好。
>
> Tailscale、Cloudflare、Caddy、MCP、Hermes、OpenClaw、GitHub Runner、Split DNS、Private HTTPS……
>
> 操，你这是家庭服务器还是澳大利亚国防部的秘密数据中心？

我确实被骂醒了。我需要把注意力放回来：在对的框架下先跑起来，不做不必要的事，之后再按需优化。

## 现在的 bot team

现在家里这套 bot team 的主力一共四个，各有分工：

![家里的四个 bot：Chief of Staff、Personal Assistant、Home Ops 和 HA Automation Designer，以及各自的分工](/images/blog/family-bot-team/ai-team-zh.webp)

**Chief of Staff** 大部分时候是唯一的入口。我有什么事都先交给它，由它判断该给谁做，等对方做完，再回头检查结果。这样我不用记哪件事归哪个 bot 管，只跟它说就行。

**Personal Assistant** 管我的邮箱和日历。它可以帮我起草邮件，但从不替我发出去，它也没有这个权限。每天晚上 6 点，它会整理一次家里未来两天的日程，发到家庭群里。

**Home Ops** 管家里的日常琐事：娃的作业、账单、快递。学校的通知也由它整理好，再发给家里人。它还能读取 Home Assistant 里的状态。目前帮助最大的就是统一整理学校通知，因为学校的通知散落在各处：邮件、学校网站、年级群、学校周报，还有各种提前定好的活动，数都数不过来。

**HA Automation Designer** 专门搭 Home Assistant 的自动化，比如用多余的太阳能给 Tesla 充电。它现在在做太阳能发电预测，用来自动安排家用储能和电车的充电计划，我就不用再盯着数据，自己判断晚上要不要从电网低价补电了。

家里的网费、电费和燃气账单也有专门的 bot 和 app 盯着。如果发现费率变了，或者市场上有更好的费率，它会提醒我要不要换。收益最大的应该是 nbn：大部分 plan 的 6 个月优惠到期前，它都会提醒我，顺便扫一遍有没有折扣更高的 plan。

## 背后的 Home Portal

在这群 bot 背后，还有一个纯 vibe coding 出来的家庭数据 portal，作为所有信息的 single source of truth。数据全部由 bot 维护，家里人只通过界面查看。

![Home Portal 汇集记账、作业、健康档案、TeslaMate、包裹和服务方案等家庭数据](/images/blog/family-bot-team/home-portal-zh.webp)

这套系统跑得越久，bot 的记忆就越完整。日积月累地微调下来，它们慢慢就能贴合家里的实际情况，给出对的反馈。

![Personal Assistant 和 Home Ops 在家庭群里发的几条提醒示例](/images/blog/family-bot-team/bot-messages-v3.webp)

## 最后

希望这些内容能给你一点启发。随着个人 agent 的发展，今天的很多做法会被更高程度的自动化取代，但背后的逻辑是一样的：遇到一个问题，先用最简单的路径解决它，亲自参与、优化流程，最后再把它自动化。

最后的最后：不要想太多，也不要先搭一套复杂的机制。很多东西越简单越好，最佳实践只是参考。别让维护它的时间，最后比它帮你省下的时间还多。这些都是血泪教训。

下面节选一段 GPT 是怎么骂我的：

> 你他妈根本不是想完成项目。
>
> 你享受的是设计一个完美系统的过程。
>
> 因为系统一旦真正完成，你就得开始用它。
>
> 一旦开始用它，你就会发现自己真正需要的功能其实只有三个。
>
> 那前面花的几十个小时算什么？
>
> 所以你得赶紧找个新的工具、新的框架、新的 Agent、新的架构。
>
> 这样你就永远可以活在「下一版就完美了」的幻想里。
>
> 你最擅长解决的问题，就是你自己创造的问题。
>
> 你最稳定的生产环境，就是永远不进入生产环境。
>
> 你最成功的自动化，就是自动给自己增加工作量。
>
> 你这辈子最大的技术债，不在 GitHub，不在 Mac mini，不在 Cloudflare。
>
> 在你他妈脑子里。
>
> 而且按照你的性格，看完这一大段，你很可能不会生气。
>
> 你会认真思考三秒，然后问：
>
> 「有道理。那能不能帮我设计一个 Agent，专门监督我不要 Overengineering？最好能集成 Hermes，部署到 Mac mini，支持 Telegram，免费，安全，不暴露公网。」
>
> 操。
>
> 你没救了。
