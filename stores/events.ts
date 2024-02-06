import { defineStore } from 'pinia'
import { EventDay, EventRecord } from 'types'

export const useEventStore = defineStore('eventStore', {
    state: () => ({
        _events: [] as EventRecord[],
        lastUpdated: null as Date | null,
    }),
    getters: {
        events: (state) => state._events,
        getList: (state) => (limit: number = -1, offset: number = 0, team:any = null): EventRecord[] => {
            let events = [...state._events]

            if (limit > -1) events = events.slice(offset, limit)
            if (team)       events = events.filter((event) => event.team === team)

            return events
        },

        getById:            (state) => (id: string = '') => id ? state._events.find((event) => event.id === id) || null : null,
        getUpcomingEvents:  (state) => state._events.filter((event) => new Date(event.start) > new Date()),
        getByCategory:      (state) => (category: string = '') => state._events.filter((event) => event.category === category),
        
        getDayList: (state) => {
            //takes the list of events and groups them by day
            const groupedEvents = state._events.reduce((acc, event) => {
                const day = new Date(event.start).toLocaleDateString('de-DE', { weekday: 'long' });
                if (!acc[day]) {
                    acc[day] = [];
                }
                acc[day].push(event);
                return acc;
            }, {} as {[key: string]: EventRecord[]});
            
            const eventDays: EventDay[] = Object.keys(groupedEvents).map(day => ({
                day: day,
                events: groupedEvents[day]
            }));
            return (skipPast: boolean = true): EventDay[] => skipPast ? eventDays.filter((day) => new Date(day.events[0].start) > new Date()) : eventDays
        }
    },
    actions: {
        async update() {
            const pb = usePocketBase()
            const response = await pb.collection('events').getFullList<EventRecord>({
                expand: "location,category",
                sort: "start"
            });
            this.lastUpdated = new Date()
            this._events = response
        },
    },

})
