// @type/specialty.d.ts
// Specialty-related type definitions

/**
 * Medical specialty entity
 */
type Specialty = {
  _id: string;
  name: string;
  icon?: string;
  description?: string;
  doctors?: Doctor[] | any[];
}
