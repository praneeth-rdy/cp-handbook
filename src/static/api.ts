import { BASE_URL } from "./constants";

export const api = {
    az: {
        chaptersList: `${BASE_URL}/dataset/az-premium/chapters.json`,
        chapterOverview: `${BASE_URL}/dataset/az-premium/problem-sets/{chapter}/overview.json`,
        moduleOverview: `${BASE_URL}/dataset/az-premium/problem-sets/{chapter}/{module}/overview.json`,
        problemDetails: `${BASE_URL}/dataset/az-premium/problem-sets/{chapter}/{module}/{problem}.json`,
    }

}
