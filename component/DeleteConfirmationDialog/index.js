import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import PropTypes from 'prop-types'

const DeleteConfirmationDialog = ({
  open,
  onClose,
  handleClick,
  id,
  rule
}) => {
  DeleteConfirmationDialog.propTypes = {
    open: PropTypes.string,
    handleClick: PropTypes.func,
    onClose: PropTypes.func,
    id: PropTypes.any,
    rule: PropTypes.any
  }
  let names = null
  if (typeof id === 'object' && id?.name) {
    names = id.name
  } else if (!rule) {
    names = id?.map(item => item.name).join(', ')
  } else {
    names = id
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        {id && Array.isArray(id) && id.length > 0
          ? (
          <p>
            Are you sure you want to delete rows with ID: {names}?
          </p>
            )
          : (
              id && (
            <p>
              Are you sure you want to delete this rule: {names}?
            </p>
              )
            )}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          onClick={() => {
            onClose()
            const clickedId = !rule ? (Array.isArray(id) ? id.map(item => item.id) : id.id) : id.id
            handleClick(clickedId)
          }}
          color="primary"
        >
          Delete
        </Button>
        <Button onClick={onClose} variant='outlined' color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
