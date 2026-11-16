---
layout: ../../layouts/BlogPostLayout.astro
title: Reviewing Tailscale at home
description: Cleaning up old nodes and device permissions on my home tailnet.
publishedAt: "2026-10-26"
topic: Security at home
---

![A doodle of a home network: a house with a few connected devices and a padlock](/images/blog/reviewing-tailscale-at-home/cover.webp)

A Tailscale vulnerability report had me going through the nodes on my tailnet this week.

One of them was the old WSL server on my PC. I'd moved that setup to the Mac mini, but the old node was still sitting there. The PC still holds some of my data and runs Plex, and Home Assistant runs the household, so these are machines I rely on. Once the migration worked, it was easy to forget the old connection.

I went through the nodes and their logs, removed the ones I no longer needed, turned on Tailnet Lock, and made sure Tailscale's built-in SSH was off on every device.

That sorted out the cleanup. What I kept thinking about afterwards was a different question: **if one of my devices were compromised, what else could it reach?**

## Why I still want a private network

Tailscale lets me reach my home services without opening each one up to the public internet. For a dashboard only my family uses, that means a lot less is exposed.

The recent SSH reports are about what a device can do once it's already in. In a [Reddit reply on 25 October](https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/), Mike Shaver, Tailscale's VP of Engineering, described issues where an authorised SSH session could do more than the configured local user should be allowed to. He said the team was still working out the scope and which configurations were affected.

I don't use that feature, so turning it off cost me nothing. This is Tailscale's own SSH server; ordinary OpenSSH connections that happen to run over Tailscale are a different thing.

[Tailnet Lock](https://tailscale.com/docs/features/tailnet-lock) covers another part of the problem. Trusted signing devices decide which node keys the rest of the network will accept. It can't help with a laptop that has already been accepted and then gets compromised, though. That laptop keeps the access it already had, so the next thing to look at is the permissions inside the network.

## What I want to tighten next

[By default](https://tailscale.com/docs/reference/examples/grants), Tailscale lets devices talk to each other pretty freely. That makes it easy to get started, but it means I have to decide on purpose which connections should stay possible.

My phone needs the household apps. It doesn't need every management port on every server. An automation task should only get the API access its job requires. And sharing an app with a family member shouldn't also give their device a way to administer the machine it runs on.

![Which devices should reach what on the tailnet, and where the shared Caddy entrance sits](/images/blog/reviewing-tailscale-at-home/access-map.webp)

Some of the boundaries are less obvious. If two apps sit behind the same Caddy address on port 443, [a rule that allows that address and port](https://tailscale.com/docs/reference/syntax/grants) lets a device through the shared entrance to both. A different hostname doesn't give you a separate permission, so the proxy or the apps still have to check who's allowed in.

On a machine like the Mac mini, an agent can call a backend over localhost without going through Tailscale at all. A service [listening on localhost](https://tailscale.com/docs/features/tailscale-serve#identity-headers) is still reachable by every other process on that machine, so I'd want to limit the agent's API credentials as carefully as its network access.

Next time I review this, I'll check that the connections I don't need actually fail, not just that the useful ones work.

## Keeping things patched

A private service still needs updates. It can still open a malicious file, download something hostile, or take a request from a device I've let in that has since been compromised. At work we've just been patching after the recent [PHP](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp) and [Node.js/Brotli](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) disclosures, and it applies at home too: keeping Tailscale, the operating system and the apps up to date is part of running the network.

I'm keeping Tailscale. It's what makes these services practical to reach while staying private. What I'm working on now is how much each connection is allowed to do, starting with the phone, the automation and the family's devices.
