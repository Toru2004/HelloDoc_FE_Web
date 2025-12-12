export interface Specialty {
  _id: string;
  name: string;
  icon?: string;
  description?: string;
  doctors?: any[]; // Keeping any[] for now as Doctor entity isn't moved yet
}
