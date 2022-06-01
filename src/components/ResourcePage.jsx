import React, { Component, useEffect, useState } from "react";

import { ProductsMajor, NoteMinor } from "@shopify/polaris-icons";

import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client";

import { FileDropper } from "./FileDropper.jsx";
import { Stepper, Step } from "react-form-stepper";

import { QRCodeCanvas } from "qrcode.react";

import { MobileBackArrowMajor } from "@shopify/polaris-icons";

import { PageDownMajor } from "@shopify/polaris-icons";

import { SelectRules } from "./SelectRules.jsx";
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
  Collapsible,
} from "@shopify/polaris";
import { DeleteMajor } from "@shopify/polaris-icons";

import { useParams } from "react-router";
// import {  useAppBridge } from "@shopify/app-bridge-react";

import { ResourcePicker } from "@shopify/app-bridge/actions";

import { Toast } from "@shopify/app-bridge/actions";
// import { ChooseResource } from './ChooseResource';

import { ChooseResource } from "./ChooseResource";
import { ExistingFileChooser } from "./ExistingFileChooser.jsx";

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

import { useCallback } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import QRCode from "react-qr-code";
import nonce from "@shopify/shopify-api/dist/utils/nonce";

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

        metafields(namespace: "prodvibes_shop_files", first: 1) {
          nodes {
            value
          }
        }
      }
    }
  `;

  const [connectedFiles, setFiles] = useState([]);

  function ListItem(props) {
    const { id, index, title, fileUrl } = props;

    // console.log(provided)
    // console.log(snapshot)

    // var open = false;

    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={
                snapshot.isDragging
                  ? {
                      listStyle: "none",
                      background: "white",
                      ...provided.draggableProps.style,
                    }
                  : { listStyle: "none", ...provided.draggableProps.style }
              }
            >
              <ResourceItem
                shortcutActions={[
                  {
                    content: "View QR code",
                    onClick: function () {
                      setFileUrl(fileUrl);

                      var qrCode = document.getElementById("qrcode");
                      setQRCodeDataUrl(qrcode.toDataURL("image/png"));

                      setLightboxOpened(true);
                    },
                  },
                  {
                    destructive: true,
                    content: "Detach file",
                    onClick: function (data) {
                      // just needs to remove file (don't delete uploaded file)

                      setCurrentFileForDeletion({
                        id,
                        fileUrl,
                        title,
                      });

                      setDeleteFileModalOpen(true);
                    },
                  },
                ]}
                id={id}
              >
                <Stack distribution="leading">
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
                    fileUrl={item.fileUrl}
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

  if (type == "Product") {
    var { loading, error, data } = useQuery(GET_PRODUCT);
  } else if (type == "Variant") {
    var { loading, error, data } = useQuery(GET_PRODUCT_VARIANT);
  } else if (type == "Collection") {
    var { loading, error, data } = useQuery(GET_COLLECTION);
  } else if (type == "Shop") {
    var { loading, error, data } = useQuery(GET_SHOP);
  }

  const [heading, setHeading] = useState("");

  useEffect(() => {
    if (!loading && !error && data) {
      console.log("Received");

      // get the files
      var files = JSON.parse(data.product.metafields.nodes[0].value);

      var parsedFiles = [];

      for (var i = 0; i < files.length; i++) {
        var url = files[i].split("?")[0];
        var urlSplit = url.split("/");
        var fileName = urlSplit[urlSplit.length - 1];

        var parsedFile = {
          title: fileName,
          id: `ID-${i}`,
          fileUrl: url,
        };

        parsedFiles.push(parsedFile);
      }

      setFiles(parsedFiles);
    }
  }, [data]);

  const [lightBoxOpened, setLightboxOpened] = useState(false);
  const [fileUrl, setFileUrl] = useState("testafasdf34534545");
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");

  const [deleteFileModalOpen, setDeleteFileModalOpen] = useState(false);
  const [currentFileForDeletion, setCurrentFileForDeletion] = useState({});

  const closeModal = useCallback(
    () => setDeleteFileModalOpen(false),
    [deleteFileModalOpen]
  );

  return (
    <>
      <Page
        breadcrumbs={[{ content: "Attachments", url: "/files" }]}
        singleColumn
        title={<>{rid}</>}
      >
        <Layout>
          <Layout.Section>
            <Card title={"Files"}>
              <Card.Section>sdf</Card.Section>

              <List></List>

              <Modal
                open={deleteFileModalOpen}
                title="Detach file from resource"
                onClose={function () {
                  setDeleteFileModalOpen(false);
                }}
                primaryAction={{ content: "Detach file", destructive: true }}
                secondaryActions={[
                  {
                    content: "Cancel",
                    onAction: function () {
                      setDeleteFileModalOpen(false);
                    },
                  },
                ]}
              >
                <Modal.Section>
                  <TextContainer>
                    <p>
                      If you don't want this file showing up on your product
                      pages anymore, proceed.
                    </p>
                    <p>Files that are detached can always be attached again.</p>
                    <p>Make sure you want to delete the following file: </p>
                    <code>{currentFileForDeletion.title}</code>
                  </TextContainer>
                </Modal.Section>
              </Modal>

              {/*
            QRCodeCanvas is just for generating the QR code, the lightbox will show it
          */}

              <QRCodeCanvas
                style={{ display: "none" }}
                value={fileUrl}
                id="qrcode"
              />

              {lightBoxOpened && (
                <Lightbox
                  toolbarButtons={[
                    <>
                      <div
                        style={{
                          opacity: "0.7",
                          cursor: "pointer",
                          width: "40px",
                          height: "35px",
                          border: "none",
                          verticalAlign: "middle",
                          background:
                            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8ZGVzYz5DcmVhdGVkIHdpdGggRmFicmljLmpzIDMuNS4wPC9kZXNjPgo8ZGVmcz4KPC9kZWZzPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmZmIi8+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDQ1LjQ1NDUgMCAwIDQ1LjQ1NDUgNDk5Ljk5OTcgNDk5Ljk5OTUpIiBpZD0iMTkxODcwIj4KPHBhdGggc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiA0OyBpcy1jdXN0b20tZm9udDogbm9uZTsgZm9udC1maWxlLXVybDogbm9uZTsgZmlsbDogcmdiKDE1OSwxNTksMTU5KTsgZmlsbC1ydWxlOiBldmVub2RkOyBvcGFjaXR5OiAxOyIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiB0cmFuc2Zvcm09IiB0cmFuc2xhdGUoLTEwLCAtMTApIiBkPSJNIDExLjM3OSAwIGEgMS41IDEuNSAwIDAgMSAxLjA2IDAuNDQgbCA0LjEyMiA0LjEyIGEgMS41IDEuNSAwIDAgMSAwLjQzOSAxLjA2MiB2IDEyLjg3OCBhIDEuNSAxLjUgMCAwIDEgLTEuNSAxLjUgaCAtMTEgYSAxLjUgMS41IDAgMCAxIC0xLjUgLTEuNSB2IC0xNyBhIDEuNSAxLjUgMCAwIDEgMS41IC0xLjUgaCA2Ljg3OSB6IG0gLTEuMzc5IDYgYSAxIDEgMCAwIDEgMSAxIHYgMy41ODYgbCAxLjI5MyAtMS4yOTMgYSAxIDEgMCAxIDEgMS40MTQgMS40MTQgbCAtMyAzIGEgMSAxIDAgMCAxIC0xLjQxNCAwIGwgLTMgLTMgYSAxIDEgMCAwIDEgMS40MTQgLTEuNDE0IGwgMS4yOTMgMS4yOTMgdiAtMy41ODYgYSAxIDEgMCAwIDEgMSAtMSB6IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9nPgo8L3N2Zz4=') no-repeat center",
                          display: "inline-block",
                        }}
                      ></div>
                    </>,
                  ]}
                  mainSrc={qrCodeDataUrl}
                  onCloseRequest={function () {
                    setLightboxOpened(false);
                  }}
                ></Lightbox>
              )}
            </Card>
          </Layout.Section>
          <Layout.Section>{/* Page-level banners */}</Layout.Section>
          <Layout.Section>{/* Narrow page content */}</Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
