import React from 'react'
import layoutPopupStyle from '@/assets/css/layoutPopup.module.css'
import PropTypes from 'prop-types'

export default function PopupOuter (props) {
  const { isTableDesign, isFooter, children } = props
  PopupOuter.propTypes = {
    isTableDesign: PropTypes.bool,
    isFooter: PropTypes.bool,
    children: PropTypes.node
  }
  return (
    <>
      <div className={`${layoutPopupStyle.popupOuterContent} ${isTableDesign === 'true' ? layoutPopupStyle.popupOuterTblContent : ''} ${isFooter === 'true' ? layoutPopupStyle.popupOuterFtrContent : ''}`}>
        {children}
      </div>
    </>
  )
}
