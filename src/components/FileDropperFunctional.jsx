// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { gql, useMutation } from '@apollo/client';

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
import { ResourcePicker } from '@shopify/app-bridge/actions';

import {useQuery} from "@apollo/client";
// import useMutation from 'react';
import {useState} from 'react';

export function FileDropperFunctional (props) {

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

  const [stagedUploadsCreate] = useMutation(STAGED_UPLOADS_CREATE);
  const [fileCreate] = useMutation(FILE_CREATE);


  const [disabled, setDisabled] = useState(false);
  const [dropzone_files, setDropZoneFiles] = useState([]);
  const [loading, setLoading] = useState(false);
 
  // function to run after submission: props.afterSubmit

  
  async function processButton() {

    setLoading(true);


    if(props.afterSubmit != undefined)
      props.afterSubmit(dropzone_files);


      var file = dropzone_files[0];

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

      console.log(data)

  const [{ url, parameters, resourceUrl }] = data.stagedUploadsCreate.stagedTargets
  // var resourceUrl = data.stagedUploadsCreate.stagedTargets
  const formData = new FormData()

parameters.forEach(({name, value}) => {
  formData.append(name, value)
})

formData.append('file', file)

const response = await fetch(url, {
  method: 'POST',
  body: formData
})


let { fileCreateData } = await fileCreate({ variables: {
  files: {
    alt: "text",
    contentType: "FILE",
    originalSource: resourceUrl
  }
}})


const key = parameters.find(p => p.name === 'key')




console.log("URL: " + `${url}/${key.value}`)


      console.log(response)
      

      setLoading(false);
      setDisabled(true);    
}

function handleDropzoneDrop(files, acceptedFiles, rejectedFiles) {
  // console.log(files)

  setDropZoneFiles(files)
  
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

  
  var proceedButton = <><br /> 
  <Button onClick={processButton} disabled={!dropzone_files.length || disabled} loading={loading}>Continue</Button></>;

  return (

      <>
      <DropZone onDrop={handleDropzoneDrop}>
      {uploadedFiles}
      {fileUpload}
   </DropZone>
      
   {proceedButton}
   </>

  );



}