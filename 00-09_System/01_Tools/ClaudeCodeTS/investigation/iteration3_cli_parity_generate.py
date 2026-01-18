#!/usr/bin/env python3
from __future__ import annotations

import os
import re
import subprocess
from dataclasses import dataclass
from typing import Iterable, Optional


RE_LONG_FLAG = re.compile(r"--[a-zA-Z0-9][a-zA-Z0-9-]*")
RE_SHORT_FLAG = re.compile(r"(?<!-)-[a-zA-Z0-9](?![a-zA-Z0-9-])")


@dataclass(frozen=True)
class RunResult:
  cmd: list[str]
  exit_code: Optional[int]
  timed_out: bool
  output: str

  def snippet(self, max_lines: int = 12, max_chars: int = 1200) -> str:
    out = self.output.strip("\n")
    lines = out.splitlines()
    clipped = "\n".join(lines[:max_lines])
    if len(clipped) > max_chars:
      clipped = clipped[: max_chars - 1] + "…"
    return clipped


def run_cmd(
  argv: list[str],
  *,
  timeout_s: float = 5.0,
  env: Optional[dict[str, str]] = None,
  stdin_text: str = "",
) -> RunResult:
  merged_env = os.environ.copy()
  if env:
    merged_env.update(env)
  try:
    p = subprocess.run(
      argv,
      input=stdin_text,
      stdout=subprocess.PIPE,
      stderr=subprocess.STDOUT,
      text=True,
      env=merged_env,
      timeout=timeout_s,
    )
    return RunResult(cmd=argv, exit_code=p.returncode, timed_out=False, output=p.stdout or "")
  except subprocess.TimeoutExpired as e:
    out = e.stdout if isinstance(e.stdout, str) else (e.stdout.decode("utf-8", "replace") if e.stdout else "")
    return RunResult(cmd=argv, exit_code=None, timed_out=True, output=out or "")


def strip_bun_prefix(output: str) -> str:
  lines = output.splitlines()
  if lines and lines[0].startswith("$ "):
    return "\n".join(lines[1:]) + ("\n" if output.endswith("\n") else "")
  return output


def extract_commands_from_help(help_text: str) -> list[str]:
  cmds: list[str] = []
  in_commands = False
  for line in help_text.splitlines():
    if line.strip() == "Commands:":
      in_commands = True
      continue
    if not in_commands:
      continue
    if not line.strip():
      continue
    # Commander formats command rows as:
    #   "<command spec><2+ spaces><description>"
    # The example blocks under some commands are not aligned this way, so we skip lines
    # that don't have a 2+ space column break.
    trimmed = line.strip()
    if re.search(r"\s{2,}", trimmed) is None:
      continue
    cmd_spec = re.split(r"\s{2,}", trimmed, maxsplit=1)[0]
    token = cmd_spec.split()[0] if cmd_spec.split() else ""
    if not token:
      continue
    for name in token.split("|"):
      if name == "help":
        continue
      cmds.append(name)
  # stable order, unique
  seen: set[str] = set()
  out: list[str] = []
  for c in cmds:
    if c in seen:
      continue
    seen.add(c)
    out.append(c)
  return out


def extract_option_lines(help_text: str) -> list[str]:
  lines = help_text.splitlines()
  out: list[str] = []
  in_opts = False
  for line in lines:
    if line.strip() == "Options:":
      in_opts = True
      continue
    if not in_opts:
      continue
    if line.strip() in {"Commands:", "Arguments:", "Env:", "Notes:"}:
      in_opts = False
      continue
    if not line.strip():
      continue
    # Commander help wraps long descriptions onto continuation lines that are
    # indented but do not start with an option marker; ignore those.
    if line.startswith("  ") and line.lstrip().startswith("-"):
      out.append(line.rstrip())
  return out


@dataclass(frozen=True)
class OptionSpec:
  display: str
  long_flags: tuple[str, ...]
  short_flags: tuple[str, ...]

  @property
  def key(self) -> str:
    if self.long_flags:
      return self.long_flags[0]
    if self.short_flags:
      return self.short_flags[0]
    return self.display


