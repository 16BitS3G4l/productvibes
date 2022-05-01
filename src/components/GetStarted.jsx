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
  MediaCard,
  Stack,
  DescriptionList,
  Link,
  FormLayout,
  Button,
  TextField,
  CalloutCard,
  Heading,
  VideoThumbnail,
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


<Layout>

<Layout.Section secondary>
<CalloutCard sectioned title="How do I use the app in general?" primaryAction={{content:"Learn how", url:"github.com"}} secondaryAction={{content: "Schedule a demo", external: true, url:"https://calendly.com/shopify-software-solutions/walkthrough"}}>
  Learn how to use the full power of the app for your store in any situation (guided tour).
  </CalloutCard>
</Layout.Section>

<Layout.Section primary>

<CalloutCard
  title="I want to show certificate of analysis (COAs) on my products"
  primaryAction={{
    content: 'Try it out',
    url: 'https://www.shopify.com',
  }}
>
  <p>Establish trust between your brand and consumers - by providing the critical information they need to make their purchase, as accessibly and conveniently as possible.</p>
</CalloutCard>


</Layout.Section>
</Layout>

<br></br>

<Stack distribution="fill">


<CalloutCard
  title="I want a preview for my e-books"
  primaryAction={{
    content: 'Try it out',
    url: 'https://www.shopify.com',
  }}
>
  <p>Provide an experience that engages customers more than any of your competitors.</p>
</CalloutCard>

<CalloutCard
  title="I want to sell digital products"
  primaryAction={{
    content: 'Try it out',
    url: 'https://www.shopify.com',
  }}
>
  <p>Upload your files, link them to products, customize your emails (with our code), then sell!</p>
</CalloutCard>





 
</Stack>


<br></br>
        <Card sectioned title="How is the app setup? We need ALOT of customization.">


        <p>We're trying to be as flexible as possible without degrading your experience. <Link url="https://help.shopify.com/manual" external>
        Let us know what you think
      </Link> </p>

<br></br><br></br>
      <Heading>General features</Heading>
        
        <DescriptionList
  items={[
    {
      term: 'PDF preview',
      description:
        <>Our PDF popup provides a viewing experience for any PDF documents you'd like to share with customers. <br></br>No blurry images or interruptions in customer purchases necessary.</>,
    },
    {
      term: 'Automated QR code generation (for each file)',
      description:
        <>All files uploaded will automatically generate a QR code that links directly to the file.</>,
    },
    {
      term: 'Display list of files (downloadable as a zip)',
      description:
        <>If more than one file is linked to a product, you have the option to show all of them on the product page.</>,
    },
    {
      term: 'Email',
      description:
        <>You can include any uploaded files in emails. If they are connected to your store, product/variant, or even a collection.</>,
    },
  ]}
/>

      <br></br>
        
        <Heading>Functionality by scope</Heading>
        
        <DescriptionList
  items={[
    {
      term: 'Products',
      description:
        <>You can upload PDFs to show up on a single product page.</>,
    },
    {
      term: 'Variants',
      description:
        <>You can upload PDFs to show up on the product page (only when a specific variant is selected)</>,
    },
    {
      term: 'Collections',
      description:
        <>You can also upload PDFs to show up across all the products in a collection.</>,
    },
    {
      term: 'Store',
      description:
        <>If you'd like, you can upload PDFs to show up across all the products in your store.</>,
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