"use client"

import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';
import FeatureModal from '../../../components/FeatureModal';
import styles from './FeatureAdmin.module.css';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

interface Feature {
  id: string;
  engineType: string;
  transmission: string;
  horsepower?: number;
  torque?: number;
  fuelEfficiency?: number;
  dimensions?: string;
  weight?: number;
  safetyFeatures?: string[];
  infotainment?: string;
  vehicleTypeId: string;
  vehicleType?: {
    id: string;
    name: string;
  };
}



const GET_FEATURES = gql`
  query {
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
        name
      }
    }
  }
`;

const CREATE_FEATURE = gql`
  mutation createFeature(
    $engineType: String!,
    $transmission: String!,
    $horsepower: Int,
    $torque: Int,
    $fuelEfficiency: Float,
    $dimensions: String,
    $weight: Float,
    $safetyFeatures: [String],
    $infotainment: String,
    $vehicleTypeId: ID!
  ) {
    createFeatures(
      engineType: $engineType,
      transmission: $transmission,
      horsepower: $horsepower,
      torque: $torque,
      fuelEfficiency: $fuelEfficiency,
      dimensions: $dimensions,
      weight: $weight,
      safetyFeatures: $safetyFeatures,
      infotainment: $infotainment,
      vehicleTypeId: $vehicleTypeId
    ) {
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
        name
      }
    }
  }
`;

const UPDATE_FEATURE = gql`
  mutation updateFeature(
    $id: ID!,
    $engineType: String,
    $transmission: String,
    $horsepower: Int,
    $torque: Int,
    $fuelEfficiency: Float,
    $dimensions: String,
    $weight: Float,
    $safetyFeatures: [String],
    $infotainment: String
  ) {
    updateFeatures(
      id: $id,
      engineType: $engineType,
      transmission: $transmission,
      horsepower: $horsepower,
      torque: $torque,
      fuelEfficiency: $fuelEfficiency,
      dimensions: $dimensions,
      weight: $weight,
      safetyFeatures: $safetyFeatures,
      infotainment: $infotainment
    ) {
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
        name
      }
    }
  }
`;

const DELETE_FEATURE = gql`
  mutation deleteFeature($id: ID!) {
    deleteFeatures(id: $id)
  }
`;

const FeatureAdminPage = () => {
  const { data, refetch } = useQuery(GET_FEATURES,{client});
  const [createFeatures] = useMutation(CREATE_FEATURE, { client });
  const [updateFeature] = useMutation(UPDATE_FEATURE, { client });
  const [deleteFeature] = useMutation(DELETE_FEATURE, { client });
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  const handleDelete = async (id: string) => {
    try {
      await deleteFeature({ variables: { id } });
      refetch();
    } catch (error) {
      console.error('Error deleting feature:', error);
    }
  };

  const handleSave = async (feature: Feature) => {
    try {
        if (selectedFeature) {
            const { id, ...updateData } = feature; 
            await updateFeature({
                variables: {
                    id: selectedFeature.id, 
                    ...updateData,
                },
            });
        } else {
            await createFeatures({
                variables: {
                    ...feature,
                },
            });
        }
        refetch(); 
    } catch (error) {
        console.error('Error saving feature:', error);
    }
    setIsModalOpen(false); 
};



  return (
    <div className={styles.container}>
      <button className={styles.addButton} onClick={() => {
        setSelectedFeature(null);
        setIsModalOpen(true);
      }}>
        Add Feature
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Engine Type</th>
            <th>Transmission</th>
            <th>Horsepower</th>
            <th>Torque</th>
            <th>Fuel Efficiency</th>
            <th>Dimensions</th>
            <th>Weight</th>
            <th>Safety Features</th>
            <th>Infotainment</th>
            <th>Vehicle Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.features.map((feature: Feature) => (
            <tr key={feature.id}>
              <td>{feature.engineType}</td>
              <td>{feature.transmission}</td>
              <td>{feature.horsepower}</td>
              <td>{feature.torque}</td>
              <td>{feature.fuelEfficiency}</td>
              <td>{feature.dimensions}</td>
              <td>{feature.weight}</td>
              <td>{feature.safetyFeatures?.join(', ') || 'N/A'}</td>
              <td>{feature.infotainment}</td>
              <td>{feature.vehicleType?.name}</td>
              <td>
  <div className={styles.buttonContainer}>
    <button 
      className={styles.editButton} 
      onClick={() => {
        setSelectedFeature(feature);
        setIsModalOpen(true);
      }}
    >
      Edit
    </button>
    <button 
      className={styles.deleteButton} 
      onClick={() => handleDelete(feature.id)}
    >
      Delete
    </button>
  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <FeatureModal 
          type={selectedFeature ? 'edit' : 'add'} 
          feature={selectedFeature} 
          onClose={() => setIsModalOpen(false)} 
          onSave={()=>handleSave} 
        />
      )}
    </div>
  );
};

export default FeatureAdminPage;
