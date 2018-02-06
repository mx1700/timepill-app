'use strict';

import React, { Component } from 'react';

import {
  View,
  ListView,
  StyleSheet,
} from 'react-native';


export default class GridView extends Component{

    static defaultProps = {
        items: {},
        style: {},
        itemsPerRow: 1,
        renderItem: () => {},
        onEndReached: null,
        scrollEnabled: true,
        renderSeparator: null,
        fillIncompleteRow: false,
        renderSectionHeader: null,
        automaticallyAdjustContentInsets: false
    };



    createGroup = (items, itemsPerRow) => {
        let group = [];
        let itemGroups = [];

        items.forEach(function (item) {
            if (group.length === itemsPerRow) {
                itemGroups.push(group);
                group = [item];
            } else {
                group.push(item);
            }
        });

        if (group.length > 0) {
            if (this.props.fillIncompleteRow === true) {
                while (group.length < itemsPerRow) {
                    group.push(null);
                }
            }
            itemGroups.push(group);
        }

        return itemGroups;
    };


  groupItems = (items, hasHeaders, itemsPerRow) => {
      if (hasHeaders) {
          let data = {};

          for (let i in items) {
              data[i] = this.createGroup(items[i], itemsPerRow);
          }

          return data;
      }

      return this.createGroup(items, itemsPerRow);
  };


  renderRowGroup = (group, sectionID, rowID) => {
      let items = group.map((item) => {
          return this.props.renderItem(item);
      });

      return (
          <View style={styles.row}>
              {items}
          </View>
      );
  };


  render() {
      let dsContent = null;
      let hasHeaders = !Array.isArray(this.props.items);
      let groups = this.groupItems(this.props.items,
          hasHeaders,
          this.props.itemsPerRow);
      let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });

      if (hasHeaders) {
          dsContent = ds.cloneWithRowsAndSections(groups);
      } else {
          dsContent = ds.cloneWithRows(groups);
      }

      return (
          <ListView
              dataSource={dsContent}
              // style={this.props.style}
              renderRow={this.renderRowGroup}
              renderFooter={this.props.renderFooter}
              onEndReached={this.props.onEndReached}
              scrollEnabled={this.props.scrollEnabled}
              renderSeparator={this.props.renderSeparator}
              renderSectionHeader={this.props.renderSectionHeader}
              enableEmptySections={true}
              automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
              refreshControl={this.props.refreshControl}
              removeClippedSubviews={this.props.removeClippedSubviews}
              contentContainerStyle={{paddingTop: 15}}
          />
      );
  }
}



const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
      backgroundColor: 'white'
  }
});


module.exports = GridView;
