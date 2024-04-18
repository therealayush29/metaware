import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Grid
} from '@mui/material'
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close'

const CreateNewRowModal = ({ customClass, open, columns, onClose, onSubmit }) => {
  CreateNewRowModal.propTypes = {
    customClass: PropTypes.string,
    open: PropTypes.string,
    refetch: PropTypes.func,
    onClose: PropTypes.func,
    columns: PropTypes.array,
    onSubmit: PropTypes.func
  }
  const initialFieldState = columns.reduce((acc, column) => {
    acc[column.accessorKey ?? ''] = ''
    return acc
  }, {})

  const [values, setValues] = useState(initialFieldState)
  const [errors, setErrors] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const fieldErrors = {}

    // Validation loop through each non-'id' field
    columns.forEach((column) => {
      // Skip validation for 'id' field
      const fieldName = column.accessorKey // Assuming this holds the field name
      if (fieldName !== '') {
        if (!values[fieldName]) {
          fieldErrors[fieldName] = `${column.header} is required`
        }
      }
    })

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    // Clear errors if no validation issues
    setErrors({})
    onSubmit(values)
    setValues(initialFieldState)
    onClose()
  }
  return (
    <Dialog open={open} className={`pageViewPopup ${customClass}`}>
      <DialogTitle sx={{ py: 1.2, px: 2 }} id="customized-dialog-title">Insert New Data</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 4,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className='customForm'>
              <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                {columns.map((column) => {
                  const sanitizedColumnHeader = column.header.replace(/_/g, ' ')
                  return (
                    column.accessorKey !== '' && (
                      <FormControl fullWidth key={column.accessorKey}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <FormLabel className="fieldLabel">{sanitizedColumnHeader} <span className="fieldRequired">*</span></FormLabel>
                          </Grid>
                          <Grid item xs={8}>
                            <TextField
                              name={column.accessorKey}
                              value={values[column.accessorKey]}
                              onChange={(e) => {
                                const { name, value } = e.target
                                if (name !== '') {
                                  setValues({ ...values, [column.accessorKey]: value })
                                }
                              }}
                              error={Boolean(errors && column && column.accessorKey && errors[column.accessorKey])}
                              helperText={
                                errors &&
                                column &&
                                column.accessorKey &&
                                errors[column.accessorKey] &&
                                sanitizedColumnHeader
                              }
                            />
                          </Grid>
                        </Grid>
                      </FormControl>
                    )
                  )
                })}
              </Stack>
            </div>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ py: 1.2, px: 2, justifyContent: 'flex-start' }}>
        <Button
          color="primary"
          onClick={handleSubmit}
          variant="contained"
        >
          Insert
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateNewRowModal
