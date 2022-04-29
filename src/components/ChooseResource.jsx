// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

// import { FileDropper } from './FileDropper';
import { Stepper } from 'react-form-stepper';

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

import {Toast} from '@shopify/app-bridge/actions';


export class ChooseResource extends Component {


  handleSelectChange(selected_resource) {

    this.setState(prevState => ({
      selected: selected_resource
    }));

    this.proceed(selected_resource)

  }



  constructor(props) {
    super(props);

    this.app = props.app;
    this.proceed = props.selectChange;

    this.state = {
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

    this.after_resource_picker = "";


    this.handleSelectChange = this.handleSelectChange.bind(this);

  }

  render() {

    
    return <>
         <Select
                label={"Resource"}
                options={this.state.options}
                onChange={this.handleSelectChange}
                value={this.state.selected}
              />


        {this.after_resource_picker}

    </>;

    }
  

}