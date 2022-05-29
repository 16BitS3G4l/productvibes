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
  KeyboardKey,
  CalloutCard,
  Banner,
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

// import { CopyBlock, dracula } from "react-code-blocks";

import QRCode from 'react-qr-code';

export class QRCodes extends Component {

 

  constructor(props) {
    super(props);

  
  }

  render() {


    return (
      <>
<Card title="Get QR Codes" >
  <Card.Section>

    <p>All QR codes are generated dynamically as soon as you connect files to store resources (like a product or variant)</p>

    <br></br>
    <p>Once that's done, you can go to the attachments tab and search for that resource.</p>
    <br></br>
    <p>After it's selected, the page for that resource will show a list of files with corresponding actions for each one.</p>
    <br></br>
    <p>One of those actions is labeled "View QR Code."</p>
    <br></br>
    <p>By pressing that button, you can view the QR code for a specific file and download it.</p>


</Card.Section>




<Card.Section>

<Banner
  title="Having issues finding your QR codes?"
  action={{content: 'Email support', url: 'mailto:support@shopifysoftwaresolutions.com?subject=ProductVibes%20-%20Integrate%20Email%20with%20Documents', external: true}}
  secondaryAction={{content: "Call support", url: "tel:+3473504351", external: true}}
  
>
  <p>We'll help you find them - you can email or call us.</p>
</Banner>
</Card.Section>

</Card>



      </>
    );

  }
}