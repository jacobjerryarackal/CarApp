"use client";
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import styles from './Register.module.css';
import Image from 'next/image';
import Link from 'next/link';
import logo from "../../assets/logo2.png";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

const REGISTER_USER = gql`
  mutation CreateUser(
    $name: String!,
    $email: String!,
    $phone: String!,
    $city: String!,
    $state: String!,
    $country: String!,
    $pincode: String!,
    $password: String!
  ) {
    createUser(
      name: $name,
      email: $email,
      phone: $phone,
      city: $city,
      state: $state,
      country: $country,
      pincode: $pincode,
      password: $password
    ) {
      id
      name
      email
    }
  }
`;

type FormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [registerUser] = useMutation(REGISTER_USER, { client });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const validate = () => {
    let tempErrors: FormErrors = {};
  
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Valid email is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Valid 10-digit phone number is required";
    if (!formData.city) tempErrors.city = "City is required";
    if (!formData.state) tempErrors.state = "State is required";
    if (!formData.country) tempErrors.country = "Country is required";
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) tempErrors.pincode = "Valid 6-digit pincode is required";
    if (!formData.password || formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
   
    const isValid = validate();
    

    if (!isValid) {
      return;
    }
  
    try {
      const { data } = await registerUser({
        variables: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          password: formData.password,
        },
      });
  
      console.log('User registered:', data.createUser);
      alert("Registration successful!");
      router.push('/login');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="Car Logo" width={150} height={100} />
        </div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
        
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.city && <span className={styles.errorText}>{errors.city}</span>}
        
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.state && <span className={styles.errorText}>{errors.state}</span>}
        
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.country && <span className={styles.errorText}>{errors.country}</span>}
        
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.pincode && <span className={styles.errorText}>{errors.pincode}</span>}
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        
        <button type="submit" className={styles.button}>Register</button>

        <p className={styles.signInText}>
          Already have an account?{' '}
          <Link href="/login" className={styles.signInLink}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
