import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Button,
  Grid,
  FormHelperText,
  FormControl
} from '@mui/material'
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close'
import UploadFileIcon from '@mui/icons-material/UploadFile'

const CreateNewRowModal = ({
  open,
  onClose,
  namespace,
  subjectarea,
  entity,
  apiUrl
}) => {
  CreateNewRowModal.propTypes = {
    open: PropTypes.bool,
    entity: PropTypes.string,
    subjectarea: PropTypes.string,
    type: PropTypes.string,
    namespace: PropTypes.string,
    apiUrl: PropTypes.string,
    onClose: PropTypes.func
  }
  const [data, setData] = useState([])

  const [fileUploadUrl, setFileUploadUrl] = useState('')
  const [filePath, setFilePath] = useState('')
  const [errorMsg, setErrorMsg] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    let hasError = false
    const errorMessages = {
      fileUploadUrl: fileUploadUrl ? '' : 'upload file is required',
    }

    setErrorMsg({ ...errorMessages })

    hasError = Object.values(errorMessages).some(message => message !== '')

    if (hasError) {
      return
    }
    try {
      setIsApplying(true)
      const newRunOptions = {
        // Missing code here?
      } // This curly brace seems to be an extra one

      const response = await fetch(
        `${apiUrl}/meta/${namespace}/${subjectarea}/${entity}/create_auto_detect_meta?runtime=`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        // Assuming toast is defined correctly
        toast.success('Inserted New Data')
        setIsApplying(false)
      } else {
        throw new Error('Failed to insert data')
      }
    } catch (error) {
      // Assuming toast is defined correctly
      toast.warning('An error occurred during Inserting')
      setIsApplying(false)
    }
  }

  console.log('data', fileUploadUrl)

  const handleFileChange = (event) => {
    // Extracting the file name from the file input
    const filePath = event.target.value
    const fileName = event.target.value.split('\\').pop()
    // Updating the state with the file name
    setFileUploadUrl(fileName)
    setFilePath(filePath)
  }
  return (
    <Dialog open={open}>
      <DialogTitle sx={{ py: 1.2, px: 2 }} id="customized-dialog-title">
        Upload file here
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => { onClose(); setFileUploadUrl(''); }}
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
            <div className="customForm">
              <Stack component="form" onSubmit={handleSubmit} spacing={2}>
              <FormControl fullWidth error={errorMsg.fileUploadUrl}>
                <div className='containUpload'>
                  <div className='uploadIcon'>
                    <Button color='primary' variant='contained'>
                      <UploadFileIcon />
                    </Button>
                    <input type="file" accept=".csv, .xlsx" name='FileAttachment' id='FileAttachment' onChange={handleFileChange} className='upload'/>
                  </div>
                  <input type="text" id="fileuploadurl" value={fileUploadUrl} className='uploadTag' readOnly placeholder="Maximum file size is 1GB" />
                </div>
                <FormHelperText>{errorMsg.fileUploadUrl}</FormHelperText>
              </FormControl>
              </Stack>
            </div>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ py: 1.2, px: 2, justifyContent: 'flex-start' }}>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          upload
        </Button>
        <Button onClick={() => { onClose(); setFileUploadUrl(''); }} variant="outlined" color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateNewRowModal
