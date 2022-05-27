// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';

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

import { ExistingFileSearchTest } from './ExistingFileSearchTest';
import { ExistingFileSearch } from './ExistingFileSearch';

export function Testing (props) {
  const app = useAppBridge();


  var filePosition = 0;

  // get files
  const GET_FILES = gql`
    {
        metafieldDefinitions(ownerType: PRODUCTVARIANT, first: 15) {
            nodes {
              id
              key
              namespace
              ownerType
              
                metafields(first: 5) {
                    nodes {
                        id
                        value
                    }
                }
            }
        }
    }
  `;



  const {data, loading, error} = useQuery(GET_FILES);


  console.log(loading)
 
  if(!loading) {
   
    console.log(data)
    console.log("Data " + data)

  }


  // refresh_files("COA")

  if(!loading) {
    return (
      <>
       test
      </>
    );
  } else {
    return (
      <>
       
      </>
    );
  }



}