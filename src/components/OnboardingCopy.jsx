import React, { Component, useState } from 'react';

import {ProductsMajor} from '@shopify/polaris-icons';


import { FileDropper } from './FileDropper.jsx';
import { Stepper, Step } from 'react-form-stepper';

import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';


import { gql, useMutation, useQuery } from '@apollo/client';


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


const CREATE_METAFIELD_DEFINITION = gql`
mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      id
      name
      namespace
      key
    }
    userErrors {
      field
      message
      code
    }
  }
}

`;

export function OnboardingTest(props) {

    var app = props.app;
    var after_resource_picker = "";


    var [metafieldDefinitionSet, {loading: loadingDefinition, error: errorDefinition}] = useMutation(CREATE_METAFIELD_DEFINITION);
    var [savedDefinitionState, setSavedDefinitionState] = useState(false);

    // create store definition, collection definition, product definition, and variant definition
    if(!loadingDefinition && !savedDefinitionState) {
      setSavedDefinitionState(true)


      var shopDefinition = {
        "name": "ProductVibes - List of Files of Shop",
        "namespace": "prodvibes_shop_files",
        "key": "file_direct_urls",
        "description": "A list of files connected to the shop resource.",
        "type": "json",
        "ownerType": "SHOP"
      }


      metafieldDefinitionSet({
        variables: {
          'definition': shopDefinition
        }
      })

      var collectionDefinition = {
        "name": "ProductVibes - List of Files of Collection",
        "namespace": "prodvibes_coll_files",
        "key": "file_direct_urls",
        "description": "A list of files connected to the collection resource.",
        "type": "json",
        "ownerType": "COLLECTION"
      }
      
      metafieldDefinitionSet({
        variables: {
          'definition': collectionDefinition
        }
      })

      var productDefinition = {
        "name": "ProductVibes - List of Files of Product",
        "namespace": "prodvibes_prod_files",
        "key": "file_direct_urls",
        "description": "A list of files connected to the product resource.",
        "type": "json",
        "ownerType": "PRODUCT"
      }

      metafieldDefinitionSet({
        variables: {
          'definition': productDefinition
        }
      })
      

      var variantDefinition = {
        "name": "ProductVibes - List of Files of Variants",
        "namespace": "prodvibes_var_files",
        "key": "file_direct_urls",
        "description": "A list of files connected to the variant resource.",
        "type": "json",
        "ownerType": "PRODUCTVARIANT"
      }

      metafieldDefinitionSet({
        variables: {
          'definition': variantDefinition
        }
      })


      // needs to reach this point (until then, don't show UI)



    }


    const [selectedMetafieldImportApp, setSelectedMetafieldImportApp] = useState("hulk");
    const [selectedMetafieldImportApps, setSelectedMetafieldImportApps] = useState([{label: "Hulk Metafields", value: "hulk"}, {label: "Metafields Manager", value: 'meta-manager'}]);
    const [metafieldImportSelect, setMetafieldImportSelect] = useState(<></>);
    const [selectedUploadType, setSelectedUploadType] = useState("default");
    const [selectedUploadTypes, setSelectedUploadTypes] = useState([{label: "Select a value", value: "default"}, {label: "Upload manually", value: "upload"},{value: "upload-existing", label: "Choose from existing files"}, {value: "import-metafields", label: "Import from metafields app"}]);
    const [uploadFilesDisabled, setUploadFilesDisabled] = useState(true);

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

    function transitionToCreatingRelationshipPage() {
      setPageState("existing-file-relationship-content")
    }

    function transitionToCreatingRelationshipPageToExistingFiles() {
      setPageState("relationship-content")
    }

    function handleFileUploadChosen() {
      switch(selectedUploadType) {
          case 'upload':
            transitionToCreatingRelationshipPage();  
          break;
  
          case 'upload-existing':
            transitionToCreatingRelationshipPageToExistingFiles();
            break;
      }
    }

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

    function handleFileUploadTypeChange(value) {

      if(value == 'default') {
        
        setSelectedUploadType(value);
        setUploadFilesDisabled(true)
        setMetafieldImportSelect(<></>);
        
      } else if(value == 'import-metafields') {
         

          var markup = <>
            
            <br></br>
  
            <Select 
              label={"Please select a metafield app to import files from:"}
              options={selectedMetafieldImportApps}
              value={selectedMetafieldImportApp}
              onChange={onMetafieldImportChange}
            />
  
            </>
  
          ;

          setSelectedUploadType(value);
          setUploadFilesDisabled(true)
          setMetafieldImportSelect(markup);

  
      }else {
        setSelectedUploadType(value);
        setUploadFilesDisabled(false)
        setMetafieldImportSelect(<></>);
        
      }
  
      
    }

    function onMetafieldImportChange(value) {

      setSelectedMetafieldImportApp(value)
      setUploadFilesDisabled(false)

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
                    <Card  sectioned title={<><DisplayText size="large">Getting started</DisplayText></>} footerActionAlignment="left" secondaryFooterActions={[{destructive: false, content: "Skip tutorial", url:"/"}]} primaryFooterAction={{onAction: testingAction, content: 'Get started', destructive: false}}>

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



    } else if(pageState == 'uploading-file-initial') {
      return (
        
        <>
        <Page fullWidth={false}>
  

                <Layout>
                    <Layout.Section>
                    

                    <Card.Section>
                    <Card sectioned title={<><DisplayText size="large">Step 1. Upload files</DisplayText></>} footerActionAlignment="left" primaryFooterAction={{disabled: uploadFilesDisabled, onAction:handleFileUploadChosen, content: 'Upload files', destructive: false}}>

                    <br></br>
                    <p>Before uploading files, merchants should have 2 things in mind.</p>

                    <br></br>

                    <ul>

                    <li>Files can be connected to store resources - products, variants, collections, or even the entire store.</li>
                    <li>Currently, files are limited to Shopify server limits (~20MB per file). This is due to privacy and performance concerns.</li>

                    </ul>


                  <br></br>
                    <Select
                    label={"Please select a method for uploading files:"}
                      options={selectedUploadTypes}
                      value={selectedUploadType}
                      onChange={handleFileUploadTypeChange}
                    ></Select>


<br></br>

<Select 
  label={"Please select a metafield app to import files from:"}
  options={selectedMetafieldImportApps}
  value={selectedMetafieldImportApp}
  onChange={onMetafieldImportChange}
/>

                    </Card>
                    
                    </Card.Section>

                    </Layout.Section>
                    
                </Layout>

                </Page>
        </>

        );



    }else if(pageState == 'existing-file-relationship-content') {
        
            
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
