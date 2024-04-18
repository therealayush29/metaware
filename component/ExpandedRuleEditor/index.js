import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  TextField,
  Button,
  Stack,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material'
import PropTypes from 'prop-types'
import { MuiColorInput } from 'mui-color-input'
import { Close as CloseIcon, Add as AddIcon, Remove as RemoveIcon, ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material'
import SelectSearch from 'react-select-search'
import 'react-select-search/style.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRuleLang } from '@/Hooks/RuleLang'
import { usePageContext } from '../../pageProvider/PageContext'
import client from '../../apollo-client'
const ExpandedRuleEditor = ({
  customClass,
  openPopup,
  handleClosePopup,
  columnId
}) => {
  ExpandedRuleEditor.propTypes = {
    customClass: PropTypes.string,
    openPopup: PropTypes.string,
    handleClosePopup: PropTypes.func,
    columnId: PropTypes.string.isRequired
  }
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedLangCategory, setSelectedLangCategory] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [functionOptions, setFunctionOptions] = useState([])
  const [parameters, setParameters] = useState([''])
  const [colorValue, setColorValue] = useState('#3f51b5')
  const [checkSharedRule, setCheckSharedRule] = useState(false)
  const { loading, error, data } = useRuleLang(client)
  const { checkRules, setCheckRules, resetForm, actionRules, setActionRules, functionValue, setFunctionValue, handleInputChange, errorMsgDescription, setErrorMsgDescription, handleRadioChange, formData, setFormData, errorMsgName, setErrorMsgName, errorMsgRule, setErrorMsgRule } = usePageContext()
  const category = [
    { id: 1, name: 'Custom tag' },
    { id: 2, name: 'Expression (def)' },
    { id: 3, name: 'Uniqueness' },
    { id: 4, name: 'Consistency' },
    { id: 5, name: 'Completeness' },
    { id: 6, name: 'Accuracy' }
  ]
  const handleFormSubmit = (event) => {
    event.preventDefault()
    const { name, rule_expression, description, subtype, category } = formData
    const minLength = 1 // Set the minimum length required for fields
    let hasError = false
    if (!name || !rule_expression || !description) {
      setErrorMsgName(name ? '' : 'Name is required')
      setErrorMsgRule(rule_expression ? '' : 'Rule is required')
      setErrorMsgDescription(rule_expression ? '' : 'Description is required')
      hasError = true
    } else {
      setErrorMsgName('')
      setErrorMsgRule('')
      setErrorMsgDescription('')
    }
    if (name && name.includes(' ')) {
      setErrorMsgName('Spaces are not allowed in the name')
      hasError = true
    }
    if (hasError) {
      // handleAlertTimeout(); // Clear alert after 3 seconds
      return
    }
    if (formData.subtype !== 'check') {
      const existingRuleForColumnAction = actionRules.find(rule => rule.meta === columnId)
      if (existingRuleForColumnAction) {
        toast.error('A rule already exists for this column in actionRules')
        return
      }
    }
    const newRule = {
      id: new Date().getTime().toString(),
      type: 'dq',
      subtype,
      name,
      description,
      rule_status: 'active',
      rule_expression,
      meta: `${columnId}`,
      rule_category: category,
      color: colorValue,
      language: selectedLanguage
    }
    let newRules = []
    newRules = formData.subtype === 'check'
      ? [...checkRules, newRule]
      : [...actionRules, newRule]

    formData.subtype === 'check'
      ? setCheckRules(newRules)
      : setActionRules(newRules)

    toast.success('New Rule Added')
    handleClosePopup()
    resetForm() // Reset form data after adding a new rule
  }
  useEffect(() => {
    if (!loading && data) {
      const languages = [...new Set(data.function_help.map(item => item.lang))]
      setSelectedLanguage(languages[0] || '') // Set the default language
    }
  }, [data, loading])
  useEffect(() => {
    setCategoryOptions([])
    if (selectedLanguage) {
      const categories = [...new Set(data.function_help.filter(item => item.lang === selectedLanguage).map(item => item.category))]
      setCategoryOptions(categories.map(category => ({ name: category, value: category })))
    }
  }, [selectedLanguage, data])
  useEffect(() => {
    setFunctionOptions([])
    if (selectedLangCategory) {
      const functionsInCategory = data.function_help
        .filter(item => item.category === selectedLangCategory && item.lang === selectedLanguage)
        .map(item => ({ name: item.function, value: item.function }))
      setFunctionOptions(functionsInCategory)
    }
  }, [selectedLangCategory, selectedLanguage, data])
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
    setSelectedLangCategory('') // Reset category when language changes
    setFunctionValue('') // Reset function when language changes
  }
  const handleCategoryLangChange = (value) => {
    setSelectedLangCategory(value)
    setFunctionValue('') // Reset function when category changes
  }
  const handleFunctionChange = (value) => {
    setFunctionValue(value)
  }
  const functionDescriptions = {}
  if (data) {
    data.function_help.forEach((item) => {
      const key = item.function
      const name = item.function
      const description = [
        `<p><b>${name}</b></p>`,
        `<p>${item.description}</p>`,
        `<p><b>Example</b>: ${item.example}</p>`,
        `<p><b>Result</b>: ${item.result}</p>`
      ]
      functionDescriptions[key] = { name, description }
    })
  }
  const handleCategoryChange = (event) => {
    const { value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: value
    }))
  }
  const handleColorChange = (newColorValue) => {
    setColorValue(newColorValue)
  }
  const handleCheckChange = (event) => {
    setCheckSharedRule(event.target.checked)
  }
  const addParameter = () => {
    const updatedParameters = [...parameters, '']
    setParameters(updatedParameters)
  }
  const removeParameter = (indexToRemove) => {
    const updatedParameters = parameters.filter((_, index) => index !== indexToRemove)
    setParameters(updatedParameters)
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
      <Dialog open={openPopup} onClose={handleClosePopup} className={`pageViewPopup ${customClass}`}>
        <DialogTitle sx={{ py: 1.2, px: 2 }} className="headingColor" id="customized-dialog-title">Expanded Rule Editor | <span>{columnId}</span></DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosePopup}
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
          <Grid container>
            <Grid item xs>
              <div className='customForm sharedRuleForm'>
                <Stack component="form" onSubmit={handleFormSubmit} spacing={2}>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Name <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          error={Boolean(errorMsgName)}
                          helperText={errorMsgName}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Rule <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="rule_expression"
                          value={functionValue || formData.rule_expression}
                          onChange={handleInputChange}
                          error={Boolean(errorMsgRule)}
                          helperText={errorMsgRule}
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
                          value={formData.description}
                          onChange={handleInputChange}
                          error={Boolean(errorMsgDescription)}
                          helperText={errorMsgDescription}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Language <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <Select
                          labelId="language"
                          id="language"
                          value={selectedLanguage}
                          onChange={handleLanguageChange}
                        >
                          {data && [...new Set(data.function_help.map(item => item.lang))].map(lang => (
                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Color <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <MuiColorInput className='colorField' value={colorValue} onChange={handleColorChange} margin="dense" />
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Select Category <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <Select
                          labelId="category"
                          id="category"
                          name="category"
                          placeholder="Select Category"
                          onChange={handleCategoryChange}
                          value={formData.category}
                        >
                          {category.map((item) => (
                            <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                          ))}

                        </Select>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Type <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
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
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Parameters <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <div>
                          {parameters.map((parameter, index) => (
                            <Grid container spacing={2} key={parameter} >
                              <Grid item xs>
                                <TextField
                                  value={formData.parameter}
                                  onChange={(e) => {
                                    const updatedParameters = [...parameters]
                                    updatedParameters[index] = e.target.value
                                    setParameters(updatedParameters)
                                  }}
                                  margin='dense'
                                />
                              </Grid>
                              <Grid item xs="auto">
                                {index > 0
                                  ? (
                                  <IconButton
                                    aria-label="remove"
                                    onClick={() => removeParameter(index)}
                                    sx={{ width: '32px', height: '32px', marginTop: '8px' }}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                    )
                                  : (
                                  <IconButton
                                    aria-label="add"
                                    onClick={addParameter}
                                    sx={{ width: '32px', height: '32px', marginTop: '8px' }}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                    )}
                              </Grid>
                            </Grid>
                          ))}
                        </div>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormLabel className="fieldLabel">Create Shared <span className="fieldRequired">*</span></FormLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checkSharedRule}
                              onChange={handleCheckChange}
                              color="primary"
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                </Stack>
              </div>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ pl: 3, mr: 3 }}></Divider>
            <Grid item xs>
              <div className='sharedRuleFunctionsDiv'>
                <h3 className="headingColor">Function</h3>
                <div className='sharedRuleFunctions'>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <div className='shrdRuleFnctnForm'>
                        <FormControl fullWidth>
                          <div className={`normalSelect ${!selectedLangCategory == '' ? 'selectedDropDiv' : null}`}>
                            <SelectSearch
                              options={categoryOptions}
                              name="category-select"
                              placeholder="Select Category"
                              onChange={handleCategoryLangChange}
                              value={selectedLangCategory}
                            />
                            <i><ArrowDropDownIcon /></i>
                          </div>
                        </FormControl>
                        <FormControl fullWidth>
                          <div className='functionSelect'>
                            <SelectSearch
                              options={functionOptions}
                              name="function"
                              placeholder="Search"
                              onChange={handleFunctionChange}
                              keepSelectedInList={false}
                              search
                              value={functionValue}
                            />
                          </div>
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid item xs={7}>
                      <div className='shrdRuleFnctnInfo'>
                        {functionValue && functionDescriptions[functionValue]?.description.map((htmlString, index) => (
                          <div key={index} dangerouslySetInnerHTML={{ __html: htmlString }} />
                        ))}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>
          <DialogActions sx={{ py: 1.2, px: 2, justifyContent: 'flex-start' }}>
            <Button
              size="large"
              variant="contained"
              onClick={handleFormSubmit}
              color="primary"
            >
              Validate
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog >
    </>
  )
}

export default ExpandedRuleEditor
