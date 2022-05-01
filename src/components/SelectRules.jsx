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
    }
    userErrors {
      field
      message
    }
  }
}


`;

  const [metafields, setMetafields] = useState([]);
  // const [getShopInfo, { data: fileDataReturned  }] = useLazyQuery(GET_SHOP_ID);
  const {data: shopData, loading, error} = useQuery(GET_SHOP_ID);
  var loadedInitialShopData = false;
  const [metafieldsSet] = useMutation(UPSERT_SHOP_METAFIELD);


    // get all metafields testing
    const app = useAppBridge();

    // console.log(stuff.data)

    // console.log(metafieldsSet)

    useEffect(() => {
      if(!loading) {

        console.log(metafieldsSet)

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

      }
    })

  //   if(!loading && props.selectedOptions.length == 0) {
  // //     metafieldsSet({ variables: {
  // //       "metafields": [

  // //         {

  // //           namespace: "product_vibes_files",
  // //           key: "file_direct_urls",
  // //           value: JSON.stringify(props.fileUrls),
  // //           type: "json",
  // //           ownerId: shopData.shop.id
  // //         }
          
  // //       ]
          
  // //   }
  // // })

  // console.log("hello ")
  //   }


    // if(props.selectedOptions.length > 0) {
    //     // one of the resources (variant, product, collection store doesn't have any selections)

    //     console.log("stuff" + props.selectedOptions)

    // } else {
    //   // it's the store

    //   }

  return (

      <>
    hello world
   </>

  );



}