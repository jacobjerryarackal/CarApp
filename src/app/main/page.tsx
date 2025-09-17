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

  if (loading) return (
    <div className={styles.loading_container}>
      <div className={styles.spinner}></div>
      <p>Loading vehicles...</p>
    </div>
  );

  if (error) return (
    <div className={styles.error_container}>
      <h2>Oops! Something went wrong</h2>
      <p>Error: {error.message}</p>
      <button onClick={() => window.location.reload()} className={styles.retry_btn}>
        Try Again
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.hero_content}>
          <h4>Upcoming Car Launch</h4>
          <h1>Car Deal Mission</h1>
          <p>Discover the latest models with exclusive offers</p>
          <Link href="#vehicles" className={styles.cta_button}>
            <span>Explore Collection</span>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1L17 7L10 13M17 7H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>
        <div className={styles.hero_overlay}></div>
      </section>

      {/* Vehicles Section */}
      <section id="vehicles" className={styles.vehicles_section}>
        <div className={styles.section_header}>
          <h2>Our Vehicle Collection</h2>
          <p>Explore our premium selection of vehicles</p>
        </div>
        
        <div className={styles.vehicles_grid}>
          {data.vehicles.map((car:any) => (
            <div key={car.id} className={styles.vehicle_card}>
              <div className={styles.card_image_container}>
                <img 
                    src={car.primaryImage} 
                    alt={car.name} 
                    className={styles.vehicle_image}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.currentTarget; // safer than e.target
                      target.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                <div className={styles.image_overlay}></div>
                <div className={styles.availability}>
                  {car.availableQuantity > 0 ? (
                    <span className={styles.in_stock}>In Stock ({car.availableQuantity})</span>
                  ) : (
                    <span className={styles.out_of_stock}>Out of Stock</span>
                  )}
                </div>
              </div>
              
              <div className={styles.card_content}>
                <div className={styles.brand_model}>
                  <span className={styles.manufacturer}>{car.manufacturer.name}</span>
                  <h3 className={styles.vehicle_name}>{car.name}</h3>
                </div>
                
                <p className={styles.vehicle_description}>
                  {car.description.length > 100 
                    ? `${car.description.substring(0, 100)}...` 
                    : car.description
                  }
                </p>
                
                <div className={styles.card_footer}>
                  <Link href={`/car/detail/${car.id}`} className={styles.details_button}>
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Main;