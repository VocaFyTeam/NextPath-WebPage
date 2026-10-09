
export function extractResources(response, collectionKey) {
    if (response.status !== 200) {
        console.error(`${response.status}, ${response.statusText}`);
        return [];
    }
    if (Array.isArray(response.data)) return response.data;
    return response.data?.[collectionKey] ?? [];
}
