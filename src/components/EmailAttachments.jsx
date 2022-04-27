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


<Card title="Include PDFs in Automated Emails" sectioned>
        <p>Currently, attaching PDFs to emails needs to be integrated <b>manually</b>. <br></br><br></br>You can 
        follow our guide (see below) or reach out to support@shopifysoftwaresolutions.com (or +1 347-350-4351). <br></br><br></br> We'll provide a free-of-charge developer assisted session to get your store integrated. </p>

        <br></br>
        <p>If you want to do it yourself, please note some Liquid programming experience will be necessary.</p>
</Card>

<br></br><br />
<Layout.AnnotatedSection title="Step 1. Navigate to Email Notification Code in Shopify">

    <Card sectioned>1. Go to the <Link url="https://testingtherealshopiify.myshopify.com/admin/settings/notifications" external>
    Email notifications settings
      </Link> in Shopify's admin.
      
      <p>2. Select the email type you'd like to customize. (the following are the supported email notifications)
            <ul>

                <li>Order Confirmation</li>
                <li>Order edited</li>
                <li>Order invoice</li>
                <li>Order cancelled</li>
                <li>Order refund</li>
                <li>Draft order invoice</li>
                <li>Abandoned checkout</li>


            </ul>

      </p>
      </Card>

</Layout.AnnotatedSection>


<Layout.AnnotatedSection title="Step 2. Insert Code Into Template">

    <Card sectioned>To attach a PDF linked to a product, insert the following (try in Order confirmation notification)
      
      <br></br> <br></br>
      <code>{`<?% if (product.metafield.pdf_download_url ?> <a href=''>Download Product PDF</a> <% endif %>
      `}</code>

     <br></br><br></br>
     To attach a PDF linked to a variant, insert the following <br /><br />

    <code>{`<?% if (product.variant.metafield.pdf_download_url ?> <a href=''>Download Product PDF</a> <% endif %>
      `}</code>

      <br /><br />      

      </Card>

</Layout.AnnotatedSection>

<br /><br />

<Banner
  title="Having issues integrating your PDFs?"
  action={{content: 'Email support', url: 'mailto:support@shopifysoftwaresolutions.com?subject=ProductVibes%20-%20Integrate%20Email%20with%20Documents', external: true}}
  secondaryAction={{content: "Call support", url: "tel:+3473504351", external: true}}
  status="info"
>
  <p>We can provide free-of-charge assistance integrating email flows with your documents.</p>
</Banner>


      </>
    );

  }
}