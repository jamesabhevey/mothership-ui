---
name: design-review
description: Review a pull request against the Mothership UI design system — component reuse, tokens, layout, accessibility and finish. Use when reviewing a PR in this repository.
---

# Design review

Review the changes in this pull request against the standard this library holds
itself to. Post the findings as review comments. Change nothing.

## Before anything else

Run the automated checks and read what they say:

```bash
npm run typecheck
npm run build-storybook && npm run check
npm test
```

**Do not report anything those already catch.** They cover hard-coded colours
and durations in `src/components`, a stale barrel or token stylesheet, dead
internal links, and every axe WCAG A/AA violation in both colour modes. If one
of them fails, say so in one line and stop — the author needs to fix that
first, and a second opinion on top of a red build is noise.

Your job is what they cannot check. Be specific about that and nothing else.

## What to look for

**Component reuse.** The failure that erodes a design system is a component
rebuilt inline: a `<button>` with utility classes where `Button` exists, a
hand-rolled dropdown instead of `Menu`, a `<div>` with a border doing `Card`'s
job. Check every new piece of markup against the 29 components in `src/index.ts`
before accepting it as new. If something genuinely is new, does it belong in the
library rather than in the page that needed it?

**Tokens beyond colour.** The contract checks cover colour and motion literals
in `src/components`. They do not cover spacing, sizing or type. A `p-[13px]`,
a `text-[15px]`, a `gap-[7px]` — anything in square brackets that is not on the
scale — is a finding. The scales are in `src/styles/tokens.css`.

**Layout.** Spacing that steps unevenly between siblings, a radius that
disagrees with the surface it sits on, a component that breaks below 375px, a
grid that does not reflow. Check the built Storybook rather than guessing from
the diff.

**Accessibility that axe cannot see.** axe checks the DOM as rendered; it does
not operate the component. Look for: keyboard traps and unreachable controls,
focus that does not move to a newly opened surface or return when it closes,
focus order that disagrees with visual order, an accessible name that exists
but says nothing ("click here", "button"), heading levels that skip, state
carried by colour alone, and touch targets under 44px.

**Finish.** Every interactive element needs hover, active, focus-visible and
disabled defined, not three of the four. Anything that loads needs a loading
and an empty state. Motion should resolve to the token scale and collapse under
reduced motion. Dark mode should have been considered rather than inherited.

**Documentation.** A new component without stories is invisible to the docs, to
autodocs and to the accessibility suite, which runs off the stories. Each one
needs a story per variant and per state, and a doc comment saying when to use it
*and when not to* — the second half is what stops a design system sprawling.

## How to report

Inline comments on the lines they concern, plus a short summary. If nothing is
wrong, say so in one line rather than manufacturing something.

Rank by what would actually harm someone using the library: a control that
cannot be reached by keyboard outranks a spacing step, which outranks a naming
preference. **Cap it at the five that matter most.** A review of twenty small
things gets skimmed and then ignored, and the two that mattered go with it.

This review is advisory. It does not block the merge, so write it as an opinion
a reviewer can disagree with, not a gate. Say plainly when you are unsure
rather than hedging every sentence — an uncertain finding stated as fact is
worse than one stated as a question.

Match the house style in anything you quote or suggest: plain words, specific
nouns, and a comment explains *why* the code is the way it is rather than
restating what it does.
