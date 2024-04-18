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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePageContext } from '@/pageProvider/PageContext'
import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import PopupFooter from '@/component/Popup/PopupFooter'

import MetaIcon from '@/component/Icons/IconMeta'

const InsertMetaNamespace = () => {
  const goToPrevPage = () => {
    window.history.back()
  }

  const initialState = {
    type: '',
    name: ''
  }
  const { metaNspace, setNsNewRow } = usePageContext()
  const [formData, setFormData] = useState(initialState)
  const [namespaceType, setNamespaceType] = useState([])
  const [errorMsgName, setErrorMsgName] = useState(false)
  const [errorMsgNamespaceType, setErrorMsgNamespaceType] = useState(false)

  useEffect(() => {
    if (metaNspace && metaNspace) {
      const namespaceOption = metaNspace.map((item) => ({
        name: item.type,
        value: item.type,
        id: item.id
      }))
      setNamespaceType(namespaceOption)
    }
  }, [metaNspace])
  const uniqueNamespaceTypes = [...new Map(namespaceType.map(item => [item.name, item])).values()]

  const handleNamespaceTypeChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, type } = formData
    let hasError = false
    if (!name || !type) {
      setErrorMsgName(name ? '' : 'Name is required')
      setErrorMsgNamespaceType(type ? '' : 'namespace is required')
      hasError = true
    } else {
      setErrorMsgName('')
      setErrorMsgNamespaceType('')
      setFormData(initialState)
    }
    if (!hasError) {
      const newNameSpace = {
        id: new Date().getTime(),
        type,
        name,
        cross: 'client'
      }
      setNsNewRow(newNameSpace)
      // namSpaceMeta.push(newNameSpace)
      toast.info('new row added')
      goToPrevPage()
    }
  }

  return (
    <>
      <Head>
        <title>Insert New Meta Namesapace | Metaware</title>
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
            title="Insert New Namespace"
            onClick={goToPrevPage}
          />
          <PopupBody>
            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
              <FormControl fullWidth error={errorMsgNamespaceType}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Namespace Type <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <Select
                      labelId="type"
                      id="type"
                      name="type"
                      placeholder="Select Namespace"
                      onChange={handleNamespaceTypeChange}
                      value={formData.type}
                      error={Boolean(errorMsgNamespaceType)}
                      helperText={errorMsgNamespaceType}
                    >
                      {uniqueNamespaceTypes.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errorMsgNamespaceType}</FormHelperText>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Namespace Name <span className="fieldRequired">*</span>
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
          <PopupFooter
            handleSubmit={handleSubmit}
            onClick={goToPrevPage}
          />
        </PopupOuter>
      </MainCard>
    </>
  )
}

export default InsertMetaNamespace
