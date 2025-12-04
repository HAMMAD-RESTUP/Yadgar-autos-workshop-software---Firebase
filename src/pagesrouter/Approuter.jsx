import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import InsuranceHome from '../pages/InsuranceHome'
import Home from '../pages/Home'
import CreateBill from '../pages/Createbill'

function Approuter() {
  return (
  <>

      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/insurancehome' element={<InsuranceHome/>} />
          <Route path='/bill' element={<CreateBill/>} />
        </Routes>
      </Router>
  
  </>

  )
}

export default Approuter
