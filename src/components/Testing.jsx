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

import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router";
import { ExistingFileSearchTest } from "./ExistingFileSearchTest";
import { ExistingFileSearch } from "./ExistingFileSearch";

export function Testing(props) {
  const app = useAppBridge();
  let { link } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(link);
  return <>{searchParams.get("id")}</>;

  var filePosition = 0;

  // get files
  const GET_FILES = gql`
    {
      metafieldDefinitions(ownerType: COLLECTION, first: 15) {
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

  const { data, loading, error } = useQuery(GET_FILES);

  console.log(loading);

  if (!loading) {
    console.log(data);
    console.log("Data " + data);
  }

  // refresh_files("COA")

  if (!loading) {
    return <>test</>;
  } else {
    return <></>;
  }
}
