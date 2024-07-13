import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { usePageContext } from '@/pageProvider/PageContext'
import PropTypes from 'prop-types'
import { useMeta } from '@/Hooks/Meta'
import {
  IconButton,
  Grid,
  Box,
  Tooltip,
  MenuItem
} from '@mui/material'
import { Delete, PlaylistAdd as AddVerticalIcon, Save as SaveIcon, Add as AddIcon, Edit as EditIcon, RotateLeftRounded as RotateLeftRoundedIcon } from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainCard from '@/component/MainCard'
import PopupOuter from '@/component/Popup/PopupOuter'
import PopupHeader from '@/component/Popup/PopupHeader'
import PopupBody from '@/component/Popup/PopupBody'
import MetaIcon from '@/component/Icons/IconMeta'
import DeleteConfirmationDialog from '@/component/DeleteConfirmationDialog'

const MetaEntity = () => {
  MetaEntity.propTypes = {
    cell: PropTypes.any
  }
  const router = useRouter()
  const { nsType, ns, sa } = router.query
  const goToPrevPage = () => {
    router.push('/meta')
  }
  const { enNewRow, entityData, setEntityData, updatedCells, setUpdatedCells, setenNewRow, RestURL } = usePageContext()
  const [modeEntity, setModeEntity] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isApplyButtonEnabled, setIsApplyButtonEnabled] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { loading, data, refetch } = useMeta()
  const [subjectareaoptions, setSubjectAreaOptions] = useState([])
  const [entityOptions, setEntityOptions] = useState([])

  const IsDeltaOptions = ['false', 'true']

  const ColumnsEntity = useMemo(
    () => {
      return [
        {
          accessorKey: 'id',
          header: 'ID',
          size: 100,
          enableEditing: false
        },
        {
          accessorKey: 'namespace',
          header: 'Namespace',
          size: 100,
          editVariant: 'select',
          editSelectOptions: subjectareaoptions
        },
        {
          accessorKey: 'subjectarea',
          header: 'Subjectarea',
          size: 100,
          muiTableBodyCellEditTextFieldProps: ({ row }) => ({
            select: true,
            children: data.meta_namespace.map((namespace) =>
              row.original.namespace === `${namespace.type} > ${namespace.name}`
                ? namespace.subjectareas?.map((subjectarea) => (
                  <MenuItem key={subjectarea.id} value={subjectarea.name}>
                    {subjectarea.name}
                  </MenuItem>
                ))
                : null
            )
          })
        },
        {
          accessorKey: 'name',
          header: 'Name',
          size: 100
        },
        {
          accessorKey: 'description',
          header: 'Description',
          size: 200
        },
        {
          accessorKey: 'type',
          header: 'Type',
          size: 100
        },
        {
          accessorKey: 'subtype',
          header: 'subtype',
          size: 100
        },
        {
          accessorKey: 'primary_grain',
          header: 'primary_grain',
          size: 180
        },
        {
          accessorKey: 'secondary_grain',
          header: 'secondary_grain',
          size: 180
        },
        {
          accessorKey: 'tertiary_grain',
          header: 'tertiary_grain',
          size: 180
        },
        {
          accessorKey: 'is_delta',
          header: 'Is delta',
          Cell: ({ cell }) => <span>{cell.getValue() ? 'true' : 'false'}</span>,
          size: 100,
          editVariant: 'select',
          editSelectOptions: IsDeltaOptions
        }
      ]
    },
    [subjectareaoptions, entityOptions, IsDeltaOptions]
  )

  useEffect(() => {
    if (loading) {
      setIsLoading(true)
    } else if (data && data.meta_namespace) {
      setIsLoading(false)
      const formattedNamespaces = data.meta_namespace.flatMap((namespace) => {
        const namespaceType = namespace.type
        const namespaceName = namespace.name
        const isMatchingNamespace =
          (namespaceType === nsType) && (namespaceName === ns)

        if (isMatchingNamespace || (!nsType && !ns && !sa)) {
          return (namespace.subjectareas || []).flatMap((subjectarea) => {
            const subjectareaName = subjectarea.name
            const isMatchingSubjectArea = !sa || subjectareaName === sa

            if (isMatchingSubjectArea) {
              return (subjectarea.entities || []).flatMap((entity) => ({
                namespace: `${namespaceType} > ${namespaceName}`,
                subjectarea: subjectareaName,
                id: entity.id,
                name: entity.name,
                description: entity.description,
                subtype: entity.subtype,
                type: entity.type,
                is_delta: entity.is_delta,
                primary_grain: entity.primary_grain,
                secondary_grain: entity.secondary_grain,
                tertiary_grain: entity.tertiary_grain
              })) || []
            } else {
              return []
            }
          })
        } else {
          return []
        }
      })
      setEntityData(formattedNamespaces)
      const options = data.meta_namespace.map(
        (namespace) => `${namespace.type} > ${namespace.name}`
      )
      setSubjectAreaOptions(options)
    }
  }, [loading, data, nsType, ns, sa])

  useEffect(() => {
    if (enNewRow) {
      const existingIndex = entityData.findIndex(row => row.id === enNewRow.id)
      if (existingIndex !== -1) {
        // Entry with the same ID already exists, update its values
        const updatedMeta = [...entityData]
        updatedMeta[existingIndex] = enNewRow
        setEntityData(updatedMeta)
      } else {
        // Entry with the same ID doesn't exist, add the new row
        setEntityData([enNewRow, ...entityData])
      }
      setIsApplyButtonEnabled(true)
      setModeEntity(true)
    }
  }, [enNewRow])

  useEffect(() => {
    if (enNewRow && entityData.length > 0) {
      const rowIndex = entityData.findIndex(row => row.id === enNewRow.id)
      if (rowIndex !== -1) {
        const newRowIndex = updatedCells.length
        setUpdatedCells([
          ...updatedCells,
          { rowIndex: newRowIndex, columnId: 'id', value: enNewRow.id }
        ])
      }
    }
  }, [enNewRow, entityData])

  useEffect(() => {
    if (data && data.meta_namespace && entityData.length > 0) {
      const rowSubOptions = entityData.map((entity) => {
        const currentNamespace = data.meta_namespace.find((namespace) => `${namespace.type} > ${namespace.name}` === entity.namespace)
        return currentNamespace ? currentNamespace.subjectareas?.map((subjectarea) => subjectarea.name) : []
      })
      setEntityOptions(rowSubOptions)
    }
  }, [entityData, data])

  const addNullFieldsToTable = () => {
    const existingNullFields = entityData.some(
      (row) => row.namespace === '' || row.name === '' || row.subjectarea === ''
    )
    if (existingNullFields) {
      toast.warning('Please save the previous null fields before adding more.')
      return
    }
    const updatedMeta = [
      { namespace: '', subjectarea: '', name: '', description: '', subtype: '.', cross: 'client', id: new Date().getTime() },
      ...entityData
    ]
    setEntityData(updatedMeta)
    setModeEntity(true)
  }

  const handleEditModeEntity = () => {
    const existingNullFields = entityData.some(
      (row) => row.type === '' || row.name === ''
    )

    if (existingNullFields) {
      toast.warning('Please save the null entry before changing the mode.')
    } else {
      setModeEntity((prevMode) => !prevMode)
    }
  }

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
    const updatedTabData = entityData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [columnId]: newValue }
      }
      return row
    })
    setEntityData(updatedTabData)
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

  const handleApplyChangesEntity = async () => {
    try {
      setIsApplyButtonEnabled(false)
      const nullFields = entityData.filter(
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
        return entityData[rowIndex]
      })

      const newObject = updatedRows.map((item) => {
        // eslint-disable-next-line no-unused-vars
        const [type, ns] = item.namespace.split(' > ')
        return {
          ...(item.cross !== 'client' && { entity_id: item.id }),
          name: item.name,
          description: item.description,
          type: item.type,
          subtype: item.subtype === null ? '.' : item.subtype,
          ns,
          sa: item.subjectarea,
          is_delta: Boolean(item.is_delta),
          tags: {},
          custom_props: {},
          ns_type: item.type,
          primary_grain: item.primary_grain,
          secondary_grain: item.secondary_grain,
          tertiary_grain: item.tertiary_grain
        }
      })

      const url = `${RestURL}/mw/{ns}/{sa}/create_en`
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
        setenNewRow(null)
        setModeEntity(false)
        toast.success('Execute Successfully')
      } else {
        throw new Error('Failed to update data')
      }
    } catch (error) {
      toast.warning(error.message)
      setModeEntity(false)
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
      const item = entityData.find(item => item.id === id)
      return item && item.cross !== 'client'
    })
    const validIds = selectedRows.filter(id => {
      const item = entityData.find(item => item.id === id)
      return item && item.cross === 'client'
    })
    setEntityData((prevMetaNamespace) => {
      const updatedMetaNamespace = prevMetaNamespace.filter((item) => !validIds.includes(item.id))
      setModeEntity(false)
      return updatedMetaNamespace
    }
    )
    if (idsToSend.length === 0) {
      console.error('No valid IDs found in selectedRows')
      return
    }
    const requestBody = { ids: idsToSend }
    const url = `${RestURL}/mw/delete_en`
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
        const deletedIdsString = entityData
          .filter(en => idsToSend.includes(en.id))
          .map(en => en.name)
          .join(', ')
        setModeEntity(false)
        toast.error(`Deletion was successful for ${deletedIdsString}`)
      }
      refetch()
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      toast.info('An error occurred during deletion')
    }
  }

  const goToInsertEntityPage = () => {
    router.push('/meta/entity/insert')
  }
  // eslint-disable-next-line no-lone-blocks
  { /* const goToMetaRuntimePage = () => {
    router.push('/meta/runtime')
  } */ }

  return (
    <>
      <Head>
        <title>Entity | Metaware</title>
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
            title="Entity"
            onClick={() => { goToPrevPage(); setenNewRow(null) }}
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
                          columns={ColumnsEntity}
                          data={entityData}
                          state={{ isLoading }}
                          editingMode={modeEntity ? 'table' : ''}
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
                            columnVisibility: { id: false, glossary: false, party: false },
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
                          muiTableBodyCellProps={({ column }) => ({
                            sx: {
                              cursor: 'pointer'
                            }
                          })}
                          muiTableContainerProps={{ sx: { maxHeight: '650px' } }}
                          enableColumnResizing
                          enableColumnOrdering
                          enableStickyHeader
                          enableStickyFooter
                          enablePagination
                          autoResetPageIndex={false}
                          renderTopToolbarCustomActions={({ table }) => (
                            <Box
                              sx={{ display: 'block', p: '0' }}
                            >
                              <Tooltip title="Add Vertical Data">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={goToInsertEntityPage}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              {!modeEntity
                                ? <Tooltip title="Add Horizontal Data">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={addNullFieldsToTable}
                                  >
                                    <AddVerticalIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                                : null}
                              {modeEntity
                                ? <Tooltip title="Apply Changes">
                                <span>
                                  <IconButton
                                    color="primary"
                                    onClick={handleApplyChangesEntity}
                                    disabled={!isApplyButtonEnabled || modeEntity === 'null'}
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                                : null}
                              <Tooltip title={modeEntity ? 'Revert' : 'Edit Mode'}>
                                <span>
                                  <IconButton
                                    onClick={handleEditModeEntity}
                                    color="primary"
                                  >
                                    {modeEntity ? <RotateLeftRoundedIcon /> : <EditIcon />}
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

export default MetaEntity
