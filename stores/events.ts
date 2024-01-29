import { defineStore } from 'pinia'
import { EventDay, EventRecord } from 'types'
import { usePocketBase } from "#imports"

export const useEventStore = defineStore('eventStore', {
    state: () => ({
        _events: [] as EventRecord[],
        lastUpdated: null as Date | null,
    }),
    getters: {
        getList: (state) => function(limit: number = -1, team:any = null): EventRecord[] {
            let events = state._events

            if (limit > -1) events = events.slice(0, limit)
            if (team)       events = events.filter((event) => event.team === team)

            return events
        },
        getById: (state) => function(id: string = ''): EventRecord | null {
            if (!id) return null
            return state._events.find((event) => event.id === id) || null
        },
        getUpcomingEvents(): EventRecord[] {
            return this._events.filter((event) => new Date(event.start) > new Date())
        },
        getByCategory: (state) => function(category: string = ''): EventRecord[]{
            return state._events.filter((event) => event.category === category)
        },
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
