import {describe,it,expect} from 'vitest';
import {seed} from './data';
describe('connected demonstration data',()=>{
 it('links every source document to an existing product and supplier',()=>{for(const e of seed.evidence){expect(seed.products.some(p=>p.id===e.product)).toBe(true);expect(seed.suppliers.some(s=>s.id===e.supplier)).toBe(true);expect(e.notes.join(' ')).toContain('demonstration')}});
 it('provides the required product, supplier and lifecycle coverage',()=>{expect(seed.products.length).toBeGreaterThanOrEqual(12);expect(seed.suppliers.length).toBeGreaterThanOrEqual(6);expect(seed.events.length).toBeGreaterThanOrEqual(15);expect(seed.evidence.length).toBeGreaterThanOrEqual(8);expect(new Set(seed.users.map(u=>u.role)).size).toBe(5)});
 it('keeps identifiers unique and requests connected',()=>{for(const records of [seed.products,seed.evidence,seed.events,seed.users,seed.requests])expect(new Set(records.map(r=>r.id)).size).toBe(records.length);for(const r of seed.requests){expect(seed.products.some(p=>p.id===r.product)).toBe(true);expect(seed.suppliers.some(s=>s.id===r.supplier)).toBe(true)}});
});
