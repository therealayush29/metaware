import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Breadcrumbs, Typography } from '@mui/material'

export default function BreadCrumbs (props) {
  BreadCrumbs.propTypes = {
    link: PropTypes.string,
    sLink: PropTypes.string,
    nLink: PropTypes.string,
    eLink: PropTypes.string,
    name: PropTypes.string,
    namespace: PropTypes.string,
    subjectarea: PropTypes.string,
    entity: PropTypes.string
  }
  const router = useRouter()
  const { link, nLink, sLink, eLink, name, namespace, subjectarea, entity } = props

  const breadcrumbs = [
    <Link key="home" underline="hover" color="inherit" href={link}>
      {name}
    </Link>
  ]

  if (nLink) {
    if (subjectarea && router.query.namespace === namespace && router.query.subjectarea === subjectarea) {
      breadcrumbs.push(
      <Link key="namespace" underline="hover" color="inherit" href={nLink}>
        {namespace}
      </Link>
      )
    } else {
      breadcrumbs.push(
        <Typography key="namespace" color="text.primary">
          {namespace}
        </Typography>
      )
    }
  }

  if (sLink) {
    if (entity && router.query.subjectarea === subjectarea && router.query.entity === entity) {
      breadcrumbs.push(
        <Link
          key="subjectarea"
          underline="hover"
          color="text.primary"
          href={sLink}
          aria-current="page"
        >
          {subjectarea}
        </Link>
      )
    } else {
      breadcrumbs.push(
        <Typography key="subjectarea" color="text.primary">
          {subjectarea}
        </Typography>
      )
    }
  }

  if (eLink) {
    breadcrumbs.push(
      <Typography key="entity" color="text.primary">
        {entity}
      </Typography>
    )
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" className="breadCrumbsDiv">
      {breadcrumbs}
    </Breadcrumbs>
  )
}
