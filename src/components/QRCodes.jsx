import { useEffect, useState, useCallback } from "react";

import React, {Component} from 'react';

import { SketchPicker } from 'react-color';

// import { Gallery as Something }  from 'react-grid-gallery';

import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  DescriptionList,
  Link,
  FormLayout,
  Button,
  TextField,
  CalloutCard,
  Banner,
  Heading,
  Tabs,
  EmptyState,
  Select,
  DataTable,
  ChoiceList,
  ColorPicker,
  ResourceList,
  SkeletonPage,
  SkeletonBodyText,
  Filters
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ProductsCard } from "./ProductsCard";

// import { CopyBlock, dracula } from "react-code-blocks";

import QRCode from 'react-qr-code';

export function QRCodes() {
    const items = [];
    const appliedFilters = [];
    const filters = [];
  
    const filterControl = (
      <Filters
        disabled={!items.length}
        queryValue=""
        filters={filters}
        appliedFilters={appliedFilters}
      />
    );
  
    const emptyStateMarkup =
      !appliedFilters.length && !items.length ? (
        <EmptyState
          heading="You need to upload a file first"
          image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
        >
          <p>
            You can use the files tab to upload files and connect them to resources. Their QR codes will auto-populate here.
          </p>
        </EmptyState>
      ) : undefined;
  
    return (
        
        <>
              
            <Card>
              <ResourceList
                emptyState={emptyStateMarkup}
                items={items}
                renderItem={() => {}}
                filterControl={filterControl}
                resourceName={{singular: 'QR code', plural: 'QR codes'}}
              />
            </Card>
            </>
    );
  }