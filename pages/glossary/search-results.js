import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  FormControl,
  FormControlLabel,
  Grid,
  Checkbox
} from '@mui/material'

import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'

import GlossaryIcon from '@/component/Icons/IconGlossary'
import SearchIcon from '@/component/Icons/IconSearch'
import MetaIcon from '@/component/Icons/IconMeta'
import EntityIcon from '../../component/Icons/IconEntity'

import layoutStyle from '@/assets/css/layout.module.css'
import { useEntityResult } from '@/Hooks/EntityResult'
import client from '../../apollo-client'

export default function GlossarySearchResults () {
  const router = useRouter()
  const { query } = router
  const queryString = query.query
  const { loading, error, data } = useEntityResult(client)
  if (error) {
    return <div>Error: {error.message}</div>
  }
  const [checkAll, setAllCheck] = useState(true)
  const [checkEntity, setEntityCheck] = useState(false)
  const [checkMeta, setMetaCheck] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const handleAllCheckChange = (event) => {
    setAllCheck(event.target.checked)
  }
  const handleEntityCheckChange = (event) => {
    setEntityCheck(event.target.checked)
  }
  const handleMetaCheckChange = (event) => {
    setMetaCheck(event.target.checked)
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

  useEffect(() => {
    if (!query || !entitiesAndMeta.length) {
      setSearchResults([])
      return
    }

    const filteredResults = entitiesAndMeta.filter((item) => {
      const entityName = item.name ?? ''
      const metaNames = item.meta?.map(metaItem => metaItem.name) ?? []
      const entityMatches = entityName.includes(queryString)
      const metaMatches = metaNames.filter(metaName => metaName === queryString)
      return metaMatches || (entityMatches && (metaNames.length > 0 || !metaMatches))
    })

    console.log('entities', filteredResults)
    setSearchResults(filteredResults)
  }, [query, entitiesAndMeta])

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
        <div className={`${layoutStyle.dashHeaderBtm}`}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CardHeadingItem
                icon={<SearchIcon />}
                title={`${queryString ? `${queryString} Search Results` : 'Search Results'}`}
              />
            </Grid>
            <Grid item xs="auto"></Grid>
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
                          checked={setAllCheck}
                          onChange={handleAllCheckChange}
                          color="primary"
                          value={checkAll}
                        />
                      }
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <FormControlLabel
                      label='Entity'
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
                      label='Meta'
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
              </div>
            </Grid>
            <Grid item xs>
              <div className={`${layoutStyle.srchResultList}`}>
                {searchResults.length === 0 && loading && (
                  <div>loading...</div>
                )}

                {searchResults.length > 0 && (
                  <>
                    {searchResults
                      .filter(entity => entity.name === queryString)
                      .map(result => (
                        <div key={result.id} className={`${layoutStyle.srchResultCol}`}>
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
                        .filter(meta => meta.name === queryString)
                        .map((result) => (
                          <div key={result.id} className={`${layoutStyle.srchResultCol}`}>
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
                    {searchResults.filter(entity => entity.name === queryString).length === 0 &&
                      searchResults.flatMap((sa) => sa.meta)
                        .filter(meta => meta.name === queryString).length === 0 && (
                        <div>No results found.</div>
                    )}
                  </>
                )}
                {searchResults.length === 0 && !loading && (
                  <div>No results found.</div>
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </MainCard>
    </>
  )
}
