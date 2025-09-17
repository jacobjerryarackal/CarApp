import React, { useState, useEffect } from 'react';
import styles from './VehicleModal.module.css';

interface ModalProps {
  type: string;
  vehicle: any;
  onClose: () => void;
  onSave: (vehicleData: any) => void;
}

interface VehiclePrice {
  modelType: string;
  price: number;
}

export default function Modal({ type, vehicle, onClose, onSave }: ModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryImage, setPrimaryImage] = useState('');
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [manufacturerId, setManufacturerId] = useState('');
  const [modelId, setModelId] = useState('');
  const [vehicleTypeIds, setVehicleTypeIds] = useState<string[]>([]);
  const [featuresId, setFeaturesId] = useState<string[]>([]);
  const [vehiclePrices, setVehiclePrices] = useState<VehiclePrice[]>([]);

  useEffect(() => {
    if (vehicle) {
      setName(vehicle.name || '');
      setDescription(vehicle.description || '');
      setPrimaryImage(vehicle.primaryImage || '');
      setOtherImages(vehicle.otherImages || []);
      setAvailableQuantity(vehicle.availableQuantity || 0);
      setManufacturerId(vehicle.manufacturer?.id || '');
      setModelId(vehicle.model?.id || '');
      setVehicleTypeIds(vehicle.vehicleTypes?.map((type: any) => type.id) || []);
      setFeaturesId(vehicle.features?.map((feature: any) => feature.id) || []);
      setVehiclePrices(vehicle.vehiclePrices || []);
    }
  }, [vehicle]);

  const handleSave = () => {
    const vehicleData = {
      name,
      description,
      primaryImage,
      otherImages,
      availableQuantity,
      manufacturerId,
      modelId,
      vehicleTypeIds,
      featuresId,
      vehiclePrices,
    };

    onSave(vehicleData);
  };

  const handleVehiclePricesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsedPrices = JSON.parse(e.target.value);
      setVehiclePrices(parsedPrices);
    } catch (error) {
      console.error("Invalid JSON input for vehicle prices:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{type === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}</h2>
        <label>
          Name:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </label>
        <label>
          Description:
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </label>
        <label>
          Primary Image URL:
          <input 
            type="text" 
            value={primaryImage} 
            onChange={(e) => setPrimaryImage(e.target.value)} 
          />
        </label>
        <label>
          Other Images URLs (comma separated):
          <input 
            type="text" 
            value={otherImages.join(', ')} 
            onChange={(e) => setOtherImages(e.target.value.split(',').map(img => img.trim()))} 
          />
        </label>
        <label>
          Available Quantity:
          <input 
            type="number" 
            value={availableQuantity} 
            onChange={(e) => setAvailableQuantity(parseInt(e.target.value, 10))} 
          />
        </label>
        <label>
          Manufacturer ID:
          <input 
            type="text" 
            value={manufacturerId} 
            onChange={(e) => setManufacturerId(e.target.value)} 
          />
        </label>
        <label>
          Model ID:
          <input 
            type="text" 
            value={modelId} 
            onChange={(e) => setModelId(e.target.value)} 
          />
        </label>
        <label>
          Vehicle Type IDs (comma separated):
          <input 
            type="text" 
            value={vehicleTypeIds.join(', ')} 
            onChange={(e) => setVehicleTypeIds(e.target.value.split(',').map(id => id.trim()))} 
          />
        </label>
        <label>
          Features IDs (comma separated):
          <input 
            type="text" 
            value={featuresId.join(', ')} 
            onChange={(e) => setFeaturesId(e.target.value.split(',').map(id => id.trim()))} 
          />
        </label>
        <label>
          Vehicle Prices (JSON format):
          <textarea
            value={JSON.stringify(vehiclePrices, null, 2)}
            onChange={handleVehiclePricesChange}
          />
        </label>
        <div className={styles.buttons}>
          <button onClick={handleSave} className={styles.saveButton}>Save</button>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
