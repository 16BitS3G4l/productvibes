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
  PageActions,
  Checkbox,
  Loading,
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
import { useAppBridge } from "@shopify/app-bridge-react";
import { PDFMappingNew } from "./PDFMappingNew.jsx";

// import "@shopify/polaris/styles.css";

// get metafield from product

export function ResourcePage(props) {
  // data? perhaps GID
  let { rid, type } = useParams();

  var app = useAppBridge();

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

  const DETACH_FILE = gql`
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          namespace
          value
          createdAt
          updatedAt
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const REORDER_FILES = gql`
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          namespace
          value
          createdAt
          updatedAt
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const [reorder, { reorderData, reorderLoading, reorderError }] =
    useMutation(REORDER_FILES);

  function reorderFiles(fileUrlList) {
    var fileUrlListMeta = JSON.stringify(fileUrlList);

    if (type == "Collection") {
      reorder({
        variables: {
          metafields: [
            {
              key: "file_direct_urls",
              namespace: "prodvibes_coll_files",
              ownerId: rid,
              type: "json",
              value: fileUrlListMeta,
            },
          ],
        },
      });
    } else if (type == "Shop") {
      reorder({
        variables: {
          metafields: [
            {
              key: "file_direct_urls",
              namespace: "prodvibes_shop_files",
              ownerId: rid,
              type: "json",
              value: fileUrlListMeta,
            },
          ],
        },
      });
    } else if (type == "Variant") {
      reorder({
        variables: {
          metafields: [
            {
              key: "file_direct_urls",
              namespace: "prodvibes_var_files",
              ownerId: rid,
              type: "json",
              value: fileUrlListMeta,
            },
          ],
        },
      });
    } else if (type == "Product") {
      reorder({
        variables: {
          metafields: [
            {
              key: "file_direct_urls",
              namespace: "prodvibes_prod_files",
              ownerId: rid,
              type: "json",
              value: fileUrlListMeta,
            },
          ],
        },
      });
    }

    if (reorderLoading) return "waiting";
    if (reorderError) return "error";
    if (!reorderLoading && !reorderError) return "success";
  }

  const [connectedFiles, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

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
                      setFileTitle(title);

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

  // const [filesInOrder, setFilesInOrder] = useState([]);

  function List() {
    const [items, setItems] = useState(connectedFiles);

    const handleDragEnd = useCallback(({ source, destination }) => {
      setItems((oldItems) => {
        const newItems = oldItems.slice(); // Duplicate
        const [temp] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, temp);

        console.log("lo" + oldItems);

        var fileUrls = [];

        for (var i = 0; i < newItems.length; i++) {
          fileUrls.push(newItems[i].fileUrl);
        }

        return newItems;

        // // wait until we have some response from mutation
        // while(reorderedFiles != 'success' || reorderedFiles != 'error') {

        // }

        // if(reorderedFiles == 'success') {
        //   return newItems;
        // } else if(reorderedFiles == 'error') {
        //   alert()
        //   return oldItems;
        // } else if(reorderedFiles == 'loading') {
        //   // how to wait until?

        // }
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

  const [
    detachFile,
    {
      data: detachFileData,
      loading: detachFileLoading,
      error: detachFileError,
    },
  ] = useMutation(DETACH_FILE);

  useEffect(() => {
    if (!detachFileLoading && !detachFileError && detachFileData) {
      setDeletingFile(false);
      setDeleteFileModalOpen(false);

      // show toast that file was successfully detached
      const toastOptions = {
        message: "File was successfully detached",
        duration: 1350,
        isError: false,
      };

      const toast = Toast.create(app, toastOptions);
      toast.dispatch(Toast.Action.SHOW);
    }
  }, [detachFileData]);

  const [heading, setHeading] = useState("");

  useEffect(() => {
    if (!loading && !error && data) {
      console.log("Received");

      // get the files
      var files = JSON.parse(data.product.metafields.nodes[0].value);

      if (files && files.length > 0) {
        setAllFiles(files);
      }

      var parsedFiles = [];

      for (var i = 0; i < files.length; i++) {
        var originalUrl = files[i];

        var url = files[i].split("?")[0];
        var urlSplit = url.split("/");
        var fileName = urlSplit[urlSplit.length - 1];

        var parsedFile = {
          title: fileName,
          id: `ID-${i}`,
          fileUrl: originalUrl,
        };

        parsedFiles.push(parsedFile);
      }

      setFiles(parsedFiles);
    }
  }, [data]);

  const [lightBoxOpened, setLightboxOpened] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");

  const [deleteFileModalOpen, setDeleteFileModalOpen] = useState(false);
  const [currentFileForDeletion, setCurrentFileForDeletion] = useState({});

  const closeModal = useCallback(
    () => setDeleteFileModalOpen(false),
    [deleteFileModalOpen]
  );

  const [newFiles, setNewFiles] = useState([]);

  const uploadedFiles = newFiles.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.indexOf(file.type) > -1
                ? window.URL.createObjectURL(file)
                : NoteMinor
            }
          />
          <div>
            {file.name} <Caption>{file.size} bytes</Caption>
          </div>
        </Stack>
      ))}
    </Stack>
  );

  const fileUpload = !newFiles.length && <DropZone.FileUpload />;
  const [deletingFile, setDeletingFile] = useState(false);

  const [uploadFileModalActive, setUploadFileModalActive] = useState(false);
  const [uploadExistingFileModalActive, setUploadExistingFileModalActive] =
    useState(false);

  const openUploadNewFileModal = useCallback(
    () => setUploadFileModalActive(true),
    [uploadFileModalActive]
  );

  const openUploadExistingFileModal = useCallback(
    () => setUploadExistingFileModalActive(true),
    [uploadExistingFileModal]
  );

  const [processButtonFn, setProcessButtonFn] = useState(() => {
    // alert();
  });

  function attachExistingFiles() {
    const toastOptions = {
      message: "Please select at least one file",
      duration: 1350,
      isError: true,
    };

    const toast = Toast.create(app, toastOptions);
    toast.dispatch(Toast.Action.SHOW);
  }

  var uploadNewFileModal = uploadFileModalActive && (
    <>
      <div style={{ height: "500px" }}>
        <Modal
          large
          onClose={function () {
            setUploadFileModalActive(false);
          }}
          open={uploadFileModalActive}
          title="Attach new file(s)"
          primaryAction={{
            content: "Attach files",
            onAction: async () => {
              var data = await processButtonFn()

              console.log("data: " + data);
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: function () {
                setUploadFileModalActive(false);
              },
            },
          ]}
        >
          <Modal.Section>
            <Stack vertical>
              <FileDropper
                test={(data) => {
                  setProcessButtonFn(() => data);
                  // console.log(processButtonFn);
                }}
                afterSubmit={(data) => console.log(data)}
              ></FileDropper>
            </Stack>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );
  var uploadExistingFileModal = uploadExistingFileModalActive && (
    <>
      <div style={{ height: "500px" }}>
        <Modal
          large
          onClose={function () {
            setUploadExistingFileModalActive(false);
          }}
          open={uploadExistingFileModalActive}
          title="Attach existing files"
          primaryAction={{
            content: "Attach files",
            onAction: attachExistingFiles,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: function () {
                setUploadExistingFileModalActive(false);
              },
            },
          ]}
        >
          <Modal.Section>
            <Stack vertical>
              <ExistingFileChooser disableContinueButton={true} />
            </Stack>
          </Modal.Section>
        </Modal>
      </div>
    </>
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
            <Card title={"Attached files"}>
              <Card.Section></Card.Section>

              <List></List>

              <Modal
                open={deleteFileModalOpen}
                title="Detach file from resource"
                onClose={function () {
                  setDeleteFileModalOpen(false);
                }}
                primaryAction={{
                  content: "Detach file",
                  loading: deletingFile,
                  destructive: true,
                  onClick: function () {
                    setDeletingFile(true);

                    console.log(
                      "Current file: " + JSON.stringify(currentFileForDeletion)
                    );

                    var allFilesFiltered = [];

                    for (var i = 0; i < allFiles.length; i++) {
                      if (allFiles[i] == currentFileForDeletion.fileUrl) {
                        continue;
                      } else {
                        allFilesFiltered.push(allFiles[i]);
                      }

                      console.log("Loaded: " + allFiles);
                    }

                    setAllFiles(allFilesFiltered);

                    var parsedFiles = [];

                    for (var i = 0; i < allFilesFiltered.length; i++) {
                      var originalUrl = allFilesFiltered[i];

                      var url = allFilesFiltered[i].split("?")[0];
                      var urlSplit = url.split("/");
                      var fileName = urlSplit[urlSplit.length - 1];

                      var parsedFile = {
                        title: fileName,
                        id: `ID-${i}`,
                        fileUrl: originalUrl,
                      };

                      parsedFiles.push(parsedFile);
                    }

                    setFiles(parsedFiles);

                    console.log(
                      "Files to process: " + JSON.stringify(allFilesFiltered)
                    );

                    setDeletingFile(true);

                    if (type == "Collection") {
                      console.log(
                        "Stringified: " + JSON.stringify(allFilesFiltered)
                      );

                      detachFile({
                        variables: {
                          metafields: [
                            {
                              key: "file_direct_urls",
                              namespace: "prodvibes_coll_files",
                              ownerId: rid,
                              type: "json",
                              value: JSON.stringify(allFilesFiltered),
                            },
                          ],
                        },
                      });
                    } else if (type == "Shop") {
                      console.log(
                        "Stringified: " + JSON.stringify(allFilesFiltered)
                      );

                      detachFile({
                        variables: {
                          metafields: [
                            {
                              key: "file_direct_urls",
                              namespace: "prodvibes_shop_files",
                              ownerId: rid,
                              type: "json",
                              value: JSON.stringify(allFilesFiltered),
                            },
                          ],
                        },
                      });
                    } else if (type == "Variant") {
                      console.log(
                        "Stringified: " + JSON.stringify(allFilesFiltered)
                      );

                      detachFile({
                        variables: {
                          metafields: [
                            {
                              key: "file_direct_urls",
                              namespace: "prodvibes_var_files",
                              ownerId: rid,
                              type: "json",
                              value: JSON.stringify(allFilesFiltered),
                            },
                          ],
                        },
                      });
                    } else if (type == "Product") {
                      console.log(
                        "Stringified: " + JSON.stringify(allFilesFiltered)
                      );

                      detachFile({
                        variables: {
                          metafields: [
                            {
                              key: "file_direct_urls",
                              namespace: "prodvibes_prod_files",
                              ownerId: rid,
                              type: "json",
                              value: JSON.stringify(allFilesFiltered),
                            },
                          ],
                        },
                      });
                    }

                    // call lazy query with new value (then reload everything?)
                  },
                }}
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
                size={400}
                style={{ display: "none" }}
                value={fileUrl}
                id="qrcode"
              />

              {lightBoxOpened && (
                <Lightbox
                  enableZoom={false}
                  toolbarButtons={[
                    <>
                      <div
                        onClick={function () {
                          // use current data
                          var url = qrCodeDataUrl;

                          console.log(url);

                          var downloadLink = document.createElement("a");

                          downloadLink.download = `${fileTitle}-qrcode.png`;
                          downloadLink.href = url;
                          downloadLink.setAttribute("type", "hidden");

                          document.body.appendChild(downloadLink);
                          downloadLink.click();
                          document.body.removeChild(downloadLink);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        Download
                      </div>
                    </>,
                  ]}
                  mainSrc={qrCodeDataUrl}
                  onCloseRequest={function () {
                    setLightboxOpened(false);
                  }}
                ></Lightbox>
              )}
            </Card>

            <Card sectioned title={"Attach new files"}>
              <div style={{ textAlign: "center" }}>
                <Button onClick={openUploadNewFileModal}>Upload file</Button>
                <span>&nbsp; Or &nbsp;</span>
                <Button onClick={openUploadExistingFileModal}>
                  Choose existing file
                </Button>
              </div>
            </Card>
          </Layout.Section>
          <Layout.Section>{/* Page-level banners */}</Layout.Section>
          <Layout.Section>{/* Narrow page content */}</Layout.Section>
        </Layout>

        {uploadNewFileModal}
        {uploadExistingFileModal}
      </Page>
    </>
  );
}
