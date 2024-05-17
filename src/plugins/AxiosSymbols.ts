import { InjectionKey } from "vue";
import { AxiosInstance } from "axios";
export const AxiosKey: InjectionKey<AxiosInstance> = Symbol("http");
