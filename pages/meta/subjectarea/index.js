import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { usePageContext } from '@/pageProvider/PageContext'
import {
  IconButton,
  Grid,
  Box,
  Tooltip
} from '@mui/material'
import { useMeta } from '@/Hooks/Meta'
import { Delete, Save as SaveIcon, Add as AddIcon, Edit as EditIcon, RotateLeftRounded as RotateLeftRoundedIcon, PlaylistAdd as AddVerticalIcon } from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteConfirmationDialog from '@/component/DeleteConfirmationDialog'
import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import MetaIcon from '@/component/Icons/IconMeta'

const MetaSubjectarea = () => {
  const router = useRouter()
  const { nsType, ns } = router.query

  const goToPrevPage = () => {
    router.push('/meta')
  }
  const { saNewRow, setsaNewRow, subjectareaData, setSubjectareaData, updatedCells, setUpdatedCells, RestURL } = usePageContext()
  const [modeSubjectarea, setModeSubjectarea] = useState(false)
  const [isApplyButtonEnabled, setIsApplyButtonEnabled] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { loading, data, refetch } = useMeta()
  const [subjectareaoptions, setSubjectAreaOptions] = useState([])
  useEffect(() => {
    if (loading) {
      setIsLoading(true)
    } else if (data && data.meta_namespace) {
      setIsLoading(false)
      const formattedNamespaces = data.meta_namespace.flatMap(namespace => {
        const namespaceNameType = `${namespace.type} > ${namespace.name}`
        if (nsType && ns) {
          if (namespaceNameType === `${nsType} > ${ns}`) {
            return namespace.subjectareas?.map(subjectarea => ({
              namespace: namespaceNameType,
              id: subjectarea.id,
              type: subjectarea.type,
              name: subjectarea.name
            })) || []
          } else {
            return []
          }
        } else {
          return namespace.subjectareas?.map(subjectarea => ({
            namespace: namespaceNameType,
            id: subjectarea?.id,
            type: subjectarea?.type,
            name: subjectarea?.name
          })) || []
        }
      })

      setSubjectareaData(formattedNamespaces)
      const options = data.meta_namespace.map(namespace => `${namespace.type} > ${namespace.name}`)
      setSubjectAreaOptions(options)
    }
  }, [loading, data, nsType, ns])

  useEffect(() => {
    if (saNewRow) {
      const existingIndex = subjectareaData.findIndex(row => row.id === saNewRow.id)
      if (existingIndex !== -1) {
        // Entry with the same ID already exists, update its values
        const updatedMeta = [...subjectareaData]
        updatedMeta[existingIndex] = saNewRow
        setSubjectareaData(updatedMeta)
      } else {
        // Entry with the same ID doesn't exist, add the new row
        setSubjectareaData([saNewRow, ...subjectareaData])
      }
      setIsApplyButtonEnabled(true)
      setModeSubjectarea(true)
    }
  }, [saNewRow])

  useEffect(() => {
    if (saNewRow && subjectareaData.length > 0) {
      const rowIndex = subjectareaData.findIndex(row => row.id === saNewRow.id)
      if (rowIndex !== -1) {
        const newRowIndex = updatedCells.length
        setUpdatedCells([
          ...updatedCells,
          { rowIndex: newRowIndex, columnId: 'id', value: saNewRow.id }
        ])
      }
    }
  }, [saNewRow, subjectareaData])

  const addNullFieldsToTable = () => {
    const existingNullFields = subjectareaData.some(
      (row) => row.type === '' || row.name === ''
    )

    if (existingNullFields) {
      toast.warning('Please save the previous null fields before adding more.')
      return
    }
    const updatedMeta = [
      { namespace: '', name: '', type: '', cross: 'client', id: new Date().getTime() },
      ...subjectareaData
    ]
    setSubjectareaData(updatedMeta)
    setModeSubjectarea(true)
  }

  const handleEditModeSubjectarea = () => {
    const existingNullFields = subjectareaData.some(
      (row) => row.type === '' || row.name === '' || row.namespace === ''
    )

    if (existingNullFields) {
      toast.warning('Please save the null entry before changing the mode.')
    } else {
      setModeSubjectarea((prevMode) => !prevMode)
    }
  }

  const ColumnsSubjectarea = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
        enableEditing: false
      },
      {
        accessorKey: 'namespace',
        header: 'Namespace',
        size: 150,
        editVariant: 'select',
        editSelectOptions: subjectareaoptions
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 150
      },
      {
        accessorKey: 'name',
        header: 'name',
        size: 150
      }
    ],
    [subjectareaoptions]
  )

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

  const handleCellChange = (cell, newValue) => {
    const rowIndex = cell.row.index
    const columnId = cell.column.id
    const updatedTabData = subjectareaData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [columnId]: newValue }
      }
      return row
    })
    setSubjectareaData(updatedTabData)
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

  const handleApplyChangesSubjectarea = async () => {
    try {
      setIsApplyButtonEnabled(false)
      const nullFields = subjectareaData.filter(
        (row) => row.type === '' || row.name === ''
      )
      if (nullFields.length > 0) {
        toast.warning('Please fill in all null fields before applying changes.')
        return
      }

      const latestUpdates = {}
      updatedCells.forEach(({ rowIndex, columnId, value }) => {
        latestUpdates[rowIndex] = { ...latestUpdates[rowIndex], [columnId]: value }
      })
      const updatedRows = Object.entries(latestUpdates).map(([index, row]) => {
        const rowIndex = parseInt(index, 10)
        return subjectareaData[rowIndex]
      })

      const newObject = updatedRows.map((item) => {
        const [type, ns] = item.namespace.split(' > ')
        return {
          ...(item.cross !== 'client' && { subjectarea_id: item.id }),
          name: item.name,
          type: item.type,
          ns,
          runtime: {},
          privilege: {},
          tags: {},
          custom_props: {}
        }
      })

      const url = `${RestURL}/mw/{ns}/create_sa`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObject)
      })
      if (response.ok) {
        refetch()
        setIsApplyButtonEnabled(false)
        setUpdatedCells([])
        setsaNewRow(null)
        setModeSubjectarea(false)
        toast.success('Execute Successfully')
      } else {
        throw new Error('Failed to update data')
      }
    } catch (error) {
      toast.warning(error.message)
      setModeSubjectarea(false)
      setIsApplyButtonEnabled(false)
      setUpdatedCells([])
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
      const item = subjectareaData.find(item => item.id === id)
      return item && item.cross !== 'client'
    })
    const validIds = selectedRows.filter(id => {
      const item = subjectareaData.find(item => item.id === id)
      return item && item.cross === 'client'
    })
    setSubjectareaData((prevMetaNamespace) => {
      const updatedMetaNamespace = prevMetaNamespace.filter((item) => !validIds.includes(item.id))
      setModeSubjectarea(false)
      return updatedMetaNamespace
    }
    )
    if (idsToSend.length === 0) {
      console.error('No valid IDs found in selectedRows')
      return
    }
    const requestBody = { ids: idsToSend }
    const url = `${RestURL}/mw/delete_sa`
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
        const deletedIdsString = subjectareaData
          .filter(en => idsToSend.includes(en.id))
          .map(en => en.name)
          .join(', ')
        setModeSubjectarea(false)
        toast.error(`Deletion was successful for ${deletedIdsString}`)
      }
      refetch()
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      toast.info('An error occurred during deletion')
    }
  }

  const goToInsertSubjectareaPage = () => {
    router.push('/meta/subjectarea/insert')
  }

  // eslint-disable-next-line no-lone-blocks
  { /* const goToMetaRuntimePage = () => {
    router.push('/meta/runtime')
  } */ }
  return (
    <>
      <Head>
        <title>Meta Subjectarea | Metaware</title>
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
            title="Subjectarea"
            onClick={() => {
              goToPrevPage()
              setsaNewRow(null)
            }}
          />
          <PopupBody
            isFullWidth="true"
          >
            <div className='sourceMapModalBody'>
              <div className='tidBitOuterDiv'>
                <Grid container sx={{ height: '100%' }}>
                  <Grid item xs={12}>
                    <div className={'tidBitTblDiv'}>
                      <div className={'commonTable commonMetaModalHeightTable'}>
                        <MaterialReactTable
                          columns={ColumnsSubjectarea}
                          data={subjectareaData}
                          state={{ isLoading }}
                          editingMode={modeSubjectarea ? 'table' : ''}
                          enableRowSelection
                          enableGlobalFilterModes
                          filterFns={{
                            myCustomFilterFn: (row, id, filterValue) => {
                              const cellValue = row.getValue(id)
                              if (typeof cellValue === 'string' && typeof filterValue === 'string') {
                                return cellValue.includes(filterValue)
                              }
                              return false
                            }
                          }}
                          globalFilterFn="myCustomFilterFn"
                          initialState={{
                            density: 'compact',
                            columnVisibility: { id: false },
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
                              backgroundColor: isCellUpdated(cell.row.index, cell.column.id) ? '#e6f2fb' : 'inherit',
                              important: true
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
                          muiTableBodyCellProps={({ column }) => ({
                            sx: {
                              cursor: 'pointer'
                            }
                          })}
                          renderTopToolbarCustomActions={({ table }) => (
                            <Box
                              sx={{ display: 'block', p: '0' }}
                            >
                              <Tooltip title="Add Data">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={goToInsertSubjectareaPage}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              {!modeSubjectarea
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
                              {modeSubjectarea
                                ? <Tooltip title="Apply Changes">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={handleApplyChangesSubjectarea}
                                    disabled={!isApplyButtonEnabled || modeSubjectarea === 'null'}
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                                : null}
                              <Tooltip title={modeSubjectarea ? 'Revert' : 'Edit Mode'}>
                                <span>
                                  <IconButton
                                    onClick={handleEditModeSubjectarea}
                                    color="primary"
                                  >
                                    {modeSubjectarea ? <RotateLeftRoundedIcon /> : <EditIcon />}
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Delete Selected">
                                <span>
                                  <IconButton
                                    disabled={
                                      !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                    }
                                    onClick={() => openDeleteConfirmation(table.getSelectedRowModel().rows)}
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

export default MetaSubjectarea
