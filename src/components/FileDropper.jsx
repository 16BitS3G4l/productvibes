// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';


import {
  Card,
  Layout,
  EmptyState,
  ChoiceList,
  Button,
  SkeletonPage,
  SkeletonBodyText,
  Select,
  TextField,
  DropZone,
  Thumbnail,
  Stack,
  Caption
} from "@shopify/polaris";


export class FileDropper extends Component {

  handleDropzoneDrop(files, acceptedFiles, rejectedFiles) {
    console.log(files)
  

    this.setState((state, props) => {
      return {dropzone_files: files}
    });

    
    }


    processButton() {

        this.setState(prevState => ({
            loading: true,
          }));

          console.log("processing")

          if(this.afterFilesProcessed != undefined) {
              this.afterFilesProcessed();
          }


          this.setState(prevState => ({
            loading: false,
            disabled: true,
          }));

        
    }


  constructor(props) {
    super(props);


    this.afterFilesProcessed = props.afterSubmit;

    console.log(props)
    console.log(this.afterFilesProcessed)

    this.state = {
        disabled: false,
        dropzone_files: [],
        loading: false,
    }


    this.handleDropzoneDrop = this.handleDropzoneDrop.bind(this);
    this.processButton = this.processButton.bind(this);



    }

    render() {

        var fileUpload = !this.state.dropzone_files.length && <DropZone.FileUpload />;
        var uploadedFiles = this.state.dropzone_files.length > 0 && (
            <div style={{padding: '0'}}>
              <Stack vertical>
                {this.state.dropzone_files.map((file, index) => (
                  <Stack alignment="center" key={index}>
                    <Thumbnail
                      size="small"
                      alt={file.name}
                      source={
                        NoteMinor
                      }
                    />
                    <div>
                      {file.name} <Caption>{file.size} bytes</Caption>
                    </div>
                  </Stack>
                ))}
              </Stack>
            </div>
        );

        
        var proceedButton = <><br /> 
        <Button onClick={this.processButton} disabled={!this.state.dropzone_files.length || this.state.disabled} loading={this.state.loading}>Continue</Button></>;

        return (

            <>
            <DropZone onDrop={this.handleDropzoneDrop} accept="application/pdf">
            {uploadedFiles}
            {fileUpload}
         </DropZone>
            
         {proceedButton}
         </>

        );


    }
  

}