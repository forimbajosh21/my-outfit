import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from "react-native";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  loading?: boolean;
  children: string;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  style,
  disabled = false,
  ...props
}) => {
  return (
    <Pressable
      disabled={disabled || loading}
      style={StyleSheet.flatten([styles.root, style])}
      {...props}
    >
      <Text style={styles.text}>{props.children}</Text>
      {loading && <ActivityIndicator color="#fff" />}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    columnGap: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
});
