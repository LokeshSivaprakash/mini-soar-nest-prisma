import { Injectable } from '@nestjs/common';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class SimService {
  constructor(private alerts: AlertsService) {}

  guarddutyPortScan() {
    return this.alerts.ingestAlert({
      source: 'aws-guardduty',
      title: 'Recon: EC2 port probe detected',
      rawPayload: {
        srcIp: '1.2.3.4',
        dstIp: '10.0.1.15',
        dstPort: 22,
        protocol: 'TCP',
        region: 'us-east-1',
        findingType: 'Recon:EC2/PortProbeUnprotectedPort',
      },
    } as any);
  }

  o365ImpossibleTravel() {
    return this.alerts.ingestAlert({
      source: 'microsoft-entra',
      title: 'Impossible travel sign-in detected',
      rawPayload: {
        user: 'employee@company.com',
        ip: '5.6.7.8',
        countryFrom: 'US',
        countryTo: 'RU',
        timeWindowMin: 15,
        mfaUsed: false,
      },
    } as any);
  }

  edrMalwareDetected() {
    return this.alerts.ingestAlert({
      source: 'crowdstrike-edr',
      title: 'Malware: Suspicious PowerShell + C2 beacon',
      rawPayload: {
        host: 'WIN-ACCT-07',
        user: 'employee@company.com',
        process: 'powershell.exe',
        commandLine: 'powershell -enc ...',
        c2Domain: 'bad-c2.example',
        hash: '44d88612fea8a8f36de82e1278abb02f',
      },
    } as any);
  }

  vpnBruteForce() {
    return this.alerts.ingestAlert({
      source: 'vpn-gateway',
      title: 'Brute force attempt on VPN portal',
      rawPayload: {
        srcIp: '9.9.9.9',
        username: 'admin',
        failedAttempts: 45,
        windowMin: 10,
      },
    } as any);
  }
}
