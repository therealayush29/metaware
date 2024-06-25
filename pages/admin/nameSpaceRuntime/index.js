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
  ListItemText,
  FormHelperText,
  Checkbox
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

export default function nameSpaceRuntime () {
  const { metaNspace } = usePageContext()
  const goToPrevPage = () => {
    window.history.back()
  }
  const initialState = {
    namespace: '',
    databaseType: [],
    group: [],
    archiveDays: ''
  }
  const apiUrl = 'https://mw-bqfztwl5za-ue.a.run.app'
  const [errorMsg, setErrorMsg] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const [namespaceOptions, setNamespaceOptions] = useState()
  const [isApplying, setIsApplying] = useState(false)

  const groupOptions = [{ name: 'all' },
    { name: 'marketing' },
    { name: 'accounts' }]

  const dataBaseOptions = [
    { name: 'duckdb' },
    { name: 'sqlite' }
  ]

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
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { databaseType, namespace, group, archiveDays, namespaceId } = formData
    let hasError = false

    const errorMessages = {
      databaseType: databaseType ? '' : 'Database Type is required',
      namespace: namespace ? '' : 'Namespace is required',
      group: group ? '' : 'Group is required',
      archiveDays: archiveDays ? '' : 'Archive Days is required'
    }
    setErrorMsg({ ...errorMessages })
    hasError = Object.values(errorMessages).some(message => message !== '')

    try {
      setIsApplying(true)
      if (!hasError) {
        const newRunOptions = {
          type: namespace,
          groups: group,
          archive_days: parseInt(archiveDays),
          database_type: databaseType
        }
        const response = await fetch(
          `${apiUrl}/meta/${namespace}/${namespaceId}/update_namespace_runtime`,
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
        <title> Namespace Runtime Options | Metaware</title>
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
          <PopupHeader title={'Namespace Runtime Options'} onClick={goToPrevPage} />
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
              {formData.namespace && (
              <>
                <FormControl fullWidth error={errorMsg.databaseType}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormLabel className="fieldLabel">
                        Select Database Type<span className="fieldRequired">*</span>
                      </FormLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <Select
                        labelId="databaseType"
                        id="databaseType"
                        name="databaseType"
                        onChange={handleChange}
                        multiple
                        renderValue={(selected) => selected.join(', ')}
                        value={formData.databaseType}
                      >
                        {dataBaseOptions.map((item, index) => (
                          <MenuItem key={index} value={item.name}>
                            <Checkbox checked={formData.databaseType.indexOf(item.name) > -1}/>
                            <ListItemText primary={item.name} />
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errorMsg.databaseType}</FormHelperText>
                    </Grid>
                  </Grid>
                </FormControl>
                <FormControl fullWidth error={errorMsg.group}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormLabel className="fieldLabel">
                        Select Group<span className="fieldRequired">*</span>
                      </FormLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <Select
                        labelId="group"
                        id="group"
                        name="group"
                        placeholder="Select group"
                        multiple
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(', ')}
                        value={formData.group}
                      >
                        {groupOptions.map((item, index) => (
                          <MenuItem key={index} value={item.name}>
                            <Checkbox checked={formData.group.indexOf(item.name) > -1}/>
                            <ListItemText primary={item.name} />
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errorMsg.group}</FormHelperText>
                    </Grid>
                  </Grid>
                </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                    Archive Days <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                    id='archiveDays'
                    name="archiveDays"
                    onChange={handleChange}
                    value={formData.archiveDays}
                    error={Boolean(errorMsg.archiveDays)}
                    helperText={errorMsg.archiveDays}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </>
              )}
            </Stack>
          </PopupBody>
          <PopupFooter handleSubmit={handleSubmit} isApply={isApplying} onClick={goToPrevPage} />
        </PopupOuter>
      </MainCard>
    </>
  )
}
