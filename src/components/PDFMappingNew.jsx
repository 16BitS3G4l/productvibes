import React, { Component, useEffect, useState } from "react";

import { ProductsMajor } from "@shopify/polaris-icons";

import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client";

import { FileDropper } from "./FileDropper.jsx";
import { Stepper, Step } from "react-form-stepper";

import { MobileBackArrowMajor } from "@shopify/polaris-icons";

import { SelectRules } from "./SelectRules.jsx";
import {
  Card,
  Pagination,
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
  Stack,
  Caption,
} from "@shopify/polaris";
// import {  useAppBridge } from "@shopify/app-bridge-react";

import { ResourcePicker } from "@shopify/app-bridge/actions";

import { Toast } from "@shopify/app-bridge/actions";
// import { ChooseResource } from './ChooseResource';

import { ChooseResource } from "./ChooseResource";
import { ExistingFileChooser } from "./ExistingFileChooser.jsx";

const GET_RESOURCES_INITIAL = gql`
  {
    metafieldDefinitions(
      ownerType: PRODUCT
      first: 1
      key: "file_direct_urls"
    ) {
      nodes {
        metafields(first: 5) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }

          nodes {
            owner {
              ... on Product {
                id

                heading: title
                body: description
              }

              ... on Shop {
                id
              }

              ... on ProductVariant {
                id
              }

              ... on Collection {
                id
              }
            }
          }
        }
      }
    }
  }
`;

// technically possible to search resources (just need to have separate flows for searching and pulling up via dropdown...) :((()))
// design wise, as soon as it's cleared, we should use the regular results? ...  .... ... ... ... ... ... ... ... ... ...
//
// const GET_RESOURCES_SEARCH_PRODUCT = gql`
// query GetProducts()
// `;

// integrate pagination with query
const GET_RESOURCES = gql`
  query GetResources($resourceOwner: MetafieldOwnerType!) {
    metafieldDefinitions(
      ownerType: $resourceOwner
      first: 1
      key: "file_direct_urls"
    ) {
      nodes {
        metafields(first: 5) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }

          nodes {
            owner {
              ... on Product {
                id
                heading: title
                body: description
              }

              ... on Shop {
                id
                heading: myshopifyDomain
                body: description
              }

              ... on ProductVariant {
                id
                heading: title
                body: sku
              }

              ... on Collection {
                id
                heading: title
                body: description
              }
            }
          }
        }
      }
    }
  }
`;

const GET_RESOURCES_FORWARD = gql`
  query GetResources(
    $resourceOwner: MetafieldOwnerType!
    $afterCursor: String!
  ) {
    metafieldDefinitions(
      ownerType: $resourceOwner
      first: 1
      key: "file_direct_urls"
    ) {
      nodes {
        metafields(first: 5, after: $afterCursor) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }

          nodes {
            owner {
              ... on Product {
                id
                heading: title
                body: description
              }

              ... on Shop {
                id
                heading: myshopifyDomain
                body: description
              }

              ... on ProductVariant {
                id
                heading: title
                body: sku
              }

              ... on Collection {
                id
                heading: title
                body: description
              }
            }
          }
        }
      }
    }
  }
`;

const GET_RESOURCES_BACKWARD = gql`
  query GetResources(
    $resourceOwner: MetafieldOwnerType!
    $beforeCursor: String!
  ) {
    metafieldDefinitions(
      ownerType: $resourceOwner
      first: 1
      key: "file_direct_urls"
    ) {
      nodes {
        metafields(last: 5, before: $beforeCursor) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }

          nodes {
            owner {
              ... on Product {
                id
                heading: title
                body: description
              }

              ... on Shop {
                id
                heading: myshopifyDomain
                body: description
              }

              ... on ProductVariant {
                id
                heading: title
                body: sku
              }

              ... on Collection {
                id
                heading: title
                body: description
              }
            }
          }
        }
      }
    }
  }
`;

