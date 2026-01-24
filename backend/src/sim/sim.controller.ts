import { Controller, Post } from '@nestjs/common';
import { SimService } from './sim.service';

@Controller('sim')
export class SimController {
  constructor(private sim: SimService) {}

  @Post('guardduty/portscan')
  guarddutyPortScan() {
    return this.sim.guarddutyPortScan();
  }

  @Post('o365/impossible-travel')
  o365ImpossibleTravel() {
    return this.sim.o365ImpossibleTravel();
  }

  @Post('edr/malware')
  edrMalware() {
    return this.sim.edrMalwareDetected();
  }

  @Post('vpn/bruteforce')
  vpnBruteforce() {
    return this.sim.vpnBruteForce();
  }
}
