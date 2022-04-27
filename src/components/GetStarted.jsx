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
  Heading,
  Tabs,
  EmptyState,
  Select,
  DataTable,
  ChoiceList,
  ColorPicker,
  SkeletonPage,
  SkeletonBodyText
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ProductsCard } from "./ProductsCard";

import QRCode from 'react-qr-code';

export class GetStarted extends Component {

 

  constructor(props) {
    super(props);

  
  }

  render() {


    return (
      <>

<Stack distribution='fill'>
<CalloutCard
  title="I Want to Show Certificate of Analysis (COAs) on My Products"
  primaryAction={{
    content: 'Try it out',
    url: 'https://www.shopify.com',
  }}
>
  <p>Establish trust between your brand and consumers - by providing the critical information they need to make their purchase, as accessibly and conveniently as possilble.</p>
</CalloutCard>
</Stack>

<br></br>

<Stack distribution="fill">


<CalloutCard
  title="I Want to Show a Preview for My Ebooks"
  primaryAction={{
    content: 'Try it out',
    url: 'https://www.shopify.com',
  }}
>
  <p>Provide a customer experience that engages customers more than any of your competitors.</p>
</CalloutCard>

<CalloutCard
  title="I Want to Email Documents After an Order"
  primaryAction={{
    content: 'Try it out',
    url: 'https://www.shopify.com',
  }}
>
  <p>Gain and retain customers by providing frictionless buying experiences.</p>
</CalloutCard>





 
</Stack>
<br></br>
        <Card sectioned title="How is the app setup? We need ALOT of customization.">


        <p>We're trying to be as flexible as possible without degrading your experience. <Link url="https://help.shopify.com/manual" external>
        Let us know what you think
      </Link> </p>

      <br></br>
        
        <Heading>Functionality by scope</Heading>
        
        <DescriptionList
  items={[
    {
      term: 'Products',
      description:
        <>You can upload PDFs to show up on a single product page  - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link></>,
    },
    {
      term: 'Variants',
      description:
        <>You can upload PDFs to show up on the product page (only when a specific variant is selected) - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link> </>,
    },
    {
      term: 'Collections',
      description:
        <>You can also upload PDFs to show up across all the products in a collection - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link></>,
    },
    {
      term: 'Store',
      description:
        <>If you'd like, you can upload PDFs to show up across all the products in your store - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link></>,
    },
  ]}
/>

<br></br>

<Heading>General features</Heading>
        
        <DescriptionList
  items={[
    {
      term: 'PDF Preview',
      description:
        <>You can upload PDFs to show up on a single product page  - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link></>,
    },
    {
      term: 'Automated QR Code Generation (for each resource)',
      description:
        <>You can upload PDFs to show up on the product page (only when a specific variant is selected) - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link> </>,
    },
    {
      term: 'Display List of PDFs (downloadable as a zip)',
      description:
        <>You can also upload PDFs to show up across all the products in a collection - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link></>,
    },
    {
      term: 'Email',
      description:
        <>If you'd like, you can upload PDFs to show up across all the products in your store - <Link url="https://help.shopify.com/manual" external>
        Try Now
      </Link></>,
    },
  ]}
/>

        </Card>

        <Card sectioned title="What can I expect from support?">


<p>We try to be highly available at all times. You can reach us at support@shopifysoftwaresolutions.com (or you can us directly +1 347-380-4351).<br></br> <br></br>Please include "ProductVibes" in your subject line.</p>

<br></br>
<p>If - for whatever reason - we can't answer your call, we'll call back as soon as the business day allows.</p>

<br></br>

<p>You can request new features by emailing us at our support email address as well (support@shopifysoftwaresolutions.com).</p>
</Card>

        
      </>
    );

  }
}