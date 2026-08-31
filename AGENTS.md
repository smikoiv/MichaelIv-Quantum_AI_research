# Repository Guardrails

## Architecture

- This repository is the authoritative Git repository for a Jekyll site adapted from the MIT-licensed cvless theme; never import upstream Git history.
- Keep content data-driven through `_data/theory.yml`, `_data/research.yml`, and `_data/applications.yml` and render repeated structures with reusable Liquid includes.
- Keep the main research-sphere JavaScript modular, keep SCSS organized by concern, and avoid unnecessary dependencies.
- Preserve all routes: `/`, `/theory/`, `/research/`, `/applications/`, `/publications/`, `/cv/`, and `/contact/`.
- Publication and CV structures may be prepared for verified future data, but factual entries must remain empty until authoritative information is supplied.

## Visual Identity

- Maintain a near-black/deep-blue scientific interface with restrained cyan, violet, green, and gold accents.
- Favor mathematically motivated structures, sparse geometry, generous space, subtle luminosity, and slow unobtrusive motion.
- Avoid conventional CV, blog, dashboard, gaming, excessive-card, excessive-glow, and meaningless-particle aesthetics.
- Keep the hero and visible descriptions extremely concise.
- Treat every Theory, Research, and Applications direction as conceptually equal. Sphere position must never imply rank.

## Scientific Framing

- The research sphere is a multidimensional landscape metaphor, not a literal Bloch sphere or a physical qubit representation.
- Never use ket-state axis labels, call research areas quantum states, or imply physical qubit meaning.
- Use scientifically grounded motifs: state transitions, probability currents, configuration geometry, sparse operators, tensor networks, spectral modes, orbital trajectories, and structured flow.
- Do not claim results, discoveries, affiliations, projects, publications, credentials, positions, awards, dates, or employment that have not been authoritatively supplied.

## Privacy and Publishing

- This is a private staging repository. Never push, deploy, enable GitHub Pages, publish externally, change repository visibility, modify any personal-pages repository, or merge the design branch into `main`.
- Do not expose private planning notes, local folder names, internal codenames, speculative named projects, proposed journal targets, or impact factors.
- Public contact information is limited to the verified ORCID, GitHub profile, and email supplied in site configuration. LinkedIn and Google Scholar must remain configurable, non-rendered placeholders until verified URLs are provided.

## Accessibility and Performance

- Use semantic HTML, complete keyboard navigation, visible focus states, sufficient contrast, touch-friendly controls, and responsive navigation.
- Respect `prefers-reduced-motion`: disable autonomous and nonessential orbital motion while retaining the complete research map and navigation.
- Supply a complete non-WebGL fallback; no essential action may depend on hover or WebGL.
- Target smooth ordinary-laptop performance, lazy-load expensive visualization code, and use `requestAnimationFrame` responsibly.
- Validate desktop, laptop, tablet, and 390 × 844 mobile layouts for clipping, overlap, spacing, touch targets, and readable labels.

## Forbidden Content

- The identifiers `PyPangea`, `USEtoxGeo`, and `MoleQular` are policy-only terms in this private guardrail file. They must have zero occurrences in public-facing source, metadata, navigation, comments, or generated `_site` output.
- Do not add any internal project codename or speculative project name to the website.
