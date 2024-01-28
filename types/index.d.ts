import { RecordModel } from 'pocketbase';

export type EventRecord = RecordModel & {
  name: string;
  category: Category
  location: Location
  start: Date
  end: Date
  description: string
  homepage_ignore: boolean
  team: Team
}

export type CategoryRecord = RecordModel & {}

export type LocationRecord = RecordModel & {}

export type TeamRecord = RecordModel & {}