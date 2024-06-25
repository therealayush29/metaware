import React, { useState, useEffect } from 'react'
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
  FormHelperText
} from '@mui/material'
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close'
import { useMeta } from '@/Hooks/Meta'
import DownIcon from '@/component/Icons/IconDown'
import UpIcon from '@/component/Icons/IconUp'
import SelectSearch from 'react-select-search'
import { usePageContext } from '@/pageProvider/PageContext'
import { ToastContainer, toast } from 'react-toastify'
const SourceModal = ({ customClass, open, onClose }) => {
  SourceModal.propTypes = {
    customClass: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.string
  }
  const {
    selectedSource,
    setSelectedSource,
    formData,
    setSourceData,
    handleInputChange,
    resetForm
  } = usePageContext()
  const [dataNamespace, setDataNamespace] = useState([])
  const [checkAdvanced, setCheckAdvanced] = useState(false)
  const [errorMsgSource, setErrorMsgSource] = useState(false)
  const { error, loading, data } = useMeta()
  useEffect(() => {
    if (data && data.meta_namespace) {
      setDataNamespace(data.meta_namespace)
    }
  }, [data])
  const stagingData = dataNamespace.filter((item) => item.type === 'staging')
  const sourceOptions = stagingData.flatMap((namespace) => {
    const { name: namespaceName } = namespace
    return namespace.subjectareas?.flatMap((subjectArea) => {
      const { name: subjectAreaName } = subjectArea
      return subjectArea.entities?.map((entity) => {
        const { name: entityName } = entity
        const optionName = `${namespaceName} > ${subjectAreaName} > ${entityName}`
        const optionValue = optionName
        return { name: optionName, value: optionValue }
      })
    })
  })

  const handleChangeSource = (newValue) => {
    setSelectedSource(newValue)
  }

  const handleAdvancedClick = () => {
    setCheckAdvanced((prevState) => !prevState)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { sourceJoin } = formData

    let hasError = false

    if (selectedSource === '' || !selectedSource) {
      setErrorMsgSource('Source is required')
      hasError = true
    } else {
      setErrorMsgSource('')
    }

    if (hasError) {
      return
    }

    try {
      const sourceArray = selectedSource.split(' > ')
      const [ns, sa, en] = sourceArray

      const newRule = {
        ns,
        sa,
        en,
        ...(checkAdvanced ? { sourceJoin } : {})
      }
      setSourceData(newRule)
      resetForm()
      onClose()
      toast.success('Source Changed')
    } catch (error) {
      toast.error('Getting Error')
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
          Source
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
                  <FormControl fullWidth error={errorMsgSource}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Select Source <span className="fieldRequired">*</span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <div
                          className={`selectDropDiv ${errorMsgSource ? 'errorTxt' : ''} ${
                            selectedSource !== '' ? 'selectedDropDiv' : null
                          }`}
                        >
                          <SelectSearch
                            options={sourceOptions}
                            name="selectSource"
                            search
                            placeholder="Search by keyword"
                            onChange={handleChangeSource}
                            value={selectedSource}
                            required
                          />
                          <FormHelperText>{errorMsgSource}</FormHelperText>
                        </div>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Source Filter <span className="fieldRequired"></span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}></Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <div className="advcnSlctBtn">
                          <FormLabel
                            className="fieldLabel"
                            onClick={handleAdvancedClick}
                          >
                            Advanced
                            {checkAdvanced ? <UpIcon /> : <DownIcon />}
                          </FormLabel>
                        </div>
                      </Grid>
                      <Grid item xs={8}></Grid>
                    </Grid>
                  </FormControl>
                  {checkAdvanced
                    ? (
                    <FormControl fullWidth>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Source Join <span className="fieldRequired"></span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            name="sourceJoin"
                            multiline
                            rows={4}
                            id="sourceJoin"
                            value={formData.sourceJoin}
                            onChange={handleInputChange}
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                      )
                    : null}
                </Stack>
              </div>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ py: 1.2, px: 2, justifyContent: 'flex-start' }}>
          <Button color="primary" onClick={handleSubmit} variant="contained">
            Apply
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SourceModal
