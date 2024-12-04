import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bem } from "../types/DataStructures/Bem";
import { DataTableProps } from "../types/DataTableProps";

export function DataTable({ data, getRowColor }: DataTableProps) {

  function handleRowPress() {
    Alert.alert(
      "Detalhes do Patrimônio",
      // `Tag: ${item.tag}\nPatrimônio: ${item.patrimonio}\nDescrição: ${item.descricao}`
    );
  }

  function renderItem({ item }: { item: string }) {
    const rowColor = getRowColor? getRowColor(item) : "#fff";

    return (
      <TouchableOpacity onPress={() => handleRowPress()}>
        <View style={[styles.row, {backgroundColor: rowColor}]}>
          <Text style={styles.cell}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerBarText}>Patrimônios Encontrados</Text>
      </View>

      <FlatList
        style={styles.flatlist}
        data={data}
        renderItem={renderItem}
        keyExtractor={(row) => row}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#00ceff",
    borderRadius: 5,
    elevation: 2,
  },
  headerBarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  heading: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  flatlist: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 5,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#fff",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
});
