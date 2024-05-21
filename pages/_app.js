import React from 'react'
import { PageProvider } from '@/pageProvider/PageContext'
import '@/assets/css/globals.css'
import '@/assets/css/select-dropdown.css'
import '@/assets/css/responsive.css'
import PropTypes from 'prop-types'
import { TourProvider } from '@reactour/tour'
import { withApollo } from '@/client/Withapollo-client'

import { Buffer } from 'buffer'
global.Buffer = Buffer

// import { Layout } from "@/components";
// import { StateContext } from "@/context/StateContext";
const steps = [
  {
    selector: '.first-step',
    content: 'This is sidebar to navigate from one page to another page'
  },
  {
    selector: '.secondStep',
    content: 'please select namespace'
  },
  {
    selector: '.thirdStep',
    content: 'please select subjectarea'
  },
  {
    selector: '.fourthStep',
    content: 'please select entity'
  },
  {
    selector: '.fifthStep',
    content: 'this is toolbar'
  },
  {
    selector: '.sixthStep',
    content: 'this is meta table'
  }
]
function App ({ Component, pageProps }) {
  return (
      <>
        <PageProvider>
          <TourProvider
            steps={steps}
            styles={{
              popover: (base) => ({
                ...base,
                '--reactour-accent': 'var(--primary)',
                borderRadius: '4px'
              }),
              maskArea: (base) => ({ ...base, rx: '4px' }),
              maskWrapper: (base) => ({ ...base, color: 'rgba(0,0,0,0.5)' }),
              badge: (base) => ({ ...base, left: 'auto', right: '-0.8125em' }),
              controls: (base) => ({ ...base, marginTop: 40 }),
              close: (base) => ({ ...base, right: 'auto', left: 8, top: 8 })
            }}
            onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
              if (steps) {
                if (currentStep === steps.length - 1) {
                  setIsOpen(false)
                }
                setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
              }
            }}
          >
            <Component {...pageProps} />
          </TourProvider>
        </PageProvider>
      </>
  )
}
App.propTypes = {
  pageProps: PropTypes.object,
  Component: PropTypes.func.isRequired
}
export default withApollo(App)
