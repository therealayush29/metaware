import React from 'react'
import RightArrowIcon from '@/component/Icons/IconRightArrow'
import PropTypes from 'prop-types'
import style from './style.module.css'

export default function MetaCardItem (props) {
  const { icon, title, onClick, children } = props
  MetaCardItem.propTypes = {
    icon: PropTypes.any,
    title: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node
  }

  return (
    <div className={style.metaSdbrCol}>
      <div className={style.metaSdbrColHdr} onClick={onClick}>
          <h4>{icon} {title}</h4>
          <span><RightArrowIcon /></span>
      </div>
      <div className={style.metaSdbrColBody}>
        <div className={style.metaSdbrColIcon} onClick={onClick}>
          <span>{icon}</span>
        </div>
        {/* <div className='metaSdbrColBtn'>
          <span>Create</span>
        </div> */}
        {children}
      </div>
    </div>
  )
}
