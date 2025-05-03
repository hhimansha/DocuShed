import { assets } from '@/assets/assets_admin/assets';
import { AppContext } from '@/Context/AppContext';
import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { FiCalendar, FiDollarSign, FiUsers, FiActivity } from 'react-icons/fi';
import { MdOutlineMedicalServices } from 'react-icons/md';

// Register ChartJS components
ChartJS.register(...registerables);

const Dasgboard = () => {
  const { dashData, getdahdata, userdata } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userdata?.role === "admin") {
      getdahdata().finally(() => setLoading(false));
    }
  }, [userdata]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!dashData) return null;

  // Data for charts
  const paymentStatusData = {
    labels: ['Completed', 'Pending', 'Failed'],
    datasets: [
      {
        label: 'Payments',
        data: [
          dashData.paymentStats?.completed || 0,
          dashData.paymentStats?.pending || 0,
          dashData.paymentStats?.failed || 0
        ],
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const monthlyEarningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Earnings (LKR)',
        data: [12000, 19000, 15000, 20000, 18000, 22000], // Replace with actual data
        backgroundColor: '#10b981',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Doctors Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">Total Doctors</div>
              <div className="text-2xl font-bold text-gray-800">{dashData.doctors}</div>
              <div className="text-xs text-gray-400 mt-1">+12% from last month</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <MdOutlineMedicalServices className="w-6 h-6" />
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
        </div>

        {/* Patients Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">Total Patients</div>
              <div className="text-2xl font-bold text-gray-800">{dashData.patients}</div>
              <div className="text-xs text-gray-400 mt-1">+8% from last month</div>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-green-500 to-green-300"></div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">Appointments</div>
              <div className="text-2xl font-bold text-gray-800">{dashData.appointment}</div>
              <div className="text-xs text-gray-400 mt-1">+15% from last month</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <FiCalendar className="w-6 h-6" />
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300"></div>
        </div>

        {/* Earnings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-gray-800">
                LKR {dashData.totalEarnings?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs text-gray-400 mt-1">+22% from last month</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-300"></div>
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

        {/* Monthly Earnings Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Earnings</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2025</option>
            </select>
          </div>
          <div className="h-64">
            <Bar 
              data={monthlyEarningsData} 
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashData.latestAppointments?.map((appointment) => (
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
                      {appointment.doctor?.name || appointment.docData?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.doctor?.speciality || appointment.docData?.speciality}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.slotTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    LKR {appointment.amount?.toFixed(2)}
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

export default Dasgboard;