"use client"
import { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';
import BookingModal from '../../../components/BookingModal';
import styles from "./AdminBookings.module.css"

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      vehicle {
        name
      }
      user {
        name
      }
      userName
      bookingDate
      totalPrice
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $vehicleId: ID!
    $userId: ID!
    $userName: String!
    $bookingDate: String!
    $totalPrice: Float!
  ) {
    createBooking(
      vehicleId: $vehicleId
      userId: $userId
      userName: $userName
      bookingDate: $bookingDate
      totalPrice: $totalPrice
    ) {
      id
      userName
      bookingDate
      totalPrice
    }
  }
`;

const UPDATE_BOOKING = gql`
  mutation UpdateBooking(
    $id: ID!
    $vehicleId: ID
    $userId: ID
    $userName: String
    $bookingDate: String
    $totalPrice: Float
  ) {
    updateBooking(
      id: $id
      vehicleId: $vehicleId
      userId: $userId
      userName: $userName
      bookingDate: $bookingDate
      totalPrice: $totalPrice
    ) {
      id
      userName
      bookingDate
      totalPrice
    }
  }
`;

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`;

export default function AdminBookings() {
  const { loading, error, data, refetch } = useQuery(GET_BOOKINGS, { client });
  const [createBooking] = useMutation(CREATE_BOOKING, { client });
  const [updateBooking] = useMutation(UPDATE_BOOKING, { client });
  const [deleteBooking] = useMutation(DELETE_BOOKING, { client });

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSave = async (booking: any) => {
    if (modalType === 'add') {
      await createBooking({ variables: { ...booking } });
    } else if (modalType === 'edit') {
      await updateBooking({ variables: { id: booking.id, ...booking } });
    }
    refetch();
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await deleteBooking({ variables: { id } });
    refetch();
    closeModal();
  };

  const openModal = (type: 'add' | 'edit' | 'delete', booking: any | null = null) => {
    setSelectedBooking(booking);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setModalType(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Booking Management</h1>
      <button onClick={() => openModal('add')} className={styles.button1}>Add Booking</button>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>User Name</th>
            <th className={styles.th}>Booking Date</th>
            <th className={styles.th}>Total Price</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.bookings?.map((booking: any) => (
            <tr key={booking.id} className={styles.tr}>
              <td className={styles.td}>{booking.userName}</td>
              <td className={styles.td}>{booking.bookingDate}</td>
              <td className={styles.td}>{booking.totalPrice}</td>
              <td className={styles.td}>
                <button className={styles.button2} onClick={() => openModal('edit', booking)}>Edit</button>
                <button className={styles.button3} onClick={() => openModal('delete', booking)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && modalType && (
        <BookingModal
          type={modalType}
          booking={selectedBooking}
          closeModal={closeModal}
          refetch={refetch}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
