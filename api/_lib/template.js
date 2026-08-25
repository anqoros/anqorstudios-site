// Byte-level constants lifted verbatim from a live generated page
// (blog/why-ai-pilots-die-before-production.html, confirmed identical across
// every existing blog post) rather than re-derived by hand, so there is no
// transcription drift between what the Python site generator produces and
// what this endpoint produces. If the site's nav, footer, or base CSS ever
// changes, these constants need a one-time manual re-sync from a freshly
// generated page — there is no live fetch-and-splice at request time, which
// would trade a rare, visible maintenance task for a much worse failure mode
// (a malformed page if the site's structure ever shifts unexpectedly).

const SITE = 'https://anqorstudios.com';
const ORG_ID = `${SITE}/#organization`;
const PERSON_ID = `${SITE}/#founder`;
const SITE_ID = `${SITE}/#website`;

const CSS_BLOCK = `
  :root {
    --bg:#080809; --bg-2:#0E0E11; --panel:#121216; --panel-2:#17171C;
    --ink:#FFFFFF; --muted:rgba(255,255,255,0.62); --faint:rgba(255,255,255,0.42);
    --line:rgba(255,255,255,0.10); --line-2:rgba(255,255,255,0.16);
    --teal:#2FD4C4; --coral:#FA5051; --green:#3FA66B; --amber:#D8A24A; --violet:#8B7BF0;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink);
         font-family: 'Archivo', sans-serif; -webkit-font-smoothing: antialiased;
         overflow-x: hidden; }
  a { color: inherit; }
  img { max-width: 100%; display: block; }

  .grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.6;
    background-image: linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
    background-size: 64px 64px;
    -webkit-mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 30%, transparent 75%);
    mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 30%, transparent 75%); }
  .grid-bg::after { content: ""; position: absolute; inset: -50%;
    background: radial-gradient(circle at 30% 30%, rgba(47,212,196,0.10), transparent 42%),
                radial-gradient(circle at 72% 58%, rgba(139,123,240,0.09), transparent 45%);
    animation: drift 26s ease-in-out infinite alternate; }
  @keyframes drift {
    from { transform: translate3d(-2%, -1%, 0) scale(1); }
    to   { transform: translate3d(2%, 2%, 0) scale(1.06); }
  }
  .page { position: relative; z-index: 1; }

  .navbar-wrap { position: sticky; top: 0; z-index: 95; background: rgba(8, 8, 9, 0.82);
                 backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
  nav { display: flex; justify-content: space-between; align-items: center;
        padding: 18px 0; width: min(1240px, 100% - 44px); margin: 0 auto; }
  .wordmark { font-family: 'Bricolage Grotesque', 'Archivo', sans-serif; font-size: 28px;
              font-weight: 800; letter-spacing: -0.018em; text-decoration: none; color: var(--ink); }
  .navlinks { display: flex; gap: 30px; list-style: none; margin: 0; padding: 0;
              align-items: center; font-size: 14px; font-weight: 600; color: var(--muted); }
  .navlinks a { color: inherit; text-decoration: none; transition: color 0.18s; }
  .navlinks a:hover { color: var(--ink); }
  .navlinks li.book a { color: #06110F; background: var(--teal); padding: 12px 24px;
                        border-radius: 100px; font-weight: 700; font-size: 14px; }
  .navlinks li.book a:hover { filter: brightness(1.1); }
  .hamburger { display: none; position: relative; width: 40px; height: 40px; padding: 0;
               background: none; border: 1px solid var(--line-2); border-radius: 50%;
               cursor: pointer; transition: border-color 0.2s; }
  .hamburger:hover { border-color: rgba(255,255,255,0.45); }
  .hamburger span { position: absolute; left: 50%; top: 50%; display: block; width: 16px;
                    height: 1.6px; background: var(--ink); border-radius: 2px;
                    transform: translate(-50%, -50%);
                    transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.2s; }
  .hamburger span:nth-child(1) { transform: translate(-50%, -6px); }
  .hamburger span:nth-child(3) { transform: translate(-50%, 4.4px); }
  body.menu-open .hamburger span:nth-child(1) { transform: translate(-50%, -50%) rotate(45deg); }
  body.menu-open .hamburger span:nth-child(2) { opacity: 0; }
  body.menu-open .hamburger span:nth-child(3) { transform: translate(-50%, -50%) rotate(-45deg); }

  @media (max-width: 960px) {
    nav { padding: 16px 22px; }
    .hamburger { display: block; position: relative; z-index: 96; }
    .wordmark { position: relative; z-index: 96; }
    body.menu-open { overflow: hidden; }
    body.menu-open .navbar-wrap { background: #0B0B0B; backdrop-filter: none;
                                  border-bottom-color: var(--line); }

    .navlinks { position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                height: 100vh; height: 100dvh; z-index: 90; display: flex; flex-direction: column;
                align-items: stretch; justify-content: flex-start; gap: 0;
                background: #0B0B0B; padding: 96px 22px 40px; margin: 0;
                opacity: 0; visibility: hidden; pointer-events: none;
                transform: translateY(-8px);
                transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1),
                            visibility 0.3s; overflow-y: auto; }
    .navlinks.open { opacity: 1; visibility: visible; pointer-events: auto; transform: none; }

    .navlinks li { border-bottom: 1px solid var(--line); }
    .navlinks li a { display: block; padding: 24px 2px;
                     font-family: 'Bricolage Grotesque', 'Archivo', sans-serif;
                     font-size: 30px; font-weight: 800; letter-spacing: -0.02em;
                     color: var(--ink); }
    .navlinks li a:hover { color: var(--teal); }

    .navlinks li.book { border-bottom: none; margin-top: 34px; }
    .navlinks li.book a { display: inline-block; padding: 15px 30px; font-size: 15px;
                          font-weight: 700; letter-spacing: 0; border-radius: 100px;
                          background: var(--teal); color: #06110F;
                          font-family: 'Archivo', sans-serif; }
  }

  .navlinks li.has-menu { position: static; }
  .navlinks li.has-menu > a::after { content: ""; display: inline-block; width: 6px; height: 6px;
    margin-left: 7px; vertical-align: 2px; border-right: 1.6px solid currentColor;
    border-bottom: 1.6px solid currentColor; transform: rotate(45deg) translateY(-1px);
    transition: transform 0.22s; }
  .navlinks li.has-menu:hover > a::after { transform: rotate(-135deg) translateY(-3px); }
  .megamenu { position: absolute; left: 0; right: 0; top: 100%; background: #0B0B0B;
              border-bottom: 1px solid var(--line); opacity: 0; visibility: hidden;
              transform: translateY(-6px); pointer-events: none;
              transition: opacity 0.22s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1),
                          visibility 0.22s; z-index: 90; }
  .navlinks li.has-menu:hover .megamenu,
  .navlinks li.has-menu:focus-within .megamenu {
    opacity: 1; visibility: visible; transform: none; pointer-events: auto; }
  .mm-inner { width: min(1240px, 100% - 44px); margin: 0 auto; padding: 34px 0 44px; }
  .mm-head { display: flex; justify-content: space-between; align-items: baseline;
             padding-bottom: 16px; border-bottom: 1px solid var(--line); margin-bottom: 26px; }
  .mm-head span { font-family: ui-monospace, monospace; font-size: 11.5px; letter-spacing: 0.16em;
                  text-transform: uppercase; color: var(--faint); }
  .mm-head a { font-size: 14px; font-weight: 700; color: var(--ink); text-decoration: none; }
  .mm-head a:hover { color: var(--teal); }
  .mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 44px; }
  .mm-grid a { text-decoration: none; display: block; }
  .mm-grid b { display: block; font-size: 15px; font-weight: 700; color: var(--ink);
               margin-bottom: 6px; letter-spacing: -0.01em; }
  .mm-grid a:hover b { color: var(--teal); }
  .mm-grid p { font-size: 13.5px; line-height: 1.55; color: var(--muted); margin: 0; }
  @media (max-width: 960px) { .megamenu { display: none; }
                              .navlinks li.has-menu > a::after { display: none; } }

  .crumbs { padding: 16px 0; font-size: 12.5px; color: var(--faint);
            width: min(1240px, 100% - 44px); margin: 0 auto; }
  .crumbs a { text-decoration: none; }
  .crumbs a:hover { color: var(--ink); }
  .crumbs i { font-style: normal; opacity: 0.35; margin: 0 9px; }

  .hero { position: relative; overflow: hidden; }
  .hero::before { content: ""; position: absolute; top: -30%; left: 50%;
    transform: translateX(-50%); width: 1200px; height: 900px; pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(47,212,196,0.16), transparent 62%); }
  .hero-inner { position: relative; width: min(1240px, 100% - 44px); margin: 0 auto;
                padding: 118px 0 104px; }

  h1 { font-family: 'Bricolage Grotesque', 'Archivo', sans-serif;
       font-size: clamp(40px, 6.7vw, 96px); font-weight: 800; line-height: 1.02;
       letter-spacing: -0.025em; margin: 0 0 34px; max-width: 1240px; }
  .hero .lede { font-size: 20px; line-height: 1.62; color: var(--muted);
                max-width: 640px; margin: 0 0 38px; }

  .cta-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
  .btn-primary { background: var(--teal); color: #06110F; padding: 15px 28px;
                 border-radius: 100px; font-weight: 700; font-size: 15px;
                 text-decoration: none; transition: filter 0.18s; }
  .btn-primary:hover { filter: brightness(1.1); }
  .btn-ghost { border: 1px solid var(--line-2); color: var(--ink); padding: 14px 26px;
               border-radius: 100px; font-weight: 600; font-size: 15px; text-decoration: none;
               transition: border-color 0.18s, background 0.18s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.04); }

  section { padding: 92px 0; width: min(1240px, 100% - 44px); margin: 0 auto; position: relative; }
  .eyebrow { font-family: ui-monospace, monospace; font-size: 11.5px; letter-spacing: 0.16em;
             text-transform: uppercase; color: var(--faint); margin-bottom: 18px;
             display: flex; align-items: center; gap: 14px; }
  .eyebrow::after { content: ""; flex: 1; height: 1px; background: var(--line); }
  h2 { font-family: 'Bricolage Grotesque', 'Archivo', sans-serif;
       font-size: clamp(28px, 3.4vw, 44px); font-weight: 800; letter-spacing: -0.02em;
       margin: 0 0 22px; max-width: 22ch; text-wrap: balance; }

  .cta-band { position: relative; overflow: hidden; border-top: 1px solid var(--line); }
  .cta-band::before { content: ""; position: absolute; bottom: -50%; left: 50%;
    transform: translateX(-50%); width: 1000px; height: 700px; pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(47,212,196,0.14), transparent 65%); }
  .cta-band .inner { position: relative; width: min(1240px, 100% - 44px); margin: 0 auto;
                     padding: 96px 0; }
  .cta-band p { color: var(--muted); font-size: 17px; line-height: 1.68;
                max-width: 56ch; margin: 0 0 30px; }

  footer { border-top: 1px solid var(--line); background: var(--bg-2); }
  .foot-inner { width: min(1240px, 100% - 44px); margin: 0 auto; padding: 70px 0 32px; }
  .foot-cols { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 38px;
               padding-bottom: 36px; border-bottom: 1px solid var(--line); }
  .foot-cols .lbl { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
                    color: var(--faint); margin-bottom: 16px; }
  .foot-cols a { display: block; font-size: 13.5px; color: var(--muted);
                 margin-bottom: 10px; text-decoration: none; transition: color 0.18s; }
  .foot-cols a:hover { color: var(--ink); }
  .foot-cols p, .foot-cols address { font-size: 13.5px; line-height: 1.75;
                                     font-style: normal; margin: 0; color: var(--muted); }
  .foot-bottom { display: flex; justify-content: space-between; gap: 14px; flex-wrap: wrap;
                 padding-top: 24px; font-size: 12.5px; color: var(--faint); }
  .foot-bottom a { text-decoration: none; color: var(--muted); }

  @media (max-width: 1180px) {
    .foot-cols { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .hero-inner { padding-top: 64px; padding-bottom: 60px; }
    section { padding-top: 64px; padding-bottom: 64px; }
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }

  .bl-list { margin-top:8px; }
  .bl-item { display:block; border-top:1px solid var(--line); padding:34px 0;
             transition:opacity .2s ease; text-decoration:none; }
  .bl-item:last-child { border-bottom:1px solid var(--line); }
  .bl-item:hover { opacity:.72; }
  .bl-meta { display:flex; gap:14px; align-items:center; flex-wrap:wrap;
             font-size:12px; letter-spacing:.1em; text-transform:uppercase;
             color:var(--muted); font-weight:700; margin-bottom:12px; }
  .bl-meta .cat { color:var(--teal); }
  .bl-item h2 { font-size:clamp(24px,3vw,34px); margin:0 0 12px; letter-spacing:-.025em;
                line-height:1.16; max-width:24ch; }
  .bl-item p { color:var(--muted); font-size:16px; line-height:1.66; margin:0; max-width:70ch; }
  .bl-go { display:inline-block; margin-top:16px; font-size:14px; font-weight:700; color:var(--teal); }

  .post { max-width:none; }
  .post h1 { font-size:clamp(31px,3.9vw,54px); line-height:1.1; max-width:20ch; }
  .post .lede { max-width:62ch; }
  .post-head { border-bottom:1px solid var(--line); padding-bottom:38px; margin-bottom:44px; }
  .post-body { max-width:none; }
  .post-body > * { max-width:72ch; }
  .post-body h2 { font-size:clamp(23px,2.6vw,30px); letter-spacing:-.02em;
                  margin:52px 0 16px; line-height:1.22; }
  .post-body h3 { font-size:clamp(19px,2.1vw,24px); letter-spacing:-.01em;
                  margin:38px 0 14px; line-height:1.25; color:var(--ink); }
  .post-body p { color:#c9c9cc; font-size:17px; line-height:1.78; margin:0 0 20px; }
  .post-body a { color:var(--teal); text-decoration:underline; text-underline-offset:2px; }
  .post-body ul { margin:0 0 24px; padding:0; list-style:none; }
  .post-body ul li { position:relative; padding-left:26px; margin-bottom:12px;
                     color:#c9c9cc; font-size:16.5px; line-height:1.7; }
  .post-body ul li::before { content:""; position:absolute; left:6px; top:11px;
                             width:6px; height:6px; border-radius:50%; background:var(--teal); }
  .post-note { border-left:2px solid var(--teal); background:rgba(47,212,196,.05);
               border-radius:0 12px 12px 0; padding:20px 24px; margin:0 0 26px; }
  .post-note p { margin:0; color:#d6d6d8; font-size:15.5px; line-height:1.7; }
  .post-more { margin-top:64px; padding-top:38px; border-top:1px solid var(--line); }
  .post-more .lbl { font-size:11px; letter-spacing:.14em; text-transform:uppercase;
                    color:var(--muted); font-weight:700; margin-bottom:18px; }
  .post-more a { display:block; padding:14px 0; border-bottom:1px solid var(--line);
                 font-size:17px; font-weight:600; color:#fff; text-decoration:none; }
  .post-more a:hover { color:var(--teal); }

  .faq-list { margin-top:42px; border-top:1px solid var(--line); }
  .faq-item { border-bottom: 1px solid var(--line); }
  .faq-item summary { list-style: none; cursor: pointer; padding: 24px 44px 24px 0;
                      position: relative; font-size: 17px; font-weight: 600;
                      max-width: 64ch; transition: color 0.18s; }
  .faq-item summary::-webkit-details-marker { display: none; }
  .faq-item summary:hover { color: var(--teal); }
  .faq-item summary::after { content: ""; position: absolute; right: 6px; top: 31px;
    width: 11px; height: 11px; border-right: 2px solid var(--faint);
    border-bottom: 2px solid var(--faint); transform: rotate(45deg);
    transition: transform 0.25s, border-color 0.25s; }
  .faq-item[open] summary { color: var(--teal); }
  .faq-item[open] summary::after { transform: rotate(-135deg); border-color: var(--teal); }
  .faq-item p { font-size: 15px; line-height: 1.76; color: var(--muted);
                margin: 0 0 26px; max-width: 76ch; }
`;

