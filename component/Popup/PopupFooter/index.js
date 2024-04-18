import React from 'react'
import { Button } from '@mui/material'
import PropTypes from 'prop-types'
import layoutPopupStyle from '@/assets/css/layoutPopup.module.css'

export default function PopupFooter (props) {
  const { handleSubmit, onClick, children, isApply } = props
  PopupFooter.propTypes = {
    handleSubmit: PropTypes.bool,
    onClick: PropTypes.node,
    children: PropTypes.node,
    isApply: PropTypes.bool
  }
  return (
    <>
      <div className={layoutPopupStyle.popupFtrContent}>
        {handleSubmit
          ? (
          <>
            <Button
              color="primary"
              onClick={handleSubmit}
              variant="contained"
              disabled={isApply}
            >
              {isApply === 'true' ? 'Apply' : 'Submit'}
            </Button>
          </>
            )
          : (
          <>{children}</>
            )}
        <Button
          onClick={onClick}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
      </div>
    </>
  )
}
