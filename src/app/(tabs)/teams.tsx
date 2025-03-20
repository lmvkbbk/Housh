import { Header } from '@/components/header'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import { colors } from '../styles/colors'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import GpCodeModal from '@/components/groupCode';
import AddGroupModal from '@/components/createGroup';


export default function Teams(){
    const [addGroupModal, setAddGroupModal] = useState(false);
    const [enterGroupModal, setEnterGroupModal] = useState(false);
    const [groups, setGroups] = useState<string[]>([]);
    const navigation = useNavigation();


    return(
        <View style={{flex: 1, width:'100%'}}>
            <Header title='Teams'/>
            <View style={{width: "100%", justifyContent:"flex-start"}}>
                <Text style={styles.title}>Grupos</Text>
            </View>

            <ScrollView contentContainerStyle={styles.groupContainer}>
                {groups.map((group, index) => (
                    <TouchableOpacity 
                    key={index} style={styles.groupItem}
                    onPress= {() => navigation.navigate('groupDetail', {groupName: group})}
                    >
                        <Text style={styles.groupText}>{group}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>


            <View style={styles.fabContainer}>
                <TouchableOpacity style={styles.fab} onPress={() => setAddGroupModal(true)}>
                    <Ionicons name="add" size={24} color={colors.black} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.fab} onPress={() => setEnterGroupModal(true)}>
                    <Ionicons name="key-outline" size={24} color={colors.black} />
                </TouchableOpacity>
            </View>

            <GpCodeModal
                visible={enterGroupModal}
                onConfirm={(code) => setEnterGroupModal(false)}
                onCancel={() => setEnterGroupModal(false)}
            />
            <AddGroupModal
                visible={addGroupModal}
                onConfirm={(name) => {
                    if (name.trim()) {
                        setGroups([...groups, name]); // Adiciona o grupo na lista
                    }
                    setAddGroupModal(false);
                }}
                onCancel={() => setAddGroupModal(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.white,
        bottom: 16,
        right: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    fabContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.white,
        marginTop:30,
        paddingLeft: 15
    },
    groupContainer: {
        marginTop: 20,
        width:'100%',
        paddingBottom: 80,
        alignItems: 'center',
    },
    groupItem: {
        width: '95%',
        height: 60,
        backgroundColor: colors.white,
        justifyContent: 'center',
        paddingLeft: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    groupText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
    }
})