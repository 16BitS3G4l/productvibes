import React, { Component } from 'react';
import {NoteMinor} from '@shopify/polaris-icons';

import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';

import {
  TextField, 
  IndexTable,
  TextStyle,
  Card,
  Filters,
  Link,
  Thumbnail,
  Select,
  Pagination,
  useIndexResourceState 

} from "@shopify/polaris";
import { ResourcePicker, Toast } from '@shopify/app-bridge/actions';

// import useMutation from 'react';
import {useState, useCallback } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';


export function ExistingFileSearch(props) {

    console.log(props.file_urls)

    const customers = props.file_urls

    const resourceName = {
      singular: 'file',
      plural: 'files',
    };
  
    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(customers);
    const [taggedWith, setTaggedWith] = useState('VIP');
    const [queryValue, setQueryValue] = useState(null);
    const [sortValue, setSortValue] = useState('today');
  
    const handleTaggedWithChange = useCallback(
      (value) => setTaggedWith(value),
      [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove]);
    const handleSortChange = useCallback((value) => setSortValue(value), []);
  


    const filters = [
      {
        key: 'taggedWith',
        label: 'Tagged with',
        filter: (
          <TextField
            label="Tagged with"
            value={taggedWith}
            onChange={handleTaggedWithChange}
            autoComplete="off"
            labelHidden
          />
        ),
        shortcut: true,
      },
    ];
  
    const appliedFilters = !isEmpty(taggedWith)
      ? [
          {
            key: 'taggedWith',
            label: disambiguateLabel('taggedWith', taggedWith),
            onRemove: handleTaggedWithRemove,
          },
        ]
      : [];
  
    const sortOptions = [
      {label: 'Today', value: 'today'},
      {label: 'Yesterday', value: 'yesterday'},
      {label: 'Last 7 days', value: 'lastWeek'},
    ];
  
    const rowMarkup = customers.map(
      ({id, name, url, date_added, size}, index) => (
          <>
          
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
          <div style={{marginTop: "10px", marginBottom: "10px"}}><Thumbnail source={NoteMinor} size="large" alt="Small document" ></Thumbnail></div>
          </IndexTable.Cell>

          <IndexTable.Cell>
            <TextStyle variation="strong">{name}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>{date_added}</IndexTable.Cell>
          <IndexTable.Cell>{bytesToSize(size)}</IndexTable.Cell>
        </IndexTable.Row>
        
      </>
      ),
    );
  
    return (
        <>
        <div style={{padding: '16px', display: 'flex'}}>
          <div style={{flex: 1}}>
            <Filters
              queryValue={queryValue}
              filters={[]}
              appliedFilters={[]}
              onQueryChange={(data) => {
                // props.refresh_files()
                setQueryValue(data)
              
              }}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
        <IndexTable
          resourceName={resourceName}
          itemCount={customers.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
          {title: ''},
            {title: 'File name'},
            {title: 'Date added'},
            {title: 'Size'}
            
          ]}
        >
          {rowMarkup}

      
        </IndexTable>


        </>
    );
  
    function bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
   }

   
    function disambiguateLabel(key, value) {
      switch (key) {
        case 'taggedWith':
          return `Tagged with ${value}`;
        default:
          return value;
      }
    }
  
    function isEmpty(value) {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else {
        return value === '' || value == null;
      }
    }

  
   
  }