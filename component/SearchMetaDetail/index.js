import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Tab, Tabs, Accordion, AccordionSummary, AccordionDetails, Skeleton } from '@mui/material'
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'
import CardHeadingItem from '@/component/CardHeading'
import MetaIcon from '@/component/Icons/IconMeta'
import layoutStyle from '@/assets/css/layout.module.css'
import client from '../../apollo-client'
import { useMetaDetails } from '../../Hooks/MetaDetails'

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

const data1 = [
  {
    associationName: 'Common',
    relationshipPath: 'party_first_name',
    relationshipTypes: ''
  },
  {
    associationName: 'Organization',
    relationshipPath: 'org_description',
    relationshipTypes: ''
  },
  {
    associationName: 'Year',
    relationshipPath: 'year_founded',
    relationshipTypes: ''
  },
  {
    associationName: 'Common',
    relationshipPath: 'party_first_name',
    relationshipTypes: ''
  },
  {
    associationName: 'Organization',
    relationshipPath: 'org_description',
    relationshipTypes: ''
  },
  {
    associationName: 'Year',
    relationshipPath: 'year_founded',
    relationshipTypes: ''
  }
]

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
  const { loading, error, data } = useMetaDetails(id, client)
  if (error) {
    return <div>Error: {error.message}</div>
  }
  const description = data?.meta_meta.map(item => item.description)
  const type = data?.meta_meta.map(item => item.type)
  const length = data?.meta_meta.map(item => item.length)
  const tags = data?.meta_meta.map(item => item.tags)
  const defaults = data?.meta_meta.map(item => item.default)
  const alias = data?.meta_meta.map(item => item.alias)
  const order = data?.meta_meta.map(item => item.order)
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'associationName',
        header: 'Association Name',
        size: 150
      },
      {
        accessorKey: 'relationshipPath',
        header: 'Path',
        size: 150
      },
      {
        accessorKey: 'relationshipTypes',
        header: 'Relationship Types',
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
                    <Grid item xs={9}>
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
                              <p>{description}</p>
                                )}
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
                            Association Relation
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className={'commonTable commonMetaHeightTable hideTblFilters'}>
                              <MaterialReactTable
                                columns={columns}
                                data={data1}
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
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className='srchAccrdn'>
                        <Accordion defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                          >
                            Meta Info
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className='srchMetaInfo'>
                              <ul>
                              {loading
                                ? (
                                  <>
                                    {[...Array(6)].map((_, index) => (
                                      <li key={index}><Skeleton variant="rounded" width={610}/></li>
                                    ))}
                                  </>
                                  )
                                : (
                                <>
                                  <li><span>Type</span><i>:</i><em>{type}</em></li>
                                  <li><span>Alias</span><i>:</i><em>{alias}</em></li>
                                  <li><span>Length</span><i>:</i><em>{length}</em></li>
                                  <li><span>Default</span><i>:</i><em>{defaults}</em></li>
                                  <li><span>Tags</span><i>:</i><em>{tags}</em></li>
                                  <li><span>Order</span><i>:</i><em>{order}</em></li>
                                </>
                                  )}
                              </ul>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </Grid>
                  </Grid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  Relationship
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
