import React, { Component, useEffect } from "react";
import { NoteMinor, InfoMinor } from "@shopify/polaris-icons";

import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client";

import {
  TextField,
  IndexTable,
  TextStyle,
  Card,
  Filters,
  Link,
  Thumbnail,
  Select,
  ExceptionList,
  Pagination,
  Button,
  useIndexResourceState,
} from "@shopify/polaris";
import { ResourcePicker, Toast } from "@shopify/app-bridge/actions";

// import useMutation from 'react';
import { useState, useCallback } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { data } from "@shopify/app-bridge/actions/Modal";

var QUERY_GENERAL_FILES = gql`
  query GetFiles($file_search: String!) {
    files(first: 5, query: $file_search) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }

      nodes {
        fileStatus
        alt

        ... on GenericFile {
          url
          id
          createdAt
          originalFileSize
        }
      }
    }
  }
`;

var QUERY_GENERAL_FILES_FORWARD = gql`
  query GetFiles($file_search: String!, $after_cursor: String!) {
    files(first: 5, after: $after_cursor, query: $file_search) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }

      nodes {
        fileStatus
        alt

        ... on GenericFile {
          url
          id
          createdAt
          originalFileSize
        }
      }
    }
  }
`;

var QUERY_GENERAL_FILES_BACKWARD = gql`
  query GetFiles($file_search: String!, $before_cursor: String!) {
    files(last: 5, before: $before_cursor, query: $file_search) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }

      nodes {
        fileStatus
        alt

        ... on GenericFile {
          url
          id
          createdAt
          originalFileSize
        }
      }
    }
  }
`;

