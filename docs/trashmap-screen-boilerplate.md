# TrashMap — Boilerplate Screen Spec

## Navigation (5 tabs)
**Home · Map · Community · Leaderboard · Profile**
Post Bounty / Submit Proof are actions (FAB), not tabs. Bounty Detail is a drill-down, not a tab.

---

## 1. Home
Landing screen after login.
- Quick stats: your points, active bounties nearby, current reliability score
- "Nearby bounties" preview list (2-3 cards, tap → Bounty Detail)
- Primary CTA: **Post a Bounty** (FAB or big button)
- Secondary CTA: **Find a Bounty to Clear**
- Banner slot for an active community event, if one is live

## 2. Map
Primary discovery surface.
- Pins = open bounties (color/icon by status: open, claimed, pending verification)
- Filter/segment control: All bounties / Event bounties only / Resolved (optional)
- Tap pin → opens **Bounty Detail**
- FAB: **Post a Bounty** (opens Post Bounty flow, pre-fills pin at current/tapped location)

## 3. Bounty Detail (drill-down, not a tab)
The hub for everything happening to one bounty.
- Photo, location, point value, status badge (Open / Claimed / Pending Verification / Verified / Disputed)
- Poster info (avatar, reliability score)
- Action button — changes based on **active role** and bounty status:
  - Citizen, bounty open → "Claim & Clean This"
  - Citizen, bounty claimed by you → "Submit Proof"
  - Official, bounty pending verification → "Approve" / "Flag as Suspicious"
- Timeline/log: posted at, claimed at, proof submitted at (this is what your "suspiciously fast" check reads from)

## 4. Post Bounty (flow, not a screen tab)
- Capture photo (live camera only, no gallery — spec this explicitly for Kiro)
- Auto-pin current GPS location (adjustable pin)
- Optional: point value (auto-suggested or manual)
- Submit → cooldown timer starts for this user/area
- Confirmation → bounty now visible on Map

## 5. Submit Proof (flow, tied to a specific bounty)
- Capture "after" photo (live camera only)
- Shown alongside the original "before" photo for comparison
- Submit → bounty status → Pending Verification
- Confirmation screen: "Awaiting verification — points pending"

## 6. Community / Events
- List/feed of official events posted by community partners (e.g. barangay), each with: description, date, associated bounty pool or real-life prize
- Tapping an event shows event-tagged bounties on the Map (filtered view)
- **[Simulated for demo]** "Post Event" button, visible only in Official role — creates a mock event with seed data

## 7. Leaderboard
- Ranking by points, scoped to the user's selected community
- Toggle: All-time / This event / This month
- Show reliability score next to rank (not just raw points) so trust is visible, not just volume

## 8. Profile / Settings
- Your community (set during onboarding — needs a first-run "select your community" step, not listed as its own tab but should exist as a flow)
- Points, badges, reliability/reputation score
- History: bounties you've posted, bounties you've cleared, their statuses
- Settings: notifications, account
- **Role switcher (demo only):** "View as: Citizen / Official" — toggles which actions render on Bounty Detail and Community screens. Label it clearly as a demo simulation, not a real auth system, so Kiro doesn't try to scaffold real role-based auth.

---

## Notes for the Kiro prompt
- Bounty needs a status enum: `open → claimed → pending_verification → verified | disputed`
- Bounty needs an `event_id` (nullable) to distinguish everyday bounties from event-tied ones with real prizes
- Role switcher is UI-only for the hackathon build — no real backend permission system needed
- Community/Events data can be seeded/mocked; don't build real partner onboarding
- Both Post and Submit Proof flows require live camera capture only (block gallery upload) — this is your main anti-fraud lever besides cooldown
