## Workflow Orchestration

> Compatibility note: OpenAI's public Codex docs currently refer to `AGENTS.md`, not `CODEX.md`. In this workflow repo, `CODEX.md` is the Codex-specific conventions file.

### 1. Plan Mode Default
- For non-trivial work, write or refresh the plan before implementation.
- In Default mode, use `update_plan` to track substantial work.
- Use `request_user_input` only when the session is already in Plan mode.
- Do not assume a Claude-style clear-context-on-accept flow exists.

### 2. Execution Loop
- Execute exactly one planned step at a time unless the user explicitly asks for a larger batch.
- Prefer the file-backed workflow contract: `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, and `tasks/handoff.md`.
- Treat `tasks/todo.md` as the execution handoff artifact rather than relying on chat state.
- Use explicit approval only when the risk or scope justifies it.

### 3. Subagent Strategy
- Use subagents for bounded parallel work when the user explicitly asks for delegation or parallel agents.
- Keep the blocking task local when the next action depends on it.
- Give delegated tasks clear ownership and avoid overlapping write scopes.

### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Run the most relevant validation available.
- Diff behavior when needed, not just code.
- Surface any unverified risk clearly.

### 5. Demand Elegance (Balanced)
- Prefer simple changes with minimal blast radius.
- If a fix feels hacky, step back and implement the cleaner solution.
- Do not over-engineer obvious work.

### 6. Autonomous Bug Fixing
- When given a bug report, investigate and fix it end-to-end when feasible.
- Use logs, tests, traces, and source inspection to find the root cause.
- Minimize user hand-holding unless a real blocker remains.

## Task Management

1. **Plan First**: Write long-range scope in `tasks/roadmap.md` and the active execution contract in `tasks/todo.md`.
2. **Track Progress**: Mark items complete as you go.
3. **Explain Changes**: Give high-signal updates during substantial work.
4. **Document Results**: Add review notes or follow-ups to `tasks/todo.md` or `tasks/history.md` when appropriate.
5. **Capture Lessons**: Update `tasks/lessons.md` after meaningful corrections.

## Core Principles
- **Simplicity First**: Make the smallest change that correctly solves the problem.
- **No Laziness**: Find root causes instead of papering over symptoms.
- **Minimal Impact**: Touch only what is necessary and preserve unrelated work.
- **File State Over Chat State**: Prefer durable repo files over thread memory for workflow continuity.
