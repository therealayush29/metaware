import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html lang="en">
      <Head>
        {/* Link to external stylesheets or other global head elements */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"></link>
        {/* Other global head elements */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
