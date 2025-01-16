export interface Person {
    $id: string;
    $values: Array<PersonDetails>;
}

export interface PersonDetails {
    $id: string;
    auth0Id: string; 
    firstName: string;
    lastName: string;
    emailAdress: string;
    phoneNumber: string;
    gradeName: string;
    roleName: string;
    teamName: string;
    specialityName: string;
    teamId:number;
    roleId:number;
    gradeId:number;
    specialityId: number;
    Password: string ;
    dayOffStartDayOffBase: number;
    team: {
        $id: string;
        name: string;
        startDate: string;  // Date in ISO format
        persons: {
            $id: string;
            $values: Array<{
                $ref: string;  // Reference to the person within the team
            }>;
        };
        id: number;
        lastUpdate: string;  // Date in ISO format
    };
    grade: {
        $id: string;
        name: string;
        persons: {
            $id: string;
            $values: Array<{
                $ref: string;  // Reference to the person within the role
            }>;
        };
        id: number;
        lastUpdate: string;  // Date in ISO format
    };
    role: {
        $id: string;
        name: string;
        persons: {
            $id: string;
            $values: Array<{
                $ref: string;  // Reference to the person within the team
            }>;
        };
        id: number;
        lastUpdate: string;  // Date in ISO format
    };
    speciality: {
        $id: string;
        name: string;
        persons: {
            $id: string;
            $values: Array<{
                $ref: string;  // Reference to the person within the speciality
            }>;
        };
        id: number;
        lastUpdate: string;  // Date in ISO format
    };
    dayOffStart: {
        $id: string;
        dayOffBase: string;  // Base number of days in string format
        daySeniority: string;
        takeoverDays: string;
        year: string;  // Date in ISO format
        persons: {
            $id: string;
            $values: Array<{
                $ref: string;  // Reference to the person for day off start
            }>;
        };
        id: number;
        lastUpdate: string;  // Date in ISO format
    };
    dayOffs: null | Array<any>;  // Currently null, but can be an array in the future
    id: number;
    lastUpdate: string;  // Date in ISO format
    
}

export interface DayOffResponse {
    $id: string;
    $values: PersonDayOffDTO[];
  }
  
  export interface PersonDayOffDTO {
    dayOffDate: string;
  }

  export interface PersonWithDayOffDTO {
    id: number;
    name: string;
    specialityName: string;
    dayOffBase: number;
    dayOffCount: number;
    dayOffs: string[]; // Eenvoudige array van strings
  }

