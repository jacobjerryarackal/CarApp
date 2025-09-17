"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import styles from "./Header.module.css";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userJson = localStorage.getItem('user');
      const adminToken = localStorage.getItem('adminToken');

      setIsLoggedIn(!!userJson);  // Convert to boolean
      setIsAdminLoggedIn(!!adminToken);  // Convert to boolean
    };

    // Check login status on component mount
    checkLoginStatus();

    // Listen for changes in localStorage
    window.addEventListener("storage", checkLoginStatus);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src={logo} alt="Logo" width={180} height={80} />
        </Link>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className={styles.searchInput}
        />
      </div>
      <div>
        {isLoggedIn || isAdminLoggedIn ? (
          <button className={styles.btn1} onClick={handleLogout}>
            Sign Out
          </button>
        ) : (
          <button className={styles.btn1}>
            <Link href="/register" className={styles.c1}>
              Sign In
            </Link>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
