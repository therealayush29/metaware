import React from 'react'
import Head from 'next/head'
import { Grid } from '@mui/material'

import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'

import ProfileIcon from '@/component/Icons/IconProfile'

import layoutStyle from '@/assets/css/layout.module.css'

export default function Profile () {
  return (
    <>
      <Head>
        <title>Profile | Metaware</title>
      </Head>
      <MainCard
        activeMenu="Profile"
        pageIcon={<ProfileIcon />}
        pageHeading="Profile"
      >
        <div className={`${layoutStyle.dashHeaderBtm}`}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CardHeadingItem
                icon={<ProfileIcon />}
                title="Profile"
              />
            </Grid>
            <Grid item xs="auto"></Grid>
          </Grid>
        </div>
      </MainCard>
    </>
  )
}
