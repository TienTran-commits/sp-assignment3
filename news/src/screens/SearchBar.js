import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import _ from 'lodash';
import { Container, Header, Item, Input, Icon, Button, Text, Content, List, ListItem, Left, Body, Right, Thumbnail } from 'native-base';
export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            fullData: [],
            loading: false,
            error: null,
            query: ""
        }
    }

    componentDidMount() {
        this.requestAPIPhotos();
    }

    requestAPIPhotos = _.debounce(() => {
        this.setState({ loading: true })
        const apiURL = "https://jsonplaceholder.typicode.com/photos?_limit=30"
        fetch(apiURL).then((res) => res.json())
            .then((resJson) => {
                this.setState({
                    loading: false,
                    data: resJson,
                    fullData: resJson
                })
            }).catch(error => {
                this.setState({ error, loading: false })
            })
    }, 250)

    renderFooter = () => {
        if (!this.state.loading) return null
        return (
            <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
                <ActivityIndicator animating size="large" />
            </View>
        )
    }

    _renderItem = ({ item, index }) => {
        return (
            <ListItem avatar>
                <Left>
                    <Thumbnail source={{ uri: item.thumbnailUrl }} />
                </Left>
                <Body>
                    <Text>{item.title}</Text>
                </Body>
            </ListItem>
        )
    }

    handleSearch = (text) => {
        const formattedQuery = text.toLowerCase()
        const data = _.filter(this.state.fullData, photo => {
            if (photo.title.includes(formattedQuery)) {
                return true
            }
            return false
        })
        this.setState({ data, query: text })
    }

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={this.handleSearch} />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <List>
                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={this.renderFooter}
                    />

                </List>
            </Container>
        );
    }
}