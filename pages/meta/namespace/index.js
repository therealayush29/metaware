import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { usePageContext } from '@/pageProvider/PageContext'
import { useMeta } from '@/Hooks/Meta'
import {
  IconButton,
  Grid,
  Box,
  Tooltip
} from '@mui/material'
import {
  Delete,
  Save as SaveIcon,
  PlaylistAdd as AddVerticalIcon,
  Add as AddIcon,
  Edit as EditIcon,
  RotateLeftRounded as RotateLeftRoundedIcon
} from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import DeleteConfirmationDialog from '@/component/DeleteConfirmationDialog'
import MetaIcon from '@/component/Icons/IconMeta'

const MetaNamespace = () => {
  const router = useRouter()

  const goToPrevPage = () => {
    router.push('/meta')
  }
  const [mode, setMode] = useState(false)
  const [isApplyButtonEnabled, setIsApplyButtonEnabled] = useState(false)
  const [namespaceType, setNamespaceType] = useState([])
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { RestURL, nsNewRow, metaNspace, namSpaceMeta, setNamSpaceMeta, updatedCells, setUpdatedCells, setNsNewRow } = usePageContext()

  const { loading, data, refetch } = useMeta()

  useEffect(() => {
    if (loading) {
      setIsLoading(true)
    } else if (data && data.meta_namespace) {
      setIsLoading(false)
      setNamSpaceMeta(data.meta_namespace)
    }
  }, [loading, data])

  const ColumnsNamespace = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
        enableEditing: false
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 150,
        editVariant: 'select',
        editSelectOptions: namespaceType
      },
      {
        accessorKey: 'name',
        header: 'Namespace',
        size: 150
      }
    ],
    [namespaceType]
  )

  const addNullFieldsToTable = () => {
    const existingNullFields = namSpaceMeta.some(
      (row) => row.type === '' || row.name === ''
    )
    if (existingNullFields) {
      toast.warning('Please save the previous null fields before adding more.')
      return
    }
    const updatedMeta = [
      { type: '', name: '', cross: 'client', id: new Date().getTime() }, ...namSpaceMeta
    ]
    setNamSpaceMeta(updatedMeta)
    setMode(true)
  }

  const handleEditMode = () => {
    const existingNullFields = namSpaceMeta.some(
      (row) => row.type === '' || row.name === ''
    )
    if (existingNullFields) {
      toast.warning('Please save the null entry before changing the mode.')
    } else {
      setMode((prevMode) => !prevMode)
    }
  }
  useEffect(() => {
    if (metaNspace) {
      const uniqueTypes = new Set(metaNspace.map(item => item.type))
      const namespaceOption = Array.from(uniqueTypes)
      setNamespaceType(namespaceOption)
    }
  }, [metaNspace])

  const isCellUpdated = (rowIndex, columnId) => {
    const cellIsUpdated = updatedCells.some(
      (updatedCell) =>
        updatedCell.rowIndex === rowIndex && updatedCell.columnId === columnId
    )
    if (cellIsUpdated) {
      setIsApplyButtonEnabled(true)
    }
    return cellIsUpdated
  }

  useEffect(() => {
    if (nsNewRow) {
      const existingIndex = namSpaceMeta.findIndex(row => row.id === nsNewRow.id)
      if (existingIndex !== -1) {
        // Entry with the same ID already exists, update its values
        const updatedMeta = [...namSpaceMeta]
        updatedMeta[existingIndex] = nsNewRow
        setNamSpaceMeta(updatedMeta)
      } else {
        // Entry with the same ID doesn't exist, add the new row
        setNamSpaceMeta([nsNewRow, ...namSpaceMeta])
      }
      setIsApplyButtonEnabled(true)
      setMode(true)
    }
  }, [nsNewRow])

  useEffect(() => {
    if (nsNewRow && namSpaceMeta.length > 0) {
      // Find the index of nsNewRow in the updated namSpaceMeta
      const rowIndex = namSpaceMeta.findIndex(row => row.id === nsNewRow.id)
      if (rowIndex !== -1) {
        const newRowIndex = updatedCells.length
        setUpdatedCells([
          ...updatedCells,
          { rowIndex: newRowIndex, columnId: 'id', value: nsNewRow.id }
        ])
      }
    }
  }, [nsNewRow, namSpaceMeta])

  const handleCellChange = (cell, newValue) => {
    const rowIndex = cell.row.index
    const columnId = cell.column.id
    const updatedTabData = namSpaceMeta.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [columnId]: newValue }
      }
      return row
    })
    setNamSpaceMeta(updatedTabData)
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
  const handleApplyChangesNamespace = async () => {
    try {
      setIsApplyButtonEnabled(false)
      const nullFields = namSpaceMeta.filter(
        (row) => row.type === '' || row.name === ''
      )
      if (nullFields.length > 0) {
        toast.warning(
          'Please fill in all null fields before applying changes.'
        )
        return
      }
      const latestUpdates = {}
      updatedCells.forEach(({ rowIndex, columnId, value }) => {
        latestUpdates[rowIndex] = { ...latestUpdates[rowIndex], [columnId]: value }
      })
      const updatedRows = Object.entries(latestUpdates).map(([index, row]) => {
        const rowIndex = parseInt(index, 10)
        return namSpaceMeta[rowIndex]
      })
      const newObject = updatedRows.map((item) => ({
        ...(item.cross !== 'client' && { namespace_id: item.id }),
        name: item.name,
        type: item.type,
        runtime: {},
        privilege: {},
        tags: {},
        custom_props: {}
      }))
      const url = `${RestURL}/mw/create_ns`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObject)
      })
      if (response.ok) {
        refetch()
        setMode(false)
        setIsApplyButtonEnabled(false)
        setNsNewRow(null)
        setUpdatedCells([])
        toast.success('Execute Successfully')
      } else {
        throw new Error('Failed to update data')
      }
    } catch (error) {
      setMode(false)
      setIsApplyButtonEnabled(false)
      setUpdatedCells([])
      toast.warning(error.message)
    }
  }
  const openDeleteConfirmation = (selectedRows) => {
    const selectedIds = selectedRows.map(row => ({ id: row.original.id, name: row.original.name }))
    setDeleteId(selectedIds)
    setDeleteConfirmation(true)
  }
  const closeDeleteConfirmation = () => {
    setDeleteId([])
    setDeleteConfirmation(false)
  }

  const handleDeleteRows = async (selectedRows) => {
    closeDeleteConfirmation()
    const idsToSend = selectedRows.filter(id => {
      const item = namSpaceMeta.find(item => item.id === id)
      return item && item.cross !== 'client'
    })
    const validIds = selectedRows.filter(id => {
      const item = namSpaceMeta.find(item => item.id === id)
      return item && item.cross === 'client'
    })
    setNamSpaceMeta((prevMetaNamespace) => {
      const updatedMetaNamespace = prevMetaNamespace.filter((item) => !validIds.includes(item.id))
      setMode(false)
      return updatedMetaNamespace
    })
    const requestBody = { ids: idsToSend }
    const url = `${RestURL}/mw/delete_ns`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const hasZeroIdDeleted = validIds.length > 0

      if (!hasZeroIdDeleted) {
        const deletedIdsString = namSpaceMeta
          .filter(en => idsToSend.includes(en.id))
          .map(en => en.name)
          .join(', ')
        setMode(false)
        toast.error(`Deletion was successful for ${deletedIdsString}`)
      }
      refetch()
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      toast.info('An error occurred during deletion')
    }
  }

  const goToInsertNamespacePage = () => {
    router.push('/meta/namespace/insert')
  }
  // eslint-disable-next-line no-lone-blocks
  { /* const goToMetaRuntimePage = () => {
    router.push('/meta/runtime')
  } */ }

  return (
    <>
      <Head>
        <title>Meta-Namesapace | Metaware</title>
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
          isTableDesign="true"
        >
          <PopupHeader
            title="Namespace"
            onClick={() => {
              goToPrevPage()
              setNsNewRow(null)
            }}
          />
          <PopupBody
            isFullWidth="true"
          >
            <div className="sourceMapModalBody">
              <div className="tidBitOuterDiv">
                <Grid container sx={{ height: '100%' }}>
                  <Grid item xs={12}>
                    <div className={'tidBitTblDiv'}>
                      <div
                        className={'commonTable commonActionTable commonMetaModalHeightTable'}
                      >
                        <MaterialReactTable
                          columns={ColumnsNamespace}
                          data={namSpaceMeta}
                          state={{ isLoading }}
                          enableRowSelection
                          editingMode={mode ? 'table' : ''}
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
                            columnVisibility: { id: false, source: false },
                            sorting: [
                              { id: 'id', desc: true }
                            ]
                          }}
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
                                : 'inherit',
                              important: true
                            }
                          })}
                          muiTableBodyCellProps={({ column }) => ({
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
                                    onClick={goToInsertNamespacePage}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              {!mode
                                ? <Tooltip title="Add Horizontal Row">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={() => addNullFieldsToTable()}
                                  >
                                    <AddVerticalIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                                : null}
                              <Tooltip title={mode ? 'Revert' : 'Edit Mode'}>
                                <span>
                                  <IconButton
                                    onClick={handleEditMode}
                                    color="primary"
                                  >
                                    {mode
                                      ? (
                                      <RotateLeftRoundedIcon />
                                        )
                                      : (
                                      <EditIcon />
                                        )}
                                  </IconButton>
                                </span>
                              </Tooltip>
                              {mode
                                ? <Tooltip title="Apply Changes">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={handleApplyChangesNamespace}
                                    disabled={!isApplyButtonEnabled}
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                                : null }
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
                            </Box>
                          )}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </PopupBody>
        </PopupOuter>
        <DeleteConfirmationDialog
          open={deleteConfirmation}
          onClose={closeDeleteConfirmation}
          handleClick={handleDeleteRows}
          id={deleteId}
        />
      </MainCard>
    </>
  )
}

export default MetaNamespace
