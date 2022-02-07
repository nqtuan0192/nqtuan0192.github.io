---
permalink: /
title: "About me"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I earned my Engineer degree and Master degree in Computer Science from Hanoi University of Science and Technology (Hanoi, Vietnam). Currently, I am a Ph.D. Student at National Institute of Informatics (Tokyo, Japan).

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
