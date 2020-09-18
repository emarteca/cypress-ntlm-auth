export interface NtlmConfig {
  ntlmHosts: string[];
  username: string;
  password: string;
  domain?: string;
  workstation?: string;
  ntlmVersion: number;
}
