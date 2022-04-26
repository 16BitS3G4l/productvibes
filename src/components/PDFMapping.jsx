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
          <Layout.AnnotatedSection title='Step 2: Upload the PDF(s) that should show up for this resource:'>


            <Card sectioned>

            <FileDropper afterSubmit={this.doSomething} />
            
          
            </Card>

          </Layout.AnnotatedSection>

          
        </>;
      break;


      case 'collection':

      break;

      case 'product':

      break;

      case 'variant':

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
      console.log(component)
      component.setState(prevState => ({
        pageState: 'relationship-content'
      }))
    }, 450, this)
  }


  constructor(props) {
    super(props);

  
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
        heading="Manage complicated PDF-resource relationships."
        action={{content: 'Create a relationship', onAction: this.transitionToCreatingRelationshipPage}}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>When you need more fine tuned control over specific PDFs (like setting a single PDF for the entire store).</p>
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
            <Layout.AnnotatedSection title='Step 1: Choose a resource'>
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