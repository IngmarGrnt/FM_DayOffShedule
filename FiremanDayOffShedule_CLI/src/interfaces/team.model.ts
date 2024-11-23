
// Definieer de structuur van een Team
export interface Team {
    id: number;
    name: string;
    startDate: string; // Dit is een string omdat datums in JSON meestal als strings worden verstuurd
  }
  
  export interface Shift {
    date: string;
    shiftType: string;
  }
  
  export interface WorkDays {
    shifts: {
      $id: string;
      $values: Shift[];
    };
  }
  
  export interface TransformedWorkDays {
    shifts: Shift[];
  }