import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Tab, Tabs, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { MaterialReactTable } from 'material-react-table'

import CardHeadingItem from '@/component/CardHeading'

import MetaIcon from '@/component/Icons/IconMeta'

import layoutStyle from '@/assets/css/layout.module.css'

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
      {value === index && (
        <Box sx={{ pt: 3 }}>{children}</Box>
      )}
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

const data = [
  {
    name: 'party_first_name'
  },
  {
    name: 'party_full_name'
  },
  {
    name: 'org_id'
  },
  {
    name: 'party_type'
  },
  {
    name: 'party_name'
  }
]

const SearchEntityDetail = ({
  customClass,
  open,
  onClose,
  detail
}) => {
  SearchEntityDetail.propTypes = {
    customClass: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    detail: PropTypes.array.isRequired
  }

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200
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
                            Entity Description
                          </AccordionSummary>
                          <AccordionDetails>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
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
                            Meta
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className={'commonTable commonMetaHeightTable hideTblFilters'}>
                              <MaterialReactTable
                                columns={columns}
                                data={data}
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
                            Entity Info
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className='srchMetaInfo'>
                              <ul>
                                <li><span>Type</span><i>:</i><em>Text</em></li>
                                <li><span>Alias</span><i>:</i><em>OrgName</em></li>
                                <li><span>Length</span><i>:</i><em>5</em></li>
                                <li><span>Default</span><i>:</i><em>None</em></li>
                                <li><span>Tags</span><i>:</i><em>Green</em></li>
                              </ul>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </Grid>
                  </Grid>
                  {/* <div className={'commonTable commonMetaHeightTable'}>
                    <MaterialReactTable
                      columns={columns}
                      data={data}
                      enableGrouping
                      muiTableContainerProps={{ sx: { maxHeight: '460px' } }}
                      enableColumnResizing
                      enableColumnOrdering
                      enableStickyHeader
                      enableStickyFooter
                      muiTableBodyCellProps={({ column }) => ({
                        sx: {
                          cursor: 'pointer'
                        }
                      })}
                    />
                  </div> */}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  Relationship
                </CustomTabPanel>
              </Box>
            </Stack>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SearchEntityDetail
