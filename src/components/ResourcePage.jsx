import React, { Component, useEffect, useState } from 'react';

import {ProductsMajor,NoteMinor} from '@shopify/polaris-icons';

import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';

import { FileDropper } from './FileDropper.jsx';
import { Stepper, Step } from 'react-form-stepper';

import {QRCodeCanvas} from 'qrcode.react';

import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';

import {
  PageDownMajor
} from '@shopify/polaris-icons';


import { SelectRules } from './SelectRules.jsx';
import {
  Card,
  Icon,
  ResourceItem,
  Layout,
  EmptyState,
  Modal,
  ChoiceList,
  SkeletonBodyText,
  Button,
  TextStyle,
  Select,
  Filters,
  SkeletonPage,  
  ResourceList,
  SkeletonDisplayText, 
  TextContainer,
  TextField,
  DropZone,
  Page,
  Thumbnail,
  Tooltip,
  Heading,
  Stack,
  Caption,
  Collapsible

} from "@shopify/polaris";
import {
  DeleteMajor
} from '@shopify/polaris-icons';


import { useParams } from 'react-router';
// import {  useAppBridge } from "@shopify/app-bridge-react";

import {ResourcePicker} from '@shopify/app-bridge/actions';

import {Toast} from '@shopify/app-bridge/actions';
// import { ChooseResource } from './ChooseResource';

import { ChooseResource } from './ChooseResource';
import { ExistingFileChooser } from './ExistingFileChooser.jsx';


// import React, { useState, useCallback } from "react";

// import {
//   AppProvider,
//   Page,
//   Card,
//   ResourceItem,
//   Icon,
//   Stack,
//   Thumbnail,
//   Heading,
//   Tooltip
// } from "@shopify/polaris";
import { DragHandleMinor } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useCallback } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import QRCode from 'react-qr-code';
import nonce from '@shopify/shopify-api/dist/utils/nonce';

// import "@shopify/polaris/styles.css";

// get metafield from product 



export function ResourcePage(props) {
    // data? perhaps GID
    let { rid, type } = useParams();

    const GET_PRODUCT = gql`
      {
        product(id: "${rid}") {
          id
          title
          handle


          metafields (namespace: "prodvibes_prod_files", first: 1) {
            nodes {
              value
            } 
          }
        }

      }
`;

const GET_PRODUCT_VARIANT = gql`
      {
        product: productVariant(id: "${rid}") {
          id

          metafields (namespace: "prodvibes_var_files", first: 1) {
            nodes {
              value
            } 
          }

        }

      }
`;

const GET_COLLECTION = gql`
      {
        product: collection(id: "${rid}") {
          id
          title

          metafields (namespace: "prodvibes_coll_files", first: 1) {
            nodes {
              value
            } 
          }

        }

      }
`;

const GET_SHOP = gql`
      {
        product: shop {
          id
          
          title: myshopifyDomain

          metafields (namespace: "prodvibes_shop_files", first:1) {
            nodes {
              value
            }
          }
        }

      }
`;

const [connectedFiles, setFiles] = useState([]);

function deleteFile(data) {
  console.log(data)
}

function ListItem(props) {
  const { id, index, title } = props;

  // console.log(provided)
  // console.log(snapshot)

  // var open = false;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        
      const [s, setS] = useState(false);

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={
              snapshot.isDragging
                ? { listStyle: "none", background: "white", ...provided.draggableProps.style }
                : {listStyle: "none", ...provided.draggableProps.style}
            }
          >
            <ResourceItem 

            shortcutActions={[{content: "View QR Code", onClick: function() {

              setLightboxOpened(true)

            } }, {content: "Delete File", onClick: function() {confirm("Are you sure you'd like to delete this file?")} }]}
            onClick={() => {
              setS(!s)
            }}  id={id}>
              <Stack distribution='leading'>
                
                <div {...provided.dragHandleProps}>
                  <Tooltip content="Drag to reorder files">
                    <Icon source={DragHandleMinor} color="inkLightest" />
                  </Tooltip>
                </div>
                
                <Heading>{title}</Heading>

              </Stack>

            </ResourceItem>
          </div>
        );
      }}
    </Draggable>
  );
}

function List() {
  const [items, setItems] = useState(connectedFiles);

  const handleDragEnd = useCallback(({ source, destination }) => {
    setItems((oldItems) => {
      const newItems = oldItems.slice(); // Duplicate
      const [temp] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, temp);
      return newItems;
    });
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root">
        {(provided) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              
              {items.map((item, index) => (
                <ListItem
                  key={item.id}
                  id={item.id}
                  index={index}
                  title={item.title}
                />
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}


    if(type == 'Product') {

      var { loading, error, data }= useQuery(GET_PRODUCT);

    } else if(type == 'Variant') {
      var { loading, error, data }= useQuery(GET_PRODUCT_VARIANT);

    } else if(type == 'Collection') {
      var { loading, error, data }= useQuery(GET_COLLECTION);

    } else if(type == 'Shop') {
      var { loading, error, data }= useQuery(GET_SHOP);

    }

    const [heading, setHeading] = useState("");

    useEffect(() => {

      if(!loading && !error && data) {
        console.log("Received")

        // get the files
        var files = JSON.parse(data.product.metafields.nodes[0].value)

        var parsedFiles = []

        for (var i = 0; i < files.length; i++) {
          
          var url = files[i].split("?")[0]
          var urlSplit = url.split("/")
          var fileName = urlSplit[urlSplit.length-1]
          
          var parsedFile = {
            title: fileName,
            id: `ID-${i}`
          }

          parsedFiles.push(parsedFile)
        }

        setFiles(parsedFiles)

      }

    }, [data]);

    
    const [lightBoxOpened, setLightboxOpened] = useState(false);

    return <>
      <Page 
      breadcrumbs={[{content: "Attachments", url: "/files"}]}
      singleColumn title={<>{rid}</>}>
  <Layout>
    <Layout.Section>

      <Card title={"Files"}>

        <Card.Section>sdf</Card.Section>

        <List></List>


        <QRCodeCanvas style={{display: "none"}} value="hello world" id="qrcode" />

        {
          lightBoxOpened && (

            <Lightbox 
        
            toolbarButtons={[<>
               
<svg   viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill='red' fill-rule="evenodd" d="M11.379 0a1.5 1.5 0 0 1 1.06.44l4.122 4.12a1.5 1.5 0 0 1 .439 1.062v12.878a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5v-17a1.5 1.5 0 0 1 1.5-1.5h6.879zm-1.379 6a1 1 0 0 1 1 1v3.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414l1.293 1.293v-3.586a1 1 0 0 1 1-1z"/></svg>

            </>]}
        mainSrc={"data:image/png;base64,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"}
        
        onCloseRequest={function() {
          
          
          setLightboxOpened(false)
        }}

        
        ></Lightbox>

          )

        }
        

      </Card>
      
    </Layout.Section>
    <Layout.Section>{/* Page-level banners */}</Layout.Section>
    <Layout.Section>{/* Narrow page content */}</Layout.Section>
  </Layout>
</Page>

    </>;
}
