import React, { useEffect } from 'react'
import { usePageContext } from '@/pageProvider/PageContext'
import PropTypes from 'prop-types'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useTour } from '@reactour/tour'
import ContrastIcon from '@mui/icons-material/Contrast'
import Sidebar from '@/component/Sidebar'
import Header from '@/component/Header'
import {
  InfoOutlined as InfoIcon
} from '@mui/icons-material'

import ArrowLeftIcon from '@/component/Icons/IconArrowLeft'
import ArrowRightIcon from '@/component/Icons/IconArrowRight'

import layoutStyle from '@/assets/css/layout.module.css'

export default function MainCard (props) {
  const { customClass, pageIcon, pageHeading, activeMenu, activeSubMenu, children } = props
  MainCard.propTypes = {
    customClass: PropTypes.string,
    pageIcon: PropTypes.any,
    pageHeading: PropTypes.string,
    activeMenu: PropTypes.any,
    activeSubMenu: PropTypes.any,
    children: PropTypes.node
  }

  const { isActive, toggleActive, typeValue, openNamespace, theme, setTheme } = usePageContext()

  const { setIsOpen } = useTour()

  const handleClick = () => {
    toggleActive()
  }

  const handleChangetheme = () => {
    setTheme(prevTheme => !prevTheme)
  }
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme))
    if (theme) {
      document.body.classList.add('dashOuterPurple')
    } else {
      document.body.classList.remove('dashOuterPurple')
    }
  }, [theme])

  return (
    <>
      <section className={`${layoutStyle.dashOuter} ${layoutStyle.dashOuterMedium} ${isActive ? layoutStyle.dashOuterSmall : null} ${customClass} ${openNamespace === typeValue ? layoutStyle.dashSubMenuOpen : null}`}>
        <div className={`${layoutStyle.themeBtn}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title={`${theme === 'Default' ? 'Default' : 'Purple'}`}>
                <IconButton
                  onClick={handleChangetheme}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <ContrastIcon className={`${layoutStyle.themeico}`} />
                </IconButton>
              </Tooltip>
            </Box>
          </div>
          <div className={`${layoutStyle.tourBtn}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title={'infoTour'}>
                <IconButton
                  onClick={() => setIsOpen(true)}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <InfoIcon className={`${layoutStyle.tourico}`} />
                </IconButton>
              </Tooltip>
            </Box>
          </div>
        <Header
          click={handleClick}
          pageIcon={pageIcon}
          pageHeading={pageHeading}
        />
        <div className={`${layoutStyle.dashSdbr}`}>
          <div className={`${layoutStyle.sdbrClosebtn}`}>
            <IconButton
              onClick={handleClick}
            >
              {isActive
                ? (
                <ArrowRightIcon />
                  )
                : (
                <ArrowLeftIcon />
                  )}
            </IconButton>
          </div>
          <Sidebar
            activeMenu={activeMenu}
            activeSubMenu={activeSubMenu}
          />
        </div>
        <div className={`${layoutStyle.dashMainCard}`}>
          <div className={`${layoutStyle.dashBody}`}>
            {children}
          </div>
        </div>
      </section>
    </>
  )
}
