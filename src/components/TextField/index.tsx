import { StyleSheet, TextInput, TextInputProps } from "react-native";

export interface TextFieldProps extends TextInputProps {}

const TextField: React.FC<TextFieldProps> = ({ style, ...props }) => {
  return (
    <TextInput style={StyleSheet.flatten([styles.root, style])} {...props} />
  );
};

export default TextField;

const styles = StyleSheet.create({
  root: {
    // color: "#000",
    // paddingHorizontal: 4,
    // paddingVertical: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#888",
  },
});
