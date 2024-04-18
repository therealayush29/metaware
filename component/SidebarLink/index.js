import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import layoutStyle from '@/assets/css/layout.module.css'
import RightArrowIcon from '@/component/Icons/IconRightArrowBold'
import DownArrowIcon from '@/component/Icons/IconDownArrowBold'
import PropTypes from 'prop-types'

export default function SidebarLink (props) {
  const { customClass, icon, name, openNamespace, onClick, children } = props
  SidebarLink.propTypes = {
    customClass: PropTypes.string,
    icon: PropTypes.element.isRequired,
    name: PropTypes.string,
    onClick: PropTypes.func,
    openNamespace: PropTypes.any,
    children: PropTypes.node
  }
  // eslint-disable-next-line no-unused-vars
  const [openSubjectArea, setOpenSubjectArea] = useState(null)

  useEffect(() => {
    if (openNamespace === name) {
      setOpenSubjectArea(name)
    } else {
      setOpenSubjectArea(null)
    }
  }, [name, openNamespace])

  return (
    <div className={`${layoutStyle.sdbrLnkItem} ${customClass} ${openNamespace === name ? layoutStyle.open : null}`}>
      <div className={`${layoutStyle.sdbrLnkItemMenu} ${children ? layoutStyle.sdbrLnkDropMenu : null}`}>
        <Button
          variant="text"
          className={`${layoutStyle.sdbrLnkAnchor}`}
          onClick={() => {
            onClick(name)
          }}
        >
          <span>{icon}</span>
          <h4>{name}</h4>
          {children
            ? (
            <i>
              {openNamespace === name
                ? (
                <><DownArrowIcon /></>
                  )
                : (
                <><RightArrowIcon /></>
                  )}
          </i>
              )
            : null
          }
        </Button>
      </div>
      {openNamespace === name && (
        <>
          {children
            ? (
            <div className={`${layoutStyle.subUl}`}>
              {children}
            </div>
              )
            : (
                null
              )}
        </>
      )}
    </div>
  )
}
