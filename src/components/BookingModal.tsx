import React, { useState, useEffect } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import styles from './BookingModal.module.css';

interface Booking {
  id?: string;
  vehicleId?: string;
  userId?: string;
  userName?: string;
  bookingDate?: string;
  totalPrice?: number;
}

interface BookingModalProps {
  type: 'add' | 'edit' | 'delete';
  booking: Booking | null;
  closeModal: () => void;
  onSave: (booking: Booking) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
}

const BookingModal: React.FC<BookingModalProps> = ({ type, booking, closeModal, onSave, onDelete, refetch }) => {
  const [formData, setFormData] = useState<Booking>(booking || {});

  useEffect(() => {
    setFormData(booking || {});
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === 'delete' && booking?.id) {
        await onDelete(booking.id);
      } else if (type !== 'delete' && formData) {
        await onSave(formData);
      }
      await refetch(); // Ensure refetch is called after the operation
      closeModal();
    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log('Form data updated:', { ...formData, [name]: value });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.h2}>
          {type === 'delete' ? 'Delete Booking' : type === 'add' ? 'Add Booking' : 'Edit Booking'}
        </h2>
        <form onSubmit={handleSubmit}>
          {type !== 'delete' && (
            <>
              <label className={styles.label}>
                Vehicle ID:
                <input
                  className={styles.input}
                  type="text"
                  name="vehicleId"
                  value={formData.vehicleId || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                User ID:
                <input
                  className={styles.input}
                  type="text"
                  name="userId"
                  value={formData.userId || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                User Name:
                <input
                  className={styles.input}
                  type="text"
                  name="userName"
                  value={formData.userName || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                Booking Date:
                <input
                  className={styles.input}
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                Total Price:
                <input
                  className={styles.input}
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice || ''}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}
          <button className={styles.button} type="submit">
            {type === 'delete' ? 'Delete' : 'Save'}
          </button>
          <button className={styles.cancelButton} type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
