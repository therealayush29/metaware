import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import {
  Stack,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'

import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import PopupFooter from '@/component/Popup/PopupFooter'
import { ToastContainer, toast } from 'react-toastify'
import { usePageContext } from '@/pageProvider/PageContext'
import 'react-select-search/style.css'
import 'react-toastify/dist/ReactToastify.css'

import MetaIcon from '@/component/Icons/IconMeta'
import SelectSearch from 'react-select-search'

export default function subjectareaRuntime () {
  const { metaNspace, RestURL } = usePageContext()
  const goToPrevPage = () => {
    window.history.back()
  }
  const [errorMsg, setErrorMsg] = useState(false)
  const [formData, setFormData] = useState([])
  const [namespaceOptions, setNamespaceOptions] = useState()
  const [subjectareaOptions, setSubjectareaOptions] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    if (metaNspace && metaNspace) {
      const groupedNamespaceOptions = metaNspace.map((item) => ({
        type: 'group',
        name: item.type,
        id: item.id,
        items: [{ name: item.name, value: item.name }]
      }))
      setNamespaceOptions(groupedNamespaceOptions)
    }
  }, [metaNspace])

  const handleNamespaceChange = (newValue, groupName, namespaceId) => {
    setFormData(prevState => ({
      ...prevState,
      namespace: newValue,
      namespaceId
    }))
    setFormData(prevState => ({
      ...prevState,
      groupName
    }))
    const selectedNamespace = metaNspace.find(
      (ns) => ns.type === groupName && ns.name === newValue
    )
    const subjectAreas = selectedNamespace.subjectareas.map((sa) => ({
      name: sa.name,
      value: sa.name,
      id: sa.id
    }))
    setSubjectareaOptions(subjectAreas)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.name
    }))
    setFormData((prevFormData) => ({
      ...prevFormData,
      subjectareaId: value.id
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { customProperty, namespace, folderMaxSize, subjectarea, subjectareaId } = formData
    let hasError = false

    const errorMessages = {
      customProperty: customProperty ? '' : 'customProperty is required',
      namespace: namespace ? '' : 'Namespace is required',
      subjectarea: subjectarea ? '' : 'Subjectarea is required',
      folderMaxSize: folderMaxSize ? '' : 'folderMaxSize is required'
    }
    setErrorMsg({ ...errorMessages })
    hasError = Object.values(errorMessages).some(message => message !== '')

    try {
      setIsApplying(true)
      if (!hasError) {
        const newRunOptions = {
          sa: subjectarea,
          subtype: 'None',
          custom_property: customProperty,
          folder_max_size: parseInt(folderMaxSize)
        }
        const response = await fetch(
          `${RestURL}/meta/${namespace}/${subjectarea}/${subjectareaId}/update_subjectarea_runtime`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRunOptions)
          }
        )

        if (response.ok) {
          toast.success('Inserted New Data')
          setIsApplying(false)
        } else {
          throw new Error('Failed to insert data')
        }
      }
    } catch (error) {
      toast.error('An error occurred during data insertion')
      console.error('Error:', error.message)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <>
      <Head>
        <title> Subjectarea Runtime Options | Metaware</title>
      </Head>
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
      <MainCard activeMenu="Meta" pageIcon={<MetaIcon />} pageHeading="Meta">
        <PopupOuter isFooter="true">
          <PopupHeader title={'subjectarea Runtime Options'} onClick={goToPrevPage} />
          <PopupBody>
          <Stack component="form" spacing={2}>
          <FormControl fullWidth error={errorMsg.namespace}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">Select Namespace <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                  <div
                      className={`selectDropDiv meta ${errorMsg.namespace ? 'errorTxt' : ''} ${
                        formData.namespace !== '' ? 'selectedDropDiv' : null
                      }`}
                    >
                      <SelectSearch
                        id="namespace"
                        name="namespace"
                        placeholder="Select Namespace"
                        options={namespaceOptions}
                        required
                        onChange={(newValue) => {
                          const group = namespaceOptions.find(
                            (option) =>
                              option.items.some(
                                (item) => item.value === newValue
                              )
                          )
                          handleNamespaceChange(newValue, group ? group.name : null, group ? group.id : null)
                        }}
                        value={formData.namespace}
                      />
                       <FormHelperText>{errorMsg.namespace}</FormHelperText>
                    </div>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth error={errorMsg.subjectarea}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">Select Subjectarea <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <Select
                      labelId="subjectarea"
                      id="subjectarea"
                      name="subjectarea"
                      placeholder="Select Subjectarea"
                      onChange={handleSubChange}
                      value={formData.subjectarea}
                    >
                      {subjectareaOptions.map((item) => (
                        <MenuItem key={item.id} value={item}>{item.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errorMsg.subjectarea}</FormHelperText>
                  </Grid>
                </Grid>
              </FormControl>
              {(formData.namespace && formData.subjectarea) && (
              <>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                    Custom Property <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                    id='customProperty'
                    name="customProperty"
                    onChange={handleChange}
                    value={formData.customProperty}
                    error={Boolean(errorMsg.customProperty)}
                    helperText={errorMsg.customProperty}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                    Folder Max Size <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                    id='folderMaxSize'
                    name="folderMaxSize"
                    onChange={handleChange}
                    value={formData.folderMaxSize}
                    error={Boolean(errorMsg.folderMaxSize)}
                    helperText={errorMsg.folderMaxSize}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </>
              )}
            </Stack>
          </PopupBody>
          <PopupFooter handleSubmit={handleSubmit} onClick={goToPrevPage} />
        </PopupOuter>
      </MainCard>
    </>
  )
}
