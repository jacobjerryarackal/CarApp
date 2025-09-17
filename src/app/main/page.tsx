"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import styles from "./Main.module.css";


const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});


const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      name
      description
      primaryImage
      availableQuantity
      manufacturer {
        name
      }
      model {
        name
      }
    }
  }
`;

function Main() {
  const { loading, error, data } = useQuery(GET_VEHICLES, { client });

  
  if (loading) return <p>Loading...</p>;

  
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      
      <section className={styles.section_main}>
        <div className={styles.section_inner}>
          <h4>Upcoming Car Launch</h4>
          <h2>Car Deal Mission</h2>
          <Link href="#" className={styles.btn}>
            <div className={styles.hover}></div>
            <span>Explore</span>
          </Link>
        </div>
      </section>

     
      <section className={styles.car_card_section}>
        <div className={styles.card_container}>
          {data.vehicles.map((car: any) => (
            <Link href={`/car/detail/${car.id}`} key={car.id} className={styles.car_card_link}>
              <div className={styles.car_card}>
                <img src={car.primaryImage} alt={car.name} className={styles.car_image} />
                <div className={styles.car_info}>
                  <h3 className={styles.car_name}>{car.name}</h3>
                  <p className={styles.car_description}>{car.description}</p>
                  <p className={styles.car_quantity}>Available: {car.availableQuantity}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default Main;
