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
      setCarData(JSON.parse(storedData));
    }
  }, []);

  if (!carData) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loading_spinner}></div>
        <p>Loading your luxury booking details...</p>
      </div>
    );
  }

  const handlePayment = () => {
    router.push(`/payment?amount=${carData?.totalPrice}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.luxury_container}>
      {/* Header Section */}
      <div className={styles.hero_header}>
        <div className={styles.header_content}>
          <h1 className={styles.brand_title}>{carData.vehicleName}</h1>
          <h2 className={styles.page_title}>Booking Confirmation</h2>
          <div className={styles.divider}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.summary_container}>
        {/* Customer Info Card */}
        <div className={styles.customer_card}>
          <div className={styles.card_header}>
            <span className={styles.card_icon}>👤</span>
            <h3>Customer Information</h3>
          </div>
          <div className={styles.card_content}>
            <div className={styles.info_row}>
              <span className={styles.info_label}>Reserved For</span>
              <span className={styles.info_value}>{carData.userName.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Details Card */}
        <div className={styles.vehicle_card}>
          <div className={styles.card_header}>
            <span className={styles.card_icon}>🚗</span>
            <h3>Vehicle Details</h3>
          </div>
          <div className={styles.card_content}>
            <div className={styles.info_grid}>
              <div className={styles.info_row}>
                <span className={styles.info_label}>Model</span>
                <span className={styles.info_value}>{carData.vehicleName}</span>
              </div>
              <div className={styles.info_row}>
                <span className={styles.info_label}>Variant</span>
                <span className={styles.info_value}>{carData.vehicleTypeName}</span>
              </div>
              <div className={styles.info_row}>
                <span className={styles.info_label}>Booking Date</span>
                <span className={styles.info_value}>
                  {new Date(carData.bookingDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Highlight */}
        <div className={styles.price_highlight}>
          <div className={styles.price_content}>
            <span className={styles.price_label}>Total Investment</span>
            <span className={styles.price_value}>₹{formatPrice(carData.totalPrice)}</span>
            <span className={styles.price_note}>*Exclusive of taxes and registration</span>
          </div>
        </div>

        {/* Specifications Section */}
        <div className={styles.specs_section}>
          <h3 className={styles.specs_title}>Technical Specifications</h3>
          <div className={styles.specs_grid}>
            {carData.features.map((feature) => (
              <React.Fragment key={feature.id}>
                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>⚙️</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Engine</span>
                    <span className={styles.spec_value}>{feature.engineType}</span>
                  </div>
                </div>

                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>🔧</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Transmission</span>
                    <span className={styles.spec_value}>{feature.transmission}</span>
                  </div>
                </div>

                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>🚀</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Horsepower</span>
                    <span className={styles.spec_value}>{feature.horsepower} HP</span>
                  </div>
                </div>

                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>💪</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Torque</span>
                    <span className={styles.spec_value}>{feature.torque} Nm</span>
                  </div>
                </div>

                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>⛽</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Fuel Efficiency</span>
                    <span className={styles.spec_value}>{feature.fuelEfficiency} km/l</span>
                  </div>
                </div>

                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>📏</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Dimensions</span>
                    <span className={styles.spec_value}>{feature.dimensions}</span>
                  </div>
                </div>

                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>⚖️</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Weight</span>
                    <span className={styles.spec_value}>{feature.weight} kg</span>
                  </div>
                </div>

                <div className={styles.spec_card}>
                  <div className={styles.spec_icon}>🎵</div>
                  <div className={styles.spec_content}>
                    <span className={styles.spec_label}>Infotainment</span>
                    <span className={styles.spec_value}>{feature.infotainment}</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Safety Features */}
        {carData.features[0]?.safetyFeatures && (
          <div className={styles.safety_section}>
            <h3 className={styles.safety_title}>Safety Features</h3>
            <div className={styles.safety_grid}>
              {carData.features[0].safetyFeatures.map((feature, index) => (
                <div key={index} className={styles.safety_item}>
                  <span className={styles.safety_icon}>🛡️</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className={styles.action_section}>
          <button className={styles.payment_button} onClick={handlePayment}>
            <span className={styles.button_text}>Proceed to Payment</span>
            <span className={styles.button_arrow}>→</span>
          </button>
          <p className={styles.assurance_text}>
            Your luxury experience awaits. Secure your reservation now.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;