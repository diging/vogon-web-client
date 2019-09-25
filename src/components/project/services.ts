import Vue from 'vue';
import { AxiosResponse } from 'axios';

import { Project } from './models';
import { PaginatedResult } from '@/models';

export const getProjects = (): Promise<Project[]> => {
    return Vue.$axios.get('/project')
        .then((response: AxiosResponse) => {
            const data: PaginatedResult<Project> = response.data as PaginatedResult<Project>;
            return data.results;
        });
};

export const getProjectDetails = (id: string): Promise<Project> => {
    return Vue.$axios.get(`/project/${id}`)
        .then((response: AxiosResponse) => response.data as Project);
};

export const createOrUpdateProject = (project: Project): Promise<Project> => {
    const request = project.id ?
        Vue.$axios.put(`/project/${project.id}`, {
            name: project.name,
            description: project.description,
            quadriga_id: project.quadriga_id,
            ownedBy: project.ownedBy,
        }) :
        Vue.$axios.post('/project', project);
    return request
        .then((response: AxiosResponse) => response.data as Project);
};
