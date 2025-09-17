"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminLogin.module.css";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo2.png";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const LOGIN_ADMIN = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      token
      admin {
        id
        email
      }
    }
  }
`;

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginAdmin, { data, loading, error }] = useMutation(LOGIN_ADMIN, {
    client,
  });
  const router = useRouter();

  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const { data } = await loginAdmin({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (data?.loginAdmin?.token) {
        // Store the JWT token in local storage
        localStorage.setItem("adminToken", data.loginAdmin.token);
        
        // Redirect to admin dashboard or another secured page
        alert("Admin successful!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="Car Logo" width={150} height={150} />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Admin Login"}
        </button>
        {error && <p className={styles.error}>Login failed. Please try again.</p>}
        <div className={styles.linkContainer}>
          <p className={styles.userText}>
            Not an admin?{" "}
            <Link href="/login" className={styles.userLink}>
              User Login
            </Link>
          </p>
          <Link href="/" className={styles.homeButton}>
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}
