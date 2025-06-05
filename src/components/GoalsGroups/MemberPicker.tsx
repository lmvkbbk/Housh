import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";

export function MemberPicker({
    theme,
    memberNames,
    selectedMember,
    onChange,
}: {
    theme: any;
    memberNames: Record<string, string>;
    selectedMember: string;
    onChange: (val: string) => void;
}) {
    return (
        <View style={styles(theme).pickerWrapper}>
            <Ionicons
                name="person"
                size={22}
                color={theme.primary}
                style={{ paddingHorizontal: 8 }}
            />
            <Picker
                selectedValue={selectedMember}
                onValueChange={onChange}
                style={styles(theme).picker}
                dropdownIconColor={theme.primary}
                mode="dropdown"
            >
                <Picker.Item
                    label="Escolha um membro"
                    value="open"
                    enabled={false}
                    color={theme.textSecondary}
                    style={{
                        backgroundColor: theme.background,
                    }}
                />
                {Object.entries(memberNames).map(([uid, name]) => (
                    <Picker.Item
                        key={uid}
                        label={name}
                        value={uid}
                        color={theme.primary}
                        style={{
                            backgroundColor: theme.background,
                        }}
                    />
                ))}
                <Picker.Item
                    label="Meta aberta"
                    value="open"
                    color={theme.secondary}
                    style={{
                        backgroundColor: theme.background,
                    }}
                />
            </Picker>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        modalContent: {
            width: "100%",
            borderRadius: 20,
            padding: 24,
            backgroundColor: theme.modalBackground,
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textSecondary,
            alignSelf: "center",
            marginBottom: 18,
        },
        picker: {
            width: "85%",
            color: theme.textSecondary,
        },
        pickerWrapper: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.background,
            alignSelf: "center",
            width: "90%",
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 12,
            marginVertical: 8,
            overflow: "hidden",
            paddingHorizontal: 4,
            paddingVertical: 2,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: -8,
            gap: 10,
            width: "100%",
        },
    });
