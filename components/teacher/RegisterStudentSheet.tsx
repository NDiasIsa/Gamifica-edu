import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { Glyph } from '@/components/ui/Glyph';
import { GradientButton } from '@/components/ui/GradientButton';
import { IconButton } from '@/components/ui/IconButton';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';
import { colors, fonts, withAlpha } from '@/constants/theme';
import { isValidEmail } from '@/lib/school';
import { useSchool } from '@/store/SchoolProvider';

export function RegisterStudentSheet({ onClose }: { onClose: () => void }) {
  const { managedClasses, currentClassId, registerStudent, nextEnrollment, roster, getClass } = useSchool();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [enrollment, setEnrollment] = useState(() => nextEnrollment());
  const [classId, setClassId] = useState(currentClassId);
  const [email, setEmail] = useState('');
  const [sendInvite, setSendInvite] = useState(true);
  const [classListOpen, setClassListOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedClass = getClass(classId);

  const errors = {
    name: name.trim().length < 3 ? 'Digite o nome completo do aluno.' : undefined,
    enrollment: !enrollment.trim()
      ? 'Informe a matrícula.'
      : roster.some((student) => student.enrollment === enrollment.trim())
        ? 'Já existe um aluno com essa matrícula.'
        : undefined,
    email:
      email.trim() && !isValidEmail(email)
        ? 'E-mail inválido.'
        : sendInvite && !email.trim()
          ? 'Informe o e-mail para enviar o convite.'
          : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const submit = () => {
    setSubmitted(true);
    if (hasErrors) return;
    const created = registerStudent({ name, enrollment, classId, guardianEmail: email });
    showToast(
      `${created.name.split(' ')[0]} entrou no ${selectedClass?.name}${sendInvite ? ' · convite enviado' : ''}`,
    );
    onClose();
  };

  const copyCode = async () => {
    if (!selectedClass) return;
    await Clipboard.setStringAsync(selectedClass.inviteCode);
    showToast(`Código ${selectedClass.inviteCode} copiado`);
  };

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="NOVO ALUNO" eyebrowColor={colors.brand.primaryLight} title="Cadastrar aluno" onClose={onClose} />

      <TextField
        label="NOME COMPLETO"
        value={name}
        onChangeText={setName}
        placeholder="Ex.: Rafaela Moura"
        autoCapitalize="words"
        error={submitted ? errors.name : undefined}
      />

      <View style={styles.row}>
        <View style={styles.flex}>
          <TextField
            label="MATRÍCULA"
            value={enrollment}
            onChangeText={setEnrollment}
            error={submitted ? errors.enrollment : undefined}
          />
        </View>
        <View style={styles.flex}>
          <Text style={styles.label}>TURMA</Text>
          <Pressable
            onPress={() => setClassListOpen((open) => !open)}
            accessibilityRole="button"
            accessibilityLabel={`Turma ${selectedClass?.name}. Trocar`}
            style={[styles.select, classListOpen && styles.selectOpen]}>
            <Text style={styles.selectText} numberOfLines={1}>
              {selectedClass?.name}
            </Text>
            <Glyph name="chevronDown" size={18} strokeWidth={3} color={colors.text.secondary} />
          </Pressable>
        </View>
      </View>

      {classListOpen && (
        <View style={styles.classChips}>
          {managedClasses.map((item) => {
            const active = item.id === classId;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setClassId(item.id);
                  setClassListOpen(false);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={[
                  styles.classChip,
                  active && { borderColor: item.color, backgroundColor: withAlpha(item.color, 0.16) },
                ]}>
                <Text style={[styles.classChipText, active && { color: colors.text.primary }]}>{item.name}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <TextField
        label="E-MAIL DO RESPONSÁVEL"
        icon="mail"
        value={email}
        onChangeText={setEmail}
        placeholder="nome@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={submitted ? errors.email : undefined}
      />

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Enviar convite de acesso por e-mail</Text>
        <Toggle value={sendInvite} onChange={setSendInvite} accessibilityLabel="Enviar convite de acesso por e-mail" />
      </View>

      <View style={styles.codeCard}>
        <View style={styles.flex}>
          <Text style={styles.codeLabel}>OU ENTRAR COM O CÓDIGO DA TURMA</Text>
          <Text style={styles.code}>{selectedClass?.inviteCode}</Text>
        </View>
        <IconButton icon="copy" accessibilityLabel="Copiar código da turma" onPress={copyCode} />
      </View>

      <GradientButton size="md" height={56} leadingIcon="plus" label="CADASTRAR ALUNO" onPress={submit} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    marginBottom: 6,
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  select: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 14,
    paddingRight: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  selectOpen: {
    borderColor: colors.brand.primary,
  },
  selectText: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.text.primary,
  },
  classChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  classChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  classChipText: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleText: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.text.primary,
  },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  codeLabel: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.72,
    color: colors.text.secondary,
  },
  code: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 1.3,
    color: colors.accent.xpGold,
  },
});
