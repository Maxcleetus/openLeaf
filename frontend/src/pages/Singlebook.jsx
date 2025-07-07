import React from 'react'
import { useParams } from 'react-router-dom'
const Singlebook = () => {

  const {bookid} = useParams()
  

  return (
    <div>Singlebook</div>
  )
}

export default Singlebook