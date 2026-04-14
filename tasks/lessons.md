# Lessons

## 2026-04-14: Separate Contract Completeness From Runtime Readiness

- When summarizing Automium status, explicitly distinguish TypeScript contract/domain coverage from production-usable browser runtime, MCP transport, planner provider integration, and infrastructure adapters.
- Before saying a platform surface is "complete," verify whether the repo contains executable integration code and runtime entrypoints, not only schemas, interfaces, route manifests, or contract tests.
- Treat missing browser driving, MCP server transport, provider-backed planner calls, persistence, artifact storage, queue transport, and credential vault implementations as blocking production gaps unless direct implementation evidence exists.
