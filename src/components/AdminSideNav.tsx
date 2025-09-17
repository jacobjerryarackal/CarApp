import React from "react";
import Link from "next/link";
import styles from "./AdminSideNav.module.css";

const AdminSideNav: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Admin</h2>
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/admin/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin/vehicles" className={styles.navLink}>
            Manage Vehicles
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin/prices" className={styles.navLink}>
            Manage Prices
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin/features" className={styles.navLink}>
            Manage Features
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin/users" className={styles.navLink}>
            Manage Users
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin/bookings" className={styles.navLink}>
            Manage Bookings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSideNav;
