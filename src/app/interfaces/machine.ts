export interface Machine {
    Id: number;
    Address: string;
    PostalCode: string;
    Location: string;
    Country: string;
    IsMobile: boolean;
}

export interface ChamberData {
    Id: number;
    Address: string;
    PostalCode: string;
    Location: string;
    EmptyChambers: number;
    OccupiedChambers: number;
    OccupiedPercentage: string | number;
    MobileMachines: number;
    VerticalMachines: number;
  }

export interface MachineFillStatusResponse {
    machines: ChamberData[]; // Assuming ChamberData is the correct type
  }