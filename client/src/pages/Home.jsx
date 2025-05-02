import React from 'react'
import Header from '../Components/Header'
import SpecialtyMenu from '../Components/SpecialtyMenu'
import Topdoctors from '../Components/Topdoctors'
import Banner from '../Components/Banner'
import FloatingChatbot from '../components/chat/FloatingChatbot'

const Home = () => {
  return (
    <div>
     <Header/>
     <SpecialtyMenu/>
     <Topdoctors/>
     <Banner/>
     <FloatingChatbot />
    </div>
  )
}

export default Home

