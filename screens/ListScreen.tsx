import React, { useState } from "react";
import { useEffect } from "react";
import * as axios from 'axios';
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, View, FlatList, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from 'react-native-maps';
import { Card } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const carousel1 = ({ item, index }) => {
  return (
    <View style={{
      borderRadius: 4,
      width: 200,
      height: 300,
      justifyContent: "center"
    }}>
      <Image
        style={{ resizeMode: "contain", width: 300, height: 300 }}
        source={item ? { uri: item } : require('../assets/image-not-available.png')}
      //source={{ uri: item }}
      />
      <Text>{item.title}</Text>
    </View>
  );
}


const Item = ({ name, addressFmt, slug, image }) => (
  <View style={styles.card} >
    <Card>
      <Card.Title>{slug}</Card.Title>
      <Card.Divider />
      <Carousel
        data={image}
        renderItem={carousel1}
        sliderWidth={323}
        itemWidth={300}
      />

      <Text>{name}</Text>
      <Card.Divider />
      <Text>Address => {addressFmt}</Text>
    </Card>
    {/* <Image
      style={{ resizeMode: "contain", width: 100, height: 100 }}
      source={image ? { uri: image } : require('../assets/image-not-available.png')}
    /> */}
  </View>
);

const ListScreen = () => {
  const route = useRoute<RouteProps>();
  const { term } = route.params;
  const [universities, setUniversity] = useState<University[]>();

  const renderItem = ({ item }) => (
    <Item name={item.name} addressFmt={item.addressFmt} slug={item.slug} image={item.image} />
  );


  useEffect(() => {
    Promise.all([
      axios.default.get(`http://192.168.100.4:3000/universities/${term}`),
    ])
      .then(([{ data: universitiesResults }]) => {
        if (universitiesResults) setUniversity(universitiesResults);
        console.log(term, universities);
      });
  }, []);

  return (

    <SafeAreaView>
      <FlatList
        data={universities}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  card: {
    borderRadius: 6,
    backgroundColor: '#7fffd4',
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#00ced1',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 10,
    backgroundColor: '#7fffd4'


  }
});

type RouteParams = {
  term: string;
};

type RouteProps = {
  params: RouteParams
  name: string;
  key: string;
};

type University = {
  name: string;
  addressFmt: string;
  slug: string;
  image: Array<string>;
}
export default ListScreen