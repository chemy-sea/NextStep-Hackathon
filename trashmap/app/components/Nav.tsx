import Link from "next/link";
import { NAV_ITEMS } from "../nav-items";
import styles from "./Nav.module.css";

// Responsive nav shell: renders a bottom tab bar below the 768px breakpoint
// and a top nav (list of links) at/above it. Same NAV_ITEMS source for both,
// switching is pure CSS (see Nav.module.css) so no JS viewport detection
// or hydration mismatch risk.
export default function Nav() {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.topNav}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.tabBar}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
