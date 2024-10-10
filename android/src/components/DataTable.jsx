import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const data = [
    { tag: "TAG-001", patrimonio: "001", descricao: "Descrição do patrimônio 001" },
    { tag: "TAG-002", patrimonio: "002", descricao: "Descrição do patrimônio 002" },
    { tag: "TAG-003", patrimonio: "003", descricao: "Descrição do patrimônio 003" },
];

export function DataTable({ a }) {

    function renderItem({ item }) {
        return (
            <View style={styles.row}>
                <Text>{item.tag}</Text>
                <Text>{item.patrimonio}</Text>
                <Text>{item.descricao}</Text>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.headerBar}>
                <Text style={styles.headerBarText}>Patrimônios Encontrados</Text>
            </View>
            
            <View style={styles.header}>
                <Text style={styles.heading}>Tag</Text>
                <Text style={styles.heading}>Patrimônio</Text>
                <Text style={styles.heading}>Descrição</Text>
            </View>

            <FlatList 
                data={data}
                keyExtractor={(item) => item.tag.toString()}
                renderItem={renderItem}
            />
        </View>
            
    );

}

const styles = StyleSheet.create({
    headerBar: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
        elevation: 1,
    },
    cell: {
        flex: 1,
        fontSize: 14,
        textAlign: "center",
    },
});