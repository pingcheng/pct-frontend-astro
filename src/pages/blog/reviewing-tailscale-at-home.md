---
layout: ../../layouts/BlogPostLayout.astro
title: Reviewing Tailscale at home
description: Reviewing a home tailnet, device permissions and the trust that comes with each private connection.
publishedAt: "2026-10-26"
topic: Security at home
---

A Tailscale vulnerability report had me going through the nodes in my tailnet this week.

One was the old WSL server on my PC. I had migrated that setup to the Mac mini, but the old node was still there. The PC still stores some of my data and runs Plex, while Home Assistant is the household hub. These are machines I rely on, and it was easy to leave an old connection behind once the migration was working.

I reviewed the nodes and their logs, removed the ones I no longer needed, enabled Tailnet Lock, and made sure the built-in Tailscale SSH feature was off on every device.

That dealt with the immediate cleanup. It also left me with a more useful question: **if one of my devices were compromised, what else could it reach?**

## Why I still want a private network

Tailscale lets me reach my home services without making each one directly accessible to the public internet. For a dashboard that only my family uses, that is a worthwhile reduction in exposure.

The recent SSH reports are a reminder to look at what happens after a device gets access. In a [Reddit response on 25 October](https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/), Mike Shaver, Tailscale’s VP of Engineering, described issues where an authorised SSH session could do more than the configured local user should be allowed to do. He said the team was still investigating the scope and affected configurations.

I was happy to leave that feature disabled because I do not need it. This is the built-in Tailscale SSH server; ordinary OpenSSH connections carried over Tailscale are a separate arrangement.

[Tailnet Lock](https://tailscale.com/docs/features/tailnet-lock) addresses another part of the problem: trusted signing devices decide which node keys other devices will accept. But a laptop that has already been accepted can still be compromised. Lock does not take away the access that laptop already has.

That is where the permissions inside the network start to matter.

## What I want to tighten next

Tailscale's [default policy](https://tailscale.com/docs/reference/examples/grants) allows devices to communicate broadly. That makes getting started easy. It also means I need to make deliberate decisions about which connections should remain possible.

My phone needs access to household apps. It does not need every management port on every server. An automation task should get the API access its job requires. Sharing an app with a family member should not also give their device a route to administer its host.

There are less obvious boundaries too. If two apps sit behind the same Caddy address on port 443, a [rule allowing that address and port](https://tailscale.com/docs/reference/syntax/grants) reaches their shared entrance. Different hostnames do not supply separate permissions. The proxy or the apps still need to enforce who can use them.

On a machine such as the Mac mini, an agent could call a backend through localhost without going through Tailscale. [Listening on localhost](https://tailscale.com/docs/features/tailscale-serve#identity-headers) still leaves other processes on the machine able to reach it. I would want to limit the agent's API credentials as carefully as its network access.

For the next review, I want to check that unnecessary connections actually fail, alongside checking that the useful ones work.

## Keeping up with the patches

At work, we have also been patching after the recent [PHP](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp) and [Node.js/Brotli](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) disclosures. The patches have gone smoothly. Both are reminders that vulnerabilities can sit in the runtimes and libraries underneath the application code we spend most of our time reviewing.

The Node.js advisory credits OpenAI Codex Security with reporting the Brotli flaw. I expect looking for similar mistakes across other codebases to become cheaper as these tools improve. A finding in one decoder gives researchers somewhere to start looking in another. Each finding still needs validation, but I would not plan around this work slowing down.

A private service still needs updates. It can process a malicious file, download hostile content, or receive a request from a compromised device I have allowed in. Keeping Tailscale, the operating system and the applications maintained remains part of running the network.

I still want Tailscale at home. It makes these services practical to access and easier to keep private. What I want to improve is how much trust comes with each connection, so that losing one device does not hand over the rest of the house.
