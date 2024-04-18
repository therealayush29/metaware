import React from 'react'
import Head from 'next/head'
import { Grid } from '@mui/material'

import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'

import HelpIcon from '@/component/Icons/IconHelp'

import layoutStyle from '@/assets/css/layout.module.css'

export default function Help () {
  return (
    <>
      <Head>
        <title>Help | Metaware</title>
      </Head>
      <MainCard
        activeMenu="Help"
        pageIcon={<HelpIcon />}
        pageHeading="Help"
      >
        <div className={`${layoutStyle.dashHeaderBtm}`}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CardHeadingItem
                icon={<HelpIcon />}
                title="Help"
              />
            </Grid>
            <Grid item xs="auto"></Grid>
          </Grid>
        </div>
      </MainCard>
    </>
  )
}
