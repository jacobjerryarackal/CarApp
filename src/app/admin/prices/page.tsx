"use client"
import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';
import Modal from '../../../components/PriceModal';
import styles from './VehiclePriceAdmin.module.css';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});



export interface VehiclePrice {
  id: string;
  price: number;
  vehicleType: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    name: string;
  };
}



const GET_VEHICLE_PRICES = gql`
  query GetVehiclePrices {
    vehiclePrices {
      id
      price
      vehicleType {
        name
      }
      vehicle {
        name
      }
    }
  }
`;

const CREATE_VEHICLE_PRICE = gql`
  mutation CreateVehiclePrice($vehicleTypeId: ID!, $vehicleId: ID!, $price: Float!) {
    createVehiclePrice(vehicleTypeId: $vehicleTypeId, vehicleId: $vehicleId, price: $price) {
      id
      price
      vehicleType {
        name
      }
      vehicle {
        name
      }
    }
  }
`;

const UPDATE_VEHICLE_PRICE = gql`
  mutation UpdateVehiclePrice($id: ID!, $vehicleTypeId: ID, $vehicleId: ID, $price: Float) {
    updateVehiclePrice(id: $id, vehicleTypeId: $vehicleTypeId, vehicleId: $vehicleId, price: $price) {
      id
      price
      vehicleType {
        name
      }
      vehicle {
        name
      }
    }
  }
`;

const DELETE_VEHICLE_PRICE = gql`
  mutation DeleteVehiclePrice($id: ID!) {
    deleteVehiclePrice(id: $id)
  }
`;

export default function VehiclePriceAdmin() {
  const { loading, error, data } = useQuery(GET_VEHICLE_PRICES, { client });
  const [createVehiclePrice] = useMutation(CREATE_VEHICLE_PRICE, { client });
  const [updateVehiclePrice] = useMutation(UPDATE_VEHICLE_PRICE, { client });
  const [deleteVehiclePrice] = useMutation(DELETE_VEHICLE_PRICE, { client });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentVehiclePrice, setCurrentVehiclePrice] = useState<VehiclePrice | null>(null);


  const openModal = (type: string, vehiclePrice = null) => {
    setModalType(type);
    setCurrentVehiclePrice(vehiclePrice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVehiclePrice(null);
  };

  const handleSave = async (vehicleTypeId: string, vehicleId: string, price: number) => {
    if (modalType === 'add') {
      await createVehiclePrice({ variables: { vehicleTypeId, vehicleId, price } });
    } else if (modalType === 'edit' && currentVehiclePrice) {  
      await updateVehiclePrice({ variables: { id: currentVehiclePrice.id, vehicleTypeId, vehicleId, price } });
    }
    closeModal();
  };
  

  const handleDelete = async (id: string) => {
    await deleteVehiclePrice({ variables: { id } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Manage Vehicle Prices</h1>
      <button onClick={() => openModal('add')} className={styles.addButton}>Add Vehicle Price</button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Vehicle Type</th>
            <th>Vehicle</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.vehiclePrices.map((price: any) => (
            <tr key={price.id}>
              <td>{price.vehicleType.name}</td>
              <td>{price.vehicle.name}</td>
              <td>{price.price}</td>
              <td>
                <button onClick={() => openModal('edit', price)} className={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(price.id)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal 
          type={modalType} 
          vehiclePrice={currentVehiclePrice} 
          onClose={closeModal} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}
