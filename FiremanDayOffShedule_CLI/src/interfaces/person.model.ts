// export interface IPersonDetails {
//     id:number,
//     firstName:string,
//     lastName:string,
//     emailAdress: string,
//     phoneNumber:string,
//     grade: string,
//     role: string,
//     teamId:number,
//     specialityId: number,
//     dayoffstartId: number,
// }


// export interface IPersonDetails {
//     id: number;
//     firstName: string;
//     lastName: string;
//     emailAdress: string;  
//     phoneNumber: string;
//     grade: string;
//     role: string;
//     teamId: number;
//     specialityId: number;
//     dayOffStartId: number;
//     team: {
//         id: number;
//         name: string;
//         startDate: string;  // Date in string formaat (ISO-formaat)
//         persons: {
//             id: number;
//             values: Array<{
//                 ref: string;  // Dit verwijst naar de persoon binnen het team
//             }>
//         };
//         lastUpdate: string;
//     };
//     speciality: {
//         id: number;
//         name: string;
//         persons: {
//             id: number;
//             values: Array<{
//                 ref: string;  // Dit verwijst naar de persoon binnen de specialiteit
//             }>
//         };
//         lastUpdate: string;
//     };
//     dayOffStart: {
//         id: number;
//         dayOffBase: string;  // Aantal dagen wordt als string aangegeven
//         daySeniority: string;
//         takeoverDays: string;
//         year: string;
//         persons: {
//             id: number;
//             values: Array<{
//                 ref: string;  // Dit verwijst naar de persoon voor verlofstart
//             }>
//         };
//         lastUpdate: string;
//     };
//     dayOffs: null | Array<any>;  // Momenteel null, kan een array zijn in de toekomst
//     lastUpdate: string;
// }

export interface Person {
    $id: string;
    $values: Array<PersonDetails>;
}

export interface PersonDetails {
    $id: string;
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



