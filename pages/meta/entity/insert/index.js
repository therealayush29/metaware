import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Stack,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePageContext } from '@/pageProvider/PageContext'
import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import PopupFooter from '@/component/Popup/PopupFooter'

import MetaIcon from '@/component/Icons/IconMeta'
import SelectSearch from 'react-select-search'
import 'react-select-search/style.css'

const InsertMetaEntity = () => {
  const router = useRouter()

  const goToPrevPage = () => {
    router.push('/meta/entity')
  }

  const initialState = {
    name: '',
    groupName: '',
    namespace: ''
  }
  const [namespaceOptions, setNamespaceOptions] = useState()
  const [subjectareaOptions, setSubjectareaOptions] = useState([])
  const { metaNspace, setenNewRow } = usePageContext()
  const [formData, setFormData] = useState(initialState)
  const [errorMsgName, setErrorMsgName] = useState(false)
  const [errorMsgDescription, setErrorMsgDescription] = useState(false)
  const [errorMsgSubjectarea, setErrorMsgSubjectarea] = useState(false)
  const [errorMsgNamespaceType, setErrorMsgNamespaceType] = useState(false)
  const [errorMsgType, setErrorMsgType] = useState(false)
  const [errorMsgIsDelta, setErrorMsgIsDelta] = useState(false)

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
  const handleNamespaceChange = (newValue, groupName) => {
    setFormData(prevState => ({
      ...prevState,
      namespace: newValue
    }))
    setFormData(prevState => ({
      ...prevState,
      groupName
    }))
    const selectedNamespace = metaNspace.find(
      (ns) => ns.type === groupName && ns.name === newValue
    )
    const subjectAreas = selectedNamespace.subjectareas?.map((sa) => ({
      name: sa.name,
      value: sa.name,
      id: sa.id
    }))
    setSubjectareaOptions(subjectAreas)
  }

  const handleEntityTypeChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, namespace, subjectarea, groupName, description, isDelta, type, subtype } = formData
    let hasError = false
    if (!name || !namespace || !subjectarea || !description || !isDelta || !type) {
      setErrorMsgName(name ? '' : 'Enity Name is required')
      setErrorMsgNamespaceType(namespace ? '' : 'Namespace is required')
      setErrorMsgSubjectarea(subjectarea ? '' : 'Subjectarea is required')
      setErrorMsgDescription(description ? '' : 'Description is required')
      setErrorMsgType(type ? '' : 'Type is required')
      setErrorMsgIsDelta(isDelta ? '' : 'Is_Delta is required')
      hasError = true
    } else {
      setErrorMsgName('')
      setErrorMsgNamespaceType('')
      setErrorMsgSubjectarea('')
      setErrorMsgDescription('')
      setErrorMsgType('')
      setErrorMsgIsDelta('')
      setFormData(initialState)
    }
    if (!hasError) {
      const newNameSpace = {
        id: new Date().getTime(),
        namespace: `${groupName} > ${namespace}`,
        subjectarea,
        name,
        description,
        type,
        subtype: subtype || '.',
        is_delta: isDelta,
        cross: 'client'
      }
      setenNewRow(newNameSpace)
      toast.info('new row added')
      goToPrevPage()
    }
  }

  return (
    <>
      <Head>
        <title>Insert New Meta Entity | Metaware</title>
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
      <MainCard
        activeMenu="Meta"
        pageIcon={<MetaIcon />}
        pageHeading="Meta"
      >
        <PopupOuter
          isFooter="true"
        >
          <PopupHeader
            title="Insert New Entity"
            onClick={goToPrevPage}
          />
          <PopupBody>
            <Stack component="form" spacing={2}>
              <FormControl fullWidth error={errorMsgNamespaceType}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">Select Namespace <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                  <div
                      className={`selectDropDiv meta ${errorMsgNamespaceType ? 'errorTxt' : ''} ${
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
                          handleNamespaceChange(
                            newValue,
                            group ? group.name : null
                          )
                        }}
                        value={formData.namespace}
                      />
                       <FormHelperText>{errorMsgNamespaceType}</FormHelperText>
                    </div>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth error={errorMsgSubjectarea}>
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
                      onChange={handleEntityTypeChange}
                      value={formData.subjectarea}
                    >
                      {subjectareaOptions.map((item) => (
                        <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errorMsgSubjectarea}</FormHelperText>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">Entity Name <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="name"
                      name="name"
                      onChange={handleEntityTypeChange}
                      value={formData.name}
                      error={Boolean(errorMsgName)}
                      helperText={errorMsgName}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel"> Type <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                    id="type"
                    name="type"
                    onChange={handleEntityTypeChange}
                    value={formData.type}
                    error={Boolean(errorMsgType)}
                    helperText={errorMsgType}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">Sub-Type <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                    id="subtype"
                    name="subtype"
                    onChange={handleEntityTypeChange}
                    value={formData.subtype}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">Description <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                    id="description"
                    name="description"
                    onChange={handleEntityTypeChange}
                    value={formData.description}
                    error={Boolean(errorMsgDescription)}
                    helperText={errorMsgDescription}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth error={errorMsgIsDelta}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Is Delta <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <RadioGroup
                      id="isDelta"
                      name="isDelta"
                      value={formData.isDelta}
                      onChange={handleEntityTypeChange}
                      row
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="True"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="False"
                      />
                    </RadioGroup>
                    <FormHelperText>{errorMsgIsDelta}</FormHelperText>
                  </Grid>
                </Grid>
              </FormControl>
            </Stack>
          </PopupBody>
          <PopupFooter
            handleSubmit={handleSubmit}
            onClick={goToPrevPage}
          />
        </PopupOuter>
      </MainCard>
    </>
  )
}

export default InsertMetaEntity
