import React, { useState } from 'react';
import styles from './PriceModal.module.css';


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


interface ModalProps {
  type: string;
  vehiclePrice: VehiclePrice | null;
  onClose: () => void;
  onSave: (vehicleTypeId: string, vehicleId: string, price: number) => void;
}

export default function Modal({ type, vehiclePrice, onClose, onSave }: ModalProps) {
  const [vehicleTypeId, setVehicleTypeId] = useState(vehiclePrice?.vehicleType?.id || '');
  const [vehicleId, setVehicleId] = useState(vehiclePrice?.vehicle?.id || '');
  const [price, setPrice] = useState(vehiclePrice?.price.toString() || '');

  const handleSave = () => {
    if (vehicleTypeId && vehicleId && price) {
      onSave(vehicleTypeId, vehicleId, parseFloat(price));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{type === 'add' ? 'Add Vehicle Price' : 'Edit Vehicle Price'}</h2>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="vehicleTypeId">Vehicle Type ID:</label>
          <input
            id="vehicleTypeId"
            type="text"
            value={vehicleTypeId}
            onChange={(e) => setVehicleTypeId(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="vehicleId">Vehicle ID:</label>
          <input
            id="vehicleId"
            type="text"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="price">Price:</label>
          <input
            id="price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.buttons}>
          <button onClick={handleSave} className={styles.saveButton}>Save</button>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
