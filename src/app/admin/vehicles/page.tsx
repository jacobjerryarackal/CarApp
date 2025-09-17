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
    if (modalType === "add") {
      await createVehicle({ variables: vehicleData });
    } else if (modalType === "edit" && currentVehicle) {
      await updateVehicle({
        variables: { id: currentVehicle.id, ...vehicleData },
      });
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle({ variables: { id } });
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= e.movementX;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1>Manage Vehicles</h1>
      <button
        onClick={() => openModal("add")}
        className={styles.addButton}
      >
        Add Vehicle
      </button>
      <div
        className={styles.tableContainer}
        ref={containerRef}
        onMouseDown={(e) => e.preventDefault()}
        onMouseMove={handleDrag}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Primary Image</th>
              <th>Available Quantity</th>
              <th>Manufacturer</th>
              <th>Model</th>
              <th>Vehicle Types</th>
              <th>Features</th>
              <th>Vehicle Prices</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.vehicles.map((vehicle: any) => (
              <tr key={vehicle.id}>
                <td>{vehicle.name}</td>
                <td>{vehicle.description}</td>
                <td>
                  <img
                    src={vehicle.primaryImage}
                    alt={vehicle.name}
                    className={styles.image}
                  />
                </td>
                <td>{vehicle.availableQuantity}</td>
                <td>{vehicle.manufacturer.name}</td>
                <td>{vehicle.model.name}</td>
                <td>
                  {vehicle.vehicleTypes
                    .map((type: any) => type.name)
                    .join(", ")}
                </td>
                <td>
                  {vehicle.features
                    .map((feature: any) => feature.name)
                    .join(", ")}
                </td>
                <td>
                  {vehicle.vehiclePrices.map((price: any) => (
                    <div key={price.vehicleType.id}>
                      {price.vehicleType.name}: {price.price}
                    </div>
                  ))}
                </td>
                <td className={styles.buttons}>
                  <button
                    onClick={() => openModal("edit", vehicle)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
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