const NAV_HTML = `<div class="navbar-wrap"><nav><a href="/" class="wordmark">Anqor</a><ul class="navlinks" id="navlinks"><li class="has-menu"><a href="/services">Services</a><div class="megamenu"><div class="mm-inner"><div class="mm-head"><span>Services</span><a href="/services">All services &rarr;</a></div><div class="mm-grid"><a href="/services/web-development"><b>Web Development</b><p>Custom design and build, with search and AI visibility handled at the structure level fr…</p></a><a href="/services/ai-native"><b>AI-Native Product Development</b><p>There&#x27;s a real architectural difference between a product with an AI feature and a produ…</p></a><a href="/services/saas-platforms"><b>SaaS Platforms</b><p>Auth, tenant isolation, billing, admin tooling, deployment and the operational work afte…</p></a><a href="/services/cloud-infrastructure"><b>Cloud Infrastructure</b><p>Architecture, migration and ongoing cost control, without the over-provisioned enterpris…</p></a><a href="/services/devops-engineering"><b>DevOps Engineering</b><p>CI/CD, containerisation, environment separation and rollback.</p></a><a href="/services/security-compliance"><b>Security &amp; Compliance</b><p>Access control, tenant isolation, audit logging, encryption and data residency, designed…</p></a><a href="/services/ai-agents-workflow-automation"><b>AI Agents &amp; Workflow Automation</b><p>Most agent projects die between the prototype and production.</p></a><a href="/services/ai-search-visibility"><b>AI Search Visibility (GEO)</b><p>People increasingly ask an assistant instead of searching.</p></a><a href="/services/blockchain-development"><b>Blockchain Development</b><p>Wallet infrastructure, on-chain data pipelines and automated execution across Solana, Et…</p></a></div></div></div></li><li class="has-menu"><a href="/industries">Industries</a><div class="megamenu"><div class="mm-inner"><div class="mm-head"><span>Industries</span><a href="/industries">All industries &rarr;</a></div><div class="mm-grid"><a href="/industries/real-estate"><b>Real Estate</b><p>Enquiries arrive on WhatsApp at 10pm and go to whoever answers first.</p></a><a href="/industries/hospitality"><b>Hospitality</b><p>Booking questions, group enquiries and event requests land outside operating hours and o…</p></a><a href="/industries/fintech"><b>Fintech</b><p>Compliance automation, secure multi-tenant platforms and multi-chain integration, built…</p></a><a href="/industries/saas"><b>SaaS</b><p>Multi-tenant architecture, AI features that survive production, deployment pipelines and…</p></a><a href="/industries/startups"><b>Startups</b><p>An MVP that tests the real assumption, built in weeks, on architecture that won&#x27;t have t…</p></a><a href="/industries/healthcare"><b>Healthcare</b><p>Patient enquiry handling, appointment workflows and document automation, built with stri…</p></a><a href="/industries/education"><b>Education</b><p>Curriculum-aligned content generation, enrolment enquiry handling and multilingual learn…</p></a><a href="/industries/ecommerce-retail"><b>E-commerce &amp; Retail</b><p>Customer service, order enquiries and product content, automated where the customers act…</p></a></div></div></div></li><li><a href="/projects">Our Projects</a></li><li><a href="/blog">Blogs</a></li><li><a href="/about">About Us</a></li><li><a href="/contact">Contact Us</a></li><li class="book"><a href="https://calendar.app.google/97YReFJgPs6gNFLt7" target="_blank" rel="noopener">Book a Call</a></li></ul><button class="hamburger" aria-label="Open menu" aria-expanded="false" onclick="anqorMenu(this)"><span></span><span></span><span></span></button></nav></div>`;

