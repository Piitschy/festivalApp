import PocketBase from 'pocketbase';

let pb: PocketBase | null = null;

export const usePocketBase = () => {
    const config = useRuntimeConfig();
    if (!pb) {
        pb = new PocketBase(config.public.pocketbaseUrl);
    }
    return pb;
}