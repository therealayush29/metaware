import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  Button,
  Grid
} from '@mui/material'
import WestIcon from '@mui/icons-material/West'
import EastIcon from '@mui/icons-material/East'

import workFlowStyle from './style.module.css'

export default function WorkFlowModal () {
  const [openWorkFlow, setOpenWorkFlow] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasModalBeenShown = localStorage.getItem('openWorkFlow')
      return !hasModalBeenShown
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasModalBeenShown = localStorage.getItem('openWorkFlow')
      if (hasModalBeenShown) {
        setOpenWorkFlow(false)
      }
    }
  }, [])
  const handleClose = () => {
    setOpenWorkFlow(false)
    localStorage.setItem('openWorkFlow', 'true')
  }

  const [isWorkFlowIntroActive, setWorkFlowIntroActive] = useState(true)
  const handleWorkFlowIntroToggle = () => {
    setWorkFlowIntroActive(!isWorkFlowIntroActive)
  }

  const [isWorkFlowActive1, setWorkFlowActive1] = useState(true)
  const handleWorkFlowToggle1 = () => {
    setWorkFlowActive1(!isWorkFlowActive1)
  }

  const [isWorkFlowActive2, setWorkFlowActive2] = useState(true)
  const handleWorkFlowToggle2 = () => {
    setWorkFlowActive2(!isWorkFlowActive2)
  }

  const [isWorkFlowActive3, setWorkFlowActive3] = useState(true)
  const handleWorkFlowToggle3 = () => {
    setWorkFlowActive3(!isWorkFlowActive3)
  }

  const [isWorkFlowActive4, setWorkFlowActive4] = useState(true)
  const handleWorkFlowToggle4 = () => {
    setWorkFlowActive4(!isWorkFlowActive4)
  }

  const [isWorkFlowActive5, setWorkFlowActive5] = useState(true)
  const handleWorkFlowToggle5 = () => {
    setWorkFlowActive5(!isWorkFlowActive5)
  }

  const [isWorkFlowActive6, setWorkFlowActive6] = useState(true)
  const handleWorkFlowToggle6 = () => {
    setWorkFlowActive6(!isWorkFlowActive6)
  }

  const [isWorkFlowActive7, setWorkFlowActive7] = useState(true)
  const handleWorkFlowToggle7 = () => {
    setWorkFlowActive7(!isWorkFlowActive7)
  }

  const [isWorkFlowActive8, setWorkFlowActive8] = useState(true)
  const handleWorkFlowToggle8 = () => {
    setWorkFlowActive8(!isWorkFlowActive8)
  }

  const [isWorkFlowActive9, setWorkFlowActive9] = useState(true)
  const handleWorkFlowToggle9 = () => {
    setWorkFlowActive9(!isWorkFlowActive9)
  }

  const [isWorkFlowActive10, setWorkFlowActive10] = useState(true)
  const handleWorkFlowToggle10 = () => {
    setWorkFlowActive10(!isWorkFlowActive10)
  }

  const [isWorkFlowActive11] = useState(true)

  return (
    <>
      <Dialog open={openWorkFlow} className="workFlowModal">
        <DialogContent dividers sx={{ p: 2 }}>
          <div className={`${workFlowStyle.workFlowOuter}`}>
            <div className={`${workFlowStyle.workFlowHdr}`}>
              <Grid container spacing={3}>
                <Grid item xs>
                  <div className={`${workFlowStyle.workFlowMdlTtl}`}>
                    <h2>Metaware Workflow</h2>
                    <p>Metaware workflows make it easier for business teams to organize their data. Here are a series of recommended workflows.</p>
                  </div>
                </Grid>
                <Grid item xs="auto">
                  <div className={`${workFlowStyle.workFlowMdlExplrBtn}`}>
                    <Button
                      color="primary"
                      variant="contained"
                      endIcon={<EastIcon />}
                      onClick={handleClose}
                    >
                      Explore more
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className={`${workFlowStyle.workFlowBody}`}>
              <div className={`${workFlowStyle.workFlowAvncdHdng}`}>
                {isWorkFlowActive1 || isWorkFlowActive2 || isWorkFlowActive3 || isWorkFlowActive4 || isWorkFlowActive5 || isWorkFlowActive6 || isWorkFlowActive7
                  ? (
                      null
                    )
                  : (
                  <h4>Advanced Topics</h4>
                    )}
              </div>
              {isWorkFlowActive1 || isWorkFlowActive2 || isWorkFlowActive3 || isWorkFlowActive4 || isWorkFlowActive5 || isWorkFlowActive6 || isWorkFlowActive7
                ? (
                <div className={`${workFlowStyle.workFlowStepsNav} ${isWorkFlowActive1 || isWorkFlowActive2 || isWorkFlowActive3 || isWorkFlowActive4 || isWorkFlowActive5 || isWorkFlowActive6 || isWorkFlowActive7 ? workFlowStyle.workFlowStepsFrstNav : ''}`}>
                  <span className={`${isWorkFlowIntroActive ? workFlowStyle.active : ''}`}>Introduction</span>
                  <span className={`${isWorkFlowActive1 ? workFlowStyle.active : ''}`}>Step 1</span>
                  <span className={`${isWorkFlowActive2 ? workFlowStyle.active : ''}`}>Step 2</span>
                  <span className={`${isWorkFlowActive3 ? workFlowStyle.active : ''}`}>Step 3</span>
                  <span className={`${isWorkFlowActive4 ? workFlowStyle.active : ''}`}>Step 4</span>
                  <span className={`${isWorkFlowActive5 ? workFlowStyle.active : ''}`}>Step 5</span>
                  <span className={`${isWorkFlowActive6 ? workFlowStyle.active : ''}`}>Step 6</span>
                  <span className={`${isWorkFlowActive7 ? workFlowStyle.active : ''}`}>Step 7</span>
                </div>
                  )
                : (
                <div className={`${workFlowStyle.workFlowStepsNav}`}>
                  <span className={`${isWorkFlowIntroActive ? workFlowStyle.active : ''}`}>Introduction</span>
                  <span className={`${isWorkFlowActive8 ? workFlowStyle.active : ''}`}>Step 1</span>
                  <span className={`${isWorkFlowActive9 ? workFlowStyle.active : ''}`}>Step 2</span>
                  <span className={`${isWorkFlowActive10 ? workFlowStyle.active : ''}`}>Step 3</span>
                  <span className={`${isWorkFlowActive11 ? workFlowStyle.active : ''}`}>Step 4</span>
                </div>
                  )}
              {isWorkFlowIntroActive
                ? (
                <>
                  <div className={`${workFlowStyle.workFlowIntroCard}`}>
                    <ul>
                      <li>
                        <p>Organize your data</p>
                        <span></span>
                        <i>1</i>
                      </li>
                      <li>
                        <p>Define business data sources</p>
                        <span></span>
                        <i>2</i>
                      </li>
                      <li>
                        <p>Analyze your data sources and define data quality rules</p>
                        <span></span>
                        <i>3</i>
                      </li>
                      <li>
                        <p>Define business data points or Glossary</p>
                        <span></span>
                        <i>4</i>
                      </li>
                      <li>
                        <p>Define business model or the feature set or the project you want to implement</p>
                        <span></span>
                        <i>5</i>
                      </li>
                      <li>
                        <p>Define Mapping specification to map your model to the sources (T2S)</p>
                        <span></span>
                        <i>6</i>
                      </li>
                      <li>
                        <p>Happy Exploration!</p>
                        <span></span>
                        <i>7</i>
                      </li>
                    </ul>
                    <h4>Advanced Topics</h4>
                    <ul>
                      <li>
                        <p>Identify duplicated information across sources (data mastering)</p>
                        <span></span>
                        <i>1</i>
                      </li>
                      <li>
                        <p>Define Data Hierarchies</p>
                        <span></span>
                        <i>2</i>
                      </li>
                      <li>
                        <p>Populate data into operational data store or data hub</p>
                        <span></span>
                        <i>3</i>
                      </li>
                      <li>
                        <p>Populate data into data mart or data warehouse</p>
                        <span></span>
                        <i>4</i>
                      </li>
                    </ul>
                  </div>
                  <div className={`${workFlowStyle.workFlowBtm}`}>
                    <Grid container spacing={3} justifyContent={'center'}>
                      <Grid item xs="auto">
                        <Button
                          color="primary"
                          variant="outlined"
                          endIcon={<EastIcon />}
                          onClick={handleWorkFlowIntroToggle}
                        >
                          Start
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </>
                  )
                : (
                <>
                  {isWorkFlowActive1
                    ? (
                <>
                  <div className={`${workFlowStyle.workFlowCard}`}>
                    <Grid container spacing={3} alignItems={'center'}>
                      <Grid item xs>
                        <div className={`${workFlowStyle.workFlowCardInfo}`}>
                          <span className={`${workFlowStyle.stepCount}`}>1/7</span>
                          <h3>Organize your data</h3>
                          <p>Metaware organizes your data based on a hierarchy of classification.</p>
                          <ul>
                            <li><strong>1. Namespace:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</li>
                            <li><strong>2. Subject Area:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</li>
                            <li><strong>3. Entity:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</li>
                          </ul>
                        </div>
                      </Grid>
                      <Grid item xs="auto">
                        <div className={`${workFlowStyle.workFlowCardMedia}`}>
                          <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/organize_Data_Purple.png" width={113} height={150} alt="Organize your data" />
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div className={`${workFlowStyle.workFlowBtm}`}>
                    <Grid container spacing={3} justifyContent={'space-between'}>
                      <Grid item xs="auto">
                        <Button
                          color="primary"
                          variant="outlined"
                          startIcon={<WestIcon />}
                          onClick={handleWorkFlowIntroToggle}
                        >
                          Go Back
                        </Button>
                      </Grid>
                      <Grid item xs="auto">
                        <Button
                          color="primary"
                          variant="outlined"
                          endIcon={<EastIcon />}
                          onClick={handleWorkFlowToggle1}
                        >
                          Next
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </>
                      )
                    : (
                <>
                  {isWorkFlowActive2
                    ? (
                    <>
                      <div className={`${workFlowStyle.workFlowCard}`}>
                        <Grid container spacing={3} alignItems={'center'}>
                          <Grid item xs>
                            <div className={`${workFlowStyle.workFlowCardInfo}`}>
                              <span className={`${workFlowStyle.stepCount}`}>2/7</span>
                              <h3>Define business data sources</h3>
                              <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,</p>
                            </div>
                          </Grid>
                          <Grid item xs="auto">
                            <div className={`${workFlowStyle.workFlowCardMedia}`}>
                              <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/business_Data_Sources_Purple.png" width={183} height={150} alt="Define business data sources" />
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                      <div className={`${workFlowStyle.workFlowBtm}`}>
                        <Grid container spacing={3} justifyContent={'space-between'}>
                          <Grid item xs="auto">
                            <Button
                              color="primary"
                              variant="outlined"
                              startIcon={<WestIcon />}
                              onClick={handleWorkFlowToggle1}
                            >
                              Previous
                            </Button>
                          </Grid>
                          <Grid item xs="auto">
                            <Button
                              color="primary"
                              variant="outlined"
                              endIcon={<EastIcon />}
                              onClick={handleWorkFlowToggle2}
                            >
                              Next
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </>
                      )
                    : (
                    <>
                      {isWorkFlowActive3
                        ? (
                        <>
                          <div className={`${workFlowStyle.workFlowCard}`}>
                            <Grid container spacing={3} alignItems={'center'}>
                              <Grid item xs>
                                <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                  <span className={`${workFlowStyle.stepCount}`}>3/7</span>
                                  <h3>Analyze your data sources and define data quality rules</h3>
                                  <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                  <ul>
                                    <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                    <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                    <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                  </ul>
                                </div>
                              </Grid>
                              <Grid item xs="auto">
                                <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                  <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/analyze_Data_Purple.png" width={139} height={150} alt="Analyze your data sources and define data quality rules" />
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                          <div className={`${workFlowStyle.workFlowBtm}`}>
                            <Grid container spacing={3} justifyContent={'space-between'}>
                              <Grid item xs="auto">
                                <Button
                                  color="primary"
                                  variant="outlined"
                                  startIcon={<WestIcon />}
                                  onClick={handleWorkFlowToggle2}
                                >
                                  Previous
                                </Button>
                              </Grid>
                              <Grid item xs="auto">
                                <Button
                                  color="primary"
                                  variant="outlined"
                                  endIcon={<EastIcon />}
                                  onClick={handleWorkFlowToggle3}
                                >
                                  Next
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        </>
                          )
                        : (
                        <>
                          {isWorkFlowActive4
                            ? (
                            <>
                              <div className={`${workFlowStyle.workFlowCard}`}>
                                <Grid container spacing={3} alignItems={'center'}>
                                  <Grid item xs>
                                    <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                      <span className={`${workFlowStyle.stepCount}`}>4/7</span>
                                      <h3>Define business data points or Glossary</h3>
                                      <p>Contrary to popular belief, Lorem Ipsum is not simply random text</p>
                                    </div>
                                  </Grid>
                                  <Grid item xs="auto">
                                    <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                      <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/data_Glossary_Purple.png" width={149} height={150} alt="Define business data points or Glossary" />
                                    </div>
                                  </Grid>
                                </Grid>
                              </div>
                              <div className={`${workFlowStyle.workFlowBtm}`}>
                                <Grid container spacing={3} justifyContent={'space-between'}>
                                  <Grid item xs="auto">
                                    <Button
                                      color="primary"
                                      variant="outlined"
                                      startIcon={<WestIcon />}
                                      onClick={handleWorkFlowToggle3}
                                    >
                                      Previous
                                    </Button>
                                  </Grid>
                                  <Grid item xs="auto">
                                    <Button
                                      color="primary"
                                      variant="outlined"
                                      endIcon={<EastIcon />}
                                      onClick={handleWorkFlowToggle4}
                                    >
                                      Next
                                    </Button>
                                  </Grid>
                                </Grid>
                              </div>
                            </>
                              )
                            : (
                            <>
                              {isWorkFlowActive5
                                ? (
                                <>
                                  <div className={`${workFlowStyle.workFlowCard}`}>
                                    <Grid container spacing={3} alignItems={'center'}>
                                      <Grid item xs>
                                        <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                          <span className={`${workFlowStyle.stepCount}`}>5/7</span>
                                          <h3>Define business model or the feature set or the project you want to implement</h3>
                                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                          <ul>
                                            <li><strong>Sub-title:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</li>
                                            <li><strong>Sub-title:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</li>
                                            <li><strong>Sub-title:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</li>
                                          </ul>
                                        </div>
                                      </Grid>
                                      <Grid item xs="auto">
                                        <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                          <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/business_Model_Purple.png" width={149} height={150} alt="Define business model or the feature set or the project you want to implement" />
                                        </div>
                                      </Grid>
                                    </Grid>
                                  </div>
                                  <div className={`${workFlowStyle.workFlowBtm}`}>
                                    <Grid container spacing={3} justifyContent={'space-between'}>
                                      <Grid item xs="auto">
                                        <Button
                                          color="primary"
                                          variant="outlined"
                                          startIcon={<WestIcon />}
                                          onClick={handleWorkFlowToggle4}
                                        >
                                          Previous
                                        </Button>
                                      </Grid>
                                      <Grid item xs="auto">
                                        <Button
                                          color="primary"
                                          variant="outlined"
                                          endIcon={<EastIcon />}
                                          onClick={handleWorkFlowToggle5}
                                        >
                                          Next
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </div>
                                </>
                                  )
                                : (
                                <>
                                  {isWorkFlowActive6
                                    ? (
                                    <>
                                      <div className={`${workFlowStyle.workFlowCard}`}>
                                        <Grid container spacing={3} alignItems={'center'}>
                                          <Grid item xs>
                                            <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                              <span className={`${workFlowStyle.stepCount}`}>6/7</span>
                                              <h3>Define Mapping specification to map your model to the sources (T2S)</h3>
                                              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                            </div>
                                          </Grid>
                                          <Grid item xs="auto">
                                            <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                              <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/define_Mapping_Purple.png" width={111} height={150} alt="Define Mapping specification to map your model to the sources (T2S)" />
                                            </div>
                                          </Grid>
                                        </Grid>
                                      </div>
                                      <div className={`${workFlowStyle.workFlowBtm}`}>
                                        <Grid container spacing={3} justifyContent={'space-between'}>
                                          <Grid item xs="auto">
                                            <Button
                                              color="primary"
                                              variant="outlined"
                                              startIcon={<WestIcon />}
                                              onClick={handleWorkFlowToggle5}
                                            >
                                              Previous
                                            </Button>
                                          </Grid>
                                          <Grid item xs="auto">
                                            <Button
                                              color="primary"
                                              variant="outlined"
                                              endIcon={<EastIcon />}
                                              onClick={handleWorkFlowToggle6}
                                            >
                                              Next
                                            </Button>
                                          </Grid>
                                        </Grid>
                                      </div>
                                    </>
                                      )
                                    : (
                                    <>
                                      {isWorkFlowActive7
                                        ? (
                                        <>
                                          <div className={`${workFlowStyle.workFlowCard}`}>
                                            <Grid container spacing={3} alignItems={'center'}>
                                              <Grid item xs>
                                                <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                                  <span className={`${workFlowStyle.stepCount}`}>7/7</span>
                                                  <h3>Happy Exploration!</h3>
                                                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                                </div>
                                              </Grid>
                                              <Grid item xs="auto">
                                                <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                                  <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/happy_Exploration_Purple.png" width={140} height={150} alt="Happy Exploration!" />
                                                </div>
                                              </Grid>
                                            </Grid>
                                          </div>
                                          <div className={`${workFlowStyle.workFlowBtm}`}>
                                            <Grid container spacing={3} justifyContent={'space-between'}>
                                              <Grid item xs="auto">
                                                <Button
                                                  color="primary"
                                                  variant="outlined"
                                                  startIcon={<WestIcon />}
                                                  onClick={handleWorkFlowToggle6}
                                                >
                                                  Previous
                                                </Button>
                                              </Grid>
                                              <Grid item xs="auto">
                                                <Button
                                                  color="primary"
                                                  variant="outlined"
                                                  endIcon={<EastIcon />}
                                                  onClick={handleWorkFlowToggle7}
                                                >
                                                  See Advanced Topics
                                                </Button>
                                              </Grid>
                                            </Grid>
                                          </div>
                                        </>
                                          )
                                        : (
                                        <>
                                          {isWorkFlowActive8
                                            ? (
                                            <>
                                              <div className={`${workFlowStyle.workFlowCard}`}>
                                                <Grid container spacing={3} alignItems={'center'}>
                                                  <Grid item xs>
                                                    <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                                      <span className={`${workFlowStyle.stepCount}`}>1/4</span>
                                                      <h3>Identify duplicated information across sources (data mastering)</h3>
                                                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                                    </div>
                                                  </Grid>
                                                  <Grid item xs="auto">
                                                    <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                                      <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/data_Mastering_Purple.png" width={157} height={150} alt="Identify duplicated information across sources (data mastering)" />
                                                    </div>
                                                  </Grid>
                                                </Grid>
                                              </div>
                                              <div className={`${workFlowStyle.workFlowBtm}`}>
                                                <Grid container spacing={3} justifyContent={'space-between'}>
                                                  <Grid item xs="auto">
                                                    <Button
                                                      color="primary"
                                                      variant="outlined"
                                                      startIcon={<WestIcon />}
                                                      onClick={handleWorkFlowToggle7}
                                                    >
                                                      Go Back
                                                    </Button>
                                                  </Grid>
                                                  <Grid item xs="auto">
                                                    <Button
                                                      color="primary"
                                                      variant="outlined"
                                                      endIcon={<EastIcon />}
                                                      onClick={handleWorkFlowToggle8}
                                                    >
                                                      Next
                                                    </Button>
                                                  </Grid>
                                                </Grid>
                                              </div>
                                            </>
                                              )
                                            : (
                                            <>
                                              {isWorkFlowActive9
                                                ? (
                                                <>
                                                  <div className={`${workFlowStyle.workFlowCard}`}>
                                                    <Grid container spacing={3} alignItems={'center'}>
                                                      <Grid item xs>
                                                        <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                                          <span className={`${workFlowStyle.stepCount}`}>2/4</span>
                                                          <h3>Define Data Hierarchies</h3>
                                                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                                          <ul>
                                                            <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                                            <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                                            <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                                          </ul>
                                                        </div>
                                                      </Grid>
                                                      <Grid item xs="auto">
                                                        <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                                          <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/data_Hierarchies_Purple.png" width={166} height={150} alt="Define Data Hierarchies" />
                                                        </div>
                                                      </Grid>
                                                    </Grid>
                                                  </div>
                                                  <div className={`${workFlowStyle.workFlowBtm}`}>
                                                    <Grid container spacing={3} justifyContent={'space-between'}>
                                                      <Grid item xs="auto">
                                                        <Button
                                                          color="primary"
                                                          variant="outlined"
                                                          startIcon={<WestIcon />}
                                                          onClick={handleWorkFlowToggle8}
                                                        >
                                                          Previous
                                                        </Button>
                                                      </Grid>
                                                      <Grid item xs="auto">
                                                        <Button
                                                          color="primary"
                                                          variant="outlined"
                                                          endIcon={<EastIcon />}
                                                          onClick={handleWorkFlowToggle9}
                                                        >
                                                          Next
                                                        </Button>
                                                      </Grid>
                                                    </Grid>
                                                  </div>
                                                </>
                                                  )
                                                : (
                                                <>
                                                  {isWorkFlowActive10
                                                    ? (
                                                    <>
                                                      <div className={`${workFlowStyle.workFlowCard}`}>
                                                        <Grid container spacing={3} alignItems={'center'}>
                                                          <Grid item xs>
                                                            <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                                              <span className={`${workFlowStyle.stepCount}`}>3/4</span>
                                                              <h3>Populate data into operational data store or data hub</h3>
                                                              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                                            </div>
                                                          </Grid>
                                                          <Grid item xs="auto">
                                                            <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                                              <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/data_Hub_Purple.png" width={151} height={150} alt="Populate data into operational data store or data hub" />
                                                            </div>
                                                          </Grid>
                                                        </Grid>
                                                      </div>
                                                      <div className={`${workFlowStyle.workFlowBtm}`}>
                                                        <Grid container spacing={3} justifyContent={'space-between'}>
                                                          <Grid item xs="auto">
                                                            <Button
                                                              color="primary"
                                                              variant="outlined"
                                                              startIcon={<WestIcon />}
                                                              onClick={handleWorkFlowToggle9}
                                                            >
                                                              Previous
                                                            </Button>
                                                          </Grid>
                                                          <Grid item xs="auto">
                                                            <Button
                                                              color="primary"
                                                              variant="outlined"
                                                              endIcon={<EastIcon />}
                                                              onClick={handleWorkFlowToggle10}
                                                            >
                                                              Next
                                                            </Button>
                                                          </Grid>
                                                        </Grid>
                                                      </div>
                                                    </>
                                                      )
                                                    : (
                                                    <>
                                                      <div className={`${workFlowStyle.workFlowCard}`}>
                                                        <Grid container spacing={3} alignItems={'center'}>
                                                          <Grid item xs>
                                                            <div className={`${workFlowStyle.workFlowCardInfo}`}>
                                                              <span className={`${workFlowStyle.stepCount}`}>4/4</span>
                                                              <h3>Populate data into data mart or data warehouse</h3>
                                                              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                                              <ul>
                                                                <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                                                <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                                                <li><strong>Sub-title:</strong> Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                                                              </ul>
                                                            </div>
                                                          </Grid>
                                                          <Grid item xs="auto">
                                                            <div className={`${workFlowStyle.workFlowCardMedia}`}>
                                                              <Image className={`${workFlowStyle.workFlowCardIcon}`} src="/icons/workflow/data_Warehouse_Purple.png" width={201} height={150} alt="Populate data into data mart or data warehouse" />
                                                            </div>
                                                          </Grid>
                                                        </Grid>
                                                      </div>
                                                      <div className={`${workFlowStyle.workFlowBtm}`}>
                                                        <Grid container spacing={3} justifyContent={'space-between'}>
                                                          <Grid item xs="auto">
                                                            <Button
                                                              color="primary"
                                                              variant="outlined"
                                                              startIcon={<WestIcon />}
                                                              onClick={handleWorkFlowToggle10}
                                                            >
                                                              Previous
                                                            </Button>
                                                          </Grid>
                                                          <Grid item xs="auto">
                                                          <Button
                                                              color="primary"
                                                              variant="outlined"
                                                              endIcon={<EastIcon />}
                                                              onClick={handleClose}
                                                            >
                                                              Finish
                                                            </Button>
                                                          </Grid>
                                                        </Grid>
                                                      </div>
                                                    </>
                                                      )}
                                                </>
                                                  )}
                                            </>
                                              )}
                                        </>
                                          )}
                                    </>
                                      )}
                                </>
                                  )}
                            </>
                              )}
                        </>
                          )}
                    </>
                      )}
                </>
                      )}
                </>
                  )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
