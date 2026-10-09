import {z} from 'zod';
export const emailSchema=z.object({subject:z.string(),body:z.string()});
export const meetingSchema=z.object({summary:z.string(),discussion:z.string(),decisions:z.string(),actions:z.string(),responsibilities:z.string(),deadlines:z.string(),questions:z.string()});
export const planSchema=z.object({objective:z.string(),tasks:z.array(z.object({name:z.string(),description:z.string(),priority:z.string(),duration:z.string(),deadline:z.string()})),obstacles:z.string(),nextAction:z.string()});
export type PlanOutput=z.infer<typeof planSchema>;
export type PlanTask=PlanOutput['tasks'][number]&{completed:boolean};
export function completionPercent(tasks:{completed:boolean}[]){return tasks.length?Math.round(tasks.filter(t=>t.completed).length/tasks.length*100):0;}
