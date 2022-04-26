// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { FileDropper } from './FileDropper';

import {
  Card,
  Layout,
  EmptyState,
  ChoiceList,
  SkeletonPage,
  SkeletonBodyText,
  Button,
  Select,
  TextField,
  DropZone,
  Thumbnail,
  Stack,
  Caption
} from "@shopify/polaris";
// import {  useAppBridge } from "@shopify/app-bridge-react";

import {ResourcePicker} from '@shopify/app-bridge/actions';


export class PDFMapping extends Component {

  
  doSomething() {

    alert()
    

    this.after_resource_picker = <>
        sdf

        
      </>;



    }

  handleSelectChange(e) {

    this.setState(prevState => ({
      selected: e
    }));



    switch(e) {
      case 'store':
        

        
        this.after_resource_picker = <>
          <Layout.AnnotatedSection title='Step 2: Upload PDF(s):' description="These PDFs will be accessible across the entire store.">


            <Card sectioned>

            <FileDropper afterSubmit={this.doSomething} />
            
          
            </Card>

          </Layout.AnnotatedSection>

          
        </>;
        
      break;


      case 'collection':
        this.after_resource_picker =  "";

const collectionPicker = ResourcePicker.create(this.app, {
  resourceType: ResourcePicker.ResourceType.Collection,
  actionVerb: ResourcePicker.ActionVerb.Select
});

collectionPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
  // Do something with `selection`
  
});
collectionPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
  this.handleSelectChange("default");
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
          
        });
        productPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
          this.handleSelectChange("default");
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
          
        });
        variantPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
          this.handleSelectChange("default");
          // Picker was cancelled
        });
        
        
        variantPicker.dispatch(ResourcePicker.Action.OPEN);

      break;


      default:
        this.after_resource_picker =  "";
        break;

    }
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
  }


  constructor(props) {
    super(props);

    this.app = props.app;

  
    this.state = {
        dropzone_files: [],
        pageState: props.pageState,
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
    this.handleSelectChange = this.handleSelectChange.bind(this);

  }

  render() {

    
    if(this.state.pageState == "initial") {


        return (
        
    <Card sectioned>
      <EmptyState
        heading="Upload PDF for Products"
        action={{content: 'Upload PDF', onAction: this.transitionToCreatingRelationshipPage}}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>When you want PDFs to show up on store pages - on a certain variant, product, collection (or even across the store) </p>
      </EmptyState>
  </Card>

        );

    } else if(this.state.pageState == "loading-relationship-content") {
      

        return (
<SkeletonPage fullWidth primaryAction>
   <Layout>
     <Layout.AnnotatedSection>
       <Card sectioned>
         <SkeletonBodyText />
      </Card>
     </Layout.AnnotatedSection>
     </Layout>
 </SkeletonPage>
        );

    } else if(this.state.pageState == "relationship-content") {
      return (

        <Layout>
            <Layout.AnnotatedSection title='Step 1: Choose a resource' description="Choose the resource you want these PDF(s) to be accessible on. ">
              <Card sectioned>
        
              
                <Select
                label="Resource"
                options={this.state.options}
                onChange={this.handleSelectChange}
                value={this.state.selected}
              />
        
        
             
              </Card>
            </Layout.AnnotatedSection>

            {this.after_resource_picker}

            </Layout>

            

      );
    } else if(this.state.pageState == "list-relationships") {

    }

    }
  

}