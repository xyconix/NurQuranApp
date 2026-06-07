import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Search, Menu } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
// Constants
const TEXT_COLOR = "white";
const ICON_SIZE = 28;
const PADDING = 20;

// Types
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp>();
  const {t} = useTranslation();
  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.header}>
      <Menu color={TEXT_COLOR} size={ICON_SIZE} />
      <Text style={styles.headerTitle}>{t(title)}</Text>
      <TouchableOpacity onPress={handleSearchPress}>
        <Search color={TEXT_COLOR} size={ICON_SIZE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: PADDING,
    alignItems: "center",
  },
  headerTitle: {
    color: TEXT_COLOR,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;