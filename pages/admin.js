import React from 'react'
import Head from 'next/head'

import { Grid } from '@mui/material'

import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'

import AdminIcon from '@/component/Icons/IconAdmin'

import layoutStyle from '@/assets/css/layout.module.css'

export default function Admin () {
  return (
    <>
      <Head>
        <title>Admin | Metaware</title>
      </Head>
      <MainCard
        activeMenu="Admin"
        pageIcon={<AdminIcon />}
        pageHeading="Admin"
      >
        <div className={`${layoutStyle.dashHeaderBtm}`}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CardHeadingItem
                icon={<AdminIcon />}
                title="Admin"
              />
            </Grid>
            <Grid item xs="auto"></Grid>
          </Grid>
        </div>
      </MainCard>
    </>
  )
}
