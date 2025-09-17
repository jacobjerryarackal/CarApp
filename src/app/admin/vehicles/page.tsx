"use client";
import React, { useState, useRef } from "react";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";
import Modal from "../../../components/VehicleModal";
import styles from "./VehicleAdmin.module.css";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

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
    name: string;
  }[];
  features: {
    name: string;
  }[];
  vehiclePrices: {
    price: number;
    vehicleType: {
      name: string;
    };
  }[];
}

const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      name
      description
      primaryImage
      otherImages
      availableQuantity
      manufacturer {
        name
      }
      model {
        name
      }
      vehicleTypes {
        name
      }
      features {
        infotainment
      }
      vehiclePrices {
        price
        vehicleType {
          name
        }
      }
    }
  }
`;

const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $name: String!
    $description: String!
    $primaryImage: String
    $otherImages: [String]
    $availableQuantity: Int!
    $manufacturerId: ID!
    $modelId: ID!
    $vehicleTypeIds: [ID!]!
    $featuresId: [ID!]!
  ) {
    createVehicle(
      name: $name
      description: $description
      primaryImage: $primaryImage
      otherImages: $otherImages
      availableQuantity: $availableQuantity
      manufacturerId: $manufacturerId
      modelId: $modelId
      vehicleTypeIds: $vehicleTypeIds
      featuresId: $featuresId
    ) {
      id
      name
      description
      primaryImage
      otherImages
      availableQuantity
      manufacturer {
        name
      }
      model {
        name
      }
      vehicleTypes {
        name
      }
      features {
        name
      }
      vehiclePrices {
        price
        vehicleType {
          name
        }
      }
    }
  }
`;

const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle(
    $id: ID!
    $name: String
    $description: String
    $primaryImage: String
    $otherImages: [String]
    $availableQuantity: Int
    $manufacturerId: ID
    $modelId: ID
    $vehicleTypeIds: [ID!]
    $featuresId: [ID!]
    $vehiclePrices: [VehiclePriceInput]
  ) {
    updateVehicle(
      id: $id
      name: $name
      description: $description
      primaryImage: $primaryImage
      otherImages: $otherImages
      availableQuantity: $availableQuantity
      manufacturerId: $manufacturerId
      modelId: $modelId
      vehicleTypeIds: $vehicleTypeIds
      featuresId: $featuresId
      vehiclePrices: $vehiclePrices
    ) {
      id
      name
      description
      primaryImage
      otherImages
      availableQuantity
      manufacturer {
        name
      }
      model {
        name
      }
      vehicleTypes {
        name
      }
      features {
        name
      }
      vehiclePrices {
        price
        vehicleType {
          name
        }
      }
    }
  }
`;

const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

export default function VehicleAdmin() {
  const { loading, error, data } = useQuery(GET_VEHICLES, { client });
  const [createVehicle] = useMutation(CREATE_VEHICLE, { client });
  const [updateVehicle] = useMutation(UPDATE_VEHICLE, { client });
  const [deleteVehicle] = useMutation(DELETE_VEHICLE, { client });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openModal = (type: string, vehicle = null) => {
    setModalType(type);
    setCurrentVehicle(vehicle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVehicle(null);
  };

  const handleSave = async (vehicleData: any) => {
    try {
      if (modalType === "add") {
        await createVehicle({ 
          variables: vehicleData,
          refetchQueries: [{ query: GET_VEHICLES }]
        });
      } else if (modalType === "edit" && currentVehicle) {
        await updateVehicle({
          variables: { id: currentVehicle.id, ...vehicleData },
          refetchQueries: [{ query: GET_VEHICLES }]
        });
      }
      closeModal();
    } catch (err) {
      console.error("Error saving vehicle:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle({ 
          variables: { id },
          refetchQueries: [{ query: GET_VEHICLES }]
        });
      } catch (err) {
        console.error("Error deleting vehicle:", err);
      }
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    containerRef.current.scrollLeft -= e.movementX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading vehicles...</p>
    </div>
  );
  
  if (error) return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()} className={styles.retryButton}>
        Try Again
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Vehicles</h1>
        <button
          onClick={() => openModal("add")}
          className={styles.addButton}
        >
          <span>+ Add Vehicle</span>
        </button>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>{data?.vehicles?.length || 0}</h3>
          <p>Total Vehicles</p>
        </div>
        <div className={styles.statCard}>
          <h3>{data?.vehicles?.reduce((acc: number, vehicle: any) => acc + vehicle.availableQuantity, 0) || 0}</h3>
          <p>Total Inventory</p>
        </div>
        <div className={styles.statCard}>
          <h3>{data?.vehicles?.filter((v: any) => v.availableQuantity > 0).length || 0}</h3>
          <p>Available Models</p>
        </div>
      </div>

      <div
        className={styles.tableContainer}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Manufacturer</th>
              <th>Model</th>
              <th>Types</th>
              <th>Features</th>
              <th>Prices</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.vehicles.map((vehicle: any) => (
              <tr key={vehicle.id}>
                <td>
                  <div className={styles.nameCell}>
                    <img
                      src={vehicle.primaryImage}
                      alt={vehicle.name}
                      className={styles.thumbnail}
                    />
                    <span>{vehicle.name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.description}>
                    {vehicle.description.length > 100 
                      ? `${vehicle.description.substring(0, 100)}...` 
                      : vehicle.description
                    }
                  </div>
                </td>
                <td>
                  <img
                    src={vehicle.primaryImage}
                    alt={vehicle.name}
                    className={styles.image}
                  />
                </td>
                <td>
                  <span className={vehicle.availableQuantity > 0 ? styles.inStock : styles.outOfStock}>
                    {vehicle.availableQuantity}
                  </span>
                </td>
                <td>{vehicle.manufacturer.name}</td>
                <td>{vehicle.model.name}</td>
                <td>
                  <div className={styles.tags}>
                    {vehicle.vehicleTypes.map((type: any) => (
                      <span key={type.name} className={styles.tag}>
                        {type.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.tags}>
                    {vehicle.features.map((feature: any, index: number) => (
                      <span key={index} className={styles.featureTag}>
                        {feature.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.prices}>
                    {vehicle.vehiclePrices.map((price: any) => (
                      <div key={price.vehicleType.name} className={styles.priceItem}>
                        <span className={styles.priceLabel}>{price.vehicleType.name}:</span>
                        <span className={styles.priceValue}>${price.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => openModal("edit", vehicle)}
                      className={styles.editButton}
                      title="Edit vehicle"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className={styles.deleteButton}
                      title="Delete vehicle"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          type={modalType}
          vehicle={currentVehicle}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}