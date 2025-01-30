import type { InjectionKey } from 'vue';
import type { AxiosInstance } from 'axios';
export const AxiosKey: InjectionKey<AxiosInstance> = Symbol('http');
