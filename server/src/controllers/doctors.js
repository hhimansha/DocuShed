//change availablity

import Doctor from "../models/doctorModel.js"

const changeAvailability = async (req,res)=>{
      try {
        const {docId} =req.body

        const docData = await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availability change'})
      } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
      }
}

export {changeAvailability}