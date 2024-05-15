import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
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
    name: 'party_first_name',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_full_name',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '1',
    association: ''
  },
  {
    name: 'party_full_name',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_full_name',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '1',
    association: ''
  },
  {
    name: 'org_id',
    type: 'id',
    subtype: 'association',
    nullable: 'true',
    description: 'org id',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '4',
    association: ''
  },
  {
    name: 'party_type',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_type',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '3',
    association: ''
  },
  {
    name: 'party_name',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_name1',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '2',
    association: ''
  },
  {
    name: 'id',
    type: 'id',
    subtype: '.',
    nullable: 'false',
    description: 'id',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '1',
    association: ''
  },
  {
    name: 'party_first_name',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_full_name',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '1',
    association: ''
  },
  {
    name: 'party_full_name',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_full_name',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '1',
    association: ''
  },
  {
    name: 'org_id',
    type: 'id',
    subtype: 'association',
    nullable: 'true',
    description: 'org id',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '4',
    association: ''
  },
  {
    name: 'party_type',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_type',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '3',
    association: ''
  },
  {
    name: 'party_name',
    type: '.',
    subtype: '.',
    nullable: 'true',
    description: 'party_name1',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '2',
    association: ''
  },
  {
    name: 'id',
    type: 'id',
    subtype: '.',
    nullable: 'false',
    description: 'id',
    alias: '',
    default: '',
    is_unique: 'false',
    order: '1',
    association: ''
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
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 150
      },
      {
        accessorKey: 'subtype',
        header: 'Sub-Type',
        size: 150
      },
      {
        accessorKey: 'nullable',
        header: 'Nullable',
        size: 150
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 200
      },
      {
        accessorKey: 'alias',
        header: 'Alias',
        size: 150
      },
      {
        accessorKey: 'default',
        header: 'Default',
        size: 150
      },
      {
        accessorKey: 'is_unique',
        header: 'Is Unique',
        size: 150
      },
      {
        accessorKey: 'order',
        header: 'Order',
        size: 100
      },
      {
        accessorKey: 'association',
        header: 'Association',
        size: 150
      }
    ],
    []
  )
  return (
    <>
      <Dialog open={open} onClose={onClose} className={`pageViewPopup searchViewPopup ${customClass}`}>
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
                  <div className={'commonTable commonMetaHeightTable'}>
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
                  </div>
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

export default SearchEntityDetail
