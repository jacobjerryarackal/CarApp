"use client";

import React, { useEffect, useState } from 'react';
import styles from './BookSummary.module.css';
import { useRouter } from "next/navigation";

interface CarFeature {
  id: string;
  engineType: string;
  transmission: string;
  horsepower: number;
  torque: number;
  fuelEfficiency: number;
  dimensions: string;
  weight: number;
  safetyFeatures: string[];
  infotainment: string;
}

interface CarData {
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  bookingDate: string;
  totalPrice: number;
  features: CarFeature[];
  userName: string;
  vehicleTypeName: string;
}

function BookingSummary() {
  const [carData, setCarData] = useState<CarData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('carData');
    if (storedData) {
      console.log('Stored Car Data:', storedData);
      setCarData(JSON.parse(storedData));
    }
  }, []);

  if (!carData) {
    return <div>Loading...</div>;
  }

  const handlePayment = () => {
    router.push(`/payment?amount=${carData?.totalPrice}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Booking Summary</h1>
      {carData?.userName && <p className={styles.p}><strong>Username:</strong> {carData?.userName}</p>}
      <p className={styles.p}><strong>Vehicle Name:</strong> {carData?.vehicleName}</p>
      <p className={styles.p}><strong>Model Type:</strong> {carData?.vehicleTypeName}</p>
      <p className={styles.p}><strong>Booking Date:</strong> {new Date(carData?.bookingDate).toLocaleDateString()}</p>
      <p className={styles.p}><strong>Total Price:</strong> ₹{carData?.totalPrice.toFixed(2)}</p>

      <h2 className={styles.sub_title}>Features</h2>
      {carData?.features?.map((feature) => (
        <div key={feature.id} className={styles.feature}>
          <p className={styles.p}><strong>Engine Type:</strong> {feature.engineType}</p>
          <p className={styles.p}><strong>Transmission:</strong> {feature.transmission}</p>
          <p className={styles.p}><strong>Horsepower:</strong> {feature.horsepower}</p>
          <p className={styles.p}><strong>Torque:</strong> {feature.torque}</p>
          <p className={styles.p}><strong>Fuel Efficiency:</strong> {feature.fuelEfficiency} km/l</p>
          <p className={styles.p}><strong>Dimensions:</strong> {feature.dimensions}</p>
          <p className={styles.p}><strong>Weight:</strong> {feature.weight} kg</p>
          <p className={styles.p}><strong>Safety Features:</strong> {feature.safetyFeatures.join(', ')}</p>
          <p className={styles.p}><strong>Infotainment:</strong> {feature.infotainment}</p>
        </div>
      ))}
      <button className={styles.confirm_button} onClick={handlePayment}>
        Make Payment
      </button>
    </div>
  );
}

export default BookingSummary;
