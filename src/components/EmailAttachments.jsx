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
  SkeletonPage,
  SkeletonBodyText
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ProductsCard } from "./ProductsCard";

// import { CopyBlock, dracula } from "react-code-blocks";

import QRCode from 'react-qr-code';

export class EmailAttachments extends Component {

 

  constructor(props) {
    super(props);

  
  }

  render() {


    return (
      <>
<Card title="Include Files in Email Notifications">
  <Card.Section><p>Currently, attaching files to emails needs to be integrated <b>manually</b>. <br></br><br></br>You can 
        follow our guide (see below) or reach out to support@shopifysoftwaresolutions.com (or +1 347-350-4351). <br></br><br></br> We'll provide a free-of-charge developer assisted session to get your store integrated. </p>

        <br></br>
        <p>If you want to do it yourself, please note some Liquid programming experience will be necessary.</p>
    <br />

</Card.Section>




<Card.Section title="Step 1.">

  1. Go to the <Link url="https://testingtherealshopiify.myshopify.com/admin/settings/notifications" external>
    Email notifications settings
      </Link> in Shopify's admin.
      
      <p>2. Select the email type you'd like to customize.
            {/* <ul>

                <li>Order Confirmation</li>
                <li>Order edited</li>
                <li>Order invoice</li>
                <li>Order cancelled</li>
                <li>Order refund</li>
                <li>Draft order invoice</li>
                <li>Abandoned checkout</li>


            </ul> */}

      </p>

  </Card.Section>


<Card.Section title="Step 2.">
  
To attach a file linked to a product, you need to access our liquid objects.
<br></br>   


      </Card.Section>

      <Card.Section>

      <Banner
  title="Having issues integrating your files?"
  action={{content: 'Email support', url: 'mailto:support@shopifysoftwaresolutions.com?subject=ProductVibes%20-%20Integrate%20Email%20with%20Documents', external: true}}
  secondaryAction={{content: "Call support", url: "tel:+3473504351", external: true}}
  
>
  <p>We can provide free-of-charge assistance integrating email flows with your documents.</p>
</Banner>


      </Card.Section>


</Card>


      </>
    );

  }
}