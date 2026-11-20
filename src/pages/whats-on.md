---
layout: base.njk
title: "What's on: live music and gigs in Canberra City | Dissent"
description: Gigs, open mic nights and everything else on at Dissent, 181 City Walk, Canberra.
permalink: "/whats-on/"
---

{% set headTitle = "What's on" %}
{% set headLead = "Gigs, open mics and whatever else gets made in the room." %}
{% set headImage = "/assets/images/singer-pink.webp" %}
{% include "partials/pageHead.njk" %}

{% set sectionTitle = "Coming up" %}
{% set sectionText = "The gig guide goes up on [Instagram](https://www.instagram.com/dissentcafeandbar) first. Follow along and you'll hear about every show." %}
{% set sectionLinkText = "Follow on Instagram" %}
{% set sectionLinkUrl = "https://www.instagram.com/dissentcafeandbar" %}
{% set sectionLinkStyle = "arrow" %}
{% set gigLimit = "all" %}
{% set gigPast = "yes" %}
{% include "partials/gigs.njk" %}

{% set sectionTitle = "Open mic Mondays. Bring your songs." %}
{% set sectionText = "Every Monday night. First time on a stage or fiftieth, there's a spot for you. Put your name down and we'll see you on the night." %}
{% set sectionLinkText = "Register for open mic" %}
{% set sectionLinkUrl = "https://calendar.app.google/aLnsouSxsEi13uPF9" %}
{% include "partials/callout.njk" %}
