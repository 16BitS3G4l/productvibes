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
              <p>We offer </p>
            </TextContainer>
          </Card.Section>

          <Card.Section>
            <Banner
              title="Having issues finding your QR codes?"
              action={{
                content: "Email support",
                url: "mailto:support@shopifysoftwaresolutions.com?subject=ProductVibes%20-%20Integrate%20Email%20with%20Documents",
                external: true,
              }}
              secondaryAction={{
                content: "Call support",
                url: "tel:+3473504351",
                external: true,
              }}
            >
              <p>We'll help you find them - you can email or call us.</p>
            </Banner>
          </Card.Section>
        </Card>
      </>
    );
  }
}
