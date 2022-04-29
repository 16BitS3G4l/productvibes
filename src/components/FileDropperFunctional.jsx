// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { gql, useMutation, useLazyQuery } from '@apollo/client';

import {
  Card,
  Layout,
  EmptyState,
  ChoiceList,
  ProgressBar,
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
import { ResourcePicker, Toast } from '@shopify/app-bridge/actions';

// import useMutation from 'react';
import {useState} from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

export function FileDropperFunctional (props) {
  const app = useAppBridge();

  
  const STAGED_UPLOADS_CREATE = gql`
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        resourceUrl
        url
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const FILE_CREATE = gql`
mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      alt
      ... on GenericFile {
        url
        id
      }
    }
    userErrors {
      field
      message
    }
  }
}

`;

const FILE_GET_AFTER_CREATION = gql`
query getFileUrl($id: ID!) {
  node(id: $id) {
      ... on GenericFile {
          id
          url
      }
  }
}
`;

// console.log(shop)

  const [getFileUrl, { data: fileDataReturned  }] = useLazyQuery(FILE_GET_AFTER_CREATION);

  const [stagedUploadsCreate] = useMutation(STAGED_UPLOADS_CREATE);
  const [fileCreate] = useMutation(FILE_CREATE);

  const [file_upload_progress, setProgress] = useState(0);
  const [file_upload_progress_message, setProgressMessage] = useState("Initializing");

  const [errorOccuredNow, setErrorStatusNow] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const [dropzone_files, setDropZoneFiles] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [currentPositionInFileQueue, setCurrentPosition] = useState(0);
const [lastErrorPositionInFileQueue, setCurrentErrorPosition] = useState(0);

  // function to run after submission: props.afterSubmit

  async function resumeAfterError() {
    
  }

  async function processButton() {
    var file_ids = []

    setErrorStatusNow(false)
    setLoading(true);



      // should put in control for throttle limits etc
      // 100% represents dropzone_files.length
      var progress = 0;
      for(var i = currentPositionInFileQueue; i < dropzone_files.length; i++) {
        setCurrentPosition(i);

        var file = dropzone_files[i];
        setProgressMessage("loading file: " + file.name)

        let { data } = await stagedUploadsCreate({ variables: {
          "input": [
            {
              "resource": "FILE",
              "filename": file.name,
              "mimeType": file.type,
              "fileSize": file.size.toString(),
              "httpMethod": "POST"
            }
          ]
        }})


  
        // console.log(data)
  
    const [{ url, parameters, resourceUrl }] = data.stagedUploadsCreate.stagedTargets
    // var resourceUrl = data.stagedUploadsCreate.stagedTargets
    const formData = new FormData()
  
  parameters.forEach(({name, value}) => {
    formData.append(name, value)
  })
  
  formData.append('file', file)
  
  var response;

  try {
    response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if(!response.ok) {
      setErrorStatusNow(true)
      setCurrentPosition(i+1)
      setCurrentErrorPosition(i)
      return;
    }

  } catch (err) {
      
    setErrorStatusNow(true)
    setCurrentPosition(i+1)
    setCurrentErrorPosition(i)

    return;

  }

  
  
let fileCreateData  = await fileCreate({ variables: {
    files: {
      alt: "text",
      contentType: "FILE",
      originalSource: resourceUrl
    }
  }})

  
  setProgressMessage("uploaded.")
  setProgress((i/dropzone_files.length)*100)

  var id = fileCreateData.data.fileCreate.files[0].id
  file_ids.push(id)

  
}

setProgressMessage("pulling file information");

setTimeout(async function() {

  var file_urls = [];

  setLoading(false);
  setDisabled(true);   
  
  for(var j = 0; j < file_ids.length; j++) {
  
    let resultingData = await getFileUrl({variables: {
      'id': file_ids[j]
    }})
  
    file_urls.push(resultingData.data.node.url)
    // console.log("url: " + JSON.stringify(resultingData))
  
  }

    if(props.afterSubmit != undefined) {
      props.afterSubmit(file_urls);
    }    


    

}, 1500)



      
}



function handleDropzoneDrop(files, acceptedFiles, rejectedFiles) {
  setDropZoneFiles(acceptedFiles)
}


  
  var fileUpload = !dropzone_files.length && <DropZone.FileUpload />;
  var uploadedFiles = dropzone_files.length > 0 && (
      <div style={{padding: '0'}}>
        <Stack vertical>
          {dropzone_files.map((file, index) => (
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

  
  var progressBar = loading && !errorOccuredNow && <><br></br> 
     In progress: {file_upload_progress_message}
    <ProgressBar progress={file_upload_progress}></ProgressBar>
  <br></br></>;

  var errorMessages = loading && errorOccuredNow && <><br></br>Failed uploading: <br></br> {dropzone_files[lastErrorPositionInFileQueue].name}.
  
                <p>This file exceeds the 20MB limit. If you'd like to proceed and ignore this error, please press continue.</p>
  <br></br></>;

  var proceedButton = <><br /> 
  <Button onClick={processButton} disabled={!dropzone_files.length || disabled} loading={loading && !errorOccuredNow}>Continue</Button></>;

  return (

      <>
      <DropZone onDrop={handleDropzoneDrop}>
      {uploadedFiles}
      {fileUpload}
      
   </DropZone>
      

   {errorMessages}
   {progressBar} 
   {proceedButton}
   </>

  );



}