// import { React, Component, useState, useCallback, useEffect } from "react";
import React, { Component } from "react";
import { NoteMinor } from "@shopify/polaris-icons";

import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client";

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
  Caption,
} from "@shopify/polaris";
import { ResourcePicker, Toast } from "@shopify/app-bridge/actions";

// import useMutation from 'react';
import { useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

import { ExistingFileSearchTest } from "./ExistingFileSearchTest";
import { ExistingFileSearch } from "./ExistingFileSearch";

export function ExistingFileChooser(props) {
  const app = useAppBridge();

  var filePosition = 0;

  // get files
  const GET_FILES = gql`
    {
      files(first: 5, query: "") {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
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

  const { data, loading, error } = useQuery(GET_FILES);
  // get

  const [file_urls, setFileUrls] = useState([]);

  if (!loading) {
    var file_url_list = [];

    for (var i = 0; i < data.files.nodes.length; i++) {
      var file = data.files.nodes[i].url;

      var url = file.split("?")[0];
      var filename = url.substring(url.lastIndexOf("/") + 1);

      file_url_list.push({
        url: file,
        name: filename,
        id: filePosition,
        date_added: new Date(data.files.nodes[i].createdAt).toDateString(),
        size: data.files.nodes[i].originalFileSize,
      });

      filePosition++;
    }

    // setFileUrls(file_url_list)

    // method for extracting filename
    //   var url = "https://cdn.shopify.com/s/files/1/0549/5033/0428/files/AdobeStock_30422752.jpeg?v=1651689614".split("?")[0];
    //   console.log(url.substring(url.lastIndexOf("/")+1));
  }

  // refresh_files("COA")

  if (!loading) {
    return (
      <>
        <ExistingFileSearch
          {...props}
          afterSubmit={function (data) {
            alert(data);
            props.afterSubmit(data);
          }}
          resourceChosen={props.resourceChosen}
          file_urls={file_url_list}
        ></ExistingFileSearch>
      </>
    );
  } else {
    return <></>;
  }
}
