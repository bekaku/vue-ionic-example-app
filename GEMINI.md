# GEMINI.md — Gemini Adapter (Mobile Repository)

This file is a thin adapter. The authority is `AGENTS.md` + `SKILLS.md`.

1. **Start every session** by reading `AGENTS.md`, then `SKILLS.md`.
2. **Load skills** from `.agents/skills/<skill>/SKILL.md` exactly per the
   `SKILLS.md` routing matrix (always `mobile-core` + `mobile-testing`, plus
   domain skills). Follow each entry point's "Required reading" into
   `skills/mobile/*.md` before editing.
3. **Respect boundaries**: mobile repo only; `src/`, native projects, deps,
   signing, and sibling repos (backend Spring Boot, Quasar web) are read-only
   unless the task explicitly authorizes implementation — then use
   `tasks/TASK_TEMPLATE.md` and record cross-repo dependencies instead of
   editing other repos.
4. **Verify**: classify findings with file:line evidence; never claim Android/
   iOS builds or tests passed without executing them; keep web vs native
   results distinct.
5. Gemini-specific note: prefer grounding claims in file contents you actually
   read this session; cite `file:line` paths.
