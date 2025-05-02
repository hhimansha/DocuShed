import { assets } from '@/assets/assets';
import { AppContext } from '@/Context/AppContext';
import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Trash2, Mail, Phone, User, MapPin, Filter, ChevronDown, X } from 'lucide-react';

const PatientList = () => {
  const { userdata, patient, geallpatints, deletePatient } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    gender: '',
  });

  // Filter patients by name or email using optional chaining to avoid errors
  const filteredPatients = patient.filter((item) => {
    const matchesSearch = 
      (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (item.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    
    const matchesGender = filter.gender === '' || item.gender === filter.gender;
    
    return matchesSearch && matchesGender;
  });

  useEffect(() => {
    if (userdata) {
      geallpatints();
    }
  }, [userdata]);

  // Handle delete patient
  const handleDelete = (patientId, patientName) => {
    toast.warn(
      <div className="font-sans">
        <p className="font-medium text-gray-800">Delete Patient Record</p>
        <p className="text-sm text-gray-600 mt-1">Are you sure you want to delete {patientName || 'this patient'}? This action cannot be undone.</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              deletePatient(patientId);
              toast.dismiss();
              toast.success('Patient deleted successfully!');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
        className: "rounded-xl shadow-xl"
      }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setFilter({ gender: '' });
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = filter.gender !== '' || searchTerm !== '';

  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Patient List</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and view all patient records</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filter Button */}
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filterOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {/* Filter Dropdown */}
              {filterOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 w-64">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={filter.gender}
                        onChange={(e) => setFilter({...filter, gender: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={resetFilters}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Reset filters
                      </button>
                      <button
                        onClick={() => setFilterOpen(false)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchTerm && (
                <div className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm">
                  <span>Search: {searchTerm}</span>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-indigo-400 hover:text-indigo-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {filter.gender && (
                <div className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm">
                  <span>Gender: {filter.gender}</span>
                  <button 
                    onClick={() => setFilter({...filter, gender: ''})}
                    className="ml-2 text-indigo-400 hover:text-indigo-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              <button 
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-gray-700 underline flex items-center"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        
        {/* Patient Count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'}
        </div>
        
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-50 overflow-hidden">
                    {item.image ? (
                      <img
                        className="w-full h-full object-cover"
                        src={item.image}
                        alt={item.name || 'Patient'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                        <User className="h-16 w-16 text-indigo-200" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-lg text-gray-800">{item.name || 'Unnamed Patient'}</h3>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 break-all">{item.email || 'No email provided'}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item.phone || 'No phone provided'}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <User className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item.gender || 'Gender not specified'}</span>
                      </div>
                      
                      {(item?.address?.line1 || item?.address?.line2) && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {item?.address?.line1 || ''}
                            {item?.address?.line1 && item?.address?.line2 && ', '}
                            {item?.address?.line2 || ''}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                        aria-label="Delete patient"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">No patients found</h3>
                <p className="text-gray-500 text-center mt-2">
                  Try adjusting your search or filter criteria
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredPatients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPatients.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-50 flex-shrink-0 overflow-hidden">
                              {item.image ? (
                                <img className="h-full w-full object-cover" src={item.image} alt="" />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                  <User className="h-5 w-5 text-indigo-300" />
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">{item.name || 'Unnamed Patient'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Mail className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-600 truncate max-w-xs">{item.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-600">{item.phone || 'No phone'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.gender === 'Male' 
                              ? 'bg-blue-100 text-blue-800' 
                              : item.gender === 'Female'
                                ? 'bg-pink-100 text-pink-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.gender || 'Not specified'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {item?.address?.line1 ? (
                              <>
                                {item.address.line1}
                                {item.address.line2 && <>, {item.address.line2}</>}
                              </>
                            ) : (
                              'Not provided'
                            )}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDelete(item._id, item.name)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                            aria-label="Delete patient"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">No patients found</h3>
                <p className="text-gray-500 text-center mt-2">
                  Try adjusting your search or filter criteria
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;