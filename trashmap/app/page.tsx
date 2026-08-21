import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Home</h1>

      {/* Temporary links for navigation testing only — not real nav entries.
          Bounty Detail, Post Bounty, and Submit Proof are reached from
          context (a bounty card, a FAB, etc.) once those features exist. */}
      <nav aria-label="Temporary test links">
        <ul>
          <li>
            <Link href="/bounty/1">Bounty Detail</Link>
          </li>
          <li>
            <Link href="/post-bounty">Post Bounty</Link>
          </li>
          <li>
            <Link href="/submit-proof">Submit Proof</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
