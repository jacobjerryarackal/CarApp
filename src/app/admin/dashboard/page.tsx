"use client";
import React from 'react';
import styles from './AdminDashboard.module.css';
import AdminSideNav from '@/components/AdminSideNav';

const AdminDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <AdminSideNav/>
      <main className={styles.main}>
        <h1 className={styles.h1}>Welcome to Admin Dashboard</h1>
      </main>
    </div>
  );
};

export default AdminDashboard;
