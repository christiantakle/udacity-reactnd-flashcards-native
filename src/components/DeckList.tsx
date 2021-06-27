import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { FC, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { receiveDecks } from "../actions/actions";
import { RootStackParamList } from "../navigation";
import { useTypedSelector } from "../reducers/reducer";
import { getDecks } from "../utility/api";
import { colors } from "../utility/colors";
import { setLocalNotification } from "../utility/Notification";
import { DeckPreview } from "./DeckPreview";
import { Loading } from "./Loading";

interface Props {
  readonly navigation: StackNavigationProp<RootStackParamList, "Decks">;
}

export const DeckList: FC<Props> = ({ navigation }) => {
  const { loading, decks, decksIds } = useTypedSelector(({ decks }) => {
    const decksIds = decks ? Object.keys(decks) : null;

    return {
      loading: decks === null ? true : false,
      decks,
      decksIds,
    };
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setLocalNotification();
    getDecks().then((decks) => dispatch(receiveDecks(decks)));
  }, []);

  if (loading === true) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Deck list</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("New Deck")}
        >
          <MaterialCommunityIcons name="plus" size={40} color={colors.gray} />
        </TouchableOpacity>
      </View>
      {decksIds ? (
        decksIds.map((deck_id) => (
          <DeckPreview
            key={deck_id}
            deck_id={deck_id}
            decks={decks}
            navigation={navigation}
          />
        ))
      ) : (
        <View style={styles.noDeckContainer}>
          <Text style={styles.noDeckMessage}>You don't have any deck yet</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
  },
  noDeckMessage: {
    textAlign: "center",
    fontSize: 22,
    color: colors.gray,
  },
  noDeckContainer: {
    flex: 1,
    justifyContent: "center",
    height: 200,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  addButton: {
    width: 40,
    height: 40,
  },
});
