import React, { useEffect, useState } from 'react'
import { usePageContext } from '@/pageProvider/PageContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Grid } from '@mui/material'
import { useEntity } from '@/Hooks/Entity'
import MainCard from '@/component/MainCard'
import CardHeadingItem from '@/component/CardHeading'
import BreadCrumbs from '@/component/BreadCrumbs'
import CardItem from '@/component/CardItem'
import DataIcon from '@/component/Icons/IconData'
import EntityIcon from '@/component/Icons/IconEntity'

import layoutStyle from '@/assets/css/layout.module.css'

export default function subjectareas () {
  const router = useRouter()
  const { namespace, subjectarea, id, type } = router.query
  const url1 = '#'
  const url2 = `/data/${namespace}/${subjectarea}/`
  const links = {
    link: '/',
    nLink: url1,
    sLink: url2,
    name: 'Dashboard',
    namespace,
    subjectarea
  }
  const [Isloading, setIsLoading] = useState(false)
  const [metaNamespace, setMetaNamespace] = useState([])
  const { data, loading } = useEntity(id)
  useEffect(() => {
    if (loading) {
      setIsLoading(true) // Set loading state to true while data is being fetched
    } else if (data) {
      setIsLoading(false) // Once data is fetched, set loading state to false
      setMetaNamespace(data.meta_subjectarea)
    }
  }, [loading, data])

  const { openNamespace } = usePageContext()
  const handleRouteChangeStart = () => {
    setIsLoading(true)
  }

  const handleRouteChangeComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  const [activeSubMenu, setActiveSubMenu] = useState('')
  useEffect(() => {
    if (namespace) {
      setActiveSubMenu(namespace)
    }
  }, [namespace])

  const handleClick = (entityName, entityId) => {
    router.push(`/data/${namespace}/${subjectarea}/${entityName}?id=${id}&type=${type}&enId=${entityId}`)
  }

  const capitalizedSubjectArea =
    typeof subjectarea === 'string'
      ? subjectarea.charAt(0).toUpperCase() + subjectarea.slice(1)
      : ''

  const goToMetaRuntimePage = (entityName, entityId) => {
    router.push(`/meta/runtime?type=${type}&namespace=${namespace}&subjectarea=${subjectarea}&entity=${entityName}&enId=${entityId}`)
  }

  return (
    <>
      <Head>
        <title>{capitalizedSubjectArea} | Metaware</title>
      </Head>

      <MainCard
        typeGetValue={type}
        activeMenu={type}
        activeSubMenu={activeSubMenu}
        pageIcon={<DataIcon />}
        pageHeading={subjectarea}
        customClass={`${openNamespace ? layoutStyle.dashSubMenuOpen : null}`}
      >
        {metaNamespace.map((item) => (
          <React.Fragment key={item.name}>
            <div className={`${layoutStyle.dashHeaderBtm}`}>
              <Grid container spacing={2}>
                <Grid item xs>
                  <CardHeadingItem
                    icon={<DataIcon />}
                    title={subjectarea}
                  />
                </Grid>
                <Grid item xs="auto">
                  <BreadCrumbs
                    {...links}
                  />
                </Grid>
              </Grid>
            </div>
            <Grid container spacing={3}>
              {item.entities?.map((entity) => (
                <Grid item key={entity.id} xs={12} sm={6} md={3}>
                  {Isloading
                    ? (
                    <p>Loading...</p>
                      )
                    : (
                    <CardItem
                      icon={<EntityIcon />}
                      id={entity.id}
                      onClick={() => handleClick(entity.name, entity.id)}
                      onclickRun = {() => goToMetaRuntimePage(entity.name, entity.id)}
                      {...entity}
                    />
                      )}
                </Grid>
              ))}
            </Grid>
          </React.Fragment>
        ))}
      </MainCard>
    </>
  )
}
