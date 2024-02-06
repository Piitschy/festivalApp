<template>
    <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">Vergangene ausblenden</span>
            <input type="checkbox" class="toggle" v-model="skipPast" />
        </label>
    </div>
    <div v-show="!loading">
        <div v-if="eventDays.length > 0" class="pb-6" v-for="item in eventDays" :key="item.day" :item="item">
            <span class="text-sm font-light">{{ item.day }}</span>
            <EventListEntry v-for="event in item.events" :key="event.id" :item="event" />
        </div>
        <div v-else>
            <span class="text-sm font-light text-center">Keine Veranstaltungen verfügbar.</span>
        </div>
    </div>
    <div v-show="loading">
        <EventListEntrySkeleton v-for="i in 8" :key="i" />
    </div>
</template>

<script setup lang="ts">
const loading = ref(true)
const eventStore = useEventStore()
const skipPast = ref(true)

const eventDays = computed(() => eventStore.getDayList(skipPast.value))

onMounted(() => {
    eventStore.update()
    loading.value = false
})
</script>