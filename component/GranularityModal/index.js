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
  Button,
  Grid,
  Select,
  MenuItem
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'

const GranularityModal = ({ customClass, open, onClose }) => {
  GranularityModal.propTypes = {
    customClass: PropTypes.any,
    open: PropTypes.any,
    onClose: PropTypes.any
  }
  const infoText = '<describe text> Select granularity from the list of available options below.'

  const [granularityValue, setGranularityValue] = useState('10')

  const handleGranularityChange = (event) => {
    setGranularityValue(event.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <Dialog open={open} className={`pageViewPopup ${customClass}`}>
      <DialogTitle sx={{ py: 1.2, px: 2 }} id="customized-dialog-title">Granularity</DialogTitle>
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
              <Stack component="form" spacing={2}>
                <h3>Add Granularity</h3>
                <FormLabel className="fieldLabel">{infoText}</FormLabel>
                <FormControl fullWidth>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormLabel className="fieldLabel">Select Granularity <span className="fieldRequired">*</span></FormLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <Select
                        labelId="granularity"
                        id="granularity"
                        name="granularity"
                        placeholder="Select Granularity"
                        onChange={handleGranularityChange}
                        value={granularityValue}
                      >
                        <MenuItem value={10}>Account</MenuItem>
                        <MenuItem value={20}>Menu</MenuItem>
                        <MenuItem value={30}>System</MenuItem>
                        <MenuItem value={40}>Business</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </FormControl>
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
          Apply
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

export default GranularityModal
