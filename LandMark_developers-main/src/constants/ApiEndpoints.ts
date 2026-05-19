// src/constants/ApiConstants.ts




export const ApiEndPoints = {
    OPTIONS: 'api/options',
    AI_SEARCH: 'api/propSearch/ai',
    TOWNSHIPS: "api/townships",
    HomePageData: 'api/homepage',
    // TOWNSHIPS: 'api/township-list?type=compact',
    TOWNSHIP_PROPERTIES: (id: number) => `api/townshipDetails?id=${id}`,
    TOWNSHIP_PROPERTIES_FULL: (id: number) => `api/townshipDetails?id=${id}`,
}
