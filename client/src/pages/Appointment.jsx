import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import { assets } from '../assets/assets';

import { toast } from "react-toastify";


import RelatedDoctor from '../Components/RelatedDoctor.jsx';


const Appointment = () => {
  const { docId } = useParams(); // Use "docId" (not "docid")

  const { usershowdoctors, currencysymbol, userdata, available } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState(null)
  const navigate = useNavigate();


  const fetchDocInfo = async () => {
    const docInfo = usershowdoctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)

  }
  const handleAppointmentClick = () => {
    if (!docInfo.available) {
      toast.error(`${docInfo.name} is currently not available!`);
      return;
    }
    if (userdata) {
      //navigate('/getappointment');
    } else {
      toast.error('Please login first!');
      navigate('/login');
    }
  };




  useEffect(() => {
    fetchDocInfo()
  }, [usershowdoctors, docId])


  return docInfo && (
    <div className="max-w-4xl mx-auto p-6 rounded-lg">
      {/* Doctor details container */}
      <div className="flex flex-col sm:flex-row gap-6 items-start  bg-white-500 shadow-lg">
        {/* Doctor Image */}
        <div className="sm:w-1/3">
          <img
            className="bg-indigo-100 w-full sm:max-w-72 rounded-lg "
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        {/* Doctor Info */}
        <div className="sm:w-2/3 ">
          <p className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            {docInfo.name}
            <img className="w-5 h-5" src={assets.verified_icon} alt="Verified" />
          </p>

          <p className="text-gray-700 text-lg mt-1">{docInfo.degree} - {docInfo.speciality}</p>

          <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg text-sm">
            {docInfo.experience}  Experience
          </button>
          <div className="mt-6">
            <p className="text-xl font-medium text-gray-800 flex items-center gap-2">
              About
              <img className="w-5 h-5" src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-gray-600 mt-2 leading-relaxed">{docInfo.about}</p>
            <p className="text-gray-600 mt-2 leading-relaxed">Appointment fees:<span className='bg-amber-300 font-bold'>{currencysymbol}{docInfo.fees}</span></p>  <br />
            {userdata.role === 'admin' ? (
              ""
            ) : (
              <>
                <button
                  onClick={handleAppointmentClick}
                  className={`px-8 py-3 rounded-full font-light hidden md:block ${docInfo.available ? "bg-primary text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                  //disabled={!docInfo.available} // Disable if not available
                >
                  {!docInfo.available ? `${docInfo.name} is not available` : "Get Appointment"}
                </button>
                <br />
              </>
            )}


          </div>
        </div>
      </div>
      <div>

      </div>

      <div>

      </div>


      {/* Doctor Related Section */}

      <RelatedDoctor docId={docId} speciality={docInfo.speciality} />

    </div>

  )
}

export default Appointment