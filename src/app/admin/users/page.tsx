"use client"

import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';
import UserModal from '../../../components/UserModal';
import styles from './UserAdmin.module.css';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
      city
      state
      country
      pincode
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $phone: String!
    $city: String!
    $state: String!
    $country: String!
    $pincode: String!
    $password: String!
  ) {
    createUser(
      name: $name
      email: $email
      phone: $phone
      city: $city
      state: $state
      country: $country
      pincode: $pincode
      password: $password
    ) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $email: String
    $phone: String
    $city: String
    $state: String
    $country: String
    $pincode: String
    $password: String
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      phone: $phone
      city: $city
      state: $state
      country: $country
      pincode: $pincode
      password: $password
    ) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

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

export default function AdminUsers() {
  const { loading, error, data, refetch } = useQuery(GET_USERS, { client });
  
  const [createUser] = useMutation(CREATE_USER, { client });
  const [updateUser] = useMutation(UPDATE_USER, { client });
  const [deleteUser] = useMutation(DELETE_USER, { client });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSave = async (user: User) => {
    const { id, ...userWithoutId } = user;
    if (modalType === 'add') {
      await createUser({
        variables: { ...userWithoutId, password: 'defaultPassword' },
      });
    } else if (modalType === 'edit') {
      await updateUser({
        variables: { id, ...userWithoutId },
      });
    }
    refetch();
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await deleteUser({ variables: { id } });
    refetch();
    closeModal();
  };

  const openModal = (type: ModalType, user: User | null = null) => {
    setSelectedUser(user);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalType(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>User Management</h1>
      <button onClick={() => openModal('add')} className={styles.button1}>Add User</button>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.map((user: User) => (
            <tr key={user.id} className={styles.tr}>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{user.email}</td>
              <td className={styles.td}>
                <button className={styles.button2} onClick={() => openModal('edit', user)}>Edit</button>
                <button className={styles.button3} onClick={() => openModal('delete', user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && modalType && (
        <UserModal
          type={modalType}
          user={selectedUser}
          closeModal={closeModal}
          refetch={refetch}
          onSave={handleSave}
          onDelete={handleDelete} // Add this line
        />
      )}
    </div>
  );
}
