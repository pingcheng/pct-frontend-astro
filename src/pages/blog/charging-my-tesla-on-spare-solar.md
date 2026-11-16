---
layout: ../../layouts/BlogPostLayout.astro
title: Charging my Tesla on spare solar
description: How my Home Assistant setup decides when the car charges, and what I changed after running it.
publishedAt: "2026-11-16"
topic: Home automation
---

![A house with rooftop solar panels and a white Model Y charging in the driveway](/images/blog/charging-my-tesla-on-spare-solar/cover.png)

On a sunny day our house often makes more power than it uses. We have solar panels on the roof, a home battery and a Model Y, and selling the extra back to the grid earns very little. I wanted the car to take that spare power instead, without draining the home battery and without me opening the Tesla app every time a cloud passed.

Ready-made tools already do this, including evcc and TeslaSolarCharger. I built my own in Home Assistant anyway, mostly because I wanted to understand every decision it made. This post covers how it works and what I changed after running it for a while.

## The setup

Home Assistant is the household hub, and it already reads the solar and home battery figures. For the car, I kept reading and writing separate.

TeslaMate reads the car's state and publishes it over MQTT. Home Assistant uses that to see whether the car is home, plugged in, charging, and at what current. The Tesla Fleet API is only used to send commands: set the charging current, start, stop and wake.

The control logic sits in a small pyscript controller, which an automation runs every 10 minutes.

![How the pieces connect: solar and home battery feed Home Assistant, the pyscript controller sends commands through the Tesla Fleet API, and TeslaMate reports the car's state back over MQTT](/images/blog/charging-my-tesla-on-spare-solar/setup-diagram.png)

## How it decides

On each run, the controller takes the spare solar power averaged over the last 10 minutes, rather than a single reading, converts it to amps, and sets the car somewhere between 5 A and 32 A.

- If there is more spare power than the car is using, it steps the current up.
- If the home battery has been discharging to keep up, it steps the current down.
- If the car is already at 5 A and the battery is still discharging, it stops charging.
- When the sun comes back and there is enough for 5 A again, it wakes the car and starts charging.

![The four checks the controller makes on each 10-minute run](/images/blog/charging-my-tesla-on-spare-solar/decision-flow.png)

It does nothing before 6 am, and it leaves the car alone once it reaches its charge limit.

Overnight charging is handled separately. Our plan has an off-peak window at 4.5c/kWh, and the car's own scheduled charging covers that. A second automation stops the home battery discharging while the car charges overnight, so the solar the battery stored during the day does not simply end up in the car.

## Every command has to be confirmed

The rule I care about most is confirmation. After the controller sends a command, it waits for TeslaMate to report that the car actually changed. If nothing arrives within three minutes, the controller marks itself as faulted and stops sending commands until I reset it.

I would rather it stop than keep adjusting a car whose real state it no longer knows.

## What I changed after running it

The first problem was noise. The original overnight battery guard ran every time the car sent a heartbeat, which came to about 6,100 runs a day and filled the logs. I removed the heartbeat trigger and kept a once-a-minute check.

The second was the charging current bouncing around. On one cloudy morning the controller kept changing the current for about five hours, swinging between its lowest and highest settings. The step-down rule was the cause: it reacted to whatever the battery was doing at the moment it checked, so even a brief dip counted.

I changed that rule to use the 10-minute average as well, with an allowance of 300 W before it steps down, raised to 1000 W when the home battery is at 90% or more. Replaying that day with the new rule cut the changes from 19 to 6. The car would have taken about 0.6 kWh more, and the house still would not have bought any power from the grid.

I also tried adding a cooldown between changes. It made no difference in the replay, so I left it out.

Then the controller locked itself out. One morning it woke the car and sent the start command straight away. No confirmation came within three minutes, so it faulted, exactly as designed. Charging only resumed after I started it from the Tesla app, which reset the controller.

The safety rule did its job. The timing was the problem: sending start the moment the car is asked to wake is too eager.

Looking into that lockout turned up a quieter failure. Over two days, Home Assistant had failed to send five Telegram notifications because it could not reach Telegram's servers, and nothing had told me.

## Where it is now

The controller has run every day since these changes. There are three things I still want to fix:

- Wait after waking the car before sending start, and retry once before faulting.
- Alert me when the controller faults or a notification fails, through a channel that does not depend on Telegram.
- Work out how much of the car's charge actually came from solar. TeslaMate has the data; I have not pulled it out yet.

It is not finished, but it does what I wanted. On a sunny day the car mostly charges from the roof, and I no longer have to think about it.
