import {describe,it,expect} from 'vitest';
import {completionPercent} from '@/lib/ai/schemas';
import {toolInstructions} from '@/lib/ai/prompts.server';
import {services,siteConfig} from '@/lib/site-config';
describe('Workspace business rules',()=>{
 it('calculates progress from actual completed tasks',()=>{expect(completionPercent([{completed:true},{completed:false},{completed:false},{completed:true}])).toBe(50);});
 it('shows zero progress when there are no tasks',()=>{expect(completionPercent([])).toBe(0);});
 it('does not invent meeting decisions deadlines attendees or responsibilities',()=>{expect(toolInstructions('meeting')).toContain('Never invent decisions, deadlines, attendees or assigned responsibilities');expect(toolInstructions('meeting')).toContain('Not specified');});
 it('does not guarantee task outcomes',()=>{expect(toolInstructions('plan')).toContain('Never guarantee deadlines or outcomes');});
 it('does not advertise fixed prices',()=>{expect(services.some(s=>'price' in s)).toBe(false);});
 it('does not invent contact details',()=>{expect(siteConfig.email).toBe('');expect(siteConfig.phone).toBe('');});
});