const FOOTER_AND_SCRIPTS = `<footer><div class="foot-inner">
  <div class="foot-cols">
    <div>
      <a href="/" class="wordmark" style="margin-bottom:14px">Anqor</a>
      <address>
        <b style="color:#fff">Anqor Studios L.L.C-FZ</b><br>Meydan Grandstand, 6th Floor, Meydan Road, Nad Al Sheba<br>
        Dubai, United Arab Emirates<br>
        <a href="mailto:hello@anqorstudios.com" style="display:inline;margin:0">hello@anqorstudios.com</a>
      </address>
    </div>
    <div><div class="lbl">Services</div><a href="/services/web-development">Web Development</a><a href="/services/ai-native">AI-Native Product Development</a><a href="/services/saas-platforms">SaaS Platforms</a><a href="/services/cloud-infrastructure">Cloud Infrastructure</a><a href="/services/devops-engineering">DevOps Engineering</a><a href="/services/security-compliance">Security &amp; Compliance</a><a href="/services"><b>All services &rarr;</b></a></div>
    <div><div class="lbl">Industries</div><a href="/industries/real-estate">Real Estate</a><a href="/industries/hospitality">Hospitality</a><a href="/industries/fintech">Fintech</a><a href="/industries/saas">SaaS</a><a href="/industries/startups">Startups</a><a href="/industries/healthcare">Healthcare</a><a href="/industries"><b>All industries &rarr;</b></a></div>
    <div><div class="lbl">Locations</div>
      <a href="/locations/dubai">AI Automation Dubai</a>
      <a href="/locations/abu-dhabi">AI Automation Abu Dhabi</a>
      <a href="/locations/sharjah">AI Automation Sharjah</a>
      <div class="lbl" style="margin-top:22px">Company</div>
      <a href="/about">About Us</a>
      <a href="/projects">Our Projects</a>
      <a href="/blog">Blog</a>
      <a href="/shows">Shows</a>
      <a href="/contact">Contact Us</a>
    </div>
  </div>
  <div class="foot-bottom">
    <span>&copy; 2026 Anqor Studios L.L.C-FZ. All rights reserved.</span>
    <span><a href="https://linkedin.com/in/uudoessien" target="_blank" rel="noopener">LinkedIn</a> &middot;
      <a href="https://instagram.com/anqorstudios" target="_blank" rel="noopener">Instagram</a></span>
  </div>
</div></footer>
</div>
<script>
  function anqorMenu(btn) {
    var nav = document.getElementById('navlinks');
    var open = nav.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      anqorMenu(document.querySelector('.hamburger'));
    }
  });
  document.querySelectorAll('#navlinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (document.body.classList.contains('menu-open')) {
        anqorMenu(document.querySelector('.hamburger'));
      }
    });
  });
</script>
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
<script>
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.Lenis) {
    var lenis = new Lenis({ duration: 1.05, smoothWheel: true,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    requestAnimationFrame(function raf(time) { lenis.raf(time); requestAnimationFrame(raf); });
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var el = document.querySelector(a.getAttribute('href'));
        if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80 }); }
      });
    });
  }
</script>
</body>
</html>
`;

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function orgSchemaNodes() {
  return [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: 'Anqor Studios L.L.C-FZ',
      alternateName: 'Anqor Studios',
      url: SITE,
      email: 'hello@anqorstudios.com',
      telephone: '+971585220421',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Meydan Grandstand, 6th Floor, Meydan Road, Nad Al Sheba',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      founder: { '@id': PERSON_ID },
      sameAs: ['https://linkedin.com/in/uudoessien', 'https://instagram.com/anqorstudios'],
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Ubong Udoessien',
      jobTitle: 'Founder',
      worksFor: { '@id': ORG_ID },
      url: 'https://linkedin.com/in/uudoessien',
      sameAs: ['https://linkedin.com/in/uudoessien'],
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: SITE,
      name: 'Anqor Studios',
      publisher: { '@id': ORG_ID },
    },
  ];
}

function headBlock({ title, metaDescription, canonicalUrl, schemaGraph, noindex = false }) {
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph }, null, 2);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escAttr(title)}</title>
<meta name="description" content="${escAttr(metaDescription)}" />
<link rel="canonical" href="${canonicalUrl}" />
${noindex ? '<meta name="robots" content="noindex, nofollow" />\n' : ''}
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<meta property="og:type" content="website" />
<meta property="og:title" content="${escAttr(title)}" />
<meta property="og:description" content="${escAttr(metaDescription)}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${SITE}/anqor_og_image.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800;900&display=swap" rel="stylesheet">
<script type="application/ld+json">
${schema}
</script>
<style>${CSS_BLOCK}</style>
</head>
<body>
<div class="grid-bg"></div>
<div class="page">
${NAV_HTML}
`;
}

module.exports = {
  SITE, ORG_ID, PERSON_ID, SITE_ID,
  CSS_BLOCK, NAV_HTML, FOOTER_AND_SCRIPTS,
  orgSchemaNodes, headBlock, escAttr,
};
