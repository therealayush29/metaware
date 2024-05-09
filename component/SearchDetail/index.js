import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { Close as CloseIcon } from '@mui/icons-material'

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
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

const SearchDetail = ({
  customClass,
  open,
  onClose,
  detail
}) => {
  SearchDetail.propTypes = {
    customClass: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    detail: PropTypes.array.isRequired
  }

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleFormSubmit = () => {

  }
  console.log('detail', detail)
  return (
    <>
      <Dialog open={open} onClose={onClose} className={`pageViewPopup ${customClass}`}>
        <DialogTitle sx={{ py: 1.2, px: 2 }} className="headingColor" id="customized-dialog-title"> {detail.map((val) => val.name)} Details</DialogTitle>
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
        <DialogContent sx={{ p: 2 }}>
          <Grid container>
            <Grid item xs>
              <div className='customForm sharedRuleForm'>
                <Stack component="form" onSubmit={handleFormSubmit} spacing={2}>
                  <Box sx={{ width: '100%' }}>
                    <Box>
                      <Tabs value={value} onChange={handleChange} aria-label="detailTabs">
                        <Tab label="Details" {...a11yProps(0)} />
                        <Tab label="Links" {...a11yProps(1)} />
                        <Tab label="Relationship" {...a11yProps(2)} />
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                      namespace
                      subjectarea
                      entity
                      belongs to entity
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      Links
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                      Data
                    </CustomTabPanel>
                  </Box>
                </Stack>
              </div>
            </Grid>
            <Grid item xs>
            </Grid>
          </Grid>
          <DialogActions sx={{ py: 1.2, px: 2, justifyContent: 'flex-start' }}>
          </DialogActions>
        </DialogContent>
      </Dialog >
    </>
  )
}

export default SearchDetail