def parse_options(help_text: str) -> list[OptionSpec]:
  specs: list[OptionSpec] = []
  for line in extract_option_lines(help_text):
    # Keep the "flags" chunk only (before the description columns)
    # Example: "  -d, --debug [filter]  Enable debug…"
    flags_part = line.strip()
    # Cut after 2+ spaces which separate columns (don't make it optional).
    display = re.split(r"\s{2,}", flags_part, maxsplit=1)[0].strip()
    long_flags = tuple(sorted(set(RE_LONG_FLAG.findall(display))))
    short_flags = tuple(sorted(set(RE_SHORT_FLAG.findall(display))))
    if not long_flags and not short_flags:
      continue
    specs.append(OptionSpec(display=display, long_flags=long_flags, short_flags=short_flags))
  # Dedupe by display
  seen: set[str] = set()
  out: list[OptionSpec] = []
  for s in specs:
    if s.display in seen:
      continue
    seen.add(s.display)
    out.append(s)
  return out


def build_original_command_tree(*, max_depth: int = 3) -> list[list[str]]:
  base = ["node", "bundles/ClaudeCodeCode/cli.js"]
  root_help = run_cmd(base + ["--help"], timeout_s=8.0).output
  cmds = extract_commands_from_help(root_help)
  all_paths: list[list[str]] = [[c] for c in cmds]

  # breadth-first, but only a couple levels deep for this CLI
  idx = 0
  while idx < len(all_paths):
    path = all_paths[idx]
    idx += 1
    if len(path) >= max_depth:
      continue
    help_out = run_cmd(base + path + ["--help"], timeout_s=8.0).output
    sub = extract_commands_from_help(help_out)
    for c in sub:
      sub_path = path + [c]
      if sub_path not in all_paths:
        all_paths.append(sub_path)
  return all_paths


def cmd_to_str(parts: list[str]) -> str:
  return " ".join(parts) if parts else "(root)"


def is_help_like(output: str) -> bool:
  t = output.strip()
  if "Usage:" in t:
    return True
  if t.startswith("claude-ts "):
    return True
  return False


