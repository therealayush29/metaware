import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMeta } from '@/Hooks/Meta'
import SidebarLinkItem from '@/component/SidebarLink'
import SidebarSubLink from '@/component/SidebarSubLink'
import DashboardIcon from '@/component/Icons/IconDashboard'
import MetaIcon from '@/component/Icons/IconMeta'
import DataIcon from '@/component/Icons/IconData'
import ModelIcon from '@/component/Icons/IconModel'
import GlossaryIcon from '@/component/Icons/IconGlossary'
import DefaultIcon from '@/component/Icons/IconDefault'
import AdminIcon from '@/component/Icons/IconAdmin'
import LogoutIcon from '@/component/Icons/IconLogout'
import layoutStyle from '@/assets/css/layout.module.css'
import { usePageContext } from '@/pageProvider/PageContext'
import PropTypes from 'prop-types'

export default function Sidebar (props) {
  const router = useRouter()
  const { activeMenu, activeSubMenu } = props
  Sidebar.propTypes = {
    activeMenu: PropTypes.string,
    activeSubMenu: PropTypes.string
  }

  const { metaNspace, setMetaNspace, openNamespace, setOpenNamespace, setTypeValue } = usePageContext()

  useEffect(() => {
    setOpenNamespace(activeMenu)
  }, [activeMenu])

  const toggleNamespace = (name) => {
    const newOpenNamespace = openNamespace === name ? null : name
    setOpenNamespace(newOpenNamespace)
    setTypeValue(name)
  }

  const [openSubjectArea, setOpenSubjectArea] = useState(null)

  useEffect(() => {
    setOpenSubjectArea(activeSubMenu)
  }, [activeSubMenu])

  const toggleSubjectArea = (name) => {
    setOpenSubjectArea(openSubjectArea === name ? null : name)
  }

  // eslint-disable-next-line no-unused-vars
  const { loading, data, error } = useMeta()

  useEffect(() => {
    if (!loading && data && data.meta_namespace) {
      setMetaNspace(data.meta_namespace)
    }
  }, [loading, data, setMetaNspace])

  // eslint-disable-next-line no-unused-vars
  const groupedMetaNamespace = metaNspace.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {})

  const groupedDataNamespace = metaNspace.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {})

  // eslint-disable-next-line no-unused-vars
  const linkData = [
    /* {
      name: "Namespace",
      link: "/namespace",
      icon: <NamespaceIcon />,
    },
    {
      name: "Subject Area",
      link: "/subjectarea",
      icon: <SubjectareaIcon />,
    },
    {
      name: "Entity",
      link: "/entity",
      icon: <EntityIcon />,
    }, */
    {
      name: 'Admin',
      link: '/admin',
      icon: <AdminIcon />
    }
  ]

  const pageRouting = (link) => {
    router.push(link)
  }

  const subjectareas = [
    {
      id: '0',
      name: 'nameSpaceRuntime'
    },
    {
      id: '1',
      name: 'subjectareaRuntime'
    }
  ]
  return (
    <div className={`${layoutStyle.sdbrLnksList} first-step`}>
      <SidebarLinkItem
        showSidebar
        name="Dashboard"
        icon={<DashboardIcon />}
        customClass={activeMenu === 'Dashboard' ? layoutStyle.active : 'null'}
        onClick={() => pageRouting('/')}
      />

      <SidebarLinkItem
        showSidebar
        name="Meta"
        icon={<MetaIcon />}
        openNamespace={openNamespace}
        customClass={activeMenu === 'Meta' ? layoutStyle.active : 'null'}
        onClick={() => pageRouting('/meta')}
      />

      {/* <SidebarLinkItem
        showSidebar
        name="Meta"
        icon={<MetaIcon />}
        customClass={activeMenu === 'Meta' ? layoutStyle.active : null}
        openNamespace={openNamespace}
        onClick={toggleNamespace}
      >
        {groupedMetaNamespace &&
          Object.entries(groupedMetaNamespace).map(([type, items]) => (
            <div key={type}>
              <h4 className={`${layoutStyle.grpHdg}`}>{type}</h4>
              {items.map((nsItem) => (
                <li key={nsItem.id}>
                  <SidebarSubLink
                    name={nsItem.name}
                    type={nsItem.type}
                    isMeta={true}
                    metaNamespace={nsItem.sa}
                    customClass={activeSubMenu === nsItem.name ? layoutStyle.active : null}
                    openSubjectArea={openSubjectArea}
                    typeFromLoop={type}
                    toggleSubjectArea={toggleSubjectArea}
                    {...nsItem}
                  />
                </li>
              ))}
            </div>
          ))}
      </SidebarLinkItem> */}

      {/* <SidebarLinkItem
        showSidebar
        name="Data"
        icon={<DataIcon />}
        customClass={activeMenu === 'Data' ? layoutStyle.active : null}
        openNamespace={openNamespace}
        onClick={toggleNamespace}
      >
        {groupedDataNamespace &&
          Object.entries(groupedDataNamespace).map(([type, items]) => (
            <div key={type}>
              <h4 className={`${layoutStyle.grpHdg}`}>{type}</h4>
              {items.map((nsItem) => (
                <li key={nsItem.id}>
                  <SidebarSubLink
                    name={nsItem.name}
                    type={nsItem.type}
                    isMeta={false}
                    metaNamespace={nsItem.sa}
                    customClass={activeSubMenu === nsItem.name ? layoutStyle.active : null}
                    openSubjectArea={openSubjectArea}
                    toggleSubjectArea={toggleSubjectArea}
                    typeFromLoop={type}
                    {...nsItem}
                  />
                </li>
              ))}
            </div>
          ))}
      </SidebarLinkItem> */}
      <>
      {groupedDataNamespace &&
        Object.entries(groupedDataNamespace)
          .filter(([type]) => ['staging', 'model', 'glossary'].includes(type))
          .map(([type, items]) => (
          <SidebarLinkItem
            showSidebar
            name={type}
            key={type}
            icon={type === 'staging' ? <DataIcon /> : type === 'model' ? <ModelIcon /> : type === 'glossary' ? <GlossaryIcon /> : <DefaultIcon />}
            customClass={`${activeMenu === type ? layoutStyle.active : null}`}
            openNamespace={openNamespace}
            onClick={toggleNamespace}
          >
            <div key={type}>
              <div className={`${layoutStyle.subType}`}>
                <h5><i>{type === 'staging' ? <DataIcon /> : type === 'model' ? <ModelIcon /> : type === 'glossary' ? <GlossaryIcon /> : <DefaultIcon />}</i> {type}</h5>
              </div>
              <ul>
                {items.map((nsItem) => (
                  <li key={nsItem.id}>
                    <SidebarSubLink
                      name={nsItem.name}
                      type={nsItem.type}
                      isMeta={false}
                      metaNamespace={nsItem.sa}
                      customClass={activeSubMenu === nsItem.name ? layoutStyle.active : null}
                      openSubjectArea={openSubjectArea}
                      toggleSubjectArea={toggleSubjectArea}
                      typeFromLoop={type}
                      {...nsItem}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </SidebarLinkItem>
          ))}
      </>

      {linkData && linkData.map((data, index) => (
        <SidebarLinkItem
          showSidebar
          customClass={activeMenu === data.name ? layoutStyle.active : 'null'}
          key={index}
          openNamespace={openNamespace}
          onClick={toggleNamespace}
          {...data}
        >
          <div key='admin'>
              <div className={`${layoutStyle.subType}`}>
                <h5><i><DefaultIcon /></i> Admin</h5>
              </div>
                <ul>
                  <li key={subjectareas.id}>
                    <SidebarSubLink
                      name='Run Time'
                      type='Admin'
                      isMeta={true}
                      customClass={activeSubMenu === 'Run Time' ? layoutStyle.active : null}
                      openSubjectArea={openSubjectArea}
                      toggleSubjectArea={toggleSubjectArea}
                      typeFromLoop='admin'
                      subjectareas={subjectareas}
                    />
                  </li>
              </ul>
          </div>
        </SidebarLinkItem>
      ))}
      <SidebarLinkItem
        showSidebar
        name="Logout"
        icon={<LogoutIcon />}
      />
    </div>
  )
}
