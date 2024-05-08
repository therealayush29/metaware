import React, { useState } from 'react'
import Head from 'next/head'

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

import { useEntitySearch } from '@/Hooks/EntitySearch'
import client from '@/apollo-client'
import Link from 'next/link'

export default function Glossary () {
  const [search, setSearch] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const { loading, error, data } = useEntitySearch(search === '' ? null : search, client)
  console.log('data', data)
  let totalCount = 0
  if (data) {
    data.meta_namespace.forEach((namespace) => {
      namespace.subjectareas.forEach((subjectarea) => {
        totalCount += subjectarea.entities.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
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
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    variant="contained"
                  ><SearchIcon /></Button>
                </FormControl>
                <ul>
                  {loading && <li>Loading...</li>}
                  {search !== '' && data && (
                    <>
                      {data.meta_namespace.map((namespace) => (
                        <React.Fragment key={namespace.id}>
                          {namespace.subjectareas.map((subjectarea) => (
                            <React.Fragment key={subjectarea.id}>
                              {subjectarea.entities
                                .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                                .map((item) => (
                                  <li key={item.id}><Link href={item.name}>{item.name}</Link></li>
                                ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </ul>
              </Stack>
              <div className={`${layoutStyle.srchNote}`}>
                <p>{totalCount} entities found from glossary</p>
              </div>
            </div>
          </div>
        </div>
      </MainCard>
    </>
  )
}
