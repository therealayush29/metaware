import React from 'react'
import {
  Grid
} from '@mui/material'
import PropTypes from 'prop-types'
import layoutPopupStyle from '@/assets/css/layoutPopup.module.css'

export default function PopupBody (props) {
  const { isFullWidth, children } = props
  PopupBody.propTypes = {
    isFullWidth: PropTypes.bool,
    children: PropTypes.node
  }
  return (
    <>
      <div className={layoutPopupStyle.popupBodyContent}>
        {isFullWidth === 'true'
          ? (
            <>
              {children}
            </>
            )
          : (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div className='customForm'>
                      {children}
                    </div>
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </>
            )}
      </div>
    </>
  )
}