export function ExistingFileSearch(props) {
  var currentFilePosition = 0;

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [fileList, setFileList] = useState(props.file_urls);
  var file_list = [];

  const [
    runQuery,
    { data: pull_data, loading: pull_loading, error: pull_error },
  ] = useLazyQuery(QUERY_GENERAL_FILES);
  const [
    runQueryForward,
    {
      data: pull_data_forward,
      loading: pull_loading_forward,
      error: pull_error_forward,
    },
  ] = useLazyQuery(QUERY_GENERAL_FILES_FORWARD);
  const [
    runQueryBackward,
    {
      data: pull_data_backward,
      loading: pull_loading_backward,
      error: pull_error_backward,
    },
  ] = useLazyQuery(QUERY_GENERAL_FILES_BACKWARD);

  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [previousPageCursor, setPreviousPageCursor] = useState(null);
  const [nextPageCursor, setNextPageCursor] = useState(null);

  console.log("Pulling: " + pull_data);
  console.log(pull_data);

  var loaded_already = false;

  function processButton() {
    console.log("Customers: " + JSON.stringify(customers));
  }

  useEffect(() => {
    if (!pull_loading && !pull_error && pull_data && pull_data.files) {
      console.log("Processing...");

      var pageInfoData = pull_data.files.pageInfo;

      setHasPreviousPage(pageInfoData.hasPreviousPage);
      setHasNextPage(pageInfoData.hasNextPage);

      console.log(pull_data);

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

      console.log("previous: " + previousPageCursor);
      console.log("next: " + nextPageCursor);

      console.log("Finished loading");
      console.log(pull_data);

      // if(!pull_loading && pull_data && pull_data.files) {

      //   console.log("Pull data: " + pull_data);

      var file_url_list = [];

      //   console.log("pull " + pull_data)

      for (var i = 0; i < pull_data.files.nodes.length; i++) {
        var file = pull_data.files.nodes[i].url;

        var url = file.split("?")[0];
        var filename = url.substring(url.lastIndexOf("/") + 1);

        file_url_list.push({
          url: file,
          name: filename,
          id: pull_data.files.nodes[i].id,
          date_added: new Date(
            pull_data.files.nodes[i].createdAt
          ).toDateString(),
          size: pull_data.files.nodes[i].originalFileSize,
        });
      }

      setCustomers(file_url_list);

      setLoadingCustomers(false);

      console.log(file_url_list);

      //     setLoadingCustomers(false);

      //     setCustomers(file_url_list);

      //     return file_url_list;

      // } else {
      //   console.log("Invalid return")
      //   setLoadingCustomers(false);
      //   setCustomers([])
      //   return [];
      // }
    } else {
      console.log("nope!");
    }
  }, [pull_data]);

  useEffect(() => {
    if (
      !pull_loading_forward &&
      !pull_error_forward &&
      pull_data_forward &&
      pull_data_forward.files
    ) {
      var pageInfoData = pull_data_forward.files.pageInfo;

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

      console.log("previous: " + previousPageCursor);
      console.log("next: " + nextPageCursor);

      console.log("Finished loading");
      console.log(pull_data_forward);

      // if(!pull_loading && pull_data && pull_data.files) {

      //   console.log("Pull data: " + pull_data);

      var file_url_list = [];

      //   console.log("pull " + pull_data)

      for (var i = 0; i < pull_data_forward.files.nodes.length; i++) {
        var file = pull_data_forward.files.nodes[i].url;

        var url = file.split("?")[0];
        var filename = url.substring(url.lastIndexOf("/") + 1);

        file_url_list.push({
          url: file,
          name: filename,
          id: pull_data_forward.files.nodes[i].id,
          date_added: new Date(
            pull_data_forward.files.nodes[i].createdAt
          ).toDateString(),
          size: pull_data_forward.files.nodes[i].originalFileSize,
        });
      }

      setCustomers(file_url_list);

      setLoadingCustomers(false);

      console.log(file_url_list);

      //     setLoadingCustomers(false);

      //     setCustomers(file_url_list);

      //     return file_url_list;

      // } else {
      //   console.log("Invalid return")
      //   setLoadingCustomers(false);
      //   setCustomers([])
      //   return [];
      // }
    } else {
      console.log("nope!");
    }
  }, [pull_data_forward]);

  useEffect(() => {
    if (
      !pull_loading_backward &&
      !pull_error_backward &&
      pull_data_backward &&
      pull_data_backward.files
    ) {
      var pageInfoData = pull_data_backward.files.pageInfo;

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

      console.log("previous: " + previousPageCursor);
      console.log("next: " + nextPageCursor);

      console.log("Finished loading");
      console.log(pull_data_backward);

      // if(!pull_loading && pull_data && pull_data.files) {

      //   console.log("Pull data: " + pull_data);

      var file_url_list = [];

      //   console.log("pull " + pull_data)

      for (var i = 0; i < pull_data_backward.files.nodes.length; i++) {
        var file = pull_data_backward.files.nodes[i].url;

        var url = file.split("?")[0];
        var filename = url.substring(url.lastIndexOf("/") + 1);

        file_url_list.push({
          url: file,
          name: filename,
          id: pull_data_backward.files.nodes[i].id,
          date_added: new Date(
            pull_data_backward.files.nodes[i].createdAt
          ).toDateString(),
          size: pull_data_backward.files.nodes[i].originalFileSize,
        });
      }

      setCustomers(file_url_list);

      setLoadingCustomers(false);

      console.log(file_url_list);

      //     setLoadingCustomers(false);

      //     setCustomers(file_url_list);

      //     return file_url_list;

      // } else {
      //   console.log("Invalid return")
      //   setLoadingCustomers(false);
      //   setCustomers([])
      //   return [];
      // }
    } else {
      console.log("nope!");
    }
  }, [pull_data_backward]);

  function pull_files(query) {
    console.log("Query: " + query);

    // if(query == "") {
    //   setLoadingCustomers(false)
    //   setCustomers([])
    //   return;
    // }

    loaded_already = false;

    var test = {
      file_search: `filename:${query}`,
      before_cursor: previousPageCursor,
      after_cursor: nextPageCursor,
    };

    console.log(test);

    runQuery({
      variables: {
        file_search: `filename:${query}`,
      },
    });
  }

  // useEffect(() => {
  //   runQuery({
  //     variables: {
  //       file_search: `svg`,
  //     }
  //   });
  // }, [pull_data]);

  // console.log(props.file_urls)

  // const customers = props.file_urls

  const resourceName = {
    singular: "file",
    plural: "files",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

  if (selectedResources.length != 0) {
    console.log(selectedResources);
  }

  const [taggedWith, setTaggedWith] = useState("VIP");
  const [queryValue, setQueryValue] = useState(null);
  const [sortValue, setSortValue] = useState("today");

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const rowMarkup =
    customers &&
    customers.map(({ id, name, url, date_added, size }, index) => (
      <>
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <Thumbnail
                source={NoteMinor}
                size="large"
                alt="Small document"
              ></Thumbnail>
            </div>
          </IndexTable.Cell>

          <IndexTable.Cell>
            <TextStyle variation="strong">{name}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>{date_added}</IndexTable.Cell>
          <IndexTable.Cell>{bytesToSize(size)}</IndexTable.Cell>
        </IndexTable.Row>
      </>
    ));

  return (
    <>
      <div style={{ padding: "16px" }}>
        <ExceptionList
          items={[
            {
              icon: InfoMinor,
              description:
                "Select the files you want, search for any others, and then press continue to connect them to your store's resources.",
            },
          ]}
        />
      </div>

      <div style={{ padding: "16px", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Filters
            queryValue={queryValue}
            filters={[]}
            appliedFilters={[]}
            onQueryChange={async (data) => {
              setLoadingCustomers(true);
              setQueryValue(data);

              pull_files(data);

              // setTimeout((data) => {
              //    pull_files(data)
              // }, 100, data)

              // empty array
              // for(var i = 0; i < customers.length; i++) {
              //   customers.pop();
              // }

              // customers.
              // customers = []

              // props.file_urls.push({id: 45, name: "sdf", date_added: "2022-04-03", size: "45 MB"})
              // props.file_urls = []

              // for(var i = 0; i < props.file_urls.length; i++) {
              //   props.file_urls.pop()
              // }

              // setCustomers([])

              // alert(data)
              // alert(data)
            }}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      <IndexTable
        resourceName={resourceName}
        itemCount={customers.length}
        loading={loadingCustomers}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "" },
          { title: "File name" },
          { title: "Date added" },
          { title: "Size" },
        ]}
      >
        {rowMarkup}
      </IndexTable>

      <br></br>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          hasPrevious={hasPreviousPage}
          hasNext={hasNextPage}
          onPrevious={() => {
            var query = queryValue;

            setLoadingCustomers(true);

            runQueryBackward({
              variables: {
                file_search: `filename:${query}`,
                before_cursor: previousPageCursor,
              },
            });

            console.log("Previous");
          }}
          onNext={() => {
            var query = queryValue;

            setLoadingCustomers(true);

            runQueryForward({
              variables: {
                file_search: `filename:${query}`,
                after_cursor: nextPageCursor,
              },
            });

            console.log("Next");
          }}
        />
      </div>

      <br></br>
      <br></br>

      <Button onClick={processButton} disabled={selectedResources.length == 0}>
        Continue
      </Button>
    </>
  );

  function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
