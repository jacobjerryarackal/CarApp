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
    <div className={styles.car_details_container}>
      <div className={styles.image_gallery}>
        <div className={styles.thumbnail_list}>
          {[car.primaryImage, ...car.otherImages].map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${car.name} thumbnail ${index + 1}`}
              className={styles.thumbnail}
              onMouseEnter={() => handleImageHover(img)}
            />
          ))}
        </div>
        <div className={styles.main_image_container}>
          <img
            src={selectedImage || car.primaryImage}
            alt={car.name}
            className={styles.main_image}
          />
        </div>
      </div>

      <div className={styles.car_info}>
        {userName && <p>Welcome {userName}!</p>}
        <h1 className={styles.car_name}>{car.name}</h1>
        <p className={styles.car_description}>{car.description}</p>
        <p className={styles.car_quantity}>
          Available: {car.availableQuantity}
        </p>
        {selectedPrice !== null && (
          <p className={styles.car_price}>  
            <strong>Price:</strong> ₹{selectedPrice.toFixed(2)}
          </p>
        )}

        <div className={styles.date_picker_container}>
          <label>Select Date:</label>
          <div className={styles.date_picker_wrapper}>
            <DatePicker
              id="datePicker"
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date || new Date())}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className={styles.date_picker}
            />
          </div>
        </div>

        <div>
          <label htmlFor="vehicleType">Select Model: </label>
          <select
            id="vehicleType"
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">Select Model</option>
            {car.vehicleTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {selectedType && (
          <div className={styles.car_features}>
            <h2>Features:</h2>
            {filteredFeatures.length === 0 ? (
              <p>No features available for this model.</p>
            ) : (
              <ul>
                {filteredFeatures.map((feature) => (
                  <li key={feature.id}>
                    <p>
                      <strong>Engine Type:</strong> {feature.engineType}
                    </p>
                    <p>
                      <strong>Transmission:</strong> {feature.transmission}
                    </p>
                    <p>
                      <strong>Horsepower:</strong> {feature.horsepower} HP
                    </p>
                    <p>
                      <strong>Torque:</strong> {feature.torque} Nm
                    </p>
                    <p>
                      <strong>Fuel Efficiency:</strong> {feature.fuelEfficiency}{" "}
                      km/l
                    </p>
                    <p>
                      <strong>Dimensions:</strong> {feature.dimensions}
                    </p>
                    <p>
                      <strong>Weight:</strong> {feature.weight} kg
                    </p>
                    <p>
                      <strong>Safety Features:</strong>{" "}
                      {feature.safetyFeatures.join(", ")}
                    </p>
                    <p>
                      <strong>Infotainment:</strong> {feature.infotainment}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          className={styles.booking_button}
          onClick={handleBookNow}
          disabled={selectedPrice === null}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default CarDetails;
