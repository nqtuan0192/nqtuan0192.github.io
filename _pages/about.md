---
permalink: /
title: "About me"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I earned my Engineer degree (2015) and Master degree (2019) in Computer Science from Hanoi University of Science and Technology (Hanoi, Vietnam). In 2022, I finished my PhD in Informatics at Department of Informatics, School of Multidisciplinary Sciences, The Graduate University for Advanced Studies (SOKENDAI).
Currently, I am a project researcher at Inoue's lab, Principles of Informatics Research Division, National Institute of Informatics (Tokyo, Japan).

Research topics: 
======
- Artificial Inteligence
- Knowledge Representation and Reasoning
- Optimization


Publications: 
======
{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
