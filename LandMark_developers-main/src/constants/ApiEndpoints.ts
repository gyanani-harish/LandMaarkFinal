// src/constants/ApiConstants.ts




export const ApiEndPoints = {

    OPTIONS: 'api/options',
    AI_SEARCH: 'api/propSearch/ai',
    TOWNSHIPS: "api/townships",
    // TOWNSHIPS: 'api/township-list?type=compact',
    TOWNSHIP_PROPERTIES: (id: number) => `api/townships/${id}/popular-properties`,
    TOWNSHIP_PROPERTIES_FULL: (id: number) => `api/townships/${id}/properties`,
}
