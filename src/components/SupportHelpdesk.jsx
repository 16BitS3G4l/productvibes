import { useEffect, useState, useCallback } from "react";

import React, { Component } from "react";

import { SketchPicker } from "react-color";

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
  SkeletonBodyText,
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ProductsCard } from "./ProductsCard";

// import { CopyBlock, dracula } from "react-code-blocks";

import QRCode from "react-qr-code";

export class SupportHelpdesk extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Card title="Support">
          <Card.Section>
            <TextContainer>
              <p>We offer several options for support.</p>
              <p>
                You can always email us support@shopifysoftwaresolutions.com
              </p>
              <p>
                We're also available for immediate attention via our phone
                (718-415-2830) or our live chat - see the bottom right side of
                your screen.
              </p>
              <p>
                We'll always follow up with you if we can't answer right away,
                but generally a phone call is the most reliable way to get our
                attention.
              </p>
            </TextContainer>
          </Card.Section>

          <Card.Section>
            <Banner
              title="Need help?"
              action={{
                content: "Email support",
                url: "mailto:support@shopifysoftwaresolutions.com?subject=ProductVibes%20-%20General%20Support%20Inquiry",
                external: true,
              }}
              secondaryAction={{
                content: "Call support",
                url: "tel:+17184152830",
                external: true,
              }}
            >
              <p>Get the support you need - fast. We're here for you.</p>
            </Banner>
          </Card.Section>
        </Card>
      </>
    );
  }
}
