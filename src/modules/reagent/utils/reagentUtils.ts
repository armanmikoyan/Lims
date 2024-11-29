import { ReagentList } from '../interfaces/reagentRepository.interface';

export function sortAsc(reagentList: ReagentList) {
  const reagentNames = reagentList.reagents.map((reagent) => reagent.name);
  return [...reagentNames].sort();
}

export function sortDesc(reagentList: ReagentList) {
  const reagentNames = reagentList.reagents.map((reagent) => reagent.name);
  return [...reagentNames].sort((a, b) => b.localeCompare(a));
}
