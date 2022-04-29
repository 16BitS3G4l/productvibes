// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { FileDropperFunctional } from './FileDropperFunctional.jsx';
import { Stepper, Step } from 'react-form-stepper';

import {
  Card,
  Layout,
  EmptyState,
  ChoiceList,
  SkeletonBodyText,
  Button,
  Select,
  SkeletonPage,  
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

export class PDFMappingCopy extends Component {



  handleResourceChosen(step) {

    this.setState(prevState => ({
      selected: step,
    }));



    switch(step) {
      case 'store':
        this.setState(prevState => ({
          activeStep: 1,
          resourceType: "store",
        }));
        
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
    resourceType: "collection",
  }));  
  
});
collectionPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
  // this.handleResourceChosen("default")

  // Picker was cancelled
});


collectionPicker.dispatch(ResourcePicker.Action.OPEN);

      break;

      case 'product':

        this.after_resource_picker =  "";

        const productPicker = ResourcePicker.create(this.app, {
          resourceType: ResourcePicker.ResourceType.Product,
          actionVerb: ResourcePicker.ActionVerb.Select
        });
        
        productPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
          // Do something with `selection`
          // alert()
          this.setState(prevState => ({
            activeStep: 1,
            resourceType: "product"
          }));
        });
        productPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
            this.handleResourceChosen("default")
            // Picker was cancelled
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
            resourceType: "variant"
          }));
          
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
      }));
  }
  
  transitionToCreatingRelationshipPage() {

    this.setState(prevState => ({
      pageState: 'loading-relationship-content'
    }))

    setTimeout(function(component) {
      // console.log(component)
      component.setState(prevState => ({
        pageState: 'relationship-content'
      }))
    }, 450, this)

    // this.setState(prevState => ({
    //   pageState: 'relationship-content'
    // }))
  }


  handleFileUploads(data) {
    console.log(data)
    // overwrites files for a product


    this.setState(prevState => ({
      activeStep: 2
    }))
  }

  constructor(props) {
    super(props);

    this.app = props.app;

  
    this.after_resource_picker = "";

    this.state = {
        dropzone_files: [],
        pageState: props.pageState,
        activeStep: 0,
        resourceType: '',
        options: [   
        {label: 'Please select a resource to begin', value: 'placeholder'},  
        {label: 'Store', value: 'store'},
        {label: 'Collection', value: 'collection'},
        {label: 'Product', value: 'product'},
        {label: 'Variant', value: 'variant'},
    ],
        onChange: this.handleSelectChange,
        selected: "lastWeek"

    }


    this.transitionToCreatingRelationshipPage = this.transitionToCreatingRelationshipPage.bind(this);
    this.handleResourceChosen = this.handleResourceChosen.bind(this);
    this.goBackToSelectingResource = this.goBackToSelectingResource.bind(this);
    this.handleFileUploads = this.handleFileUploads.bind(this);

  }

  render() {

    
    if(this.state.pageState == "initial") {


        return (
        
    <Card sectioned>
      <EmptyState
        heading="Link PDFs to Products"
        action={{content: 'Upload PDF', onAction: this.transitionToCreatingRelationshipPage}}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>When you want PDFs to show up on store pages - on a certain variant, product, collection (or even across the store) - upload them here. </p>
      </EmptyState>
  </Card>

        );

    } else if(this.state.pageState == "loading-relationship-content") {
      
       

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

    } else if(this.state.pageState == "relationship-content") {


      var steps = [
          <>          
          
          
          <ChooseResource selectChange={this.handleResourceChosen} app={this.app} />
          
          </>,

          <>
        
          <Button onClick={this.goBackToSelectingResource}>Back</Button>
          <br /><br />

          Select the files you want to connect to this {this.state.resourceType}
          <FileDropperFunctional afterSubmit={this.handleFileUploads}></FileDropperFunctional>
          </>,

          <>
confirmed!

          </>

      ];

      return (

        <Page >
        <Layout>
           <Layout.Section>
              <Card sectioned>
                <Stepper styleConfig={{activeBgColor: "rgba(0, 128, 96, 1)", completedBgColor: "rgba(0, 110, 82, 1)"}} steps={[{ label: 'Choose resource' }, { label: 'Upload files' }, { label: 'Select rules' }]}
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