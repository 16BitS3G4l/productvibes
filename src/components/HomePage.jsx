import { useEffect, useState, useCallback } from "react";

import { SketchPicker } from 'react-color';

// import { Gallery as Something }  from 'react-grid-gallery';

import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  FormLayout,
  Button,
  TextField,
  CalloutCard,
  Heading,
  Tabs,
  EmptyState,
  DisplayText,
  Select,
  Badge,
  DataTable,
  ChoiceList,
  ColorPicker,
  Navigation,
  SkeletonPage,
  SkeletonBodyText
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ProductsCard } from "./ProductsCard";
import { GetStarted } from "./GetStarted";
import {Onboarding} from './Onboarding';

// import { PDFMapping } from "./PDFMapping";

import {QRCodes} from './QRCodes';

import QRCode from 'react-qr-code';

import {  useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import { EmailAttachments } from "./EmailAttachments";
// import { application } from "express";

import { PDFMapping } from "./PDFMapping";

export function HomePage() {
  


  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  
  const [applicationState, setAppState] = useState({});
  
  async function getAppState(callback) {
    const appState  = await fetch("/state-data").then((res) => res.json());
    setAppState(JSON.parse(appState[0].value))
    console.log(appState)
  }

  // getAppState()

  async function deleteAppState() {
    const { count } = await fetch("/delete-state-data").then((res) => console.log(res));
  }

  async function updateSpecificAppStateKey(key, new_value, callback) {
    console.log(applicationState)

    var newApplicationState = applicationState

    console.log(applicationState)

    newApplicationState[key] = new_value

    setAppState(newApplicationState)

    // update applicationState object

    const result = await fetch("/update-state-data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newApplicationState)

    }).then((res) => res.json())

    callback(result);

  }

  const [userWentThroughOnboardingScreen, setOnboardingSetting] = useState(true);


  var initial_onboarding = <>sdf</>;
  // getAppState()



  // getAppState();

  // updateSpecificAppStateKey("sdf", 45)
  // console.log(applicationState)

  const [selected, setSelected ] = useState(0);
    const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );


  var instructionsTabContent = <>
      <GetStarted />
  </>;

  
  var qrcodesTabContent = <>
  
      <QRCodes />


  </>;
  
  var emailAttachmentsTabContent = <>
      <EmailAttachments></EmailAttachments>
  </>;
  


  var fileMappingTab = <>
    <Page fullWidth="false">
      <PDFMapping app={app} pageState="initial" />
    </Page>
  </>;


  

  const [color, setColor] = useState({
    hue: 300,
    brightness: 1,
    saturation: 0.7,
    alpha: 0.7,
  });

  // <>'Settings / Customization'</>

  var settingsTabTop = <>Settings / Customization</>;

  var settingsTabContent = <>

    <Layout.AnnotatedSection title='Sticky Button'>

    <Card sectioned></Card>


    <Card title="Sticky Button" sectioned>
    

    <SketchPicker ></SketchPicker>

    <br /><br />

    </Card>

    </Layout.AnnotatedSection>
    
  </>;

var helpTabTop = <>Helpdesk / Support</>;

var helpTabContent = <>

  <Layout.AnnotatedSection title='Sticky Button'>

  <Card sectioned></Card>


  <Card title="Sticky Button" sectioned>
  

  <SketchPicker ></SketchPicker>

  <br /><br />

  </Card>

  </Layout.AnnotatedSection>
  
</>;

   // <>'Settings / Customization'</>

  //  var updatesTabTop = <>Updates <Badge>1</Badge></>;

  //  var updatesTabContent = <>
 
  //    <Layout.AnnotatedSection title='Sticky Button'>
 
  //    <Card sectioned></Card>
 
 
  //    <Card title="Sticky Button" sectioned>
     
 
  //    <SketchPicker ></SketchPicker>
 
  //    <br /><br />
 
  //    </Card>
 
  //    </Layout.AnnotatedSection>
     
  //  </>;


 
  const tabs = [

    {
      id: 'instructions-page',
      content: 'Instructions / Get Started',
      real_content: instructionsTabContent,
      accessibilityLabel: 'Instructions page',
      panelID: 'all-instructions-content-1',
    },
    
    {
      id: 'import-pdfs',
      content: 'Files',
      real_content: fileMappingTab,
      panelID: 'import-pdfs-page-1',
    },


    {
      id: 'qr-codes-page',
      content: 'QR Codes',
      real_content: qrcodesTabContent,
      panelID: 'qr-codes-page-1',
    },

    {
      id: 'email-page',
      content: 'Emails',
      real_content: emailAttachmentsTabContent,
      panelID: 'email-page-1',
    },


    {
      id: 'app-settings',
      content: [settingsTabTop],
      real_content: settingsTabContent,
      panelID: 'app-settings-page-1',
    },


    {
      id: 'app-help',
      content: [helpTabTop],
      real_content: helpTabContent,
      panelID: 'app-help-page-1'
    }

    

  ];

  
  // {
  //   id: 'app-updates',
  //   content: [updatesTabTop],
  //   real_content: updatesTabContent,
  //   panelID: 'app-updates-page-1',
  // }

  // onboarding data

  useEffect(() => {
    getAppState();


    // setOnboardingSetting(false)


    console.log(applicationState)

    if(applicationState.initial == 'not_loaded') {

      setOnboardingSetting(false)

      // mark as onboarded
      updateSpecificAppStateKey("initial", "loaded", function(data) {
        console.log("result " + JSON.stringify(data))
      });
    } 

  }, []);


  if(userWentThroughOnboardingScreen) {
    return (
      <Page fullWidth>
  
  
  
        <Layout>
          <Layout.Section>
          
  
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section>
          {tabs[selected].real_content}
          </Card.Section>
        </Tabs>
  
          </Layout.Section>
          
        </Layout>
  
  
        
      </Page>
    );
  } else {
    return (
      <><Onboarding app={app} pageState="initial" /></>
    );
  }

  
}



