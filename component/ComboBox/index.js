import React, { useState, useEffect, useRef } from 'react'
import {
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  Button,
  TextField
} from '@mui/material'
import PropTypes from 'prop-types'
import {
  RotateLeftRounded as RotateLeftRoundedIcon
} from '@mui/icons-material'
import { useEntries } from '@/Hooks/Entries'
import client from '../../apollo-client'
import style from './style.module.css'

const ComboBox = ({
  onInputChange,
  entity,
  subjectarea,
  type,
  hasError,
  namespace,
  isFormatted,
  isDisabledRow,
  placeholder,
  valueSrc
}) => {
  ComboBox.propTypes = {
    onInputChange: PropTypes.node,
    entity: PropTypes.string,
    subjectarea: PropTypes.string,
    type: PropTypes.string,
    namespace: PropTypes.string,
    hasError: PropTypes.bool,
    isDisabledRow: PropTypes.bool,
    placeholder: PropTypes.string,
    valueSrc: PropTypes.string,
    isFormatted: PropTypes.string
  }
  const [isLoading, setILoading] = useState(false)
  const [metaNamespace, setMetaNamespace] = useState([])
  const { data, loading, error } = useEntries(
    entity,
    subjectarea,
    type,
    namespace,
    client
  )
  useEffect(() => {
    if (loading) {
      setILoading(true)
    } else if (data) {
      setILoading(false)
      setMetaNamespace(data.meta_meta)
    }
  }, [loading, data])

  useEffect(() => {
    setInputValue(valueSrc)
  }, [valueSrc])

  const dropdownValues = metaNamespace.map((item) => item?.name)
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [textareaHeight, setTextareaHeight] = useState('auto')
  const dropdownRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownRef, textareaRef])

  useEffect(() => {
    if (textareaRef.current) {
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`)
    }

    const handleResize = () => {
      if (textareaRef.current) {
        setTextareaHeight(`${textareaRef.current.scrollHeight}px`)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setShowDropdown(value.includes(''))
    if (textareaRef.current) {
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`)
    }

    onInputChange(value)
  }

  const handleInputClick = () => {
    setShowDropdown(true)
  }

  const handleDropdownSelect = (selectedValue) => {
    setInputValue(selectedValue)
    setShowDropdown(false)
    onInputChange(selectedValue)
  }

  const [personName, setPersonName] = React.useState([])
  const [isExpressionMode, setIsExpressionMode] = React.useState(false)
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 350
      }
    }
  }

  const handleChange = (event) => {
    const {
      target: { value }
    } = event
    onInputChange(value)

    if (value.includes('expression')) {
      setIsExpressionMode(true)
      setPersonName(['expression'])
    } else {
      setIsExpressionMode(false)
      setPersonName(value)
    }
  }

  const handleButtonClick = () => {
    setIsExpressionMode(false)
    setPersonName([])
  }

  const handleCustomInputChange = (event) => {
    setInputValue(event.target.value)
    onInputChange([event.target.value])
  }

  return (
    <>
    {isFormatted === 'id'
      // eslint-disable-next-line multiline-ternary
      ? (
      <div className='comboTextMultiDrop'>
        {isExpressionMode
          ? (
          <>
            <div className='comboTextMultiDropInput'>
              <FormControl fullWidth>
                <TextField
                  name="name"
                  value={inputValue}
                  onChange={handleCustomInputChange}
                  variant="outlined"
                  placeholder={hasError ? 'This field is required' : placeholder}
                  autoComplete="off"
                  className={`${hasError ? style.error : ''}`}
                  disabled={isDisabledRow}
                />
              </FormControl>
              <Button
                color="primary"
                onClick={handleButtonClick}
                startIcon={<RotateLeftRoundedIcon />}
                variant="contained"
              ></Button>
            </div>
          </>
            )
          : (
          <FormControl fullWidth>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {dropdownValues
                .sort((a, b) => (a.startsWith(inputValue) ? -1 : 1)) // Sort based on whether the item starts with the input value
                .map((value) => (
                <MenuItem
                  key={value}
                  value={value}
                  disabled={isExpressionMode && value !== 'expression'}
                >
                  <Checkbox checked={personName.indexOf(value) > -1} size='xl' />
                  <ListItemText primary={value} />
                </MenuItem>
                ))}
              <MenuItem
                value="expression"
                disabled={isExpressionMode && 'expression' !== 'expression'}
              >
                <Checkbox checked={personName.indexOf('expression') > -1} size='xl' />
                <ListItemText primary="expression" />
              </MenuItem>
            </Select>
          </FormControl>
            )}
      </div>
        ) : (
      <div className={`${style.comboBoxDiv}`}>
        <textarea
          ref={textareaRef}
          name="name"
          value={inputValue || ''}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={hasError ? 'This field is required' : placeholder}
          autoComplete="off"
          className={`${style.comboTextarea} ${hasError ? style.error : ''}`}
          style={{ height: textareaHeight }}
          disabled={isDisabledRow}
        />
        {showDropdown && (
          <div className={style.comboDropdown} ref={dropdownRef}>
            {dropdownValues
              .sort((a, b) => (a.startsWith(inputValue) ? -1 : 1)) // Sort based on whether the item starts with the input value
              .map((value) => (
                <div
                  className={style.comboDropMenu}
                  key={value}
                  onClick={() => handleDropdownSelect(value)}
                >
                  {value}
                </div>
              ))}
          </div>
        )}
      </div>
        )
    }
    </>
  )
}

export default ComboBox
