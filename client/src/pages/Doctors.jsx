import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate();
  const { usershowdoctors } = useContext(AppContext) // Ensure doctors is initialized first
  const [filterdoc, setFilterdoc] = useState([])

  useEffect(() => {
    if (usershowdoctors) {
      if (speciality) {
        setFilterdoc(usershowdoctors.filter(doc => doc.speciality === speciality))
      } else {
        setFilterdoc(usershowdoctors)
      }
    }
  }, [usershowdoctors, speciality]) // Depend on doctors and speciality

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all hover:scale-105 cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""} `}
          >General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all hover:scale-105 cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""} `}
          >Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all hover:scale-105 cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""} `}
          >Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all hover:scale-105 cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""} `}
          >Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all hover:scale-105 cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""} `}
          >Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all hover:scale-105 cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""} `}
          >Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6 '>
          {filterdoc.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50" src={item.image} alt={item.name} />
              <div className="p-4">
                <div className='flex items-center gap-2 text-sm text-center'>
                  <p
                    className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}
                  ></p>
                  <p className={`${item.available ? 'text-green-500' : 'text-red-500'}`}>
                    {item.available ? "Available" : "Not Available"}
                  </p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
