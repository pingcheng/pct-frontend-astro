---
layout: ../../layouts/BlogPostLayout.astro
title: Reviewing Tailscale at home
description: A Tailscale vulnerability disclosure had me going through the nodes in my tailnet today.
publishedAt: "2026-10-26"
topic: Security at home
---

A Tailscale vulnerability disclosure had me going through the nodes in my tailnet today.

One was the old WSL server on my PC. I had migrated that setup to the Mac mini after getting it, so I removed the old node. The PC still stores some of my data and runs Plex, while Home Assistant is the household hub.

I reviewed all the nodes and their logs, removed the ones I no longer needed, then checked the settings. I enabled [Tailnet Lock](https://tailscale.com/docs/features/tailnet-lock) and made sure Tailscale SSH was off on every device.

At work, we’ve also been busy patching services after the recent [PHP](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp) and [Node.js/Brotli](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) disclosures.

The patches have gone smoothly.

New vulnerabilities are reported every day. It’s hard to stop thinking about security, both at work and on the machines I look after at home.

I expect AI to make this pace of discovery routine. The Brotli decoder bug is the kind of starting point I mean. After a finding like that, I’d expect researchers to use AI to look for similar handling of malformed compressed input in other decoders, across languages and runtimes. I’m worried about how quickly that search will spread, and how many services we’ll need to keep checking as a result.
