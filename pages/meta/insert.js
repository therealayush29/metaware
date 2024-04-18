import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Stack,
  Grid,
  FormControl,
  FormLabel,
  TextField,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { usePageContext } from '@/pageProvider/PageContext'
import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import PopupFooter from '@/component/Popup/PopupFooter'

import MetaIcon from '@/component/Icons/IconMeta'
import { ToastContainer, toast } from 'react-toastify'

export default function InsertMeta () {
  const router = useRouter()

  const goToPrevPage = () => {
    router.push('/meta')
  }

  const initialState = {
    name: '',
    type: '',
    subtype: '',
    nullable: 'false',
    description: '',
    isUnique: 'false',
    order: ''
  }
  const { setmetaNewRow } = usePageContext()
  const [formData, setFormData] = useState(initialState)
  const [errorMsgName, setErrorMsgName] = useState(false)
  const [errorMsgType, setErrorMsgType] = useState(false)
  const [errorMsgSubType, setErrorMsgSubType] = useState(false)
  const [errorMsgNullable, setErrorMsgNullable] = useState(false)
  const [errorMsgDescription, setErrorMsgDescription] = useState(false)
  const [errorMsgUnique, setErrorMsgUnique] = useState(false)
  const [errorMsgOrder, setErrorMsgOrder] = useState(false)

  const handleMetaChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, type, subtype, nullable, description, isUnique, order } = formData
    let hasError = false
    if (!name || !type || !nullable || !description || !isUnique || !order || !subtype) {
      setErrorMsgName(name ? '' : 'Name is required')
      setErrorMsgType(type ? '' : 'Type is required')
      setErrorMsgSubType(subtype ? '' : 'Sub-Type is required')
      setErrorMsgNullable(nullable ? '' : 'Nullable is required')
      setErrorMsgDescription(description ? '' : 'Description is required')
      setErrorMsgUnique(isUnique ? '' : 'Is_Unique is required')
      setErrorMsgOrder(order ? '' : 'Order is required')
      hasError = true
    } else {
      setErrorMsgName('')
      setErrorMsgType('')
      setErrorMsgSubType('')
      setErrorMsgNullable('')
      setErrorMsgDescription('')
      setErrorMsgUnique('')
      setErrorMsgOrder('')
      setFormData(initialState)
    }
    if (!hasError) {
      const newNameSpace = {
        id: new Date().getTime(),
        type,
        name,
        subtype,
        nullable,
        description,
        cross: 'client',
        is_unique: isUnique,
        alias: name,
        order
      }
      console.log('newNameSpace', newNameSpace)
      setmetaNewRow(newNameSpace)
      toast.success('new row added')
      goToPrevPage()
    }
  }

  return (
    <>
      <Head>
        <title>Insert New Meta | Metaware</title>
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
          <PopupHeader title="Insert New Meta" onClick={goToPrevPage} />
          <PopupBody>
            <Stack component="form" spacing={2}>
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
                      onChange={handleMetaChange}
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
                    <FormLabel className="fieldLabel">
                      Type <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="type"
                      name="type"
                      onChange={handleMetaChange}
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
                    <FormLabel className="fieldLabel">
                      Sub-Type <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="subtype"
                      name="subtype"
                      onChange={handleMetaChange}
                      value={formData.subtype}
                      error={Boolean(errorMsgSubType)}
                      helperText={errorMsgSubType}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth error={errorMsgNullable}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Nullable <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <RadioGroup
                      id="nullable"
                      name="nullable"
                      value={formData.nullable}
                      onChange={handleMetaChange}
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
                    <FormHelperText>{errorMsgNullable}</FormHelperText>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Description <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="description"
                      name="description"
                      multiline
                      rows={4}
                      onChange={handleMetaChange}
                      value={formData.description}
                      error={Boolean(errorMsgDescription)}
                      helperText={errorMsgDescription}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth error={errorMsgUnique}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                    is_unique <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <RadioGroup
                      id="isUnique"
                      name="isUnique"
                      value={formData.isUnique}
                      onChange={handleMetaChange}
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
                    <FormHelperText>{errorMsgUnique}</FormHelperText>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormLabel className="fieldLabel">
                      Order <span className="fieldRequired">*</span>
                    </FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="order"
                      name="order"
                      type="number"
                      onChange={handleMetaChange}
                      value={formData.order}
                      error={Boolean(errorMsgOrder)}
                      helperText={errorMsgOrder}
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
