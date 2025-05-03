import { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { FiCalendar, FiDollarSign, FiUsers, FiActivity } from 'react-icons/fi';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { AppContext } from '@/Context/AppContext';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(...registerables);

const DoctorDashboard = () => {
  const { userdata, backendUrl } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [appointmentsRes, paymentsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/doctor/appointments`, { 
            params: { userId: userdata._id } 
          }),
          axios.get(`${backendUrl}/api/payments/doctor/67de9f2135baf8db94173137`)
        ]);

        const appointments = appointmentsRes.data.data || [];
        const payments = paymentsRes.data.data || [];

        // Calculate unique patients
        const uniquePatients = new Set(
          appointments.map(app => app.patient?.userId || app.userId)
        ).size;

        // Calculate total earnings
        const totalEarnings = payments.reduce(
          (sum, payment) => sum + payment.amount, 0
        );

        // Get latest 5 appointments
        const latestAppointments = [...appointments]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setDashboardData({
          appointments: appointments.length,
          patients: uniquePatients,
          earnings: totalEarnings,
          latestAppointments,
          paymentStats: {
            completed: payments.filter(p => p.status === 'completed').length,
            pending: payments.filter(p => p.status === 'pending').length,
            failed: payments.filter(p => p.status === 'failed').length
          }
        });
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userdata?._id) {
      fetchDoctorData();
    }
  }, [userdata, backendUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!dashboardData) return null;

  // Data for charts
  const paymentStatusData = {
    labels: ['Completed', 'Pending', 'Failed'],
    datasets: [
      {
        label: 'Payments',
        data: [
          dashboardData.paymentStats.completed,
          dashboardData.paymentStats.pending,
          dashboardData.paymentStats.failed
        ],
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const weeklyAppointmentsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Appointments',
        data: [5, 8, 6, 10, 7, 3], // Replace with actual weekly data
        backgroundColor: '#10b981',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Earnings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-gray-800">
                LKR {dashboardData.earnings.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-1">+18% from last month</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">Appointments</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardData.appointments}</div>
              <div className="text-xs text-gray-400 mt-1">+12% from last month</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <FiCalendar className="w-6 h-6" />
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300"></div>
        </div>

        {/* Patients Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">Patients</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardData.patients}</div>
              <div className="text-xs text-gray-400 mt-1">+5% from last month</div>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-green-500 to-green-300"></div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Payment Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Payment Status</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64">
            <Bar 
              data={paymentStatusData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Weekly Appointments Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Weekly Appointments</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-64">
            <Bar 
              data={weeklyAppointmentsData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Appointments</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.latestAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {(appointment.patient?.name || appointment.userData?.name).charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patient?.name || appointment.userData?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patient?.email || appointment.userData?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.date || appointment.appointment?.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.slotTime || '10:00 AM'} {/* Default time if not available */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    LKR {appointment.amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;