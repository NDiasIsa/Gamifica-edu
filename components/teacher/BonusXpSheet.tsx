import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SubjectPicker } from '@/components/ui/SubjectPicker';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { colors } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { useSchool } from '@/store/SchoolProvider';
import type { RosterStudent, SubjectId } from '@/types/game';

const AMOUNTS = [25, 50, 100, 200] as const;

export function BonusXpSheet({ student, onClose }: { student: RosterStudent; onClose: () => void }) {
  const { giveBonusXp } = useSchool();
  const { showToast } = useToast();
  const [subjectId, setSubjectId] = useState<SubjectId>('matematica');
  const [amount, setAmount] = useState<(typeof AMOUNTS)[number]>(50);
  const [reason, setReason] = useState('');

  const firstName = student.name.split(' ')[0];

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="RECOMPENSA" eyebrowColor={colors.accent.xpGold} title={`XP bônus para ${firstName}`} onClose={onClose} />

      <View style={styles.section}>
        <SectionLabel label="MATÉRIA" />
        <SubjectPicker selected={[subjectId]} onToggle={setSubjectId} />
      </View>

      <View style={styles.section}>
        <SectionLabel label="QUANTIDADE" hint="Soma no nível da matéria" />
        <SegmentedControl
          variant="base"
          height={40}
          font="display"
          fontSize={17}
          value={amount}
          onChange={setAmount}
          activeColor={colors.accent.xpGold}
          activeDepthColor={colors.depth.gold}
          activeTextColor={colors.bg.base}
          options={AMOUNTS.map((value) => ({ value, label: `+${value}` }))}
        />
      </View>

      <TextField
        label="MOTIVO (OPCIONAL)"
        value={reason}
        onChangeText={setReason}
        placeholder="Ex.: ajudou os colegas na aula"
        maxLength={120}
      />

      <ChunkyButton
        icon="bolt"
        label={`DAR +${amount} XP`}
        color={colors.accent.xpGold}
        depthColor={colors.depth.gold}
        textColor={colors.bg.base}
        onPress={() => {
          giveBonusXp(student.id, subjectId, amount, reason);
          showToast(`+${amount} XP de ${subjects[subjectId].name} para ${firstName}`);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
});
