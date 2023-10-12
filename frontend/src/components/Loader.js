import { Spinner } from 'react-bootstrap'
import React from 'react'

function Loader() {
  return (
    <div>
      <Spinner 
        animation='border' 
        role='status' 
        style={{
            height: '50px',
            width: '50px',
            margin: 'auto',
            display: 'block'
        }}>
            <span className='sr-only'>Loading</span>
      </Spinner>
    </div>
  )
}

export default Loader
