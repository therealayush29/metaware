import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Alert,
  IconButton,
  FormControl,
  TextField,
  InputAdornment,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Tooltip,
  TableRow,
  TableCell,
  Container,
  Stack,
  Tabs,
  Tab,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material'
import { Edit, Delete, Close as CloseIcon, MoreVert as MoreVertTwoToneIcon, Expand as ExpandIcon } from '@mui/icons-material'
import { NestedDropdown } from 'mui-nested-menu'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePageContext } from '../../pageProvider/PageContext'
import DeleteConfirmationDialog from '@/component/DeleteConfirmationDialog'
import { useDqRules } from '../../Hooks/DqRules'
import client from '../../apollo-client'
import { useMetaName } from '../../Hooks/MetaName'
function CustomTabPanel (props) {
  const {
    children, value, index, checkRules: localCheckRules,
    actionRules: localActionRules, ...other
  } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  checkRules: PropTypes.string.isRequired,
  actionRules: PropTypes.string.isRequired
}
function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
const DrawerContent = ({
  handleOpenPopup,
  handleDrawerClick,
  namespace,
  subjectarea,
  entity,
  columnId,
  enId
}) => {
  DrawerContent.propTypes = {
    handleOpenPopup: PropTypes.func,
    handleDrawerClick: PropTypes.func,
    namespace: PropTypes.string.isRequired,
    subjectarea: PropTypes.string.isRequired,
    entity: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    enId: PropTypes.string.isRequired
  }
  const menuItemsData = {
    label: [<MoreVertTwoToneIcon key="vertIcon" />],
    items: [
      {
        label: 'Validate',
        rightIcon: <validateIco />
      }
    ]
  }
  const apiUrl = 'https://mw-app-zk5t2.ondigitalocean.app'
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [checkedRules, setCheckedRules] = useState([])
  const [actionedRules, setActionedRules] = useState([])
  const [dataRules, setDataRules] = useState([])
  const [dataNameRules, setDataNameRules] = useState(null)
  const [error, setError] = useState(null)
  const { isApplying, setIsApplying, resetForm, checkRules, setCheckRules, actionRules, setActionRules, valueTab, handleTabChange, handleInputChange, handleRadioChange, formData, setFormData, errorMsgName, setErrorMsgName, errorMsgRule, setErrorMsgRule } = usePageContext()
  const filteredCheckRules = checkRules.filter(rule => rule.meta && rule.meta.includes(columnId))
  const filteredActionRules = actionRules.filter(rule => rule.meta && rule.meta.includes(columnId))

  const { loading: metaLoading, data: metaName } = useMetaName(enId, columnId, client)
  const { loading, data, refetch } = useDqRules(enId, client)

  useEffect(() => {
    if (!loading && data && data.meta_ruleset_rules) {
      setDataRules(data.meta_ruleset_rules)
    }
  }, [loading, data, setDataRules])

  useEffect(() => {
    if (!metaLoading && metaName && metaName.meta_entity) {
      const metaRule = metaName.meta_entity.map(rule => rule.meta).flat()
      setDataNameRules(metaRule)
    }
  }, [metaLoading, metaName, setDataNameRules])

  useEffect(() => {
    if (dataNameRules && dataRules) {
      const finalRule = dataRules
        .filter(rule => dataNameRules.some(dataNameRule => dataNameRule.id === rule.meta_id))
        .map(rule => {
          const { rule: { ...restRule }, ...restDataNameRule } = rule
          const { name: metaName, ...restDataName } = dataNameRules.find(dataNameRule => dataNameRule.id === rule.meta_id)
          return { ...restRule, meta: metaName, ...restDataName, ...restDataNameRule }
        })
      const checkRulesToAdd = finalRule.filter(rule => rule.subtype === 'check')
      const actionRulesToAdd = finalRule.filter(rule => rule.subtype === 'action')
      const activeCheckRules = checkRulesToAdd.filter(rule => rule.rule_status === 'active')
      const activeActionRules = checkRulesToAdd.filter(rule => rule.rule_status === 'active')
      setCheckRules(checkRulesToAdd)
      setCheckedRules(activeCheckRules)
      setActionRules(actionRulesToAdd)
      setActionedRules(activeActionRules)
    }
  }, [dataRules, dataNameRules])

  const handleCheckboxChange = (rule) => (event) => {
    const { checked } = event.target
    if (checked) {
      if (!checkedRules.some(item => item.id === rule.id)) {
        setCheckedRules(prev => [...prev, rule])
      }
    } else {
      setCheckedRules(prev => prev.filter(item => item.id !== rule.id))
    }
  }
  const handleActionboxChange = (rule) => (event) => {
    if (event.target.checked) {
      if (!actionedRules.some(item => item.id === rule.id)) {
        setActionedRules(prev => [...prev, rule])
      }
    } else {
      setActionedRules(prev => prev.filter(item => item.id !== rule.id))
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    const { name, rule_expression, subtype } = formData
    let hasError = false

    if (!name || !rule_expression) {
      setErrorMsgName(name ? '' : 'Name is required')
      setErrorMsgRule(rule_expression ? '' : 'Rule is required')
      hasError = true
    } else {
      setErrorMsgName('')
      setErrorMsgRule('')
    }
    if (name && name.includes(' ')) {
      setErrorMsgName('Spaces are not allowed in the name')
      hasError = true
    }

    if (!isEditing && subtype !== 'check') {
      const existingRuleForColumnAction = actionRules.find(rule => rule.meta === columnId)
      if (existingRuleForColumnAction) {
        toast.error('A rule already exists for this column in actionRules')
        return
      }
    }

    const newRule = {
      id: isEditing ? editId : `ne_${new Date().getTime().toString()}`,
      type: 'dq',
      subtype,
      name,
      description: name,
      rule_status: 'active',
      rule_expression,
      meta: `${columnId}`,
      rule_category: 'completeness',
      color: null,
      language: 'sql'
    }

    let updatedRules
    if (isEditing) {
      updatedRules = subtype === 'check'
        ? checkRules.map(rule => (rule.id === editId ? { ...rule, ...newRule } : rule))
        : actionRules.map(rule => (rule.id === editId ? { ...rule, ...newRule } : rule))
    } else {
      updatedRules = subtype === 'check'
        ? [...checkRules, newRule]
        : [...actionRules, newRule]
    }

    if (subtype === 'check') {
      setCheckRules(updatedRules)
      if (!isEditing) {
        setCheckedRules((prev) => [...prev, newRule])
      } else {
        setCheckedRules((prev) =>
          prev.map((rule) => (rule.id === editId ? { ...rule, ...newRule } : rule))
        )
      }
    } else {
      setActionRules(updatedRules)
      if (!isEditing) {
        setActionedRules((prev) => [...prev, newRule])
      } else {
        setActionedRules((prev) =>
          prev.map((rule) => (rule.id === editId ? { ...rule, ...newRule } : rule))
        )
      }
    }

    toast.success(isEditing ? 'Rule has been updated' : 'New Rule Added')

    resetForm()
    setIsEditing(false)
    setEditId(null)
  }

  const handleOpenEdit = (id) => {
    const editCheckRule = checkRules.find((item) => item.id === id)
    const editActionRule = actionRules.find((item) => item.id === id)
    setIsEditing(true)
    setEditId(id)
    if (editCheckRule) {
      setFormData({
        id,
        name: editCheckRule.name,
        rule_expression: editCheckRule.rule_expression,
        subtype: editCheckRule.subtype
      })
    } else if (editActionRule) {
      setFormData({
        id,
        name: editActionRule.name,
        rule_expression: editActionRule.rule_expression,
        subtype: editActionRule.subtype
      })
    }
  }
  const handleCloseEdit = () => {
    setIsEditing(false)
    setEditId(null)
    resetForm()
  }
  const openDeleteConfirmation = (id, name) => {
    setDeleteId({ id, name })
    setDeleteConfirmation(true)
  }
  const closeDeleteConfirmation = () => {
    setDeleteId(null)
    setDeleteConfirmation(false)
  }
  const handleDelete = async (id) => {
    closeDeleteConfirmation()
    if (id.startsWith('ne')) {
      // Perform local deletion
      const updatedCheckRules = checkRules.filter((item) => item.id !== id)
      const updatedActionRules = actionRules.filter((item) => item.id !== id)
      setCheckRules(updatedCheckRules)
      setActionRules(updatedActionRules)
      toast.error(`Deletion was successful for ${id}`)
    } else {
      // Make API call for deletion
      const requestBody = { ids: [id] }
      const url = `${apiUrl}/mw/delete_rules?ns=${namespace}&sa=${subjectarea}&en=${entity}`
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })
        if (response.ok) {
          toast.error(`Deletion was successful for ${id}`)
          refetch()
        } else {
          throw new Error('Network response was not ok')
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        toast.info('An error occurred during deletion')
      }
    }
  }

  const handleActionApply = async () => {
    try {
      setIsApplying(true)
      const transformedRule = {
        name: `${namespace}_${subjectarea}_${entity}_dq`,
        type: 'dq',
        rule_requests: actionedRules.map(({ id, ...rest }) => {
          if (!id.startsWith('ne')) {
            return { id, ...rest }
          } else {
            return { ...rest }
          }
        })
      }
      if (actionedRules.length > 0) {
        const createResponse = await fetch(`${apiUrl}/mw/${namespace}/${subjectarea}/${entity}/create_apply_ruleset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transformedRule)
        })
        if (createResponse.ok) {
          setIsApplying(false)
          toast.success('Rule has been applied')
          refetch()
          handleDrawerClick()
        } else {
          throw new Error('Failed to apply')
        }
      }
    } catch (error) {
      setIsApplying(false)
    }
  }
  const handleCheckApply = async () => {
    try {
      setIsApplying(true)
      const transformedRule = {
        name: `${namespace}_${subjectarea}_${entity}_dq`,
        type: 'dq',
        rule_requests: checkedRules.map(({ id, ...rest }) => {
          if (!id.startsWith('ne')) {
            return { id, ...rest }
          } else {
            return { ...rest }
          }
        })
      }
      if (checkedRules.length > 0) {
        const createResponse = await fetch(`${apiUrl}/mw/${namespace}/${subjectarea}/${entity}/create_apply_ruleset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transformedRule)
        })
        if (createResponse.ok) {
          setIsApplying(false)
          toast.success('Rule has been applied')
          refetch()
          handleDrawerClick()
        } else {
          throw new Error('Failed to apply')
        }
      }
    } catch (error) {
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
      <Box role="presentation">
        <Container maxWidth="md">
          <div className="ruleEditorForm">
            <h2 className="headingColor">Rule Editor | <span>{columnId}</span></h2>
            <span>
              <Tooltip title="Expanded Rule-Editor">
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 48,
                    top: 5,
                    color: (theme) => theme.palette.grey[500]
                  }}
                  onClick={handleOpenPopup}
                >
                  <ExpandIcon />
                </IconButton>
              </Tooltip>
            </span>
            <span>
              <Tooltip title="Close">
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 5,
                    color: (theme) => theme.palette.grey[500]
                  }}
                  onClick={handleDrawerClick}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </span>
            <Stack
              component="form"
              sx={{ width: '360px' }}
              spacing={2}
              onSubmit={handleFormSubmit}
              noValidate
              autoComplete="off"
            >
              <FormControl>
                <Grid container spacing={2}>
                  <Grid item xs="auto">
                    <FormLabel className="fieldLabel">Name <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      error={Boolean(errorMsgName)}
                      helperText={errorMsgName}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl>
                <Grid container spacing={2}>
                  <Grid item xs="auto">
                    <FormLabel className="fieldLabel">Rule <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs>
                    <div className='ruleFieldDiv'>
                      <TextField
                        id="rule_expression"
                        value={formData.rule_expression}
                        onChange={handleInputChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <NestedDropdown
                                menuItemsData={menuItemsData}
                                MenuProps={{ elevation: 3 }}
                                onClick={() => ('dd')}
                                className="dropBtn"
                              />
                            </InputAdornment>
                          )
                        }}
                        variant="outlined"
                        required
                        error={Boolean(errorMsgRule)}
                        helperText={errorMsgRule}
                      />
                    </div>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl>
                <Grid container spacing={2}>
                  <Grid item xs="auto">
                    <FormLabel className="fieldLabel">Type <span className="fieldRequired">*</span></FormLabel>
                  </Grid>
                  <Grid item xs>
                    <RadioGroup
                      row
                      value={formData.subtype}
                      onChange={handleRadioChange}
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="subtype"
                    >
                      <FormControlLabel value="check" control={<Radio />} label="Check" />
                      <FormControlLabel value="action" control={<Radio />} label="Action" />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button sx={{ width: '100%' }} size="large" variant="contained" type="submit">{isEditing ? 'Save' : 'Add Rule'}</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button sx={{ width: '100%' }} size="large" variant="outlined" color="secondary" onClick={isEditing ? handleCloseEdit : handleDrawerClick}>Cancel</Button>
                  </Grid>
                </Grid>
              </FormControl>
            </Stack>
            <Stack>
              <div className='ruleTabs'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={valueTab} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Check Rules" {...a11yProps(0)} />
                    <Tab label="Action Rules" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={valueTab} index={0}>
                  <h3 className="headingColor">Check's Rule List</h3>
                  <div className='ruleTableList'>
                    <TableContainer>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Enable</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredCheckRules.length > 0 &&
                            filteredCheckRules.map((rule) => (
                              <TableRow key={rule.id}>
                                <TableCell>{rule.name}</TableCell>
                                <TableCell align="center">
                                  <FormControlLabel control={
                                    <Checkbox
                                      checked={rule.rule_status === 'active' && checkedRules.some(item => item.id === rule.id)}
                                      onChange={handleCheckboxChange(rule)}
                                    />}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton aria-label="Edit" onClick={() => handleOpenEdit(rule.id)}>
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => openDeleteConfirmation(rule.id, rule.name)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <Button size="large" variant="contained" onClick={handleCheckApply} disabled={isApplying} >
                    {isApplying ? 'Applying...' : 'Apply Rules'}
                    {isApplying && <CircularProgress color="inherit" size={24} />}
                  </Button>
                </CustomTabPanel>
                <CustomTabPanel value={valueTab} index={1}>
                  <h3 className="headingColor">Action's Rule List</h3>
                  <div className='ruleTableList'>
                    <TableContainer >
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Enable</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredActionRules.length > 0 &&
                            filteredActionRules.map((rule) => (
                              <TableRow key={rule.id}>
                                <TableCell>{rule.name}</TableCell>
                                <TableCell align="center">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={actionedRules.some(item => item.id === rule.id)}
                                        onChange={handleActionboxChange(rule)}
                                      />
                                    } />
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton aria-label="Edit" onClick={() => handleOpenEdit(rule.id)}>
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => openDeleteConfirmation(rule.id)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <Button size="large" variant="contained" onClick={handleActionApply} disabled={isApplying} >
                    {isApplying ? 'Applying...' : 'Apply Rules'}
                    {isApplying && <CircularProgress color="inherit" size={24} />}
                  </Button>
                </CustomTabPanel>
              </div>
            </Stack>
            {error && (
              <Alert variant="outlined" severity="error">
                {error}
              </Alert>
            )}
          </div>
        </Container>
      </Box >
      <DeleteConfirmationDialog
        open={deleteConfirmation}
        onClose={closeDeleteConfirmation}
        handleClick={handleDelete}
        id={deleteId}
        rule={true}
      />
    </>
  )
}

export default DrawerContent
