const perf_hooks = require('perf_hooks'); 

import { ICoreServer } from "./interfaces/i.core.server";

import { inject, injectable } from "inversify";

import { TYPES } from "./dependency.injection.types";

import { IDebugLogger } from "../util/interfaces/i.debug.logger";

import { IMain } from "./interfaces/i.main";

import { PortsConfig } from "../models/ports.config.model";

@injectable()

export 
class Main implements IMain {
  private _coreServer: ICoreServer;
  private _debug: IDebugLogger;

  constructor(
    @inject(TYPES.ICoreServer) coreServer: ICoreServer,
    @inject(TYPES.IDebugLogger) debug: IDebugLogger
  ) 
{
    
this._coreServer = coreServer;
    
this._debug = debug;
  }

  async run(
    httpProxy?: string,
    httpsProxy?: string,
    noProxy?: string,
    configApiPort?: number,
    ntlmProxyPort?: number
  ): Promise<PortsConfig> 
{
    
try 
{
      

var TIMING_TEMP_VAR_AUTOGEN4__RANDOM = perf_hooks.performance.now();
 var AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN4__RANDOM = await  this._coreServer.start(
        httpProxy,
        httpsProxy,
        noProxy,
        configApiPort,
        ntlmProxyPort
      );
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/src/proxy/main.ts& [28, 6; 34, 8]& TEMP_VAR_AUTOGEN4__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN4__RANDOM));
 let ports =  AWAIT_VAR_TIMING_TEMP_VAR_AUTOGEN4__RANDOM
      
this._debug.log("Startup done!");
      
this._debug.log(ports);
      
return ports;
    } 

catch (err) 
{
      
this._debug.log("Could not start ntlm-proxy");
      
throw err;
    }
  }

  async stop() 
{
    
await this._coreServer.stop();
  }
}
