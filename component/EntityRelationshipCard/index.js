import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

export default function EntityRelationshipCard (props) {
  const { type, id, sourceEntity, naturalKey } = props
  EntityRelationshipCard.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    sourceEntity: PropTypes.string.isRequired,
    naturalKey: PropTypes.string.isRequired
  }

  return (
    <div className={style.entyRltnCol}>
      <label>
        <input type='checkbox' />
        <div className={style.entyRltnInfo}>
          <ul>
            <li><strong>Type</strong><span>:</span>{type}</li>
            <li><strong>Referenced ID</strong><span>:</span>{id}</li>
            <li><strong>Source Entity</strong><span>:</span>{sourceEntity}</li>
            <li><strong>Natural Key</strong><span>:</span>{naturalKey}</li>
          </ul>
        </div>
      </label>
    </div>
  )
}
