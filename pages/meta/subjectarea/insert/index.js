import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import {
  Stack,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  FormHelperText
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

const InsertMetaSubjectarea = () => {
  const goToPrevPage = () => {
    window.history.back()
  }
  const initialState = {
    name: '',
    groupName: '',
    namespace: '',
    type: ''
  }
  const { metaNspace, setsaNewRow } = usePageContext()
  const [formData, setFormData] = useState(initialState)
  const [namespaceType, setNamespaceType] = useState([])
  const [errorMsgName, setErrorMsgName] = useState(false)
  const [errorMsgSubType, setErrorMsgSubType] = useState(false)
  const [errorMsgNamespaceType, setErrorMsgNamespaceType] = useState(false)

  const handleNamespaceChange = (option, group) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      namespace: option,
      groupName: group
    }))
  }

  useEffect(() => {
    if (metaNspace && metaNspace) {
      const groupedNamespaceOptions = metaNspace.map((item) => ({
        type: 'group',
        name: item.type,
        id: item.id,
        items: [{ name: item.name, value: item.name }]
      }))
      setNamespaceType(groupedNamespaceOptions)
    }
  }, [metaNspace])

  const handleNamespaceTypeChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, namespace, groupName, type } = formData
    let hasError = false
    if (!name || !namespace || !type) {
      setErrorMsgName(name ? '' : 'Name is required')
      setErrorMsgNamespaceType(namespace ? '' : 'namespace is required')
      setErrorMsgSubType(type ? '' : 'Type is required')
      hasError = true
    } else {
      setErrorMsgName('')
      setErrorMsgNamespaceType('')
      setErrorMsgSubType('')
      setFormData(initialState)
    }
    if (!hasError) {
      const newNameSpace = {
        id: new Date().getTime(),
        namespace: `${groupName} > ${namespace}`,
        type,
        name,
        cross: 'client'
      }
      setsaNewRow(newNameSpace)
      console.log(newNameSpace)
      toast.info('new row added')
      goToPrevPage()
    }
  }

  return (
    <>
      <Head>
        <title>Insert New Meta Subjectarea | Metaware</title>
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
          <PopupHeader title="Insert New Subjectarea" onClick={goToPrevPage} />
          <PopupBody>
            <Stack component="form" spacing={2}>
              <FormControl fullWidth error={errorMsgNamespaceType}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Select Namespace <span className="fieldRequired">*</span>
                    </FormLabel>
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
                        options={namespaceType}
                        required
                        onChange={(newValue) => {
                          const group = namespaceType.find((option) =>
                            option.items.some((item) => item.value === newValue)
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
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Subjectarea Type <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                  <TextField
                      id="type"
                      name="type"
                      onChange={handleNamespaceTypeChange}
                      value={formData.type}
                      error={Boolean(errorMsgSubType)}
                      helperText={errorMsgSubType}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Subjectarea Name <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                  <TextField
                      id="name"
                      name="name"
                      onChange={handleNamespaceTypeChange}
                      value={formData.name}
                      error={Boolean(errorMsgName)}
                      helperText={errorMsgName}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Stack>
          </PopupBody>
          <PopupFooter handleSubmit={handleSubmit} onClick={goToPrevPage} />
        </PopupOuter>
      </MainCard>
    </>
  )
}

export default InsertMetaSubjectarea
