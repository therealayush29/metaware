import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  FormControl,
  TextField,
  Button,
  Grid,
  Stack
} from '@mui/material'

import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'

import GlossaryIcon from '@/component/Icons/IconGlossary'
import SearchIcon from '@/component/Icons/IconSearch'
import SearchIconNew from '@/component/Icons/IconSearchNew'
import layoutStyle from '@/assets/css/layout.module.css'
import { useEntityResult } from '@/Hooks/EntityResult'
import client from '@/apollo-client'
import Link from 'next/link'

export default function Glossary () {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [searchResultsVisible, setSearchResultsVisible] = useState(false)
  const searchResultsRef = useRef(null)
  useEffect(() => {
    function handleClickOutside (event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setSearchResultsVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchResultsRef])
  const handleSubmit = async (e) => {
    e.preventDefault()
    router.push(`/glossary/search-results?query=${search.toLowerCase()}`)
  }

  const { loading, error, data } = useEntityResult(client)
  if (error) {
    return <div>Error: {error.message}</div>
  }
  let totalCount = 0
  let _totalMetaCount = 0
  if (search !== '' && data) { // Only calculate totalCount if search is not blank
    data.meta_namespace.forEach((namespace) => {
      namespace.subjectareas.forEach((subjectarea) => {
        totalCount += subjectarea.entities.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ).length
        _totalMetaCount += subjectarea.entities
          .flatMap((item) =>
            item.meta
              .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
          ).length
      })
    })
  }
  return (
    <>
      <Head>
        <title>Glossary | Metaware</title>
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
                icon={<GlossaryIcon />}
                title="Glossary"
              />
            </Grid>
            <Grid item xs="auto"></Grid>
          </Grid>
        </div>
        <div className={`${layoutStyle.srchBlock}`}>
          <div className={`${layoutStyle.srchInrBlock}`}>
            <div className={`${layoutStyle.srchForm}`}>
              <i><SearchIconNew /></i>
              <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                <FormControl fullWidth className={`${layoutStyle.srchFrmGroup}`}>
                  <TextField
                    id="search"
                    name="search"
                    type="search"
                    autoComplete='off'
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    onFocus={() => setSearchResultsVisible(true)}
                  />
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    variant="contained"
                  ><SearchIcon /></Button>
                </FormControl>
                {searchResultsVisible && (
                  <div className={`${layoutStyle.srchList}`} ref={searchResultsRef}>
                      <ul>
                      {loading && <li><Link href="#">Loading...</Link></li>}
                      {search !== '' && data && (
                          <>
                          {data.meta_namespace.map((namespace) => (
                              <React.Fragment key={namespace.id}>
                              {namespace.subjectareas.map((subjectarea) => (
                                  <React.Fragment key={subjectarea.id}>
                                  {subjectarea.entities
                                    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                                    .map((item) => (
                                          <li key={item.id}><Link href={`search-results?query=${item.name}`} onClick={() => setSearch(item.name)}>{item.name}</Link></li>
                                    ))}
                                    {subjectarea.entities
                                      .flatMap((item) =>
                                        item.meta
                                          .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                                          .map((meta) => (
                                          <li key={meta.id}><Link href={`search-results?query=${meta.name}`} onClick={() => setSearch(meta.name)}>{meta.name}</Link></li>
                                          ))
                                      )}
                                  </React.Fragment>
                              ))}
                              </React.Fragment>
                          ))}
                          </>
                      )}
                      </ul>
                  </div>
                )}
              </Stack>
              <div className={`${layoutStyle.srchNote}`}>
                <p>{totalCount} entities & {_totalMetaCount} meta found from glossary</p>
              </div>
            </div>
          </div>
        </div>
      </MainCard>
    </>
  )
}