export function PDFMappingNew(props) {
  var app = props.app;
  var after_resource_picker = "";

  const [items, setItems] = useState([]);

  const [urlFiles, setFileUrls] = useState([]);
  const [dropzoneFiles, setDropzoneFiles] = useState([]);
  const [pageState, setPageState] = useState(props.pageState);
  const [activeStep, setActiveStep] = useState(0);
  const [resourceType, setResourceType] = useState("");
  const [selectedResources, setSelectedResources] = useState([]);
  const [requiresPagination, setRequiresPagination] = useState(false);

  const [options, setOptions] = useState([
    { label: "Please select a resource to begin", value: "placeholder" },
    { label: "Store", value: "store" },
    { label: "Collection", value: "collection" },
    { label: "Product", value: "product" },
    { label: "Variant", value: "variant" },
  ]);

  const [selected, setSelected] = useState("placeholder");

  function transitionToCreatingRelationshipPageToExistingFiles() {
    setPageState("existing-file-relationship-content");
  }

  function transitionToCreatingRelationshipPage() {
    setPageState("relationship-content");
  }

  function handleFileUploads(data) {
    console.log("Handling file upload ... " + JSON.stringify(data));

    setFileUrls(data);
    setActiveStep(2);

    console.log("file urls passed to selectrules: " + urlFiles);
  }

  function goBackToSelectingResource() {
    setActiveStep(0);
  }

  function handleResourceChosen(step) {
    setSelected(step);

    switch (step) {
      case "store":
        setActiveStep(1);
        setResourceType("store");
        break;

      case "collection":
        after_resource_picker = "";

        const collectionPicker = ResourcePicker.create(this.app, {
          resourceType: ResourcePicker.ResourceType.Collection,
          actionVerb: "Select",
        });

        collectionPicker.subscribe(
          ResourcePicker.Action.SELECT,
          (selection) => {
            setActiveStep(1);
            setSelectedResources(selection);
            setResourceType("collection");
          }
        );

        collectionPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
          // this.handleResourceChosen("default")

          const toastOptions = {
            message: "Please select at least one collection",
            duration: 2300,
            isError: true,
          };

          const toastError = Toast.create(app, toastOptions);
          toastError.dispatch(Toast.Action.SHOW);
        });

        collectionPicker.dispatch(ResourcePicker.Action.OPEN);

        break;

      case "product":
        const productPicker = ResourcePicker.create(this.app, {
          resourceType: ResourcePicker.ResourceType.Product,
          actionVerb: ResourcePicker.ActionVerb.Select,
          options: {
            showVariants: false,
          },
        });

        productPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
          // Do something with `selection`
          // alert()
          console.log(selection);

          setActiveStep(1);
          setSelectedResources(selection);
          setResourceType("product");
        });

        productPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
          // handleResourceChosen("placeholder")
          // Picker was cancelled

          const toastOptions = {
            message: "Please select at least one product",
            duration: 2300,
            isError: true,
          };
          const toastError = Toast.create(app, toastOptions);
          toastError.dispatch(Toast.Action.SHOW);
        });

        productPicker.dispatch(ResourcePicker.Action.OPEN);

        break;

      case "variant":
        after_resource_picker = "";

        const variantPicker = ResourcePicker.create(app, {
          resourceType: ResourcePicker.ResourceType.ProductVariant,
          actionVerb: ResourcePicker.ActionVerb.Select,
        });

        variantPicker.subscribe(ResourcePicker.Action.SELECT, (selection) => {
          setActiveStep(1);
          setSelectedResources(selection);
          setResourceType("variant");
        });

        variantPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
          handleResourceChosen("default");

          const toastOptions = {
            message: "Please select at least one variant",
            duration: 2300,
            isError: true,
          };
          const toastError = Toast.create(app, toastOptions);
          toastError.dispatch(Toast.Action.SHOW);
        });

        variantPicker.dispatch(ResourcePicker.Action.OPEN);

        break;

      default:
        this.after_resource_picker = "";
        break;
    }
  }

  // filter resource type

  const [resourceTypeList, setResourceTypeList] = useState([
    { label: "Product", value: "Product" },
    { label: "Variant", value: "Variant" },
    { label: "Collection", value: "Collection" },
    { label: "Shop", value: "Shop" },
  ]);

  const [resourceTypeListSelected, setResourceTypeListSelected] =
    useState("Product");
  const [resourceListLoading, setLoadingResourceList] = useState(true);

  const {
    data: initialData,
    loading: initialLoading,
    error: initialError,
  } = useQuery(GET_RESOURCES_INITIAL);

  const [
    getProductsQuery,
    { data: productsData, loading: productsLoading, error: productsError },
  ] = useLazyQuery(GET_RESOURCES);
  const [
    getProductsForward,
    {
      data: productsDataForward,
      loading: productsLoadingForward,
      error: productsErrorForward,
    },
  ] = useLazyQuery(GET_RESOURCES_FORWARD);
  const [
    getProductsBackward,
    {
      data: productsDataBackward,
      loading: productsLoadingBackward,
      error: productsErrorBackward,
    },
  ] = useLazyQuery(GET_RESOURCES_BACKWARD);

  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  // do we need cursors and state variables for each resource type (next page etc?)
  const [previousPageCursor, setPreviousPageCursor] = useState(null);
  const [nextPageCursor, setNextPageCursor] = useState(null);

  const [loadedInitialQuery, setLoadedInitialQuery] = useState(false);

  if (
    !initialLoading &&
    !initialError &&
    initialData &&
    !loadedInitialQuery &&
    initialData.metafieldDefinitions.nodes.length > 0
  ) {
    console.log("SDF " + initialData);

    var metafields = initialData.metafieldDefinitions.nodes[0].metafields.nodes;
    var pageInfoData =
      initialData.metafieldDefinitions.nodes[0].metafields.pageInfo;

    setHasPreviousPage(pageInfoData.hasPreviousPage);
    setHasNextPage(pageInfoData.hasNextPage);

    if (pageInfoData.hasPreviousPage) {
      setPreviousPageCursor(pageInfoData.startCursor);
    } else {
      setPreviousPageCursor(null);
    }

    if (pageInfoData.hasNextPage) {
      setNextPageCursor(pageInfoData.endCursor);
    } else {
      setNextPageCursor(null);
    }

    var item_list = [];

    for (var i = 0; i < metafields.length; i++) {
      var owner = metafields[i].owner;
      var ownerId = owner.id;

      var item = {
        id: ownerId,
        heading: owner.heading,
        body: owner.body,
      };

      item_list.push(item);
      setRequiresPagination(true);
    }

    setItems(item_list);

    setLoadedInitialQuery(true);
    setLoadingResourceList(false);
    setRequiresPagination(false);
  }

  useEffect(() => {
    if (
      !productsLoading &&
      !productsError &&
      productsData &&
      productsData.metafieldDefinitions
    ) {
      var metafields =
        productsData.metafieldDefinitions.nodes[0].metafields.nodes;
      var pageInfoData =
        productsData.metafieldDefinitions.nodes[0].metafields.pageInfo;

      setHasPreviousPage(pageInfoData.hasPreviousPage);
      setHasNextPage(pageInfoData.hasNextPage);

      if (pageInfoData.hasPreviousPage) {
        setPreviousPageCursor(pageInfoData.startCursor);
      } else {
        setPreviousPageCursor(null);
      }

      if (pageInfoData.hasNextPage) {
        setNextPageCursor(pageInfoData.endCursor);
      } else {
        setNextPageCursor(null);
      }

      var item_list = [];

      for (var i = 0; i < metafields.length; i++) {
        var owner = metafields[i].owner;
        var ownerId = owner.id;

        var item = {
          id: ownerId,
          heading: owner.heading,
          body: owner.body,
        };

        item_list.push(item);
      }

      setItems(item_list);

      setLoadingResourceList(false);
    }
  }, [productsData]);

  useEffect(() => {
    if (
      !productsLoadingForward &&
      !productsErrorForward &&
      productsDataForward &&
      productsDataForward.metafieldDefinitions
    ) {
      var metafields =
        productsDataForward.metafieldDefinitions.nodes[0].metafields.nodes;
      var pageInfoData =
        productsDataForward.metafieldDefinitions.nodes[0].metafields.pageInfo;

      setHasPreviousPage(pageInfoData.hasPreviousPage);
      setHasNextPage(pageInfoData.hasNextPage);

      if (pageInfoData.hasPreviousPage) {
        setPreviousPageCursor(pageInfoData.startCursor);
      } else {
        setPreviousPageCursor(null);
      }

      if (pageInfoData.hasNextPage) {
        setNextPageCursor(pageInfoData.endCursor);
      } else {
        setNextPageCursor(null);
      }

      var item_list = [];

      for (var i = 0; i < metafields.length; i++) {
        var owner = metafields[i].owner;
        var ownerId = owner.id;

        var item = {
          id: ownerId,
          heading: owner.heading,
          body: owner.body,
        };

        item_list.push(item);
      }

      setItems(item_list);

      setLoadingResourceList(false);
    }
  }, [productsDataForward]);

  useEffect(() => {
    if (
      !productsLoadingBackward &&
      !productsErrorBackward &&
      productsDataBackward &&
      productsDataBackward.metafieldDefinitions
    ) {
      var metafields =
        productsDataBackward.metafieldDefinitions.nodes[0].metafields.nodes;
      var pageInfoData =
        productsDataBackward.metafieldDefinitions.nodes[0].metafields.pageInfo;

      setHasPreviousPage(pageInfoData.hasPreviousPage);
      setHasNextPage(pageInfoData.hasNextPage);

      if (pageInfoData.hasPreviousPage) {
        setPreviousPageCursor(pageInfoData.startCursor);
      } else {
        setPreviousPageCursor(null);
      }

      if (pageInfoData.hasNextPage) {
        setNextPageCursor(pageInfoData.endCursor);
      } else {
        setNextPageCursor(null);
      }

      var item_list = [];

      for (var i = 0; i < metafields.length; i++) {
        var owner = metafields[i].owner;
        var ownerId = owner.id;

        var item = {
          id: ownerId,
          heading: owner.heading,
          body: owner.body,
        };

        item_list.push(item);
      }

      setItems(item_list);
      setLoadingResourceList(false);
    }
  }, [productsDataBackward]);

  // initial item load
  // useEffect(() => {

  //     getProductsQuery({variables: {
  //         "resourceOwner": "PRODUCT"
  //     }})

  // }, []);

  function handleResourceListTypeChange(value) {
    setResourceTypeListSelected(value[0]);

    value = value[0];

    console.log(value);
    // these need to only run after handling a resource list type change

    if (value == "Product") {
      getProductsQuery({
        variables: {
          resourceOwner: "PRODUCT",
        },
      });
      setLoadingResourceList(true);
    } else if (value == "Variant") {
      getProductsQuery({
        variables: {
          resourceOwner: "PRODUCTVARIANT",
        },
      });

      setLoadingResourceList(true);
    } else if (value == "Collection") {
      getProductsQuery({
        variables: {
          resourceOwner: "COLLECTION",
        },
      });
      setLoadingResourceList(true);
    } else if (value == "Shop") {
      getProductsQuery({
        variables: {
          resourceOwner: "SHOP",
        },
      });

      setLoadingResourceList(true);
    }

    // setLoadingResourceList(false)
  }

  if (pageState == "initial") {
    const filters = [
      {
        key: "taggedWith1",
        label: <>{resourceTypeListSelected}</>,
        filter: (
          <>
            <ChoiceList
              title=""
              choices={resourceTypeList}
              onChange={handleResourceListTypeChange}
              selected={resourceTypeListSelected}
            />
          </>
        ),
        shortcut: true,
      },
    ];

    const appliedFilters = filters;

    const filterControl = (
      <Filters hideQueryField queryValue="" filters={filters} />
    );

    var emptyStateMarkup = (
      <>
        <Card sectioned>
          <EmptyState
            heading="Attach File to Resources"
            action={{
              content: "Upload File",
              onAction: transitionToCreatingRelationshipPage,
            }}
            secondaryAction={{
              content: "Choose Existing File",
              onAction: transitionToCreatingRelationshipPageToExistingFiles,
            }}
            image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
          >
            <p>
              When you want files to show up on product pages - for a certain
              variant, product, collection (or even across all products on the
              store) - upload them here.{" "}
            </p>
          </EmptyState>
        </Card>
      </>
    );

    var pagination = requiresPagination && (
      <>
        <br></br>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            hasPrevious={hasPreviousPage}
            hasNext={hasNextPage}
            onPrevious={() => {
              // need to get current information

              if (resourceTypeListSelected == "Product") {
                getProductsBackward({
                  variables: {
                    resourceOwner: "PRODUCT",
                    beforeCursor: previousPageCursor,
                  },
                });
              } else if (resourceTypeListSelected == "Variant") {
              } else if (resourceTypeListSelected == "Collection") {
              } else if (resourceTypeListSelected == "Shop") {
              }
            }}
            onNext={() => {
              // need to get current information

              if (resourceTypeListSelected == "Product") {
                getProductsForward({
                  variables: {
                    resourceOwner: "PRODUCT",
                    afterCursor: nextPageCursor,
                  },
                });

                setLoadingResourceList(true);
              } else if (resourceTypeListSelected == "Variant") {
                getProductsForward({
                  variables: {
                    resourceOwner: "PRODUCTVARIANT",
                    afterCursor: nextPageCursor,
                  },
                });

                setLoadingResourceList(true);
              } else if (resourceTypeListSelected == "Collection") {
                getProductsForward({
                  variables: {
                    resourceOwner: "COLLECTION",
                    afterCursor: nextPageCursor,
                  },
                });

                setLoadingResourceList(true);
              } else if (resourceTypeListSelected == "Shop") {
              }
            }}
          />
        </div>

        <br></br>
      </>
    );

    return (
      <>
        <Card>
          <ResourceList
            loading={resourceListLoading}
            emptyState={emptyStateMarkup}
            items={items}
            alternateTool={
              <>
                <Stack>
                  <Button onClick={transitionToCreatingRelationshipPage}>
                    Upload file
                  </Button>

                  <Button
                    onClick={
                      transitionToCreatingRelationshipPageToExistingFiles
                    }
                  >
                    Choose existing file
                  </Button>
                </Stack>
              </>
            }
            renderItem={(item) => {
              const { id, heading, body } = item;
              const media = (
                <>
                  <Thumbnail
                    source={ProductsMajor}
                    size="large"
                    alt="Small document"
                  ></Thumbnail>
                </>
              );

              return (
                <ResourceItem
                  id={id}
                  url={
                    "/resource/" +
                    encodeURIComponent(id) +
                    "/" +
                    resourceTypeListSelected
                  }
                  media={media}
                  external={false}
                  accessibilityLabel={`View details for sdf`}
                >
                  <h3>
                    <TextStyle variation="strong">{heading}</TextStyle>
                  </h3>
                  <div>{body}</div>
                </ResourceItem>
              );
            }}
            filterControl={filterControl}
            resourceName={{ singular: "resource", plural: "resources" }}
          />

          {pagination}
        </Card>
      </>
    );
  } else if (pageState == "existing-file-relationship-content") {
    var steps = [
      <>
        <ChooseResource selectChange={handleResourceChosen} app={app} />
      </>,

      <>
        <ExistingFileChooser
          afterSubmit={handleFileUploads}
          resourceChosen={resourceType}
        ></ExistingFileChooser>
      </>,

      <>
        <SelectRules
          fileUrls={urlFiles}
          resourceType={resourceType}
          selectedOptions={selectedResources}
        />
      </>,
    ];

    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stepper
                styleConfig={{
                  activeBgColor: "rgba(0, 128, 96, 1)",
                  completedBgColor: "rgba(0, 110, 82, 1)",
                }}
                steps={[
                  { label: "Choose resource" },
                  { label: "Choose files" },
                  { label: "Select rules" },
                ]}
                activeStep={activeStep}
              ></Stepper>
              {steps[activeStep]}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  } else if (pageState == "relationship-content") {
    var steps = [
      <>
        <ChooseResource selectChange={handleResourceChosen} app={app} />
      </>,

      <>
        <Button onClick={goBackToSelectingResource}>
          <Icon source={MobileBackArrowMajor} color="base" />
        </Button>
        <br />
        <br />

        <FileDropper afterSubmit={handleFileUploads}></FileDropper>
      </>,

      <>
        <SelectRules
          fileUrls={urlFiles}
          resourceType={resourceType}
          selectedOptions={selectedResources}
        />
      </>,
    ];

    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stepper
                styleConfig={{
                  activeBgColor: "rgba(0, 128, 96, 1)",
                  completedBgColor: "rgba(0, 110, 82, 1)",
                }}
                steps={[
                  { label: "Choose resource" },
                  { label: "Upload files" },
                  { label: "Select rules" },
                ]}
                activeStep={activeStep}
              ></Stepper>

              {steps[activeStep]}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}
