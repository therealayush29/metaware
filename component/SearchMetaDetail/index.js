import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Box, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Tab, Tabs, Accordion, AccordionSummary, AccordionDetails, Skeleton } from '@mui/material'
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'
import CardHeadingItem from '@/component/CardHeading'
import MetaIcon from '@/component/Icons/IconMeta'
import ModelIcon from '@/component/Icons/IconModel'
import layoutStyle from '@/assets/css/layout.module.css'
import { useMetaDetails } from '../../Hooks/MetaDetails'
import { useMetaDetailsAsso } from '../../Hooks/MetaDetailsAsso'

function CustomTabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (<Box sx={{ pt: 3 }}>{children}</Box>)}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const SearchMetaDetail = ({
  customClass,
  open,
  onClose,
  detail
}) => {
  SearchMetaDetail.propTypes = {
    customClass: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    detail: PropTypes.array.isRequired
  }
  const id = detail[0].id
  const { loading, error, data } = useMetaDetails(id)

  const description = data?.meta_meta.map(item => item.description)
  const type = data?.meta_meta.map(item => item.type)
  const length = data?.meta_meta.map(item => item.length)
  const tags = data?.meta_meta.map(item => item.tags)
  const defaults = data?.meta_meta.map(item => item.default)
  const alias = data?.meta_meta.map(item => item.alias)
  const order = data?.meta_meta.map(item => item.order)
  const [value, setValue] = useState(0)

 {/*} const { loading: loadingAss, error: errorAss, data: dataAss } = useMetaDetailsAsso()
  if (errorAss) {
    return <div>Error: {errorAss.message}</div>
  }
  const data1 = dataAss?.meta_glossary_association.flatMap(entry => {
    const id = entry.id
    const glossaryId = entry.glossary_id
    const assoType = entry.glossary_association_type.short_description
    const associatedMeta = entry.metum.description
    const associatedIds = entry.metum.glossary_associations.map(assoc => assoc.associated_id)
    return { id, glossaryId, assoType, associatedMeta, associatedIds }
  })
  const filteredData = data1?.filter(item => item.glossaryId === id)*/}

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 150
      },
      {
        accessorKey: 'glossaryId',
        header: 'glossary_id',
        size: 150
      },
      {
        accessorKey: 'assoType',
        header: 'Association Type',
        size: 150
      },
      {
        accessorKey: 'associatedMeta',
        header: 'Associated Meta Name',
        size: 150
      },
      {
        accessorKey: 'associatedIds',
        header: 'Associated Meta Id',
        size: 150
      }
    ],
    []
  )
  return (
    <>
      <Dialog open={open} onClose={onClose} className={`pageViewPopup searchViewPopup ${customClass}`}>
        <DialogContent sx={{ p: 0 }}>
          <div className={`${layoutStyle.dashHeaderBtm}`}>
            <Grid container spacing={2}>
              <Grid item xs>
                <CardHeadingItem
                  icon={<MetaIcon />}
                  title={`${detail.map((val) => val.name)}`}
                />
              </Grid>
              <Grid item xs="auto">
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 4,
                    color: (theme) => theme.palette.grey[500]
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>
          <div className='srchTabs'>
            <Stack>
              <Box sx={{ width: '100%' }}>
                <Box>
                  <Tabs value={value} onChange={handleChange} aria-label="detailTabs">
                    <Tab label="Overview" {...a11yProps(0)} />
                    <Tab label="Relationship" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div className='srchAccrdn'>
                        <Accordion defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            Meta Description
                          </AccordionSummary>
                          <AccordionDetails>
                            {loading
                              ? (
                              <p><Skeleton variant="rounded" width={610}/></p>
                                )
                              : (
                              <p><b>{description}</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                )}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <div className='srchAccrdn'>
                        <Accordion defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4-content"
                            id="panel4-header"
                          >
                            Meta Properties
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className='srchMetaInfo'>
                              <ul>
                              {loading
                                ? (
                                  <>
                                    {[...Array(6)].map((_, index) => (
                                      <li key={index}><Skeleton variant="rounded" width={100}/></li>
                                    ))}
                                  </>
                                  )
                                : (
                                <>
                                  <li><span>Title</span><i>:</i><em>{detail.map((val) => val.name)}</em></li>
                                  <li><span>Type</span><i>:</i><em>Text{type}</em></li>
                                  <li><span>Alias</span><i>:</i><em>{alias}OrgName</em></li>
                                  <li><span>Length</span><i>:</i><em>{length}5</em></li>
                                  <li><span>Default</span><i>:</i><em>{defaults}None</em></li>
                                  <li><span>Tags</span><i>:</i><em>{tags}Green</em></li>
                                  <li><span>Order</span><i>:</i><em>{order}</em></li>
                                </>
                                  )}
                              </ul>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </Grid>
                    <Grid item xs={6}></Grid>
                  </Grid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                      <div className='srchAccrdn'>
                        <Accordion defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                          >
                            Association Relationships
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className='assRltnList'>
                              <div className='assRltnCol'>
                                <p>Association Type</p>
                                <div className='assRltnData'>
                                  <Link href="">
                                    <i>
                                      <MetaIcon />
                                    </i>
                                    <span>Exact Match</span>
                                  </Link>
                                </div>
                              </div>
                              <div className='assRltnCol'>
                                <p>Associated Meta Name</p>
                                <div className='assRltnData'>
                                  <Link href="">
                                    <i>
                                      <MetaIcon />
                                    </i>
                                    <span>company_name</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            {/*<div className={'commonTable commonMetaHeightTable hideTblFilters'}>
                              <MaterialReactTable
                                columns={columns}
                                data={filteredData || []}
                                state={loadingAss}
                                enableGrouping={false}
                                muiTableContainerProps={{ sx: { maxHeight: '460px' } }}
                                enableColumnResizing={false}
                                enableColumnOrdering={false}
                                enableStickyHeader
                                enableStickyFooter
                                enablePagination
                                enableFilters={false}
                                muiTableBodyCellProps={({ column }) => ({
                                  sx: {
                                    cursor: 'pointer'
                                  }
                                })}
                              />
                              </div>*/}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <div className='srchAccrdn'>
                        <Accordion defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                          >
                            Linked Relationships
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className='assRltnList'>
                              <div className='assRltnCol'>
                                <p>Table</p>
                                <div className='assRltnData'>
                                  <Link href="">
                                    <span>Exact Match</span>
                                  </Link>
                                  <i>
                                    <ModelIcon />
                                  </i>
                                  <Link href="">
                                    <span>company_name</span>
                                  </Link>
                                </div>
                                <div className='assRltnData'>
                                  <Link href="">
                                    <span>Exact Match</span>
                                  </Link>
                                  <i>
                                    <ModelIcon />
                                  </i>
                                  <Link href="">
                                    <span>company_name</span>
                                  </Link>
                                </div>
                                <div className='assRltnData'>
                                  <Link href="">
                                    <span>Exact Match</span>
                                  </Link>
                                  <i>
                                    <ModelIcon />
                                  </i>
                                  <Link href="">
                                    <span>company_name</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                </CustomTabPanel>
              </Box>
            </Stack>
          </div>
          <DialogActions sx={{ py: 1.2, px: 2, justifyContent: 'flex-start' }}>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SearchMetaDetail
