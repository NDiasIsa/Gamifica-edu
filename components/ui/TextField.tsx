import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, fonts } from '@/constants/theme';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  icon?: GlyphName;
  iconColor?: string;
  /** Mensagem de erro exibida abaixo do campo. */
  error?: string;
  /** Altura mínima do campo multilinha. */
  minHeight?: number;
};

/** Campo de texto no estilo dos designs (fundo surface, borda roxa quando em foco). */
export function TextField({
  label,
  icon,
  iconColor = colors.text.secondary,
  error,
  multiline,
  minHeight = 88,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.box,
          multiline && { minHeight, alignItems: 'flex-start', paddingVertical: 12 },
          focused && styles.boxFocused,
          !!error && styles.boxError,
        ]}>
        {icon && <Glyph name={icon} size={18} color={iconColor} style={multiline ? styles.iconTop : undefined} />}
        <TextInput
          {...inputProps}
          multiline={multiline}
          placeholderTextColor={colors.text.secondary}
          selectionColor={colors.brand.primaryLight}
          style={[styles.input, multiline && styles.inputMultiline]}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  box: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  boxFocused: {
    borderColor: colors.brand.primary,
  },
  boxError: {
    borderColor: colors.accent.hpPink,
  },
  iconTop: {
    marginTop: 1,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.text.primary,
    // Remove o contorno azul de foco do navegador; a borda roxa da caixa já indica o foco.
    outlineWidth: 0,
  },
  inputMultiline: {
    paddingVertical: 0,
    lineHeight: 21,
    textAlignVertical: 'top',
  },
  error: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.accent.hpPink,
  },
});
