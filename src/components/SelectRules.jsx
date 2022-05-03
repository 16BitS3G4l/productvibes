// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component, useEffect } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { gql, useMutation, useQuery } from '@apollo/client';

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
import { ResourcePicker } from '@shopify/app-bridge/actions';

// import useMutation from 'react';
import {useState} from 'react';
import { Toast, useAppBridge } from "@shopify/app-bridge-react";

import { userLoggedInFetch } from "../App";


export function SelectRules (props) {

  const GET_SHOP_ID = gql`

{
  
  shop {
    id
    name
  }

}

`;


const UPSERT_SHOP_METAFIELD = gql`
mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      namespace
      key
      value
    }
    userErrors {
      field
      message
    }
  }
}


`;




  // for shop resource
  if(props.selectedOptions == []) {

    // const [metafields, setMetafields] = useState([]);
    const {data: shopData, loading, error} = useQuery(GET_SHOP_ID);
    const [metafieldsSet, {loading: loadingMutation, error: mutationError}] = useMutation(UPSERT_SHOP_METAFIELD);

    const [savedState, setSavedState] = useState(false);


    if(!loading && !savedState) {

      setSavedState(true)

      metafieldsSet({ variables: {
    "metafields": [

    {

      namespace: "product_vibes_files",
      key: "file_direct_urls",
      value: JSON.stringify(props.fileUrls),
      type: "json",
      ownerId: shopData.shop.id
    }
    
    ]
    
    }
    })

    console.log(shopData)

}


  } else {
    // for other type of resource

    console.log("resources:" + props.resourceType)
  }



  return (

      <>
    hello world
   </>

  );



}