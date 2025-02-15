import axios from "axios";
import { api } from "@/static/api";

export const getProblemDetails = async (chapter: string, module: string, problem: string) => {
    const response = await axios.get(api.az.problemDetails.replace('{chapter}', chapter).replace('{module}', module).replace('{problem}', problem));
    return response.data;
}

export const getChapterOverview = async (chapter: string) => {
    const response = await axios.get(api.az.chapterOverview.replace('{chapter}', chapter));
    return response.data;
}

export const getModuleOverview = async (chapter: string, module: string) => {
    const response = await axios.get(api.az.moduleOverview.replace('{chapter}', chapter).replace('{module}', module));
    return response.data;
}

export const getChaptersList = async () => {
    const response = await axios.get(api.az.chaptersList);
    return response.data;
}