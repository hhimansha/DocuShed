import { AppContext } from '@/Context/AppContext'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Doctorprofile = () => {

    const { userdata, getdoctorprofiledata, profileDta, setProfileData, currencysymbol,
        backendUrl } = useContext(AppContext)

    const [isEdit, setisedit] = useState(false)

    const updateprofile = async () => {
        try {

            const updateData = {
                address: profileDta.address,
                fees: profileDta.fees,
                available: profileDta.available,
                about: profileDta.about
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { withCredentials: true })
            if (data.success) {
                toast.success(data.message)
                setisedit(false)
                getdoctorprofiledata()
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }


    useEffect(() => {
        if (userdata.role === "doctor") {
            getdoctorprofiledata();
        }
    }, [userdata])

    return profileDta && (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-blue-600/80 w-full sm:max-w-64 rounded-lg' src={profileDta.image} alt="" />
                </div>
                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    <p className='flex items-center gap-2 font-extrabold text-gray-700'>{profileDta.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileDta.degree}-{profileDta.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileDta.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
                        {isEdit ? (
                            <textarea
                                rows="4"
                                className='border rounded-lg p-2 w-full text-sm text-gray-700 mt-1'
                                value={profileDta.about}
                                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                            />
                        ) : (
                            <p className='text-sm text-gray-600 max-w-[700px] mt-1 '>{profileDta.about}</p>
                        )}

                    </div>
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-800'>{currencysymbol}{isEdit ? <input type="number" onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileDta.fees} /> : profileDta.fees}</span>
                    </p>
                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <p className='text-sm'> {isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileDta.address.line1} /> : profileDta.address.line1}
                            <br />
                            {isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileDta.address.line2} /> : profileDta.address.line2}
                        </p>
                    </div>
                    <div className='flex gap-1 pt-2'>
                        <input onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileDta.available} type="checkbox" name='' id='' />
                        <label htmlFor="">Available</label>
                    </div>
                    {
                        isEdit ?
                            <button onClick={updateprofile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all'>save</button>
                            :
                            <button onClick={() => setisedit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all'>Edit</button>
                    }


                </div>
            </div>
        </div>
    )
}

export default Doctorprofile