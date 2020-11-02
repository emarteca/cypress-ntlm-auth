const perf_hooks = require('perf_hooks'); 

import { injectable, inject } from "inversify";


import { PortsConfig } from "../models/ports.config.model";

import { IConfigController } from "./interfaces/i.config.controller";

import { IConfigServer } from "./interfaces/i.config.server";

import { IConfigStore } from "./interfaces/i.config.store";

import { IConnectionContextManager } from "./interfaces/i.connection.context.manager";

import { ICoreServer } from "./interfaces/i.core.server";

import { INtlmProxyServer } from "./interfaces/i.ntlm.proxy.server";

import { IUpstreamProxyManager } from "./interfaces/i.upstream.proxy.manager";

import { TYPES } from "./dependency.injection.types";

@injectable()

export 
class CoreServer implements ICoreServer {
  private _configServer: IConfigServer;
  private _ntlmProxyServer: INtlmProxyServer;
  private _upstreamProxyManager: IUpstreamProxyManager;
  private _configStore: IConfigStore;
  private _connectionContextManager: IConnectionContextManager;
  private _configController: IConfigController;

  constructor(
    @inject(TYPES.IConfigServer) configServer: IConfigServer,
    @inject(TYPES.INtlmProxyServer) ntlmProxyServer: INtlmProxyServer,
    @inject(TYPES.IUpstreamProxyManager)
    upstreamProxyManager: IUpstreamProxyManager,
    @inject(TYPES.IConfigStore) configStore: IConfigStore,
    @inject(TYPES.IConnectionContextManager)
    connectionContextManager: IConnectionContextManager,
    @inject(TYPES.IConfigController) configController: IConfigController
  ) 
{
    
this._configServer = configServer;
    
this._ntlmProxyServer = ntlmProxyServer;
    
this._upstreamProxyManager = upstreamProxyManager;
    
this._configStore = configStore;
    
this._connectionContextManager = connectionContextManager;
    
this._configController = configController;

    
this._configController.configApiEvent.addListener("reset", () =>
      this.ntlmConfigReset("reset")
    );
    
this._configController.configApiEvent.addListener(
      "quit",
      async () => await this.stop()
    );
  }

  async start(
    httpProxy?: string,
    httpsProxy?: string,
    noProxy?: string,
    configApiPort?: number,
    ntlmProxyPort?: number
  ): Promise<PortsConfig> 
{
    
var TEMP_VAR_AUTOGEN92__RANDOM =  this._configServer.start(configApiPort);

this._upstreamProxyManager.init(httpProxy, httpsProxy, noProxy);
    

var TEMP_VAR_AUTOGEN92__RANDOM_LATER =  TEMP_VAR_AUTOGEN92__RANDOM


    
let ntlmProxyUrl: string;
var TIMING_TEMP_VAR_AUTOGEN92__RANDOM_LATER = perf_hooks.performance.now();
 console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/src/proxy/core.server.ts& [55, 4; 55, 69]& TEMP_VAR_AUTOGEN92__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN92__RANDOM_LATER));
 let configApiUrl =  await TEMP_VAR_AUTOGEN92__RANDOM_LATER

    
try 
{
      
ntlmProxyUrl = await this._ntlmProxyServer.start(ntlmProxyPort);
    } 

catch (err) 
{
      

var TEMP_VAR_AUTOGEN111__RANDOM_LATER =  this._configServer.stop();

      
throw err;
var TIMING_TEMP_VAR_AUTOGEN111__RANDOM_LATER = perf_hooks.performance.now();
 console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/src/proxy/core.server.ts& [60, 6; 60, 38]& TEMP_VAR_AUTOGEN111__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN111__RANDOM_LATER));
 await TEMP_VAR_AUTOGEN111__RANDOM_LATER

    }
    
let ports: PortsConfig = {
      configApiUrl: configApiUrl,
      ntlmProxyUrl: ntlmProxyUrl,
    };
    
return ports;
  }

  async stop() 
{
    
var TEMP_VAR_AUTOGEN135__RANDOM =  this._configServer.stop();

this.ntlmConfigReset("stop");
    

var TIMING_TEMP_VAR_AUTOGEN135__RANDOM = perf_hooks.performance.now();
 await  TEMP_VAR_AUTOGEN135__RANDOM
console.log("/home/ellen/Documents/ASJProj/TESTING_reordering/cypress-ntlm-auth/src/proxy/core.server.ts& [72, 4; 72, 36]& TEMP_VAR_AUTOGEN135__RANDOM& " + (perf_hooks.performance.now() - TIMING_TEMP_VAR_AUTOGEN135__RANDOM));
  

    
this._ntlmProxyServer.stop();
    
this._upstreamProxyManager.reset();
  }

  private ntlmConfigReset(event: string) 
{
    
this._configStore.clear();
    
this._connectionContextManager.removeAllConnectionContexts(event);
    
this._connectionContextManager.removeAndCloseAllTunnels(event);
  }
}
