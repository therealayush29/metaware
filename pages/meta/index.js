import React, { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { usePageContext } from '@/pageProvider/PageContext'
import PropTypes from 'prop-types'
import {
  Box,
  IconButton,
  Tooltip,
  MenuItem,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Button
} from '@mui/material'
import {
  Delete,
  PlayArrow as RunIcon,
  PlaylistAdd as AddVerticalIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  RotateLeftRounded as RotateLeftRoundedIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'
import MainCard from '@/component/MainCard'
import BreadCrumbs from '@/component/BreadCrumbs'
import MetaCardItem from '@/component/MetaCardItem'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CardHeadingItem from '@/component/CardHeading'
import MetaIcon from '@/component/Icons/IconMeta'
import NamespaceIcon from '@/public/icons/namespace.png'
import SubjectareaIcon from '@/public/icons/subjectarea.png'
import EntityIcon from '@/public/icons/entity.png'
import NamespacePurpleIcon from '@/public/icons/namespace_Purple.png'
import SubjectareaPurpleIcon from '@/public/icons/subjectarea_Purple.png'
import EntityPurpleIcon from '@/public/icons/entity_Purple.png'
import CreateAutoDetectMeta from '@/component/CreateAutoDetectMeta'
import DeleteConfirmationDialog from '@/component/DeleteConfirmationDialog'
import ArrowLeftIcon from '@/component/Icons/IconArrowLeft'
import ArrowRightIcon from '@/component/Icons/IconArrowRight'
import SelectSearch from 'react-select-search'
import 'react-select-search/style.css'
import { useEntries } from '@/Hooks/Entries'

import layoutStyle from '@/assets/css/layout.module.css'
import { useMetaEntity } from '@/Hooks/metaEntity'

export default function Meta () {
  Meta.propTypes = {
    cell: PropTypes.any
  }
  const url1 = '#'
  const links = {
    link: '/',
    nLink: url1,
    name: 'Dashboard',
    namespace: 'Meta'
  }
  const router = useRouter()
  const {
    RestURL,
    updatedCells,
    setUpdatedCells,
    isActive,
    theme,
    metaNspace,
    state,
    setState,
    metaNamespace,
    setMetaNamespace,
    metaNewRow,
    setMetaNewRow,
    selectedNamespace,
    setSelectedNamespace,
    selectedSubjectArea,
    setSelectedSubjectArea,
    assOption,
    setAssOption
  } = usePageContext()
  const [isDockerValue, setDockerValue] = useState(false)
  const handleDockerClick = () => {
    setDockerValue((prevState) => !prevState)
  }
  const [modeEntity, setModeEntity] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isApplyButtonEnabled, setIsApplyButtonEnabled] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [autoDetectMeta, setAutodetectMeta] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [namespaceOptions, setNamespaceOptions] = useState([])
  const { namespaceValue, nameSpaceType, subjectareaValue, entityValue, entityName } =
    state
  const entity = entityValue
  const subjectarea = subjectareaValue
  const namespace = namespaceValue
  const type = nameSpaceType
  const nullableOptions = ['false', 'true']
  const ColumnsMeta = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
        enableEditing: false
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 150
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 150
      },
      {
        accessorKey: 'subtype',
        header: 'Sub-Type',
        size: 150
      },
      {
        accessorKey: 'nullable',
        header: 'Nullable',
        size: 150,
        Cell: ({ cell }) => <span>{cell.getValue() ? 'true' : 'false'}</span>,
        editVariant: 'select',
        editSelectOptions: nullableOptions
      },
      {
        accessorKey: 'is_primary_grain',
        header: 'is_primary_grain',
        size: 150,
        Cell: ({ cell }) => <span>{cell.getValue() ? 'true' : 'false'}</span>,
        editVariant: 'select',
        editSelectOptions: nullableOptions
      },
      {
        accessorKey: 'is_secondary_grain',
        header: 'is_secondary_grain',
        size: 150,
        Cell: ({ cell }) => <span>{cell.getValue() ? 'true' : 'false'}</span>,
        editVariant: 'select',
        editSelectOptions: nullableOptions
      },
      {
        accessorKey: 'is_tertiary_grain',
        header: 'is_tertiary_grain',
        size: 150,
        Cell: ({ cell }) => <span>{cell.getValue() ? 'true' : 'false'}</span>,
        editVariant: 'select',
        editSelectOptions: nullableOptions
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 200
      },
      {
        accessorKey: 'alias',
        header: 'Alias',
        size: 200
      },
      {
        accessorKey: 'default',
        header: 'Default',
        size: 150
      },
      {
        accessorKey: 'is_unique',
        header: 'Is Unique',
        size: 150,
        Cell: ({ cell }) => <span>{cell.getValue() ? 'true' : 'false'}</span>,
        editVariant: 'select',
        editSelectOptions: nullableOptions
      },
      {
        accessorKey: 'order',
        header: 'Order',
        size: 100
      },
      {
        accessorKey: 'association',
        header: 'Association',
        size: 100,
        muiTableBodyCellEditTextFieldProps: ({ row }) => {
          const isAssociationId = row.original.subtype === 'association' && row.original.type === 'id'
          return {
            select: true,
            disabled: !isAssociationId,
            children: isAssociationId && assOption
              ? assOption?.map((assoc) => (
                  <MenuItem key={assoc?.id} value={assoc?.value}>
                    {assoc?.name}
                  </MenuItem>
              ))
              : null
          }
        }
      }
    ],
    [nullableOptions, assOption]
  )

  const {
    data: enData,
    // eslint-disable-next-line no-unused-vars
    loading: enLoading,
    // eslint-disable-next-line no-unused-vars
    error: enError
  } = useMetaEntity(entity)

  // eslint-disable-next-line no-unused-vars
  const { data, loading, error, refetch } = useEntries(
    entity
  )

  useEffect(() => {
    if (loading) {
      setIsLoading(true)
    } else if (data && data?.meta_meta) {
      setIsLoading(false)
      setMetaNamespace(data?.meta_meta)
    } else {
      setIsLoading(false)
    }
  }, [loading, data])

  useEffect(() => {
    if (metaNewRow) {
      const existingIndex = metaNamespace.findIndex(row => row.id === metaNewRow.id)
      if (existingIndex !== -1) {
        const updatedMeta = [...metaNamespace]
        updatedMeta[existingIndex] = metaNewRow
        setMetaNamespace(updatedMeta)
      } else {
        setMetaNamespace([metaNewRow, ...metaNamespace])
      }
      setIsApplyButtonEnabled(true)
      setModeEntity(true)
    }
  }, [metaNewRow])

  useEffect(() => {
    if (metaNewRow && metaNamespace.length > 0) {
      console.log('true', true)
      const rowIndex = metaNamespace.findIndex(
        (row) => row.id === metaNewRow.id
      )
      if (rowIndex !== -1) {
        const newRowIndex = updatedCells.length
        setUpdatedCells([
          ...updatedCells,
          { rowIndex: newRowIndex, columnId: 'id', value: metaNewRow.id }
        ])
      }
    }
  }, [metaNewRow, metaNamespace])

  useEffect(() => {
    if (metaNspace && metaNspace) {
      console.log('tru660e', true)
      const groupedNamespaceOptions = metaNspace.map((item) => ({
        type: 'group',
        name: item.type,
        id: item.id,
        items: [{ name: item.name, value: item.name }]
      }))
      setNamespaceOptions(groupedNamespaceOptions)
    }
  }, [metaNspace])

  useEffect(() => {
    // Find function logic
    const findFunction = () => {
      console.log('tru3e', true)
      if (metaNspace && namespaceValue && nameSpaceType) {
        const selectedNamespaceObj = metaNspace?.find(
          (ns) => ns.name === namespaceValue && ns.type === nameSpaceType
        )
        setSelectedNamespace(selectedNamespaceObj)

        if (
          selectedNamespaceObj &&
          (selectedNamespaceObj.name !== namespaceValue ||
            selectedNamespaceObj.type !== nameSpaceType)
        ) {
          setSelectedSubjectArea([])
        }
        if (selectedNamespaceObj) {
          const associationOpt = selectedNamespaceObj.subjectareas?.flatMap((sa) =>
            sa.entities && sa.entities.map((en) => {
              return {
                name: `${selectedNamespaceObj.name} > ${sa.name} > ${en.name}`,
                value: `${selectedNamespaceObj.name} > ${sa.name} > ${en.name}`,
                id: en.id
              }
            })
          ).filter(item => item !== null)

          setAssOption(associationOpt)
        }
      }
      if (selectedNamespace && subjectareaValue) {
        const selectedSubjectAreaObj = selectedNamespace?.subjectareas?.find(
          (area) => area.name === subjectareaValue
        )
        setSelectedSubjectArea(selectedSubjectAreaObj)
      }
    }
    // Call the find function
    findFunction()

    // Specify dependencies for the useEffect hook
  }, [metaNspace, namespaceValue, nameSpaceType, selectedNamespace, subjectareaValue])

  const addNullFieldsToTable = () => {
    const existingNullFields = metaNamespace.some(
      (row) => row.type === '' || row.name === ''
    )
    if (existingNullFields) {
      toast.warning('Please save the previous null fields before adding more.')
      return
    }
    const updatedMeta = [
      { type: '', name: '', cross: 'client', id: new Date().getTime() },
      ...metaNamespace
    ]
    setMetaNamespace(updatedMeta)
    setModeEntity(true)
  }
  const handleEditModeEntity = () => {
    const existingNullFields = metaNamespace.some(
      (row) => row.type === '' || row.name === ''
    )
    if (existingNullFields) {
      toast.warning('Please save the null entry before changing the mode.')
    } else {
      setModeEntity((prevMode) => !prevMode)
    }
  }

  const handleNamespaceChange = (newValue, groupName) => {
    setState((prevState) => ({
      ...prevState,
      namespaceValue: newValue,
      nameSpaceType: groupName
    }))
  }

  const handleSubjectareaChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      subjectareaValue: event.target.value
    }))
    const selectedSubjectAreaObj = selectedNamespace?.subjectareas?.find(
      (area) => area.name === event.target.value
    )
    setSelectedSubjectArea(selectedSubjectAreaObj)
  }
  const handleEntityChange = (event) => {
    const selectedEntity = selectedSubjectArea.entities?.find(
      (item) => item.id === event.target.value
    )
    setState((prevState) => ({
      ...prevState,
      entityValue: event.target.value,
      entityName: selectedEntity.name
    }))
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
    const updatedTabData = metaNamespace.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [columnId]: newValue }
      }
      return row
    })
    setMetaNamespace(updatedTabData)
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
      const nullFields = metaNamespace.filter(
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
        latestUpdates[rowIndex] = {
          ...latestUpdates[rowIndex],
          [columnId]: value
        }
      })
      const updatedRows = Object.entries(latestUpdates).map(([index, row]) => {
        const rowIndex = parseInt(index, 10)
        return metaNamespace[rowIndex]
      })
      const hasCrFlag = updatedRows.some(rows => rows.cross === 'client' || (rows.id.startsWith('mt') && !rows.association))
      if (hasCrFlag) {
        const newObject = {
          en_req: {
            type: enData.meta_entity[0].type,
            subtype:
              enData.meta_entity[0].subtype !== null
                ? enData.meta_entity[0].subtype
                : '.',
            name: enData.meta_entity[0].name,
            description: enData.meta_entity[0].description,
            ns: namespace,
            sa: subjectarea,
            is_delta: enData.meta_entity[0].is_delta,
            tags: {},
            custom_props: {},
            ns_type: type,
            entity_id: enData.meta_entity[0].id,
            primary_grain: enData.meta_entity[0].primary_grain,
            secondary_grain: enData.meta_entity[0].secondary_grain,
            tertiary_grain: enData.meta_entity[0].tertiary_grain
          },
          meta_reqs: updatedRows.map((item) => ({
            ...(item.cross !== 'client' && { meta_id: item.id }),
            ns: namespace,
            sa: subjectarea,
            en: entityName,
            name: item.name,
            type: item.type,
            subtype: item.subtype,
            description: item.description,
            order: parseInt(item.order),
            nullable: Boolean(item.nullable),
            alias: item.name,
            is_unique: Boolean(item.is_unique),
            is_primary_grain: Boolean(item.is_primary_grain),
            is_secondary_grain: Boolean(item.is_secondary_grain),
            is_tertiary_grain: Boolean(item.is_tertiary_grain)
          }))
        }

        const url = `${RestURL}/mw/${namespace}/${subjectarea}/${entityName}/create_meta`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newObject)
        })
        if (response.ok) {
          refetch()
          setMetaNewRow(null)
          setIsApplyButtonEnabled(true)
          setModeEntity(false)
          toast.success('Execute Successfully')
        } else {
          throw new Error('Failed to update data')
        }
      } else {
        const assoArray = updatedRows.map((item) => {
          const [ns, sa, en] = item.association.split(' > ')
          return {
            ...(item.cross !== 'client' && {
              ns: namespace,
              sa: subjectarea,
              en: entityName
            }),
            associated_ns: ns,
            associated_sa: sa,
            associated_en: en,
            meta: item.name,
            associated_meta: item.type,
            association_type_code: 'link'
          }
        }).find(() => true)
        const urlAsso = `${RestURL}/meta/${namespace}/${subjectarea}/${entityName}/create_meta_association`
        const response = await fetch(urlAsso, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assoArray)
        })
        if (response.ok) {
          refetch()
          setIsApplyButtonEnabled(false)
          setUpdatedCells([])
          setMetaNewRow(null)
          setModeEntity(false)
          toast.success('Execute Successfully')
        } else {
          throw new Error('Failed to update data')
        }
      }
    } catch (error) {
      setModeEntity(false)
      toast.warning(error.message)
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
    const idsToSend = selectedRows.filter((id) => {
      const item = metaNamespace.find((item) => item.id === id)
      return item && item.cross !== 'client'
    })
    const validIds = selectedRows.filter((id) => {
      const item = metaNamespace.find((item) => item.id === id)
      return item && item.cross === 'client'
    })
    setMetaNamespace((prevMetaNamespace) => {
      const updatedMetaNamespace = prevMetaNamespace.filter(
        (item) => !validIds.includes(item.id)
      )
      setModeEntity(false)
      return updatedMetaNamespace
    })
    if (idsToSend.length === 0) {
      console.error('No valid IDs found in selectedRows')
      return
    }
    const requestBody = { ids: idsToSend }
    const url = `${RestURL}/mw/delete_meta`
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
        const deletedIdsString = metaNamespace
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

  const goToInsertMetaPage = () => {
    router.push('/meta/insert')
  }

  const goToMetaRuntimePage = () => {
    router.push('/meta/runtime')
  }

  // eslint-disable-next-line no-lone-blocks
  { /* const goToEntityRelationshipPage = () => {
    router.push('/meta/entity-relationship')
  } */ }

  const goToNamespacePage = () => {
    router.push('/meta/namespace')
  }

  const goToSubjectareaPage = () => {
    let url = '/meta/subjectarea'
    if (namespace && type) {
      url += `?nsType=${type}&ns=${namespace}`
    }
    router.push(url)
  }

  const goToEntityPage = () => {
    let url = '/meta/entity'
    if (namespace && type && subjectarea) {
      url += `?nsType=${type}&ns=${namespace}&sa=${subjectarea}`
    }
    router.push(url)
  }

  const openCreateMeta = () => {
    setAutodetectMeta(true)
  }

  const closeCreateMeta = () => {
    setAutodetectMeta(false)
  }

  return (
    <>
      <Head>
        <title>Meta | Metaware</title>
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
        <div className={`${layoutStyle.dashHeaderBtm}`}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CardHeadingItem icon={<MetaIcon />} title="Meta" />
            </Grid>
            <Grid item xs="auto">
              <BreadCrumbs {...links} />
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={2}>
          {isDockerValue
            ? null
            : (
            <Grid item xs={3} lg={2}>
              <div className="metaSdbrList">
                <MetaCardItem
                  title="Namespace"
                  icon={
                    <Image
                      src={!theme ? NamespacePurpleIcon : NamespaceIcon}
                      width={320}
                      height={300}
                      alt="Namespace Icon"
                    />
                  }
                  onClick={goToNamespacePage}
                >
                  <div className="customForm metaSdbrFrm secondStep">
                    <Stack component="form" spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel id="namespace">Select Namespace</InputLabel>
                        <div
                          className={`selectDropDiv meta ${
                            namespaceValue !== '' ? 'selectedDropDiv' : null
                          }`}
                        >
                          <SelectSearch
                            options={namespaceOptions}
                            required
                            labelId="namespace"
                            id="namespace"
                            name="namespace"
                            label="Select Namespace"
                            placeholder="Select Namespace"
                            disabled={!namespaceOptions}
                            onChange={(newValue) => {
                              const group = namespaceOptions.find((option) =>
                                option.items.some(
                                  (item) => item.value === newValue
                                )
                              )
                              handleNamespaceChange(
                                newValue,
                                group ? group.name : null
                              )
                            }}
                            value={namespaceValue}
                          />
                        </div>
                      </FormControl>
                    </Stack>
                  </div>
                </MetaCardItem>
                <MetaCardItem
                  title="Subjectarea"
                  icon={
                    <Image
                      src={!theme ? SubjectareaPurpleIcon : SubjectareaIcon}
                      width={320}
                      height={300}
                      alt="Subjectarea Icon"
                    />
                  }
                  onClick={goToSubjectareaPage}
                >
                  <div className="customForm metaSdbrFrm thirdStep">
                    <Stack component="form" spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel id="entity">Select Subjectarea</InputLabel>
                        <Select
                          labelId="subjectarea"
                          id="subjectarea"
                          name="subjectarea"
                          label="Select Subjectarea"
                          placeholder="Select Subjectarea"
                          onChange={handleSubjectareaChange}
                          value={subjectareaValue}
                          disabled={!namespaceValue || !nameSpaceType}
                        >
                          {selectedNamespace &&
                            selectedNamespace.subjectareas?.map((item) => (
                              <MenuItem
                                disabled={!namespaceValue || !nameSpaceType}
                                key={item.id}
                                value={item.name}
                              >
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </div>
                </MetaCardItem>
                <MetaCardItem
                  title="Entity"
                  icon={
                    <Image
                      src={!theme ? EntityPurpleIcon : EntityIcon}
                      width={320}
                      height={300}
                      alt="Entity Icon"
                    />
                  }
                  onClick={goToEntityPage}
                >
                  <div className="customForm metaSdbrFrm fourthStep">
                    <Stack component="form" spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel id="entity">Select Entity</InputLabel>
                        <Select
                          labelId="entity"
                          id="entity"
                          name="entity"
                          label="Select Entity"
                          placeholder="Select Entity"
                          onChange={handleEntityChange}
                          value={entityValue}
                          disabled={!subjectareaValue}
                        >
                          {selectedSubjectArea &&
                            selectedSubjectArea.entities?.map((item) => (
                              <MenuItem
                                disabled={!subjectareaValue}
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </div>
                </MetaCardItem>
              </div>
            </Grid>
              )}
          <Grid item xs={isDockerValue ? 12 : 9} lg={isDockerValue ? 12 : 10}>
            <div className="srcMapMdlTopHdr mb-2">
              <Grid container spacing={2}>
                <Grid item xs>
                  <div className="srcMapMdlTopHdrTtl">
                    <div
                      className={`dockerBtn ${
                        isDockerValue ? 'active' : null
                      } ${isActive ? 'fullPageActive' : ''}`}
                    >
                      <IconButton onClick={handleDockerClick}>
                        {isDockerValue
                          ? (
                          <>
                            <ArrowRightIcon />
                          </>
                            )
                          : (
                          <>
                            <ArrowLeftIcon />
                          </>
                            )}
                      </IconButton>
                    </div>
                    <h3>
                      &nbsp;
                      <MetaIcon />{' '}
                      {entityName && entityName.length > 0 ? entityName : 'No Data'}
                    </h3>
                  </div>
                </Grid>
                {metaNamespace.length > 0
                  ? (
                  <Grid item xs="auto">
                    <div className="rstMta">
                      <Button
                        variant="contained"
                        onClick={() => {
                          setState([])
                          setMetaNamespace([])
                          setModeEntity(false)
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </Grid>
                    )
                  : null}
                {/* <Grid item xs="auto">
                  <div className="nkBtnDiv glowingButton">
                    <Button
                      variant="contained"
                      startIcon={<CombinationIcon />}
                      onClick={goToEntityRelationshipPage}
                    >
                      Entity Relationship
                    </Button>
                  </div>
                </Grid> */}
              </Grid>
            </div>
            <div className={'commonTable commonMetaHeightTable sixthStep'}>
              <MaterialReactTable
                columns={ColumnsMeta}
                data={metaNamespace}
                state={{ isLoading }}
                editingMode={modeEntity ? 'table' : ''}
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
                  columnVisibility: {
                    id: false
                  },
                  sorting: [{ id: 'id', desc: true }]
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
                enableGrouping
                muiTableContainerProps={{ sx: { maxHeight: '360px' } }}
                enablePagination={false}
                enableColumnResizing
                enableColumnOrdering
                enableStickyHeader
                enableStickyFooter
                autoResetPageIndex={false}
                muiTableBodyCellProps={({ column }) => ({
                  sx: {
                    cursor: 'pointer'
                  }
                })}
                renderTopToolbarCustomActions={({ table }) => (
                  <div className="fifthStep">
                    <Box sx={{ display: 'block', p: '0' }}>
                      <Tooltip title="Add Vertical Data">
                        <span>
                          <IconButton
                            color="primary"
                            onClick={goToInsertMetaPage}
                            disabled={
                              !metaNamespace ||
                              !namespaceValue ||
                              !nameSpaceType ||
                              !subjectareaValue ||
                              !entityValue
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      {!modeEntity
                        ? (
                        <Tooltip title="Add Horizontal Data">
                          <span>
                            <IconButton
                              color="primary"
                              onClick={addNullFieldsToTable}
                              disabled={
                                !metaNamespace ||
                                !namespaceValue ||
                                !nameSpaceType ||
                                !subjectareaValue ||
                                !entityValue
                              }
                            >
                              <AddVerticalIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                          )
                        : null}
                      {modeEntity
                        ? (
                        <Tooltip title="Apply Changes">
                          <span>
                            <IconButton
                              color="primary"
                              onClick={handleApplyChangesEntity}
                              disabled={
                                !isApplyButtonEnabled || modeEntity === 'null'
                              }
                            >
                              <SaveIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                          )
                        : null}
                      <Tooltip title={modeEntity ? 'Revert' : 'Edit Mode'}>
                        <span>
                          <IconButton
                            onClick={handleEditModeEntity}
                            color="primary"
                            disabled={
                              !metaNamespace ||
                              !namespaceValue ||
                              !nameSpaceType ||
                              !subjectareaValue ||
                              !entityValue
                            }
                          >
                            {modeEntity
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
                      {type === 'staging'
                        ? (
                        <Tooltip title="Runtime Options">
                          <span>
                            <IconButton
                              color="primary"
                              onClick={goToMetaRuntimePage}
                              disabled={!metaNamespace}
                            >
                              <RunIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                          )
                        : null}
                        <Tooltip title="upload file">
                        <span>
                          <IconButton
                            color="primary"
                            onClick={openCreateMeta}
                            disabled={
                              !metaNamespace ||
                              !namespaceValue ||
                              !nameSpaceType ||
                              !subjectareaValue ||
                              !entityValue
                            }
                          >
                            <UploadFileIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </div>
                )}
              />
            </div>
          </Grid>
        </Grid>
        <DeleteConfirmationDialog
          open={deleteConfirmation}
          onClose={closeDeleteConfirmation}
          handleClick={handleDeleteRows}
          id={deleteId}
        />
        <CreateAutoDetectMeta
        open={autoDetectMeta}
        onClose={closeCreateMeta}
        namespace={namespace}
        subjectarea={subjectarea}
        entity={entityName}
        RestURL={RestURL}
        />
      </MainCard>
    </>
  )
}
