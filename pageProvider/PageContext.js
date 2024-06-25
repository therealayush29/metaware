// In your PageContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const PageContext = createContext()

export const usePageContext = () => {
  return useContext(PageContext)
}

export const PageProvider = ({ children }) => {
  PageProvider.propTypes = {
    children: PropTypes.node.isRequired
  }
  const RestURL = process.env.NEXT_PUBLIC_URL
  const initialState = {
    name: '',
    rule_expression: '',
    category: 'Accuracy',
    description: '',
    subtype: 'check',
    sourceJoin: ''
  }
  const [isActive, setIsActive] = useState(false)
  const [valueTab, setValueTab] = useState(0) // For controlling the tabs
  const [checkRules, setCheckRules] = useState([])
  const [actionRules, setActionRules] = useState([])
  const [formData, setFormData] = useState(initialState)
  const [functionValue, setFunctionValue] = useState('')
  const [errorMsgName, setErrorMsgName] = useState(false)
  const [errorMsgRule, setErrorMsgRule] = useState(false)
  const [errorMsgDescription, setErrorMsgDescription] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [metaNspace, setMetaNspace] = useState([])
  const [sourceData, setSourceData] = useState([])
  const [selectedSource, setSelectedSource] = useState(false)
  const [nsNewRow, setNsNewRow] = useState(null)
  const [saNewRow, setsaNewRow] = useState(null)
  const [enNewRow, setenNewRow] = useState(null)
  const [metaNewRow, setmetaNewRow] = useState(null)
  const [metaNamespace, setMetaNamespace] = useState([])
  const [typeValue, setTypeValue] = useState(null)
  const [openNamespace, setOpenNamespace] = useState(null)
  const [selectedCellId, setSelectedCellId] = useState(null)
  const [state, setState] = useState({
    namespaceValue: [],
    nameSpaceType: '',
    subjectareaValue: '',
    entityValue: ''
  })
  const [selectedNamespace, setSelectedNamespace] = useState(null)
  const [selectedSubjectArea, setSelectedSubjectArea] = useState(null)
  const [assOption, setAssOption] = useState([])
  const [entityData, setEntityData] = useState([])
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const localStorageTheme = localStorage.getItem('theme')
      if (localStorageTheme !== null) {
        return JSON.parse(localStorageTheme)
      }
    }
    return false
  })
  const [namSpaceMeta, setNamSpaceMeta] = useState([])
  const [subjectareaData, setSubjectareaData] = useState([])
  const [updatedCells, setUpdatedCells] = useState([])
  const [clicked, setClicked] = useState(false)
  const [activeCardId, setActiveCardId] = useState(null)
  const [columns, setColumns] = useState([])
  const [tableData, setTableData] = useState([])
  const [tabData, setTabData] = useState([])
  useEffect(() => {
    localStorage.setItem('metaNspace', JSON.stringify(metaNspace))
    localStorage.setItem('checkRules', JSON.stringify(checkRules))
    localStorage.setItem('actionRules', JSON.stringify(actionRules))
    localStorage.setItem('selectedCellId', JSON.stringify(selectedCellId))
    localStorage.setItem('state', JSON.stringify(state))
    localStorage.setItem('selectedSubjectArea', JSON.stringify(selectedSubjectArea))
    localStorage.setItem('selectedNamespace', JSON.stringify(selectedNamespace))
    localStorage.setItem('metaNamespace', JSON.stringify(metaNamespace))
    localStorage.setItem('namSpaceMeta', JSON.stringify(namSpaceMeta))
  }, [checkRules, actionRules, selectedCellId, state, selectedSubjectArea, selectedNamespace, metaNspace, metaNamespace, namSpaceMeta])

  useEffect(() => {
    // Load data from localStorage if available
    const localStorageSidebar = JSON.parse(localStorage.getItem('metaNspace'))
    const localStorageCheckRules = JSON.parse(localStorage.getItem('checkRules'))
    const localStorageActionRules = JSON.parse(localStorage.getItem('actionRules'))
    const localStorageSelectedCellIdRules = JSON.parse(localStorage.getItem('selectedCellId'))
    const localStorageMetaData = JSON.parse(localStorage.getItem('state'))
    const localStorageSelectedSubjectArea = JSON.parse(localStorage.getItem('selectedSubjectArea'))
    const localStorageSelectedNamespace = JSON.parse(localStorage.getItem('selectedNamespace'))
    const localStorageMetaNamespace = localStorage.getItem('metaNamespace')
    const localStoragenamSpaceMeta = localStorage.getItem('namSpaceMeta')
    // Update states only if localStorage data exists
    if (localStoragenamSpaceMeta || localStorageSidebar || localStorageCheckRules || localStorageActionRules || localStorageSelectedCellIdRules || localStorageMetaData || localStorageSelectedSubjectArea || localStorageSelectedNamespace || localStorageMetaNamespace) {
      setCheckRules(localStorageCheckRules)
      setMetaNspace(localStorageSidebar)
      setActionRules(localStorageActionRules)
      setSelectedCellId(localStorageSelectedCellIdRules)
      setState(localStorageMetaData)
      setSelectedSubjectArea(localStorageSelectedSubjectArea)
      setSelectedNamespace(localStorageSelectedNamespace)
      setMetaNamespace(JSON.parse(localStorageMetaNamespace))
      setNamSpaceMeta(JSON.parse(localStoragenamSpaceMeta))
    }
  }, [])
  const handleInputChange = (event) => {
    const { id, value } = event.target

    // Update both functionValue and formData.rule_expression when the text field changes
    if (id === 'rule_expression') {
      setFunctionValue(value)
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }))
  }

  const handleTabChange = (event, newValueTab) => {
    setValueTab(newValueTab)
  }

  const handleRadioChange = (event) => {
    const { value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      subtype: value
    }))
    setValueTab(value === 'check' ? 0 : 1)
  }

  const toggleActive = () => {
    setIsActive((current) => !current)
  }

  const resetForm = () => {
    setFormData(initialState)
    setSelectedSource(false)
    // Additional logic if needed
    setFunctionValue('')
  }

  useEffect(() => {
    const handleClick = () => {
      setClicked(false)
      setActiveCardId(null)
    }

    // Attach event listener
    window.addEventListener('click', handleClick)

    // Cleanup function
    return () => {
      // Remove event listener
      window.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <PageContext.Provider
      value={{
        RestURL,
        columns,
        setColumns,
        tabData,
        setTabData,
        tableData,
        setTableData,
        activeCardId,
        setActiveCardId,
        clicked,
        setClicked,
        updatedCells,
        setUpdatedCells,
        subjectareaData,
        setSubjectareaData,
        entityData,
        setEntityData,
        namSpaceMeta,
        setNamSpaceMeta,
        theme,
        setTheme,
        metaNamespace,
        setMetaNamespace,
        selectedSubjectArea,
        setSelectedSubjectArea,
        selectedNamespace,
        setSelectedNamespace,
        assOption,
        setAssOption,
        metaNewRow,
        setmetaNewRow,
        enNewRow,
        setenNewRow,
        saNewRow,
        setsaNewRow,
        state,
        setState,
        selectedCellId,
        setSelectedCellId,
        typeValue,
        setTypeValue,
        openNamespace,
        setOpenNamespace,
        nsNewRow,
        setNsNewRow,
        selectedSource,
        setSelectedSource,
        sourceData,
        setSourceData,
        metaNspace,
        setMetaNspace,
        isActive,
        toggleActive,
        resetForm,
        isApplying,
        setIsApplying,
        checkRules,
        setCheckRules,
        functionValue,
        setFunctionValue,
        valueTab,
        setValueTab,
        handleTabChange,
        actionRules,
        setActionRules,
        formData,
        handleInputChange,
        errorMsgDescription,
        setErrorMsgDescription,
        handleRadioChange,
        setFormData,
        errorMsgName,
        setErrorMsgName,
        errorMsgRule,
        setErrorMsgRule
      }}
    >
      {children}
    </PageContext.Provider>
  )
}
