import React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'

import layoutStyle from '@/assets/css/layout.module.css'

export default function Footer (props) {
  return (
    <>
      <div className={`${layoutStyle.dashFooter}`}>
        <Box sx={{
          display: 'flex1',
          justifyContent: 'space-between'
        }}
        >
          <Grid container spacing={2}>
            <Grid xs={12}>
              <div className={`${layoutStyle.cpyrghtText}`}>Designed & Developed by <Link href="/">Metaware</Link></div>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  )
}
