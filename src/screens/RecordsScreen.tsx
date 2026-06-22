import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AP_Screen, AP_Card, AP_Text, useI18n, colors } from '@apex/shared';

const tiles: Array<{ key: string; val: string; color: string }> = [
  { key: 'attendance', val: '96%', color: colors.ok },
  { key: 'grades', val: 'A−', color: colors.low },
  { key: 'behavior', val: '+4', color: colors.med },
  { key: 'nurse', val: '2', color: colors.high },
  { key: 'detention', val: '0', color: colors.muted },
  { key: 'documents', val: '5', color: colors.low },
];

export const RecordsScreen: React.FC = () => {
  const { t } = useI18n();
  return (
    <AP_Screen>
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <AP_Card key={tile.key} style={styles.tile}>
            <AP_Text weight="700">{t(tile.key)}</AP_Text>
            <AP_Text variant="h2" color={tile.color}>
              {tile.val}
            </AP_Text>
          </AP_Card>
        ))}
      </View>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  tile: { width: '47%', marginBottom: 0 },
});
