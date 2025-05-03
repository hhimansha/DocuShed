import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import { toast } from "react-toastify";
import RelatedDoctor from '../Components/RelatedDoctor.jsx';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { usershowdoctors, currencysymbol, userdata ,getDoctorsData,backendUrl} = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocInfo = () => {
      const doc = usershowdoctors.find(doc => doc._id === docId);
      setDocInfo(doc);
    };

    fetchDocInfo();
  }, [usershowdoctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const handleAppointmentClick = () => {
    if (!docInfo?.available) {
      toast.error(`${docInfo?.name} is currently not available!`);
      return;
    }
    if (userdata) {
      // navigate('/getappointment');
    } else {
      toast.error('Please login first!');
      navigate('/login');
    }
  };
  const getAvailableSlots = () => {
    if (!docInfo || !docInfo.slots_booked) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);

      const startOfDay = new Date(dayDate);
      startOfDay.setHours(10, 0, 0); // 10:00 AM

      const endOfDay = new Date(dayDate);
      endOfDay.setHours(21, 0, 0); // 9:00 PM

      let currentSlotTime = new Date(startOfDay);

      // Adjust start time for today
      if (i === 0) {
        const now = new Date();
        currentSlotTime = new Date(now);
        currentSlotTime.setHours(currentSlotTime.getHours() + 1);
        currentSlotTime.setMinutes(currentSlotTime.getMinutes() > 30 ? 30 : 0);
        currentSlotTime.setSeconds(0, 0);

        // Ensure start time is within today's slot window
        if (currentSlotTime < startOfDay) currentSlotTime = new Date(startOfDay);
        if (currentSlotTime >= endOfDay) currentSlotTime = null; // No slots today
      }

      const timeSlots = [];
      if (currentSlotTime) {
        while (currentSlotTime < endOfDay) {
          const formattedTime = currentSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const slotDate = `${currentSlotTime.getDate()}_${currentSlotTime.getMonth() + 1}_${currentSlotTime.getFullYear()}`;
          const isSlotAvailable = !(docInfo.slots_booked[slotDate] || []).includes(formattedTime);

          if (isSlotAvailable) {
            timeSlots.push({ datetime: new Date(currentSlotTime), time: formattedTime });
          }

          currentSlotTime.setMinutes(currentSlotTime.getMinutes() + 30);
        }
      }

      allSlots.push({
        date: new Date(dayDate),
        slots: timeSlots
      });
    }

    setDocSlots(allSlots);
  };
  

// In the bookAppointment function
const bookAppointment = async () => {
  if (!userdata) {
    toast.warning('Login to book appointment')
    return navigate('/login')
  }

  const date = docSlots[slotIndex].date
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  const slotDate = day + "_" + month + "_" + year

  try {
    const { data } = await axios.post(backendUrl + '/api/auth/book-appointment', 
      { docId, slotDate, slotTime }, 
      { withCredentials: true }
    )
    
    if (data.success) {
      toast.success(data.message)
      getDoctorsData();
      // Redirect to confirmation page with appointment ID
      navigate(`/appointment-confirmation/${data.appointment._id}`)
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response?.data?.message || error.message)
  }
}


  return docInfo && (
    <div>
      {/* ---------- Doctor Details ----------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

          {/* ----- Doc Info : name, degree, experience ----- */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* ----- Doc About ----- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
              About <img className='w-3' src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currencysymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.map((day, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              key={index}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'
              } ${day.slots.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={day.slots.length === 0 ? "No available slots" : ""}
            >
              <p>{daysOfWeek[day.date.getDay()]}</p>
              <p>{day.date.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots[slotIndex]?.slots.map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              key={index}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
          {docSlots[slotIndex]?.slots.length === 0 && (
            <p className="text-sm text-gray-500">No available slots for this day</p>
          )}
        </div>

        <button 
          onClick={bookAppointment} 
          className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'
          disabled={!slotTime}
        >
          Book an appointment
        </button>
      </div>

      <RelatedDoctor speciality={docInfo.speciality} docId={docId} />
    </div>
  );
};

export default Appointment;
