"use client";
import { useState } from "react";
import styles from "./Login.module.css";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo2.png";
import { useRouter } from "next/navigation";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;


type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const router = useRouter();

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER, {
    client,
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await loginUser({ variables: { ...formData } });
  
      const token = response.data.loginUser.token;
      const user = response.data.loginUser.user;
  
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      // Manually trigger the storage event
      window.dispatchEvent(new Event("storage"));
  
      alert("Login successful!");
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="Car Logo" width={150} height={120} />
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
        {error && <p className={styles.error}>Login failed. Please try again.</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className={styles.linkContainer}>
          <p className={styles.registerText}>
            Don't have an account?{" "}
            <Link href="/register" className={styles.registerLink}>
              Register
            </Link>
          </p>
          <Link href="/admin" className={styles.adminButton}>
            Admin Login
          </Link>
        </div>
      </form>
    </div>
  );
}
