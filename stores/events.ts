import { defineStore } from 'pinia'
import { EventRecord } from 'types'

export const useEventStore = defineStore('eventStore', {
    state: () => ({
        _pb: usePocketBase(),
        _events: [] as EventRecord[],
        lastUpdated: null as Date | null,
    }),
    getters: {
        getList(limit: number = -1, team:any = null): EventRecord[] {
            let events = this._events
            if (limit > -1) {
                events = events.slice(0, limit)
            }if (team) {
                events = events.filter((event) => event.team === team)
            }
            return events
        },
        getById(id: string = ''): EventRecord | null {
            if (!id) return null
            return this._events.find((event) => event.id === id) || null
        },
        getUpcomingEvents(): EventRecord[] {
            return this._events.filter((event) => new Date(event.start) > new Date())
        },
        getByCategory(category: string = ''): EventRecord[] {
            return this._events.filter((event) => event.category === category)
        },
        getDayList(skipPast:boolean = false): EventRecord[] {
            const events = this._events
            let days = [] as { day: string, events: EventRecord[] }[]
            let currentDay = ''
            let currentDayEvents:Event[] = []
            for (const event of events) {
                const day = new Date(event.start).toLocaleDateString('de-DE', { weekday: 'long' })
                if (currentDay !== day) {
                    if (currentDay) {
                        days.push({
                            day: currentDay,
                            events: currentDayEvents
                        })
                    }
                    currentDay = day
                    currentDayEvents = []
                }
                if (skipPast && new Date(event.start) < new Date()) {
                    continue
                }
                currentDayEvents.push(event)
            }
            if (currentDay) {
                days.push({
                    day: currentDay,
                    events: currentDayEvents
                })
            }
            return days
        }
    },
    actions: {
        async update() {
            const response = await pb.collection('events').getFullList<Event>({
                expand: "location,category",
                sort: "start"
            });
            this.lastUpdated = new Date()
            this._events = response
        }
    },

})
