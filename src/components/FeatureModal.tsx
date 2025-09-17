import React, { useState, useEffect } from 'react';
import styles from './FeatureModal.module.css';

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
}

interface FeatureModalProps {
  type: string;
  feature: Feature | null;
  onClose: () => void;
  onSave: (
    engineType: string,
    transmission: string,
    horsepower: number,
    torque: number,
    fuelEfficiency: number,
    dimensions: string,
    weight: number,
    safetyFeatures: string[],
    infotainment: string,
    vehicleTypeId: string
  ) => void;
}


interface Vehicle {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  vehicle: Vehicle;
  user: User;
  userName: string;
  bookingDate: string;
  totalPrice: number;
}

interface BookingModalProps {
  type: 'add' | 'edit' | 'delete';
  booking?: Booking;
  closeModal: () => void;
  onSave: (formData: BookingFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface BookingFormData {
  vehicleId: string;
  userId: string;
  userName: string;
  bookingDate: string;
  totalPrice: string;
}


export default function FeatureModal({
  type,
  feature,
  onClose,
  onSave
}: FeatureModalProps) {
  const [engineType, setEngineType] = useState(feature?.engineType || '');
  const [transmission, setTransmission] = useState(feature?.transmission || '');
  const [horsepower, setHorsepower] = useState(feature?.horsepower || 0);
  const [torque, setTorque] = useState(feature?.torque || 0);
  const [fuelEfficiency, setFuelEfficiency] = useState(feature?.fuelEfficiency || 0);
  const [dimensions, setDimensions] = useState(feature?.dimensions || '');
  const [weight, setWeight] = useState(feature?.weight || 0);
  const [safetyFeatures, setSafetyFeatures] = useState(feature?.safetyFeatures || []);
  const [infotainment, setInfotainment] = useState(feature?.infotainment || '');
  const [vehicleTypeId, setVehicleTypeId] = useState(feature?.vehicleTypeId || '');

  useEffect(() => {
    if (feature) {
      setEngineType(feature.engineType);
      setTransmission(feature.transmission);
      setHorsepower(feature.horsepower || 0);
      setTorque(feature.torque || 0);
      setFuelEfficiency(feature.fuelEfficiency || 0);
      setDimensions(feature.dimensions || '');
      setWeight(feature.weight || 0);
      setSafetyFeatures(feature.safetyFeatures || []);
      setInfotainment(feature.infotainment || '');
      setVehicleTypeId(feature.vehicleTypeId || '');
    }
  }, [feature]);

  const handleSave = () => {
    onSave(
      engineType,
      transmission,
      horsepower || 0,
      torque || 0,
      fuelEfficiency || 0,
      dimensions,
      weight || 0,
      safetyFeatures,
      infotainment,
      vehicleTypeId
    );
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.h2}>{type === 'add' ? 'Add Feature' : 'Edit Feature'}</h2>
        <form className={styles.form}>
          <label className={styles.label}>
            Engine Type:
            <input
              type="text"
              value={engineType}
              onChange={(e) => setEngineType(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Transmission:
            <input
              type="text"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Horsepower:
            <input
              type="number"
              value={horsepower}
              onChange={(e) => setHorsepower(Number(e.target.value))}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Torque:
            <input
              type="number"
              value={torque}
              onChange={(e) => setTorque(Number(e.target.value))}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Fuel Efficiency:
            <input
              type="number"
              step="0.1"
              value={fuelEfficiency}
              onChange={(e) => setFuelEfficiency(Number(e.target.value))}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Dimensions:
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Weight:
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Safety Features:
            <input
              type="text"
              value={safetyFeatures.join(', ')}
              onChange={(e) => setSafetyFeatures(e.target.value.split(', '))}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Infotainment:
            <input
              type="text"
              value={infotainment}
              onChange={(e) => setInfotainment(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Vehicle Type ID:
            <input
              type="text"
              value={vehicleTypeId}
              onChange={(e) => setVehicleTypeId(e.target.value)}
              className={styles.input}
            />
          </label>
          <div className={styles.modalButtons}>
            <button className={styles.button} type="button" onClick={handleSave}>
              Save
            </button>
            <button className={styles.button} type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
