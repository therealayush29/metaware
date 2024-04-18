import React from 'react'
import Head from 'next/head'

export default function Custom404 () {
  return (
    <>
      <Head>
        <title>Page Not Found | Metaware</title>
      </Head>
      <div className='errorPage'>
        <p>Page Not Found</p>
      </div>
    </>
  )
}
