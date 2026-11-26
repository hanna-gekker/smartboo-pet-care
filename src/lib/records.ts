// What a record is called and drawn with, wherever it shows (History, Schedule → Happened, the record sheet).

import type { IconName } from '../components/Icon'
import type { RecordType } from '../data/types'

export const recordIcon: Record<RecordType, IconName> = {
  health: 'heart-pulse',
  meds: 'pill',
  vaccine: 'syringe',
  weight: 'weight',
  document: 'file-text',
  note: 'sparkle-ai',
}

/** The small accent line over a record's title in its sheet. */
export const recordKind: Record<RecordType, string> = {
  health: 'Health note',
  meds: 'Meds',
  vaccine: 'Vaccines',
  weight: 'Weight',
  document: 'Document',
  note: 'Note',
}
