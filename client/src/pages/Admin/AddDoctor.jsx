import { assets } from '@/assets/assets_admin/assets'
import React from 'react'

const AddDoctor = () => {
  return (
    <form>

     <p>Add Doctor</p>
     <div>
      <div>
        <label htmlFor="doc-img">
          <img src={assets.upload_area} alt="" />
        </label>
        <input type="file" id="doc-img" hidden/>
        <p>Upload doctor picture</p>
      </div>
     </div>
  

      </form>
  )
}

export default AddDoctor