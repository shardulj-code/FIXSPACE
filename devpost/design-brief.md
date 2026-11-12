---
status: approved
---

# Design brief: FIXSPACE — Spatial Engineering Copilot

## The one spatial moment
At a desk with an ESP32 and L298N motor driver in front of them, the user looks down at the board, confirms the components with a pinch, and sees a contextual step card slightly below eye level near the active pin. The step shows the current wiring instruction, a short “Why this step?” explanation available on demand, and advances with large pinch buttons — all while hands stay free for wiring.

## Why it belongs on glasses
- Uses: <shares your view / draws in the world / leaves your body free; all three>
- Why it's better than the phone or laptop version: The instruction stays anchored to the physical board at real scale, so the user never turns away from the circuit. Hands remain available for jumper wires; eyes stay up on the task.

## Product or overlay
- Type: <overlay: responds to a real assembly task>
- What the real version would sense: Real ESP32/L298N component recognition, physical pin identification, live connection validation.
- Stand-in for the preview: Manual “Confirm Component” button with a simulated component layout; hard-coded step sequence; no live recognition.

## Where things live
- Where the user is looking during the main task: Down at the desk / circuit board, ~55 cm away (usable area ~23 × 38 cm at 55 cm), slightly below eye level.
- Step card: Anchored near the desk, offset above small physical pins (real-world size ~15 cm wide, ~10 cm tall), ~55 cm from user, a little below eye level, inside 37° × 32° view.
- Component labels: Small markers near relevant pins, ~2–3 cm, visible when user looks at the board.
- Punch targets (Next / Why): Big (~5 cm), placed near the step card, below eye level, within easy arm reach.

## Hands and input
- Confirm Component: Pinch on large button (≥5 cm), with highlight when aimed.
- Next Step: Pinch on large “Next Step” button (≥5 cm).
- Why this connection?: Pinch on large “Why this connection?” button (≥5 cm).
- Voice (if any) and the button that does the same job: Voice not relied upon; every action has an equivalent pinch button.

## When things show
- Step card: Shows when the user confirms component and during active wiring step; collapses/recedes when the user pauses or after completion.
- Component labels: Show when the user is at the component; recede when navigating.
- If something needs attention out of view: Small directional arrow + hint (not sound, per design choice), pointing toward troubleshooting panel.

## Done criteria
Each one can be checked in Lens Studio's preview.
1. Start Setup → Confirm Component → numbered step card visible at ~55 cm below eye level.
2. Pinching “Next Step” advances to next instruction; step counter updates.
3. Pinching “Why this connection?” reveals explanation; closes on next action.
4. Completion state shows; restart/return button works.

## Out of scope
- Live component recognition / real-world pin identification (preview limitation).
- Voice control.
- Two-hand gestures, custom poses, or hand-speed tracking.
- Live AI inference for explanations (predefined content only).
- Real-world persistence / anchors across sessions.
- Multi-user shared Lens (Connected Lenses).

## Risks and open questions
- Simulated recognition: preview has no camera vision; component confirmation is manual.
- Limited FOV (~37° × 32°) requires placement near where user is already looking; large real-scale objects don't fit all at once.
- Readability at 55 cm must be validated in preview (light text on dark/additive surface, no black content).
- Real hand-tracking comfort over long assembly sessions unproven (label “feel unproven”).
- Team testing required to distinguish simulated interaction from real-world recognition.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene (manual “Confirm Component” button clearly labeled).
- Use real-world scale in centimeters. Keep content inside the user's view during the main task (~55 cm distance, below eye level).
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.
- Design choice recorded: troubleshooting uses visual arrow + hint rather than sound (per user preference).

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at? (Desk / board view — yes, instructions anchored near board)
   - Does it put something in my space, where it belongs? (Step card near desk, labels near pins — yes)
   - Does it free my hands or let me keep my eyes up? (Hands free for wiring; instruction visible without turning away — yes)
   - Would it be just as good on a phone? (No — spatial anchoring over real board and hands-free use are glasses-specific; but simulated recognition is a limitation)
4. **Check comfort.**
   - Everything needed is in view while wiring (step card + buttons near hands, not at edges).
   - Controls within reach (big pinch targets, arm's length).
   - Text reads easily at ~55 cm (light, high contrast).
   - Things show when needed and get out of way (collapse after step / completion).
5. **Label what you know.** Write “logic proven” next to anything tests and preview show (step progression, button responses, completion state). Write “feel unproven” next to anything only real glasses could tell (comfort over long assembly, real hand-tracking, real component recognition).
6. **Fix with design notes, not code.** Example: “Move step card 10 cm lower, make Next button larger, verify readability at 70 cm.” If a nudging fix takes under a minute, do it in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details: https://learn-specs.devpost.com/resources
