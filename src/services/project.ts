import axios, { AxiosResponse } from 'axios';

import { Project, Text, PaginatedResult } from '@/models';
import { VOGON_BACKEND } from '@/constants';

export const getProjects = async (): Promise<Project[]> => {
    try {
        const response: AxiosResponse = await axios.get(`${VOGON_BACKEND}/project`);
        const data: PaginatedResult<Project> = response.data as PaginatedResult<Project>;
        const results: Project[] = data.results;
        return results;
    } catch (e) {
        throw e;
    }
};

export const getProjectDetails = async (id: string): Promise<Project> => {
    try {
        const response: AxiosResponse = await axios.get(`${VOGON_BACKEND}/project/${id}`);
        const data: Project = response.data as Project;
        return data;
    } catch (e) {
        throw e;
    }
};

export const createProject = async (project: Project): Promise<Project> => {
    try {
        const response: AxiosResponse = await axios
            .post(`${VOGON_BACKEND}/project`, project);
        const data: Project = response.data as Project;
        return data;
    } catch (e) {
        throw e;
    }
};
