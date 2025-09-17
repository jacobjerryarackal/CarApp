"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useQuery,
  ApolloClient,
  useMutation,
  InMemoryCache,
  gql,
} from "@apollo/client";
import styles from "./CarDetails.module.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation"; 

const GET_CAR_DETAILS = gql`
  query GetCarDetails($id: ID!) {
    vehicle(id: $id) {
      id
      name
      description
      manufacturer {
        id
        name
      }
      model {
        id
        name
      }
      vehicleTypes {
        id
        name
      }
      features {
        id
        engineType
        transmission
        horsepower
        torque
        fuelEfficiency
        dimensions
        weight
        safetyFeatures
        infotainment
        vehicleType {
          id
        }
      }
      availableQuantity
      primaryImage
      otherImages
      vehiclePrices {
        id
        price
        vehicleType {
          id
          name
        }
      }
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $vehicleId: ID!
    $userId: ID!
    $userName: String!
    $bookingDate: String!
    $totalPrice: Float!
  ) {
    createBooking(
      vehicleId: $vehicleId
      userId: $userId
      userName: $userName
      bookingDate: $bookingDate
      totalPrice: $totalPrice
    ) {
      id
    }
  }
`;

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

interface VehiclePrice {
  id: string;
  price: number;
  vehicleType: {
    id: string;
    name: string;
  };
}

interface Feature {
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
  vehicleTypeId: string;
  vehicleType: {
    id: string;
  };
}

interface Vehicle {
  id: string;
  name: string;
  description: string;
  primaryImage: string;
  otherImages: string[];
  availableQuantity: number;
  manufacturer: {
    name: string;
  };
  model: {
    name: string;
  };
  vehicleTypes: {
    id: string;
    name: string;
  }[];
  features: Feature[];
  vehiclePrices: VehiclePrice[];
}

