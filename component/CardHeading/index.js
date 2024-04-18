import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

export default function CardHeading (props) {
  CardHeading.propTypes = {
    icon: PropTypes.node,
    title: PropTypes.string
  }
  const { icon, title } = props

  return (
    <>
      <div className={`${style.dashHdngDiv}`}>
        <h3>{icon} {title}</h3>
      </div>
    </>
  )
}
