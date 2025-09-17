import React from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import styles from "./UserModal.module.css";

type ModalType = 'add' | 'edit' | 'delete';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface UserModalProps {
  type: ModalType;
  user: User | null;
  closeModal: () => void;
  onSave: (user: User) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
}

const UserModal: React.FC<UserModalProps> = ({ type, user, closeModal, onSave, onDelete, refetch }) => {
  const [formData, setFormData] = React.useState<User | null>(user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'delete' && user?.id) {
      await onDelete(user.id);
    } else if (type !== 'delete' && formData) {
      await onSave(formData);
    }
    refetch();
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h2 className={styles.h2}>
          {type === 'delete' ? 'Delete User' : type === 'add' ? 'Add User' : 'Edit User'}
        </h2>
        <form onSubmit={handleSubmit}>
          {type !== 'delete' && (
            <>
              <label className={styles.label}>
                Name:
                <input
                  className={styles.input}
                  type="text"
                  name="name"
                  value={formData?.name || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                Email:
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                Phone:
                <input
                  className={styles.input}
                  type="text"
                  name="phone"
                  value={formData?.phone || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                City:
                <input
                  className={styles.input}
                  type="text"
                  name="city"
                  value={formData?.city || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                State:
                <input
                  className={styles.input}
                  type="text"
                  name="state"
                  value={formData?.state || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                Country:
                <input
                  className={styles.input}
                  type="text"
                  name="country"
                  value={formData?.country || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.label}>
                Pincode:
                <input
                  className={styles.input}
                  type="text"
                  name="pincode"
                  value={formData?.pincode || ''}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}
          <button className={styles.button2} type="submit">
            {type === 'delete' ? 'Delete' : 'Save'}
          </button>
          <button className={styles.button3} type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
