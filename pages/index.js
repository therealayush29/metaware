import React from 'react'
import Head from 'next/head'
import { Grid } from '@mui/material'

import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'

import DashboardIcon from '@/component/Icons/IconDashboard'

import layoutStyle from '@/assets/css/layout.module.css'

export default function Home () {
  return (
    <>
      <Head>
        <title>Dashboard | Metaware</title>
      </Head>
      <MainCard
        activeMenu="Dashboard"
        pageIcon={<DashboardIcon />}
        pageHeading="Dashboard"
      >
        <div className={`${layoutStyle.dashHeaderBtm}`}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CardHeadingItem icon={<DashboardIcon />} title="Dashboard" />
            </Grid>
            <Grid item xs="auto"></Grid>
          </Grid>
        </div>
      </MainCard>
    </>
  )
}
