import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { usePageContext } from '@/pageProvider/PageContext'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui'
import {
  IconButton,
  Stack,
  FormControl,
  FormLabel,
  Button,
  Grid,
  Box,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  Tabs,
  Tab,
  tooltipClasses
} from '@mui/material'
import {
  Save as SaveIcon,
  Close as CloseIcon,
  MoreVert as MoreVertTwoToneIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import 'react-select-search/style.css'
import PropTypes from 'prop-types'
import { MaterialReactTable } from 'material-react-table'
import { NestedDropdown } from 'mui-nested-menu'
import ComboBox from '@/component/ComboBox'
import BoltIcon from '@/component/Icons/IconBolt'
import ScheduleIcon from '@/component/Icons/IconSchedule'
import AlertIcon from '@/component/Icons/IconAlert'
import PlayIcon from '@/component/Icons/IconPlay'
import TerminalIcon from '@/component/Icons/IconTerminal'
import PropertiesIcon from '@/component/Icons/IconProperties'
import SourceIcon from '@/component/Icons/IconSource'
import DataIcon from '@/component/Icons/IconData'
import { useMapSrcData } from '@/Hooks/MappingSrcData'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainCard from '@/component/MainCard'
import SourceModal from '@/component/SourceModal'
import GranularityModal from '@/component/GranularityModal'

import MetaIcon from '@/component/Icons/IconMeta'

import layoutStyle from '@/assets/css/layout.module.css'
import { isEqualType } from 'graphql'

const tidBitOptions = {
  label: [<MoreVertTwoToneIcon key="vertIcon" />],
  items: [
    {
      label: 'Run Now',
      leftIcon: <BoltIcon />,
      callback: (event, item) => console.log('New clicked', event, item)
    },
    {
      label: 'Change Schedule',
      leftIcon: <ScheduleIcon />,
      callback: (event, item) => console.log('Save clicked', event, item)
    },
    {
      label: 'Data Spike Alert',
      leftIcon: <AlertIcon />,
      rightIcon: (
        <Chip label="Disabled" color="error" size="small" variant="outlined" />
      )
    }
  ]
}

function CustomTabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const MappingScreen = ({ children }) => {
  MappingScreen.propTypes = {
    children: PropTypes.node,
    cell: PropTypes.string
  }
  const router = useRouter()
  const { namespace, subjectarea, entity, type, enId } = router.query

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#2b3e50'
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#2b3e50',
      maxWidth: '200px'
    },
    [`&[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
              {
                marginBottom: '6px!important'
              }
  }))

  const goToPrevPage = (value) => {
    router.push(
      `/data/${namespace}/${subjectarea}/${entity}?type=${type}&tab=${value}&enId=${enId}`
    )
  }

  const goToDataPage = (value) => {
    router.push(
      `/data/${namespace}/${subjectarea}/${entity}?type=${type}&popup=${value}&enId=${enId}`
    )
  }

  const { RestURL, sourceData, selectedCellId, isActive, resetForm, openNamespace } =
    usePageContext()
  const sourceValues = selectedCellId && selectedCellId.map_sources ? selectedCellId.map_sources.split(' > ') : []
  const [sourceNs, sourceSa, sourceEn] = sourceValues
  const ns =
    sourceData?.ns && sourceData.ns.length > 0 ? sourceData.ns : sourceNs
  const sa =
    sourceData?.sa && sourceData.sa.length > 0 ? sourceData.sa : sourceSa
  const en =
    sourceData?.en && sourceData.en.length > 0 ? sourceData.en : sourceEn
  const SourceType =
    sourceData && Object.keys(sourceData).length > 0 ? 'staging' : 'staging'
  const mapId = selectedCellId?.id
  const mapName = selectedCellId?.name
  const [mappingData, setMappingData] = useState([])
  const [isCellEditing, setIsCellEditing] = useState(false)
  const [updatedCells, setUpdatedCells] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [isRunBtnEnabled, setIsRunBtnEnabled] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [errorCell, setErrorCell] = useState([])
  const [openTerminal, setOpenTerminal] = useState(false)
  const [openProperties, setOpenProperties] = useState(false)
  const [openData, setOpenData] = useState(false)
  const [typeByValue, setTypeByValue] = useState()
  const [value, setValue] = useState(0)
  const [groupByValue, setGroupByValue] = useState()
  const [sortByValue, setSortByValue] = useState()
  // eslint-disable-next-line no-unused-vars
  const [terminalLineData, setTerminalLineData] = useState([
    // eslint-disable-next-line react/jsx-key
    <TerminalOutput>Welcome to the Metaware Terminal!</TerminalOutput>
  ])

  const [sourceModalOpen, setSourceModalOpen] = useState(false)
  const [granularityModalOpen, setGranularityModalOpen] = useState(false)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        width: 100,
        enableEditing: false
      },
      {
        accessorKey: 'nameTypeNullable',
        header: 'Target Name',
        enableEditing: false,
        Cell: ({ cell }) => {
          return (
          <>
            <div className={'name'}>
              <span>{cell.row.original.name}</span>
            </div>
            {cell.row.original.type === '.'
              ? (
              <>
                <div className={'type'}></div>
              </>
                )
              : (
              <>
                {' '}
                <div className={'type'}>
                  <span>{cell.row.original.type}</span>
                </div>
              </>
                )}{' '}
            <div
              className={`nullable ${
                cell.row.original.nullable ? 'blue' : 'red'
              }`}
            >
              <span>{cell.row.original.nullable ? '' : '*'}</span>
            </div>
            <div
              className={'infoTip'}
            >
              <span>{cell.row.original.type === 'id' ? <BootstrapTooltip title={`Select unique identifiers on the source ${ns}.${sa}.${en} that represents ${namespace}.${subjectarea}.${entity}`} placement="top" ><InfoIcon /></BootstrapTooltip> : ''}</span>
            </div>
          </>
          )
        }
      },
      {
        accessorKey: 'rule',
        header: 'Rule',
        width: 450,
        editable: true,
        Edit: ({ cell }) => (
        <ComboBox
          entity={enId}
          subjectarea={sa}
          type={SourceType}
          namespace={ns}
          isFormatted={cell.row.original.type}
          valueSrc={cell.getValue()}
          placeholder={
            cell.row.original.name === ''
              ? ''
              : cell.row.original.name === 'nk'
                ? ''
                : 'Enter Rule'
          }
          hasError={errorCell.includes(cell.row.original.name)}
          isDisabledRow={
            cell.row.original.type === 'id' || cell.row.original.name === 'nk'
          }
          onInputChange={(newValue) => {
            handleCellChange(cell, newValue)
            setIsCellEditing(true)
          }}
        />
        )
      }
    ],
    []
  )

  const { data, loading } = useMapSrcData(mapId)
  useEffect(() => {
    if (!loading && data) {
      const metaRuleset = data.map_ruleset.flatMap(ruleset =>
        ruleset.rules.map(rule => ({
          id: rule.id,
          rule: rule.rule_expression,
          name: rule.meta.name,
          type: rule.meta.type
        }))
      )

      if (!isEqualType(metaRuleset, mappingData)) {
        setMappingData(metaRuleset) // Update only if changed
      }
    }
  }, [loading, data])

  // useEffect(() => {
  //   if (!loading && !ruleLoading && data && ruleData) {
  //     setIsLoading(true)
  //     const metaMeta = data.meta_meta.map((meta) => ({
  //       id: meta.id,
  //       name: meta.name,
  //       type: meta.type
  //     }))
  //     const metaRuleset = ruleData.meta_ruleset.flatMap((ruleset) =>
  //       ruleset.ruleset_rules.map((rule) => ({
  //         metaId: rule.meta_id,
  //         ruleExpression: rule.rule.rule_expression
  //       }))
  //     )
  //     const entityNaturalKeys = ruleData.meta_ruleset.flatMap((ruleset) =>
  //       ruleset.entity.entityNaturalKeysByTargetEnId.map((naturalKey) => naturalKey?.source_natural_key)
  //     )
  //     const newData = metaMeta.map((meta) => ({
  //       id: meta.id,
  //       name: meta.name,
  //       type: meta.type,
  //       rule:
  //         meta.type === 'id'
  //           ? entityNaturalKeys || null
  //           : metaRuleset.find((rule) => rule.metaId === meta.id)?.ruleExpression || null
  //     }))
  //     setMappingData(newData)
  //     setIsLoading(false)
  //   }
  // }, [loading, ruleLoading, data, ruleData])

  const isCellUpdated = (rowIndex, columnId) => {
    return updatedCells.some(
      (updated) =>
        updated.rowIndex === rowIndex && updated.columnId === columnId
    )
  }

  const handleCellChange = (cell, newValue) => {
    const rowIndex = cell.row.index
    const columnId = cell.column.id

    // Update the mappingData directly
    const updatedTabData = mappingData.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: newValue } : row
    )
    setMappingData(updatedTabData)

    // Create a new array for updatedCells to avoid direct mutation
    const updatedCellsCopy = [...updatedCells]

    // Update the updatedCells array
    const cellIndexToUpdate = updatedCellsCopy.findIndex(
      (updated) =>
        updated.rowIndex === rowIndex && updated.columnId === columnId
    )

    if (cellIndexToUpdate !== -1) {
      // If cell is already in the updatedCells array, update it
      updatedCellsCopy[cellIndexToUpdate] = { rowIndex, columnId, value: newValue }
    } else {
      // Otherwise, add it to the array
      updatedCellsCopy.push({ rowIndex, columnId, value: newValue })
    }

    setUpdatedCells(updatedCellsCopy)
  }

  // eslint-disable-next-line no-lone-blocks
  { /* const handleApplySourceChanges = async () => {
    try {
      // Iterate over updatedCells and update mappingData accordingly
      const filteredmappingData = mappingData.filter(
        (row) => row.name !== '' && row.name !== 'nk'
      )
      const nonNullableRowsWithBlankRules = filteredmappingData.filter(
        (row) =>
          (row.rule === undefined || row.rule === 'null') &&
          row.nullable === false
      )

      if (nonNullableRowsWithBlankRules.length > 0) {
        const errorCellNames = nonNullableRowsWithBlankRules
          .map((row) => row.name)
          .join(', ')
        setErrorCell(errorCellNames)
        throw new Error(
          `Rule cannot be blank for non-nullable rows: ${errorCellNames}`
        )
      }

      await Promise.all(
        updatedCells.map(async (cell) => {
          const metaItem = filteredmappingData.find(
            (item) => item.name === cell.columnId
          )
          if (metaItem) {
            metaItem.rule = cell.value
          }
        })
      )

      setIsSaving(true)

      const keyArray = {
        target_ns: namespace,
        target_sa: subjectarea,
        target_en: entity,
        source_ns: ns,
        source_sa: sa,
        source_en: en,
        natural_keys: filteredmappingData
          .filter(row => row.type === 'id') // Filter out only rows where the name is 'id'
          .map((item) => {
            return item.rule.map((rule, index) => (
              {
                target_meta: item.name,
                source_natural_key_order: index,
                source_natural_key: rule
              }
            ))
          }).flat()
      }
      const updatedArray = {
        map_id: mapId,
        map_name: mapName,
        map_source: {
          source_entity: {
            sa,
            en,
            ns
          }
        },
        map_transform: {
          type: 'passive'
        },
        map_rules: {
          name: `${mapId}_rules`,
          type: '.',
          rule_requests: filteredmappingData.filter(
            (row) => row.name !== 'id').map((item) => ({
            meta: item.name,
            rule_expression: item.rule || '.',
            name: `${item.name}_map_rule`,
            description: `${item.name}_map_rule`,
            language: 'sql',
            rule_status: 'active',
            subtype: '.',
            type: 'map'
          }))
        }
      }
      const url = `${RestURL}/meta/${namespace}/${subjectarea}/${entity}/create_en_natural_keys`
      // Make the API call
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(keyArray)
      })

      // Handle response
      if (response.ok) {
        toast.info('wait process is running')
        const url = `${RestURL}/meta/${namespace}/${subjectarea}/${entity}/{map_id}/save_map`
        const mapResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedArray)
        })

        // Handle response
        if (mapResponse.ok) {
          toast.success('Mapping saved')
        } else {
          throw new Error('Failed to save data')
        }
        setIsSaving(false)
        setIsRunBtnEnabled(true)
      } else {
        throw new Error('Failed to make natural key')
      }
    } catch (error) {
      setIsSaving(false)
      toast.warning(error.message)
    }
  } */ }

  const handleApplySourceChanges = async () => {
    try {
      // Iterate over updatedCells and update mappingData accordingly
      const filteredmappingData = mappingData.filter(
        (row) => row.name !== '' && row.name !== 'nk'
      )
      const nonNullableRowsWithBlankRules = filteredmappingData.filter(
        (row) =>
          (row.rule === undefined || row.rule === 'null') &&
          row.nullable === false
      )

      if (nonNullableRowsWithBlankRules.length > 0) {
        const errorCellNames = nonNullableRowsWithBlankRules
          .map((row) => row.name)
          .join(', ')
        setErrorCell(errorCellNames)
        throw new Error(
          `Rule cannot be blank for non-nullable rows: ${errorCellNames}`
        )
      }

      await Promise.all(
        updatedCells.map(async (cell) => {
          const metaItem = filteredmappingData.find(
            (item) => item.name === cell.columnId
          )
          if (metaItem) {
            metaItem.rule = cell.value
          }
        })
      )

      setIsSaving(true)

      const updatedArray = {
        map_id: mapId,
        map_name: mapName,
        map_source: {
          source_entity: {
            sa,
            en,
            ns
          }
        },
        map_transform: {
          type: 'passive'
        },
        map_rules: {
          name: `${mapId}_rules`,
          type: '.',
          rule_requests: filteredmappingData.filter(
            (row) => row.name !== 'id').map((item) => ({
            meta: item.name,
            rule_expression: item.rule || '.',
            name: `${item.name}_map_rule`,
            description: `${item.name}_map_rule`,
            language: 'sql',
            rule_status: 'active',
            subtype: '.',
            type: 'map'
          }))
        }
      }
      const url = `${RestURL}/meta/${namespace}/${subjectarea}/${entity}/{map_id}/save_map`
      const mapResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedArray)
      })

      // Handle response
      if (mapResponse.ok) {
        toast.success('Mapping saved')
      } else {
        throw new Error('Failed to save data')
      }
      setIsSaving(false)
    } catch (error) {
      setIsSaving(false)
      toast.warning(error.message)
    }
  }

  const handleRunBtn = async () => {
    try {
      setIsRunning(true)
      const secondUrl = `${RestURL}/data/${namespace}/${subjectarea}/${entity}/{map}/save_map?map_id=${mapId}`
      const secondResponse = await fetch(secondUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (secondResponse.ok) {
        setIsRunning(true)
        toast.info('wait dont close this screen')
        const runUrl = `${RestURL}/data/${namespace}/${subjectarea}/${entity}/{map}/run_map?map_id=${mapId}`
        const thirdResponse = await fetch(runUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (thirdResponse.ok) {
          toast.success('Run Successful')
          setIsRunning(false)
          setIsRunBtnEnabled(false)
        } else {
          throw new Error('Run request failed')
        }
      } else {
        throw new Error('Second request failed')
      }
    } catch (error) {
      setIsRunning(false)
      setIsRunBtnEnabled(false)
      toast.warning(error.message)
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleTerminalOpen = () => {
    setOpenTerminal(true)
  }

  const handleTerminalClose = () => {
    setOpenTerminal(false)
  }

  const handlePropertiesOpen = () => {
    setOpenProperties(true)
  }

  const handlePropertiesClose = () => {
    setOpenProperties(false)
  }

  // const handleDataOpen = () => {
  //   setOpenData(true)
  // }

  const handleDataClose = () => {
    setOpenData(false)
  }

  const typeByOptions = [{ name: 'Simple' }, { name: 'Aggregator' }]

  const handleTypeByChange = (event) => {
    setTypeByValue(event.target.value)
  }

  const groupByOptions = [{ name: 'Simple' }, { name: 'Aggregator' }]

  const handleGroupByChange = (event) => {
    setGroupByValue(event.target.value)
  }

  const sortByOptions = [{ name: 'Simple' }, { name: 'Aggregator' }]

  const handleSortByChange = (event) => {
    setSortByValue(event.target.value)
  }

  return (
    <>
      <Head>
        <title>Mapping | Metaware</title>
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
        typeGetValue={type}
        activeMenu={type}
        activeSubMenu={namespace}
        pageIcon={<MetaIcon />}
        pageHeading={entity}
        customClass={`${openNamespace ? layoutStyle.dashSubMenuOpen : null} ${
          sourceModalOpen ? layoutStyle.dashSubMenuClose : null
        }`}
      >
        <div className="sourceMapModalHdr">
          <div className="srcMapMdlTopHdr">
            <Grid container alignItems="center">
              <Grid item xs>
                <div className="srcMapMdlTopHdrTtl">
                 {mapName && <h3>{mapName}</h3>}
                </div>
              </Grid>
              <Grid item xs>
                <div className="srcMapMdlTopHdrAdtn"></div>
              </Grid>
              <Grid item xs="auto">
                <div className="srcMapMdlTopHdrOptns">
                  <span>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </span>
                  <div className="srcMapMdlHdrOptnDrop">
                    <NestedDropdown
                      menuItemsData={tidBitOptions}
                      MenuProps={{ elevation: 3 }}
                      onClick={() => console.log('Clicked')}
                      className="dropBtn dropBigBtn"
                    />
                  </div>
                  <div className="srcMapMdlHdrCloseBtn">
                    <IconButton
                      aria-label="close"
                      onClick={() => goToPrevPage(1)}
                      sx={{
                        position: 'relative',
                        right: 0,
                        top: 0,
                        color: (theme) => theme.palette.grey[500]
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          {openData
            ? null
            : (
            <div className="mdlHdrIconsOuter">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <div className="mdlHdrIcons">
                    <span>
                      <Tooltip title="Mapping Properties">
                        <Button
                          onClick={handlePropertiesOpen}
                          className={`${openProperties ? 'mdlActiveIcon' : ''}`}
                        >
                          <PropertiesIcon /> Mapping Properties
                        </Button>
                      </Tooltip>
                    </span>
                    <span>
                      <Tooltip title="Monitoring">
                        <Button
                          onClick={handleTerminalOpen}
                          className={`${openTerminal ? 'mdlActiveIcon' : ''}`}
                        >
                          <TerminalIcon /> Monitoring
                        </Button>
                      </Tooltip>
                    </span>
                  </div>
                </Grid>
                <Grid item xs="auto">
                  <div className="mdlHdrButtons">
                    {/* <Button
                      onClick={() => setSourceData([])}
                      variant="outlined"
                      color="secondary"
                      startIcon={<RotateLeftRoundedIcon />}
                      title="Reset Source"
                    >
                      Reset Source
                    </Button> */}
                    <Button
                      onClick={() => {
                        setSourceModalOpen(true)
                      }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<SourceIcon />}
                    >
                      Source
                    </Button>
                    <Button
                      onClick={() => goToDataPage(true)}
                      variant="outlined"
                      startIcon={<DataIcon />}
                    >
                      Data
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </div>
              )}
        </div>
        <div className="sourceMapModalBody">
          <div className="tidBitOuterDiv">
            <Grid container sx={{ height: '100%' }}>
              {openProperties
                ? (
                <>
                  <Grid item xs={2}>
                    <div className="tbiPrprtsOuterDiv">
                      <IconButton
                        aria-label="close"
                        onClick={handlePropertiesClose}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 10,
                          color: (theme) => theme.palette.grey[500]
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <h3 className="headingColor">Mapping Properties</h3>
                      <div className="tbiPrprtsBody">
                        <div className="customForm sharedRuleForm">
                          <Stack component="form" spacing={2}>
                            <FormControl fullWidth>
                              <FormLabel className="fieldLabel">
                                Select Type
                              </FormLabel>
                              <Select
                                labelId="typeBy"
                                id="typeBy"
                                name="typeBy"
                                placeholder="Select Type"
                                onChange={handleTypeByChange}
                                value={typeByValue}
                              >
                                {typeByOptions.map((item, index) => (
                                  <MenuItem key={index} value={item.name}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth>
                              <FormLabel className="fieldLabel">
                                Group By
                              </FormLabel>
                              <Select
                                labelId="groupBy"
                                id="groupBy"
                                name="groupBy"
                                placeholder="Select Group"
                                onChange={handleGroupByChange}
                                value={groupByValue}
                              >
                                {groupByOptions.map((item, index) => (
                                  <MenuItem key={index} value={item.name}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth>
                              <FormLabel className="fieldLabel">
                                Sort By
                              </FormLabel>
                              <Select
                                labelId="sortBy"
                                id="sortBy"
                                name="sortBy"
                                placeholder="Select Sort"
                                onChange={handleSortByChange}
                                value={sortByValue}
                              >
                                {sortByOptions.map((item, index) => (
                                  <MenuItem key={index} value={item.name}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </>
                  )
                : null}
              <Grid item xs={openProperties ? 10 : 12}>
                <div
                  className={`tidBitTblDiv ${
                    openProperties ? 'tidBitTblPrptsActiveDiv' : ''
                  } ${openTerminal ? 'tidBitTblActiveDiv' : ''}`}
                >
                  <div
                    className={`tidBitHdr ${openData ? 'tidBitDataHdr' : ''}`}
                  >
                    <Grid container alignItems="center" spacing={0}>
                      <Grid item xs>
                        <h3 className="headingColor">Mapping Specifications</h3>
                      </Grid>
                      <Grid item xs="auto">
                        {openData
                          ? (
                          <div className="tidBitHdrBtns">
                            <IconButton
                              aria-label="close"
                              onClick={handleDataClose}
                              sx={{
                                position: 'relative',
                                right: 0,
                                top: 0,
                                color: (theme) => theme.palette.grey[500]
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>
                            )
                          : (
                          <div className="tidBitHdrLnks">
                            <Button
                              variant="contained"
                              startIcon={<SaveIcon />}
                              onClick={() => handleApplySourceChanges()}
                              disabled={
                                isRunBtnEnabled || isSaving ? true : null
                              }
                            >
                              {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<PlayIcon />}
                              onClick={() => handleRunBtn()}
                              disabled={
                                !isRunBtnEnabled || isRunning ? true : null
                              }
                            >
                              {isRunning ? 'Running...' : 'Run'}
                            </Button>
                          </div>
                            )}
                      </Grid>
                    </Grid>
                  </div>
                  {openData
                    ? (
                    <div className="tidBitDataTblBody">{children}</div>
                      )
                    : (
                    <div className={'commonTable tidBitTblBody'}>
                      <MaterialReactTable
                        columns={columns}
                        data={mappingData}
                        state={{ loading }}
                        enableRowVirtualization
                        enableBottomToolbar={false}
                        enableGlobalFilterModes
                        initialState={{
                          density: 'compact',
                          sorting: [{ id: 'id', desc: true }],
                          columnVisibility: { id: false }
                        }}
                        editingMode="table"
                        enableEditing
                        enableTopToolbar={false}
                        enableColumnActions={false}
                        muiTableBodyRowProps={({ row }) => ({
                          className: isCellEditing ? 'tidBitTblActRow' : ''
                        })}
                        muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                          onBlur: (event) => {
                            handleCellChange(cell, event.target.value)
                          },
                          variant: 'outlined',
                          style: {
                            backgroundColor: isCellUpdated(
                              cell.row.index,
                              cell.column.id
                            )
                              ? '#e6f2fb'
                              : 'inherit',
                            important: true
                          }
                        })}
                        enableStickyHeader
                        enablePagination={false}
                      />
                    </div>
                      )}
                </div>
                {openTerminal
                  ? (
                  <div
                    className={`monitorTabsOuter ${
                      openProperties ? 'monitorTabsActiveOuter' : ''
                    }`}
                  >
                    <IconButton
                      aria-label="close"
                      onClick={handleTerminalClose}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: 8,
                        zIndex: 2,
                        color: (theme) => theme.palette.grey[500]
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Box sx={{ width: '100%' }}>
                      <div className="monitorTabs">
                        <Tabs
                          value={value}
                          onChange={handleChange}
                          aria-label="basic tabs example"
                        >
                          <Tab label="Monitoring" {...a11yProps(0)} />
                          <Tab label="Run Logs" {...a11yProps(1)} />
                          <Tab label="Additional" {...a11yProps(2)} />
                          <Tab label="Service Options" {...a11yProps(3)} />
                        </Tabs>
                      </div>
                      <CustomTabPanel
                        value={value}
                        index={0}
                        className="monitorTabContent"
                      >
                        <div className="monitorOuterDiv">
                          <Terminal
                            colorMode={ColorMode.Dark}
                            onInput={(terminalInput) =>
                              console.log(
                                `New terminal input received: '${terminalInput}'`
                              )
                            }
                          >
                            {terminalLineData}
                          </Terminal>
                        </div>
                      </CustomTabPanel>
                      <CustomTabPanel
                        value={value}
                        index={1}
                        className="monitorTabContent"
                      >
                        <div className="monitorOuterDiv"></div>
                      </CustomTabPanel>
                      <CustomTabPanel
                        value={value}
                        index={2}
                        className="monitorTabContent"
                      >
                        <div className="monitorOuterDiv"></div>
                      </CustomTabPanel>
                      <CustomTabPanel
                        value={value}
                        index={3}
                        className="monitorTabContent"
                      >
                        <div className="monitorOuterDiv"></div>
                      </CustomTabPanel>
                    </Box>
                  </div>
                    )
                  : null}
                {/* <div className='granlrtyLink'>
                <Link href="#" onClick={onGranularityClick}>+ Granularity Denormalize</Link>
              </div> */}
              </Grid>
            </Grid>
          </div>
        </div>
        <SourceModal
          open={sourceModalOpen}
          onClose={() => {
            setSourceModalOpen(false)
            resetForm()
          }}
          customClass={`${isActive ? 'pageViewPopupFull' : ''}`}
        />
        <GranularityModal
          columns={columns}
          open={granularityModalOpen}
          onClose={() => {
            setGranularityModalOpen(false)
          }}
          onSubmit={'df'}
          customClass={`${isActive ? 'pageViewPopupFull' : ''}`}
        />
      </MainCard>
    </>
  )
}
export default MappingScreen
