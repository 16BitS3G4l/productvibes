// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { FileDropper } from './FileDropper.jsx';
import { Stepper, Step } from 'react-form-stepper';

import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';



import { SelectRules } from './SelectRules.jsx';
import {
  Card,
  Icon,
  Layout,
  EmptyState,
  Modal,
  ChoiceList,
  SkeletonBodyText,
  Button,
  Select,
  DisplayText,
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

export class Onboarding extends Component {



  handleResourceChosen(step) {

    this.setState(prevState => ({
      selected: step,
    }), () => console.log(this.state));



    switch(step) {
      case 'store':
        this.setState(prevState => ({
          activeStep: 1,
          resourceType: "store",
        }), () => console.log(this.state));
        
      break;


      case 'collection':
        
      this.after_resource_picker =  "";

const collectionPicker = ResourcePicker.create(this.app, {
  resourceType: ResourcePicker.ResourceType.Collection,
  actionVerb: "Select"
});


collectionPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
  // Do something with `selection`
  this.setState(prevState => ({
    activeStep: 1,
    selected_resources: selection,    
    resourceType: "collection",
  }), () => console.log(this.state));  
  
});
collectionPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
  // this.handleResourceChosen("default")

  const toastOptions = {
    message: 'Please select at least one collection',
    duration: 2300,
    isError: true,
  };
  const toastError = Toast.create(this.app, toastOptions);
  toastError.dispatch(Toast.Action.SHOW);

  // Picker was cancelled
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
          this.setState(prevState => ({
            activeStep: 1,
            selected_resources: selection,
            resourceType: "product"
          }), () => console.log(this.state));
        });
        productPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
            // handleResourceChosen("placeholder")
            // Picker was cancelled

            const toastOptions = {
              message: 'Please select at least one product',
              duration: 2300,
              isError: true,
            };
            const toastError = Toast.create(this.app, toastOptions);
            toastError.dispatch(Toast.Action.SHOW);
        });
        
        
        productPicker.dispatch(ResourcePicker.Action.OPEN);

      break;

      case 'variant':

        this.after_resource_picker =  "";

        const variantPicker = ResourcePicker.create(this.app, {
          resourceType: ResourcePicker.ResourceType.ProductVariant,
          actionVerb: ResourcePicker.ActionVerb.Select
        });
        
        variantPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
          // Do something with `selection`
          console.log(selection)

          this.setState(prevState => ({
            activeStep: 1,
            selected_resources: selection,
            resourceType: "variant"
          }), () => console.log(this.state));
          
        });
        variantPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
          this.handleResourceChosen("default")
          // Picker was cancelled

          
          const toastOptions = {
            message: 'Please select at least one variant',
            duration: 2300,
            isError: true,
          };
          const toastError = Toast.create(this.app, toastOptions);
          toastError.dispatch(Toast.Action.SHOW);
        });
        
        
        variantPicker.dispatch(ResourcePicker.Action.OPEN);

      break;


      default:
        this.after_resource_picker =  "";
        break;

    }
  }


  goBackToSelectingResource() {
      this.setState(prevState => ({
        activeStep: 0
      }), () => console.log(this.state));
  }
  

  transitionToCreatingRelationshipPageToExistingFiles() {
    this.setState(prevState => ({
      pageState: 'loading-relationship-content'
    }))

    setTimeout(function(component) {
      // console.log(component)
      component.setState(prevState => ({
        pageState: 'existing-file-relationship-content'
      }))
    }, 450, this)

    // setTimeout(function(component) {
    //   // console.log(component)
    //   component.setState(prevState => ({
    //     pageState: 'relationship-content'
    //   }))
    // }, 450, this)
  }

    testingAction() {
        this.transitionToFileChooserPage()
    }


  transitionToCreatingRelationshipPage() {


    // alert(location)
    // this.setState(prevState => ({
    //   pageState: 'loading-relationship-content'
    // }), () => console.log(this.state))

    this.setState(prevState => ({
      pageState: 'relationship-content'
    }))

    // setTimeout(function(component) {
    //   // console.log(component)
    //   component.setState(prevState => ({
    //     pageState: 'uploading-file-initial'
    //   }))
    // }, 450, this)

    // this.setState(prevState => ({
    //   pageState: 'relationship-content'
    // }))
  }

  transitionToFileChooserPage() {


    // alert(location)
    // this.setState(prevState => ({
    //   pageState: 'loading-relationship-content'
    // }), () => console.log(this.state))

    this.setState(prevState => ({
      pageState: 'uploading-file-initial'
    }))

    // setTimeout(function(component) {
    //   // console.log(component)
    //   component.setState(prevState => ({
    //     pageState: 'uploading-file-initial'
    //   }))
    // }, 450, this)

    // this.setState(prevState => ({
    //   pageState: 'relationship-content'
    // }))
  }


  handleFileUploads(data) {
    console.log(data)
    // overwrites files for a product


    this.setState(prevState => ({
      activeStep: 2,
      file_urls: data
    }), () => console.log(this.state))
  }

  handleFileUploadTypeChange(value) {
    if(value == 'default') {
      this.setState(prevState => ({
        selectedUploadType: value, 
        uploadFilesDisabled: true,
        metafieldImportSelect: <></>
      }))
    } else if(value == 'import-metafields') {
       
        var markup = <>
          
          <br></br>

          <Select 
            label={"Please select a metafield app to import files from:"}
            options={this.state.selectedMetafieldImportApps}
            value={this.state.selectedMetafieldImportApp}
            onChange={this.onMetafieldImportChange}
          />

          </>

        ;

        this.setState(prevState => ({
          selectedUploadType: value,
          uploadFilesDisabled: true,
          metafieldImportSelect: markup
        }));
        

    }else {
      this.setState(prevState => ({
        selectedUploadType: value, 
        uploadFilesDisabled: false,
        metafieldImportSelect: <></>
      }))
    }

    
  }


  handleFileUploadChosen() {
    switch(this.state.selectedUploadType) {
        case 'upload':
          this.transitionToCreatingRelationshipPage();  
        break;

        case 'upload-existing':
          this.transitionToCreatingRelationshipPageToExistingFiles();
          break;
    }
  }


  onMetafieldImportChange(value) {

    // alert(value)
    
    console.log(value)
    console.log(this.state.selectedMetafieldImportApp)

    this.setState(prevState => ({
      selectedMetafieldImportApp: value,
      uploadFilesDisabled: false,
    }))

    
    console.log(this.state.selectedMetafieldImportApp)
  }

  constructor(props) {
    super(props);


    this.app = props.app;

  
    this.after_resource_picker = "";

    this.state = {
        selectedMetafieldImportApp: "hulk",
        selectedMetafieldImportApps: [{label: "Hulk Metafields", value: "hulk"}, {label: "Metafields Manager", value: 'meta-manager'}],
        metafieldImportSelect: <></>,
        selectedUploadType: 'default',
        selectedUploadTypes: [{label: "Select a value", value: "default"}, {label: "Upload manually", value: "upload"},{value: "upload-existing", label: "Choose from existing files"}, {value: "import-metafields", label: "Import from metafields app"}],
        uploadFilesDisabled: true,
        file_urls: [],
        dropzone_files: [],
        pageState: props.pageState,
        activeStep: 0,
        resourceType: '',
        selected_resources: [], // only applies for variant, product, or collection
        options: [   
        {label: 'Please select a resource to begin', value: 'placeholder'},  
        {label: 'Store', value: 'store'},
        {label: 'Collection', value: 'collection'},
        {label: 'Product', value: 'product'},
        {label: 'Variant', value: 'variant'},
    ],
        onChange: this.handleSelectChange,
        selected: "placeholder"

    }


    this.transitionToCreatingRelationshipPage = this.transitionToCreatingRelationshipPage.bind(this);
    this.transitionToCreatingRelationshipPageToExistingFiles = this.transitionToCreatingRelationshipPageToExistingFiles.bind(this);

    this.handleResourceChosen = this.handleResourceChosen.bind(this);
    this.goBackToSelectingResource = this.goBackToSelectingResource.bind(this);
    this.handleFileUploads = this.handleFileUploads.bind(this);
    this.testingAction = this.testingAction.bind(this);

    this.handleFileUploadTypeChange = this.handleFileUploadTypeChange.bind(this);
    this.handleFileUploadChosen = this.handleFileUploadChosen.bind(this);

    this.transitionToFileChooserPage = this.transitionToFileChooserPage.bind(this);

    this.onMetafieldImportChange = this.onMetafieldImportChange.bind(this);

  }

  
  render() {

    
    if(this.state.pageState == "initial") {


    

        return (
        
        <>
        <Page fullWidth={false}>
  

                <Layout>
                    <Layout.Section>
                    

                    <Card.Section>
                    <Card sectioned title={<><DisplayText size="large">Getting started</DisplayText></>} footerActionAlignment="left" secondaryFooterActions={[{destructive: false, content: "Skip tutorial", url:"/"}]} primaryFooterAction={{onAction: this.testingAction, content: 'Get started', destructive: false}}>

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
        </>

        );

    } else if (this.state.pageState == 'uploading-file-initial') {


      return (
        
        <>
        <Page fullWidth={false}>
  

                <Layout>
                    <Layout.Section>
                    

                    <Card.Section>
                    <Card sectioned title={<><DisplayText size="large">Step 1. Upload files</DisplayText></>} footerActionAlignment="left" primaryFooterAction={{disabled: this.state.uploadFilesDisabled, onAction: this.handleFileUploadChosen, content: 'Upload files', destructive: false}}>

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
                      options={this.state.selectedUploadTypes}
                      value={this.state.selectedUploadType}
                      onChange={this.handleFileUploadTypeChange}
                    ></Select>


<br></br>

<Select 
  label={"Please select a metafield app to import files from:"}
  options={this.state.selectedMetafieldImportApps}
  value={this.state.selectedMetafieldImportApp}
  onChange={this.onMetafieldImportChange}
/>

                    </Card>
                    
                    </Card.Section>

                    </Layout.Section>
                    
                </Layout>

                </Page>
        </>

        );


    }else if(this.state.pageState == "loading-relationship-content") {
      
       

        return (
          <SkeletonPage primaryAction>
  <Layout>
    <Layout.Section>
      <Card sectioned>
        <SkeletonBodyText />
      </Card>
      <Card sectioned>
        <TextContainer>
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText />
        </TextContainer>
      </Card>
      <Card sectioned>
        <TextContainer>
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText />
        </TextContainer>
      </Card>
    </Layout.Section>
    <Layout.Section secondary>
      <Card>
        <Card.Section>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={1} />
        </Card.Section>
      </Card>
      <Card subdued>
        <Card.Section>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={2} />
        </Card.Section>
      </Card>
    </Layout.Section>
  </Layout>
</SkeletonPage>
        );

    } else if(this.state.pageState == "existing-file-relationship-content") {



      var steps = [
        
        <>
      
        <ExistingFileChooser afterSubmit={this.handleFileUploads}></ExistingFileChooser>
        </>,
        
        <>          
        
        
        <ChooseResource selectChange={this.handleResourceChosen} app={this.app} />
        
        </>,

        <>

        <SelectRules  fileUrls={this.state.file_urls} resourceType={this.state.resourceType} selectedOptions={this.state.selected_resources} />

        </>

    ];

    return (

      <Page fullWidth={false}>
  

                <Layout>
                  <Layout.Section>

                  <Card sectioned>
              <Stepper styleConfig={{activeBgColor: "rgba(0, 128, 96, 1)", completedBgColor: "rgba(0, 110, 82, 1)"}} steps={[{ label: 'Choose files' }, { label: 'Choose resource' }, { label: 'Select rules' }]}
            activeStep={this.state.activeStep}
    >


              </Stepper>




       
              {steps[this.state.activeStep]}               



              </Card>
       


                  </Layout.Section>
       
                </Layout>

                </Page>


          

    );





    }else if(this.state.pageState == "relationship-content") {


      var steps = [

        <>
        
        <br /><br />

        <FileDropper afterSubmit={this.handleFileUploads}></FileDropper>
        </>,

          <>          
          
          
          <ChooseResource selectChange={this.handleResourceChosen} app={this.app} />
          
          </>,

          <>

          <SelectRules  fileUrls={this.state.file_urls} resourceType={this.state.resourceType} selectedOptions={this.state.selected_resources} />

          </>

      ];

      return (

        <Page >
        <Layout>
           <Layout.Section>
              <Card sectioned>
                <Stepper styleConfig={{activeBgColor: "rgba(0, 128, 96, 1)", completedBgColor: "rgba(0, 110, 82, 1)"}} steps={[{ label: 'Upload files' }, { label: 'Choose resource' }, { label: 'Select rules' }]}
              activeStep={this.state.activeStep}
      >


  </Stepper>

         {steps[this.state.activeStep]}



</Card>

           </Layout.Section>
        </Layout>
        </Page>
            

      );
    } else if(this.state.pageState == "list-relationships") {

    }

    }
  

}