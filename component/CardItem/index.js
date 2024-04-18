import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'
import { usePageContext } from '@/pageProvider/PageContext'

export default function CardItem (props) {
  const { icon, name, id, description, onClick, onclickRun, isContext } = props
  CardItem.propTypes = {
    icon: PropTypes.node,
    name: PropTypes.string,
    id: PropTypes.string,
    description: PropTypes.string,
    onClick: PropTypes.func,
    onclickRun: PropTypes.func,
    isContext: PropTypes.bool
  }
  const {
    activeCardId,
    setActiveCardId,
    clicked,
    setClicked
  } = usePageContext()

  const handleContextMenu = (e) => {
    e.preventDefault()
    setClicked(true)
    setActiveCardId(id)
  }

  return (
    <>
      {isContext === 'false'
        ? (
        <div className={style.cardCol} key={id}>
          <div className={style.cardColInner} onClick={onClick}>
            <span>{icon}</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        </div>
          )
        : (
        <div className={style.cardCol} key={id} onContextMenu={handleContextMenu}>
          <div className={style.cardColInner} onClick={onClick}>
            <span>{icon}</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
          {clicked && activeCardId === id && (
            <div className={style.contextMenu}>
              <ul>
                <li><a onClick={onclickRun}>Run Time</a></li>
              </ul>
            </div>
          )}
        </div>
          )}
    </>
  )
}
