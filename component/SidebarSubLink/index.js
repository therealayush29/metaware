import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'
import layoutStyle from '@/assets/css/layout.module.css'
import RightArrowIcon from '@/component/Icons/IconRightArrowBold'
import DownArrowIcon from '@/component/Icons/IconDownArrowBold'
import PropTypes from 'prop-types'

export default function SidebarSubLink (props) {
  const router = useRouter()
  const {
    name,
    customClass,
    subjectareas,
    openSubjectArea,
    toggleSubjectArea,
    onClick,
    isMeta,
    typeFromLoop
  } = props
  SidebarSubLink.propTypes = {
    customClass: PropTypes.string,
    isMeta: PropTypes.bool.isRequired,
    name: PropTypes.string,
    subjectareas: PropTypes.array,
    openSubjectArea: PropTypes.string,
    typeFromLoop: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    toggleSubjectArea: PropTypes.func.isRequired,
    length: PropTypes.number
  }

  const hasSubjectAreas = subjectareas && subjectareas.length > 0

  return (
    <>
      {hasSubjectAreas
        ? (
        <>
          <div
            className={`${layoutStyle.sdbrLnkItemMenu} ${
              hasSubjectAreas ? layoutStyle.sdbrLnkDropMenu : null
            } ${
              openSubjectArea === name ? layoutStyle.open : null
            } ${customClass}`}
          >
            <Button
              variant="text"
              className={`${layoutStyle.sdbrsubMenu}`}
              onClick={() => toggleSubjectArea(name)}
            >
              <i>
                {openSubjectArea === name
                  ? (
                  <DownArrowIcon />
                    )
                  : (
                  <RightArrowIcon />
                    )}
              </i>
              <h4>{name}</h4>
            </Button>
          </div>
          {openSubjectArea === name && (
            <ul className={`${layoutStyle.subSubUl}`}>
              {subjectareas &&
                subjectareas.map((subjectarea) => {
                  const url = isMeta
                    ? `/admin/${subjectarea.name}`
                    : `/data/${name}/${subjectarea.name}?id=${subjectarea.id}&type=${typeFromLoop}`
                  return (
                    <li
                      key={subjectarea.id}
                      className={
                        router.query.subjectarea === subjectarea.name
                          ? layoutStyle.active
                          : null
                      }
                    >
                      <Link
                        href={url}
                        key={subjectarea.id}
                        className={`${layoutStyle.sdbrSubSubMenu}`}
                        onClick={onClick}
                      >
                        <h4>{subjectarea.name}</h4>
                      </Link>
                    </li>
                  )
                })}
            </ul>
          )}
        </>
          )
        : null}
    </>
  )
}