function CarDetails() {
  const { id } = useParams();
  const router = useRouter(); 
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { loading, error, data } = useQuery<{ vehicle: Vehicle | null }>(
    GET_CAR_DETAILS,
    {
      variables: { id },
      client,
    }
  );

  const [createBooking] = useMutation(CREATE_BOOKING, { client });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setUserName(user.name);
      setUserId(user.id);
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const car = data?.vehicle;

  if (!car) {
    return <p>Car not found</p>;
  }

  const handleImageHover = (img: string) => {
    setSelectedImage(img);
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);

    const price =
      car.vehiclePrices?.find((price) => price.vehicleType.id === typeId)
        ?.price || null;
    setSelectedPrice(price);
  };

  const filteredFeatures = car.features.filter(
    (feature) => feature.vehicleType.id === selectedType
  );

  const handleBookNow = async () => {
    if (selectedDate && selectedPrice !== null && selectedType) {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) {
        router.push("/login");
        return;
      }
  
      setUserName(user.name);
      setUserId(user.id);
  
      const selectedVehicleType = car.vehicleTypes.find(
        (type) => type.id === selectedType
      );
      const vehicleTypeName = selectedVehicleType ? selectedVehicleType.name : "";
  
      const filteredFeatures = car.features.filter(
        (feature) => feature.vehicleType.id === selectedType
      );
  
      const bookingData = {
        vehicleId: car.id,
        vehicleName: car.name,
        vehicleTypeName: vehicleTypeName,
        bookingDate: selectedDate.toISOString(),
        totalPrice: selectedPrice,
        userName: user.name,
        features: filteredFeatures,
      };
  
      try {
        await createBooking({
          variables: {
            vehicleId: car.id,
            userId: user.id,
            userName: user.name,
            bookingDate: selectedDate.toISOString(),
            totalPrice: selectedPrice,
          },
        });
        
        // Store data in localStorage
        localStorage.setItem("carData", JSON.stringify(bookingData));
        console.log("Booking data stored in localStorage:", bookingData);
  
        // Navigate to the booking summary page
        router.push(`/booksummary`);
      } catch (error) {
        console.error("Error creating booking:", error);
      }
    } else {
      alert("Please select a model, date, and make sure the price is available.");
    }
  };
  
  

  return (
    <div className={styles.luxury_container}>
      <div className={styles.hero_section}>
        <div className={styles.hero_content}>
          {userName && <p className={styles.welcome_text}>Welcome {userName.toUpperCase()}!</p>}
          <h1 className={styles.car_name}>{car.name}</h1>
          <p className={styles.car_tagline}>Experience extraordinary performance</p>
        </div>
      </div>

      <div className={styles.main_content}>
        <div className={styles.image_gallery}>
          <div className={styles.main_image_container}>
            <img
              src={selectedImage || car.primaryImage}
              alt={car.name}
              className={styles.main_image}
            />
          </div>
          <div className={styles.thumbnail_list}>
            {[car.primaryImage, ...car.otherImages].map((img, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnail_wrapper} ${selectedImage === img ? styles.active : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`${car.name} thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.booking_panel}>
          <div className={styles.price_section}>
            <div className={styles.availability}>
              <span className={styles.available_count}>{car.availableQuantity}</span>
              <span>Available Now</span>
            </div>
            {selectedPrice !== null && (
              <div className={styles.price_display}>
                <span className={styles.price_label}>Starting at</span>
                <span className={styles.price_value}>₹{selectedPrice.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className={styles.booking_form}>
            <div className={styles.form_group}>
              <label className={styles.form_label}>Select Date</label>
              <div className={styles.date_picker_wrapper}>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className={styles.date_picker}
                  popperClassName={styles.date_popper}
                />
                <span className={styles.calendar_icon}>📅</span>
              </div>
            </div>

            <div className={styles.form_group}>
              <label className={styles.form_label}>Select Model</label>
              <select
                className={styles.model_select}
                onChange={(e) => handleTypeChange(e.target.value)}
                value={selectedType || ''}
              >
                <option value="">Choose a model variant</option>
                {car.vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={styles.booking_button}
              onClick={handleBookNow}
              disabled={selectedPrice === null}
            >
              <span className={styles.button_text}>Reserve Now</span>
              <span className={styles.button_arrow}>→</span>
            </button>
          </div>

          {selectedType && filteredFeatures.length > 0 && (
            <div className={styles.features_preview}>
              <h3>Key Features</h3>
              <div className={styles.features_grid}>
                <div className={styles.feature_item}>
                  <span className={styles.feature_icon}>⚙️</span>
                  <span>{filteredFeatures[0].engineType}</span>
                </div>
                <div className={styles.feature_item}>
                  <span className={styles.feature_icon}>🚀</span>
                  <span>{filteredFeatures[0].horsepower} HP</span>
                </div>
                <div className={styles.feature_item}>
                  <span className={styles.feature_icon}>⛽</span>
                  <span>{filteredFeatures[0].fuelEfficiency} km/l</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedType && filteredFeatures.length > 0 && (
        <div className={styles.detailed_specs}>
          <h2>Technical Specifications</h2>
          <div className={styles.specs_grid}>
            <div className={styles.specs_group}>
              <h3>Performance</h3>
              <div className={styles.spec_item}>
                <span>Engine</span>
                <span>{filteredFeatures[0].engineType}</span>
              </div>
              <div className={styles.spec_item}>
                <span>Transmission</span>
                <span>{filteredFeatures[0].transmission}</span>
              </div>
              <div className={styles.spec_item}>
                <span>Horsepower</span>
                <span>{filteredFeatures[0].horsepower} HP</span>
              </div>
              <div className={styles.spec_item}>
                <span>Torque</span>
                <span>{filteredFeatures[0].torque} Nm</span>
              </div>
            </div>

            <div className={styles.specs_group}>
              <h3>Dimensions</h3>
              <div className={styles.spec_item}>
                <span>Size</span>
                <span>{filteredFeatures[0].dimensions}</span>
              </div>
              <div className={styles.spec_item}>
                <span>Weight</span>
                <span>{filteredFeatures[0].weight} kg</span>
              </div>
              <div className={styles.spec_item}>
                <span>Fuel Efficiency</span>
                <span>{filteredFeatures[0].fuelEfficiency} km/l</span>
              </div>
            </div>

            <div className={styles.specs_group}>
              <h3>Features</h3>
              <div className={styles.spec_item}>
                <span>Infotainment</span>
                <span>{filteredFeatures[0].infotainment}</span>
              </div>
              <div className={styles.specs_list}>
                <span>Safety Features</span>
                <ul>
                  {filteredFeatures[0].safetyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetails;
