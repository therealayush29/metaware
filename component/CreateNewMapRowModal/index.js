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
  Grid,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close'
import { usePageContext } from '@/pageProvider/PageContext'
import { ToastContainer, toast } from 'react-toastify'
const CreateNewMapRowModal = ({ customClass, open, refetch, onClose }) => {
  CreateNewMapRowModal.propTypes = {
    customClass: PropTypes.string,
    open: PropTypes.string,
    refetch: PropTypes.func,
    onClose: PropTypes.func
  }
  const { metaNspace } = usePageContext()
  const apiUrl = 'https://mw-app-zk5t2.ondigitalocean.app'
  const initialState = {
    name: '',
    namespace: '',
    subjectarea: '',
    entity: ''
  }
  const [formData, setFormData] = useState(initialState)
  const [selectedNamespace, setSelectedNamespace] = useState(null)
  const [selectedSubjectArea, setSelectedSubjectArea] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [errorMsgName, setErrorMsgName] = useState(false)
  const [errorMsgNamespace, setErrorMsgNamespace] = useState(false)
  const [errorMsgSubjectarea, setErrorMsgSubjectarea] = useState(false)
  const [errorMsgEntity, setErrorMsgEntity] = useState(false)
  const handleInputChange = (event) => {
    const { id, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }))
  }
  const handleNamespaceChange = (event) => {
    const selectedNamespaceValue = event.target.value
    const selectedNamespaceObj = metaNspace.find(
      (namespace) => namespace.name === selectedNamespaceValue
    )
    setSelectedNamespace(selectedNamespaceObj)
    setSelectedSubjectArea(null)
    setFormData({
      ...formData,
      namespace: selectedNamespaceValue,
      subjectArea: '',
      entity: ''
    })
  }
  const handleSubjectAreaChange = (event) => {
    const selectedSubjectAreaValue = event.target.value
    const selectedSubjectAreaObj = selectedNamespace.subjectareas.find(
      (area) => area.name === selectedSubjectAreaValue
    )
    setSelectedSubjectArea(selectedSubjectAreaObj)
    setFormData({ ...formData, subjectarea: selectedSubjectAreaValue })
  }
  const handleEntityChange = (event) => {
    const selectedEntityValue = event.target.value
    setFormData({ ...formData, entity: selectedEntityValue })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, namespace, subjectarea, entity } = formData

    let hasError = false

    if (!name || !namespace || !subjectarea || !entity) {
      setErrorMsgName(name ? '' : 'Name is required')
      setErrorMsgNamespace(namespace ? '' : 'namespace is required')
      setErrorMsgSubjectarea(subjectarea ? '' : 'subjectarea is required')
      setErrorMsgEntity(entity ? '' : 'entity is required')
      hasError = true
    } else {
      setErrorMsgName('')
      setErrorMsgNamespace('')
      setErrorMsgSubjectarea('')
      setErrorMsgEntity('')
    }

    if (hasError) {
      // handleAlertTimeout(); // Clear alert after 3 seconds
      return
    }

    try {
      setIsApplying(true)
      const newRule = {
        type: 'map',
        name,
        map_status: 'active',
        map_source: {
          source_entity: {
            ns: namespace,
            sa: subjectarea,
            en: entity
          }
        },
        source_query: '.',
        source_filter: '.'
      }
      const response = await fetch(
        `${apiUrl}/meta/${namespace}/${subjectarea}/${entity}/create_map`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([newRule])
        }
      )

      if (response.ok) {
        // Assuming toast is defined correctly
        toast.success('Inserted New Data')
        setIsApplying(false)
        onClose()
        refetch()
      } else {
        throw new Error('Failed to insert data')
      }
    } catch (error) {
      // Assuming toast is defined correctly
      toast.warning('An error occurred during Inserting')
      setIsApplying(false)
    }
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Dialog open={open} className={`pageViewPopup ${customClass}`}>
        <DialogTitle sx={{ py: 1.2, px: 2 }} id="customized-dialog-title">
          Insert New Mapping
        </DialogTitle>
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
              <div className="customForm">
                <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Name <span className="fieldRequired">*</span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="name"
                          name="name"
                          onChange={handleInputChange}
                          value={formData.name}
                          error={Boolean(errorMsgName)}
                          helperText={errorMsgName}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth error={errorMsgNamespace}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Select Namespace{' '}
                          <span className="fieldRequired">*</span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <Select
                          labelId="namespace"
                          id="namespace"
                          name="namespace"
                          onChange={handleNamespaceChange}
                          value={formData.namespace}
                          error={Boolean(errorMsgNamespace)}
                        >
                          {metaNspace
                            .filter((item) => item.type === 'staging')
                            .map((item, id) => (
                              <MenuItem key={id} value={item.name}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errorMsgNamespace}</FormHelperText>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth error={errorMsgSubjectarea}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Select Subjectarea{' '}
                          <span className="fieldRequired">*</span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <Select
                          labelId="subjectarea"
                          id="subjectarea"
                          name="subjectarea"
                          onChange={handleSubjectAreaChange}
                          value={formData.subjectarea}
                          disabled={!selectedNamespace}
                          error={Boolean(errorMsgSubjectarea)}
                        >
                          {selectedNamespace &&
                            selectedNamespace.subjectareas.map(
                              (area, index) => (
                                <MenuItem key={index} value={area.name}>
                                  {area.name}
                                </MenuItem>
                              )
                            )}
                        </Select>
                        <FormHelperText>{errorMsgSubjectarea}</FormHelperText>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth error={errorMsgEntity}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Select Entity <span className="fieldRequired">*</span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <Select
                          labelId="entity"
                          id="entity"
                          name="entity"
                          onChange={handleEntityChange}
                          value={formData.entity}
                          disabled={!selectedSubjectArea}
                          error={Boolean(errorMsgEntity)}
                        >
                          {selectedSubjectArea &&
                            selectedSubjectArea.entities.map(
                              (entity, index) => (
                                <MenuItem key={index} value={entity.name}>
                                  {entity.name}
                                </MenuItem>
                              )
                            )}
                        </Select>
                        <FormHelperText>{errorMsgEntity}</FormHelperText>
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
            disabled={isApplying}
          >
            {isApplying ? 'Inserting...' : 'Insert'}
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateNewMapRowModal
