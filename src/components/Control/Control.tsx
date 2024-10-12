import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './Control.css'

export default function Control() {
  return (
    <div className="icon">
        <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  )
}
