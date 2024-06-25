import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  FormControl,
  FormControlLabel,
  Grid,
  Box,
  IconButton,
  Checkbox,
  Avatar,
  Skeleton,
  FormLabel
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'

import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'

import GlossaryIcon from '@/component/Icons/IconGlossary'
import SearchIcon from '@/component/Icons/IconSearch'
import MetaIcon from '@/component/Icons/IconMeta'
import EntityIcon from '../../component/Icons/IconEntity'

import layoutStyle from '@/assets/css/layout.module.css'
import { createApolloClient } from '@/client/apollo-client'
import SearchMetaDetail from '@/component/SearchMetaDetail'
import SearchEntityDetail from '@/component/SearchEntityDetail'
import { ENTITYSEARCHRESULT } from '../../GraphQl/queries'
import PropTypes from 'prop-types'

export default function GlossarySearchResults ({ data, loading }) {
  GlossarySearchResults.propTypes = {
    data: PropTypes.Array,
    loading: PropTypes.bool
  }
  const router = useRouter()
  const { query } = router
  const queryString = query.query
  const [checkAll, setAllCheck] = useState(true)
  const [checkEntity, setEntityCheck] = useState(false)
  const [checkMeta, setMetaCheck] = useState(false)
  const [checkType, setTypeCheck] = useState(false)
  const [checkTags, setTagsCheck] = useState(false)
  const [openMetaDetail, setOpenMetaDetail] = useState(false)
  const [openEntityDetail, setOpenEntityDetail] = useState(false)
  const [openEntityNewDetail, setOpenEntityNewDetail] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [detailArr, setDetailArr] = useState([])
  const [activeCardId, setActiveCardId] = useState(null)

  const goToSearchPage = () => {
    router.push('/glossary/search')
  }

  const handleMetaDetailclick = (id, name) => {
    const DetailValue = [
      { id, name }
    ]
    setDetailArr(DetailValue)
    setOpenMetaDetail(true)
  }
  { /* const handleEntityDetailclick = (id, name) => {
    const DetailValue = [
      { id, name }
    ]
    setDetailArr(DetailValue)
    setOpenEntityDetail(true)
  } */ }

  const handleEntityDetailNewClick = (id) => {
    if (activeCardId === id) {
      setOpenEntityNewDetail(!openEntityNewDetail)
    } else {
      setActiveCardId(id)
      setOpenEntityNewDetail(true)
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 120
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 120
      }
    ],
    []
  )

  const handleAllCheckChange = (event) => {
    const isChecked = event.target.checked
    setAllCheck(isChecked)
    if (isChecked) {
      setEntityCheck(false)
      setMetaCheck(false)
      setTypeCheck(false)
      setTagsCheck(false)
    }
  }

  const handleEntityCheckChange = (event) => {
    const isChecked = event.target.checked
    setEntityCheck(isChecked)
    if (!isChecked && !checkMeta && !checkTags && !checkType) {
      setAllCheck(true)
    } else if (isChecked && checkMeta && checkTags && checkType) {
      setAllCheck(false)
    } else {
      setAllCheck(false)
    }
  }

  const handleMetaCheckChange = (event) => {
    const isChecked = event.target.checked
    setMetaCheck(isChecked)
    if (!isChecked && !checkEntity && !checkTags && !checkType) {
      setAllCheck(true)
    } else if (isChecked && checkEntity && checkTags && checkType) {
      setAllCheck(false)
    } else {
      setAllCheck(false)
    }
  }

  const handleTypeCheckChange = (event) => {
    const isChecked = event.target.checked
    setTypeCheck(isChecked)
    if (!isChecked && !checkEntity && !checkMeta && !checkTags) {
      setAllCheck(true)
    } else if (isChecked && checkEntity && checkMeta && checkTags) {
      setAllCheck(false)
    } else {
      setAllCheck(false)
    }
  }

  const handleTagsCheckChange = (event) => {
    const isChecked = event.target.checked
    setTagsCheck(isChecked)
    if (!isChecked && !checkEntity && !checkMeta && !checkType) {
      setAllCheck(true)
    } else if (isChecked && checkEntity && checkMeta && checkType) {
      setAllCheck(false)
    } else {
      setAllCheck(false)
    }
  }

  // eslint-disable-next-line camelcase
  const { meta_namespace } = data ?? {}

  const entitiesAndMeta = useMemo(() => {
    // eslint-disable-next-line camelcase
    if (!meta_namespace) return []

    // eslint-disable-next-line camelcase
    return meta_namespace.flatMap((ns) => {
      const namespace = ns.name
      return ns.subjectareas.flatMap((sa) => {
        const subjectarea = sa.name
        return (sa.entities ?? []).map(entity => ({
          ...entity,
          namespace,
          subjectarea
        })).concat(sa.meta ?? [])
      })
    })
  // eslint-disable-next-line camelcase
  }, [meta_namespace])
  let entityData = []
  entityData = entitiesAndMeta.filter((metaId) =>
    metaId.id === activeCardId)
    .flatMap((meta) =>
      meta.meta)

  useEffect(() => {
    if (!query || !entitiesAndMeta.length) {
      setSearchResults([])
      return
    }

    let filteredResults = []

    filteredResults = entitiesAndMeta.filter((item) => {
      if (checkEntity) {
        return item.name?.includes(queryString)
      } else if (checkMeta) {
        return item.meta.map((me) => me.name?.includes(queryString))
      } else if (checkTags) {
        return item.tags?.includes(queryString)
      } else if (checkTags) {
        return item.meta.map((me) => me.tags?.includes(queryString))
      } else if (checkType) {
        return item.type?.includes(queryString)
      } else if (checkType) {
        return item.meta.map((me) => me.type?.includes(queryString))
      } else {
        // If none of the checkboxes are checked, use default logic
        return item.name?.includes(queryString) || item.meta.map((me) => me.tags?.includes(queryString)) || item.meta.map((me) => me.type?.includes(queryString)) || item.meta.map((me) => me.name?.includes(queryString)) || item.type?.includes(queryString) || item.tags?.includes(queryString)
      }
    })
    setSearchResults(filteredResults)
  }, [query, entitiesAndMeta, checkEntity, checkMeta, checkTags, checkType])

  return (
    <>
      <Head>
        <title>Glossary Search Results | Metaware</title>
      </Head>
      <MainCard
        activeMenu="Glossary New"
        pageIcon={<GlossaryIcon />}
        pageHeading="Glossary"
      >
         {!openMetaDetail && !openEntityDetail
           ? (
            <>
              <div className={`${layoutStyle.dashHeaderBtm}`}>
                <Grid container spacing={2}>
                  <Grid item xs>
                    <CardHeadingItem
                      icon={<SearchIcon />}
                      title={`${queryString ? `${queryString} Search Results` : 'Search Results'}`}
                    />
                  </Grid>
                  <Grid item xs="auto">
                    <IconButton
                      aria-label="close"
                      onClick={goToSearchPage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 4,
                        color: (theme) => theme.palette.grey[500]
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
              <div className={`${layoutStyle.srchResultBlock}`}>
                <Grid container spacing={2}>
                  <Grid item xs="auto">
                    <div className={`${layoutStyle.srchRsltFltrCol}`}>
                      <div className={`${layoutStyle.srchRsltFltrHdng}`}>
                        <h4>Filter by</h4>
                      </div>
                      <div className={`${layoutStyle.srchRsltFltrWdgt}`}>
                        <FormControl fullWidth>
                          <FormControlLabel
                            label='All'
                            control={
                              <Checkbox
                                checked={checkAll}
                                onChange={handleAllCheckChange}
                                color="primary"
                                value={checkAll}
                                disabled={(!checkEntity && !checkMeta && !checkTags && !checkType) || (!checkEntity || !checkMeta || !checkTags || !checkType) || (checkEntity && checkMeta && checkTags && checkType)}
                              />
                            }
                          />
                        </FormControl>
                        <div className='filtrGrp'>
                            <h4>Name</h4>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='entity'
                              control={
                                <Checkbox
                                  onChange={handleEntityCheckChange}
                                  color="primary"
                                  value={checkEntity}
                                />
                              }
                            />
                          </FormControl>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='meta'
                              control={
                                <Checkbox
                                  onChange={handleMetaCheckChange}
                                  color="primary"
                                  value={checkMeta}
                                />
                              }
                            />
                          </FormControl>
                        </div>
                        <div className='filtrGrp'>
                            <h4>Type</h4>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='model'
                              control={
                                <Checkbox
                                  onChange={handleTypeCheckChange}
                                  color="primary"
                                  value={checkType}
                                />
                              }
                            />
                          </FormControl>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='staging'
                              control={
                                <Checkbox
                                  onChange={handleTypeCheckChange}
                                  color="primary"
                                  value={checkType}
                                />
                              }
                            />
                          </FormControl>
                        </div>
                        <div className='filtrGrp'>
                            <h4>Tags</h4>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='black'
                              control={
                                <Checkbox
                                  onChange={handleTagsCheckChange}
                                  color="primary"
                                  value={checkTags}
                                />
                              }
                            />
                          </FormControl>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='yellow'
                              control={
                                <Checkbox
                                  onChange={handleTagsCheckChange}
                                  color="primary"
                                  value={checkTags}
                                />
                              }
                            />
                          </FormControl>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='Blue'
                              control={
                                <Checkbox
                                  onChange={handleTagsCheckChange}
                                  color="primary"
                                  value={checkTags}
                                />
                              }
                            />
                          </FormControl>
                          <FormControl fullWidth>
                            <FormControlLabel
                              label='green'
                              control={
                                <Checkbox
                                  onChange={handleTagsCheckChange}
                                  color="primary"
                                  value={checkTags}
                                />
                              }
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs>
                    <div className={`${layoutStyle.srchResultList}`}>
                      {searchResults.length === 0 && loading && (
                        <>
                          {[...Array(10)].map((_, index) => (
                            <div className={`${layoutStyle.srchResultCol}`} key={index}>
                              <div className={`${layoutStyle.srchRsltIcon}`}>
                                <i>
                                  <Skeleton variant="circular" width={60} height={60}>
                                    <Avatar />
                                  </Skeleton>
                                </i>
                              </div>
                              <div className={`${layoutStyle.srchRsltInfo}`}>
                                <h3 style={{ width: '100px' }}>
                                  <Skeleton />
                                </h3>
                                <p style={{ width: '400px' }}>
                                  <Skeleton />
                                </p>
                                <h6 style={{ width: '300px' }}>
                                  <Skeleton />
                                </h6>
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {searchResults.length > 0 && (
                        <>
                          {searchResults
                            .filter(entity =>
                              ((checkEntity || checkAll) && entity.name?.includes(queryString)) ||
                              ((checkTags || checkAll) && entity.tags?.includes(queryString)) ||
                              ((checkType || checkAll) && entity.type?.includes(queryString)))
                            .map(result => (
                              <div key={result.id} className={`${layoutStyle.srchResultCol} ${openEntityNewDetail && activeCardId === result.id ? layoutStyle.active : ''}`} onClick={() => handleEntityDetailNewClick(result.id)}>
                                <div className={`${layoutStyle.srchRsltIcon}`}>
                                  <i>{<EntityIcon />}</i>
                                </div>
                                <div className={`${layoutStyle.srchRsltInfo}`}>
                                  <h3>{result.name}</h3>
                                  <p>{result.description}</p>
                                  <h6><span>Type:</span> {`${result.namespace} > ${result.subjectarea} > ${result.name}`}</h6>
                                </div>
                              </div>
                            ))}
                          {searchResults.flatMap((sa) => {
                            const entity = sa.name
                            const subjectarea = sa.subjectarea
                            const namespace = sa.namespace
                            return sa.meta
                              ?.filter(meta =>
                                ((checkMeta || checkAll) && meta.name?.includes(queryString)) ||
                                ((checkTags || checkAll) && meta.tags?.includes(queryString)) ||
                                ((checkType || checkAll) && meta.type?.includes(queryString)))
                              .map((result) => (
                                <div key={result.id} className={`${layoutStyle.srchResultCol}`} onClick={() => handleMetaDetailclick(result.id, result.name)}>
                                  <div className={`${layoutStyle.srchRsltIcon}`}>
                                    <i>{<MetaIcon />}</i>
                                  </div>
                                  <div className={`${layoutStyle.srchRsltInfo}`}>
                                    <h3>{result.name}</h3>
                                    <p>{result.description}</p>
                                    <h6><span>Type:</span> {`${namespace} > ${subjectarea} > ${entity} > ${result.name}`}</h6>
                                  </div>
                                </div>
                              ))
                          })}
                          {searchResults.filter(entity =>
                            ((checkEntity || checkAll) && entity.name?.includes(queryString)) ||
                          ((checkTags || checkAll) && entity.tags?.includes(queryString)) ||
                          ((checkType || checkAll) && entity.type?.includes(queryString))).length === 0 &&
                            searchResults.flatMap((sa) => sa.meta)
                              .filter(meta => meta?.name.includes(queryString)).length === 0 && (
                              <div>No results found.</div>
                          )}
                        </>
                      )}
                      {searchResults.length === 0 && !loading && (
                        <div>No results found.</div>
                      )}
                    </div>
                  </Grid>
                  {openEntityNewDetail
                    ? (
                    <Grid item xs="auto">
                      <div className='srchRsltEntityCol'>
                        <div className='srchRsltEntityHdng'>
                          <h4>party</h4>
                          <IconButton
                            aria-label="close"
                            onClick={() => setOpenEntityNewDetail(!openEntityNewDetail)}
                            sx={{
                              position: 'absolute',
                              right: 8,
                              top: 4,
                              color: (theme) => theme.palette.grey[500]
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                        <Box className='srchMetaInfo' sx={{ marginBottom: 2 }}>
                        {searchResults
                          .filter(entity =>
                            entity.id === activeCardId &&
                            (((checkEntity || checkAll) && entity.name?.includes(queryString)) ||
                              ((checkTags || checkAll) && entity.tags?.includes(queryString)) ||
                              ((checkType || checkAll) && entity.type?.includes(queryString))))
                          .map(result => (
                              <ul key={result.id}>
                                <li><span>Type</span><i>:</i><em>{result.type}</em></li>
                                <li><span>Alias</span><i>:</i><em>{result.alias}</em></li>
                                <li><span>Length</span><i>:</i><em>{result.length}</em></li>
                                <li><span>Default</span><i>:</i><em>{result.default}</em></li>
                                <li><span>Tags</span><i>:</i><em>{result.tags}</em></li>
                              </ul>
                          ))}
                        </Box>
                      </div>
                      <div className='srchRsltEntityCol srchRsltMetaCol'>
                        <div className='srchRsltEntityHdng'>
                          <h4 style={{ margin: 0 }}>Meta Table</h4>
                        </div>
                        <div className='srchRsltEntityTbl'>
                          <MaterialReactTable
                            columns={columns}
                            data={entityData}
                            enableGrouping={false}
                            muiTableContainerProps={{ sx: { maxHeight: '460px' } }}
                            enableColumnResizing={false}
                            enableColumnOrdering={false}
                            muiTableBodyCellProps={({ column, row }) => ({
                              onClick: (event) => {
                                if (event && column.id === 'name') {
                                  handleMetaDetailclick(row.original.id, row.original.name)
                                }
                              },
                              sx: {
                                cursor: 'pointer',
                                ...(column.id === 'name' && {
                                  color: 'var(--primary)'
                                })
                              }
                            })}
                            enableStickyHeader
                            enableStickyFooter
                            enablePagination
                            enableFilters={false}
                          />
                        </div>
                      </div>
                    </Grid>
                      )
                    : (
                        null
                      )}
                </Grid>
              </div>
            </>
             )
           : (
               null
             )}
            {openMetaDetail
              ? (
              <SearchMetaDetail
                open={openMetaDetail}
                onClose={() => setOpenMetaDetail(false)}
                detail={detailArr}
              />
                )
              : (
                  null
                )}
            {openEntityDetail
              ? (
              <SearchEntityDetail
                  open={openEntityDetail}
                  onClose={() => setOpenEntityDetail(false)}
                  detail={detailArr}
                />
                )
              : (
                  null
                )}
      </MainCard>
    </>
  )
}
export async function getServerSideProps () {
  const apolloClient = createApolloClient()

  try {
    const { loading, error, data } = await apolloClient.query({
      query: ENTITYSEARCHRESULT,
      context: {
        ssr: true
      }
    })
    if (error) {
      return {
        props: { error: error.message }
      }
    }

    return {
      props: { data, loading }
    }
  } catch (error) {
    return {
      props: { error: error.message }
    }
  }
}
