# Skills Authoring Guide

Comprehensive guide for creating effective Claude Code skills.

## Skill Structure

### Directory Layout

```
skill-name/
├── SKILL.md              # Required: Main entry point
├── REFERENCE.md          # Optional: API reference
├── ADVANCED.md           # Optional: Advanced patterns
├── EXAMPLES.md           # Optional: Usage examples
└── scripts/
    ├── validate.py       # Optional: Validation scripts
    └── process.py        # Optional: Processing scripts
```

### SKILL.md Anatomy

```yaml
---
name: skill-name-kebab-case
description: What the skill does and when to use it. Include trigger keywords. Write in third person. Max 1024 characters.
---

# Skill Title

Brief overview paragraph.

## Quick Start

Essential code pattern:
```language
// Minimal working example
```

## Core Features

### Feature 1
Explanation with code example.

### Feature 2
Explanation with code example.

## Best Practices

1. Key practice with rationale
2. Key practice with rationale

## Reference Files

- **Advanced**: See [ADVANCED.md](ADVANCED.md)
- **Examples**: See [EXAMPLES.md](EXAMPLES.md)
```

## Writing Effective Descriptions

### Good Descriptions

```yaml
# Specific, includes trigger words
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Clear use case
description: Analyze Excel spreadsheets, create pivot tables, generate charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.

# Domain-specific
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
```

### Bad Descriptions

```yaml
# Too vague
description: Helps with documents

# No trigger words
description: Processes data

# First person (wrong)
description: I can help you process Excel files
```

## Progressive Disclosure Patterns

### Pattern 1: High-Level Guide

```markdown
# PDF Processing

## Quick start
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Advanced features

**Form filling**: See [FORMS.md](FORMS.md)
**API reference**: See [REFERENCE.md](REFERENCE.md)
**Examples**: See [EXAMPLES.md](EXAMPLES.md)
```

### Pattern 2: Domain Organization

```
bigquery-skill/
├── SKILL.md (overview)
└── reference/
    ├── finance.md (revenue metrics)
    ├── sales.md (pipeline data)
    └── product.md (usage analytics)
```

```markdown
# BigQuery Analysis

## Available datasets

**Finance**: Revenue, ARR → See [reference/finance.md](reference/finance.md)
**Sales**: Pipeline, accounts → See [reference/sales.md](reference/sales.md)
**Product**: API usage → See [reference/product.md](reference/product.md)
```

### Pattern 3: Conditional Details

```markdown
# Document Processing

## Creating documents
Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents
For simple edits, modify XML directly.

**Tracked changes**: See [REDLINING.md](REDLINING.md)
**OOXML details**: See [OOXML.md](OOXML.md)
```

## Workflow Patterns

### Checklist Pattern

```markdown
## PDF form filling workflow

Copy this checklist:

```
Progress:
- [ ] Step 1: Analyze form (run analyze_form.py)
- [ ] Step 2: Create field mapping
- [ ] Step 3: Validate mapping
- [ ] Step 4: Fill form
- [ ] Step 5: Verify output
```

**Step 1: Analyze the form**
Run: `python scripts/analyze_form.py input.pdf`

**Step 2: Create field mapping**
Edit `fields.json` to add values.

**Step 3: Validate mapping**
Run: `python scripts/validate_fields.py fields.json`
```

### Feedback Loop Pattern

```markdown
## Validation process

1. Make edits to document
2. **Validate immediately**: `python scripts/validate.py`
3. If validation fails:
   - Review error message
   - Fix issues
   - Run validation again
4. **Only proceed when validation passes**
5. Complete final steps
```

## Template Patterns

### Strict Template

```markdown
## Report structure

ALWAYS use this exact template:

```markdown
# [Title]

## Executive summary
[One paragraph overview]

## Key findings
- Finding 1
- Finding 2

## Recommendations
1. Recommendation 1
2. Recommendation 2
```
```

### Flexible Template

```markdown
## Report structure

Sensible default format, adapt as needed:

```markdown
# [Title]

## Summary
[Adapt based on content]

## Analysis
[Structure based on findings]
```

Adjust sections for specific contexts.
```

## Examples Pattern

```markdown
## Commit message format

Follow these examples:

**Example 1:**
Input: Added user authentication with JWT
Output:
```
feat(auth): implement JWT authentication

Add login endpoint and token validation
```

**Example 2:**
Input: Fixed date display bug in reports
Output:
```
fix(reports): correct date formatting

Use UTC timestamps consistently
```
```

## Executable Scripts

### When to Include Scripts

- **Validation**: Check output before proceeding
- **Extraction**: Parse complex file formats
- **Transformation**: Convert between formats
- **Verification**: Confirm expected results

### Script Best Practices

```python
def process_file(path):
    """Process file, handling errors gracefully."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # Create with default instead of failing
        print(f"File {path} not found, creating default")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        print(f"Cannot access {path}, using default")
        return ''

# Document configuration constants
# HTTP timeout - 30s accounts for slow connections
REQUEST_TIMEOUT = 30
# Three retries balances reliability vs speed
MAX_RETRIES = 3
```

### Execution vs Reading

**Execute (common)**:
```markdown
Run `python scripts/analyze.py` to extract fields
```

**Read as reference (rare)**:
```markdown
See `scripts/analyze.py` for the extraction algorithm
```

## Content Guidelines

### Avoid Time-Sensitive Information

```markdown
# Bad - will become outdated
If before August 2025, use old API. After, use new API.

# Good - use "old patterns" section
## Current method
Use the v2 API: `api.example.com/v2/messages`

## Old patterns
<details>
<summary>Legacy v1 API (deprecated)</summary>
The v1 API used: `api.example.com/v1/messages`
</details>
```

### Use Consistent Terminology

Pick one term and use it throughout:

**Consistent**:
- Always "API endpoint" (not URL, route, path)
- Always "field" (not box, element, control)
- Always "extract" (not pull, get, retrieve)

## Checklist

### Core Quality
- [ ] Description specific with trigger words
- [ ] Description in third person
- [ ] SKILL.md under 500 lines
- [ ] Additional details in separate files
- [ ] No time-sensitive information
- [ ] Consistent terminology
- [ ] File references one level deep

### Code and Scripts
- [ ] Scripts handle errors gracefully
- [ ] No "magic numbers" - all values documented
- [ ] Required packages listed
- [ ] Validation steps for critical operations

### Testing
- [ ] Tested with Haiku, Sonnet, Opus
- [ ] Tested with real usage scenarios
- [ ] At least three test cases created

## Anti-Patterns

### Avoid

- Windows-style paths (`scripts\file.py`) - use forward slashes
- Too many options ("use pypdf or pdfplumber or...") - provide default
- Nested references (A.md → B.md → C.md) - keep one level deep
- Over-explaining ("PDF files are a format that...") - Claude knows this
- Vague descriptions ("helps with documents")
- First person ("I can help you...")

### Prefer

- Unix paths (`scripts/file.py`)
- Single recommendation with escape hatch
- Direct references from SKILL.md
- Concise, code-focused content
- Specific descriptions with trigger words
- Third person ("Processes documents...")
