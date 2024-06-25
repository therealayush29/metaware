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
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Checkbox
} from '@mui/material'

import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import PopupFooter from '@/component/Popup/PopupFooter'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MetaIcon from '@/component/Icons/IconMeta'
import { useMetaRunTime } from '../../Hooks/MetaRunTime'
import { usePageContext } from '@/pageProvider/PageContext'

export default function MetaRuntime () {
  const router = useRouter()
  const { RestURL } = usePageContext

  const { type, namespace, subjectarea, entity, enId } = router.query

  const [checkedAdvance, setCheckedAdvance] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [formData, setFormData] = useState([])

  // eslint-disable-next-line no-unused-vars
  const { loading, data, error } = useMetaRunTime(enId)

  useEffect(() => {
    // Check if data is available and if runtime data exists
    if (data && data.meta_entity && data.meta_entity.length > 0) {
      const runtimeData = data.meta_entity[0].runtime

      // Map runtime data to form data fields
      setFormData(({
        consolidate: String(runtimeData?.consolidate) || '',
        buildStyle: runtimeData?.build_style || '',
        isDelta: String(runtimeData?.is_delta) || '',
        stagingtype: runtimeData.source_runtime?.type || '',
        runtime: runtimeData.source_runtime?.subtype || '',
        fileName: runtimeData.source_runtime?.file_name || '',
        path: runtimeData.source_runtime?.path || '',
        colSpecs: runtimeData.source_runtime?.colSpecs || '',
        colNames: runtimeData.source_runtime?.colNames?.join(', ') || '',
        parserType: runtimeData.source_runtime?.parser_engine || '',
        includeAudit: String(runtimeData?.include_audit) || '',
        strategy: runtimeData.loader_runtime?.strategy || '',
        dbType: runtimeData.loader_runtime?.subtype || '',
        quoteChar: runtimeData.source_runtime?.quotechar || '',
        escapeChar: runtimeData.source_runtime?.escapechar || ''
      }))
    }
  }, [data])
  const goToPrevPage = () => {
    window.history.back()
  }

  const runtimeOptions = [{ name: 'Delimiter', value: 'delimited' }, { name: 'Fixed-Width', value: 'fixedwidth' }]

  const typeOptions = [{ name: 'file', value: 'file' }, { name: 'db', value: 'db' }]

  const parserOptions = [{ name: 'duck', value: 'duck' }, { name: 'polars', value: 'polars' }]

  const dbTypeOptions = [{ name: 'duck', value: 'duck' }, { name: 'graphql', value: 'graphql' }]

  const strategyOptions = [
    { name: 'full', value: 'full' },
    { name: 'insert_as_select', value: 'insert_as_select' },
    { name: 'merge', value: 'merge' },
    { name: 'offline', value: 'offline' }
  ]

  const buildStyleOptions = [
    { name: 'standard', value: 'standard' },
    { name: 'offline', value: 'offline' },
    { name: 'md5', value: 'md5' }
  ]

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleCheckChange = (e) => {
    setCheckedAdvance(!checkedAdvance)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const {
      includeAudit,
      consolidate,
      buildStyle,
      subType,
      isDelta,
      stagingtype,
      runtime,
      fileName,
      path,
      colSpecs,
      colNames,
      dbType,
      strategy,
      quoteChar,
      escapeChar,
      parserType,
      requiresMastering
    } = formData
    let hasError = false

    const errorMessages = {
      consolidate: consolidate ? '' : 'consolidate is required',
      includeAudit: checkedAdvance === true ? (includeAudit ? '' : 'includeAudit is required') : '',
      buildStyle: checkedAdvance === true ? (buildStyle ? '' : 'buildStyle is required') : '',
      subType: type === 'model' ? (subType ? '' : 'subType is required') : '',
      isDelta: type === 'staging' ? (isDelta ? '' : 'isDelta is required') : '',
      stagingtype: (type === 'model' || type === 'staging') ? (!stagingtype ? 'stagingtype is required' : '') : '',
      runtime: formData.stagingtype === 'file' ? (runtime ? '' : 'runtime is required') : '',
      fileName: formData.runtime === 'delimited' ? (fileName ? '' : 'fileName is required') : '',
      path: formData.runtime === 'delimited' ? (path ? '' : 'path is required') : '',
      colSpecs: formData.runtime === 'fixedwidth' ? (colSpecs ? '' : 'colSpecs is required') : '',
      colNames: formData.runtime === 'fixedwidth' ? (colNames ? '' : 'colNames is required') : '',
      dbType: formData.stagingtype === 'db' ? (dbType ? '' : 'dbType is required') : '',
      strategy: (type === 'model' || (type === 'staging' && formData.stagingtype === 'db')) ? (strategy ? '' : 'strategy is required') : '',
      quoteChar: formData.runtime === 'delimited' && checkedAdvance === true ? (quoteChar ? '' : 'quoteChar is required') : '',
      escapeChar: formData.runtime === 'delimited' && checkedAdvance === true ? (escapeChar ? '' : 'escapeChar is required') : '',
      parserType: ((formData.runtime === 'delimited' &&
      checkedAdvance === true) || (formData.runtime === 'fixedwidth' && checkedAdvance === true))
        ? (parserType
            ? ''
            : 'parserType is required')
        : '',
      requiresMastering: type === 'model' && checkedAdvance === true ? (requiresMastering ? '' : 'requiresMastering is required') : ''
    }

    setErrorMsg({ ...errorMessages })

    hasError = Object.values(errorMessages).some(message => message !== '')

    if (hasError) {
      return
    }
    try {
      setIsApplying(true)
      const newRunOptions = {
        type: 'en',
        ...((type === 'model' || type === 'staging') && { subtype: type }),
        migrate_data_on_meta_change: false,
        ...(checkedAdvance === true && { include_audit: includeAudit }),
        consolidate,
        ...(checkedAdvance === true && { build_style: buildStyle }),
        ...(type === 'staging' && { is_delta: isDelta }),
        ...(formData.stagingtype === 'file') && {
          source_runtime: {
            ...(type === 'model' || (type === 'staging' && formData.stagingtype === 'file') ? { type: stagingtype } : {}),
            ...(formData.stagingtype === 'file' && { subtype: runtime }),
            ...(type === 'staging' && { is_delta: isDelta }),
            ...(formData.runtime === 'fixedwidth' && { colSpecs }),
            ...(formData.runtime === 'fixedwidth' && { colNames: [colNames] }),
            ...((formData.runtime === 'delimited' || formData.runtime === 'fixedwidth') && { file_name: fileName }),
            header: true,
            ...((formData.runtime === 'delimited' || formData.runtime === 'fixedwidth') && { path }),
            ...(formData.runtime === 'delimited' && checkedAdvance === true && { quotechar: quoteChar }),
            ...(formData.runtime === 'delimited' && checkedAdvance === true && { escapechar: escapeChar }),
            ...(((formData.runtime === 'delimited' &&
            checkedAdvance === true) || (formData.runtime === 'fixedwidth' && checkedAdvance === true)) && { parser_engine: parserType })
          }
        },
        ...((formData.stagingtype === 'staging') || type === 'model') && {
          loader_runtime: {
            ...(type === 'staging' && { subtype: 'db' }),
            ...(type === 'model' || type === 'staging' ? { type: stagingtype } : {}),
            ...(formData.stagingtype === 'db' && { subtype: runtime }),
            ...(type === 'model' || type === 'staging' ? { strategy } : {})
          }
        }
      }
      // {
      //     ...(checkedAdvance === true && { includeAudit }),
      //     consolidate,
      //     ...(checkedAdvance === true && { buildStyle }),
      //     ...(type === 'model' && { subType }),
      //     ...(type === 'staging' && { is_delta: isDelta }),
      //     ...(type === 'model' || type === 'staging' ? { stagingtype } : {}),
      //     ...(formData.stagingtype === 'file' && { runtime }),
      //     ...(formData.runtime === 'delimited' && { fileName }),
      //     ...(formData.runtime === 'delimited' && { path }),
      //     ...(formData.runtime === 'fixedwidth' && { colSpecs }),
      //     ...(formData.runtime === 'fixedwidth' && { colNames }),
      //     ...(formData.stagingtype === 'db' && { dbType }),
      //     ...(type === 'model' || (type === 'staging' && formData.stagingtype === 'db') ? { strategy } : {}),
      //     ...(formData.runtime === 'delimited' && checkedAdvance === true && { quoteChar }),
      //     ...(formData.runtime === 'delimited' && checkedAdvance === true && { escapeChar }),
      //     ...(((formData.runtime === 'delimited' &&
      //     checkedAdvance === true) || (formData.runtime === 'fixedwidth' && checkedAdvance === true)) && { parserType }),
      //     ...(type === 'model' && checkedAdvance === true && { requiresMastering })
      //   }
      const response = await fetch(
        `${RestURL}/meta/${namespace}/${subjectarea}/${entity}/update_entity_runtime?en_id=${enId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRunOptions)
        }
      )

      if (response.ok) {
        // Assuming toast is defined correctly
        toast.success('entity run is successful')
        setIsApplying(false)
      } else {
        throw new Error('entity run is unsuccessful')
      }
    } catch (error) {
      // Assuming toast is defined correctly
      toast.warning('An error occurred during Inserting')
      setIsApplying(false)
    }
  }

  return (
    <>
      <Head>
        <title> {namespace} Runtime Options | Metaware</title>
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
          <PopupHeader title={`${namespace} Entity Runtime Options`} onClick={goToPrevPage} />
          <PopupBody>
            {loading
              ? '...loading'
              : <Stack component="form" spacing={2}>
              <>
                <FormControl fullWidth error={errorMsg.consolidate}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormLabel className="fieldLabel">
                        consolidate <span className="fieldRequired">*</span>
                      </FormLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <RadioGroup
                      id="consolidate"
                      name="consolidate"
                      row
                      value={formData.consolidate}
                      onChange={handleChange}>
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
                      <FormHelperText>{errorMsg.consolidate}</FormHelperText>
                    </Grid>
                  </Grid>
                </FormControl>
                <FormControl fullWidth>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormLabel className="fieldLabel">
                        Advance <span className="fieldRequired">*</span>
                      </FormLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedAdvance}
                            onChange={handleCheckChange}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </FormControl>
                {checkedAdvance === true && (
                  <>
                    <FormControl fullWidth error={errorMsg.includeAudit}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Include Audit{' '}
                            <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <RadioGroup
                          id="includeAudit"
                          name="includeAudit"
                          row
                          value={formData.includeAudit}
                          onChange={handleChange}
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
                          <FormHelperText>{errorMsg.includeAudit}</FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth error={errorMsg.buildStyle}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Select Build Style
                            <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <Select
                            labelId="buildStyle"
                            id="buildStyle"
                            name="buildStyle"
                            placeholder="Select Build Style"
                            onChange={handleChange}
                            value={formData.buildStyle}
                            error={Boolean(errorMsg.buildStyle)}
                            helperText={errorMsg.buildStyle}
                          >
                            {buildStyleOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errorMsg.buildStyle}</FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </>
                )}
              <div className={type === 'staging' ? 'sourceRuntime' : ''} spacing={2}>
                {type === 'model' && (
                  <>
                    <FormControl fullWidth>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Sub-Type <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            id='subType'
                            name="subType"
                            onChange={handleChange}
                            value={formData.subType}
                            error={Boolean(errorMsg.subType)}
                            helperText={errorMsg.subType}
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth className='mb-16' error={errorMsg.stagingtype}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Select Type<span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <Select
                            labelId="stagingtype"
                            id="stagingtype"
                            name="stagingtype"
                            placeholder="Select Type"
                            onChange={handleChange}
                            value={formData.stagingtype}
                            error={Boolean(errorMsg.stagingtype)}
                            helperText={errorMsg.stagingtype}
                          >
                            {typeOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errorMsg.stagingtype}</FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth className='mb-16' error={errorMsg.strategy}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Select Strategy{' '}
                            <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <Select
                            labelId="strategy"
                            id="strategy"
                            name="strategy"
                            placeholder="Select Strategy"
                            onChange={handleChange}
                            value={formData.strategy}
                          >
                            {strategyOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errorMsg.isDelta}</FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </>
                )}
                {type === 'staging' && (
                  <>
                    <FormControl fullWidth className='mb-16' error={errorMsg.stagingtype}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Select Type<span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <Select
                            labelId="stagingtype"
                            id="stagingtype"
                            name="stagingtype"
                            placeholder="Select Type"
                            onChange={handleChange}
                            value={formData.stagingtype}
                          >
                            {typeOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errorMsg.stagingtype}</FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth className='mb-16' error={errorMsg.isDelta}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Is Delta{' '}
                          <span className="fieldRequired">*</span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <RadioGroup
                          id="isDelta"
                          name="isDelta"
                          value={formData.isDelta}
                          onChange={handleChange}
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
                        <FormHelperText>{errorMsg.isDelta}</FormHelperText>
                      </Grid>
                    </Grid>
                    </FormControl>
                    {formData.stagingtype === 'file' && (
                      <>
                          <FormControl fullWidth className='mb-16' error={errorMsg.runtime}>
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <FormLabel className="fieldLabel">
                                  Select SubType
                                  <span className="fieldRequired">*</span>
                                </FormLabel>
                              </Grid>
                              <Grid item xs={8}>
                                <Select
                                  labelId="runtime"
                                  id="runtime"
                                  name="runtime"
                                  placeholder="Select Runtime"
                                  onChange={handleChange}
                                  value={formData.runtime}
                                >
                                  {runtimeOptions.map((item, index) => (
                                    <MenuItem key={index} value={item.value}>
                                      {item.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>{errorMsg.runtime}</FormHelperText>
                              </Grid>
                            </Grid>
                          </FormControl>
                          {(formData.runtime === 'delimited' || formData.runtime === 'fixedwidth') && (
                            <>
                              <FormControl className='mb-16' fullWidth>
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <FormLabel className="fieldLabel">
                                      File Name{' '}
                                      <span className="fieldRequired">*</span>
                                    </FormLabel>
                                  </Grid>
                                  <Grid item xs={8}>
                                    <TextField
                                     id='fileName'
                                     name="fileName"
                                     onChange={handleChange}
                                     value={formData.fileName}
                                     error={Boolean(errorMsg.fileName)}
                                     helperText={errorMsg.fileName}
                                      />
                                  </Grid>
                                </Grid>
                              </FormControl>
                              <FormControl className='mb-16' fullWidth>
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <FormLabel className="fieldLabel">
                                      Path{' '}
                                      <span className="fieldRequired">*</span>
                                    </FormLabel>
                                  </Grid>
                                  <Grid item xs={8}>
                                    <TextField
                                    id='path'
                                    name="path"
                                    onChange={handleChange}
                                    value={formData.path}
                                    error={Boolean(errorMsg.path)}
                                    helperText={errorMsg.path}
                                     />
                                  </Grid>
                                </Grid>
                              </FormControl>
                            </>
                          )}
                          {formData.runtime === 'fixedwidth' && (
                            <>
                              <FormControl className='mb-16' fullWidth>
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <FormLabel className="fieldLabel">
                                      Column Specifications{' '}
                                      <span className="fieldRequired">*</span>
                                    </FormLabel>
                                  </Grid>
                                  <Grid item xs={8}>
                                    <TextField
                                      id='colSpecs'
                                      name="colSpecs"
                                      multiline
                                      rows={4}
                                      onChange={handleChange}
                                      value={formData.colSpecs}
                                      error={Boolean(errorMsg.colSpecs)}
                                      helperText={errorMsg.colSpecs}
                                      />
                                  </Grid>
                                </Grid>
                              </FormControl>
                              <FormControl className='mb-16' fullWidth>
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <FormLabel className="fieldLabel">
                                      Column Names{' '}
                                      <span className="fieldRequired">*</span>
                                    </FormLabel>
                                  </Grid>
                                  <Grid item xs={8}>
                                    <TextField
                                    id='colNames'
                                    name="colNames"
                                    multiline
                                    rows={4}
                                    onChange={handleChange}
                                    value={formData.colNames}
                                    error={Boolean(errorMsg.colNames)}
                                    helperText={errorMsg.colNames}
                                    />
                                  </Grid>
                                </Grid>
                              </FormControl>
                            </>
                          )}
                      </>
                    )}
                    {(formData.stagingtype === 'db' || formData.stagingtype === 'file') && (
                      <>
                        <FormControl fullWidth className='mb-16' error={errorMsg.dbType}>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <FormLabel className="fieldLabel">
                                Type <span className="fieldRequired">*</span>
                              </FormLabel>
                            </Grid>
                            <Grid item xs={8}>
                              <Select
                                labelId="dbType"
                                id="dbType"
                                name="dbType"
                                placeholder="Select Type"
                                onChange={handleChange}
                                value={formData.dbType}
                              >
                                {dbTypeOptions.map((item, index) => (
                                  <MenuItem key={index} value={item.value}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>{errorMsg.dbType}</FormHelperText>
                            </Grid>
                          </Grid>
                        </FormControl>
                      </>
                    )}
                  </>
                )}
                {(type === 'model' ||
                  type === 'staging') && (
                  <>
                    <FormControl fullWidth className='mb-16' error={errorMsg.strategy}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Select Strategy{' '}
                            <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <Select
                            labelId="strategy"
                            id="strategy"
                            name="strategy"
                            placeholder="Select Strategy"
                            onChange={handleChange}
                            value={formData.strategy}
                          >
                            {strategyOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errorMsg.strategy}</FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </>
                )}
                {formData.runtime === 'delimited' && checkedAdvance === true && (
                  <>
                    <FormControl fullWidth className='mb-16'>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Quote Char{' '}
                            <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                          id='quoteChar'
                          name="quoteChar"
                          onChange={handleChange}
                          value={formData.quoteChar}
                          error={Boolean(errorMsg.quoteChar)}
                          helperText={errorMsg.quoteChar}
                          />
                        </Grid>
                      </Grid>
                    </FormControl>
                    <FormControl fullWidth className='mb-16'>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Escape Char{' '}
                            <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                          id='escapeChar'
                          name="escapeChar"
                          onChange={handleChange}
                          value={formData.escapeChar}
                          error={Boolean(errorMsg.escapeChar)}
                          helperText={errorMsg.escapeChar}
                            />
                        </Grid>
                      </Grid>
                    </FormControl>
                  </>
                )}
                {((formData.runtime === 'delimited' &&
                          checkedAdvance === true) ||
                          (formData.runtime === 'fixedwidth' &&
                    checkedAdvance === true)) && (
                  <>
                    <FormControl fullWidth className='mb-16' error={errorMsg.parserType}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormLabel className="fieldLabel">
                            Parser Type{' '}
                            <span className="fieldRequired">*</span>
                          </FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <Select
                            labelId="parserType"
                            id="parserType"
                            name="parserType"
                            placeholder="Select Parser Type"
                            onChange={handleChange}
                            value={formData.parserType}
                          >
                            {parserOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errorMsg.parserType}</FormHelperText>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </>
                )}
                {type === 'model' && checkedAdvance === true && (
                  <FormControl fullWidth className='mb-16' error={errorMsg.requiresMastering}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">
                          Requires Mastering{' '}
                          <span className="fieldRequired">*</span>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <RadioGroup
                          id="requiresMastering"
                          name="requiresMastering"
                          row
                          value={formData.requiresMastering}
                          onChange={handleChange}
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
                        <FormHelperText>{errorMsg.requiresMastering}</FormHelperText>
                      </Grid>
                    </Grid>
                  </FormControl>
                )}
              </div>
              </>
            </Stack>
            }
          </PopupBody>
          <PopupFooter handleSubmit={handleSubmit} isApply={isApplying} onClick={goToPrevPage} />
        </PopupOuter>
      </MainCard>
    </>
  )
}