def main() -> int:
  original_base = ["node", "bundles/ClaudeCodeCode/cli.js"]
  ts_base = ["bun", "run", "cli"]

  original_paths = build_original_command_tree()

  # Ensure alias command paths that don't show as separate list entries
  # (commander prints "install|i" etc, but our regex expands them)
  # Already expanded in extract_commands_from_help.

  # Collect help outputs for original commands (for report + option extraction)
  original_help_by_cmd: dict[str, RunResult] = {}
  ts_help_by_cmd: dict[str, RunResult] = {}

  # Root tests
  root_cmds: list[tuple[str, list[str], list[str], dict[str, str]]] = [
    ("--help", original_base + ["--help"], ts_base + ["--help"], {}),
    ("--version", original_base + ["--version"], ts_base + ["--version"], {}),
  ]

  for label, ocmd, tcmd, env in root_cmds:
    original_help_by_cmd[label] = run_cmd(ocmd, timeout_s=8.0, env=env)
    ts_help_by_cmd[label] = run_cmd(tcmd, timeout_s=8.0, env=env)

  # Per-command help tests
  for path in original_paths:
    key = cmd_to_str(path)
    original_help_by_cmd[key] = run_cmd(original_base + path + ["--help"], timeout_s=8.0)
    # For TS, close stdin immediately so unknown commands don't hang.
    ts_help_by_cmd[key] = run_cmd(ts_base + path + ["--help"], timeout_s=4.0, stdin_text="")

  # Extra TS capabilities for flag extraction
  ts_mode_help: dict[str, RunResult] = {
    "root": run_cmd(ts_base + ["--help"], timeout_s=8.0),
    "doctor": run_cmd(ts_base + ["doctor", "--help"], timeout_s=8.0),
    "ripgrep": run_cmd(ts_base + ["--ripgrep", "--help"], timeout_s=8.0),
    "mcp-cli": run_cmd(ts_base + ["--mcp-cli", "--help"], timeout_s=8.0, env={"ENABLE_EXPERIMENTAL_MCP_CLI": "1"}),
  }

  original_root_help = original_help_by_cmd["--help"].output
  original_opts: dict[str, OptionSpec] = {}

  def add_opts(help_text: str):
    for spec in parse_options(help_text):
      original_opts.setdefault(spec.display, spec)

  add_opts(original_root_help)
  for path in original_paths:
    help_text = original_help_by_cmd[cmd_to_str(path)].output
    add_opts(help_text)

  ts_opts: dict[str, OptionSpec] = {}
  for rr in ts_mode_help.values():
    for spec in parse_options(strip_bun_prefix(rr.output)):
      ts_opts.setdefault(spec.display, spec)

  ts_all_flags: set[str] = set()
  for spec in ts_opts.values():
    ts_all_flags.update(spec.long_flags)
    ts_all_flags.update(spec.short_flags)

  # Specific tests requested by the prompt
  specific_tests: list[tuple[str, RunResult]] = []
  specific_tests.append(("bun run cli --help", run_cmd(ts_base + ["--help"], timeout_s=8.0)))
  specific_tests.append(("bun run cli --version", run_cmd(ts_base + ["--version"], timeout_s=8.0)))
  specific_tests.append(("bun run cli -p \"test prompt\"", run_cmd(ts_base + ["-p", "test prompt"], timeout_s=8.0)))
  specific_tests.append(
    (
      "bun run cli --dangerously-skip-permissions -p \"test\"",
      run_cmd(ts_base + ["--dangerously-skip-permissions", "-p", "test"], timeout_s=6.0),
    )
  )
  for cmd in ["chat", "run", "config"]:
    specific_tests.append((f"bun run cli {cmd} --help", run_cmd(ts_base + [cmd, "--help"], timeout_s=4.0)))

  # Interactive mode test (best-effort): run with stdin "exit\\n" and a short timeout
  interactive_test = run_cmd(ts_base, timeout_s=5.0, stdin_text="exit\n")

  # Write report
  out_lines: list[str] = []
  out_lines.append("# Iteration 3: CLI Command Parity")
  out_lines.append("")

  out_lines.append("## Commands Found in Original")
  for path in sorted(original_paths, key=lambda p: (len(p), p)):
    out_lines.append(f"- `{cmd_to_str(path)}`")
  out_lines.append("")

  out_lines.append("## Command Test Results")
  out_lines.append("| Command | Original | TypeScript | Test Output |")
  out_lines.append("|---------|----------|------------|-------------|")

  def status_cell(rr: RunResult) -> str:
    if rr.timed_out:
      return "⏱️ timeout"
    if rr.exit_code == 0:
      return "✅"
    if rr.exit_code is None:
      return "❌"
    return f"❌ (exit {rr.exit_code})"

  def status_cell_ts(rr: RunResult) -> str:
    if rr.timed_out:
      return "⏱️ timeout"
    text = strip_bun_prefix(rr.output)
    return "✅" if is_help_like(text) else "❌"

  def output_cell(rr: RunResult) -> str:
    snip = rr.snippet(max_lines=6, max_chars=400).replace("|", "\\|")
    snip = strip_bun_prefix(snip)
    if rr.timed_out:
      return f"`{snip}` (timed out)"
    return f"`{snip}`"

  # Root rows
  for key in ["--help", "--version"]:
    o = original_help_by_cmd[key]
    t = ts_help_by_cmd[key]
    if key == "--version":
      ts_ok = (not t.timed_out) and (t.exit_code == 0) and bool(strip_bun_prefix(t.output).strip())
      ts_cell = "✅" if ts_ok else "❌"
    else:
      ts_cell = status_cell_ts(t)
    out_lines.append(f"| `{key}` | {status_cell(o)} | {ts_cell} | {output_cell(t)} |")

  for path in sorted(original_paths, key=lambda p: (len(p), p)):
    key = cmd_to_str(path)
    o = original_help_by_cmd[key]
    t = ts_help_by_cmd[key]
    out_lines.append(f"| `{key} --help` | {status_cell(o)} | {status_cell_ts(t)} | {output_cell(t)} |")
  out_lines.append("")

  out_lines.append("## Flag Parity")
  out_lines.append("| Flag | Original | TypeScript | Status |")
  out_lines.append("|------|----------|------------|--------|")

  # Flatten original option specs into rows keyed by long flag when possible.
  # Keep the display string for readability (includes short aliases and arg placeholders).
  orig_specs = list(original_opts.values())
  orig_specs.sort(key=lambda s: s.key)

  for spec in orig_specs:
    present = any(f in ts_all_flags for f in (*spec.long_flags, *spec.short_flags))
    # Special-case known semantic conflict: original -p/--print vs TS -p/--prompt
    status = "✅" if present else "❌ missing"
    if "-p" in spec.short_flags and "--print" in spec.long_flags and "--prompt" in ts_all_flags:
      status = "⚠️ name/semantics differ (-p is --print vs --prompt)"
      present = True
    out_lines.append(f"| `{spec.display}` | ✅ | {'✅' if present else '❌'} | {status} |")
  out_lines.append("")

  out_lines.append("## Missing Commands")
  missing_cmds: list[str] = []
  broken_cmds: list[str] = []
  working_cmds: list[str] = []
  for path in original_paths:
    key = cmd_to_str(path)
    t = ts_help_by_cmd[key]
    t_text = strip_bun_prefix(t.output)
    if t.timed_out:
      broken_cmds.append(f"{key}: timed out")
    elif is_help_like(t_text):
      # Still might be "help-like" but not matching original; we keep it as working for now.
      working_cmds.append(key)
    else:
      missing_cmds.append(key)

  if missing_cmds:
    for c in missing_cmds:
      out_lines.append(f"1. `{c}`")
  else:
    out_lines.append("1. (none)")
  out_lines.append("")

  out_lines.append("## Missing Flags")
  missing_flags = []
  for spec in orig_specs:
    if "-p" in spec.short_flags and "--print" in spec.long_flags and "--prompt" in ts_all_flags:
      continue
    if not any(f in ts_all_flags for f in (*spec.long_flags, *spec.short_flags)):
      missing_flags.append(spec.display)
  if missing_flags:
    for f in missing_flags:
      out_lines.append(f"1. `{f}`")
  else:
    out_lines.append("1. (none)")
  out_lines.append("")

  out_lines.append("## Broken Commands")
  if broken_cmds:
    for b in broken_cmds:
      out_lines.append(f"1. {b}")
  else:
    out_lines.append("1. (none)")
  out_lines.append("")

  out_lines.append("## Working Commands")
  if working_cmds:
    for w in sorted(set(working_cmds)):
      out_lines.append(f"1. `{w}`: ✅")
  else:
    out_lines.append("1. (none)")
  out_lines.append("")

  out_lines.append("## Prompt-Specified Test Commands")
  out_lines.append("| Command | Result | Output |")
  out_lines.append("|---------|--------|--------|")
  for label, rr in specific_tests:
    # For --help probes, consider "works" only if help output appears.
    if "--help" in label:
      res = "✅" if is_help_like(strip_bun_prefix(rr.output)) and not rr.timed_out else "❌"
    # For the "dangerously-skip-permissions + -p" probe, treat interactive fallback as failure.
    elif "dangerously-skip-permissions" in label and " -p " in label:
      out = strip_bun_prefix(rr.output)
      res = "❌" if ("screen:" in out and "hint:" in out) else status_cell(rr)
    else:
      res = status_cell(rr)
    out_lines.append(f"| `{label}` | {res} | {output_cell(rr)} |")
  out_lines.append("")

  out_lines.append("## Interactive Mode Test")
  out_lines.append(f"- Command: `echo \"exit\" | bun run cli` (implemented via stdin piping)")
  out = strip_bun_prefix(interactive_test.output)
  interactive_started = ("screen:" in out and "hint:" in out) and not is_help_like(out)
  if interactive_started:
    result_line = "✅ (interactive UI rendered)"
  else:
    result_line = "❌ (printed help; TS CLI does not start interactive by default)"
  out_lines.append(f"- Result: {result_line}")
  out_lines.append(f"- Output: `{strip_bun_prefix(interactive_test.snippet(max_lines=10, max_chars=600)).replace('|','\\\\|')}`")
  out_lines.append("")

  report_path = os.path.join("investigation", "iteration-3-cli-parity.md")
  with open(report_path, "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))
    f.write("\n")

  print(report_path)
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
