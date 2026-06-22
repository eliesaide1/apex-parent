import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AP_Screen, AP_Card, AP_Text, AP_Icon, useI18n, colors } from '@apex/shared';

/** Record tiles — keys / icons / colors copied from apex-parent-app.html `recordTiles`. */
const tiles: Array<{ key: string; icon: string; val: string; color: string }> = [
  { key: 'attendance', icon: 'calendarCheck', val: '96%', color: '#2a9d8f' },
  { key: 'grades', icon: 'chart', val: 'A−', color: '#3f7cac' },
  { key: 'behavior', icon: 'star', val: '+4', color: '#e8a317' },
  { key: 'nurse', icon: 'activity', val: '2', color: '#e63946' },
  { key: 'detention', icon: 'clock', val: '0', color: '#67727e' },
  { key: 'timetable', icon: 'calendar', val: '', color: '#1f6f78' },
  { key: 'reportcards', icon: 'file', val: '', color: '#2a9d8f' },
  { key: 'documents', icon: 'folder', val: '5', color: '#3f7cac' },
];

export const RecordsScreen: React.FC = () => {
  const { t, L } = useI18n();
  return (
    <AP_Screen>
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <AP_Card key={tile.key} style={styles.tile}>
            <View style={[styles.ti, { backgroundColor: tile.color + '22' }]}>
              <AP_Icon name={tile.icon} size={22} color={tile.color} />
            </View>
            <AP_Text weight="700">{t(tile.key)}</AP_Text>
            {tile.val ? (
              <AP_Text variant="h2" color={tile.color}>
                {tile.val}
              </AP_Text>
            ) : (
              <AP_Text variant="caption" color={colors.muted}>
                {L({ en: 'View', ar: 'عرض' })}
              </AP_Text>
            )}
          </AP_Card>
        ))}
      </View>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  tile: { width: '47%', marginBottom: 0, gap: 6 },
  ti: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
});
