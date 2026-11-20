---
layout: base.njk
title: Dissent Cafe and Bar | Live music and good food in Canberra
description: Live music and good food in Canberra City. Dissent is a live music venue and cafe bar at 181 City Walk, Civic, between the merry-go-round and Garema Place.
permalink: "/"
---

{% set heroTitle = "Live music and good food in the middle of Canberra." %}
{% set heroLead = "A small room for big nights at 181 City Walk, between the merry-go-round and Garema Place." %}
{% set heroImage = "/assets/images/crowd.webp" %}
{% set heroAlt = "A packed crowd at Dissent with hands in the air as a band plays under purple stage lights" %}
{% set heroAction = "What's on" %}
{% set heroLink = "/whats-on/" %}
{% set heroAction2 = "Find us" %}
{% set heroLink2 = "/get-in-touch/" %}
{% set heroStamp = "Est. 2024" %}
{% include "partials/hero.njk" %}

{% set tickerText = "Live music, Good food, Open mic, Cafe, Bar, 181 City Walk" %}
{% include "partials/ticker.njk" %}

{% set sectionTitle = "Coming up" %}
{% set sectionText = "The gig guide goes up on [Instagram](https://www.instagram.com/dissentcafeandbar) first. Follow along and you'll hear about every show." %}
{% set sectionLinkText = "Everything on" %}
{% set sectionLinkUrl = "/whats-on/" %}
{% set sectionLinkStyle = "arrow" %}
{% set gigLimit = "4" %}
{% set gigPast = "no" %}
{% include "partials/gigs.njk" %}

{% set sectionTitle = "A room for the people who make the noise." %}
{% set sectionText = "Dissent opened in November 2024 to give Canberra's city centre a proper live music room, with a cafe that keeps the lights on through the day.\n\nIt's a place for musicians and artists to practise their craft in real time, hopefully with an audience. Someone human, sharing something with others." %}
{% set sectionLinkText = "About Dissent" %}
{% set sectionLinkUrl = "/about-us/" %}
{% set sectionLinkStyle = "arrow" %}
{% set sectionImage = "/assets/images/band-green.webp" %}
{% set sectionAlt = "A four-piece band with guitars on the Dissent stage under green and blue lights" %}
{% set sectionLayout = "right" %}
{% set sectionBg = "" %}
{% include "partials/textPhoto.njk" %}

{% set stripImage1 = "/assets/images/acoustic.webp" %}
{% set stripAlt1 = "A guitarist playing acoustic, seated on stage" %}
{% set stripImage2 = "/assets/images/keys.webp" %}
{% set stripAlt2 = "Black and white photo of a singer at a Nord keyboard" %}
{% set stripImage3 = "/assets/images/singer-pink.webp" %}
{% set stripAlt3 = "A singer leaning into the microphone in pink haze" %}
{% set stripImage4 = "/assets/images/four-piece.webp" %}
{% set stripAlt4 = "Black and white photo of a four-piece band mid-song" %}
{% include "partials/photoStrip.njk" %}

{% set sectionTitle = "Open mic Mondays. Bring your songs." %}
{% set sectionText = "Every Monday night. First time on a stage or fiftieth, there's a spot for you. Put your name down and we'll see you on the night." %}
{% set sectionLinkText = "Register for open mic" %}
{% set sectionLinkUrl = "https://calendar.app.google/aLnsouSxsEi13uPF9" %}
{% include "partials/callout.njk" %}

{% set quoteText = "In a time when money, power and politics would rather see everyone tethered to their own small screens, divided and alone, attending a live music event and being with others is almost a revolutionary act." %}
{% set quoteBy = "Live music isn't a fad" %}
{% set quoteLink = "/2026/08/20/live-music-isnt-a-fad/" %}
{% include "partials/bigQuote.njk" %}

{% set sectionTitle = "Find us" %}
{% set sectionText = "In the heart of the city centre, between the merry-go-round and Garema Place." %}
{% include "partials/findUs.njk" %}
