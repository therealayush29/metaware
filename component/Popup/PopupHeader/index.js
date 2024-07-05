import React from 'react'
import {
  IconButton,
  Grid
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import layoutPopupStyle from '@/assets/css/layoutPopup.module.css'

export default function PopupHeader (props) {
  const { title, onClick, children } = props
  PopupHeader.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.any,
    children: PropTypes.node
  }
  return (
    <>
      <div className={layoutPopupStyle.popupHdrContent}>
        <Grid container spacing={2}>
          <Grid item xs>
            <div className={layoutPopupStyle.popupHdrTtl}>
              <h3>{title}</h3>
              {children}
            </div>
          </Grid>
          <Grid item xs="auto">
            <div className="popupHdrOptns">
              <div className="popupCloseBtn">
                <IconButton
                  aria-label="close"
                  sx={{
                    position: 'relative',
                    right: 0,
                    top: 0,
                    color: (theme) => theme.palette.grey[500]
                  }}
                  onClick={onClick}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
