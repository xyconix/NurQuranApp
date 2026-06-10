import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BookOpen, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { HOME_COLORS } from "../constants/home.constants";
import { RootStackParamList } from "../navigation/AppNavigator";
import { HomeTab, SurahHome } from "../types/quran.types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HomeTabsProps {
  activeTab: HomeTab;
  surahs: SurahHome[];
}

interface SurahListProps {
  surahs: SurahHome[];
}

interface Para {
  id: number;
  name: string;
  arabicName: string;
  juzNumber: number;
}

const PARA_DATA: Para[] = Array.from({ length: 30 }, (_, index) => {
  const juzNumber = index + 1;

  return {
    id: juzNumber,
    name: `Juz ${juzNumber}`,
    arabicName: `الجزء ${juzNumber}`,
    juzNumber,
  };
});

export const SurahList: React.FC<SurahListProps> = ({ surahs }) => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const renderSurahItem = useCallback(
    ({ item }: { item: SurahHome }) => (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          navigation.navigate("SurahDetail", {
            surahId: item.nomor,
            nomorAyat: 1,
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.nomor}</Text>
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.namaLatin}
            </Text>
            <Text style={styles.arabicName} numberOfLines={1}>
              {item.nama}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.itemSub} numberOfLines={1}>
              {item.arti}
            </Text>
            <Text style={styles.itemMeta} numberOfLines={1}>
              {item.tempatTurun} • {item.jumlahAyat} {t("Ayahs")}
            </Text>
          </View>
        </View>

        <ChevronRight color={HOME_COLORS.TEXT_SECONDARY} size={20} />
      </TouchableOpacity>
    ),
    [navigation, t]
  );

  const keyExtractor = useCallback(
    (item: SurahHome) => item.nomor.toString(),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={surahs}
        renderItem={renderSurahItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<ListEmptyText text={t("No surahs available")} />}
      />
    </View>
  );
};

export const ParaList: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const renderParaItem = useCallback(
    ({ item }: { item: Para }) => (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          navigation.navigate("JuzDetail", {
            juzId: item.juzNumber,
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.paraIcon}>
          <BookOpen color={HOME_COLORS.PRIMARY} size={24} />
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.arabicSmall}>{item.arabicName}</Text>
          <Text style={styles.itemSub}>
            {t("Read verses in this juz")}
          </Text>
        </View>

        <ChevronRight color={HOME_COLORS.TEXT_SECONDARY} size={20} />
      </TouchableOpacity>
    ),
    [navigation, t]
  );

  const keyExtractor = useCallback((item: Para) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={PARA_DATA}
        renderItem={renderParaItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<ListEmptyText text={t("No juz found")} />}
      />
    </View>
  );
};

export const HomeTabs: React.FC<HomeTabsProps> = ({ activeTab, surahs }) => {
  return (
    <View style={styles.container}>
      {activeTab === "Surah" && <SurahList surahs={surahs} />}
      {activeTab === "Para" && <ParaList />}
    </View>
  );
};

const ListEmptyText = ({ text }: { text: string }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(141,146,163,0.2)",
  },
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: HOME_COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  numberText: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: "700",
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 4,
  },
  itemTitle: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },
  arabicName: {
    color: HOME_COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: "500",
    maxWidth: "42%",
    textAlign: "right",
  },
  arabicSmall: {
    color: HOME_COLORS.PRIMARY,
    fontSize: 14,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  itemSub: {
    color: HOME_COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  itemMeta: {
    color: HOME_COLORS.TEXT_SECONDARY,
    fontSize: 11,
    textAlign: "right",
    maxWidth: "48%",
  },
  paraIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(164,74,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  emptyText: {
    color: HOME_COLORS.TEXT_SECONDARY,
    fontSize: 16,
    textAlign: "center",
  },
});
