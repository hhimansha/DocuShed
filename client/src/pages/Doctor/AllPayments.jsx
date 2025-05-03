import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '@/Context/AppContext';

const AllPayments = () => {
  const { userdata, getuser, backendUrl } = useContext(AppContext);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/payments/doctor/67de9f2135baf8db94173137`);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setPayments(response.data.data);
        setFilteredPayments(response.data.data); // Initialize filtered payments
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error(error.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  // Filter payments based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter(payment => 
        payment._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPayments(filtered);
    }
  }, [searchTerm, payments]);

  useEffect(() => {
    fetchPayments();
  }, []);

  // Update payment status
  const updatePaymentStatus = async (paymentId) => {
    try {
      await axios.put(`${backendUrl}/api/payments/${paymentId}/status`, {
        status: selectedStatus
      });
      toast.success('Payment status updated successfully');
      fetchPayments();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment status');
    }
  };

  // Delete payment
  const deletePayment = async (paymentId) => {
    try {
      await axios.delete(`${backendUrl}/api/payments/${paymentId}`);
      toast.success('Payment deleted successfully');
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment');
    }
  };

  // Status options
  const statusOptions = [
    { value: 'success', label: 'Success' },
    { value: 'pending', label: 'Pending' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'failed', label: 'Failed' },
    { value: 'chargedback', label: 'Chargeback' }
  ];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Payment Records</h1>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by Payment ID, Appointment ID, or User ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.patient?.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.appointment?.appointmentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === payment._id ? (
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payment.status === 'success' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            payment.status === 'canceled' ? 'bg-gray-100 text-gray-800' : 
                            payment.status === 'failed' ? 'bg-red-100 text-red-800' : 
                            'bg-purple-100 text-purple-800'}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === payment._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updatePaymentStatus(payment._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(payment._id);
                              setSelectedStatus(payment.status);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePayment(payment._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    {payments.length === 0 ? 'No payments found' : 'No matching payments found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllPayments;