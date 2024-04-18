/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'

import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import LogoIcon from '@/public/logoWhiteIcon.png'
import MenuIcon from '@/component/Icons/IconMenu'

import WorkFlowModal from '@/component/WorkFlowModal'

import layoutStyle from '@/assets/css/layout.module.css'

export default function Header (props) {
  const { pageIcon, pageHeading, click } = props
  Header.propTypes = {
    pageIcon: PropTypes.any,
    pageHeading: PropTypes.string,
    click: PropTypes.func
  }
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const goToProfile = () => {
    router.push('/profile')
  }

  return (
    <>
      <div className={`${layoutStyle.dashHeader}`}>
        <div className={`${layoutStyle.dashHeaderTop}`}>
          <Box sx={{
            display: 'flex1',
            justifyContent: 'space-between'
          }}
          >
            <Grid container spacing={0}>
              <Grid xs={10}>
                <div className={`${layoutStyle.mblMenu}`} onClick={click}>
                  <MenuIcon />
                </div>
                <div className={`${layoutStyle.dashHdrLogo}`}>
                  <Link href="/" className={`${layoutStyle.dashHdrLogoLink}`}><Image src={LogoIcon} alt="Metaware Logo" width={20} height={20} /> Metaware</Link>
                </div>
              </Grid>
              <Grid xs={2}>
                <div className={`${layoutStyle.profileHdr}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title="Account Settings">
                      <IconButton
                        // onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <Avatar sx={{ width: 32, height: 32 }} className={`${layoutStyle.profileIcon}`}>M</Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    className={`${layoutStyle.profileList}`}
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}

                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >

                    <div className={`${layoutStyle.profileHdrCol}`}>
                      <div>Metaware</div>
                      <div onClick={handleClose}>
                        <Logout fontSize="small" />
                        Sign Out
                      </div>
                    </div>

                    <div className={`${layoutStyle.profileInrBox}`}>
                      <div className={`${layoutStyle.hdrPrflMedia}`}>
                        PS
                      </div>
                      <div className={`${layoutStyle.hdrPrflInfo}`} >
                        <h3>PD Web Services</h3>
                        <p>pdwebservices@gmail.com</p>
                        <p><a href='#'>My Profile</a></p>
                      </div>
                    </div>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                  </Menu>
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
        {/* <div className={`${layoutStyle.dashHeaderBtm}`}>
          <CardHeadingItem
            icon={pageIcon}
            title={pageHeading}
          />
        </div> */}
      </div>
      <WorkFlowModal />
    </>
  )
}
