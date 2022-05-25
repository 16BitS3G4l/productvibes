import React, { Component, useState } from 'react';

import {ProductsMajor} from '@shopify/polaris-icons';


import { FileDropper } from './FileDropper.jsx';
import { Stepper, Step } from 'react-form-stepper';

import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';


import { SelectRules } from './SelectRules.jsx';
import {
  Card,
  Icon,
  ResourceItem,
  Layout,
  EmptyState,
  Modal,
  DisplayText,
  ChoiceList,
  SkeletonBodyText,
  Button,
  TextStyle,
  Select,
  Filters,
  SkeletonPage,  
  ResourceList,
  SkeletonDisplayText, 
  TextContainer,
  TextField,
  DropZone,
  Page,
  Thumbnail,
  Stack,
  Caption,

} from "@shopify/polaris";
// import {  useAppBridge } from "@shopify/app-bridge-react";

import {ResourcePicker} from '@shopify/app-bridge/actions';

import {Toast} from '@shopify/app-bridge/actions';
// import { ChooseResource } from './ChooseResource';

import { ChooseResource } from './ChooseResource';
import { ExistingFileChooser } from './ExistingFileChooser.jsx';


export function OnboardingTest(props) {

    var app = props.app;
    var after_resource_picker = "";

    const [urlFiles, setFileUrls] = useState([]);
    const [dropzoneFiles, setDropzoneFiles] = useState([]);
    const [pageState, setPageState] = useState(props.pageState);
    const [activeStep, setActiveStep] = useState(0);
    const [resourceType, setResourceType] = useState('');
    const [selectedResources, setSelectedResources] = useState([]);
    const [options, setOptions] = useState([

        {label: 'Please select a resource to begin', value: 'placeholder'},  
        {label: 'Store', value: 'store'},
        {label: 'Collection', value: 'collection'},
        {label: 'Product', value: 'product'},
        {label: 'Variant', value: 'variant'}

    ]);

    const [selected, setSelected] = useState("placeholder");


    function transitionToCreatingRelationshipPageToExistingFiles() {
          setPageState("existing-file-relationship-content")
    }

    function transitionToCreatingRelationshipPage() {
        setPageState("relationship-content")

    }

    function handleFileUploads(data) {
          console.log("Handling file upload ... " + JSON.stringify(data))

          setFileUrls(data)
          setActiveStep(2)
          

          console.log("file urls passed to selectrules: " + urlFiles)

    }

    function goBackToSelectingResource() {
        setActiveStep(0)
    }

    function testingAction() {
        transitionToFileChooserPage()
    }

    function transitionToFileChooserPage() {
        setPageState("uploading-file-initial")


    }

    function handleResourceChosen(step) {
        setSelected(step)

        switch(step) {
            case 'store':
                setActiveStep(1)
                setResourceType("store")
            break;


      case 'collection':
        
        after_resource_picker =  "";

        const collectionPicker = ResourcePicker.create(this.app, {
            resourceType: ResourcePicker.ResourceType.Collection,
            actionVerb: "Select"
        });


        collectionPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
            setActiveStep(1);
            setSelectedResources(selection);
            setResourceType("collection");
        });

        collectionPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
    // this.handleResourceChosen("default")

        const toastOptions = {
            message: 'Please select at least one collection',
            duration: 2300,
            isError: true,
        };

        const toastError = Toast.create(app, toastOptions);
        toastError.dispatch(Toast.Action.SHOW);

    });

        collectionPicker.dispatch(ResourcePicker.Action.OPEN);
    
    break;

      case 'product':

        const productPicker = ResourcePicker.create(this.app, {
          resourceType: ResourcePicker.ResourceType.Product,
          actionVerb: ResourcePicker.ActionVerb.Select,
          options: {
            showVariants: false
          }
        });
        
        productPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
          // Do something with `selection`
          // alert()
          console.log(selection)

          setActiveStep(1)
          setSelectedResources(selection)
          setResourceType("product")
          
        });

        productPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
            // handleResourceChosen("placeholder")
            // Picker was cancelled

            const toastOptions = {
              message: 'Please select at least one product',
              duration: 2300,
              isError: true,
            };
            const toastError = Toast.create(app, toastOptions);
            toastError.dispatch(Toast.Action.SHOW);
        });
        
        
        productPicker.dispatch(ResourcePicker.Action.OPEN);

      break;

      case 'variant':

        after_resource_picker =  "";

        const variantPicker = ResourcePicker.create(app, {
          resourceType: ResourcePicker.ResourceType.ProductVariant,
          actionVerb: ResourcePicker.ActionVerb.Select
        });
        
        variantPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
         
            setActiveStep(1)
            setSelectedResources(selection)
            setResourceType("variant")

        });

        variantPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
          handleResourceChosen("default")
          
          const toastOptions = {
            message: 'Please select at least one variant',
            duration: 2300,
            isError: true,
          };
          const toastError = Toast.create(app, toastOptions);
          toastError.dispatch(Toast.Action.SHOW);
        });
        
        
        variantPicker.dispatch(ResourcePicker.Action.OPEN);

      break;


      default:
        this.after_resource_picker =  "";
        break;
        }

    }


    if(pageState == 'initial') {

    
        return <>
        <Page fullWidth={false}>
  

                <Layout>
                    <Layout.Section>
                    

                    <Card.Section>
                    <Card sectioned title={<><DisplayText size="large">Getting started</DisplayText></>} footerActionAlignment="left" secondaryFooterActions={[{destructive: false, content: "Skip tutorial", url:"/"}]} primaryFooterAction={{onAction: testingAction, content: 'Get started', destructive: false}}>

                    <br></br>
                    <p>There are 2 steps we recommend every Shopify merchant take when installing our app.</p>

                    <br></br>

                    <ol>

                    <li>Upload files and connect them to the store's products</li>
                    <li>Add the app widgets to the product page - using the Shopify theme editor</li>

                    </ol>

                    <br></br>
                    <p>Once those steps are complete, customers will automatically start seeing those widgets on product pages.</p>
                    <br></br>

                    <p>Over the next few pages, we'll provide instructions on how to get the store setup in less than 5 minutes.</p>

                    </Card>
                    
                    </Card.Section>

                    </Layout.Section>
                    
                </Layout>

                </Page>
        </>;



    } else if(pageState == 'existing-file-relationship-content') {
        
            
        var steps = [
            <>          
                <ChooseResource selectChange={handleResourceChosen} app={app} />
            </>,

            <>
                <ExistingFileChooser afterSubmit={handleFileUploads}></ExistingFileChooser>
            </>,

            <>
                <SelectRules  fileUrls={urlFiles} resourceType={resourceType} selectedOptions={selectedResources} />
            </>
        ];

        return (

        <Page >
        <Layout>
            <Layout.Section>
                <Card sectioned>
                <Stepper styleConfig={{activeBgColor: "rgba(0, 128, 96, 1)", completedBgColor: "rgba(0, 110, 82, 1)"}} steps={[{ label: 'Choose resource' }, { label: 'Choose files' }, { label: 'Select rules' }]}
                activeStep={activeStep}
        >


    </Stepper>
        {steps[activeStep]}
    </Card>
            </Layout.Section>
        </Layout>
        </Page>
            

        );




    } else if(pageState == 'relationship-content') {

        
      var steps = [
        <>          
        
        
        <ChooseResource selectChange={handleResourceChosen} app={app} />
        
        </>,

        <>
      
        <Button onClick={goBackToSelectingResource}><Icon
source={MobileBackArrowMajor}
color="base" />
</Button>
        <br /><br />

        <FileDropper afterSubmit={handleFileUploads}></FileDropper>
        </>,

        <>

        <SelectRules  fileUrls={urlFiles} resourceType={resourceType} selectedOptions={selectedResources} />

        </>

    ];

    return (

      <Page >
      <Layout>
         <Layout.Section>
            <Card sectioned>
              <Stepper styleConfig={{activeBgColor: "rgba(0, 128, 96, 1)", completedBgColor: "rgba(0, 110, 82, 1)"}} steps={[{ label: 'Choose resource' }, { label: 'Upload files' }, { label: 'Select rules' }]}
            activeStep={activeStep}
    >


</Stepper>

       {steps[activeStep]}



</Card>

         </Layout.Section>
      </Layout>
      </Page>
          

    );


    }

}
