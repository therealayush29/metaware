import React, { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { usePageContext } from '@/pageProvider/PageContext'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import { useMapData } from '@/Hooks/MappingData'
import client from '@/apollo-client'
import {
  Box,
  Drawer,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Stack,
  Grid,
  Tabs,
  Tab
} from '@mui/material'
import {
  Delete,
  FileDownload as FileDownloadIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  RotateLeftRounded as RotateLeftRoundedIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'
import { ExportToCsv } from 'export-to-csv'
import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'
import DeleteConfirmationDialog from '@/component/DeleteConfirmationDialog'
import BreadCrumbs from '@/component/BreadCrumbs'
import CreateNewRow from '@/component/CreateNewRowModal'
import ExpandedRuleEditor from '@/component/ExpandedRuleEditor'
import DrawerContent from '@/component/DrawerContent'
import CreateNewMapRow from '@/component/CreateNewMapRowModal'
import DataIcon from '@/component/Icons/IconData'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import layoutStyle from '@/assets/css/layout.module.css'

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
const DashboardTable = () => {
  DashboardTable.propTypes = {
    cell: PropTypes.string
  }
  const router = useRouter()
  const { namespace, subjectarea, entity, id, type, popup, enId } = router.query
  const { isActive, resetForm, openNamespace, setSelectedCellId } = usePageContext()
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  useEffect(() => {
    const tabFromQuery = parseInt(router.query.tab, 10) || 0
    setValue(tabFromQuery)
  }, [router.query.tab])
  const apiUrl = 'https://mw-app-zk5t2.ondigitalocean.app'
  const url1 = '#'
  const url2 = `/data/${namespace}/${subjectarea}?id=${id}&type=${type}`
  const url3 = `/data/${namespace}/${subjectarea}/${entity}`
  const links = {
    link: '/',
    nLink: url1,
    sLink: url2,
    eLink: url3,
    name: 'Dashboard',
    namespace,
    subjectarea,
    entity
  }
  const dynamicQueryName = `${subjectarea}_${entity}`
  const [exportCsv, setExportCsv] = useState(null)
  const [tabData, setTabData] = useState([])
  const [columns, setColumns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [metaNamespace, setMetaNamespace] = useState([])
  const [drawerState, setDrawerState] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [mode, setMode] = useState(false)
  const [isApplyButtonEnabled, setIsApplyButtonEnabled] = useState(false)
  const [updatedCells, setUpdatedCells] = useState([])
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)

  const [modeMapping, setModeMapping] = useState(false)
  const [createMapModalOpen, setCreateMapModalOpen] = useState(false)
  const [tableData, setTableData] = useState([])
  const [isLoadingMap, setIsLoadingMap] = useState(true)

  const [tableDqData, setTableDqData] = useState([])
  const [isLoadingDq, setIsLoadingDq] = useState(true)
  const [columnsDq, setColumnsDq] = useState([])
  const handleOpenPopup = () => {
    setDrawerState((prevState) => !prevState)
    setOpenPopup(true)
  }
  const handleClosePopup = () => {
    setDrawerState((prevState) => !prevState)
    setOpenPopup(false)
  }
  const handleClick = (event) => {
    setExportCsv(event.currentTarget)
  }
  const handleClose = () => {
    setExportCsv(null)
  }

  const capitalizedEntity =
  typeof entity === 'string' && entity.length > 0
    ? entity.charAt(0).toUpperCase() + entity.slice(1)
    : ''

  const toggleDrawer = (event, columnId) => {
    setDrawerState((prevState) => !prevState)
    setSelectedColumnId(columnId)

    if (drawerState) {
      resetForm()
    }
  }

  const fetchData = async (
    namespace,
    subjectarea,
    entity,
    setColumns,
    setTabData,
    setIsLoading
  ) => {
    if (namespace && subjectarea && entity) {
      try {
        const response = await fetch(
          `${apiUrl}/data/${namespace}/${subjectarea}/${entity}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const responseData = await response.json()
        const tabData = responseData.data || []
        const columnHeaders = responseData.header.fields
        const sanitizedHeaders = Object.keys(columnHeaders).map(
          (headerKey) => ({
            accessorKey: headerKey,
            header: headerKey.replace(/_/g, ' '),
            ...(headerKey === 'id' && { size: 100, enableEditing: false })
            // ...(headerKey === 'link' && { enableClickToCopy: true })
          })
        )
        setColumns(sanitizedHeaders)
        // Process data here after setting columns
        const formattedData = tabData.map((rowData) =>
          rowData.reduce((formattedRow, value, index) => {
            formattedRow[sanitizedHeaders[index].accessorKey] = value
            return formattedRow
          }, {})
        )
        setTabData(formattedData)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }
  }
  useEffect(() => {
    if (namespace && subjectarea && entity) {
      fetchData(
        namespace,
        subjectarea,
        entity,
        setColumns,
        setTabData,
        setIsLoading
      )
    }
  }, [namespace, subjectarea, entity])
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    title: dynamicQueryName,
    showTitle: true,
    filename: dynamicQueryName,
    headers: columns.map((c) => c.accessorKey)
  }
  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original))
  }
  const handleExportData = () => {
    const transformedData = tabData.map((row) => {
      const obj = {}
      row.forEach((value, index) => {
        const header = columns[index].accessorKey
        obj[header] = value
      })
      return obj
    })
    csvExporter.generateCsv(transformedData)
  }
  const handleCreateNewRow = async (values) => {
    try {
      const response = await fetch(
        `${apiUrl}/data/${namespace}/${subjectarea}/${entity}/create_data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([values])
        }
      )

      if (response.ok) {
        toast.success('Inserted New Data')
        fetchData(
          namespace,
          subjectarea,
          entity,
          setColumns,
          setTabData,
          setIsLoading
        )
      } else {
        throw new Error('Failed to insert data')
      }
    } catch (error) {
      toast.warning('An error occurred during Inserting')
    }
  }
  const handleEditMode = () => {
    setMode((prevMode) => (prevMode === 'table' ? null : 'table'))
  }
  const handleCellChange = (cell, newValue) => {
    const rowIndex = cell.row.index
    const columnId = cell.column.id

    const oldCell = tabData[rowIndex][columnId] // Get old value from the original data source
    const currentDate = new Date().getTime().toString()

    const updatedCell = {
      rowIndex,
      columnId,
      oldValue: oldCell,
      newValue,
      updatedAt: currentDate
    }

    const cellIndex = updatedCells.findIndex(
      (updated) =>
        updated.rowIndex === rowIndex && updated.columnId === columnId
    )

    if (cellIndex !== -1) {
      updatedCells[cellIndex] = updatedCell
    } else {
      updatedCells.push(updatedCell)
    }

    setUpdatedCells([...updatedCells])
  }
  useEffect(() => {
    setIsApplyButtonEnabled(updatedCells.length > 0)
  }, [updatedCells])

  const isCellUpdated = (rowIndex, columnId) => {
    return updatedCells.some(
      (updated) =>
        updated.rowIndex === rowIndex && updated.columnId === columnId
    )
  }
  const handleSaveCell = async (cell, newValue, oldValue) => {
    const rowIndexToUpdate = cell.row.index
    const columnId = cell.column.id

    const updatedTabData = tabData.map((row, rowIndex) => {
      return rowIndex === rowIndexToUpdate
        ? { ...row, [columnId]: newValue }
        : row
    })

    setTabData(updatedTabData)

    const updatedCells = updatedTabData
      .map((row, index) => {
        if (index === rowIndexToUpdate) {
          return {
            id: row.id,
            [columnId]: newValue
          }
        }
        return null
      })
      .filter((cell) => cell !== null)

    try {
      const response = await fetch(
        `${apiUrl}/data/${namespace}/${subjectarea}/${entity}/update_data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedCells)
        }
      )
      if (response.ok) {
        toast.info('Updated Data')
      } else {
        throw new Error('Failed to update data')
      }
    } catch (error) {
      toast.warning('An error occurred during updating')
    }
  }
  const handleApplyChanges = async () => {
    // Update cells that were modified
    for (const cell of updatedCells) {
      const { rowIndex, columnId, newValue, oldValue } = cell
      await handleSaveCell(
        {
          row: { index: rowIndex },
          column: { id: columnId }
        },
        newValue,
        oldValue // Pass both new and old values to handleSaveCell
      )
    }

    // Clear the list of updated cells after applying changes
    setUpdatedCells([])
  }
  const DATA_ENTRIES_DELETE = gql`
    mutation DeleteSelected${dynamicQueryName}($ids: [Int!]!) {
      delete_${dynamicQueryName}(where: { id: { _in: $ids } }) {
        affected_rows
      }
    }
  `
  const openDeleteConfirmation = (selectedRows) => {
    const selectedIds = selectedRows.map(row => {
      const keys = Object.keys(row.original)
      const name = row.original[keys[1]]
      return { id: row.original.id, name }
    })
    setDeleteId(selectedIds)
    setDeleteConfirmation(true)
  }
  const closeDeleteConfirmation = () => {
    setDeleteId(null)
    setDeleteConfirmation(false)
  }
  const [deleteData] = useMutation(DATA_ENTRIES_DELETE, {
    client
    // refetchQueries: [{ query: DATA_ENTRIES_QUERY }], // Refetch the data after deletion
  })
  const handleDeleteRows = (selectedRows) => {
    closeDeleteConfirmation()

    deleteData({
      variables: {
        ids: selectedRows
      }
    })
      .then((result) => {
        // Handle success
        const deletedIdsString = selectedRows.join(', ')

        toast.error(`Deletion was successful for IDs: ${deletedIdsString}`)

        setMetaNamespace((prevMetaNamespace) =>
          prevMetaNamespace.filter((item) => !selectedRows.includes(item.id))
        )
      })
      .catch(() => {
        toast.info('An error occurred during deletion')
      })
  }

  const status = ['active', 'inactive']

  const ColumnsMap = useMemo(
    () => {
      return [
        {
          accessorKey: 'id',
          header: 'ID',
          size: 80,
          enableEditing: false
        },
        {
          accessorKey: 'name',
          header: 'Name',
          size: 100
        },
        {
          accessorKey: 'map_sources',
          header: 'Source',
          size: 120,
          enableEditing: false
        },

        {
          accessorKey: 'map_status',
          header: 'Map Status',
          size: 80,
          editVariant: 'select',
          editSelectOptions: status
        },
        {
          accessorKey: '_created_when',
          header: 'Date Created',
          size: 100,
          enableEditing: false
        }
      ]
    },
    [status]
  )
  const toggleMapDrawer = (event, row) => {
    goToMappingPage()
    setSelectedCellId(row)
  }
  const { loading, data, refetch } = useMapData(client)
  useEffect(() => {
    if (loading) {
      setIsLoadingMap(true)
    } else if (data) {
      setIsLoadingMap(false)
      const formattedNamespaces = data.meta_map.flatMap(item => {
        return item.map_sources.map(source => ({
          map_sources: `${source.entity.subjectarea.namespace.name} > ${source.entity.subjectarea.name} > ${source.entity.name}`,
          id: item.id,
          name: item.name,
          map_status: item.map_status,
          _created_when: item._created_when
        }))
      })
      setTableData(formattedNamespaces.flat())
    }
  }, [loading, data])

  const handleEditModeMap = () => {
    setModeMapping((prevMode) => (prevMode === 'table' ? null : 'table'))
  }
  useEffect(() => {
    setIsApplyButtonEnabled(updatedCells.length > 0)
  }, [updatedCells])
  const isCellUpdatedMap = (rowIndex, columnId) => {
    return updatedCells.some(
      (updated) =>
        updated.rowIndex === rowIndex && updated.columnId === columnId
    )
  }
  const handleCellChangeMap = (cell, newValue) => {
    const rowIndex = cell.row.index
    const columnId = cell.column.id
    const updatedTabData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [columnId]: newValue }
      }
      return row
    })
    setTableData(updatedTabData)
    const cellIndexToUpdate = updatedCells.findIndex(
      (updated) =>
        updated.rowIndex === rowIndex && updated.columnId === columnId
    )

    if (cellIndexToUpdate !== -1) {
      updatedCells[cellIndexToUpdate] = { rowIndex, columnId, value: newValue }
    } else {
      updatedCells.push({ rowIndex, columnId, value: newValue })
    }

    setUpdatedCells([...updatedCells])
  }

  const handleApplyMapChanges = async () => {
    try {
      setIsApplyButtonEnabled(false)
      const latestUpdates = {}
      updatedCells.forEach(({ rowIndex, columnId, value }) => {
        latestUpdates[rowIndex] = { ...latestUpdates[rowIndex], [columnId]: value }
      })
      const updatedRows = Object.entries(latestUpdates).map(([index, row]) => {
        const rowIndex = parseInt(index, 10)
        return tableData[rowIndex]
      })
      const newObject = updatedRows.map((item) => {
        const [ns, sa, en] = item.map_sources.split(' > ')
        return {
          map_id: item.id,
          type: 'map',
          name: item.name,
          map_status: item.map_status,
          map_source: {
            source_entity: {
              ns,
              sa,
              en
            }
          },
          source_query: '.',
          source_filter: '.'
        }
      })
      const url = `${apiUrl}/meta/${namespace}/${subjectarea}/${entity}/create_map`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObject)
      })
      if (response.ok) {
        refetch()
        setIsApplyButtonEnabled(true)
        setModeMapping(false)
        toast.success('Execute Successfully')
      } else {
        throw new Error('Failed to update data')
      }
    } catch (error) {
      toast.warning(error.message)
    }
  }
  const handleDeleteRowsMap = (selectedRows) => {}

  const goToMappingPage = () => {
    router.push(`/data/${namespace}/${subjectarea}/${entity}/mapping?type=${type}`)
  }

  const fetchDqData = async (
    namespace,
    subjectarea,
    entity,
    setColumnsDq,
    setTableDqData,
    setIsLoadingDq
  ) => {
    if (namespace && subjectarea && entity) {
      try {
        const response = await fetch(
          `${apiUrl}/data/${namespace}/${subjectarea}/${entity}_dq`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const responseData = await response.json()
        const tableDqData = responseData.data || []
        const columnHeaders = responseData.header.fields
        const sanitizedHeaders = Object.keys(columnHeaders)
          .filter(headerKey => headerKey !== '_meta_association')
          .map(
            (headerKey) => ({
              accessorKey: headerKey,
              header: headerKey.replace(/_/g, ' '),
              size: Math.max(headerKey.length * 10, 250),
              ...(headerKey === 'id' && { size: 100, enableEditing: false })
            })
          )
        setColumnsDq(sanitizedHeaders)
        const formattedData = tableDqData.map((rowData) =>
          rowData.slice(0, -1).reduce((formattedRow, value, index) => { // Adjusted here
            const headerKey = sanitizedHeaders[index].accessorKey
            if (columnHeaders[headerKey] === 'BOOLEAN') {
              formattedRow[headerKey] = value ? 'true' : 'false'
            } else {
              formattedRow[headerKey] = value
            }
            return formattedRow
          }, {})
        )
        setTableDqData(formattedData)
      } catch (error) {
      } finally {
        setIsLoadingDq(false)
      }
    }
  }

  useEffect(() => {
    if (namespace && subjectarea && entity && type === 'staging') {
      fetchDqData(
        namespace,
        subjectarea,
        entity,
        setColumnsDq,
        setTableDqData,
        setIsLoadingDq
      )
    }
  }, [namespace, subjectarea, entity])

  return (
    <>
      <Head>
        <title>Metaware | {capitalizedEntity}</title>
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
        pageIcon={<DataIcon />}
        pageHeading={entity}
        customClass={`${openNamespace ? layoutStyle.dashSubMenuOpen : null} ${createMapModalOpen || createModalOpen || openPopup || popup === 'true' ? layoutStyle.dashSubMenuClose : null}`}
      >
        <div className={`${layoutStyle.dashHeaderBtm}`}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CardHeadingItem
                icon={<DataIcon />}
                title={subjectarea}
              />
            </Grid>
            <Grid item xs="auto">
              <BreadCrumbs {...links} />
            </Grid>
          </Grid>
        </div>
       {popup === 'true'
         ? <>
          <Stack className="sourceMapModalBody">
            <div className="tidBitOuterDiv">
              <div className={'tidBitTblDiv'}>
                <div className={'tidBitHdr tidBitDataHdr'}>
                  <Grid container alignItems="center" spacing={0}>
                    <Grid item xs>
                      <h3 className="headingColor">
                        Mapping Specifications
                      </h3>
                    </Grid>
                    <Grid item xs="auto">
                      <div className="tidBitHdrBtns">
                        <IconButton
                          aria-label="close"
                          onClick={goToMappingPage}
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
                    </Grid>
                  </Grid>
                </div>
                <div className="tidBitDataTblBody">
                  <div className={'commonTable commonDataHeightTable'}>
                    <MaterialReactTable
                      columns={columns}
                      data={tabData || []}
                      state={{ isLoading }}
                      enableRowSelection
                      autoResetPageIndex={false}
                      enableGlobalFilterModes
                      filterFns={{
                        myCustomFilterFn: (row, id, filterValue) => {
                          const cellValue = row.getValue(id)
                          if (
                            typeof cellValue === 'string' &&
                            typeof filterValue === 'string'
                          ) {
                            return cellValue.includes(filterValue)
                          }
                          return false
                        }
                      }}
                      globalFilterFn="myCustomFilterFn"
                      initialState={{
                        density: 'compact',
                        sorting: [
                          { id: 'id', desc: true }
                        ]
                      }}
                      enableGrouping
                      defaultColumn={{
                        maxSize: 400,
                        minSize: 100,
                        size: 240
                      }}
                      muiTableContainerProps={{ sx: { maxHeight: '650px' } }}
                      enableColumnResizing
                      enableColumnOrdering
                      enablePinning
                      enableStickyHeader
                      enableStickyFooter
                      enablePagination
                    />
                  </div>
                </div>
              </div>
            </div>
          </Stack>
         </>
         : <>
         {createModalOpen ||
              openPopup ||
              createMapModalOpen
           ? null
           : (
                  <>
        <Stack>
          <div className="dataGridTabs">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                    <Tab label="Data" {...a11yProps(0)} />

                    {type === 'model'
                      ? (<Tab label="Mapping" {...a11yProps(1)} />
                        )
                      : null}
                    {type === 'staging' && tableDqData.length > 0
                      ? (<Tab label="Dq" {...a11yProps(1)} />
                        )
                      : null};
                </Tabs>
              </Box>
              <CustomTabPanel
                value={value}
                index={0}
                className={`${type === 'model' || type === 'staging' ? '' : 'noMapOuter'}`}
              >
                <div
                  className={`commonTable commonHeightTable ${type === 'model' || type === 'staging' ? 'commonModalHeightTable' : ''} ${
                    createModalOpen ? 'hidden' : null
                  } ${openPopup ? 'hidden' : null}`}
                >
                  <MaterialReactTable
                    columns={columns}
                    data={tabData || []}
                    state={{ isLoading }}
                    enableRowSelection
                    enableGlobalFilterModes
                    filterFns={{
                      myCustomFilterFn: (row, id, filterValue) => {
                        const cellValue = row.getValue(id)
                        if (
                          typeof cellValue === 'string' &&
                          typeof filterValue === 'string'
                        ) {
                          return cellValue.includes(filterValue)
                        }
                        return false
                      }
                    }}
                    globalFilterFn="myCustomFilterFn"
                    initialState={{
                      density: 'compact',
                      sorting: [{ id: 'id', desc: true }],
                      columnVisibility: { id: false }
                    }}
                    editingMode={mode}
                    enableEditing
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
                          : 'inherit'
                      }
                    })}
                    enableGrouping
                    defaultColumn={{
                      maxSize: 400,
                      minSize: 100,
                      size: 240
                    }}
                    muiTableContainerProps={{ sx: { maxHeight: '650px' } }}
                    muiTableBodyCellProps={({ column }) => ({
                      ...(type !== 'model' && {
                        onClick: (event) => {
                          toggleDrawer(event, column.id)
                        },
                        sx: {
                          cursor: 'pointer'
                        }
                      })
                    })}
                    enableColumnResizing
                    enableColumnOrdering
                    enablePinning
                    enableStickyHeader
                    enableStickyFooter
                    enablePagination
                    autoResetPageIndex={false}
                    renderTopToolbarCustomActions={({ table }) => (
                      <Box sx={{ display: 'block', p: '0' }}>
                        <Tooltip title="Add Data">
                          <span>
                            <IconButton
                              color="primary"
                              onClick={() => setCreateModalOpen(true)}
                            >
                              <AddIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {mode
                          ? (
                          <Tooltip title="Apply Changes">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={handleApplyChanges}
                                disabled={
                                  !isApplyButtonEnabled || mode === 'null'
                                }
                              >
                                <SaveIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                            )
                          : null}
                        <Tooltip title={mode ? 'Revert' : 'Edit Mode'}>
                          <span>
                            <IconButton
                              onClick={handleEditMode}
                              color="primary"
                            >
                              {mode ? <RotateLeftRoundedIcon /> : <EditIcon />}
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete Selected">
                          <span>
                            <IconButton
                              disabled={
                                !table.getIsSomeRowsSelected() &&
                                !table.getIsAllRowsSelected()
                              }
                              onClick={() =>
                                openDeleteConfirmation(
                                  table.getSelectedRowModel().rows
                                )
                              }
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Export Data">
                          <span>
                            <IconButton
                              aria-controls="export-menu"
                              aria-haspopup="true"
                              onClick={handleClick}
                              color="primary"
                            >
                              <FileDownloadIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Menu
                          id="export-menu"
                          anchorEl={exportCsv}
                          keepMounted
                          open={Boolean(exportCsv)}
                          onClose={handleClose}
                        >
                          <MenuItem
                            onClick={handleExportData}
                            disabled={
                              table.getPrePaginationRowModel().rows.length === 0
                            }
                          >
                            Export All Data
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleExportRows(
                                table.getPrePaginationRowModel().rows
                              )
                            }
                            disabled={
                              table.getPrePaginationRowModel().rows.length === 0
                            }
                          >
                            Export All Rows
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleExportRows(table.getRowModel().rows)
                            }
                            disabled={table.getRowModel().rows.length === 0}
                          >
                            Export Page Rows
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleExportRows(table.getSelectedRowModel().rows)
                            }
                            disabled={
                              !table.getIsSomeRowsSelected() &&
                              !table.getIsAllRowsSelected()
                            }
                          >
                            Export Selected Rows
                          </MenuItem>
                        </Menu>
                      </Box>
                    )}
                  />
                </div>
              </CustomTabPanel>
              {type === 'model'
                ? (
                <CustomTabPanel value={value} index={1}>
                  <div
                    className={`commonTable ${type === 'model' ? 'commonModalHeightTable' : ''}`}
                  >
                    <MaterialReactTable
                      columns={ColumnsMap}
                      data={tableData}
                      state={{ isLoadingMap }}
                      enableRowSelection
                      enableGlobalFilterModes
                      filterFns={{
                        myCustomFilterFn: (row, id, filterValue) => {
                          const cellValue = row.getValue(id)
                          if (
                            typeof cellValue === 'string' &&
                            typeof filterValue === 'string'
                          ) {
                            return cellValue.includes(filterValue)
                          }
                          return false
                        }
                      }}
                      globalFilterFn="myCustomFilterFn"
                      initialState={{
                        density: 'compact',
                        sorting: [{ id: 'id', desc: true }],
                        columnVisibility: { id: false }
                      }}
                      editingMode={modeMapping}
                      enableEditing
                      muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                        onBlur: (event) => {
                          handleCellChangeMap(cell, event.target.value)
                        },
                        variant: 'outlined',
                        style: {
                          backgroundColor: isCellUpdatedMap(
                            cell.row.index,
                            cell.column.id
                          )
                            ? '#e6f2fb'
                            : 'inherit',
                          important: true
                        }
                      })}
                      muiTableBodyCellProps={({ column, row }) => ({
                        // this click is for mapping createsourece
                        onClick: (event) => {
                          if (event && column.id === 'name') {
                            toggleMapDrawer(event, row.original)
                          }
                        },
                        sx: {
                          cursor: 'pointer'
                        }
                      })}
                      enableGrouping
                      muiTableContainerProps={{ sx: { maxHeight: '650px' } }}
                      enableColumnResizing
                      enableColumnOrdering
                      enableStickyHeader
                      enableStickyFooter
                      enablePagination
                      autoResetPageIndex={false}
                      renderTopToolbarCustomActions={({ table }) => (
                        <Box sx={{ display: 'block', p: '0' }}>
                          <Tooltip title="Add Data">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={() => setCreateMapModalOpen(true)}
                              >
                                <AddIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          {modeMapping
                            ? (
                              <Tooltip title="Apply Changes">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={handleApplyMapChanges}
                                    disabled={!isApplyButtonEnabled ||
                                      modeMapping === 'null'}
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              )
                            : null}
                          <Tooltip title={modeMapping ? 'Revert' : 'Edit Mode'}>
                            <span>
                              <IconButton
                                onClick={handleEditModeMap}
                                color="primary"
                              >
                                {modeMapping
                                  ? (
                                    <RotateLeftRoundedIcon />
                                    )
                                  : (
                                    <EditIcon />
                                    )}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete Selected">
                            <span>
                              <IconButton
                                disabled={!table.getIsSomeRowsSelected() &&
                                  !table.getIsAllRowsSelected()}
                                onClick={() => openDeleteConfirmation(
                                  table.getSelectedRowModel().rows
                                )}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      )}
                    />
                  </div>
                </CustomTabPanel>
                  )
                : null}
                {type === 'staging' && tableDqData.length > 0
                  ? (
                <CustomTabPanel value={value} index={1}>
                  <div
                    className={`commonTable ${type === 'staging' ? 'commonModalHeightTable' : ''}`}
                  >
                    <MaterialReactTable
                      columns={columnsDq}
                      data={tableDqData}
                      state={{ isLoadingDq }}
                      enableRowSelection
                      enableGlobalFilterModes
                      filterFns={{
                        myCustomFilterFn: (row, id, filterValue) => {
                          const cellValue = row.getValue(id)
                          if (
                            typeof cellValue === 'string' &&
                            typeof filterValue === 'string'
                          ) {
                            return cellValue.includes(filterValue)
                          }
                          return false
                        }
                      }}
                      globalFilterFn="myCustomFilterFn"
                      initialState={{
                        density: 'compact',
                        sorting: [{ id: 'id', desc: true }],
                        columnVisibility: { id: false }
                      }}
                      enableGrouping
                      muiTableContainerProps={{ sx: { maxHeight: '650px' } }}
                      enableColumnResizing
                      enableColumnOrdering
                      enableStickyHeader
                      enableStickyFooter
                      enablePagination
                      autoResetPageIndex={false}
                    />
                  </div>
                </CustomTabPanel>
                    )
                  : null}
            </Box>
          </div>
        </Stack>
        </>
             )}
        <DeleteConfirmationDialog
          open={deleteConfirmation}
          onClose={closeDeleteConfirmation}
          handleClick={handleDeleteRows}
          id={deleteId}
        />
        <CreateNewRow
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          customClass={`${isActive ? 'pageViewPopupFull' : ''}`}
        />
        <Drawer
          anchor="right"
          open={drawerState}
          onClose={toggleDrawer}
        >
          <DrawerContent
            handleOpenPopup={handleOpenPopup}
            handleDrawerClick={toggleDrawer}
            namespace={namespace}
            subjectarea={subjectarea}
            entity={entity}
            columnId={selectedColumnId}
            enId={enId}
          />
        </Drawer>
        <ExpandedRuleEditor
          openPopup={openPopup}
          handleClosePopup={handleClosePopup}
          customClass={`${isActive ? 'pageViewPopupFull' : ''}`}
          namespace={namespace}
          subjectarea={subjectarea}
          entity={entity}
          columnId={selectedColumnId}
        />
        {type === 'model'
          ? (
          <>
            <CreateNewMapRow
              columns={columns}
              open={createMapModalOpen}
              onClose={() => setCreateMapModalOpen(false)}
              refetch={refetch}
              customClass={`${isActive ? 'pageViewPopupFull' : ''}`}
            />
            <DeleteConfirmationDialog
              open={deleteConfirmation}
              onClose={closeDeleteConfirmation}
              handleClick={handleDeleteRowsMap}
              id={deleteId}
            />
          </>
            )
          : (
              null
            )}</>}
      </MainCard>
    </>
  )
}

export default DashboardTable
